'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Anchor,
  FileText,
  CheckCircle,
  Circle,
  Shield,
  Image,
} from 'lucide-react';

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseType: string | null;
  licenseNumber: string | null;
  sailingExperience: string | null;
  licenseFilePath: string | null;
  onboardingStatus: string;
  createdAt: string;
  onboardingProgress: {
    id: string;
    completed: boolean;
    viewedAt: string | null;
    content: {
      id: string;
      title: string;
      type: string;
      isRequired: boolean;
    };
  }[];
  signatures: {
    id: string;
    declarationType: string;
    signatureImage: string;
    signedAt: string;
  }[];
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'ממתין', class: 'badge-warning' },
  IN_PROGRESS: { label: 'בתהליך', class: 'badge-info' },
  APPROVED: { label: 'מאושר', class: 'badge-success' },
};

const LICENSE_LABELS: Record<string, string> = {
  skipper_3: 'סקיפר 3',
  skipper_30: 'סקיפר 30',
  skipper_47: 'סקיפר 47',
  rav_hovel: 'רב חובל',
  katzin: 'קצין',
  other: 'אחר',
};

export default function AdminUserOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    const res = await fetch(`/api/admin/onboarding/${userId}`);
    if (res.ok) {
      setUser(await res.json());
    }
    setIsLoading(false);
  };

  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    const res = await fetch(`/api/admin/onboarding/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboardingStatus: status }),
    });
    if (res.ok) {
      await fetchUser();
    }
    setIsUpdating(false);
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[user.onboardingStatus] || STATUS_LABELS.PENDING;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/onboarding"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
        <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">פרטים אישיים</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2">
              <User className="w-5 h-5 text-ocean-blue" />
              <div>
                <p className="text-xs text-gray-500">שם מלא</p>
                <p className="font-medium">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <Mail className="w-5 h-5 text-ocean-blue" />
              <div>
                <p className="text-xs text-gray-500">אימייל</p>
                <p className="font-medium" dir="ltr">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <Phone className="w-5 h-5 text-ocean-blue" />
              <div>
                <p className="text-xs text-gray-500">טלפון</p>
                <p className="font-medium" dir="ltr">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <Anchor className="w-5 h-5 text-ocean-blue" />
              <div>
                <p className="text-xs text-gray-500">רישיון</p>
                <p className="font-medium">
                  {user.licenseType
                    ? `${LICENSE_LABELS[user.licenseType] || user.licenseType} - ${user.licenseNumber || 'ללא מספר'}`
                    : 'לא צוין'}
                </p>
              </div>
            </div>
            {user.sailingExperience && (
              <div className="p-2">
                <p className="text-xs text-gray-500">ניסיון</p>
                <p className="text-sm">{user.sailingExperience}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status & Actions */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">סטטוס ופעולות</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">סטטוס נוכחי</p>
              <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">תאריך רישום</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString('he-IL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              {user.onboardingStatus !== 'APPROVED' && (
                <button
                  onClick={() => updateStatus('APPROVED')}
                  disabled={isUpdating}
                  className="btn-success flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  אשר
                </button>
              )}
              {user.onboardingStatus === 'APPROVED' && (
                <button
                  onClick={() => updateStatus('IN_PROGRESS')}
                  disabled={isUpdating}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  החזר לתהליך
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            <FileText className="w-5 h-5 inline ml-2 text-ocean-blue" />
            התקדמות בלמידה
          </h2>
          {user.onboardingProgress.length > 0 ? (
            <div className="space-y-2">
              {user.onboardingProgress.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2 rounded-lg"
                >
                  {p.completed ? (
                    <CheckCircle className="w-5 h-5 text-success-green flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={p.completed ? 'text-gray-500' : 'font-medium'}>
                    {p.content.title}
                  </span>
                  {p.content.isRequired && (
                    <span className="badge badge-warning text-xs mr-auto">חובה</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">טרם התחיל בלמידה</p>
          )}
        </div>

        {/* Signatures */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            <Shield className="w-5 h-5 inline ml-2 text-ocean-blue" />
            חתימות
          </h2>
          {user.signatures.length > 0 ? (
            <div className="space-y-4">
              {user.signatures.map((sig) => (
                <div key={sig.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {sig.declarationType === 'SAFETY' ? 'הצהרת בטיחות' : 'הצהרת התנהגות'}
                    </span>
                    <span className="badge badge-success text-xs">נחתם</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(sig.signedAt).toLocaleString('he-IL')}
                  </p>
                  <div className="mt-2 border rounded p-1 bg-white inline-block">
                    <Image className="w-4 h-4 text-gray-400 inline ml-1" />
                    <span className="text-xs text-gray-500">חתימה שמורה</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">טרם חתם על הצהרות</p>
          )}
        </div>
      </div>
    </div>
  );
}
