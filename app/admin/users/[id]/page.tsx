'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Shield,
  Anchor,
  Calendar,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  onboardingStatus: string;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseFilePath: string | null;
  sailingExperience: string | null;
  createdAt: string;
  reportsAsPrimary: {
    id: string;
    activityNumber: number;
    date: string;
    team: { name: string };
  }[];
  signatures: { declarationType: string; signedAt: string }[];
  _count: { reportsAsPrimary: number };
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setUser(d);
        setIsLoading(false);
      });
  }, [params.id]);

  const toggleRole = async () => {
    if (!user) return;
    setSaving(true);
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUser({ ...user, role: newRole });
    }
    setSaving(false);
  };

  const updateStatus = async (status: string) => {
    if (!user) return;
    setSaving(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboardingStatus: status }),
    });
    if (res.ok) {
      setUser({ ...user, onboardingStatus: status });
    }
    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">משתמש לא נמצא</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          חזרה לרשימת משתמשים
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-ocean-blue/10 flex items-center justify-center">
          <User className="w-6 h-6 text-ocean-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">פרטים אישיים</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{user.phone || 'לא צוין'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Anchor className="w-4 h-4 text-gray-400" />
              <span>רישיון: {user.licenseType || 'לא צוין'} {user.licenseNumber ? `(${user.licenseNumber})` : ''}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>הצטרף: {new Date(user.createdAt).toLocaleDateString('he-IL')}</span>
            </div>
            {user.sailingExperience && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">ניסיון הפלגה</p>
                <p className="text-gray-700">{user.sailingExperience}</p>
              </div>
            )}
          </div>
        </div>

        {/* Role & Status */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">תפקיד וסטטוס</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">תפקיד</p>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-ocean-blue" />
                <span className="font-medium">{user.role === 'ADMIN' ? 'מנהל' : 'משתמש'}</span>
                <button
                  onClick={toggleRole}
                  disabled={saving}
                  className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {user.role === 'ADMIN' ? 'הסר הרשאת מנהל' : 'הפוך למנהל'}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">סטטוס Onboarding</p>
              <div className="flex items-center gap-2">
                <span
                  className={`badge-${
                    user.onboardingStatus === 'APPROVED'
                      ? 'success'
                      : user.onboardingStatus === 'IN_PROGRESS'
                      ? 'warning'
                      : 'default'
                  }`}
                >
                  {user.onboardingStatus === 'APPROVED'
                    ? 'מאושר'
                    : user.onboardingStatus === 'IN_PROGRESS'
                    ? 'בתהליך'
                    : 'ממתין'}
                </span>
                {user.onboardingStatus !== 'APPROVED' && (
                  <button
                    onClick={() => updateStatus('APPROVED')}
                    disabled={saving}
                    className="text-sm px-3 py-1 bg-success-green text-white rounded-lg hover:bg-success-green/90 transition-colors disabled:opacity-50"
                  >
                    אשר ידנית
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">חתימות</p>
              {user.signatures.length > 0 ? (
                <div className="space-y-1">
                  {user.signatures.map((sig, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-green" />
                      <span className="text-sm">
                        {sig.declarationType === 'SAFETY' ? 'בטיחות' : 'התנהגות'} —{' '}
                        {new Date(sig.signedAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">אין חתימות</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="card mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-ocean-blue" />
          דוחות ({user._count.reportsAsPrimary})
        </h2>
        {user.reportsAsPrimary.length > 0 ? (
          <div className="space-y-2">
            {user.reportsAsPrimary.map((r) => (
              <Link
                key={r.id}
                href={`/reports/${r.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">
                  דוח #{r.activityNumber} — {r.team.name}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(r.date).toLocaleDateString('he-IL')}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">אין דוחות</p>
        )}
      </div>
    </div>
  );
}
