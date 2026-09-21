import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  MapPin,
  Mic,
  ArrowDown,
  ArrowRight,
  Sparkles,
  FileCheck,
  AlertOctagon,
  Workflow,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import {
  RHONDA_MOTTO,
  GOLDEN_RULES,
  TARGET_PIPELINE_FLOW,
  GEOSPATIAL_PIPELINE_FLOW,
  MASTER_ARCHITECTURE_SECTIONS
} from '../data/masterArchitectureData';

interface MasterArchitectureViewProps {
  onSwitchToValidation: () => void;
}

export const MasterArchitectureView: React.FC<MasterArchitectureViewProps> = ({
  onSwitchToValidation
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('core-centrality');
  const [copiedFlow, setCopiedFlow] = useState<string | null>(null);

  const currentSection =
    MASTER_ARCHITECTURE_SECTIONS.find((s) => s.id === activeSectionId) ||
    MASTER_ARCHITECTURE_SECTIONS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFlow(id);
    setTimeout(() => setCopiedFlow(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-fade-in">
      {/* Top Banner: Master Architecture Header */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Document Officiel N°2 • Vision Cible</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono tracking-tight">
              RHONDA Master Architecture
            </h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              La vision complète et l’architecture cible du système. RHONDA Core est le cerveau et
              l’orchestrateur central unique. Les interfaces informent, Jarvis assure l’interaction
              naturelle, et les moteurs spécialisés (GeoAutoR, GeoCore) exécutent sous contrôle strict.
            </p>
          </div>

          {/* Action buttons & Cross-link */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onSwitchToValidation}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 font-mono text-xs font-semibold transition-all shadow-md"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Voir Doc 1 : v1.0 Validation</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-cyan-950/70 border border-cyan-800/60 font-mono text-xs text-cyan-300">
              <span className="text-[10px] text-slate-400 block uppercase">Statut Vision</span>
              <span className="font-bold">Orchestrateur Central</span>
            </div>
          </div>
        </div>

        {/* Fundamental Motto Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center font-mono text-xs lg:text-sm text-cyan-300 font-semibold tracking-wide shadow-inner">
          {RHONDA_MOTTO}
        </div>
      </div>

      {/* The 4 Golden Rules of Evolution (CRITICAL MANDATES) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span>Les 4 Règles Cardinales pour la Suite</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GOLDEN_RULES.map((rule) => (
            <div
              key={rule.number}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors shadow-lg flex flex-col justify-between font-mono"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-cyan-400">RÈGLE {rule.number}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400">INVIOLABLE</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{rule.rule}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{rule.meaning}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Préservation de l'existant</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fundamental Evolution Principle Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/50 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                Principe pour toutes les prochaines évolutions
              </span>
              <p className="text-sm font-mono font-bold text-white tracking-tight mt-0.5">
                « Améliorer avant d’ajouter. Ne rien inventer. Zéro régression. Tout ce qui est annoncé doit être réellement exécuté et vérifié. »
              </p>
            </div>
          </div>
          <div className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 font-semibold">
            Cadre de développement garanti
          </div>
        </div>
      </div>

      {/* Target Vision Interactive Diagram: The Unified Pipeline */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Workflow className="w-4 h-4" />
              <span>Pipeline Cible Unifié</span>
            </div>
            <h3 className="text-lg font-bold text-white font-mono">
              De l'Utilisateur au Résultat Vérifié
            </h3>
          </div>
          <button
            onClick={() => handleCopy(TARGET_PIPELINE_FLOW, 'target-flow')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 hover:text-white border border-slate-800 transition-colors self-start sm:self-auto"
          >
            {copiedFlow === 'target-flow' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedFlow === 'target-flow' ? 'Copié !' : 'Copier le schéma'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 font-sans">
          Chaque requête utilisateur passe par les interfaces RHONDA, est arbitrée par l’unique
          RHONDA Core, puise dans les connaissances et agents spécialisés, s’exécute sous le
          contrôle de la politique de sécurité, puis est vérifiée physiquement avant notification.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-tight shadow-inner">
          <pre>{TARGET_PIPELINE_FLOW}</pre>
        </div>
      </div>

      {/* Geospatial Architecture Focus */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Intégration Spécialisée</span>
            </div>
            <h3 className="text-lg font-bold text-white font-mono">
              Chaîne Géospatiale Progressive
            </h3>
          </div>
          <button
            onClick={() => handleCopy(GEOSPATIAL_PIPELINE_FLOW, 'geo-flow')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 hover:text-white border border-slate-800 transition-colors self-start sm:self-auto"
          >
            {copiedFlow === 'geo-flow' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedFlow === 'geo-flow' ? 'Copié !' : 'Copier la chaîne SIG'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-tight">
            <pre>{GEOSPATIAL_PIPELINE_FLOW}</pre>
          </div>

          <div className="lg:col-span-5 space-y-3 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
              Rôle de chaque maillon géospatial :
            </span>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>GeoCatalogue</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Fournit la <strong>connaissance méthodologique et documentaire</strong> (référentiels, fiches
                techniques, catalogues de couches et spécifications).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>GeoAgent</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Représente les <strong>capacités géospatiales spécialisées</strong> (analyse spatiale, sélections,
                croisements, préparation d'algorithmes).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>GeoAutoR / GeoCore</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Restent les <strong>moteurs d’exécution spécialisés déjà développés et validés</strong>.
                Aucune réécriture sans justification technique.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>QGIS MCP / Local Agent</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Fournissent un <strong>accès contrôlé à l’environnement local</strong> (pilotage sécurisé de QGIS,
                fichiers Shapefile, GeoPackage, rasters).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Focus: Jarvis vs RHONDA Core (Anti-Duplication Principle) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-500/30 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Mic className="w-4 h-4" />
          <span>Principe Anti-Duplication du Cerveau</span>
        </div>
        <h3 className="text-lg font-bold text-white font-mono">
          Place Explicite de Jarvis : La Couche d’Interaction Naturelle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
          <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Ce que Jarvis EST :</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                VALIDÉ
              </span>
            </div>
            <ul className="space-y-2 text-slate-300 font-sans text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>La couche d'interaction naturelle de RHONDA (voix, parole, fluidité).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>L'interlocuteur poli et réactif qui accueille l'utilisateur et gère la transcription.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Le canal direct de retour auditif et conversationnel.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Ce que Jarvis N'EST PAS :</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                STRICTEMENT INTERDIT
              </span>
            </div>
            <ul className="space-y-2 text-slate-300 font-sans text-xs">
              <li className="flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Un deuxième cerveau indépendant ou concurrent.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Un ordonnanceur ou un planificateur autonome qui contournerait le Core.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Un gestionnaire de mémoire ou d'outils séparé de PostgreSQL et du registre central.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sections Selector & Deep Architecture Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Piliers de l'Architecture Cible :
          </span>
          <span className="text-xs font-mono text-cyan-400">Sélectionnez un pilier</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {MASTER_ARCHITECTURE_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`p-3.5 rounded-xl border text-left font-mono transition-all flex flex-col justify-between ${
                activeSectionId === sec.id
                  ? 'bg-cyan-500/15 border-cyan-400/80 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-bold block w-fit mb-1.5 border border-slate-800">
                  {sec.badge}
                </span>
                <span className="text-xs font-bold line-clamp-1">{sec.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 line-clamp-1">{sec.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Selected Section Details */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-white font-mono">{currentSection.title}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  {currentSection.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">{currentSection.subtitle}</p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Principe directeur : <strong className="text-cyan-300">Améliorer avant d'ajouter</strong>
            </div>
          </div>

          {/* Section Summary */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
            {currentSection.summary}
          </div>

          {/* ASCII Diagram of section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            <pre>{currentSection.diagramAscii}</pre>
          </div>

          {/* Principles Checklist */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Directives Architecturales Inviolables :
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSection.principles.map((pr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-sans text-xs">{pr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Components list */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Composants Associés :
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentSection.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white text-xs truncate">{comp.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          comp.status === 'CONSTRUIT_ET_VALIDÉ'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : comp.status === 'INTÉGRATION_PROGRESSIVE'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {comp.status === 'CONSTRUIT_ET_VALIDÉ'
                          ? 'Validé v1.0'
                          : comp.status === 'INTÉGRATION_PROGRESSIVE'
                          ? 'En cours'
                          : 'Cible'}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 block mb-1">{comp.role}</span>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
