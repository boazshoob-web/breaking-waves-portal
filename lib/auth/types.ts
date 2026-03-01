import { Role, OnboardingStatus } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: Role;
    onboardingStatus: OnboardingStatus;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      onboardingStatus: OnboardingStatus;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    onboardingStatus: OnboardingStatus;
  }
}
