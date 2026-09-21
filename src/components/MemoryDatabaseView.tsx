import React, { useState } from 'react';
import {
  Database,
  Brain,
  FolderKanban,
  History,
  Plus,
  Trash2,
  FileText,
  Download,
  Search,
  CheckCircle2
} from 'lucide-react';
import { db } from '../services/dbStorage';
import { MemoryItem, ProjectItem, RhondaTask } from '../types';

export const MemoryDatabaseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'memories' | 'projects' | 'history' | 'schema'>('memories');
  const [memories, setMemories] = useState<MemoryItem[]>(db.getMemories());
  const [projects] = useState<ProjectItem[]>(db.getProjects());
  const [tasks] = useState<RhondaTask[]>(db.getTasks());
  const [searchQuery, setSearchQuery] = useState('');

  // Add memory form state
  const [isAddingMem, setIsAddingMem] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('FACT');

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;

    const added = db.addMemory({
      key: newKey.trim(),
      content: newContent.trim(),
      category: newCategory,
      confidence: 1.0
    });

    setMemories([added, ...memories]);
    setNewKey('');
    setNewContent('');
    setIsAddingMem(false);
  };

  const handleDeleteMemory = (id: string) => {
    db.deleteMemory(id);
    setMemories(memories.filter((m) => m.id !== id));
  };

  const filteredMemories = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            <span>Phase 6 — Mémoire Persistante & PostgreSQL</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
            Centre de Données & Mémoire de RHONDA
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            PostgreSQL 16 (rhonda_db) est le centre de stockage unique. Distinction stricte entre : Mémoire (ce que
            RHONDA retient), Historique (ce qui s'est réellement passé) et Projets (contextes de travail).
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'memories' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Mémoire ({memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'projects' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projets ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historique ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'schema' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Schéma SQL</span>
          </button>
        </div>
      </div>

      {/* Tab: Memories */}
      {activeTab === 'memories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans la mémoire..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none"
              />
            </div>

            <button
              onClick={() => setIsAddingMem(!isAddingMem)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Mémoriser un fait</span>
            </button>
          </div>

          {/* Add form */}
          {isAddingMem && (
            <form
              onSubmit={handleAddMemory}
              className="bg-slate-900/90 rounded-2xl border border-cyan-500/40 p-5 shadow-xl space-y-4 font-mono text-xs animate-fade-in"
            >
              <h4 className="font-bold text-white text-sm">Ajouter une nouvelle mémoire dans PostgreSQL</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Clé d'identification :</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="ex: user_preferred_editor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Catégorie :</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MemoryItem['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                  >
                    <option value="FACT">FACT (Fait avéré)</option>
                    <option value="PREFERENCE">PREFERENCE (Choix utilisateur)</option>
                    <option value="DECISION">DECISION (Règle validée)</option>
                    <option value="ENVIRONMENT">ENVIRONMENT (Matériel/OS)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-slate-400 block mb-1">Contenu / Description à retenir :</label>
                  <textarea
                    rows={2}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Contenu permanent que RHONDA doit conserver dans son contexte..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMem(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Enregistrer dans rhonda_db
                </button>
              </div>
            </form>
          )}

          {/* Memories Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between space-y-3 font-mono text-xs hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {mem.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{mem.created_at}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{mem.key}</h4>
                  <p className="text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {mem.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Confiance : {(mem.confidence * 100).toFixed(0)}%</span>
                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    title="Supprimer cette mémoire"
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">{proj.name}</h3>
                    <span className="text-[11px] text-cyan-400 block mt-0.5">ID: {proj.id}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ACTIF
                  </span>
                </div>

                <p className="text-slate-300">{proj.description}</p>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Répertoire racine :</span>
                    <span className="text-slate-200 truncate max-w-[220px]">{proj.directory_path}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Fichiers indexés :</span>
                    <span className="text-cyan-400 font-bold">{proj.files_count}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Dernière activité :</span>
                    <span className="text-slate-200">{proj.last_activity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Historique Réel des Tâches Exécutées</h3>
            <span className="text-slate-400">PostgreSQL table: tasks</span>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-sm">#{task.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-slate-200 font-semibold">{task.request_content}</p>
                  <p className="text-slate-400 text-[11px]">Résultat: {task.result}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span>Intention: {task.intent.name}</span>
                    <span>Date: {task.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">
              Aucune tâche archivée pour le moment. Lancez une commande dans le Cockpit !
            </p>
          )}
        </div>
      )}

      {/* Tab: Schema SQL */}
      {activeTab === 'schema' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span className="font-bold text-white">Schéma Relationnel PostgreSQL 16 (rhonda_db)</span>
            <span>14 tables système</span>
          </div>

          <pre className="text-cyan-300 text-[11px] leading-relaxed p-4 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto">
{`-- RHONDA PostgreSQL 16 Database Schema
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    title VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    conversation_id VARCHAR(64),
    intent_name VARCHAR(64) NOT NULL,
    plan_json JSONB NOT NULL,
    status VARCHAR(32) NOT NULL,
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE memories (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(32) NOT NULL, -- FACT, PREFERENCE, DECISION, ENVIRONMENT
    key VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_events (
    id VARCHAR(64) PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    task_id VARCHAR(64),
    source VARCHAR(32) NOT NULL,
    level VARCHAR(16) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
          </pre>
        </div>
      )}
    </div>
  );
};
