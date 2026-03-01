'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FilePlus } from 'lucide-react';
import ReportForm from '@/components/forms/ReportForm';
import type { CreateReportInput } from '@/lib/validations/reports';

export default function NewReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateReportInput) => {
    setIsLoading(true);
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const report = await res.json();
      router.push(`/reports/${report.id}`);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">דוח פעילות חדש</h1>
          <p className="page-subtitle">תיעוד הפלגה חדשה</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/reports"
              className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה לדוחות
            </Link>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <FilePlus className="w-6 h-6 text-ocean-blue" />
              <h2 className="text-xl font-bold text-gray-800">פרטי הדוח</h2>
            </div>

            <ReportForm
              onSubmit={handleSubmit}
              submitLabel="שמירת דוח"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
