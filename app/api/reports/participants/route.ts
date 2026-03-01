import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const teamId = req.nextUrl.searchParams.get('teamId');

  const participants = await prisma.participant.findMany({
    where: {
      active: true,
      ...(teamId ? { teamId } : {}),
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(participants);
}
