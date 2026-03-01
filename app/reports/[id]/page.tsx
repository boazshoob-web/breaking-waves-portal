'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Users,
  Anchor,
  Cloud,
  Heart,
  FileText,
  MessageSquare,
  Edit,
  Printer,
  Download,
} from 'lucide-react';
import { generateReportPdf, type PdfReportData } from '@/lib/utils/pdf-export';

interface ReportDetail {
  id: string;
  activityNumber: number;
  date: string;
  team: { id: string; name: string };
  primarySkipper: { id: string; fullName: string };
  secondarySkipper: { id: string; fullName: string } | null;
  participants: { participant: { id: string; name: string }; present: boolean }[];
  activityDescription: string;
  weatherConditions: string;
  emotionalHandling: string;
  summaryNextSteps: string;
  generalNotes: string | null;
  createdAt: string;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      const res = await fetch(`/api/reports/${params.id}`);
      if (res.ok) {
        setReport(await res.json());
      } else if (res.status === 404) {
        setError('הדוח לא נמצא');
      } else if (res.status === 403) {
        setError('אין הרשאה לצפות בדוח זה');
      } else {
        setError('שגיאה בטעינת הדוח');
      }
      setIsLoading(false);
    };
    fetchReport();
  }, [params.id]);

  const handleExportPdf = async () => {
    if (!report) return;
    setIsExporting(true);
    try {
      const pdfData: PdfReportData = {
        activityNumber: report.activityNumber,
        date: report.date,
        teamName: report.team.name,
        primarySkipperName: report.primarySkipper.fullName,
        secondarySkipperName: report.secondarySkipper?.fullName,
        participantNames: report.participants.map((rp) => rp.participant.name),
        activityDescription: report.activityDescription,
        weatherConditions: report.weatherConditions,
        emotionalHandling: report.emotionalHandling,
        summaryNextSteps: report.summaryNextSteps,
        generalNotes: report.generalNotes || undefined,
      };
      await generateReportPdf(pdfData);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">דוח פעילות</h1>
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
            <h1 className="page-title">דוח פעילות</h1>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">דוח פעילות #{report.activityNumber}</h1>
          <p className="page-subtitle">
            {report.team.name} — {new Date(report.date).toLocaleDateString('he-IL')}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/reports"
              className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה לדוחות
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isExporting ? <span className="spinner" /> : <Download className="w-4 h-4" />}
                ייצוא PDF
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                הדפסה
              </button>
              <Link
                href={`/reports/${report.id}/edit`}
                className="btn-primary flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                עריכה
              </Link>
            </div>
          </div>

          {/* Report Content - Print-friendly */}
          <div className="space-y-6 print:space-y-4" id="report-print">
            {/* Header Info */}
            <div className="card">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-ocean-blue" />
                  <div>
                    <p className="text-sm text-gray-500">תאריך</p>
                    <p className="font-medium">{new Date(report.date).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-ocean-blue" />
                  <div>
                    <p className="text-sm text-gray-500">צוות</p>
                    <p className="font-medium">{report.team.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Anchor className="w-5 h-5 text-ocean-blue" />
                  <div>
                    <p className="text-sm text-gray-500">סקיפר ראשי</p>
                    <p className="font-medium">{report.primarySkipper.fullName}</p>
                  </div>
                </div>
                {report.secondarySkipper && (
                  <div className="flex items-center gap-3">
                    <Anchor className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">סקיפר שני</p>
                      <p className="font-medium">{report.secondarySkipper.fullName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Participants */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <Users className="w-5 h-5 text-ocean-blue" />
                משתתפים ({report.participants.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {report.participants.map((rp) => (
                  <div
                    key={rp.participant.id}
                    className="flex items-center gap-2 p-2 bg-ocean-blue/5 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-success-green" />
                    <span className="text-sm font-medium">{rp.participant.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Description */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                <FileText className="w-5 h-5 text-ocean-blue" />
                תיאור הפעילות
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {report.activityDescription}
              </p>
            </div>

            {/* Weather */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                <Cloud className="w-5 h-5 text-ocean-blue" />
                תנאי מזג אוויר
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {report.weatherConditions}
              </p>
            </div>

            {/* Emotional Handling */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                <Heart className="w-5 h-5 text-ocean-blue" />
                התמודדות רגשית
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {report.emotionalHandling}
              </p>
            </div>

            {/* Summary */}
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                <FileText className="w-5 h-5 text-success-green" />
                סיכום ונקודות להמשך
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {report.summaryNextSteps}
              </p>
            </div>

            {/* General Notes */}
            {report.generalNotes && (
              <div className="card">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                  <MessageSquare className="w-5 h-5 text-warning-orange" />
                  הערות כלליות
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {report.generalNotes}
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="text-center text-sm text-gray-400 py-4 print:block">
              נוצר בתאריך {new Date(report.createdAt).toLocaleDateString('he-IL')}{' '}
              בשעה {new Date(report.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
