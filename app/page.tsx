import type { Metadata } from 'next';

import Logout from '@/components/Auth/Logout';

export const metadata: Metadata = {
  title: 'Startseite',
};

export default function Home() {
  return (
    <main className="default-layout">
      <Logout/>    
  </main>
  );
}
