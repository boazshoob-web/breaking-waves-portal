import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { createItemSchema } from '@/lib/validations/knowledge';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json();
  const validated = createItemSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { tagIds, ...itemData } = validated.data;

  const item = await prisma.knowledgeItem.create({
    data: {
      ...itemData,
      tags: tagIds
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
      category: true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
