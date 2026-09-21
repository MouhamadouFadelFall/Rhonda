import React, { useState } from 'react';
import {
  ShieldAlert,
  Wrench,
  Key,
  Lock,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { db } from '../services/dbStorage';
import { RegisteredTool, RiskLevel } from '../types';

interface SecurityToolsViewProps {
  onTriggerToolTest: (toolName: string, riskLevel: RiskLevel) => void;
}

export const SecurityToolsView: React.FC<SecurityToolsViewProps> = ({ onTriggerToolTest }) => {
  const tools = db.getTools();
  const [selectedTool, setSelectedTool] = useState<RegisteredTool>(tools[0]);
  const [activeTab, setActiveTab] = useState<'tools' | 'matrix' | 'events'>('tools');
  const events = db.getEvents();

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'CRITICAL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Phase 4 & Phase 5 — Agent Engine & Sécurité</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
            Registre des Outils & Matrice de Risque
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            RHONDA ne donne jamais un accès libre au modèle. Chaque outil possède une description formelle, des
            paramètres validés, un niveau de risque et une politique d'autorisation stricte.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'tools' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registre ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'matrix' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matrice de Risque
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'events' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Sécurité
          </button>
        </div>
      </div>

      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tools List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
              Outils Enregistrés ({tools.length}) :
            </span>
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col font-mono ${
                    selectedTool.id === tool.id
                      ? 'bg-cyan-500/15 border-cyan-500/60 shadow-md shadow-cyan-500/10 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{tool.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(tool.default_risk)}`}>
                      {tool.default_risk}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tool Inspector Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white font-mono">{selectedTool.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 block mt-1">
                    Catégorie : <span className="text-cyan-400 uppercase">{selectedTool.category}</span>
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${getRiskBadge(
                      selectedTool.default_risk
                    )}`}
                  >
                    Risque : {selectedTool.default_risk}
                  </span>
                  {selectedTool.requires_authorization && (
                    <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Accord utilisateur requis
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                <span className="text-slate-400 block mb-1 font-bold">Rôle & Comportement :</span>
                {selectedTool.description}
              </div>

              {/* Paramètres requis */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Spécification des Paramètres :
                </span>
                {selectedTool.parameters.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTool.parameters.map((param, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-slate-300 flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-300 font-bold">{param.name}</span>
                            <span className="text-[10px] text-slate-400">({param.type})</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{param.description}</p>
                        </div>
                        {param.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">
                            Requis
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 font-mono">
                    Aucun paramètre supplémentaire requis (interrogation globale).
                  </div>
                )}
              </div>

              {/* Exemple d'appel sécurisé */}
              {selectedTool.sample_call && (
                <div className="space-y-1 font-mono text-xs">
                  <span className="text-slate-400 font-bold block">Signature d'appel validée :</span>
                  <pre className="p-3 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 overflow-x-auto text-[11px]">
                    {selectedTool.sample_call}
                  </pre>
                </div>
              )}
            </div>

            {/* Test in Sandbox Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                L'appel sera vérifié par la politique de sécurité RHONDA.
              </span>
              <button
                onClick={() => onTriggerToolTest(selectedTool.name, selectedTool.default_risk)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Tester dans le Cockpit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matrice de Risque Tab */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white font-mono">Matrice des Niveaux de Risque & Permissions</h3>
            <span className="text-xs text-slate-400 font-mono">Politique Phase 5 stricte</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">LOW</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200">Autonome</span>
              </div>
              <h4 className="text-sm font-bold text-white">Lecture & Consultation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lire un fichier, rechercher des PDF, interroger l'état système, capture d'écran.
              </p>
              <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400">
                ✓ Exécution directe autorisée
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">MEDIUM</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/30 text-amber-200">Audit</span>
              </div>
              <h4 className="text-sm font-bold text-white">Création & Écriture</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Créer un nouveau répertoire, écrire un rapport, lancer un calcul Python ou R local.
              </p>
              <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-400">
                ✓ Journalisation obligatoire
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">HIGH</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/30 text-rose-200">Confirmation</span>
              </div>
              <h4 className="text-sm font-bold text-white">Suppression & Modification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Supprimer un dossier, écraser des fichiers multiples, exécuter une commande terminal libre.
              </p>
              <div className="pt-2 border-t border-rose-500/20 text-[11px] text-rose-400">
                ⚠️ Modal d'autorisation obligatoire
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">CRITICAL</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">Verrouillé</span>
              </div>
              <h4 className="text-sm font-bold text-white">Administration Système</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Modification du registre Windows, arrêt machine, manipulation de partitions de disque.
              </p>
              <div className="pt-2 border-t border-purple-500/20 text-[11px] text-purple-400">
                ⛔ Verrouillage & double confirmation
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Security Logs */}
      {activeTab === 'events' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Journal d'Audit des Événements & Autorisations</h3>
            <span className="text-slate-400">PostgreSQL table: system_events</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      evt.level === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : evt.level === 'ERROR'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {evt.event_type}
                  </span>
                  <div>
                    <p className="text-slate-200 text-xs">{evt.details}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Source : {evt.source} {evt.task_id && `| Tâche : ${evt.task_id}`}
                    </span>
                  </div>
                </div>
                <span className="text-slate-400 text-[11px] shrink-0">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
