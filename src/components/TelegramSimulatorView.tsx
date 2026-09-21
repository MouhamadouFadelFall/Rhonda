import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  Wifi
} from 'lucide-react';
import { db } from '../services/dbStorage';
import { TelegramMessage } from '../types';

export const TelegramSimulatorView: React.FC = () => {
  const [messages, setMessages] = useState<TelegramMessage[]>(db.getTelegramMessages());
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg: TelegramMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputVal('');
    setIsTyping(true);

    // Simulate Bot response through Rhonda Core
    setTimeout(() => {
      let botReply = '';
      let authReq: TelegramMessage['authorization_request'] = undefined;

      const t = text.toLowerCase();
      if (t === '/start') {
        botReply =
          'Bonjour ! Je suis RHONDA, votre ordinateur de bord personnel.\n\nCommandes disponibles :\n/status — État de la machine et conteneurs\n/tasks — Tâches récentes\n/projects — Projets actifs\n/help — Aide et sécurité\n\nVous pouvez également me donner des instructions directes en langage naturel.';
      } else if (t === '/status' || t.includes('etat') || t.includes('état')) {
        botReply =
          '📊 Diagnostic RHONDA distant :\n• Machine : Windows 11 (Host)\n• CPU : 16% (Intel i7, 4 threads Ollama)\n• RAM : 6.2 Go / 16 Go\n• PostgreSQL : rhonda_db (Docker Up)\n• Ollama : 0.34.2 (qwen3:0.6b prêt)\n• Statut : ● READY (CPU-first)';
      } else if (t === '/tasks') {
        botReply =
          '📋 Dernières tâches enregistrées :\n• #TK-8493 : Recherche PDF Documents (Complétée)\n• #TK-3912 : Analyse statistique R Kolda (Complétée)';
      } else if (t === '/projects') {
        botReply =
          '📁 Projets actifs :\n1. Projet Kolda (14 fichiers)\n2. RHONDA System Core (48 fichiers)';
      } else if (t.includes('supprime') || t.includes('delete')) {
        botReply =
          '⚠️ ACTION SENSIBLE DÉTECTÉE (Risque HIGH) :\nSuppression du répertoire temp.\n\nPour des raisons de sécurité, votre confirmation explicite est requise :';
        authReq = {
          action_id: `auth-${Date.now()}`,
          action_name: 'Supprimer dossier temp',
          risk_level: 'HIGH'
        };
      } else {
        botReply = `Message transmis à RHONDA Core :\n« ${text} »\n\nTraitement effectué et consigné dans l'audit PostgreSQL.`;
      }

      const botMsg: TelegramMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'rhonda',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        authorization_request: authReq
      };

      const finalMsgs = [...newMsgs, botMsg];
      setMessages(finalMsgs);
      db.saveTelegramMessages(finalMsgs);
      setIsTyping(false);
    }, 700);
  };

  const handleAuthorizationResponse = (msgId: string, confirmed: boolean) => {
    const updated = messages.map((m) => {
      if (m.id === msgId && m.authorization_request) {
        return {
          ...m,
          authorization_request: {
            ...m.authorization_request,
            confirmed
          }
        };
      }
      return m;
    });

    const followUp: TelegramMessage = {
      id: `msg-${Date.now()}`,
      sender: 'rhonda',
      text: confirmed
        ? '✓ Action autorisée. Commande transmise à l’Agent Engine local pour exécution et vérification.'
        : '⛔ Action refusée. Opération annulée et tracée dans le registre d’audit.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const result = [...updated, followUp];
    setMessages(result);
    db.saveTelegramMessages(result);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Smartphone className="w-4 h-4" />
            <span>Phase 9 — Connectivité Distante Sécurisée</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
            Passerelle Telegram & Interface Distante
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Telegram n'est pas le Core, c'est une interface d'accès distant. Chaque commande suit le même pipeline de
            sécurité et de validation que l'ordinateur de bord local.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Bot : <strong className="text-white">@RhondaBot</strong></span>
          <span className="text-emerald-400 font-bold ml-2">● En ligne</span>
        </div>
      </div>

      {/* Main Grid: Info + Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Security rules & Architecture (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Garanties de Sécurité Distante</span>
            </h3>

            <div className="space-y-3 text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-cyan-400 block mb-1">1. Liste blanche stricte (Telegram User ID) :</span>
                Seul l'identifiant Telegram du propriétaire est autorisé à envoyer des instructions. Tout inconnu est
                rejeté immédiatement.
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-cyan-400 block mb-1">2. Confirmation à distance interactive :</span>
                Les actions sensibles (HIGH / CRITICAL) déclenchent un message spécial avec boutons cryptographiquement
                liés à la tâche.
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-cyan-400 block mb-1">3. Résilience & Découplage :</span>
                Si la connexion Internet est coupée, RHONDA continue de fonctionner normalement sur le PC local.
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl font-mono text-xs">
            <span className="text-slate-400 font-bold block mb-2">Flux de Données Phase 9 :</span>
            <pre className="text-cyan-300 text-[11px] leading-relaxed p-3 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto">
{`Telegram (Smartphone)
       │
Telegram Bot Adapter (@RhondaBot)
       │
Vérification Auth & Rate Limit
       │
RHONDA Core API (127.0.0.1:8000)
       │
Agent Engine ──> Windows PC ──> Résultat`}
            </pre>
          </div>
        </div>

        {/* Right Side: Phone Mockup (6 cols) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-[360px] h-[640px] bg-slate-950 rounded-[40px] border-4 border-slate-800 p-3 shadow-2xl flex flex-col relative ring-1 ring-slate-700/50">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 shrink-0" />

            {/* Telegram Header */}
            <div className="px-4 py-2 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between shrink-0 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-xs text-white">
                  RH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">RHONDA</h4>
                  <span className="text-[10px] text-cyan-400 font-mono">bot officiel</span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-1 py-2 space-y-3 font-mono text-xs scrollbar-none">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                    {/* Interactive Authorization Buttons in Telegram message */}
                    {m.authorization_request && m.authorization_request.confirmed === undefined && (
                      <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
                        <button
                          onClick={() => handleAuthorizationResponse(m.id, true)}
                          className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-[11px] font-bold text-white text-center"
                        >
                          [Autoriser]
                        </button>
                        <button
                          onClick={() => handleAuthorizationResponse(m.id, false)}
                          className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-slate-300 text-center"
                        >
                          [Refuser]
                        </button>
                      </div>
                    )}

                    <div className="text-[9px] text-right mt-1 opacity-60">{m.timestamp}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-[11px] text-cyan-400 font-mono animate-pulse pl-2">
                  RHONDA est en train d'écrire...
                </div>
              )}
            </div>

            {/* Quick Action Chips inside phone */}
            <div className="py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 font-mono text-[10px]">
              <button
                onClick={() => handleSend('/status')}
                className="px-2 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 whitespace-nowrap"
              >
                /status
              </button>
              <button
                onClick={() => handleSend('/tasks')}
                className="px-2 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 whitespace-nowrap"
              >
                /tasks
              </button>
              <button
                onClick={() => handleSend('/projects')}
                className="px-2 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 whitespace-nowrap"
              >
                /projects
              </button>
              <button
                onClick={() => handleSend('Supprime le dossier temp')}
                className="px-2 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900 whitespace-nowrap"
              >
                Supprimer temp
              </button>
            </div>

            {/* Phone Input Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message à RHONDA..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
