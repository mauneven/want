import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    let firstName, lastName, phone, birthdate;
    if (!isLogin) {
      firstName = event.target.firstName.value;
      lastName = event.target.lastName.value;
      phone = event.target.phone.value;
      birthdate = event.target.birthdate.value;
    }
    const data = {
      email,
      password,
      ...(isLogin ? {} : { firstName, lastName, phone, birthdate }),
    };
    const response = await fetch(`http://want.com.co/api/${isLogin ? 'login' : 'register'}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
    if (response.ok) {
      router.push('/');
    }
  };

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch('http://want.com.co/api/is-logged-in', {
        credentials: 'include',
      });
  
      if (!loggedInResponse.ok) {
        router.push('/login');
        return;
      }
  
      const blockedResponse = await fetch('http://want.com.co/api/is-blocked', {
        credentials: 'include',
      });
  
      if (!blockedResponse.ok) {
        router.push('/blocked');
        return;
      }
  
      const verifiedResponse = await fetch('http://want.com.co/api/verify-email', {
        credentials: 'include',
      });
  
      if (!verifiedResponse.ok) {
        router.push('/is-not-verified');
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);
  

  return (
    <div className="container">
      <h1 className="text-center">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico:</label>
          <input type="email" className="form-control" id="email" name="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input type="password" className="form-control" id="password" name="password" required />
        </div>
        {!isLogin && (
          <>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Nombre:</label>
              <input type="text" className="form-control" id="firstName" name="firstName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Apellido:</label>
              <input type="text" className="form-control" id="lastName" name="lastName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Número de teléfono:</label>
              <input type="tel" className="form-control" id="phone" name="phone" required />
            </div>
            <div className="mb-3">
              <label htmlFor="birthdate" className="form-label">Fecha de nacimiento:</label>
              <input type="date" className="form-control" id="birthdate" name="birthdate" required />
            </div>
          </>
        )}
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</button>
        </div>
      </form>
      <div>
        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
        <button onClick={toggleForm} className="btn btn-link">{isLogin ? 'Regístrate' : 'Inicia sesión'}</button>
      </div>
      <Link href="/recovery">
        <span className="nav-link">Forgot my password</span>
      </Link>
    </div>
  );
}
