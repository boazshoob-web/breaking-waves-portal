import Link from 'next/link';
import { Anchor } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <Anchor className="w-16 h-16 text-ocean-blue mx-auto mb-4 opacity-30" />
        <h2 className="text-4xl font-bold text-gray-800 mb-2">404</h2>
        <p className="text-xl text-gray-600 mb-6">
          הדף שחיפשת לא נמצא
        </p>
        <Link href="/" className="btn-primary inline-block">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
