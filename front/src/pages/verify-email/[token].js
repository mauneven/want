import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [verificationMessage, setVerificationMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify/${token}`, { method: 'POST' })
        .then(async (response) => {
          if (response.status === 200) {
            setVerificationMessage('Acabas de verificarte, ya puedes postear.');
          } else if (response.status === 409) {
            setVerificationMessage('Tu correo ya fue confirmado.');
          } else if (response.status === 410) {
            setVerificationMessage('Tu link de validación ha expirado, por favor, pide otro.');
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

  const handleResendVerification = async (e) => {
    e.preventDefault();

    // Reemplazar esta URL con la URL de tu API que maneja el reenvío de verificación
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setVerificationMessage('Se ha enviado un nuevo correo de verificación. Por favor, revisa tu bandeja de entrada.');
    } else {
      setVerificationMessage('Ha ocurrido un error al reenviar el correo de verificación.');
    }
  };

  return (
    <div>
      <h1>Verificación de correo electrónico</h1>
      {verificationMessage && <p>{verificationMessage}</p>}
      {(verificationMessage ===
        'Tu link de validación ha expirado, por favor, pide otro.' ||
        verificationMessage ===
        'Ha ocurrido un error al verificar tu correo electrónico.') && (
          <form onSubmit={handleResendVerification}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Solicitar nuevo enlace de verificación</button>
          </form>
        )}
    </div>
  );

};

export default VerifyEmail;
