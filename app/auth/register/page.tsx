'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Anchor,
  FileText,
  AlertCircle,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

const LICENSE_TYPES = [
  { value: '', label: 'בחר סוג רישיון...' },
  { value: 'skipper_3', label: 'סקיפר 3 - כלי שייט קטן' },
  { value: 'skipper_30', label: 'סקיפר 30 - יאכטה' },
  { value: 'skipper_47', label: 'סקיפר 47 - כלי שייט גדול' },
  { value: 'rav_hovel', label: 'רב חובל' },
  { value: 'katzin', label: 'קצין' },
  { value: 'other', label: 'אחר' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('licenseType', data.licenseType);
      formData.append('licenseNumber', data.licenseNumber);
      if (data.sailingExperience) {
        formData.append('sailingExperience', data.sailingExperience);
      }
      if (licenseFile) {
        formData.append('licenseFile', licenseFile);
      }

      const res = await fetch('/api/users/register', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.details) {
          const firstError = Object.values(result.details).flat()[0];
          setError(firstError as string);
        } else {
          setError(result.error || 'שגיאה בהרשמה');
        }
        setIsLoading(false);
        return;
      }

      // Auto-login after successful registration
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push('/onboarding');
      router.refresh();
    } catch {
      setError('שגיאה בהרשמה, אנא נסו שנית');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">הרשמה</h1>
          <p className="page-subtitle">
            הצטרפו לצוות שוברים גלים
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-error-red/10 text-error-red rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Personal Details Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  פרטים אישיים
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="input-label">
                      שם מלא *
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        className={`input-field pr-10 ${errors.fullName ? 'border-error-red' : ''}`}
                        placeholder="ישראל ישראלי"
                        {...register('fullName')}
                      />
                      <User className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.fullName && (
                      <p className="input-error">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="input-label">
                      אימייל *
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        className={`input-field pr-10 ${errors.email ? 'border-error-red' : ''}`}
                        placeholder="your@email.com"
                        dir="ltr"
                        {...register('email')}
                      />
                      <Mail className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="input-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="input-label">
                      טלפון *
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        className={`input-field pr-10 ${errors.phone ? 'border-error-red' : ''}`}
                        placeholder="0501234567"
                        dir="ltr"
                        {...register('phone')}
                      />
                      <Phone className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.phone && (
                      <p className="input-error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  סיסמה
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="input-label">
                      סיסמה *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        className={`input-field pr-10 ${errors.password ? 'border-error-red' : ''}`}
                        placeholder="לפחות 6 תווים"
                        dir="ltr"
                        {...register('password')}
                      />
                      <Lock className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.password && (
                      <p className="input-error">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="input-label">
                      אימות סיסמה *
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        className={`input-field pr-10 ${errors.confirmPassword ? 'border-error-red' : ''}`}
                        placeholder="הזן סיסמה שוב"
                        dir="ltr"
                        {...register('confirmPassword')}
                      />
                      <Lock className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.confirmPassword && (
                      <p className="input-error">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* License Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  פרטי רישיון שייט
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="licenseType" className="input-label">
                      סוג רישיון *
                    </label>
                    <div className="relative">
                      <select
                        id="licenseType"
                        className={`select-field pr-10 ${errors.licenseType ? 'border-error-red' : ''}`}
                        {...register('licenseType')}
                      >
                        {LICENSE_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <Anchor className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.licenseType && (
                      <p className="input-error">{errors.licenseType.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="input-label">
                      מספר רישיון *
                    </label>
                    <div className="relative">
                      <input
                        id="licenseNumber"
                        type="text"
                        className={`input-field pr-10 ${errors.licenseNumber ? 'border-error-red' : ''}`}
                        placeholder="מספר תעודת הסקיפר"
                        {...register('licenseNumber')}
                      />
                      <FileText className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.licenseNumber && (
                      <p className="input-error">{errors.licenseNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="sailingExperience" className="input-label">
                    ניסיון בשייט (אופציונלי)
                  </label>
                  <textarea
                    id="sailingExperience"
                    rows={3}
                    className="textarea-field"
                    placeholder="ספר/י על הניסיון שלך בשייט..."
                    {...register('sailingExperience')}
                  />
                </div>

                <div className="mt-4">
                  <label className="input-label">
                    העלאת צילום רישיון (אופציונלי)
                  </label>
                  <div className="mt-1">
                    <label
                      htmlFor="licenseFile"
                      className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-ocean-blue hover:bg-ocean-blue/5 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-gray-600">
                        {licenseFile
                          ? licenseFile.name
                          : 'לחץ להעלאת קובץ (PDF, JPG, PNG)'}
                      </span>
                      <input
                        id="licenseFile"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          setLicenseFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>הרשמה</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                כבר יש לך חשבון?{' '}
                <Link
                  href="/auth/login"
                  className="text-ocean-blue hover:underline font-semibold"
                >
                  התחברות
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
