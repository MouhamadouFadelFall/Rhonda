import React, { useState, useRef } from 'react';
import { RhondaState, RhondaTask, RiskLevel } from './types';
import { Header, AppTab } from './components/Header';
import { CockpitView } from './components/CockpitView';
import { MasterArchitectureView } from './components/MasterArchitectureView';
import { ValidationReportView } from './components/ValidationReportView';
import { PhasesExplorer } from './components/PhasesExplorer';
import { DiagnosticsView } from './components/DiagnosticsView';
import { SecurityToolsView } from './components/SecurityToolsView';
import { MemoryDatabaseView } from './components/MemoryDatabaseView';
import { TelegramSimulatorView } from './components/TelegramSimulatorView';
import { AuthorizationModal } from './components/AuthorizationModal';
import { rhondaCore } from './services/rhondaCore';
import { multimodal } from './services/speechService';

export default function App() {
  const [currentState, setCurrentState] = useState<RhondaState>('READY');
  const [activeTab, setActiveTab] = useState<AppTab>('cockpit');

  const [currentTask, setCurrentTask] = useState<RhondaTask | null>(null);
  const [taskProgress, setTaskProgress] = useState<number>(0);
  const [currentStepMessage, setCurrentStepMessage] = useState<string>('En veille active');
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[INIT] RHONDA v1.0.0 initialisée en mode CPU-first sous Windows 11',
    '[INIT] Base PostgreSQL 16 active sur rhonda_db:5432',
    '[INIT] Ollama 0.34.2 connecté (modèle qwen3:0.6b)',
    '[INIT] Prêt pour les instructions'
  ]);

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // Conversation history
  const [history, setHistory] = useState<
    {
      id: string;
      sender: 'user' | 'rhonda';
      content: string;
      timestamp: string;
      task?: RhondaTask;
    }[]
  >([
    {
      id: 'msg-init',
      sender: 'rhonda',
      content:
        "Bonjour. Je suis RHONDA, votre ordinateur de bord intelligent personnel (v1.0.0).\n\nMon architecture est CPU-first, connectée à PostgreSQL 16 (rhonda_db) et orchestrée selon le principe fondamental :\n« Le modèle raisonne. RHONDA orchestre. La sécurité autorise. Les outils exécutent. Le système vérifie. La mémoire conserve. Les interfaces informent. »\n\nRHONDA Core est le cerveau et l’orchestrateur central. Consultez les documents officiels « RHONDA v1.0 Validation » et « RHONDA Master Architecture » dans les onglets dédiés.\n\nQue souhaitez-vous accomplir aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Modal d'autorisation de sécurité (Phase 5)
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    task: RhondaTask | null;
    stepIndex: number;
    resolve: ((granted: boolean) => void) | null;
  }>({
    isOpen: false,
    task: null,
    stepIndex: 0,
    resolve: null
  });

  const handleToggleAudio = () => {
    const enabled = multimodal.toggleSpeechSynthesis();
    setIsAudioMuted(!enabled);
  };

  const handleSubmitQuery = async (
    query: string,
    inputType: 'TEXT' | 'VOICE' | 'IMAGE' | 'SCREEN' | 'FILE' = 'TEXT'
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setHistory((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: query,
        timestamp
      }
    ]);

    try {
      const task = await rhondaCore.processRequest(query, inputType, {
        onStateChange: (state) => setCurrentState(state),
        onProgress: (prog, msg) => {
          setTaskProgress(prog);
          setCurrentStepMessage(msg);
        },
        onLog: (log) => setExecutionLogs((prev) => [log, ...prev.slice(0, 50)]),
        onAuthorizationRequired: (t, stepIdx) => {
          return new Promise<boolean>((resolve) => {
            setAuthModal({
              isOpen: true,
              task: t,
              stepIndex: stepIdx,
              resolve
            });
          });
        }
      });

      setCurrentTask(task);

      // Append RHONDA response
      setHistory((prev) => [
        ...prev,
        {
          id: `rhonda-${Date.now()}`,
          sender: 'rhonda',
          content: task.result || task.error || 'Opération traitée.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          task
        }
      ]);

      // Vocalize if audio feedback is enabled
      if (!isAudioMuted && task.result) {
        multimodal.speak(task.result);
      }
    } catch (err) {
      console.error('RHONDA execution error:', err);
      setCurrentState('ERROR');
      setExecutionLogs((prev) => [`[ERROR] Échec d'exécution : ${err}`, ...prev]);
    }
  };

  const handleAuthConfirm = () => {
    if (authModal.resolve) {
      authModal.resolve(true);
    }
    setAuthModal({ isOpen: false, task: null, stepIndex: 0, resolve: null });
  };

  const handleAuthDeny = () => {
    if (authModal.resolve) {
      authModal.resolve(false);
    }
    setAuthModal({ isOpen: false, task: null, stepIndex: 0, resolve: null });
  };

  const handleTriggerToolTest = (toolName: string, riskLevel: RiskLevel) => {
    setActiveTab('cockpit');
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      handleSubmitQuery(`Supprime le dossier temp`);
    } else if (toolName.includes('search')) {
      handleSubmitQuery(`Trouve mes fichiers PDF dans Documents`);
    } else if (toolName.includes('r')) {
      handleSubmitQuery(`Analyse les rapports du projet Kolda`);
    } else {
      handleSubmitQuery(`Exécute l'outil ${toolName}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header bar */}
      <Header
        currentState={currentState}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'cockpit' && (
          <CockpitView
            currentState={currentState}
            currentTask={currentTask}
            taskProgress={taskProgress}
            currentStepMessage={currentStepMessage}
            executionLogs={executionLogs}
            history={history}
            onSubmitQuery={handleSubmitQuery}
            onOpenMasterArchitecture={() => setActiveTab('master-arch')}
            onOpenValidationReport={() => setActiveTab('v1-validation')}
          />
        )}

        {activeTab === 'master-arch' && (
          <MasterArchitectureView onSwitchToValidation={() => setActiveTab('v1-validation')} />
        )}

        {activeTab === 'v1-validation' && (
          <ValidationReportView onSwitchToMasterArchitecture={() => setActiveTab('master-arch')} />
        )}

        {activeTab === 'phases' && <PhasesExplorer />}

        {activeTab === 'diagnostics' && <DiagnosticsView />}

        {activeTab === 'security' && <SecurityToolsView onTriggerToolTest={handleTriggerToolTest} />}

        {activeTab === 'memory' && <MemoryDatabaseView />}

        {activeTab === 'telegram' && <TelegramSimulatorView />}
      </main>

      {/* Authorization Modal for HIGH / CRITICAL actions */}
      <AuthorizationModal
        isOpen={authModal.isOpen}
        task={authModal.task}
        stepIndex={authModal.stepIndex}
        onConfirm={handleAuthConfirm}
        onDeny={handleAuthDeny}
      />
    </div>
  );
}
