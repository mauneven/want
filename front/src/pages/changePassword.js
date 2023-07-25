import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GoHomeButton from '@/components/reusable/GoHomeButton';

const ChangePassword = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-logged-in`, {
        credentials: 'include',
      });

      if (!loggedInResponse.ok) {
        router.push('/login');
        return;
      }

      const blockedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-blocked`, {
        credentials: 'include',
      });

      if (!blockedResponse.ok) {
        router.push('/blocked');
        return;
      }

      const verifiedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-verified`, {
        credentials: 'include',
      });

      if (!verifiedResponse.ok) {
        router.push('/is-not-verified');
      }
    };

    checkLoggedInAndBlockedAndVerified();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage(t("changePassword.passwordsMismatch"));
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      });

      if (response.ok) {
        setMessage(t("changePassword.passwordChanged"));
        router.push('/');
      } else {
        setMessage(t("changePassword.error"));
      }
    } catch (error) {
      setMessage(t("changePassword.error"));
    }
  };

  return (
    <div className="container">
      <GoHomeButton/>
      <h1>{t("changePassword.title")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">
            {t("changePassword.currentPasswordLabel")}
          </label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            {t("changePassword.newPasswordLabel")}
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label">
            {t("changePassword.confirmNewPasswordLabel")}
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="want-button">
          {t("changePassword.changePasswordButton")}
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

export default ChangePassword;
