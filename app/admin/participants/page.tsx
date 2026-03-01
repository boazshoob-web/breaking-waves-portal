'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  name: string;
  active: boolean;
  team: { id: string; name: string } | null;
  _count: { reports: number };
}

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  // New participant form
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTeamId, setNewTeamId] = useState('');

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTeamId, setEditTeamId] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/teams')
      .then((r) => r.json())
      .then(setTeams);
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [search, teamFilter]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (teamFilter) params.set('teamId', teamFilter);

    const res = await fetch(`/api/admin/participants?${params}`);
    if (res.ok) setParticipants(await res.json());
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch('/api/admin/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), teamId: newTeamId || null }),
    });
    if (res.ok) {
      const p = await res.json();
      setParticipants([p, ...participants]);
      setNewName('');
      setNewTeamId('');
      setShowForm(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/admin/participants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), teamId: editTeamId || null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setParticipants(
        participants.map((p) =>
          p.id === id ? { ...p, name: updated.name, team: updated.team } : p
        )
      );
      setEditId(null);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const res = await fetch(`/api/admin/participants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) {
      setParticipants(participants.map((p) => (p.id === id ? { ...p, active: !active } : p)));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/participants/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setParticipants(participants.filter((p) => p.id !== id));
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ניהול משתתפים</h1>
          <p className="text-gray-600 mt-1">ניהול רשימת המשתתפים בפעילויות</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          משתתף חדש
        </button>
      </div>

      {/* Add Participant Form */}
      {showForm && (
        <div className="card mb-6 border-2 border-ocean-blue/20">
          <h3 className="font-bold text-gray-800 mb-3">הוספת משתתף חדש</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="שם המשתתף..."
              className="input-field"
            />
            <select
              value={newTeamId}
              onChange={(e) => setNewTeamId(e.target.value)}
              className="select-field"
            >
              <option value="">ללא צוות</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={handleCreate} className="btn-primary flex-1">
                הוספה
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">חיפוש</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="שם משתתף..."
                className="input-field pr-10"
              />
            </div>
          </div>
          <div>
            <label className="input-label">סינון לפי צוות</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="select-field"
            >
              <option value="">כל הצוותים</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner" />
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>שם</th>
                  <th>צוות</th>
                  <th>סטטוס</th>
                  <th>דוחות</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className={!p.active ? 'opacity-50' : ''}>
                    <td>
                      {editId === p.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field py-1 px-2"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{p.name}</span>
                      )}
                    </td>
                    <td>
                      {editId === p.id ? (
                        <select
                          value={editTeamId}
                          onChange={(e) => setEditTeamId(e.target.value)}
                          className="select-field py-1"
                        >
                          <option value="">ללא צוות</option>
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-600">{p.team?.name || 'ללא צוות'}</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(p.id, p.active)}
                        className={`flex items-center gap-1 text-sm ${
                          p.active ? 'text-success-green' : 'text-gray-400'
                        }`}
                      >
                        {p.active ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {p.active ? 'פעיל' : 'לא פעיל'}
                      </button>
                    </td>
                    <td>{p._count.reports}</td>
                    <td>
                      {editId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUpdate(p.id)}
                            className="px-2 py-1 text-xs bg-ocean-blue text-white rounded"
                          >
                            שמור
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                          >
                            ביטול
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditId(p.id);
                              setEditName(p.name);
                              setEditTeamId(p.team?.id || '');
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {deleteId === p.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(p.id)}
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
                              onClick={() => setDeleteId(p.id)}
                              className="p-2 text-error-red hover:bg-error-red/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {participants.length === 0 && (
              <p className="text-center text-gray-500 py-8">אין משתתפים להצגה</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
