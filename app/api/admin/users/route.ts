import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const search = req.nextUrl.searchParams.get('search') || '';
  const role = req.nextUrl.searchParams.get('role') || '';
  const status = req.nextUrl.searchParams.get('status') || '';

  const where: any = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role;
  if (status) where.onboardingStatus = status;

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      onboardingStatus: true,
      licenseType: true,
      createdAt: true,
      _count: { select: { reportsAsPrimary: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}
