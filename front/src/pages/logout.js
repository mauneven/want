import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      const response = await fetch('http://ec2-34-192-108-182.compute-1.amazonaws.com:4000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Eliminamos el estado del usuario tanto en el servidor como en el cliente
        await fetch('http://ec2-34-192-108-182.compute-1.amazonaws.com:4000/api/user/logout', {
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
