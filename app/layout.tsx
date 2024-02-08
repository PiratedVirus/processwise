"use client";
import '@/app/ui/styles/global.css';
import {inter} from '@/app/ui/styles/fonts';
import Providers from './lib/Providers';
import TopNav from './ui/TopNavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <Providers>
            <TopNav />
            {children}
          </Providers>
          </body>
    </html>
  );
}
