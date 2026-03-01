import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { saveUploadedFile } from '@/lib/utils/upload';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const data = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      licenseType: formData.get('licenseType') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      sailingExperience: (formData.get('sailingExperience') as string) || undefined,
    };

    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'כתובת האימייל כבר רשומה במערכת' },
        { status: 409 }
      );
    }

    let licenseFilePath: string | undefined;
    const licenseFile = formData.get('licenseFile') as File | null;
    if (licenseFile && licenseFile.size > 0) {
      licenseFilePath = await saveUploadedFile(licenseFile, 'licenses');
    }

    const passwordHash = await bcrypt.hash(validated.data.password, 12);

    const user = await prisma.user.create({
      data: {
        fullName: validated.data.fullName,
        email: validated.data.email,
        phone: validated.data.phone,
        passwordHash,
        licenseType: validated.data.licenseType,
        licenseNumber: validated.data.licenseNumber,
        sailingExperience: validated.data.sailingExperience,
        licenseFilePath,
      },
    });

    return NextResponse.json(
      { message: 'ההרשמה בוצעה בהצלחה', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהרשמה, אנא נסו שנית' },
      { status: 500 }
    );
  }
}
