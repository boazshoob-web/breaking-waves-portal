import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const teamId = req.nextUrl.searchParams.get('teamId');
  const search = req.nextUrl.searchParams.get('search');

  const where: any = {};
  if (teamId) where.teamId = teamId;
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const participants = await prisma.participant.findMany({
    where,
    include: {
      team: { select: { id: true, name: true } },
      _count: { select: { reports: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(participants);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { name, teamId } = await req.json();
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'שם המשתתף נדרש' }, { status: 400 });
  }

  const participant = await prisma.participant.create({
    data: {
      name: name.trim(),
      teamId: teamId || null,
      active: true,
    },
    include: {
      team: { select: { id: true, name: true } },
      _count: { select: { reports: true } },
    },
  });

  return NextResponse.json(participant, { status: 201 });
}
