'use client';

import { usePathname } from 'next/navigation';
import { ClipboardCheck, BookOpen, PenTool } from 'lucide-react';

const steps = [
  { label: 'רישום', icon: ClipboardCheck, path: '/onboarding/registration' },
  { label: 'למידה', icon: BookOpen, path: '/onboarding/learning' },
  { label: 'חתימה', icon: PenTool, path: '/onboarding/signature' },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentStepIndex = steps.findIndex((s) => pathname?.startsWith(s.path));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">תהליך Onboarding</h1>
          <p className="page-subtitle">השלימו את כל השלבים כדי להתחיל להפליג</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="container py-6">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.path} className="flex items-center gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-ocean-blue text-white'
                        : isCompleted
                        ? 'bg-success-green text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-ocean-blue'
                        : isCompleted
                        ? 'text-success-green'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-16 h-0.5 ${
                      isCompleted ? 'bg-success-green' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="container pb-8">{children}</div>
    </div>
  );
}
