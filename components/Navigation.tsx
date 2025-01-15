'use client';

import Link from 'next/link';

type LinkTarget = {
  title: string;
  url: string;
  requiresAuth?: boolean;
};

const Navigation = ({
  linkTargets,
  isAuthenticated,
  isMobile,
}: {
  linkTargets: LinkTarget[];
  isAuthenticated: boolean;
  isMobile: boolean;
}) => {
  return (
    <nav
      className={`${
        isMobile
          ? 'md:hidden bg-gray-800 text-white px-4 py-2 space-y-2'
          : 'hidden md:flex space-x-6'
      }`}
    >
      {linkTargets
        .filter((link) => !link.requiresAuth || isAuthenticated)
        .map((link) => (
          <Link
            key={link.url}
            href={link.url}
            className={`${isMobile ? 'block' : ''} hover:underline`}
          >
            {link.title}
          </Link>
        ))}
    </nav>
  );
};

export default Navigation;
