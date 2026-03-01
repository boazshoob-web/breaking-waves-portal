import { z } from 'zod';

export const updateRegistrationSchema = z.object({
  licenseType: z.string().min(1, 'יש לבחור סוג רישיון').optional(),
  licenseNumber: z.string().min(1, 'מספר רישיון נדרש').optional(),
  sailingExperience: z.string().optional(),
});

export const markProgressSchema = z.object({
  contentId: z.string().min(1),
  completed: z.boolean(),
});

export const submitSignatureSchema = z.object({
  declarationType: z.enum(['SAFETY', 'BEHAVIOR']),
  signatureImage: z.string().min(1, 'חתימה נדרשת'),
});

export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
export type MarkProgressInput = z.infer<typeof markProgressSchema>;
export type SubmitSignatureInput = z.infer<typeof submitSignatureSchema>;
