import { Anchor, Heart, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">אודות שוברים גלים</h1>
          <p className="page-subtitle">עמותה שיקומית לנפגעי נפש באמצעות שייט ימי</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Anchor className="w-6 h-6 text-ocean-blue" />
              <h2 className="text-xl font-bold text-gray-800">מי אנחנו</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              עמותת &quot;שוברים גלים&quot; היא עמותה שיקומית ייחודית המשלבת שייט ימי ככלי טיפולי
              עבור נפגעי נפש. אנו מאמינים שהים מציע סביבה טיפולית ייחודית המאפשרת
              צמיחה אישית, בניית ביטחון עצמי ושיפור כישורים חברתיים.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-ocean-blue" />
              <h2 className="text-xl font-bold text-gray-800">החזון שלנו</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              ליצור קהילה תומכת ומעצימה שבה אנשים עם מוגבלויות נפשיות יכולים לחוות
              את הכוח המרפא של הים, לפתח מיומנויות חדשות, ולבנות חוסן נפשי דרך
              חוויות הפלגה משותפות.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-ocean-blue" />
              <h2 className="text-xl font-bold text-gray-800">הערכים שלנו</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-ocean-blue mt-2 flex-shrink-0" />
                <span><strong>כבוד האדם</strong> — כל משתתף מתקבל כמו שהוא, ללא שיפוט</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-ocean-blue mt-2 flex-shrink-0" />
                <span><strong>בטיחות</strong> — שמירה קפדנית על בטיחות בים וביבשה</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-ocean-blue mt-2 flex-shrink-0" />
                <span><strong>צמיחה</strong> — עידוד התפתחות אישית דרך אתגרים מותאמים</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-ocean-blue mt-2 flex-shrink-0" />
                <span><strong>קהילתיות</strong> — בניית קשרים ותמיכה הדדית בין כל חברי הצוות</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-ocean-blue" />
              <h2 className="text-xl font-bold text-gray-800">הפורטל</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              פורטל זה משמש את סקיפרי העמותה, המדריכים וחברי הצוות. הוא מרכז את כל
              המידע הנדרש לפעילות — מנהלים ופרוטוקולים, דרך תהליכי הכשרה ועד לדיווח
              על פעילויות. המטרה היא לייעל את העבודה ולהבטיח רמה גבוהה של מקצועיות
              ובטיחות בכל הפלגה.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
