'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Anchor,
  Clock,
  AlertTriangle,
  FileText,
  ArrowLeft,
} from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  pendingOnboarding: number;
  reportsThisMonth: number;
  activeTeams: number;
  recentReports: {
    id: string;
    activityNumber: number;
    date: string;
    team: { name: string };
    primarySkipper: { fullName: string };
  }[];
  recentUsers: {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
    onboardingStatus: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-ocean-blue" />
        <h1 className="text-2xl font-bold text-gray-800">דשבורד ניהולי</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/users" className="card text-center hover:shadow-md transition-shadow">
          <Users className="w-8 h-8 text-ocean-blue mx-auto mb-2" />
          <p className="text-3xl font-bold text-ocean-blue">{data.totalUsers}</p>
          <p className="text-gray-600 mt-1">משתמשים</p>
        </Link>
        <Link href="/admin/onboarding" className="card text-center hover:shadow-md transition-shadow">
          <Clock className="w-8 h-8 text-warning-orange mx-auto mb-2" />
          <p className="text-3xl font-bold text-warning-orange">{data.pendingOnboarding}</p>
          <p className="text-gray-600 mt-1">ממתינים ל-Onboarding</p>
        </Link>
        <Link href="/admin/reports" className="card text-center hover:shadow-md transition-shadow">
          <ClipboardList className="w-8 h-8 text-success-green mx-auto mb-2" />
          <p className="text-3xl font-bold text-success-green">{data.reportsThisMonth}</p>
          <p className="text-gray-600 mt-1">דוחות החודש</p>
        </Link>
        <Link href="/admin/teams" className="card text-center hover:shadow-md transition-shadow">
          <Anchor className="w-8 h-8 text-ocean-blue mx-auto mb-2" />
          <p className="text-3xl font-bold text-ocean-blue">{data.activeTeams}</p>
          <p className="text-gray-600 mt-1">צוותים פעילים</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-ocean-blue" />
              דוחות אחרונים
            </h2>
            <Link href="/admin/reports" className="text-sm text-ocean-blue hover:underline flex items-center gap-1">
              הכל
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          {data.recentReports.length > 0 ? (
            <div className="space-y-3">
              {data.recentReports.map((r) => (
                <Link
                  key={r.id}
                  href={`/reports/${r.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      דוח #{r.activityNumber} — {r.team.name}
                    </p>
                    <p className="text-sm text-gray-500">{r.primarySkipper.fullName}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(r.date).toLocaleDateString('he-IL')}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">אין דוחות עדיין</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-ocean-blue" />
              משתמשים חדשים
            </h2>
            <Link href="/admin/users" className="text-sm text-ocean-blue hover:underline flex items-center gap-1">
              הכל
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          {data.recentUsers.length > 0 ? (
            <div className="space-y-3">
              {data.recentUsers.map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{u.fullName}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <span
                    className={`badge-${
                      u.onboardingStatus === 'APPROVED'
                        ? 'success'
                        : u.onboardingStatus === 'IN_PROGRESS'
                        ? 'warning'
                        : 'default'
                    }`}
                  >
                    {u.onboardingStatus === 'APPROVED'
                      ? 'מאושר'
                      : u.onboardingStatus === 'IN_PROGRESS'
                      ? 'בתהליך'
                      : 'ממתין'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">אין משתמשים עדיין</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {data.pendingOnboarding > 0 && (
        <div className="card mt-6 bg-warning-orange/5 border border-warning-orange/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-warning-orange flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">
                {data.pendingOnboarding} משתמשים ממתינים לאישור Onboarding
              </p>
              <Link href="/admin/onboarding" className="text-sm text-ocean-blue hover:underline">
                עבור לניהול Onboarding
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
