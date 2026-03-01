import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      licenseType: true,
      licenseNumber: true,
      sailingExperience: true,
      licenseFilePath: true,
      onboardingStatus: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  return NextResponse.json(user);
}

const updateProfileSchema = z.object({
  phone: z.string().regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין').optional(),
  sailingExperience: z.string().optional(),
  licenseType: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const body = await req.json();
  const validated = updateProfileSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: validated.data,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      sailingExperience: true,
    },
  });

  return NextResponse.json(user);
}
