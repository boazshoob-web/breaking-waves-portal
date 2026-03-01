import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const teams = await prisma.team.findMany({
    include: {
      _count: { select: { participants: true, reports: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'שם הצוות נדרש' }, { status: 400 });
  }

  const team = await prisma.team.create({
    data: { name: name.trim() },
    include: {
      _count: { select: { participants: true, reports: true } },
    },
  });

  return NextResponse.json(team, { status: 201 });
}
