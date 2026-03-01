import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json();
  const data: any = {};
  if (body.name !== undefined) data.name = body.name.trim();
  if (body.teamId !== undefined) data.teamId = body.teamId || null;
  if (body.active !== undefined) data.active = body.active;

  const participant = await prisma.participant.update({
    where: { id: params.id },
    data,
    include: {
      team: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(participant);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  await prisma.participant.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'המשתתף נמחק' });
}
