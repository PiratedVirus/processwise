"use client";
import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import Providers from './lib/Providers';
import Appbar from './ui/Appbar';
import TopNav from './components/TopNavBar';
import { ChakraProvider } from '@chakra-ui/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ChakraProvider>
        <body className={`${inter.className} antialiased`}>
          <Providers>
            <TopNav />
            {children}
          </Providers>
          </body>
        </ChakraProvider>
    </html>
  );
}
