'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingStatus {
  status: string;
  currentStep: number;
  registrationComplete: boolean;
  learningComplete: boolean;
  signaturesComplete: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const res = await fetch('/api/onboarding/status');
      if (res.ok) {
        const data: OnboardingStatus = await res.json();
        if (data.status === 'APPROVED') {
          router.replace('/');
          return;
        }
        if (!data.registrationComplete) {
          router.replace('/onboarding/registration');
        } else if (!data.learningComplete) {
          router.replace('/onboarding/learning');
        } else {
          router.replace('/onboarding/signature');
        }
      }
      setIsLoading(false);
    }
    checkStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  return null;
}
