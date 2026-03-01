import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      onboardingStatus: true,
      licenseType: true,
      licenseNumber: true,
      licenseFilePath: true,
      sailingExperience: true,
      createdAt: true,
      reportsAsPrimary: {
        take: 10,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          activityNumber: true,
          date: true,
          team: { select: { name: true } },
        },
      },
      signatures: {
        select: { declarationType: true, signedAt: true },
      },
      _count: { select: { reportsAsPrimary: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json();
  const { role, onboardingStatus } = body;

  const data: any = {};
  if (role && ['USER', 'ADMIN'].includes(role)) data.role = role;
  if (onboardingStatus && ['PENDING', 'IN_PROGRESS', 'APPROVED'].includes(onboardingStatus)) {
    data.onboardingStatus = onboardingStatus;
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      fullName: true,
      role: true,
      onboardingStatus: true,
    },
  });

  return NextResponse.json(user);
}
