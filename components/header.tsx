'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import LoginModal from '@/components/LogInModal';

const linkTargets = [
  { title: 'Home', url: '/' },
  { title: 'Chat', url: '/chat', requiresAuth: true },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleModal = () => setShowModal(!showModal);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Logged out successfully!');
        setIsLoggedIn(false);
        window.location.reload();
      } else {
        alert('Failed to log out.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('Error checking auth token:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthToken();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center px-4 md:px-6 py-4 bg-gray-800 text-white">
        {/* Logo */}
        <div className="text-lg md:text-xl font-bold">
          <span>🌟 Logo</span>
        </div>

        {/* Desktop Navigation */}
        <Navigation linkTargets={linkTargets} isAuthenticated={isLoggedIn} isMobile={false} />

        {/* Login/Logout and Register/Profile */}
        <div className="flex space-x-4">
          {!isLoggedIn && (
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Register
            </Link>
          )}
          {isLoggedIn && (
            <Link
              href="/profile"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Profile
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={toggleModal}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-gray-400 focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Navigation */}
      {menuOpen && (
        <Navigation linkTargets={linkTargets} isAuthenticated={isLoggedIn} isMobile={true} />
      )}

      {/* Modal */}
      {showModal && <LoginModal onClose={toggleModal} onLogin={handleLogin} />}
    </>
  );
};

export default Header;
