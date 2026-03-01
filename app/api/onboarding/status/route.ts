import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      onboardingStatus: true,
      licenseType: true,
      licenseNumber: true,
      fullName: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  // Check registration completeness
  const registrationComplete = !!(user.licenseType && user.licenseNumber);

  // Check learning progress
  const allRequired = await prisma.onboardingContent.findMany({
    where: { isRequired: true },
  });
  const completedProgress = await prisma.onboardingProgress.findMany({
    where: {
      userId: session.user.id,
      completed: true,
    },
  });
  const learningComplete = allRequired.every((c) =>
    completedProgress.some((p) => p.contentId === c.id)
  );

  // Check signatures
  const signatures = await prisma.signature.findMany({
    where: { userId: session.user.id },
  });
  const hasSafety = signatures.some((s) => s.declarationType === 'SAFETY');
  const hasBehavior = signatures.some((s) => s.declarationType === 'BEHAVIOR');
  const signaturesComplete = hasSafety && hasBehavior;

  // Determine current step
  let currentStep = 1;
  if (registrationComplete) currentStep = 2;
  if (registrationComplete && learningComplete) currentStep = 3;
  if (registrationComplete && learningComplete && signaturesComplete) currentStep = 4; // all done

  return NextResponse.json({
    status: user.onboardingStatus,
    currentStep,
    registrationComplete,
    learningComplete,
    learningProgress: {
      completed: completedProgress.length,
      total: allRequired.length,
    },
    signaturesComplete,
    hasSafety,
    hasBehavior,
  });
}
