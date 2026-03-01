import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  // Summary counts
  const [totalReports, totalParticipants, totalTeams, totalUsers] =
    await Promise.all([
      prisma.report.count(),
      prisma.participant.count({ where: { active: true } }),
      prisma.team.count(),
      prisma.user.count(),
    ]);

  // Reports per month (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const reportsRaw = await prisma.report.findMany({
    where: { date: { gte: twelveMonthsAgo } },
    select: { date: true },
    orderBy: { date: 'asc' },
  });

  const monthlyReports: Record<string, number> = {};
  for (const r of reportsRaw) {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
    monthlyReports[key] = (monthlyReports[key] || 0) + 1;
  }

  // Fill missing months with 0
  const monthlyData: { month: string; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
    monthlyData.push({ month: label, count: monthlyReports[key] || 0 });
  }

  // Participants per report (last 12 months)
  const participantCounts = await prisma.report.findMany({
    where: { date: { gte: twelveMonthsAgo } },
    select: {
      date: true,
      _count: { select: { participants: true } },
    },
    orderBy: { date: 'asc' },
  });

  const monthlyParticipants: Record<string, number> = {};
  for (const r of participantCounts) {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
    monthlyParticipants[key] = (monthlyParticipants[key] || 0) + r._count.participants;
  }

  const participantTrend: { month: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
    participantTrend.push({ month: label, count: monthlyParticipants[key] || 0 });
  }

  // Reports by team
  const teamBreakdown = await prisma.report.groupBy({
    by: ['teamId'],
    _count: { id: true },
  });

  const teams = await prisma.team.findMany({
    select: { id: true, name: true },
  });

  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const byTeam = teamBreakdown.map((t) => ({
    team: teamMap.get(t.teamId) || 'לא ידוע',
    count: t._count.id,
  }));

  return NextResponse.json({
    summary: { totalReports, totalParticipants, totalTeams, totalUsers },
    monthlyData,
    participantTrend,
    byTeam,
  });
}
