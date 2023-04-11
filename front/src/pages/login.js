import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Head from 'next/head';

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
    const response = await fetch(`http://localhost:4000/api/${isLogin ? 'login' : 'register'}`, {
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
    const checkLoggedIn = async () => {
      const response = await fetch('http://localhost:4000/api/is-logged-in', {
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/');
      }
    };

    checkLoggedIn();
  }, []);

  return (
  <>
  <Head>
    <link rel="stylesheet" href='css/login.css'/>
  </Head>

    <div className="container form-container">
      <div className='card login-form rounded-5 p-3'>
        <div className='card-body'>
      <h1 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail:</label>
          <input type="email" className="form-control rounded-pill" id="email" name="email" placeholder="you@example.com" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control rounded-pill" id="password" name="password" placeholder="your password" required />
        </div>
        {!isLogin && (
          <>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First name:</label>
              <input type="text" className="form-control rounded-pill" id="firstName" name="firstName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last name:</label>
              <input type="text" className="form-control rounded-pill" id="lastName" name="lastName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone number:</label>
              <input type="tel" className="form-control rounded-pill" id="phone" name="phone" required />
            </div>
            <div className="mb-3">
              <label htmlFor="birthdate" className="form-label">birthdate:</label>
              <input type="date" className="form-control rounded-pill" id="birthdate" name="birthdate" required />
            </div>
          </>
        )}
        <div className="mb-3">
          <button type="submit" className="btn btn-success rounded-pill btn-login">{isLogin ? 'Login' : 'Sign up'}</button>
        </div>
      </form>
      <div>
        {isLogin ? "Don't have an account?" : 'already have an account?'}
        <button onClick={toggleForm} className="btn btn-link user-link">{isLogin ? 'Sign up' : 'Login'}</button>
      </div>
      <Link href="/recovery">
        <span className="rst-pwd">Forgot my password</span>
      </Link>
      </div>
      </div>
    </div>
    </>

  );
}
