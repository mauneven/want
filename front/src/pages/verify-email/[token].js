import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    if (token) {
      // Reemplazar esta URL con la URL de tu API que maneja la verificación
      fetch(`http://localhost:4000/api/verify/${token}`, { method: 'POST' })
        .then((response) => {
          if (response.ok) {
            setVerificationMessage('Tu correo electrónico ha sido verificado exitosamente.');
          } else {
            setVerificationMessage('Ha ocurrido un error al verificar tu correo electrónico.');
          }
        })
        .catch((error) => {
          console.error('Error al verificar el correo electrónico:', error);
          setVerificationMessage('Ha ocurrido un error al verificar tu correo electrónico.');
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Verificación de correo electrónico</h1>
      {verificationMessage && <p>{verificationMessage}</p>}
    </div>
  );
};

export default VerifyEmail;