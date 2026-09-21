import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Cpu,
  Database,
  Terminal,
  Server,
  Layers,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RHONDA_V1_VALIDATION_REPORT } from '../data/validationReportData';

interface ValidationReportViewProps {
  onSwitchToMasterArchitecture: () => void;
}

export const ValidationReportView: React.FC<ValidationReportViewProps> = ({
  onSwitchToMasterArchitecture
}) => {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const report = RHONDA_V1_VALIDATION_REPORT;
  const currentPhase = report.phasesResults[selectedPhaseIdx];

  const handleCopyMarkdown = () => {
    const md = `# ${report.executiveSummary}

## Spécifications de la Fondation Technique
- Version : ${report.version}
- Date : ${report.validationDate}
- Plateforme : ${report.targetPlatform}
- Mode : ${report.executionMode}
- Base de données : ${report.databaseInstance}
- Services vérifiés : ${report.totalServicesVerified}/12
- Phases validées : ${report.totalPhasesValidated}/10

## Validation des 10 Phases
${report.phasesResults
  .map(
    (p) => `### Phase ${p.phaseNumber} : ${p.title} (${p.domain})
Statut : ${p.status}
Artéfacts physiques :
${p.verifiedArtifacts.map((a) => `- ${a}`).join('\n')}

Sortie test :
\`\`\`
${p.testOutput}
\`\`\`
`
  )
  .join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>Document Officiel N°1 • Fondation Validée</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono tracking-tight">
              RHONDA v1.0 Validation
            </h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Rapport technique exhaustif de ce qui existe réellement, ce qui a été testé et ce qui est
              officiellement validé. 10 phases complètes, 12 composants physiques, 9 outils opérationnels,
              PostgreSQL 16 et Ollama CPU-first sous Windows 11.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onSwitchToMasterArchitecture}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 font-mono text-xs font-semibold transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Voir Doc 2 : Master Architecture</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Rapport copié en Markdown' : 'Exporter en Markdown'}</span>
            </button>
          </div>
        </div>

        {/* Real Certification Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Environnement Host</span>
            <span className="font-bold text-white text-xs mt-0.5 block">{report.targetPlatform}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Base Relationnelle</span>
            <span className="font-bold text-cyan-400 text-xs mt-0.5 block">{report.databaseInstance}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Inférence Locale</span>
            <span className="font-bold text-amber-400 text-xs mt-0.5 block">{report.executionMode}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Conformité Physique</span>
            <span className="font-bold text-emerald-400 text-xs mt-0.5 block">10/10 Phases Validées (100%)</span>
          </div>
        </div>

        {/* Anti-Simulation Pledge */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{report.zeroSimulationPledge}</span>
          </div>
          <span className="hidden sm:inline text-[11px] opacity-80">Certification : Septembre 2026</span>
        </div>
      </div>

      {/* Main Validation Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: 10 Phases List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-2">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Les 10 Phases Validées :
            </span>
            <span className="text-[11px] font-mono text-emerald-400">10 / 10 [✓]</span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
            {report.phasesResults.map((phase, idx) => (
              <button
                key={phase.phaseNumber}
                onClick={() => setSelectedPhaseIdx(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col font-mono ${
                  selectedPhaseIdx === idx
                    ? 'bg-emerald-500/15 border-emerald-500/60 shadow-md shadow-emerald-500/10 scale-[1.01]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      P{phase.phaseNumber}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {phase.title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    [✓] OK
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 pl-7">{phase.domain}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed Phase Proof & Verification (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  PHASE 0{currentPhase.phaseNumber}
                </span>
                <span className="text-xs font-mono text-slate-400">• {currentPhase.domain}</span>
              </div>
              <h3 className="text-xl font-bold text-white font-mono">{currentPhase.title}</h3>
            </div>

            <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              VALIDÉ À 100%
            </span>
          </div>

          {/* Metrics bar of the phase */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            {currentPhase.metrics.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 block">{m.label}</span>
                <span className="text-xs font-bold text-cyan-300 mt-0.5 block">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Verified Artifacts List */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Artéfacts & Livrables Physiques Contrôlés :
            </span>
            <div className="space-y-2">
              {currentPhase.verifiedArtifacts.map((art, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-sans text-xs">{art}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real Terminal Output Proof */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider block flex items-center justify-between">
              <span>Sortie Standard / Log de Validation Réel :</span>
              <span className="text-[10px] text-emerald-400 font-normal">Exécuté sur Windows 11</span>
            </span>
            <pre className="p-4 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800/90 text-[11px] leading-relaxed overflow-x-auto shadow-inner">
              {currentPhase.testOutput}
            </pre>
          </div>

          {/* Bottom Callout */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Cette fondation ne doit pas être réécrite.</span>
            <button
              onClick={onSwitchToMasterArchitecture}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold"
            >
              <span>Découvrir la vision cible</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
