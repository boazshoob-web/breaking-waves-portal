'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Anchor,
  FileText,
  Shield,
  Edit3,
  Save,
  X,
} from 'lucide-react';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  licenseType: string | null;
  licenseNumber: string | null;
  sailingExperience: string | null;
  licenseFilePath: string | null;
  onboardingStatus: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'ממתין', class: 'badge-warning' },
  IN_PROGRESS: { label: 'בתהליך', class: 'badge-info' },
  APPROVED: { label: 'מאושר', class: 'badge-success' },
};

const LICENSE_LABELS: Record<string, string> = {
  skipper_3: 'סקיפר 3 - כלי שייט קטן',
  skipper_30: 'סקיפר 30 - יאכטה',
  skipper_47: 'סקיפר 47 - כלי שייט גדול',
  rav_hovel: 'רב חובל',
  katzin: 'קצין',
  other: 'אחר',
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/users/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditPhone(data.phone);
        setEditExperience(data.sailingExperience || '');
      }
      setIsLoading(false);
    }
    if (session) fetchProfile();
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: editPhone,
        sailingExperience: editExperience,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile((prev) =>
        prev ? { ...prev, phone: updated.phone, sailingExperience: updated.sailingExperience } : null
      );
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="spinner" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">לא ניתן לטעון את הפרופיל</p>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[profile.onboardingStatus] || STATUS_LABELS.PENDING;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">הפרופיל שלי</h1>
          <p className="page-subtitle">פרטים אישיים ומצב Onboarding</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Card */}
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-ocean-blue" />
              <div>
                <p className="text-sm text-gray-500">סטטוס Onboarding</p>
                <span className={`badge ${statusInfo.class}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {profile.role === 'ADMIN' ? (
                <span className="badge badge-info">מנהל</span>
              ) : (
                <span className="badge badge-info">משתמש</span>
              )}
            </div>
          </div>

          {/* Personal Details */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">פרטים אישיים</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center gap-2 !px-4 !py-2 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  עריכה
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2 !px-4 !py-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    שמירה
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditPhone(profile.phone);
                      setEditExperience(profile.sailingExperience || '');
                    }}
                    className="btn-secondary flex items-center gap-2 !px-4 !py-2 text-sm"
                  >
                    <X className="w-4 h-4" />
                    ביטול
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-gray-500">שם מלא</p>
                  <p className="font-medium">{profile.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-gray-500">אימייל</p>
                  <p className="font-medium" dir="ltr">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-ocean-blue" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">טלפון</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="input-field mt-1"
                      dir="ltr"
                    />
                  ) : (
                    <p className="font-medium" dir="ltr">{profile.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* License Details */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">פרטי רישיון</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Anchor className="w-5 h-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-gray-500">סוג רישיון</p>
                  <p className="font-medium">
                    {profile.licenseType
                      ? LICENSE_LABELS[profile.licenseType] || profile.licenseType
                      : 'לא צוין'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-gray-500">מספר רישיון</p>
                  <p className="font-medium">{profile.licenseNumber || 'לא צוין'}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">ניסיון בשייט</p>
                {isEditing ? (
                  <textarea
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    className="textarea-field mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="font-medium">
                    {profile.sailingExperience || 'לא צוין'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
