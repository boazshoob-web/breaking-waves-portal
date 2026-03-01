'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Calendar, Users, Search, Trash2, FileText, Download } from 'lucide-react';

interface Report {
  id: string;
  activityNumber: number;
  date: string;
  team: { id: string; name: string };
  primarySkipper: { id: string; fullName: string };
  secondarySkipper: { id: string; fullName: string } | null;
  _count: { participants: number };
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reports/teams')
      .then((r) => r.json())
      .then(setTeams);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [teamFilter, dateFrom, dateTo]);

  const fetchReports = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (teamFilter) params.set('teamId', teamFilter);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    const res = await fetch(`/api/reports?${params}`);
    if (res.ok) {
      setReports(await res.json());
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">כל הדוחות</h1>
          <p className="text-gray-600 mt-1">ניהול וצפייה בכל דוחות הפעילות</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/api/reports/export?${new URLSearchParams({
              ...(teamFilter ? { teamId: teamFilter } : {}),
              ...(dateFrom ? { dateFrom } : {}),
              ...(dateTo ? { dateTo } : {}),
            }).toString()}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            ייצוא Excel
          </a>
          <div className="flex items-center gap-2 text-gray-500">
            <FileText className="w-5 h-5" />
            <span className="font-medium">{reports.length} דוחות</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="input-label">סינון לפי צוות</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="select-field"
            >
              <option value="">כל הצוותים</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">מתאריך</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field"
              dir="ltr"
            />
          </div>
          <div>
            <label className="input-label">עד תאריך</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
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
                  <th>מס׳</th>
                  <th>תאריך</th>
                  <th>צוות</th>
                  <th>סקיפר ראשי</th>
                  <th>משתתפים</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="font-medium">{report.activityNumber}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(report.date).toLocaleDateString('he-IL')}
                      </div>
                    </td>
                    <td>{report.team.name}</td>
                    <td>{report.primarySkipper.fullName}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {report._count.participants}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/reports/${report.id}`}
                          className="p-2 text-ocean-blue hover:bg-ocean-blue/10 rounded-lg inline-flex"
                          title="צפייה"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {deleteId === report.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(report.id)}
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
                            onClick={() => setDeleteId(report.id)}
                            className="p-2 text-error-red hover:bg-error-red/10 rounded-lg inline-flex"
                            title="מחיקה"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reports.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">אין דוחות להצגה</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
