import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { role: 'USER' };
  if (status) {
    where.onboardingStatus = status;
  }
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      onboardingStatus: true,
      createdAt: true,
      _count: {
        select: {
          onboardingProgress: { where: { completed: true } },
          signatures: true,
        },
      },
    },
  });

  // Get total required content count
  const totalRequired = await prisma.onboardingContent.count({
    where: { isRequired: true },
  });

  const usersWithProgress = users.map((user) => ({
    ...user,
    completedItems: user._count.onboardingProgress,
    totalRequired,
    signatures: user._count.signatures,
    completionPercent:
      totalRequired > 0
        ? Math.round((user._count.onboardingProgress / totalRequired) * 100)
        : 0,
  }));

  return NextResponse.json(usersWithProgress);
}
