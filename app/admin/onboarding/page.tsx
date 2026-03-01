'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Users } from 'lucide-react';

interface OnboardingUser {
  id: string;
  fullName: string;
  email: string;
  onboardingStatus: string;
  createdAt: string;
  completedItems: number;
  totalRequired: number;
  signatures: number;
  completionPercent: number;
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'ממתין', class: 'badge-warning' },
  IN_PROGRESS: { label: 'בתהליך', class: 'badge-info' },
  APPROVED: { label: 'מאושר', class: 'badge-success' },
};

export default function AdminOnboardingPage() {
  const [users, setUsers] = useState<OnboardingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/onboarding?${params}`);
    if (res.ok) {
      setUsers(await res.json());
    }
    setIsLoading(false);
  };

  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.fullName.includes(search) || u.email.includes(search)
      )
    : users;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-ocean-blue" />
        <h1 className="text-2xl font-bold text-gray-800">ניהול Onboarding</h1>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם או אימייל..."
              className="input-field pr-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field md:w-48"
          >
            <option value="">כל הסטטוסים</option>
            <option value="PENDING">ממתין</option>
            <option value="IN_PROGRESS">בתהליך</option>
            <option value="APPROVED">מאושר</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center !py-4">
          <p className="text-2xl font-bold text-warning-orange">
            {users.filter((u) => u.onboardingStatus === 'PENDING').length}
          </p>
          <p className="text-sm text-gray-600">ממתינים</p>
        </div>
        <div className="card text-center !py-4">
          <p className="text-2xl font-bold text-ocean-blue">
            {users.filter((u) => u.onboardingStatus === 'IN_PROGRESS').length}
          </p>
          <p className="text-sm text-gray-600">בתהליך</p>
        </div>
        <div className="card text-center !py-4">
          <p className="text-2xl font-bold text-success-green">
            {users.filter((u) => u.onboardingStatus === 'APPROVED').length}
          </p>
          <p className="text-sm text-gray-600">מאושרים</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>סטטוס</th>
              <th>השלמה</th>
              <th>חתימות</th>
              <th>תאריך רישום</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const statusInfo = STATUS_LABELS[user.onboardingStatus] || STATUS_LABELS.PENDING;
              return (
                <tr key={user.id}>
                  <td className="font-medium">{user.fullName}</td>
                  <td dir="ltr" className="text-sm">{user.email}</td>
                  <td>
                    <span className={`badge ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-ocean-blue rounded-full"
                          style={{ width: `${user.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {user.completionPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center">{user.signatures}/2</td>
                  <td className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td>
                    <Link
                      href={`/admin/onboarding/${user.id}`}
                      className="p-2 text-ocean-blue hover:bg-ocean-blue/10 rounded-lg inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 py-8">אין משתמשים להצגה</p>
        )}
      </div>
    </div>
  );
}
