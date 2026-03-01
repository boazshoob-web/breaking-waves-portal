'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  PartyPopper,
} from 'lucide-react';
import SignaturePad from '@/components/ui/SignaturePad';

const DECLARATIONS = [
  {
    type: 'SAFETY' as const,
    title: 'הצהרת בטיחות',
    icon: Shield,
    text: `אני מצהיר/ה בזאת כי קראתי והבנתי את כל נהלי הבטיחות של עמותת "שוברים גלים".
אני מתחייב/ת לפעול על פי הנהלים, לשמור על בטיחות עצמי ובטיחות המשתתפים בכל עת.
אני מודע/ת לכך שאי עמידה בנהלי הבטיחות עלולה לסכן חיי אדם ותגרור הפסקת פעילות מיידית.
אני מתחייב/ת לדווח על כל חריגה או מצב מסוכן מיד לגורם האחראי.`,
  },
  {
    type: 'BEHAVIOR' as const,
    title: 'הצהרת התנהגות',
    icon: Users,
    text: `אני מצהיר/ה בזאת כי אני מתחייב/ת לנהוג בכבוד ובסבלנות כלפי כל המשתתפים בפעילות.
אני מבין/ה את האופי הרגיש של הפעילות ואת הצורך בגישה תומכת ומכבדת.
אני מתחייב/ת לשמור על חיסיון מלא לגבי המשתתפים ופרטיהם.
אני מתחייב/ת לדווח למנהל הפעילות על כל מצב חריג או דילמה אתית.`,
  },
];

export default function SignatureStepPage() {
  const router = useRouter();
  const [signedTypes, setSignedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    const res = await fetch('/api/onboarding/signature');
    if (res.ok) {
      const sigs = await res.json();
      const types = sigs.map((s: { declarationType: string }) => s.declarationType);
      setSignedTypes(types);
      setAllComplete(types.includes('SAFETY') && types.includes('BEHAVIOR'));
    }
    setIsLoading(false);
  };

  const handleSaveSignature = async (
    declarationType: 'SAFETY' | 'BEHAVIOR',
    signatureData: string
  ) => {
    setSavingType(declarationType);
    const res = await fetch('/api/onboarding/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ declarationType, signatureImage: signatureData }),
    });

    if (res.ok) {
      await fetchSignatures();
    }
    setSavingType(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <PenTool className="w-6 h-6 text-ocean-blue" />
          שלב 3: חתימה על הצהרות
        </h2>
        <p className="text-gray-600">
          קראו בעיון את ההצהרות הבאות וחתמו על כל אחת מהן.
        </p>
      </div>

      {DECLARATIONS.map((decl) => {
        const Icon = decl.icon;
        const isSigned = signedTypes.includes(decl.type);
        const isSaving = savingType === decl.type;

        return (
          <div
            key={decl.type}
            className={`card border-2 ${
              isSigned ? 'border-success-green/30 bg-success-green/5' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-6 h-6 ${isSigned ? 'text-success-green' : 'text-ocean-blue'}`} />
              <h3 className="text-lg font-bold text-gray-800">{decl.title}</h3>
              {isSigned && (
                <span className="badge badge-success mr-auto">נחתם</span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {decl.text}
              </p>
            </div>

            {isSigned ? (
              <div className="flex items-center gap-2 text-success-green">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">הצהרה זו נחתמה בהצלחה</span>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  חתמו כאן:
                </p>
                {isSaving ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="spinner" />
                    <span className="mr-2 text-gray-500">שומר חתימה...</span>
                  </div>
                ) : (
                  <SignaturePad
                    onSave={(data) => handleSaveSignature(decl.type, data)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/onboarding/learning')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה
          </button>

          {allComplete ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-success-green">
                <PartyPopper className="w-6 h-6" />
                <span className="font-bold">התהליך הושלם!</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-success flex items-center gap-2"
              >
                חזרה לדף הבית
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              חתמו על שתי ההצהרות להשלמת התהליך
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
