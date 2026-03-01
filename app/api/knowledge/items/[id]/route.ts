import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { updateItemSchema } from '@/lib/validations/knowledge';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json();
  const validated = updateItemSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: validated.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { tagIds, ...itemData } = validated.data;

  // If tagIds provided, replace all tags
  if (tagIds !== undefined) {
    await prisma.knowledgeItemTag.deleteMany({
      where: { itemId: params.id },
    });
  }

  const item = await prisma.knowledgeItem.update({
    where: { id: params.id },
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

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  await prisma.knowledgeItem.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: 'הפריט נמחק' });
}
