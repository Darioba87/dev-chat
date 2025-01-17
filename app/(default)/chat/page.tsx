'use client';

import { useState, useEffect, useRef, JSX } from 'react';
import io from 'socket.io-client';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import Picker from 'emoji-picker-react';
import Image from 'next/image';

const socket = io('http://localhost:4000', { withCredentials: true });
const gf = new GiphyFetch('eBH01NFVyV6gco0RHkayUeq4RqK0RR9u'); // API Key de Giphy

const getRandomColor = () => {
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A8', '#33A8FF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface Message {
  nickname: string;
  avatarUrl: string;
  color: string;
  text: string | JSX.Element;
  time: string;
}

const Chat = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userColor, setUserColor] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [gifSearch, setGifSearch] = useState('');
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUser', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const user = await response.json();
          setNickname(user.nickname);
          setAvatarUrl(user.image || `https://i.pravatar.cc/150?u=${user.id}`);
          setUserColor(getRandomColor());
          setIsLoggedIn(true);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        window.location.href = '/login';
      }
    };

    fetchUserData();

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    // Set up the socket listener
    if (!socket.hasListeners('message')) {
      socket.on('message', handleNewMessage);
    }

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      nickname,
      avatarUrl,
      color: userColor,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    // Emit message and update local state
    socket.emit('message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showEmojiPicker]);

  const searchGifs = async () => {
    if (!gifSearch.trim()) return;

    try {
      const { data } = await gf.search(gifSearch, { limit: 9 });
      setGifs(data);
    } catch (error) {
      console.error('Error searching for GIFs', error);
    }    


  };

const sendGif = (gifUrl: string) => {
  const gifMessage: Message = {
    nickname,
    avatarUrl,
    color: userColor,
    text: gifUrl, 
    time: new Date().toLocaleTimeString(),
  };

  socket.emit('message', gifMessage);
  setMessages((prev) => [...prev, gifMessage]);
};

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-gray-800 text-white flex flex-col">
      <header className="bg-gray-900 p-4 text-center text-lg font-bold">
        Bienvenido al chat, {nickname}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-4 p-2 bg-gray-700 rounded-md">
            <Image src={msg.avatarUrl} alt={msg.nickname} width={40} height={40} className="rounded-full" />
            <div>
              <span className="font-bold" style={{ color: msg.color }}>
                {msg.nickname}:
              </span>
              <div>{typeof msg.text === 'string' && msg.text.startsWith('http') ? <Image src={msg.text} alt="GIF" width={100} height={100} /> : msg.text}</div>
              <span className="text-sm text-gray-400">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 bg-gray-800 p-2 rounded-md z-50">
          <Picker onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
        </div>
      )}

      <div className="bg-gray-900 p-4 flex items-center space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 rounded-md bg-gray-700 text-white"
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 bg-gray-700 rounded-md">
          😊
        </button>
        <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-md">
          Send
        </button>
      </div>

      <div className="bg-gray-900 p-4">
        <input
          type="text"
          value={gifSearch}
          onChange={(e) => setGifSearch(e.target.value)}
          placeholder="Buscar GIFs..."
          className="w-full p-2 rounded-md bg-gray-700 text-white"
        />
        <button onClick={searchGifs} className="mt-2 p-2 bg-green-600 rounded-md">
          Search GIFs
        </button>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {gifs.map((gif, index) => (
            <Image
              key={index}
              src={gif.images.fixed_height_small.url}
              alt={gif.title}
              width={100}
              height={100}
              className="cursor-pointer rounded-md"
              onClick={() => sendGif(gif.images.fixed_height_small.url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
