import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ========================
  // ADMIN USER
  // ========================
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@breakingwaves.org.il' },
    update: {},
    create: {
      email: 'admin@breakingwaves.org.il',
      passwordHash: adminPassword,
      fullName: 'מנהל המערכת',
      phone: '0501234567',
      role: 'ADMIN',
      onboardingStatus: 'APPROVED',
    },
  });
  console.log('Admin user created');

  // ========================
  // TAGS
  // ========================
  const tagNames = [
    'בטיחות',
    'חובה',
    'סקיפר חדש',
    'מערכות חשמל',
    'תחזוקה',
    'חירום',
    'נהלים',
    'הדרכה',
    'ציוד',
    'ים',
  ];

  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = tag.id;
  }
  console.log(`${tagNames.length} tags created`);

  // ========================
  // KNOWLEDGE CATEGORIES & ITEMS
  // ========================

  // Category 1: Safety
  const safety = await prisma.knowledgeCategory.create({
    data: {
      name: 'בטיחות ונהלים',
      icon: '🛡️',
      order: 1,
      items: {
        create: [
          {
            title: 'NG26 OWNER MANUAL',
            type: 'PDF',
            url: '#',
            order: 1,
            tags: { create: [{ tagId: tags['חובה'] }, { tagId: tags['בטיחות'] }] },
          },
          {
            title: 'נהלים ובטיחות',
            type: 'PDF',
            url: '#',
            order: 2,
            tags: { create: [{ tagId: tags['בטיחות'] }, { tagId: tags['נהלים'] }] },
          },
          {
            title: 'צ׳ק ליסט יציאה לים',
            type: 'PDF',
            url: '#',
            order: 3,
            tags: { create: [{ tagId: tags['חובה'] }, { tagId: tags['בטיחות'] }, { tagId: tags['סקיפר חדש'] }] },
          },
          {
            title: 'צ׳ק ליסט חזרה מהים',
            type: 'PDF',
            url: '#',
            order: 4,
            tags: { create: [{ tagId: tags['חובה'] }, { tagId: tags['בטיחות'] }] },
          },
          {
            title: 'קרקוע בעת התקף פוסט טראומה',
            type: 'PDF',
            url: '#',
            order: 5,
            tags: { create: [{ tagId: tags['חירום'] }, { tagId: tags['בטיחות'] }] },
          },
        ],
      },
    },
  });
  console.log(`Category "${safety.name}" created with items`);

  // Category 2: Boat Systems
  const boat = await prisma.knowledgeCategory.create({
    data: {
      name: 'מערכות הסירה',
      icon: '⚓',
      order: 2,
      items: {
        create: [
          {
            title: 'סרטון היכרות - קובץ פעילות ונהלים',
            type: 'VIDEO',
            url: '#',
            order: 1,
            tags: { create: [{ tagId: tags['הדרכה'] }, { tagId: tags['סקיפר חדש'] }] },
          },
          {
            title: 'פלייליסט סרטוני מערכות הסירה',
            description: 'רשימת השמעה',
            type: 'VIDEO',
            url: '#',
            order: 2,
            tags: { create: [{ tagId: tags['הדרכה'] }, { tagId: tags['תחזוקה'] }] },
          },
          {
            title: 'מיקום מטפים והגה חירום',
            type: 'PDF',
            url: '#',
            order: 3,
            tags: { create: [{ tagId: tags['חירום'] }, { tagId: tags['ציוד'] }] },
          },
          {
            title: 'מערכות חשמל ומנועים',
            type: 'PDF',
            url: '#',
            order: 4,
            tags: { create: [{ tagId: tags['מערכות חשמל'] }, { tagId: tags['תחזוקה'] }] },
          },
        ],
      },
    },
  });
  console.log(`Category "${boat.name}" created with items`);

  // Category 3: Procedures
  const procedures = await prisma.knowledgeCategory.create({
    data: {
      name: 'נהלים ותהליכים',
      icon: '📋',
      order: 3,
      items: {
        create: [
          {
            title: 'ריכוז מידע פעילות ונהלים',
            type: 'PDF',
            url: '#',
            order: 1,
            tags: { create: [{ tagId: tags['נהלים'] }] },
          },
          {
            title: 'סילבוס הכשרה',
            type: 'PDF',
            url: '#',
            order: 2,
            tags: { create: [{ tagId: tags['הדרכה'] }, { tagId: tags['סקיפר חדש'] }] },
          },
          {
            title: 'נהלי דיווח',
            type: 'PDF',
            url: '#',
            order: 3,
            tags: { create: [{ tagId: tags['נהלים'] }] },
          },
        ],
      },
    },
  });
  console.log(`Category "${procedures.name}" created with items`);

  // Category 4: Tools
  const tools = await prisma.knowledgeCategory.create({
    data: {
      name: 'כלים שימושיים',
      icon: '🔧',
      order: 4,
      items: {
        create: [
          {
            title: 'תחזית מזג אויר - מרינה הרצליה',
            type: 'LINK',
            url: 'https://www.windfinder.com/forecast/herzliya_marina',
            order: 1,
            tags: { create: [{ tagId: tags['ים'] }] },
          },
          {
            title: 'מצלמת המרינה',
            type: 'LINK',
            url: 'https://beachcam.co.il/marina.html',
            order: 2,
            tags: { create: [{ tagId: tags['ים'] }] },
          },
          {
            title: 'קשרים חשובים',
            type: 'LINK',
            url: '#',
            order: 3,
          },
        ],
      },
    },
  });
  console.log(`Category "${tools.name}" created with items`);

  // ========================
  // TEAMS
  // ========================
  const teamNames = ['צוות א׳', 'צוות ב׳', 'צוות ג׳', 'צוות ד׳'];
  for (const name of teamNames) {
    await prisma.team.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`${teamNames.length} teams created`);

  // ========================
  // ONBOARDING CONTENT
  // ========================
  const onboardingItems = [
    {
      title: 'סרטון היכרות עם העמותה',
      description: 'סרטון קצר המציג את העמותה, מטרותיה ואופן הפעילות',
      type: 'VIDEO' as const,
      url: '#',
      order: 1,
      isRequired: true,
    },
    {
      title: 'סרטון בטיחות בים',
      description: 'סרטון חובה - כללי בטיחות בסיסיים להפלגה',
      type: 'VIDEO' as const,
      url: '#',
      order: 2,
      isRequired: true,
    },
    {
      title: 'מסמך נהלים ובטיחות',
      description: 'קריאת מסמך הנהלים המלא של העמותה',
      type: 'DOCUMENT' as const,
      url: '#',
      order: 3,
      isRequired: true,
    },
    {
      title: 'סרטון מערכות הסירה',
      description: 'היכרות עם מערכות הסירה NG26',
      type: 'VIDEO' as const,
      url: '#',
      order: 4,
      isRequired: true,
    },
    {
      title: 'מדריך צ׳ק ליסט יציאה וחזרה',
      description: 'הכרת תהליך הצ׳ק ליסט לפני ואחרי הפלגה',
      type: 'DOCUMENT' as const,
      url: '#',
      order: 5,
      isRequired: true,
    },
  ];

  for (const item of onboardingItems) {
    await prisma.onboardingContent.create({ data: item });
  }
  console.log(`${onboardingItems.length} onboarding content items created`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
