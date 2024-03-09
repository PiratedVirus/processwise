"use client";
import '@/app/ui/styles/global.css';
import { inter } from '@/app/ui/styles/fonts';
import TopNav from '@/app/ui/TopNavBar';
import Providers from '@/app/lib/Providers';
import { HomeOutlined } from '@ant-design/icons';
import { AntdRegistry } from '@ant-design/nextjs-registry';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { name: 'Home', href: '/moderator', icon: HomeOutlined },
  ];
  
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <TopNav links={links}/>
          <div className="bg-slate-100 flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="mb-4 mr-4 ml-4 bg-white  rounded pb-6 flex-grow md:mb-12 md:mr-12 md:ml-12 md:overflow-y-auto">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
