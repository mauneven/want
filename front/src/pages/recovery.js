// pages/password-recovery.js
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('An email has been sent to recover your account');
      } else {
        setMessage('Error: Unable to send recovery email');
      }
    } catch (error) {
      setMessage('Error: Unable to send recovery email');
    }
  };

  return (
    <div className="container">
      <h1>Password Recovery</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
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
        <button type="submit" className="btn btn-primary">
          Recover Account
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
