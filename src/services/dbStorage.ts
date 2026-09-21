import {
  ProjectItem,
  MemoryItem,
  RhondaTask,
  SystemEvent,
  RegisteredTool,
  DiagnosticService,
  TelegramMessage
} from '../types';

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj-kolda',
    name: 'Projet Kolda',
    description: 'Analyse géostatistique et rapports d’inventaire régional',
    directory_path: 'C:\\Users\\fallm\\Rhonda\\data\\projects\\kolda',
    active: true,
    files_count: 14,
    last_activity: '2026-09-21 13:42'
  },
  {
    id: 'prj-rhonda-core',
    name: 'RHONDA System',
    description: 'Architecture interne, scripts R & modules Python',
    directory_path: 'C:\\Users\\fallm\\Rhonda',
    active: true,
    files_count: 48,
    last_activity: '2026-09-21 14:15'
  }
];

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'ENVIRONMENT',
    key: 'system_os',
    content: 'Machine Windows 11 hôte sans GPU dédié (architecture CPU-first prioritaire)',
    confidence: 1.0,
    created_at: '2026-09-21 09:00:00'
  },
  {
    id: 'mem-2',
    category: 'PREFERENCE',
    key: 'default_model',
    content: 'Ollama local avec qwen3:0.6b pour les inférences de raisonnement léger',
    confidence: 0.98,
    created_at: '2026-09-21 09:05:00'
  },
  {
    id: 'mem-3',
    category: 'FACT',
    key: 'database_target',
    content: 'PostgreSQL 16 dans conteneur Docker "rhonda_db" sur localhost:5432',
    confidence: 1.0,
    created_at: '2026-09-21 09:10:00'
  },
  {
    id: 'mem-4',
    category: 'DECISION',
    key: 'security_rule_delete',
    content: 'Toute suppression de fichier ou répertoire requiert confirmation utilisateur explicite (Risk HIGH)',
    confidence: 1.0,
    created_at: '2026-09-21 10:00:00'
  }
];

const INITIAL_TOOLS: RegisteredTool[] = [
  {
    id: 'tool-fs-search',
    name: 'filesystem.search',
    category: 'filesystem',
    description: 'Recherche des fichiers par nom, motif ou extension dans un répertoire cible.',
    parameters: [
      { name: 'directory', type: 'string', required: true, description: 'Chemin du dossier racine' },
      { name: 'pattern', type: 'string', required: true, description: 'Motif ou extension (*.pdf, *.csv)' }
    ],
    default_risk: 'LOW',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'filesystem.search(directory="C:\\\\Users\\\\fallm\\\\Documents", pattern="*.pdf")'
  },
  {
    id: 'tool-fs-read',
    name: 'filesystem.read',
    category: 'filesystem',
    description: 'Lit le contenu d’un fichier texte, JSON ou métadonnées avec limite de taille sécurisée.',
    parameters: [
      { name: 'filepath', type: 'string', required: true, description: 'Chemin absolu du fichier' },
      { name: 'max_lines', type: 'int', required: false, description: 'Nombre max de lignes à lire' }
    ],
    default_risk: 'LOW',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'filesystem.read(filepath="C:\\\\Users\\\\fallm\\\\Documents\\\\rapport.txt", max_lines=100)'
  },
  {
    id: 'tool-fs-create-dir',
    name: 'filesystem.create_directory',
    category: 'filesystem',
    description: 'Crée un nouveau répertoire sur le disque après validation du chemin.',
    parameters: [
      { name: 'path', type: 'string', required: true, description: 'Chemin du nouveau dossier' }
    ],
    default_risk: 'MEDIUM',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'filesystem.create_directory(path="C:\\\\Users\\\\fallm\\\\Rhonda\\\\data\\\\projects\\\\nouveau")'
  },
  {
    id: 'tool-fs-delete',
    name: 'filesystem.delete_path',
    category: 'filesystem',
    description: 'Supprime un fichier ou répertoire spécifique du disque. Risque élevé.',
    parameters: [
      { name: 'target_path', type: 'string', required: true, description: 'Chemin du fichier ou dossier' },
      { name: 'recursive', type: 'boolean', required: false, description: 'Suppression récursive' }
    ],
    default_risk: 'HIGH',
    requires_authorization: true,
    is_installed: true,
    sample_call: 'filesystem.delete_path(target_path="C:\\\\Users\\\\fallm\\\\Rhonda\\\\temp", recursive=true)'
  },
  {
    id: 'tool-term-controlled',
    name: 'terminal.run_controlled',
    category: 'terminal',
    description: 'Exécute une commande shell autorisée dans un environnement sandboxé et limité.',
    parameters: [
      { name: 'command', type: 'string', required: true, description: 'Ligne de commande à exécuter' },
      { name: 'timeout_seconds', type: 'int', required: false, description: 'Délai d’attente maximal' }
    ],
    default_risk: 'HIGH',
    requires_authorization: true,
    is_installed: true,
    sample_call: 'terminal.run_controlled(command="dir C:\\\\Users\\\\fallm\\\\Rhonda", timeout_seconds=10)'
  },
  {
    id: 'tool-python-exec',
    name: 'python.execute_script',
    category: 'python',
    description: 'Exécute un script Python validé dans l’environnement virtuel .venv.',
    parameters: [
      { name: 'script_path', type: 'string', required: true, description: 'Chemin du script .py' },
      { name: 'args', type: 'array', required: false, description: 'Arguments passés au script' }
    ],
    default_risk: 'MEDIUM',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'python.execute_script(script_path="scripts/audit.py")'
  },
  {
    id: 'tool-r-calc',
    name: 'r.execute_script',
    category: 'r',
    description: 'Exécute un script de calcul ou statistique avec le binaire local Rscript 4.6.1.',
    parameters: [
      { name: 'script_path', type: 'string', required: true, description: 'Chemin du script .R' }
    ],
    default_risk: 'MEDIUM',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'r.execute_script(script_path="r/scripts/stats_kolda.R")'
  },
  {
    id: 'tool-sys-info',
    name: 'system.get_info',
    category: 'system',
    description: 'Récupère les informations système (charge CPU, RAM disponible, stockage disques).',
    parameters: [],
    default_risk: 'LOW',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'system.get_info()'
  },
  {
    id: 'tool-screen-capture',
    name: 'screen.capture',
    category: 'multimodal',
    description: 'Capture l’écran actif ou une fenêtre pour analyse visuelle par le Vision Engine.',
    parameters: [
      { name: 'mode', type: 'string', required: false, description: 'full_screen ou window' }
    ],
    default_risk: 'LOW',
    requires_authorization: false,
    is_installed: true,
    sample_call: 'screen.capture(mode="full_screen")'
  }
];

const INITIAL_DIAGNOSTICS: DiagnosticService[] = [
  {
    id: 'diag-python',
    name: 'Python 3.12.10',
    category: 'SYSTEM',
    version: '3.12.10 (.venv)',
    status: 'OK',
    latency_ms: 12,
    details: 'Environnement virtuel détecté sous C:\\Users\\fallm\\Rhonda\\.venv',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-postgres',
    name: 'PostgreSQL 16 (rhonda_db)',
    category: 'CORE',
    version: 'PostgreSQL 16.4',
    status: 'OK',
    latency_ms: 18,
    details: 'Connexion active sur localhost:5432 - Requête SELECT 1 validée',
    cpu_impact: 'LOW'
  },
  {
    id: 'diag-ollama',
    name: 'Ollama Engine',
    category: 'AI',
    version: '0.34.2',
    status: 'OK',
    latency_ms: 45,
    details: 'Serveur local HTTP 11434 connecté - Modèle "qwen3:0.6b" prêt (CPU-first)',
    cpu_impact: 'LOW'
  },
  {
    id: 'diag-core',
    name: 'RHONDA Core Orchestrator',
    category: 'CORE',
    version: '1.0.0',
    status: 'OK',
    latency_ms: 5,
    details: 'State machine, Intent engine & Context manager opérationnels',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-agent',
    name: 'Agent Engine & Registry',
    category: 'CORE',
    version: '1.0.0',
    status: 'OK',
    latency_ms: 8,
    details: '9 outils enregistrés - Système de vérification post-action actif',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-security',
    name: 'Security & Policy Engine',
    category: 'CORE',
    version: '1.0.0',
    status: 'OK',
    latency_ms: 4,
    details: 'Matrice de risque active (LOW, MEDIUM, HIGH, CRITICAL) - Audit actif',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-r',
    name: 'R & Rscript Runtime',
    category: 'SYSTEM',
    version: '4.6.1',
    status: 'OK',
    latency_ms: 22,
    details: 'Binaire Rscript détecté dans le PATH système',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-java',
    name: 'Java Development Kit',
    category: 'SYSTEM',
    version: '27.0.0',
    status: 'OK',
    latency_ms: 15,
    details: 'Binaire java détecté (module optionnel)',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-docker',
    name: 'Docker & Compose',
    category: 'SYSTEM',
    version: '29.7.2 (Compose v5.5.0)',
    status: 'OK',
    latency_ms: 28,
    details: 'Démon Docker actif - Conteneur rhonda_db en cours d’exécution',
    cpu_impact: 'LOW'
  },
  {
    id: 'diag-multimodal',
    name: 'Perception Multimodale',
    category: 'INTERFACES',
    version: 'WebSpeech / ScreenCapture',
    status: 'OK',
    latency_ms: 10,
    details: 'Speech-to-Text & Vision input gateway initialisés',
    cpu_impact: 'MINIMAL'
  },
  {
    id: 'diag-telegram',
    name: 'Telegram Remote Adapter',
    category: 'INTERFACES',
    version: 'Adapter v1.0',
    status: 'OK',
    latency_ms: 14,
    details: 'Passerelle active - 1 utilisateur autorisé configuré',
    cpu_impact: 'MINIMAL'
  }
];

class DatabaseStorage {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(`rhonda_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`rhonda_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  getProjects(): ProjectItem[] {
    return this.get<ProjectItem[]>('projects', INITIAL_PROJECTS);
  }

  saveProjects(projects: ProjectItem[]): void {
    this.set('projects', projects);
  }

  getMemories(): MemoryItem[] {
    return this.get<MemoryItem[]>('memories', INITIAL_MEMORIES);
  }

  addMemory(item: Omit<MemoryItem, 'id' | 'created_at'>): MemoryItem {
    const list = this.getMemories();
    const newMem: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    list.unshift(newMem);
    this.set('memories', list);
    return newMem;
  }

  deleteMemory(id: string): void {
    const list = this.getMemories().filter((m) => m.id !== id);
    this.set('memories', list);
  }

  getTools(): RegisteredTool[] {
    return this.get<RegisteredTool[]>('tools', INITIAL_TOOLS);
  }

  getDiagnostics(): DiagnosticService[] {
    return this.get<DiagnosticService[]>('diagnostics', INITIAL_DIAGNOSTICS);
  }

  getEvents(): SystemEvent[] {
    return this.get<SystemEvent[]>('events', [
      {
        id: 'evt-1',
        event_type: 'SYSTEM_BOOT',
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
        source: 'CORE',
        level: 'INFO',
        details: 'Démarrage de RHONDA v1.0.0 — Tous les services validés'
      },
      {
        id: 'evt-2',
        event_type: 'DATABASE_CONNECTED',
        timestamp: new Date(Date.now() - 3550000).toLocaleTimeString(),
        source: 'CORE',
        level: 'INFO',
        details: 'PostgreSQL rhonda_db connecté sur localhost:5432'
      }
    ]);
  }

  logEvent(event: Omit<SystemEvent, 'id' | 'timestamp'>): void {
    const events = this.getEvents();
    const newEvt: SystemEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString()
    };
    events.unshift(newEvt);
    this.set('events', events.slice(0, 100));
  }

  getTasks(): RhondaTask[] {
    return this.get<RhondaTask[]>('tasks', []);
  }

  saveTask(task: RhondaTask): void {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      tasks[idx] = task;
    } else {
      tasks.unshift(task);
    }
    this.set('tasks', tasks.slice(0, 50));
  }

  getTelegramMessages(): TelegramMessage[] {
    return this.get<TelegramMessage[]>('telegram_messages', [
      {
        id: 'msg-1',
        sender: 'rhonda',
        text: '👋 RHONDA connectée via passerelle distante Telegram. Commandes disponibles: /status, /tasks, /projects, /help ou demande en langage naturel.',
        timestamp: '14:20'
      }
    ]);
  }

  saveTelegramMessages(messages: TelegramMessage[]): void {
    this.set('telegram_messages', messages);
  }
}

export const db = new DatabaseStorage();
