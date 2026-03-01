import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { reportsToExcelBuffer } from '@/lib/utils/excel-export';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const teamId = req.nextUrl.searchParams.get('teamId');
  const dateFrom = req.nextUrl.searchParams.get('dateFrom');
  const dateTo = req.nextUrl.searchParams.get('dateTo');

  const where: any = {};

  // Non-admin users only see their own reports
  if (session.user.role !== 'ADMIN') {
    where.primarySkipperId = session.user.id;
  }

  if (teamId) where.teamId = teamId;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);
  }

  const reports = await prisma.report.findMany({
    where,
    include: {
      team: true,
      primarySkipper: { select: { fullName: true } },
      secondarySkipper: { select: { fullName: true } },
      _count: { select: { participants: true } },
    },
    orderBy: { date: 'desc' },
  });

  const buffer = reportsToExcelBuffer(reports);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="reports-${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  });
}
