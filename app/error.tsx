'use client';

import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <AlertTriangle className="w-16 h-16 text-error-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">שגיאה</h2>
        <p className="text-gray-600 mb-6">
          אירעה שגיאה בלתי צפויה. אנא נסו שוב.
        </p>
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );
}
