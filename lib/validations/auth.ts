import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'נדרשת סיסמה'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'שם מלא נדרש (לפחות 2 תווים)'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  phone: z.string().regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  confirmPassword: z.string(),
  licenseType: z.string().min(1, 'יש לבחור סוג רישיון'),
  licenseNumber: z.string().min(1, 'מספר רישיון נדרש'),
  sailingExperience: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
