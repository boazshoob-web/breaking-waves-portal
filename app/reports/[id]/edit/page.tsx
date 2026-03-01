'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Edit } from 'lucide-react';
import ReportForm from '@/components/forms/ReportForm';
import type { CreateReportInput } from '@/lib/validations/reports';

interface ReportData {
  id: string;
  activityNumber: number;
  date: string;
  teamId: string;
  secondarySkipperId: string | null;
  activityDescription: string;
  weatherConditions: string;
  emotionalHandling: string;
  summaryNextSteps: string;
  generalNotes: string | null;
  participants: { participant: { id: string } }[];
}

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      const res = await fetch(`/api/reports/${params.id}`);
      if (res.ok) {
        setReport(await res.json());
      } else {
        setError('לא ניתן לטעון את הדוח');
      }
      setIsLoading(false);
    };
    fetchReport();
  }, [params.id]);

  const handleSubmit = async (data: CreateReportInput) => {
    setIsSaving(true);
    const res = await fetch(`/api/reports/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push(`/reports/${params.id}`);
    } else {
      setIsSaving(false);
      setError('שגיאה בשמירת הדוח');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">עריכת דוח</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="spinner" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">עריכת דוח</h1>
          </div>
        </div>
        <div className="container py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{error || 'הדוח לא נמצא'}</p>
            <Link href="/reports" className="btn-primary inline-flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              חזרה לדוחות
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultValues = {
    date: report.date.split('T')[0],
    teamId: report.teamId,
    secondarySkipperId: report.secondarySkipperId || undefined,
    activityDescription: report.activityDescription,
    weatherConditions: report.weatherConditions,
    emotionalHandling: report.emotionalHandling,
    summaryNextSteps: report.summaryNextSteps,
    generalNotes: report.generalNotes || undefined,
  };

  const defaultParticipantIds = report.participants.map((rp) => rp.participant.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">עריכת דוח #{report.activityNumber}</h1>
          <p className="page-subtitle">עדכון פרטי הדוח</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/reports/${report.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה לדוח
            </Link>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Edit className="w-6 h-6 text-ocean-blue" />
              <h2 className="text-xl font-bold text-gray-800">עריכת פרטי הדוח</h2>
            </div>

            <ReportForm
              defaultValues={defaultValues}
              defaultParticipantIds={defaultParticipantIds}
              onSubmit={handleSubmit}
              submitLabel="עדכון דוח"
              isLoading={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
