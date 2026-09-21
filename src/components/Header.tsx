import React from 'react';
import {
  Terminal,
  Activity,
  Cpu,
  Layers,
  ShieldAlert,
  Database,
  Smartphone,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  FileCheck
} from 'lucide-react';
import { RhondaState } from '../types';

export type AppTab =
  | 'cockpit'
  | 'master-arch'
  | 'v1-validation'
  | 'phases'
  | 'diagnostics'
  | 'security'
  | 'memory'
  | 'telegram';

interface HeaderProps {
  currentState: RhondaState;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentState,
  activeTab,
  onSelectTab,
  isAudioMuted,
  onToggleAudio
}) => {
  const getStateColor = (state: RhondaState) => {
    switch (state) {
      case 'READY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'LISTENING':
      case 'RECEIVING':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse';
      case 'THINKING':
      case 'UNDERSTANDING':
      case 'PLANNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'WORKING':
      case 'EXECUTING':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse';
      case 'WAITING_AUTHORIZATION':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-bounce';
      case 'VERIFYING':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ERROR':
      case 'DEGRADED':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/10 border border-cyan-400/30">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wider text-white font-mono">RHONDA</h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Ordinateur de bord intelligent • CPU-First</p>
            </div>
          </div>

          {/* Live State Machine Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border flex items-center gap-2 transition-all ${getStateColor(
                currentState
              )}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>{currentState}</span>
            </div>

            {/* Audio Feedback Toggle */}
            <button
              onClick={onToggleAudio}
              title={isAudioMuted ? 'Activer la voix RHONDA' : 'Désactiver la voix RHONDA'}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                !isAudioMuted
                  ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/60'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            id="tab-cockpit"
            onClick={() => onSelectTab('cockpit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'cockpit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Cockpit</span>
          </button>

          <button
            id="tab-master-arch"
            onClick={() => onSelectTab('master-arch')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'master-arch'
                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/15'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Master Architecture</span>
          </button>

          <button
            id="tab-v1-validation"
            onClick={() => onSelectTab('v1-validation')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'v1-validation'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>v1.0 Validation</span>
          </button>

          <button
            id="tab-phases"
            onClick={() => onSelectTab('phases')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'phases'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Les 10 Phases</span>
          </button>

          <button
            id="tab-security"
            onClick={() => onSelectTab('security')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Outils & Sécurité</span>
          </button>

          <button
            id="tab-memory"
            onClick={() => onSelectTab('memory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'memory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL</span>
          </button>

          <button
            id="tab-diagnostics"
            onClick={() => onSelectTab('diagnostics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnostic</span>
          </button>

          <button
            id="tab-telegram"
            onClick={() => onSelectTab('telegram')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'telegram'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
