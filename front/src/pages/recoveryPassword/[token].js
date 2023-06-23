// pages/recoveryPassword/[token].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage(t('resetPassword.passwordMismatch'));
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage(t('resetPassword.passwordResetSuccess'));
        router.push('/login');
      } else {
        setMessage(t('resetPassword.passwordResetError'));
      }
    } catch (error) {
      setMessage(t('resetPassword.passwordResetError'));
    }
  };

  return (
    <div className="container">
      <h1>{t('resetPassword.resetPasswordTitle')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            {t('resetPassword.newPasswordLabel')}
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            {t('resetPassword.confirmNewPasswordLabel')}
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn want-button">
          {t('resetPassword.resetPasswordButton')}
        </button>
      </form>
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;