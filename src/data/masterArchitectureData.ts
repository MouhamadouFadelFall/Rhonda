export interface MasterArchitectureSection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  diagramAscii: string;
  principles: string[];
  components: {
    name: string;
    role: string;
    status: 'CONSTRUIT_ET_VALIDÉ' | 'INTÉGRATION_PROGRESSIVE' | 'CIBLE';
    description: string;
  }[];
}

export const RHONDA_MOTTO =
  '« Le modèle raisonne. RHONDA orchestre. La sécurité autorise. Les outils exécutent. Le système vérifie. La mémoire conserve. Les interfaces informent. »';

export const GOLDEN_RULES = [
  {
    number: '01',
    rule: 'NE PAS RECONSTRUIRE RHONDA.',
    meaning:
      'RHONDA v1.0 est la fondation validée. Le Core, la machine à états, le gestionnaire de contexte, la sécurité et la mémoire PostgreSQL ne sont pas réécrits. On capitalise sur l’existant.'
  },
  {
    number: '02',
    rule: 'NE PAS DUPLIQUER LE CERVEAU.',
    meaning:
      'RHONDA Core est et demeure le cerveau et l’orchestrateur central unique. Jarvis n’est pas une entité décisionnelle concurrente, mais la couche d’interaction naturelle de RHONDA.'
  },
  {
    number: '03',
    rule: 'NE PAS CRÉER DES AGENTS QUI PRENNENT LE CONTRÔLE DU CORE.',
    meaning:
      'Tout agent spécialisé (GeoAgent, etc.) est subordonné au Core. Seul RHONDA Core reçoit l’intention, planifie, sollicite la sécurité et ordonnance l’exécution.'
  },
  {
    number: '04',
    rule: 'NE PAS REMPLACER GeoAutoR/GeoCore PAR UNE NOUVELLE SOLUTION SANS JUSTIFICATION.',
    meaning:
      'GeoAutoR et GeoCore sont les moteurs d’exécution spécialisés déjà développés et éprouvés. Ils sont intégrés comme exécuteurs de confiance, sans réinvention inutile.'
  }
];

export const TARGET_PIPELINE_FLOW = `
                      UTILISATEUR
                           │
                           ▼
                   INTERFACES RHONDA
    ┌──────────────────────┬──────────────────────┬─────────────┐
    │                      │                      │             │
 Cockpit Web             Voix / Jarvis         Telegram     Autres APIs
 (Tableau de bord)    (Interaction naturelle)  (Distant)     (CLI, etc.)
    │                      │                      │             │
    └──────────────────────┼──────────────────────┴─────────────┘
                           │
                           ▼
                      RHONDA CORE
      (Cerveau & Orchestrateur Central Unique)
      ├── Compréhension sémantique & Intent Engine
      ├── Machine à états (8 états finis)
      ├── Context Manager (Projets, Tâches, Historique)
      └── Planning Engine (Décomposition en étapes élémentaires)
                           │
                           ▼
             CONNAISSANCES + AGENTS + OUTILS
      ├── Mémoire & Connaissances : PostgreSQL (rhonda_db) + GeoCatalogue
      ├── Agents Spécialisés : GeoAgent (analyse spatiale déléguée)
      └── Registre d'Outils : 9 outils physiques (FS, Terminal, R, Python, System)
                           │
                           ▼
                  EXÉCUTION CONTRÔLÉE
      ├── Matrice de Risque : LOW / MEDIUM / HIGH / CRITICAL
      ├── Autorisation Interactive (Jetons cryptographiques)
      └── Moteurs d'exécution spécialisés (GeoAutoR, GeoCore, R 4.6.1, Python 3.12)
                           │
                           ▼
                      VÉRIFICATION
      ├── Contrôle d'existence physique (fichiers, dossiers)
      ├── Audit & Cohérence des sorties
      └── Sauvegarde d'état dans PostgreSQL
                           │
                           ▼
                        RÉSULTAT
      Transmis aux interfaces pour informer l'utilisateur sans ambiguïté
`;

export const GEOSPATIAL_PIPELINE_FLOW = `
                      RHONDA CORE
              (Orchestrateur & Décideur Central)
                           │
                           ▼
                     GeoCatalogue
         (Connaissance Méthodologique & Documentaire)
         Fournit les référentiels géographiques, couches de
         données disponibles, règles de projection et métadonnées.
                           │
                           ▼
                       GeoAgent
          (Capacités Géospatiales Spécialisées)
         Formule la requête spatiale experte, sélectionne
         les algorithmes d'analyse et prépare les paramètres.
                           │
                           ▼
                  GeoAutoR / GeoCore
        (Moteurs d'Exécution Spécialisés Déjà Développés)
         Moteurs de calcul en R et Python exécutant les analyses
         spatiales, croisements, rasters et traitements statistiques.
                           │
                           ▼
                 QGIS MCP / Local Agent
        (Accès Contrôlé à l'Environnement Local)
         Pilotage sécurisé du logiciel QGIS en local, chargement des
         layers, génération de cartes et accès aux fichiers SIG.
                           │
                           ▼
              ENVIRONNEMENT LOCAL ET DONNÉES
         Stockage Shapefile, GeoPackage, GeoTIFF, PostgreSQL/PostGIS
`;

export const MASTER_ARCHITECTURE_SECTIONS: MasterArchitectureSection[] = [
  {
    id: 'core-centrality',
    title: 'RHONDA Core : Cerveau et Orchestrateur Unique',
    subtitle: 'Centralisation décisionnelle et gouvernance unifiée',
    badge: 'FONDATION CENTRALE',
    summary:
      'RHONDA Core est l’unique centre névralgique du système. Tous les canaux d’entrée convergent vers lui, et aucun sous-agent n’opère sans son mandat explicite.',
    diagramAscii: `
                    ┌─────────────────────────┐
                    │       RHONDA CORE       │
                    │   Cerveau & Orchestrateur│
                    └────────────┬────────────┘
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
    [GOUVERNANCE]           [SÉCURITÉ]              [MÉMOIRE]
    Machine à états      Matrice 4 risques       PostgreSQL 16
    Ordonnancement       Jeton d'accord          Tables relationnelles
    Planification        Contrôle d'accès        Contexte persistant
    `,
    principles: [
      'RHONDA est le cerveau : aucun agent satellite ne prend de décision autonome sans délégation du Core.',
      'Séquence invariante : COMPREND → PLANIFIE → AUTORISE → AGIT → VÉRIFIE → MÉMORISE → INFORME.',
      'Protection contre le sprawl : pas de micro-cerveaux disséminés, mais une orchestration modulaire centralisée.'
    ],
    components: [
      {
        name: 'IntentEngine & ContextManager',
        role: 'Analyse d’intention et gestion du contexte hiérarchisé',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'Qualifie la demande, récupère l’historique PostgreSQL et prépare les variables nécessaires.'
      },
      {
        name: 'PlanningEngine',
        role: 'Décomposition déterministe en étapes unitaires',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'Assigne à chaque sous-étape un outil précis, un niveau de risque et un critère de vérification.'
      },
      {
        name: 'SecurityPolicyEngine',
        role: 'Garantie de sécurité et verrouillage des actions sensibles',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'Matrice LOW/MEDIUM/HIGH/CRITICAL avec jetons cryptographiques à usage unique.'
      }
    ]
  },
  {
    id: 'jarvis-role',
    title: 'Rôle de Jarvis : Couche d’Interaction Naturelle',
    subtitle: 'Expérience conversationnelle et voix sans duplication du cerveau',
    badge: 'COUCHE INTERACTION',
    summary:
      'Jarvis ne doit pas devenir un deuxième cerveau indépendant. Jarvis est la couche d’interaction naturelle de RHONDA, notamment pour la voix et l’expérience conversationnelle.',
    diagramAscii: `
      [Utilisateur]  ── Voix / Parole ──>  [JARVIS : Couche Naturelle]
                                                      │
                                                      │ (Transcription & Flux fluide)
                                                      ▼
                                              [RHONDA CORE]
                                           (Cerveau & Décision)
                                                      │
                                                      │ (Réponse vérifiée)
                                                      ▼
      [Utilisateur]  <── Synthèse Vocale ── [JARVIS : Couche Naturelle]
    `,
    principles: [
      'Zéro duplication : Jarvis ne dispose pas de son propre moteur de planification ou de ses propres bases de données.',
      'Fluidité conversationnelle : Gestion des interruptions, accusés de réception vocaux et réactivité naturelle.',
      'Subordination stricte : Toutes les commandes vocales sont transmises à RHONDA Core pour validation et exécution.'
    ],
    components: [
      {
        name: 'Voix STT / TTS Modulaire',
        role: 'Speech-to-Text & Text-to-Speech français naturel',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'WebSpeech API & intégration audio locale avec Push-to-Talk et retour auditif instantané.'
      },
      {
        name: 'Jarvis Dialogue Layer',
        role: 'Fluidité conversationnelle et accompagnement interactif',
        status: 'INTÉGRATION_PROGRESSIVE',
        description: 'Couche de politesse, contextualisation vocale et retour continu sans changer le modèle de décision du Core.'
      }
    ]
  },
  {
    id: 'geospatial-stack',
    title: 'Architecture Géospatiale Progressive',
    subtitle: 'Intégration de GeoCatalogue, GeoAgent, GeoAutoR/GeoCore et QGIS MCP',
    badge: 'EXTENSION SPÉCIALISÉE',
    summary:
      'La chaîne géospatiale s’intègre progressivement autour de RHONDA Core sans remplacer les composants éprouvés.',
    diagramAscii: GEOSPATIAL_PIPELINE_FLOW,
    principles: [
      'GeoCatalogue fournit la connaissance méthodologique et documentaire (référentiels, fiches SIG, métadonnées).',
      'GeoAgent représente les capacités géospatiales spécialisées (formulation experte, paramétrage algorithmique).',
      'GeoAutoR / GeoCore restent les moteurs d’exécution spécialisés déjà développés et validés.',
      'QGIS MCP / Local Agent fournissent un accès contrôlé à l’environnement local SIG et aux projets cartographiques.'
    ],
    components: [
      {
        name: 'GeoCatalogue',
        role: 'Base de connaissances méthodologiques et documentaires SIG',
        status: 'INTÉGRATION_PROGRESSIVE',
        description: 'Inventaire structuré des données géographiques, des sources officielles et des processus cartographiques.'
      },
      {
        name: 'GeoAgent',
        role: 'Agent spécialisé en raisonnement spatial',
        status: 'INTÉGRATION_PROGRESSIVE',
        description: 'Traduit un objectif cartographique ou géomatique en paramètres d’exécution pour GeoAutoR.'
      },
      {
        name: 'GeoAutoR / GeoCore',
        role: 'Moteurs d’exécution spécialisés R & Python',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'Scripts R éprouvés (R 4.6.1 sf, terra, ggplot2) et modules Python pour l’analyse spatiale robuste.'
      },
      {
        name: 'QGIS MCP / Local Agent',
        role: 'Passerelle d’automatisation locale QGIS',
        status: 'CIBLE',
        description: 'Interface standardisée (Model Context Protocol) pour piloter QGIS sans intervention manuelle risquée.'
      }
    ]
  },
  {
    id: 'evolution-principles',
    title: 'Principes Directeurs d’Évolution Technique',
    subtitle: 'Améliorer avant d’ajouter. Ne rien inventer. Zéro régression.',
    badge: 'MÉTHODOLOGIE STRICTE',
    summary:
      'La transition de RHONDA v1.0 vers la plateforme extensible se fait par enrichissement incrémental vérifié à chaque palier.',
    diagramAscii: `
      [RHONDA v1.0 Validé] ────> [Audit & Mesure] ────> [Extension Contrôlée]
              ▲                                                    │
              │                                                    ▼
              └─────────────── [Zéro Régression] <─────────────────┘
    `,
    principles: [
      'Améliorer avant d’ajouter : renforcer la robustesse des modules existants avant toute nouvelle extension.',
      'Ne rien inventer : s’appuyer sur des briques éprouvées (Python 3.12, PostgreSQL 16, R 4.6.1, Ollama, QGIS).',
      'Zéro régression : chaque ajout fait l’objet de tests de non-régression sur les 10 phases v1.0.',
      'Vérification matérielle : tout ce qui est annoncé doit être réellement exécuté et vérifié sur la machine.'
    ],
    components: [
      {
        name: 'Harnais de Test Continu',
        role: 'Validation systématique des 12 services',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'Détection active des latences, santé PostgreSQL et accessibilité Ollama CPU-first.'
      },
      {
        name: 'Protocole de Non-Régression',
        role: 'Contrôle strict des dépendances',
        status: 'CONSTRUIT_ET_VALIDÉ',
        description: 'Impossibilité d’altérer les tables PostgreSQL ou le comportement du Core sans migration validée.'
      }
    ]
  }
];
