import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Camera,
  Paperclip,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Database,
  ArrowRight,
  Info,
  Terminal,
  HelpCircle,
  FileText,
  Compass,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { RhondaState, RhondaTask } from '../types';
import { multimodal } from '../services/speechService';

interface CockpitViewProps {
  currentState: RhondaState;
  currentTask: RhondaTask | null;
  taskProgress: number;
  currentStepMessage: string;
  executionLogs: string[];
  history: {
    id: string;
    sender: 'user' | 'rhonda';
    content: string;
    timestamp: string;
    task?: RhondaTask;
  }[];
  onSubmitQuery: (query: string, inputType?: 'TEXT' | 'VOICE' | 'IMAGE' | 'SCREEN' | 'FILE') => void;
  onOpenMasterArchitecture?: () => void;
  onOpenValidationReport?: () => void;
}

const LIFECYCLE_STEPS = [
  { key: 'UTILISATEUR', label: 'Utilisateur', stateTrigger: ['RECEIVING'] },
  { key: 'COMPREND', label: 'Comprend', stateTrigger: ['UNDERSTANDING'] },
  { key: 'PLANIFIE', label: 'Planifie', stateTrigger: ['PLANNING'] },
  { key: 'AUTORISE', label: 'Autorise', stateTrigger: ['WAITING_AUTHORIZATION'] },
  { key: 'AGIT', label: 'Agit', stateTrigger: ['WORKING', 'EXECUTING'] },
  { key: 'VÉRIFIE', label: 'Vérifie', stateTrigger: ['VERIFYING'] },
  { key: 'MÉMORISE', label: 'Mémorise', stateTrigger: ['WORKING'] },
  { key: 'INFORME', label: 'Informe', stateTrigger: ['COMPLETED', 'READY'] }
];

export const CockpitView: React.FC<CockpitViewProps> = ({
  currentState,
  currentTask,
  taskProgress,
  currentStepMessage,
  executionLogs,
  history,
  onSubmitQuery,
  onOpenMasterArchitecture,
  onOpenValidationReport
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [capturedScreenThumb, setCapturedScreenThumb] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, executionLogs, taskProgress]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() && !capturedScreenThumb && !attachedFileName) return;

    let textToSend = inputVal.trim();
    let inputType: 'TEXT' | 'VOICE' | 'IMAGE' | 'SCREEN' | 'FILE' = 'TEXT';

    if (capturedScreenThumb) {
      inputType = 'SCREEN';
      textToSend = textToSend || "Analyse cette capture d'écran et vérifie l'état système.";
      setCapturedScreenThumb(null);
    } else if (attachedFileName) {
      inputType = 'FILE';
      textToSend = textToSend || `Analyse le document joint : ${attachedFileName}`;
      setAttachedFileName(null);
    }

    onSubmitQuery(textToSend, inputType);
    setInputVal('');
  };

  const handleToggleMic = () => {
    if (isListening) {
      multimodal.stopListening();
      setIsListening(false);
    } else {
      multimodal.startListening(
        (transcript) => {
          setInputVal(transcript);
          onSubmitQuery(transcript, 'VOICE');
          setIsListening(false);
        },
        (listening) => setIsListening(listening),
        (err) => {
          console.warn(err);
          setIsListening(false);
        }
      );
    }
  };

  const handleCaptureScreen = async () => {
    try {
      const capture = await multimodal.captureScreen();
      if (capture) {
        setCapturedScreenThumb(capture.dataUrl);
        setInputVal("Analyse cette capture d'écran de mon ordinateur.");
      }
    } catch (e) {
      console.warn('Capture screen failed:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      setInputVal(`Analyse le fichier ${file.name} (Taille: ${(file.size / 1024).toFixed(1)} Ko)`);
    }
  };

  const isStepActive = (stepKey: string) => {
    if (currentState === 'READY') return false;
    const step = LIFECYCLE_STEPS.find((s) => s.key === stepKey);
    return step?.stateTrigger.includes(currentState);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      {/* 1. Cycle d'exécution unifié (UTILISATEUR -> COMPREND -> PLANIFIE -> AUTORISE -> AGIT -> VÉRIFIE -> MÉMORISE -> INFORME) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Cycle d’Orchestration RHONDA Core
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              8 étapes séquentielles
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>État actuel :</span>
              <span className="font-bold text-cyan-400">{currentState}</span>
            </div>

            {/* Quick links to Document 1 & Document 2 */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenMasterArchitecture}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-700/50 hover:bg-indigo-900 text-indigo-300 font-mono text-[11px] transition-colors"
                title="Consulter le Document Officiel N°2 : Master Architecture"
              >
                <Compass className="w-3 h-3 text-indigo-400" />
                <span className="hidden md:inline">Doc 2 :</span> Master Architecture
              </button>
              <button
                onClick={onOpenValidationReport}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/50 hover:bg-emerald-900 text-emerald-300 font-mono text-[11px] transition-colors"
                title="Consulter le Document Officiel N°1 : RHONDA v1.0 Validation"
              >
                <FileCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline">Doc 1 :</span> v1.0 Validation
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal steps flow */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const active = isStepActive(step.key);
            return (
              <div
                key={step.key}
                className={`relative flex flex-col items-center p-2 rounded-xl text-center border transition-all ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-200 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50 scale-[1.03]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
                  <span>0{idx + 1}</span>
                </div>
                <span className="text-xs font-bold font-mono tracking-tight">{step.label}</span>
                {active && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
            );
          })}
        </div>

        {/* Motto Callout */}
        <div className="pt-2 border-t border-slate-800/80 text-center font-mono text-[11px] text-cyan-300/90 font-medium">
          « Le modèle raisonne. RHONDA orchestre. La sécurité autorise. Les outils exécutent. Le système vérifie. La mémoire conserve. Les interfaces informent. »
        </div>
      </div>

      {/* 2. Colonnes principales : Conversation & Tâche active */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Échanges & Conversation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[640px] bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* Header Conversation */}
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                Console d'Interaction de Bord
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">PostgreSQL session : active</div>
          </div>

          {/* Messages scrollables */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-950/30'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/10 text-[11px] font-mono opacity-80">
                    <span className="font-bold">{msg.sender === 'user' ? 'UTILISATEUR' : 'RHONDA'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Si le message est associé à une tâche complétée */}
                  {msg.task && msg.task.plan && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-slate-400">Intention :</span>
                        <span className="text-cyan-300 font-bold">{msg.task.intent.name}</span>
                        <span className="text-slate-400">| Risque :</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            msg.task.plan.risk_level === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {msg.task.plan.risk_level}
                        </span>
                      </div>

                      {msg.task.plan.steps.length > 0 && (
                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-slate-400 block mb-1">Étapes vérifiées :</span>
                          {msg.task.plan.steps.map((st) => (
                            <div key={st.index} className="flex items-start gap-2 text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{st.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-slate-400 text-[11px] font-mono shrink-0">Suggestions :</span>
            <button
              onClick={() => setInputVal('Analyse les rapports du projet Kolda')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] transition-colors border border-slate-700/60"
            >
              📊 GeoAutoR & R Kolda
            </button>
            <button
              onClick={() => setInputVal('Explique le rôle de GeoCatalogue, GeoAgent et GeoAutoR')}
              className="px-2.5 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 whitespace-nowrap text-[11px] transition-colors border border-emerald-700/60"
            >
              🗺️ Chaîne Géospatiale
            </button>
            <button
              onClick={() => setInputVal('Quelle est la place de Jarvis par rapport à RHONDA Core ?')}
              className="px-2.5 py-1 rounded-full bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 whitespace-nowrap text-[11px] transition-colors border border-indigo-700/60"
            >
              🎙️ Jarvis & Interaction
            </button>
            <button
              onClick={() => setInputVal('Trouve mes fichiers PDF dans Documents')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] transition-colors border border-slate-700/60"
            >
              🔍 Fichiers PDF
            </button>
            <button
              onClick={() => setInputVal('Supprime le dossier temp')}
              className="px-2.5 py-1 rounded-full bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 whitespace-nowrap text-[11px] transition-colors border border-rose-800/50"
            >
              ⚠️ Supprimer dossier (Risque HIGH)
            </button>
            <button
              onClick={() => setInputVal('Supprime le fichier')}
              className="px-2.5 py-1 rounded-full bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 whitespace-nowrap text-[11px] transition-colors border border-amber-800/50"
            >
              ❓ Ambiguïté
            </button>
          </div>

          {/* Preview captured screen or file */}
          {(capturedScreenThumb || attachedFileName) && (
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
              {capturedScreenThumb && (
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <img src={capturedScreenThumb} alt="Preview" className="w-8 h-6 object-cover rounded" />
                  <span className="text-xs text-slate-300">Capture d’écran prête</span>
                  <button
                    onClick={() => setCapturedScreenThumb(null)}
                    className="text-slate-400 hover:text-white text-xs ml-2"
                  >
                    ×
                  </button>
                </div>
              )}
              {attachedFileName && (
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-300 truncate max-w-[200px]">{attachedFileName}</span>
                  <button
                    onClick={() => setAttachedFileName(null)}
                    className="text-slate-400 hover:text-white text-xs ml-2"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Form & Multimodal buttons */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.csv,.json,.xlsx,.docx"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attacher un document (PDF, CSV, TXT)"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCaptureScreen}
              title="Capture d’écran locale pour le Vision Engine"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleMic}
              title={isListening ? 'Arrêter l’écoute vocale' : 'Activer la commande vocale (Speech-to-Text)'}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {isListening ? <Mic className="w-4 h-4 text-rose-400" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              id="input-user-query"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Donnez un ordre ou posez une question à RHONDA..."
              className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition-all"
            />

            <button
              id="btn-submit-query"
              type="submit"
              disabled={!inputVal.trim() && !capturedScreenThumb && !attachedFileName}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Colonne Droite : Suivi de tâche en temps réel & Logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[640px] space-y-4">
          {/* Carte Tâche Active */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Tâche en cours d'exécution
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {currentTask ? `#${currentTask.id}` : 'EN ATTENTE'}
              </span>
            </div>

            {/* Jauge de progression */}
            <div className="my-4">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-400 truncate max-w-[220px]">
                  {currentStepMessage || 'Prêt pour la prochaine commande'}
                </span>
                <span className="text-cyan-300 font-bold">{taskProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>

            {/* Détails du plan */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
              {currentTask ? (
                <div className="space-y-3">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs font-mono">
                    <span className="text-slate-400 block mb-1">Objectif planifié :</span>
                    <p className="text-slate-200 font-semibold">{currentTask.plan.objective}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Étapes du plan ({currentTask.plan.steps.length}) :
                    </span>
                    {currentTask.plan.steps.map((st, i) => (
                      <div
                        key={st.index}
                        className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${
                          st.status === 'COMPLETED'
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                            : st.status === 'RUNNING'
                            ? 'bg-blue-950/30 border-blue-500/50 text-blue-200 animate-pulse'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-300">0{st.index}.</span>
                            <span className="font-semibold text-slate-200">{st.action}</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              st.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : st.status === 'RUNNING'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {st.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-1">{st.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <span>Outil: {st.tool}</span>
                          <span className="text-amber-400">Risque: {st.risk_level}</span>
                        </div>
                        {st.output && (
                          <div className="mt-2 text-[10px] p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 break-words">
                            ↳ {st.output}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Clock className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-mono">Aucune tâche en cours.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Les étapes de décomposition et d'exécution apparaîtront ici.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Terminal de journalisation d'exécution */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 h-52 flex flex-col font-mono text-xs overflow-hidden shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Journal d'audit & exécution (PostgreSQL)</span>
              </div>
              <span>CPU-First • Windows 11</span>
            </div>
            <div className="flex-1 overflow-y-auto pt-2 space-y-1 text-[11px] text-slate-300 scrollbar-thin">
              {executionLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  <span className="text-cyan-500 mr-2">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
