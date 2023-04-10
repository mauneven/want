import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

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
    } else if (age >= 14 && age < 18 && !document.getElementById('parentPermission').checked) {
      setAlertMessage('Debes marcar la casilla de obtener el permiso de tus padres.');
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
    if (!isLogin) {
      firstName = event.target.firstName.value;
      lastName = event.target.lastName.value;
      phone = event.target.phone.value;
      birthdate = event.target.birthdate.value;
  
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
    }
  };  

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
        router.push('/');
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h1>
      {alertMessage && (
        <div className="alert alert-danger" role="alert">
          {alertMessage}
        </div>
      )}
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
        <span className="nav-link">Olvidé mi contraseña</span>
      </Link>
    </div>
  );
  
}
