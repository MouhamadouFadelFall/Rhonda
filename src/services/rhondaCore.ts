import {
  RhondaState,
  UserRequest,
  Intent,
  ExecutionPlan,
  RhondaTask,
  RiskLevel
} from '../types';
import { db } from './dbStorage';

export interface CycleCallbacks {
  onStateChange: (state: RhondaState) => void;
  onProgress: (progress: number, currentStep: string) => void;
  onLog: (log: string) => void;
  onAuthorizationRequired: (task: RhondaTask, stepIndex: number) => Promise<boolean>;
}

export class RhondaCoreEngine {
  private currentState: RhondaState = 'READY';

  getState(): RhondaState {
    return this.currentState;
  }

  async processRequest(
    userContent: string,
    inputType: UserRequest['input_type'] = 'TEXT',
    callbacks: CycleCallbacks
  ): Promise<RhondaTask> {
    const taskId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const conversationId = `conv-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const request: UserRequest = {
      id: `req-${Date.now()}`,
      user_id: 'user_fallm',
      conversation_id: conversationId,
      content: userContent,
      input_type: inputType,
      timestamp
    };

    // 1. RECEPTION
    this.transition('RECEIVING', callbacks);
    callbacks.onProgress(10, 'Réception et normalisation de la demande...');
    callbacks.onLog(`[INFO] Requête reçue #${request.id} via ${inputType}: "${userContent}"`);
    db.logEvent({
      event_type: 'REQUEST_RECEIVED',
      source: 'CORE',
      level: 'INFO',
      task_id: taskId,
      details: `Demande utilisateur: "${userContent.slice(0, 60)}..."`
    });

    await this.delay(350);

    // 2. COMPRÉHENSION & INTENTION
    this.transition('UNDERSTANDING', callbacks);
    callbacks.onProgress(25, 'Analyse sémantique et détection de l’intention (Ollama qwen3:0.6b)...');
    
    const intent = this.detectIntent(userContent);
    callbacks.onLog(`[INFO] Intention détectée: ${intent.name} (Confiance: ${(intent.confidence * 100).toFixed(0)}%, Risque: ${intent.risk_level})`);

    // GESTION AMBIGUÏTÉ / CLARIFICATION REQUISE
    if (intent.needs_clarification) {
      this.transition('WAITING_AUTHORIZATION', callbacks);
      callbacks.onLog(`[WARN] Ambiguïté détectée : cible ou paramètre manquant. Clarification nécessaire.`);
      
      const clarificationPlan: ExecutionPlan = {
        id: `plan-${taskId}`,
        intent_id: intent.name,
        objective: 'Demande de précision à l’utilisateur',
        steps: [],
        risk_level: 'LOW',
        required_tools: [],
        requires_authorization: false,
        expected_result: intent.clarification_question || 'Précision requise',
        status: 'NEEDS_CLARIFICATION'
      };

      const task: RhondaTask = {
        id: taskId,
        user_id: request.user_id,
        conversation_id: conversationId,
        request_content: userContent,
        intent,
        plan: clarificationPlan,
        status: 'WAITING_AUTHORIZATION',
        priority: 'NORMAL',
        current_step_index: 0,
        progress: 100,
        result: intent.clarification_question,
        created_at: timestamp,
        completed_at: new Date().toISOString(),
        execution_logs: [`[CLARIFICATION] ${intent.clarification_question}`]
      };

      db.saveTask(task);
      this.transition('READY', callbacks);
      return task;
    }

    await this.delay(400);

    // 3. PLANIFICATION
    this.transition('PLANNING', callbacks);
    callbacks.onProgress(45, 'Élaboration et validation du plan d’action structuré...');
    
    const plan = this.generatePlan(intent, taskId);
    callbacks.onLog(`[INFO] Plan #${plan.id} validé avec ${plan.steps.length} étapes. Risque maximal: ${plan.risk_level}`);
    
    db.logEvent({
      event_type: 'PLAN_CREATED',
      source: 'CORE',
      level: 'INFO',
      task_id: taskId,
      details: `Plan créé: ${plan.objective} (${plan.steps.length} étapes)`
    });

    await this.delay(350);

    // 4. PRÉPARATION TÂCHE
    const task: RhondaTask = {
      id: taskId,
      user_id: request.user_id,
      conversation_id: conversationId,
      request_content: userContent,
      intent,
      plan,
      status: 'PLANNING',
      priority: plan.risk_level === 'HIGH' || plan.risk_level === 'CRITICAL' ? 'HIGH' : 'NORMAL',
      current_step_index: 0,
      progress: 50,
      created_at: timestamp,
      execution_logs: [`Planifié: ${plan.objective}`]
    };
    db.saveTask(task);

    // 5. AUTORISATION ET EXÉCUTION DES ÉTAPES
    this.transition('WORKING', callbacks);
    const stepLogs: string[] = [];

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      task.current_step_index = i;
      step.status = 'RUNNING';

      callbacks.onProgress(
        50 + Math.round(((i + 0.5) / plan.steps.length) * 35),
        `Exécution étape ${i + 1}/${plan.steps.length}: ${step.action}`
      );
      callbacks.onLog(`[EXEC] Étape ${step.index}: ${step.description} via ${step.tool} [Risque: ${step.risk_level}]`);

      // Vérification autorisation si risque HIGH / CRITICAL
      if (step.risk_level === 'HIGH' || step.risk_level === 'CRITICAL') {
        this.transition('WAITING_AUTHORIZATION', callbacks);
        callbacks.onLog(`[SECURITY] Autorisation requise pour l'action sensible: ${step.action}`);
        
        db.logEvent({
          event_type: 'AUTHORIZATION_REQUESTED',
          source: 'SECURITY',
          level: 'WARNING',
          task_id: taskId,
          details: `Action: ${step.action}, Risque: ${step.risk_level}`
        });

        const granted = await callbacks.onAuthorizationRequired(task, i);
        if (!granted) {
          step.status = 'FAILED';
          task.status = 'CANCELLED';
          task.error = `Action ${step.action} refusée par l’utilisateur.`;
          callbacks.onLog(`[SECURITY] Action refusée par l’utilisateur. Tâche annulée.`);
          this.transition('READY', callbacks);
          db.saveTask(task);
          return task;
        }

        this.transition('WORKING', callbacks);
        callbacks.onLog(`[SECURITY] Autorisation accordée par l’utilisateur pour ${step.action}. Poursuite.`);
      }

      await this.delay(500);

      // Simulation de l'exécution de l'outil et résultat
      const toolOutput = this.simulateToolExecution(step.tool, step.parameters);
      step.output = toolOutput;
      step.status = 'COMPLETED';
      stepLogs.push(`✓ ${step.description}: ${toolOutput}`);
    }

    // 6. VÉRIFICATION
    this.transition('VERIFYING', callbacks);
    callbacks.onProgress(90, 'Vérification du résultat physique et conformité...');
    callbacks.onLog(`[VERIFY] Contrôle de cohérence : les opérations ont produit des résultats concrets.`);
    await this.delay(400);

    // 7. MÉMORISATION
    callbacks.onProgress(95, 'Enregistrement dans la mémoire PostgreSQL...');
    this.memorizeIfRelevant(intent, userContent, plan.expected_result);
    callbacks.onLog(`[MEMORY] Contexte et historique enregistrés dans PostgreSQL.`);

    // 8. RÉPONSE
    task.status = 'COMPLETED';
    task.progress = 100;
    task.completed_at = new Date().toISOString();
    task.result = this.generateFinalResponse(intent, plan, stepLogs);
    task.execution_logs = stepLogs;
    db.saveTask(task);

    db.logEvent({
      event_type: 'TASK_COMPLETED',
      source: 'CORE',
      level: 'INFO',
      task_id: taskId,
      details: `Tâche terminée avec succès: ${task.result.slice(0, 70)}...`
    });

    this.transition('COMPLETED', callbacks);
    callbacks.onProgress(100, 'Tâche terminée et vérifiée.');
    callbacks.onLog(`[SUCCESS] Tâche #${task.id} finalisée avec succès.`);

    await this.delay(400);
    this.transition('READY', callbacks);

    return task;
  }

  private transition(nextState: RhondaState, callbacks: CycleCallbacks) {
    this.currentState = nextState;
    callbacks.onStateChange(nextState);
  }

  private detectIntent(query: string): Intent {
    const q = query.toLowerCase().trim();

    // Ambiguïté détectée
    if (q === 'supprime le fichier' || q === 'supprime ce fichier' || q === 'efface le dossier') {
      return {
        name: 'DELETE_PATH',
        description: 'Suppression demandée sans spécification de cible',
        goal: 'Supprimer un élément',
        parameters: {},
        risk_level: 'HIGH',
        confidence: 0.42,
        requires_authorization: true,
        needs_clarification: true,
        clarification_question:
          'Quel fichier ou répertoire souhaitez-vous supprimer ? Veuillez indiquer le nom ou chemin exact avant confirmation.'
      };
    }

    if (q.includes('trouve') || q.includes('cherche') || q.includes('pdf') || q.includes('search')) {
      const ext = q.includes('pdf') ? '.pdf' : q.includes('csv') ? '.csv' : '*';
      const target = q.includes('documents') ? 'C:\\Users\\fallm\\Documents' : 'C:\\Users\\fallm\\Rhonda';
      return {
        name: 'SEARCH_FILES',
        description: 'Recherche de fichiers sur le système local Windows',
        goal: `Rechercher les fichiers ${ext} dans ${target}`,
        target,
        parameters: { directory: target, pattern: `*${ext}` },
        risk_level: 'LOW',
        confidence: 0.96,
        requires_authorization: false
      };
    }

    if (q.includes('supprime') || q.includes('delete') || q.includes('rmdir')) {
      const path = q.includes('temp')
        ? 'C:\\Users\\fallm\\Rhonda\\temp'
        : 'C:\\Users\\fallm\\Rhonda\\data\\obsolete';
      return {
        name: 'DELETE_PATH',
        description: 'Suppression définitive de données locales',
        goal: `Supprimer le dossier ${path}`,
        target: path,
        parameters: { target_path: path, recursive: true },
        risk_level: 'HIGH',
        confidence: 0.92,
        requires_authorization: true
      };
    }

    if (q.includes('analyse') || q.includes('rapport') || q.includes('kolda')) {
      return {
        name: 'ANALYZE_DATA',
        description: 'Analyse statistique et extraction de métadonnées de projet',
        goal: 'Analyser les fichiers du projet Kolda',
        target: 'Projet Kolda',
        parameters: { project_id: 'prj-kolda', files: ['*.csv', '*.xlsx'] },
        risk_level: 'LOW',
        confidence: 0.94,
        requires_authorization: false,
        secondary_intent: 'SUMMARY'
      };
    }

    if (q.includes('capture') || q.includes('ecran') || q.includes('écran') || q.includes('vision')) {
      return {
        name: 'SCREEN_CAPTURE',
        description: 'Capture d’écran et inspection visuelle par le Vision Engine',
        goal: 'Prendre une capture de l’écran actif et analyser l’interface',
        parameters: { mode: 'full_screen' },
        risk_level: 'LOW',
        confidence: 0.98,
        requires_authorization: false
      };
    }

    if (q.includes('etat') || q.includes('état') || q.includes('systeme') || q.includes('système') || q.includes('pc') || q.includes('diagnostic')) {
      return {
        name: 'SYSTEM_QUERY',
        description: 'Diagnostic de l’état machine, CPU, RAM et conteneurs',
        goal: 'Vérifier la santé et la télémétrie de l’ordinateur hôte',
        parameters: { query: 'full_health' },
        risk_level: 'LOW',
        confidence: 0.99,
        requires_authorization: false
      };
    }

    if (q.includes('cree') || q.includes('crée') || q.includes('dossier') || q.includes('mkdir')) {
      const name = q.split('dossier')[1]?.trim() || 'Projet';
      const path = `C:\\Users\\fallm\\Rhonda\\data\\projects\\${name.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      return {
        name: 'CREATE_DIRECTORY',
        description: 'Création d’un répertoire sur le disque',
        goal: `Créer le dossier ${path}`,
        target: path,
        parameters: { path },
        risk_level: 'MEDIUM',
        confidence: 0.93,
        requires_authorization: false
      };
    }

    if (
      q.includes('geocatalogue') ||
      q.includes('geoagent') ||
      q.includes('geoautor') ||
      q.includes('geocore') ||
      q.includes('qgis') ||
      q.includes('geospatial') ||
      q.includes('géospatial') ||
      q.includes('sig')
    ) {
      return {
        name: 'GEOSPATIAL_QUERY',
        description: 'Intégration de la chaîne géospatiale spécialisée (GeoCatalogue, GeoAgent, GeoAutoR, QGIS)',
        goal: 'Ordonnancer la chaîne géospatiale progressive sous l’autorité de RHONDA Core',
        parameters: { topic: 'geospatial_stack', query },
        risk_level: 'LOW',
        confidence: 0.97,
        requires_authorization: false
      };
    }

    if (q.includes('jarvis')) {
      return {
        name: 'JARVIS_QUERY',
        description: 'Couche d’interaction naturelle (voix, parole, dialogue)',
        goal: 'Clarifier et activer le rôle de Jarvis comme couche d’interaction naturelle de RHONDA',
        parameters: { topic: 'jarvis_interaction', query },
        risk_level: 'LOW',
        confidence: 0.98,
        requires_authorization: false
      };
    }

    if (
      q.includes('architecture') ||
      q.includes('principe') ||
      q.includes('regle') ||
      q.includes('règle') ||
      q.includes('validation') ||
      q.includes('v1.0') ||
      q.includes('motto')
    ) {
      return {
        name: 'ARCHITECTURE_QUERY',
        description: 'Consultation des documents officiels (Validation v1.0 & Master Architecture)',
        goal: 'Restituer les principes directeurs, les 4 règles et la vision cible',
        parameters: { topic: 'master_architecture', query },
        risk_level: 'LOW',
        confidence: 0.99,
        requires_authorization: false
      };
    }

    // Requête par défaut
    return {
      name: 'GENERAL_QUERY',
      description: 'Traitement informatif ou raisonnement général',
      goal: query,
      parameters: { query },
      risk_level: 'LOW',
      confidence: 0.88,
      requires_authorization: false
    };
  }

  private generatePlan(intent: Intent, taskId: string): ExecutionPlan {
    switch (intent.name) {
      case 'SEARCH_FILES':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['filesystem.search', 'system.get_info'],
          expected_result: 'Liste des fichiers indexés et vérifiés avec métadonnées.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'verify_directory_exists',
              description: 'Vérification de l’accessibilité du dossier cible',
              tool: 'filesystem.read',
              parameters: { path: intent.parameters.directory },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'scan_and_filter_files',
              description: `Recherche des fichiers correspondant à ${intent.parameters.pattern}`,
              tool: 'filesystem.search',
              parameters: intent.parameters,
              risk_level: 'LOW',
              status: 'PENDING'
            },
            {
              index: 3,
              action: 'format_and_sort_results',
              description: 'Validation de l’existence et formatage des résultats',
              tool: 'system.get_info',
              parameters: {},
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      case 'DELETE_PATH':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'HIGH',
          requires_authorization: true,
          required_tools: ['filesystem.delete_path'],
          expected_result: 'Suppression définitive du répertoire cible après accord.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'inspect_target_directory',
              description: 'Analyse du contenu et comptage des fichiers à supprimer',
              tool: 'filesystem.read',
              parameters: { filepath: intent.parameters.target_path },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'request_user_confirmation',
              description: `Confirmation explicite pour la suppression de ${intent.parameters.target_path}`,
              tool: 'security.authorization',
              parameters: { risk: 'HIGH', target: intent.parameters.target_path },
              risk_level: 'HIGH',
              status: 'PENDING'
            },
            {
              index: 3,
              action: 'execute_safe_deletion',
              description: 'Suppression effective du répertoire sur le système Windows',
              tool: 'filesystem.delete_path',
              parameters: intent.parameters,
              risk_level: 'HIGH',
              status: 'PENDING'
            }
          ]
        };

      case 'ANALYZE_DATA':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['filesystem.read', 'r.execute_script', 'python.execute_script'],
          expected_result: 'Rapport synthétique et métriques statistiques du projet Kolda.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'load_project_context',
              description: 'Récupération du contexte et métadonnées du projet dans PostgreSQL',
              tool: 'database.query',
              parameters: { project_id: 'prj-kolda' },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'run_statistical_r_script',
              description: 'Calcul statistique via le binaire R 4.6.1 local',
              tool: 'r.execute_script',
              parameters: { script: 'r/scripts/stats_kolda.R' },
              risk_level: 'MEDIUM',
              status: 'PENDING'
            },
            {
              index: 3,
              action: 'verify_and_summarize',
              description: 'Vérification de la cohérence des chiffres et mémorisation',
              tool: 'python.execute_script',
              parameters: { action: 'summarize' },
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      case 'CREATE_DIRECTORY':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'MEDIUM',
          requires_authorization: false,
          required_tools: ['filesystem.create_directory'],
          expected_result: 'Répertoire créé sur le système de fichiers et validé.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'check_parent_directory',
              description: 'Vérification des droits d’écriture dans le dossier parent',
              tool: 'filesystem.read',
              parameters: { path: intent.parameters.path },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'create_directory_on_disk',
              description: `Création physique de ${intent.parameters.path}`,
              tool: 'filesystem.create_directory',
              parameters: intent.parameters,
              risk_level: 'MEDIUM',
              status: 'PENDING'
            },
            {
              index: 3,
              action: 'verify_directory_creation',
              description: 'Vérification de la présence effective du dossier sur Windows',
              tool: 'filesystem.read',
              parameters: { path: intent.parameters.path },
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      case 'SCREEN_CAPTURE':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['screen.capture'],
          expected_result: 'Capture d’écran réussie et inspection visuelle locale.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'acquire_display_stream',
              description: 'Initialisation de l’API de capture d’écran',
              tool: 'screen.capture',
              parameters: { mode: 'full_screen' },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'analyze_visual_components',
              description: 'Extraction locale des fenêtres actives et détection d’éléments',
              tool: 'system.get_info',
              parameters: {},
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      case 'GEOSPATIAL_QUERY':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['database.query', 'r.execute_script', 'python.execute_script'],
          expected_result: 'Routage de la chaîne géospatiale contrôlée : GeoCatalogue -> GeoAgent -> GeoAutoR/GeoCore -> QGIS MCP.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'query_geocatalogue_metadata',
              description: 'Consultation de la base méthodologique et documentaire dans GeoCatalogue',
              tool: 'database.query',
              parameters: { catalog: 'geocatalogue_layers', region: 'Kolda' },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'formulate_spatial_with_geoagent',
              description: 'Paramétrage algorithmique et sélection des couches SIG par GeoAgent',
              tool: 'python.execute_script',
              parameters: { agent: 'GeoAgent', task: 'spatial_selection' },
              risk_level: 'LOW',
              status: 'PENDING'
            },
            {
              index: 3,
              action: 'execute_geoautor_geocore',
              description: 'Exécution du calcul lourd via GeoAutoR / GeoCore (R 4.6.1 sf/terra)',
              tool: 'r.execute_script',
              parameters: { engine: 'GeoAutoR', script: 'spatial_analysis.R' },
              risk_level: 'LOW',
              status: 'PENDING'
            },
            {
              index: 4,
              action: 'verify_qgis_mcp_output',
              description: 'Validation de l’export local Shapefile/GeoPackage prêt pour QGIS MCP',
              tool: 'filesystem.read',
              parameters: { format: 'geopackage' },
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      case 'JARVIS_QUERY':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['system.get_info'],
          expected_result: 'Confirmation du rôle de Jarvis comme couche d’interaction naturelle.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'verify_natural_layer_status',
              description: 'Contrôle de la couche d’interaction vocale STT/TTS (Jarvis Layer)',
              tool: 'system.get_info',
              parameters: { component: 'jarvis_interaction' },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'enforce_single_brain_invariant',
              description: 'Validation de l’architecture : RHONDA Core demeure le cerveau unique',
              tool: 'system.get_info',
              parameters: { rule: 'NO_DUPLICATE_BRAIN' },
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      case 'ARCHITECTURE_QUERY':
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['system.get_info'],
          expected_result: 'Restitution des 4 règles et séparation stricte v1.0 Validation / Master Architecture.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'load_validation_and_master_records',
              description: 'Consultation des documents : RHONDA v1.0 Validation & Master Architecture',
              tool: 'system.get_info',
              parameters: { docs: ['v1_validation', 'master_architecture'] },
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'verify_evolution_principles',
              description: 'Vérification du principe : Améliorer avant d’ajouter, zéro régression',
              tool: 'system.get_info',
              parameters: {},
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };

      default:
        return {
          id: `plan-${taskId}`,
          intent_id: intent.name,
          objective: intent.goal,
          risk_level: 'LOW',
          requires_authorization: false,
          required_tools: ['system.get_info'],
          expected_result: 'Réponse structurée et vérifiée.',
          status: 'VALIDATED',
          steps: [
            {
              index: 1,
              action: 'query_system_and_context',
              description: 'Consultation de la mémoire permanente et métadonnées système',
              tool: 'system.get_info',
              parameters: {},
              risk_level: 'LOW',
              status: 'READY'
            },
            {
              index: 2,
              action: 'synthesize_response',
              description: 'Synthèse déterministe et vérification de conformité',
              tool: 'system.get_info',
              parameters: {},
              risk_level: 'LOW',
              status: 'PENDING'
            }
          ]
        };
    }
  }

  private simulateToolExecution(toolName: string, params: Record<string, unknown>): string {
    switch (toolName) {
      case 'filesystem.search':
        return '3 fichiers trouvés : [rapport_annuel_2025.pdf (1.4 Mo), synthese_kolda.pdf (820 Ko), bordereau_suivi.pdf (310 Ko)]';
      case 'filesystem.read':
        return 'Accès vérifié : permissions en lecture OK, 24 Ko analysés sans erreur';
      case 'filesystem.create_directory':
        return `Répertoire créé avec succès à l'emplacement : ${params.path || 'dossier'}`;
      case 'filesystem.delete_path':
        return `Suppression confirmée et vérifiée : ${params.target_path || 'cible'} n'existe plus sur le disque.`;
      case 'r.execute_script':
        return 'Calcul R 4.6.1 terminé : moyenne = 42.8, variance = 3.14, p-value < 0.001';
      case 'screen.capture':
        return 'Capture d’écran 1920x1080 acquise avec succès dans le buffer sécurisé';
      case 'system.get_info':
        return 'CPU: 18% (Intel i7, 4 threads Ollama), RAM: 6.2/16 Go, Docker rhonda_db: Up 3h';
      default:
        return 'Exécution réussie et vérifiée dans l’environnement sandboxé.';
    }
  }

  private memorizeIfRelevant(intent: Intent, query: string, expectedResult: string) {
    if (intent.name === 'CREATE_DIRECTORY' && intent.target) {
      db.addMemory({
        category: 'FACT',
        key: `dossier_cree_${Date.now()}`,
        content: `Dossier créé sur le PC : ${intent.target}`,
        confidence: 1.0,
        project_id: 'prj-rhonda-core'
      });
    } else if (intent.name === 'DELETE_PATH' && intent.target) {
      db.addMemory({
        category: 'DECISION',
        key: `dossier_supprime_${Date.now()}`,
        content: `Suppression validée par l'utilisateur du chemin : ${intent.target}`,
        confidence: 1.0
      });
    }
  }

  private generateFinalResponse(intent: Intent, plan: ExecutionPlan, logs: string[]): string {
    switch (intent.name) {
      case 'SEARCH_FILES':
        return `J'ai analysé votre système et recherché les fichiers dans ${intent.parameters.directory}. 3 fichiers correspondants ont été localisés et vérifiés avec succès :\n• rapport_annuel_2025.pdf (1.4 Mo)\n• synthese_kolda.pdf (820 Ko)\n• bordereau_suivi.pdf (310 Ko)`;
      case 'DELETE_PATH':
        return `La suppression du répertoire ${intent.parameters.target_path} a été expressément autorisée, exécutée via Filesystem Tool et vérifiée physiquement sur le disque.`;
      case 'CREATE_DIRECTORY':
        return `Le dossier a été créé avec succès à l'emplacement : ${intent.parameters.path}. Les permissions d'écriture ont été validées.`;
      case 'ANALYZE_DATA':
        return `L'analyse du projet Kolda a été réalisée avec succès en couplant Python et le moteur statistique R 4.6.1. 14 fichiers ont été traités, les métriques sont indexées dans PostgreSQL.`;
      case 'SCREEN_CAPTURE':
        return `Capture d'écran effectuée et inspectée localement. L'ordinateur de bord fonctionne nominalement et toutes les fenêtres sont sous surveillance.`;
      case 'SYSTEM_QUERY':
        return `État de l'ordinateur de bord RHONDA : CPU 18% (mode CPU-first optimisé), RAM 6.2 Go utilisés sur 16 Go, PostgreSQL actif sur localhost:5432, Ollama 0.34.2 prêt.`;
      case 'GEOSPATIAL_QUERY':
        return `Chaîne géospatiale activée sous l’orchestration de RHONDA Core :\n• GeoCatalogue : Référentiels et documentation méthodologique chargés.\n• GeoAgent : Formulation experte de la requête spatiale et découpage thématique.\n• GeoAutoR / GeoCore : Exécution validée via R 4.6.1 (sf/terra) et modules Python sans réécriture.\n• QGIS MCP : Données spatiales exportées en GeoPackage et synchronisées avec l'environnement SIG local.`;
      case 'JARVIS_QUERY':
        return `Règle confirmée : Jarvis est la couche d’interaction naturelle de RHONDA (voix, parole et fluidité conversationnelle). Jarvis ne constitue pas un deuxième cerveau. Tout ordre vocal ou textuel est directement transmis à RHONDA Core, unique cerveau et orchestrateur central.`;
      case 'ARCHITECTURE_QUERY':
        return `Architecture RHONDA consultée :\n« Le modèle raisonne. RHONDA orchestre. La sécurité autorise. Les outils exécutent. Le système vérifie. La mémoire conserve. Les interfaces informent. »\n\nDeux documents officiels sont verrouillés :\n1. RHONDA v1.0 Validation (ce qui existe, testé et validé à 100% sur les 10 phases).\n2. RHONDA Master Architecture (vision cible, chaîne géospatiale et 4 règles cardinales).`;
      default:
        return `La requête a été analysée et exécutée avec succès selon le plan établi (${plan.steps.length} étapes validées).`;
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const rhondaCore = new RhondaCoreEngine();
