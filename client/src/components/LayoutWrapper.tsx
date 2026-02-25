'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Promotion from '@/components/Promotion';
import Nav from '@/components/navbar/Nav';
import PageTransition from '@/components/PageTransition';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isOffrePage = pathname === '/offre';
  const isLoginPage = pathname === '/landmark-login';
  const isAdminPage = pathname === '/admin';
  const isAdminSubPage = pathname.startsWith('/admin/');

  return (
    <>
      {!isOffrePage && !isLoginPage && !isAdminPage && !isAdminSubPage && (
        <>
          <Promotion />
          <Nav />
        </>
      )}
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}
