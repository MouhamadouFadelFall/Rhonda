import React from 'react';
import { ShieldAlert, AlertTriangle, Key, CheckCircle, XCircle } from 'lucide-react';
import { RhondaTask } from '../types';

interface AuthorizationModalProps {
  isOpen: boolean;
  task: RhondaTask | null;
  stepIndex: number;
  onConfirm: () => void;
  onDeny: () => void;
}

export const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  isOpen,
  task,
  stepIndex,
  onConfirm,
  onDeny
}) => {
  if (!isOpen || !task) return null;

  const currentStep = task.plan.steps[stepIndex] || task.plan.steps[0];
  const riskLevel = currentStep?.risk_level || task.plan.risk_level;
  const token = `AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950/40 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Autorisation de Sécurité Requise</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50">
                {riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              RHONDA a suspendu l'exécution et sollicite votre accord explicite avant d'agir sur le système.
            </p>
          </div>
        </div>

        {/* Action Details Box */}
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2 mb-4 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Tâche ID :</span>
            <span className="text-slate-200 font-bold">{task.id}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Action ciblée :</span>
            <span className="text-amber-300 font-semibold">{currentStep?.action}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Outil requis :</span>
            <span className="text-cyan-400">{currentStep?.tool}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 text-slate-300">
            <span className="text-slate-400 block mb-1">Description opérationnelle :</span>
            <p className="bg-slate-900/90 p-2 rounded border border-slate-800 text-slate-200">
              {currentStep?.description}
            </p>
          </div>
          {currentStep?.parameters && (
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              <span className="block mb-1">Paramètres :</span>
              <pre className="text-[11px] bg-slate-900 p-2 rounded text-slate-300 overflow-x-auto">
                {JSON.stringify(currentStep.parameters, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Security verification token */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 mb-6">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Jeton cryptographique unique :</span>
          </div>
          <span className="font-mono text-cyan-300 font-medium">{token}</span>
        </div>

        {/* Warning Banner */}
        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Cette opération modifiera des ressources locales sur votre PC. Vérifiez que la cible correspond à votre intention.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="btn-auth-deny"
            onClick={onDeny}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Refuser l'action</span>
          </button>

          <button
            id="btn-auth-confirm"
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Autoriser l'exécution</span>
          </button>
        </div>
      </div>
    </div>
  );
};
