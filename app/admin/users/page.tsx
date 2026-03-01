'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Eye, Shield, ShieldCheck } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  onboardingStatus: string;
  licenseType: string | null;
  createdAt: string;
  _count: { reportsAsPrimary: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);

    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) setUsers(await res.json());
    setIsLoading(false);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'מאושר';
      case 'IN_PROGRESS': return 'בתהליך';
      default: return 'ממתין';
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'IN_PROGRESS': return 'badge-warning';
      default: return 'badge-default';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ניהול משתמשים</h1>
          <p className="text-gray-600 mt-1">צפייה וניהול כל המשתמשים במערכת</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Users className="w-5 h-5" />
          <span className="font-medium">{users.length} משתמשים</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="input-label">חיפוש</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="שם או אימייל..."
                className="input-field pr-10"
              />
            </div>
          </div>
          <div>
            <label className="input-label">תפקיד</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select-field"
            >
              <option value="">כל התפקידים</option>
              <option value="USER">משתמש</option>
              <option value="ADMIN">מנהל</option>
            </select>
          </div>
          <div>
            <label className="input-label">סטטוס Onboarding</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field"
            >
              <option value="">כל הסטטוסים</option>
              <option value="PENDING">ממתין</option>
              <option value="IN_PROGRESS">בתהליך</option>
              <option value="APPROVED">מאושר</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                  <th>שם מלא</th>
                  <th>אימייל</th>
                  <th>תפקיד</th>
                  <th>סטטוס</th>
                  <th>דוחות</th>
                  <th>הצטרפות</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium">{user.fullName}</td>
                    <td className="text-gray-500">{user.email}</td>
                    <td>
                      <span className="flex items-center gap-1">
                        {user.role === 'ADMIN' ? (
                          <ShieldCheck className="w-4 h-4 text-ocean-blue" />
                        ) : (
                          <Shield className="w-4 h-4 text-gray-400" />
                        )}
                        {user.role === 'ADMIN' ? 'מנהל' : 'משתמש'}
                      </span>
                    </td>
                    <td>
                      <span className={statusBadge(user.onboardingStatus)}>
                        {statusLabel(user.onboardingStatus)}
                      </span>
                    </td>
                    <td>{user._count.reportsAsPrimary}</td>
                    <td className="text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('he-IL')}
                    </td>
                    <td>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-2 text-ocean-blue hover:bg-ocean-blue/10 rounded-lg inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-500 py-8">לא נמצאו משתמשים</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
