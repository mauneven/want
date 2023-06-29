import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [verificationMessage, setVerificationMessage] = useState('');
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify/${token}`, { method: 'POST' })
        .then(async (response) => {
          if (response.status === 200) {
            setVerificationMessage(t('verifyEmail.successMessage'));
          } else if (response.status === 409) {
            setVerificationMessage(t('verifyEmail.alreadyConfirmedMessage'));
          } else if (response.status === 410) {
            setVerificationMessage(t('verifyEmail.expiredLinkMessage'));
          } else {
            setVerificationMessage(t('verifyEmail.errorMessage'));
          }
        })
        .catch((error) => {
          console.error('Error verifying email:', error);
          setVerificationMessage(t('verifyEmail.errorMessage'));
        });
    }
  }, [token, t]);

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
      setVerificationMessage(t('verifyEmail.resendSuccessMessage'));
    } else {
      setVerificationMessage(t('verifyEmail.resendErrorMessage'));
    }
  };

  return (
    <div className='container'>
      <h1>{t('verifyEmail.title')}</h1>
      {verificationMessage && <p>{verificationMessage}</p>}
      {(verificationMessage === t('verifyEmail.expiredLinkMessage') ||
        verificationMessage === t('verifyEmail.errorMessage')) && (
          <form onSubmit={handleResendVerification}>
            <input
            className='want-rounded form-control'
              type="email"
              placeholder={t('verifyEmail.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className='want-button want-rounded mt-2' type="submit">{t('verifyEmail.resendButton')}</button>
          </form>
        )}
    </div>
  );
};

export default VerifyEmail;