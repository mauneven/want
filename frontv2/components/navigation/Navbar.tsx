'use client'

import { useState } from 'react';
import './navbar.css'
import Link from 'next/link';

const Navbar = () => {
  const [theme, setTheme] = useState('light'); // Comienza con el tema claro

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
        <Link href={'/login'}>
        <button className="navbar-btn navbar-btn-login">
          Login
        </button>
        </Link>
        <button onClick={toggleTheme} className="navbar-btn navbar-btn-theme">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
};

export default Navbar;