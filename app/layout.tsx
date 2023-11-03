import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import Providers from './lib/Providers';
import Appbar from './ui/Appbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Appbar />
          {children}
        </Providers>
        </body>
    </html>
  );
}
