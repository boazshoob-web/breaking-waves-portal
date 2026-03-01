'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Calendar, Users, Search, Download } from 'lucide-react';

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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchReports();
  }, [teamFilter, dateFrom, dateTo]);

  const fetchReports = async () => {
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

  // Extract unique teams from reports for filter
  const teams = Array.from(
    new Map(reports.map((r) => [r.team.id, r.team])).values()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">הדוחות שלי</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">הדוחות שלי</h1>
          <p className="page-subtitle">צפייה וניהול דוחות הפעילות שלך</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/reports/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            דוח פעילות חדש
          </Link>
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
                  <option key={t.id} value={t.id}>{t.name}</option>
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
          <table className="table">
            <thead>
              <tr>
                <th>מס׳</th>
                <th>תאריך</th>
                <th>צוות</th>
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
                  <td>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      {report._count.participants}
                    </div>
                  </td>
                  <td>
                    <Link
                      href={`/reports/${report.id}`}
                      className="p-2 text-ocean-blue hover:bg-ocean-blue/10 rounded-lg inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reports.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">אין דוחות עדיין</p>
              <Link href="/reports/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                צור דוח ראשון
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
