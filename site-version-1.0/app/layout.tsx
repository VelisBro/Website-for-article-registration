import './globals.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import ParallaxBackground from '@/components/parallax-background';

export const metadata: Metadata = {
  title: 'Кафедра ИУ-5 МГТУ им. Н.Э. Баумана',
  description: 'Кафедра «Системы обработки информации и управления»',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className="bg-[#050816] text-white antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <ParallaxBackground />
          <SiteHeader />
          <div className="relative z-10">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}