import './globals.css';
// Import legacy Tailwind only if needed; Next already has globals
// Keeping minimal to avoid double base styles during migration
import type { ReactNode } from 'react';

export const metadata = {
  title: 'QuickCourt',
  description: 'Sports facility booking platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
