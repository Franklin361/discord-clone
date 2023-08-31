"use client";
import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export const UserButtonProfile = () => {
  const { theme } = useTheme()

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined
      }}
    />
  )
}