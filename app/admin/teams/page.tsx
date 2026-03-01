'use client';

import { useState, useEffect } from 'react';
import { Anchor, Plus, Edit, Trash2, Users, FileText } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  _count: { participants: number; reports: number };
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await fetch('/api/admin/teams');
    if (res.ok) setTeams(await res.json());
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      const team = await res.json();
      setTeams([...teams, team]);
      setNewName('');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const res = await fetch(`/api/admin/teams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    });
    if (res.ok) {
      setTeams(teams.map((t) => (t.id === id ? { ...t, name: editName.trim() } : t)));
      setEditId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/teams/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTeams(teams.filter((t) => t.id !== id));
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ניהול צוותים</h1>
          <p className="text-gray-600 mt-1">יצירה, עריכה ומחיקה של צוותים</p>
        </div>
      </div>

      {/* Add Team */}
      <div className="card mb-6">
        <h3 className="font-bold text-gray-800 mb-3">הוספת צוות חדש</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="שם הצוות..."
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            הוספה
          </button>
        </div>
      </div>

      {/* Teams List */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner" />
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Anchor className="w-5 h-5 text-ocean-blue" />
                  {editId === team.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-field py-1 px-2"
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(team.id)}
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(team.id)}
                        className="text-sm px-3 py-1 bg-ocean-blue text-white rounded"
                      >
                        שמור
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded"
                      >
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <span className="font-medium text-gray-800">{team.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {team._count.participants} משתתפים
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {team._count.reports} דוחות
                    </span>
                  </div>

                  {editId !== team.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditId(team.id);
                          setEditName(team.name);
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {deleteId === team.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(team.id)}
                            className="px-2 py-1 text-xs bg-error-red text-white rounded"
                          >
                            מחק
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                          >
                            ביטול
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(team.id)}
                          className="p-2 text-error-red hover:bg-error-red/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <p className="text-center text-gray-500 py-8">אין צוותים עדיין</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
