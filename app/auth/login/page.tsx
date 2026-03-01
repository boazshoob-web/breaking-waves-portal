'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('אימייל או סיסמה שגויים');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">התחברות</h1>
          <p className="page-subtitle">
            התחבר למערכת פורטל שוברים גלים
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-md mx-auto">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-error-red/10 text-error-red rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="input-label">
                  אימייל
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
                <label htmlFor="password" className="input-label">
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    className={`input-field pr-10 ${errors.password ? 'border-error-red' : ''}`}
                    placeholder="••••••••"
                    dir="ltr"
                    {...register('password')}
                  />
                  <Lock className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.password && (
                  <p className="input-error">{errors.password.message}</p>
                )}
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
                    <LogIn className="w-5 h-5" />
                    <span>התחבר</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                אין לך חשבון?{' '}
                <Link
                  href="/auth/register"
                  className="text-ocean-blue hover:underline font-semibold"
                >
                  הרשמה
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
