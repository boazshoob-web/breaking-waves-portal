import { z } from 'zod';

export const createReportSchema = z.object({
  date: z.string().min(1, 'תאריך נדרש'),
  teamId: z.string().min(1, 'יש לבחור צוות'),
  secondarySkipperId: z.string().optional(),
  participantIds: z.array(z.string()).min(1, 'יש לסמן לפחות משתתף אחד'),
  activityDescription: z.string().min(1, 'תיאור הפעילות נדרש'),
  weatherConditions: z.string().min(1, 'תנאי מזג אוויר נדרשים'),
  emotionalHandling: z.string().min(1, 'תיאור התמודדות רגשית נדרש'),
  summaryNextSteps: z.string().min(1, 'סיכום ונקודות להמשך נדרשים'),
  generalNotes: z.string().optional(),
});

export const updateReportSchema = createReportSchema.partial();

export type CreateReportInput = z.infer<typeof createReportSchema>;
