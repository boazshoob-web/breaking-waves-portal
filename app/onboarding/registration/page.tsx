'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User,
  Mail,
  Phone,
  Anchor,
  FileText,
  Upload,
  ArrowLeft,
  Save,
  CheckCircle,
} from 'lucide-react';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  licenseType: string | null;
  licenseNumber: string | null;
  sailingExperience: string | null;
  licenseFilePath: string | null;
}

const LICENSE_LABELS: Record<string, string> = {
  skipper_3: 'סקיפר 3 - כלי שייט קטן',
  skipper_30: 'סקיפר 30 - יאכטה',
  skipper_47: 'סקיפר 47 - כלי שייט גדול',
  rav_hovel: 'רב חובל',
  katzin: 'קצין',
  other: 'אחר',
};

export default function RegistrationStepPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    licenseType: '',
    licenseNumber: '',
    sailingExperience: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/users/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditData({
          licenseType: data.licenseType || '',
          licenseNumber: data.licenseNumber || '',
          sailingExperience: data.sailingExperience || '',
        });
        // If already has license info, check if we should auto-advance
        if (data.licenseType && data.licenseNumber) {
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
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
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      const updated = await res.json();
      setProfile((prev) => (prev ? { ...prev, ...updated } : null));
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const isComplete = profile?.licenseType && profile?.licenseNumber;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-ocean-blue" />
          שלב 1: בדיקת פרטי רישום
        </h2>

        {/* Read-only info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-ocean-blue" />
            <div>
              <p className="text-sm text-gray-500">שם מלא</p>
              <p className="font-medium">{profile?.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-ocean-blue" />
            <div>
              <p className="text-sm text-gray-500">אימייל</p>
              <p className="font-medium" dir="ltr">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-ocean-blue" />
            <div>
              <p className="text-sm text-gray-500">טלפון</p>
              <p className="font-medium" dir="ltr">{profile?.phone}</p>
            </div>
          </div>
        </div>

        {/* License info - editable */}
        <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">
          פרטי רישיון שייט
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="input-label">סוג רישיון *</label>
              <select
                value={editData.licenseType}
                onChange={(e) =>
                  setEditData({ ...editData, licenseType: e.target.value })
                }
                className="select-field"
              >
                <option value="">בחר סוג רישיון...</option>
                {Object.entries(LICENSE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">מספר רישיון *</label>
              <input
                type="text"
                value={editData.licenseNumber}
                onChange={(e) =>
                  setEditData({ ...editData, licenseNumber: e.target.value })
                }
                className="input-field"
                placeholder="מספר תעודת הסקיפר"
              />
            </div>
            <div>
              <label className="input-label">ניסיון בשייט</label>
              <textarea
                value={editData.sailingExperience}
                onChange={(e) =>
                  setEditData({ ...editData, sailingExperience: e.target.value })
                }
                className="textarea-field"
                rows={3}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || !editData.licenseType || !editData.licenseNumber}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? <span className="spinner" /> : <Save className="w-5 h-5" />}
              שמירה
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Anchor className="w-5 h-5 text-ocean-blue" />
              <div>
                <p className="text-sm text-gray-500">סוג רישיון</p>
                <p className="font-medium">
                  {profile?.licenseType
                    ? LICENSE_LABELS[profile.licenseType] || profile.licenseType
                    : 'לא צוין'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-ocean-blue" />
              <div>
                <p className="text-sm text-gray-500">מספר רישיון</p>
                <p className="font-medium">{profile?.licenseNumber || 'לא צוין'}</p>
              </div>
            </div>
            {profile?.sailingExperience && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">ניסיון בשייט</p>
                <p className="font-medium">{profile.sailingExperience}</p>
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-sm"
            >
              ערוך פרטים
            </button>
          </div>
        )}

        {/* Next Step */}
        {isComplete && !isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-success-green mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">פרטי הרישום מלאים</span>
            </div>
            <button
              onClick={() => router.push('/onboarding/learning')}
              className="btn-primary flex items-center gap-2"
            >
              המשך לשלב הלמידה
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClipboardCheck(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
