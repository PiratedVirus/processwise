"use client";
import '@/app/ui/styles/global.css';
import {inter} from '@/app/ui/styles/fonts';
import Providers from './lib/Providers';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <Providers>
            {children}
            <SpeedInsights />
            <Analytics />
          </Providers>
          </body>
    </html>
  );
}
