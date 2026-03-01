import Link from 'next/link';
import { Anchor } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Anchor className="w-5 h-5 text-ocean-blue" />
              <span className="font-bold text-white">שוברים גלים</span>
            </div>
            <p className="text-sm text-gray-400">
              עמותה שיקומית לנפגעי נפש באמצעות שייט ימי
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/knowledge" className="hover:text-white transition-colors">
                  פורטל ידע
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3">התחברות</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  כניסה למערכת
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  הרשמה
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} שוברים גלים. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
