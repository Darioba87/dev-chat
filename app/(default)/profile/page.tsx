'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    nickname: '',
    image: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('/api/getUser', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login'); // Redirect if not authenticated
      }
    };

    const checkAuthAndFetchUser = async () => {
      try {
        const authResponse = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (!authResponse.ok) {
          router.push('/login');
          return;
        }

        await getUser();
      } catch (error) {
        console.error('Error during authentication check or fetching user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/putUser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={userData.name || ''}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="text-black mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nickname</label>
          <input
            type="text"
            value={userData.nickname || ''}
            onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
            className="text-black mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
          <input
            type="text"
            value={userData.image || ''}
            onChange={(e) => setUserData({ ...userData, image: e.target.value })}
            className="text-black mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
          <Image src={userData.image} alt="Profile" width={80} height={80} className="mt-2 rounded-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={userData.password || ''}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            className="text-black mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
