import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { createReportSchema } from '@/lib/validations/reports';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const teamId = searchParams.get('teamId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const all = searchParams.get('all');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  // Regular users see only their own reports
  if (all !== 'true' || session.user.role !== 'ADMIN') {
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
    orderBy: { date: 'desc' },
    include: {
      team: true,
      primarySkipper: { select: { id: true, fullName: true } },
      secondarySkipper: { select: { id: true, fullName: true } },
      _count: { select: { participants: true } },
    },
  });

  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const body = await req.json();
  const validated = createReportSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { participantIds, ...reportData } = validated.data;

  const report = await prisma.report.create({
    data: {
      date: new Date(reportData.date),
      teamId: reportData.teamId,
      primarySkipperId: session.user.id,
      secondarySkipperId: reportData.secondarySkipperId || null,
      activityDescription: reportData.activityDescription,
      weatherConditions: reportData.weatherConditions,
      emotionalHandling: reportData.emotionalHandling,
      summaryNextSteps: reportData.summaryNextSteps,
      generalNotes: reportData.generalNotes || null,
      participants: {
        create: participantIds.map((participantId) => ({
          participantId,
          present: true,
        })),
      },
    },
    include: {
      team: true,
      primarySkipper: { select: { fullName: true } },
      participants: { include: { participant: true } },
    },
  });

  return NextResponse.json(report, { status: 201 });
}
