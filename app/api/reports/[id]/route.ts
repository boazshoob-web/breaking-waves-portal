import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { updateReportSchema } from '@/lib/validations/reports';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: {
      team: true,
      primarySkipper: { select: { id: true, fullName: true } },
      secondarySkipper: { select: { id: true, fullName: true } },
      participants: {
        include: { participant: true },
      },
    },
  });

  if (!report) {
    return NextResponse.json({ error: 'דוח לא נמצא' }, { status: 404 });
  }

  // Only allow owner or admin to view
  if (report.primarySkipperId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  return NextResponse.json(report);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const existing = await prisma.report.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json({ error: 'דוח לא נמצא' }, { status: 404 });
  }
  if (existing.primarySkipperId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json();
  const validated = updateReportSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { participantIds, ...reportData } = validated.data;

  // Update participants if provided
  if (participantIds) {
    await prisma.reportParticipant.deleteMany({
      where: { reportId: params.id },
    });
  }

  const report = await prisma.report.update({
    where: { id: params.id },
    data: {
      ...reportData,
      date: reportData.date ? new Date(reportData.date) : undefined,
      participants: participantIds
        ? {
            create: participantIds.map((participantId) => ({
              participantId,
              present: true,
            })),
          }
        : undefined,
    },
    include: {
      team: true,
      primarySkipper: { select: { fullName: true } },
      participants: { include: { participant: true } },
    },
  });

  return NextResponse.json(report);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  await prisma.report.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'הדוח נמחק' });
}
