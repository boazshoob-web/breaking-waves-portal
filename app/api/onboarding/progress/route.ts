import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const allContent = await prisma.onboardingContent.findMany({
    orderBy: { order: 'asc' },
  });

  const userProgress = await prisma.onboardingProgress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap = new Map(
    userProgress.map((p) => [p.contentId, p])
  );

  const items = allContent.map((content) => ({
    ...content,
    completed: progressMap.get(content.id)?.completed || false,
    viewedAt: progressMap.get(content.id)?.viewedAt || null,
  }));

  const totalRequired = allContent.filter((c) => c.isRequired).length;
  const completedRequired = allContent.filter(
    (c) => c.isRequired && progressMap.get(c.id)?.completed
  ).length;

  return NextResponse.json({
    items,
    totalRequired,
    completedRequired,
    allRequiredComplete: totalRequired === completedRequired,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const { contentId, completed } = await req.json();

  const progress = await prisma.onboardingProgress.upsert({
    where: {
      userId_contentId: {
        userId: session.user.id,
        contentId,
      },
    },
    update: {
      completed,
      viewedAt: completed ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      contentId,
      completed,
      viewedAt: completed ? new Date() : null,
    },
  });

  // Update user onboarding status to IN_PROGRESS if still PENDING
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (user?.onboardingStatus === 'PENDING') {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingStatus: 'IN_PROGRESS' },
    });
  }

  return NextResponse.json(progress);
}
