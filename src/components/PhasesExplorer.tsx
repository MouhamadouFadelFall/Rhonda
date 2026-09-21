import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  ArrowRight,
  BookOpen,
  FileCode,
  Download,
  Terminal
} from 'lucide-react';
import { RHONDA_PHASES } from '../data/phasesData';

export const PhasesExplorer: React.FC = () => {
  const [selectedPhaseNum, setSelectedPhaseNum] = useState<number>(1);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const currentPhase = RHONDA_PHASES.find((p) => p.number === selectedPhaseNum) || RHONDA_PHASES[0];
  const currentCodeFile = currentPhase.codeFiles[selectedFileIdx] || currentPhase.codeFiles[0];

  const handleCopyCode = () => {
    if (currentCodeFile) {
      navigator.clipboard.writeText(currentCodeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Plan de Développement Complet</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
              Les 10 Phases de Conception de RHONDA
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Progression rigoureuse d'un ordinateur de bord personnel CPU-first sous Windows 11. Chaque phase est
              validée par des tests vérifiables avant d'alimenter la suivante.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block">Statut Actuel</span>
              <span className="text-xs font-bold text-emerald-400">v1.0.0 Déployée</span>
            </div>
          </div>
        </div>

        {/* Phase selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
          {RHONDA_PHASES.map((phase) => (
            <button
              key={phase.number}
              onClick={() => {
                setSelectedPhaseNum(phase.number);
                setSelectedFileIdx(0);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap border ${
                selectedPhaseNum === phase.number
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className="w-5 h-5 rounded-lg bg-slate-800/80 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                P{phase.number}
              </span>
              <span>{phase.title.split('—')[1]?.trim() || phase.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Details of the Selected Phase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Overview & Concepts & Architecture (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Phase Card Header */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                PHASE 0{currentPhase.number} / 10
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
                {currentPhase.status}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-mono">{currentPhase.title}</h3>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">{currentPhase.subtitle}</p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-400 font-mono block mb-1">Objectif Spécifié :</span>
              {currentPhase.objective}
            </div>

            {/* Core concepts checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Principes Architecturaux :
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentPhase.coreConcepts.map((concept, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Architecture ASCII Diagram */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl font-mono text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Diagramme Architectural :
            </span>
            <pre className="text-[11px] leading-tight text-cyan-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 overflow-x-auto">
              {currentPhase.architectureDiagram}
            </pre>
          </div>

          {/* Deliverables checklist */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Critères de Fin de Phase :
            </span>
            <div className="space-y-2">
              {currentPhase.validationChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
                >
                  <span className="truncate pr-2">{item.item}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    [✓] VALIDÉ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Codebase and Real Files (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* File Selector Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Fichiers & Code Source Officiel
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copié !' : 'Copier le code'}</span>
            </button>
          </div>

          {/* Sub-tabs for code files */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {currentPhase.codeFiles.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 border ${
                  selectedFileIdx === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          {/* File Metadata Info */}
          {currentCodeFile && (
            <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-slate-300 truncate max-w-[400px]">
                Emplacement : <span className="text-cyan-400">{currentCodeFile.path}</span>
              </span>
              <span className="text-slate-400 text-[11px]">{currentCodeFile.description}</span>
            </div>
          )}

          {/* Code Viewer */}
          <div className="flex-1 p-4 bg-slate-950 overflow-y-auto font-mono text-xs scrollbar-thin">
            {currentCodeFile ? (
              <pre className="text-slate-200 leading-relaxed overflow-x-auto selection:bg-cyan-900 selection:text-cyan-100">
                <code>{currentCodeFile.content}</code>
              </pre>
            ) : (
              <p className="text-slate-400 text-xs">Aucun fichier sélectionné.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
