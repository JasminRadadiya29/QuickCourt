import './globals.css';
import '../src/styles/tailwind.css';
import type { ReactNode } from 'react';
import { AppProviders } from './providers';

export const metadata = {
  title: 'QuickCourt',
  description: 'Sports facility booking platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
