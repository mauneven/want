import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const response = await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const responseData = await response.json();
      console.log(responseData);
      router.push('/');
    };
    logout();
  }, []);

  return (
    <div className="container">
      <h1>Cerrando sesión...</h1>
    </div>
  );
}
