'use client';

import LoginModal from './LogInModal';
import { useState, useEffect } from 'react';

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
      } else {
        alert('Failed to log out.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Check if the token exists on mount
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
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

        {/* Menu for Larger Screens */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Services
          </a>
        </nav>

        {/* Login/Logout */}
        <div>
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

        {/* Hamburger Menu Icon for Small Screens */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-800 text-white px-4 py-2 space-y-2">
          <a href="#" className="block hover:underline">
            Home
          </a>
          <a href="#" className="block hover:underline">
            About
          </a>
          <a href="#" className="block hover:underline">
            Services
          </a>
        </nav>
      )}

      {/* Modal */}
      {showModal && <LoginModal onClose={toggleModal} onLogin={handleLogin} />}
    </>
  );
};

export default Header;
