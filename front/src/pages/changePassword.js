// pages/changePassword.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChangePassword = () => {
    const router = useRouter();
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
            setMessage("New passwords don't match");
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
                setMessage('Password successfully changed');
                router.push('/');
            } else {
                setMessage('Error: Unable to change password');
            }
        } catch (error) {
            setMessage('Error: Unable to change password');
        }
    };

    return (
        <div className="container">
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                        Current Password
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
                        New Password
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
                        Confirm New Password
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
                <button type="submit" className="btn btn-primary">
                    Change Password
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
