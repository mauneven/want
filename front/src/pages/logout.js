import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Logout = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          localStorage.removeItem('user');
        } else {
          console.error('Error log out:', response.status, response.statusText);
        }

        // Redirigimos a la página principal
        window.location.replace('/');
      } catch (error) {
        console.error('Error log out', error);
      }
    };
    logout();
  }, []);

  return (
    <div className="container">
      <h1>{t('logoutPage.message')}</h1>
    </div>
  );
};

export default Logout;
