import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://localhost:4000/api/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
        setIsLogged(true);
      } else if (response.status === 401) {
        setIsLogged(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isLogged) {
      const updateSession = async () => {
        const response = await fetch('http://localhost:4000/api/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        } else if (response.status === 401) {
          setIsLogged(false);
        }
      };
      const interval = setInterval(updateSession, 5000);
      return () => clearInterval(interval);
    }
  }, [isLogged]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/">
          <span className="navbar-brand">Mi Sitio</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/">
                <span className="nav-link">Inicio</span>
              </Link>
            </li>
            {user ? (
              <li className="nav-item">
                <span className="nav-link">{user.firstName} {user.lastName}</span>
              </li>
            ) : (
              <li className="nav-item">
                <Link href="/login">
                  <span className="nav-link">Iniciar sesión</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
