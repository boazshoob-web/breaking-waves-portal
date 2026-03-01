# 🌊 פורטל שוברים גלים - Breaking Waves Portal

פורטל ניהול ידע, Onboarding ודוחות פעילויות עבור עמותת "שוברים גלים"

## 📋 תכולת הפרויקט

### ✅ מה כבר בנוי:
- ✨ **דף הבית** - Hero section עם 3 כרטיסי מודולים
- 📚 **מאגר ידע** - דף פתוח לכולם עם חיפוש, פילטרים ותגיות
- 🎨 **עיצוב מלא** - Tailwind CSS + תמיכה מלאה ב-RTL
- 🧭 **Navbar רספונסיבי** - תפריט ניווט עם תמיכה במובייל
- 📱 **עיצוב רספונסיבי** - מותאם לכל המכשירים

### 🚧 מה צריך להוסיף:
- 🔐 מערכת אימות (NextAuth.js)
- 📊 Onboarding System
- 📝 מערכת דיווח פעילויות
- 👨‍💼 דשבורד מנהל
- 🗄️ בסיס נתונים (Prisma + PostgreSQL)

## 🚀 התקנה והפעלה

### דרישות מקדימות:
- Node.js 18+ 
- npm או yarn

### שלבי התקנה:

```bash
# 1. חלץ את הקובץ
tar -xzf breaking-waves-portal.tar.gz
cd breaking-waves-portal

# 2. התקן תלויות
npm install

# 3. הפעל בסביבת פיתוח
npm run dev
```

האתר יהיה זמין בכתובת: `http://localhost:3000`

## 📁 מבנה הפרויקט

```
breaking-waves-portal/
├── app/                    # Next.js App Router
│   ├── page.tsx           # דף הבית
│   ├── layout.tsx         # Layout ראשי
│   ├── globals.css        # CSS גלובלי
│   ├── knowledge/         # מאגר ידע
│   ├── onboarding/        # מערכת קליטה
│   ├── reports/           # דוחות פעילות
│   ├── admin/             # ממשק מנהל
│   └── api/               # API Routes
├── components/            # קומפוננטות React
│   ├── layout/           # Navbar, Footer
│   ├── ui/               # כפתורים, טפסים
│   └── forms/            # טפסים מורכבים
├── lib/                   # Utilities
│   ├── auth/             # אימות
│   ├── db/               # Prisma
│   └── utils/            # פונקציות עזר
├── prisma/               # סכימת בסיס נתונים
└── public/               # קבצים סטטיים
```

## 🎨 טכנולוגיות

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS (RTL Support)
- **Auth**: NextAuth.js
- **Database**: Prisma + PostgreSQL
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 🎨 פלטת צבעים

```css
--ocean-blue: #2E75B6      /* כחול ראשי */
--success-green: #27AE60    /* ירוק הצלחה */
--warning-orange: #E67E22   /* כתום אזהרה */
--error-red: #E74C3C        /* אדום שגיאה */
--gray-bg: #F2F2F2          /* רקע אפור */
```

## 📝 שלבים הבאים לפיתוח

### שלב 1: אימות ומשתמשים
- [ ] התקנת NextAuth.js
- [ ] יצירת API Routes לאימות
- [ ] דפי התחברות והרשמה
- [ ] סכימת Prisma למשתמשים

### שלב 2: Onboarding
- [ ] טופס רישום (פרטים + רישיונות)
- [ ] מערכת העלאת קבצים
- [ ] מעקב התקדמות
- [ ] חתימה דיגיטלית
- [ ] דשבורד ניהולי

### שלב 3: דוחות פעילות
- [ ] טופס דוח עם כל השדות
- [ ] צפייה בדוחות קודמים
- [ ] ייצוא ל-PDF/Excel
- [ ] דף ריכוז הערות
- [ ] דף בעיות טכניות
- [ ] מעקב דוחות לפי צוות

### שלב 4: ממשק מנהל
- [ ] דשבורד מרכזי
- [ ] ניהול משתמשים
- [ ] ניהול תוכן במאגר ידע
- [ ] הוספת הערות על סקיפרים
- [ ] סטטיסטיקות ודוחות

### שלב 5: Deploy
- [ ] בחירת פלטפורמת אחסון (Vercel/Railway/DigitalOcean)
- [ ] הגדרת בסיס נתונים בענן
- [ ] הגדרת משתני סביבה
- [ ] בדיקות ואופטימיזציה
- [ ] העלאה ופרסום

## 🔧 פקודות שימושיות

```bash
# פיתוח
npm run dev

# בניית production
npm run build

# הפעלת production
npm start

# Linting
npm run lint

# Prisma
npx prisma generate    # יצירת Prisma Client
npx prisma migrate dev # הרצת migrations
npx prisma studio      # UI לבסיס נתונים
```

## 📚 משאבים נוספים

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)

## 📞 תמיכה

לשאלות ובעיות, פנה למפתח או לצוות העמותה.

---

**עמותת שוברים גלים** - שיקום באמצעות שייט 🌊⚓
```
