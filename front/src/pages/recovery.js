import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PasswordRecovery = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage(t('passwordRecovery.emailSent'));
      } else {
        setMessage(t('passwordRecovery.emailError'));
      }
    } catch (error) {
      setMessage(t('passwordRecovery.emailError'));
    }
  };

  return (
    <div className="">
      <h1>{t('passwordRecovery.title')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            {t('passwordRecovery.emailLabel')}
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="want-button">
          {t('passwordRecovery.submitButton')}
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

export default PasswordRecovery;
