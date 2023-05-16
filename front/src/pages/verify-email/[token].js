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
            setVerificationMessage('You have been successfully verified. You can now post.');
          } else if (response.status === 409) {
            setVerificationMessage('Your email has already been confirmed.');
          } else if (response.status === 410) {
            setVerificationMessage('Your validation link has expired. Please request another one.');
          } else {
            setVerificationMessage('An error occurred while verifying your email.');
          }
        })
        .catch((error) => {
          console.error('Error verifying email:', error);
          setVerificationMessage('An error occurred while verifying your email.');
        });
    }
  }, [token]);

  const handleResendVerification = async (e) => {
    e.preventDefault();

    // Replace this URL with the URL of your API that handles resend verification
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setVerificationMessage('A new verification email has been sent. Please check your inbox.');
    } else {
      setVerificationMessage('An error occurred while resending the verification email.');
    }
  };

  return (
    <div>
      <h1>Email Verification</h1>
      {verificationMessage && <p>{verificationMessage}</p>}
      {(verificationMessage ===
        'Your validation link has expired. Please request another one.' ||
        verificationMessage ===
        'An error occurred while verifying your email.') && (
          <form onSubmit={handleResendVerification}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Request new verification link</button>
          </form>
        )}
    </div>
  );
};

export default VerifyEmail;
