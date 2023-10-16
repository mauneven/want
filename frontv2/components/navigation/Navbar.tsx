'use client'

import { useState, useEffect } from 'react';
import './navbar.css'
import Link from 'next/link';
import endpoints from '@/app/connections/enpoints/endpoints';
import { environments } from '@/app/connections/environments/dev-environments';

interface User {
  photo?: string;
  [key: string]: any;
}

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(endpoints.user, { method: 'GET', credentials: 'include' });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
          console.log("si ves esto 2 veces en dev es normal",data)
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    checkSession();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="navbar">
      <Link href={'/'}>
        <div className="navbar-logo">
          Want
        </div>
      </Link>

      <input 
        type="text" 
        placeholder="Search" 
        className="navbar-search"
      />

      <div>
        {user ? (
          <img 
            src={user.photo ? `https://want.com.co/${user.photo}` : '/icons/person-circle.svg'}
            alt="Profile"
            className="navbar-user-photo"
          />
        ) : (
          <Link href={'/login'}>
            <button className="navbar-btn navbar-btn-login">
              Login
            </button>
          </Link>
        )}
        <button onClick={toggleTheme} className="navbar-btn navbar-btn-theme">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
};

export default Navbar;