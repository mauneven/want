import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-logged-in`, {
        credentials: 'include',
      });
  
      if (loggedInResponse.ok) {
        router.push('/');
        return;
      }
  
      const blockedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-blocked`, {
        credentials: 'include',
      });
  
      if (blockedResponse.ok) {
        router.push('/blocked');
        return;
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);

  const validateAgeAndParentPermission = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const ageDiff = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const age = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? ageDiff - 1 : ageDiff;

    if (age < 14) {
      setAlertMessage('No puedes crear una cuenta. Debes tener al menos 14 años de edad.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlertMessage('');
    const email = event.target.email.value;
    const password = event.target.password.value;
    let firstName, lastName, phone, birthdate;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    const confirmPassword = event.target.confirmPassword ? event.target.confirmPassword.value : '';
    
    if (!isLogin) {
      firstName = event.target.firstName.value;
      lastName = event.target.lastName.value;
      phone = event.target.phone.value;
      birthdate = event.target.birthdate.value;

      if (password !== confirmPassword) {
        setAlertMessage('Las contraseñas no coinciden.');
        return;
      }
  
      if (!passwordRegex.test(password)) {
        setAlertMessage('La contraseña debe tener al menos una letra y un número.');
        return;
        
      }

      if (!validateAgeAndParentPermission(birthdate)) {
        return;
      }
    }

    const data = {
      email,
      password,
      ...(isLogin ? {} : { firstName, lastName, phone, birthdate }),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${isLogin ? 'login' : 'register'}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      if (!responseData.isVerified) {
        router.push('/is-not-verified');
      } else {
        router.push('/');
      }
    } else {
      if (response.headers.get('Content-Type') === 'application/json') {
        const responseData = await response.json();
        setAlertMessage(responseData.error || 'El correo electrónico o la contraseña están incorrectos.');
      } else {
        setAlertMessage('El correo electrónico o la contraseña están incorrectos.');
      }

      setTimeout(() => {
        setAlertMessage('');
      }, 5000);

    }
  };

  return (
    <div className="container form-container">
      <div className='card login-form rounded-5 p-3'>
        <div className='card-body'>
          <div className="container">
            <h1 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
            {alertMessage && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {alertMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-mail:</label>
                <input type="email" className="form-control rounded-5" id="email" name="email" placeholder="you@example.com" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" className="form-control rounded-5" id="password" name="password" placeholder="your password" required />
              </div>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar password:</label>
                    <input type="password" className="form-control rounded-5" id="confirmPassword" name="confirmPassword" placeholder="confirm your password" required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First name:</label>
                    <input type="text" className="form-control rounded-5" id="firstName" name="firstName" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last name:</label>
                    <input type="text" className="form-control rounded-5" id="lastName" name="lastName" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone number:</label>
                    <input type="tel" className="form-control rounded-5" id="phone" name="phone" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="birthdate" className="form-label">birthdate:</label>
                    <input type="date" className="form-control rounded-5" id="birthdate" name="birthdate" required />
                  </div>
                </>
              )}
              <div className="mb-3">
                <button type="submit" className="btn btn-success rounded-5 btn-login">{isLogin ? 'Login' : 'Sign up'}</button>
              </div>
            </form>
            <div>
              {isLogin ? "Don't have an account?" : 'already have an account?'}
              <button onClick={toggleForm} className="btn btn-link user-link">{isLogin ? 'Sign up' : 'Login'}</button>
            </div>
            <Link href="/recovery">
              <span className="rsp-pwd">I forgot my password, help</span>
            </Link>
          </div>
        </div>
      </div>
    </div>

  );

}
