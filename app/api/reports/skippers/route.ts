import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const skippers = await prisma.user.findMany({
    where: { onboardingStatus: 'APPROVED' },
    select: {
      id: true,
      fullName: true,
    },
    orderBy: { fullName: 'asc' },
  });

  return NextResponse.json(skippers);
}
