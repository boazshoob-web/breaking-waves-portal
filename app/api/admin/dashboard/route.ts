import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalUsers, pendingOnboarding, reportsThisMonth, activeTeams, recentReports, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { onboardingStatus: { not: 'APPROVED' } },
      }),
      prisma.report.count({
        where: { date: { gte: startOfMonth } },
      }),
      prisma.team.count(),
      prisma.report.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          activityNumber: true,
          date: true,
          team: { select: { name: true } },
          primarySkipper: { select: { fullName: true } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
          onboardingStatus: true,
        },
      }),
    ]);

  return NextResponse.json({
    totalUsers,
    pendingOnboarding,
    reportsThisMonth,
    activeTeams,
    recentReports,
    recentUsers,
  });
}
