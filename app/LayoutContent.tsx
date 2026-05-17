'use client';

import { usePathname } from 'next/navigation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes: no header/footer, no background wrapper
    return <>{children}</>;
  }

  // Regular routes: include header and footer
  return (
    <div className="min-h-screen bg-[#2b2a29]">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
