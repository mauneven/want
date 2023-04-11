import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Eliminamos el estado del usuario tanto en el servidor como en el cliente
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        localStorage.removeItem('user');

        // Redirigimos a la página principal
        window.location.replace('/');
      } else {
        console.error('Error al cerrar sesión:', response.status, response.statusText);
      }
    };
    logout();
  }, []);

  return (
    <div className="container">
      <h1>Cerrando sesión...</h1>
    </div>
  );
}
