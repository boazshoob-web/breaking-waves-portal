import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { submitSignatureSchema } from '@/lib/validations/onboarding';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const signatures = await prisma.signature.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(signatures);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const body = await req.json();
  const validated = submitSignatureSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { declarationType, signatureImage } = validated.data;

  // Save signature image to filesystem
  const base64Data = signatureImage.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'signatures');
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${session.user.id}-${declarationType}-${Date.now()}.png`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  const relativePath = `/uploads/signatures/${fileName}`;

  // Upsert signature record
  const signature = await prisma.signature.upsert({
    where: {
      userId_declarationType: {
        userId: session.user.id,
        declarationType,
      },
    },
    update: {
      signatureImage: relativePath,
      signedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      declarationType,
      signatureImage: relativePath,
    },
  });

  // Check if both signatures are complete
  const allSignatures = await prisma.signature.findMany({
    where: { userId: session.user.id },
  });

  if (allSignatures.length >= 2) {
    // Check if all learning is also complete
    const allContent = await prisma.onboardingContent.findMany({
      where: { isRequired: true },
    });
    const userProgress = await prisma.onboardingProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
    });

    const allLearningComplete = allContent.every((c) =>
      userProgress.some((p) => p.contentId === c.id)
    );

    if (allLearningComplete) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { onboardingStatus: 'APPROVED' },
      });
    }
  }

  return NextResponse.json(signature, { status: 201 });
}
