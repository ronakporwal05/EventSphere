'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, useUser } from '@clerk/nextjs';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';

interface ClerkStatusContextType {
  isClerkEnabled: boolean;
  publishableKey: string | null;
  setPublishableKey: (key: string) => void;
}

const ClerkStatusContext = createContext<ClerkStatusContextType>({
  isClerkEnabled: false,
  publishableKey: null,
  setPublishableKey: () => {},
});

export const useClerkStatus = () => useContext(ClerkStatusContext);

// Component that synchronizes Clerk user session with EventSphere useAuthStore
function ClerkStateSynchronizer({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const primaryEmail =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        'clerk.user@eventsphere.ai';
      const firstName = user.firstName || user.username || 'Clerk';
      const lastName = user.lastName || 'Attendee';
      const role: 'ORGANIZATION_ADMIN' | 'EVENT_MANAGER' | 'ATTENDEE' = primaryEmail.includes('admin')
        ? 'ORGANIZATION_ADMIN'
        : primaryEmail.includes('manager')
        ? 'EVENT_MANAGER'
        : 'ATTENDEE';

      const clerkUserProfile = {
        id: user.id,
        email: primaryEmail,
        firstName,
        lastName,
        role,
        tenantId: 'tenant-default',
        avatarUrl: user.imageUrl,
        emailVerified: Boolean(user.primaryEmailAddress?.verification?.status === 'verified'),
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      };

      setAuth(clerkUserProfile, `clerk-jwt-${user.id}`, 'clerk-session');
    }
  }, [isLoaded, isSignedIn, user, setAuth]);

  return <>{children}</>;
}

export function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  const [clerkPubKey, setClerkPubKey] = useState<string | null>(() => {
    return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || null;
  });

  useEffect(() => {
    if (!clerkPubKey) {
      const localKey =
        typeof window !== 'undefined' ? localStorage.getItem('clerk_publishable_key') : null;
      if (localKey && localKey.startsWith('pk_')) {
        setClerkPubKey(localKey);
      } else {
        fetch('/api/clerk-config')
          .then((r) => r.json())
          .then((data) => {
            if (data?.configured && data?.publishableKey) {
              setClerkPubKey(data.publishableKey);
            }
          })
          .catch(() => {});
      }
    }
  }, [clerkPubKey]);

  const updateKey = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clerk_publishable_key', key);
    }
    setClerkPubKey(key);
  };

  const isValidClerkKey = Boolean(clerkPubKey && clerkPubKey.startsWith('pk_'));

  const contextValue = {
    isClerkEnabled: isValidClerkKey,
    publishableKey: clerkPubKey,
    setPublishableKey: updateKey,
  };

  if (!isValidClerkKey) {
    return (
      <ClerkStatusContext.Provider value={contextValue}>
        {children}
      </ClerkStatusContext.Provider>
    );
  }

  return (
    <ClerkStatusContext.Provider value={contextValue}>
      <ClerkProvider
        publishableKey={clerkPubKey!}
        signInUrl="/login"
        signUpUrl="/register"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            borderRadius: '0.75rem',
          },
          elements: {
            formButtonPrimary:
              'bg-[#f5ce32] hover:bg-yellow-400 text-black font-black uppercase text-xs py-3 border-2 border-black shadow-[4px_4px_0px_0px_#000] tracking-wider transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            card: 'border-4 border-black shadow-[8px_8px_0px_0px_#000] rounded-3xl bg-white p-6 sm:p-8',
            headerTitle: 'font-black uppercase tracking-tight text-2xl text-black',
            headerSubtitle: 'text-xs text-neutral-600 font-medium',
            socialButtonsBlockButton:
              'border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000] hover:bg-neutral-50 rounded-xl transition-all',
            socialButtonsBlockButtonText: 'font-black text-black',
            footerActionLink: 'text-black font-black underline hover:text-amber-600',
            formFieldInput:
              'border-2 border-black rounded-xl focus:ring-0 focus:border-black font-medium text-xs py-2.5 px-3 bg-neutral-50',
            formFieldLabel: 'font-black uppercase text-[11px] tracking-wider text-black',
          },
        }}
      >
        <ClerkStateSynchronizer>{children}</ClerkStateSynchronizer>
      </ClerkProvider>
    </ClerkStatusContext.Provider>
  );
}
