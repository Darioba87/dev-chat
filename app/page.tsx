import type { Metadata } from 'next';
import HomePage from './(default)/home/page';

export const metadata: Metadata = {
  title: 'Startseite',
};

export default function Home() {
  return (
    <main className="default-layout">
     <HomePage />
    
  </main>
  );
}
