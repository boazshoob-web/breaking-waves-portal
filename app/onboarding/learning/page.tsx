'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Video,
  FileText,
  CheckCircle,
  Circle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string;
  isRequired: boolean;
  completed: boolean;
  viewedAt: string | null;
}

interface ProgressData {
  items: ContentItem[];
  totalRequired: number;
  completedRequired: number;
  allRequiredComplete: boolean;
}

export default function LearningStepPage() {
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const res = await fetch('/api/onboarding/progress');
    if (res.ok) {
      setData(await res.json());
    }
    setIsLoading(false);
  };

  const toggleCompletion = async (contentId: string, currentCompleted: boolean) => {
    setUpdatingId(contentId);
    await fetch('/api/onboarding/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, completed: !currentCompleted }),
    });
    await fetchProgress();
    setUpdatingId(null);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  const progressPercent =
    data.totalRequired > 0
      ? Math.round((data.completedRequired / data.totalRequired) * 100)
      : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-ocean-blue" />
          שלב 2: למידה והכרת החומרים
        </h2>
        <p className="text-gray-600 mb-6">
          צפו בסרטונים וקראו את המסמכים הבאים. סמנו כל פריט לאחר השלמתו.
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              התקדמות: {data.completedRequired}/{data.totalRequired}
            </span>
            <span className="text-sm font-bold text-ocean-blue">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-ocean-blue rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content Items */}
        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                item.completed
                  ? 'bg-success-green/5 border-success-green/30'
                  : 'bg-white border-gray-200 hover:border-ocean-blue/30'
              }`}
            >
              {/* Completion Toggle */}
              <button
                onClick={() => toggleCompletion(item.id, item.completed)}
                disabled={updatingId === item.id}
                className="flex-shrink-0 mt-0.5"
              >
                {updatingId === item.id ? (
                  <span className="spinner !w-5 !h-5" />
                ) : item.completed ? (
                  <CheckCircle className="w-6 h-6 text-success-green" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 hover:text-ocean-blue transition-colors" />
                )}
              </button>

              {/* Content Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {item.type === 'VIDEO' ? (
                    <Video className="w-4 h-4 text-ocean-blue flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-error-red flex-shrink-0" />
                  )}
                  <p
                    className={`font-medium ${
                      item.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.isRequired && (
                    <span className="badge badge-warning text-xs">חובה</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                )}
              </div>

              {/* Open Link */}
              {item.url !== '#' && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 text-ocean-blue hover:bg-ocean-blue/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => router.push('/onboarding/registration')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה
          </button>

          {data.allRequiredComplete ? (
            <div className="flex items-center gap-3">
              <span className="text-success-green font-medium flex items-center gap-1">
                <CheckCircle className="w-5 h-5" />
                כל החומרים הושלמו
              </span>
              <button
                onClick={() => router.push('/onboarding/signature')}
                className="btn-primary flex items-center gap-2"
              >
                המשך לחתימה
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              השלימו את כל פריטי החובה כדי להמשך
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
