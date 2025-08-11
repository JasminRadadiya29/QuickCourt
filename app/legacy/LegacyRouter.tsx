"use client";
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { usePathname } from 'next/navigation';

export default function LegacyRouter({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  return <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>;
}
