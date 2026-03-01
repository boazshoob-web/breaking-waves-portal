import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'שם הקטגוריה נדרש'),
  icon: z.string().optional(),
  order: z.number().int().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createItemSchema = z.object({
  title: z.string().min(1, 'כותרת נדרשת'),
  description: z.string().optional(),
  type: z.enum(['PDF', 'VIDEO', 'LINK']),
  url: z.string().min(1, 'כתובת URL נדרשת'),
  categoryId: z.string().min(1, 'קטגוריה נדרשת'),
  order: z.number().int().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateItemSchema = createItemSchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(1, 'שם התגית נדרש'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
