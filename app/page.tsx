import Link from 'next/link';
import { Anchor, BookOpen, ClipboardList, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue/10 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Anchor className="w-20 h-20 text-ocean-blue" />
          </div>
          <h1 className="text-5xl font-bold text-ocean-blue mb-4">
            שוברים גלים
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            עמותה שיקומית לנפגעי נפש באמצעות שייט ימי
          </p>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            פורטל המידע המרכזי עבור סקיפרים, מדריכים וחברי הצוות.
            כל המידע, הנהלים והכלים במקום אחד.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {/* פורטל ידע */}
          <Link href="/knowledge" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-ocean-blue">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-ocean-blue group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3">מאגר ידע</h2>
              <p className="text-gray-600 text-center mb-4">
                נהלים, סרטוני הדרכה, מסמכים וקישורים שימושיים
              </p>
              <div className="text-center">
                <span className="text-ocean-blue font-semibold group-hover:underline">
                  גישה פתוחה לכולם →
                </span>
              </div>
            </div>
          </Link>

          {/* Onboarding */}
          <Link href="/onboarding" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-ocean-blue">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-ocean-blue group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3">Onboarding</h2>
              <p className="text-gray-600 text-center mb-4">
                תהליך קליטה לסקיפרים ומדריכים חדשים
              </p>
              <div className="text-center">
                <span className="text-warning-orange font-semibold group-hover:underline">
                  נדרשת התחברות →
                </span>
              </div>
            </div>
          </Link>

          {/* דיווח פעילויות */}
          <Link href="/reports" className="group">
            <div className="card hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-ocean-blue">
              <div className="flex justify-center mb-4">
                <ClipboardList className="w-12 h-12 text-ocean-blue group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3">דוחות פעילות</h2>
              <p className="text-gray-600 text-center mb-4">
                תיעוד ודיווח הפלגות
              </p>
              <div className="text-center">
                <span className="text-warning-orange font-semibold group-hover:underline">
                  נדרשת התחברות →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 bg-gray-bg rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6">קישורים מהירים</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="https://www.windfinder.com/forecast/herzliya_marina" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="font-semibold">🌊 תחזית מזג אויר - מרינה הרצליה</span>
            </a>
            <a 
              href="https://beachcam.co.il/marina.html" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="font-semibold">📹 מצלמת המרינה בשידור חי</span>
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">חדש בעמותה?</h3>
          <p className="text-gray-600 mb-6">הצטרף אלינו והתחל את תהליך ההכשרה</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary">
              הרשמה
            </Link>
            <Link href="/auth/login" className="btn-secondary">
              התחברות
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ocean-blue text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">עמותת שוברים גלים - שיקום באמצעות שייט</p>
          <p className="text-sm opacity-75">© 2025 כל הזכויות שמורות</p>
        </div>
      </footer>
    </div>
  );
}
