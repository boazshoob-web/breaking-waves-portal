import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">צור קשר</h1>
          <p className="page-subtitle">נשמח לשמוע ממך</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">פרטי התקשרות</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-ocean-blue" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">דוא&quot;ל</p>
                  <a
                    href="mailto:info@breakingwaves.org.il"
                    className="text-ocean-blue hover:underline"
                  >
                    info@breakingwaves.org.il
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-ocean-blue" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">טלפון</p>
                  <a
                    href="tel:+972-0-0000000"
                    className="text-ocean-blue hover:underline"
                    dir="ltr"
                  >
                    +972-0-0000000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-ocean-blue" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">כתובת</p>
                  <p className="text-gray-600">ישראל</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-ocean-blue" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">אתר אינטרנט</p>
                  <p className="text-gray-600">breakingwaves.org.il</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-6 bg-ocean-blue/5 border border-ocean-blue/10">
            <p className="text-center text-gray-700">
              לשאלות טכניות בנוגע לפורטל, ניתן לפנות למנהל המערכת דרך ממשק הניהול.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
