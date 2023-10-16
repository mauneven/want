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
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
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
          <div className="navbar-user-container" onClick={(e) => { e.stopPropagation(); toggleDropdown(); }}>
            <img 
              src={user.photo ? `https://want.com.co/${user.photo}` : '/icons/person-circle.svg'}
              alt="Profile"
              className="navbar-user-photo"
            />
            {dropdownVisible && (
              <div className="navbar-dropdown">
                <button>Profile</button>
                <button>Posts</button>
                <button>Conversations</button>
                <button>Logout</button>
              </div>
            )}
          </div>
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