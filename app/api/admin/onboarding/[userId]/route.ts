import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      licenseType: true,
      licenseNumber: true,
      sailingExperience: true,
      licenseFilePath: true,
      onboardingStatus: true,
      createdAt: true,
      onboardingProgress: {
        include: { content: true },
        orderBy: { content: { order: 'asc' } },
      },
      signatures: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { onboardingStatus } = await req.json();

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: { onboardingStatus },
    select: { id: true, fullName: true, onboardingStatus: true },
  });

  return NextResponse.json(user);
}
