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
    <div className="container p-3">
      <h1 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Mail</label>
          <input type="email" className="form-control" id="email" name="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" required />
        </div>
        {!isLogin && (
          <>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Names</label>
              <input type="text" className="form-control" id="firstName" name="firstName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Names</label>
              <input type="text" className="form-control" id="lastName" name="lastName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="phone" name="phone" required />
            </div>
            <div className="mb-3">
              <label htmlFor="birthdate" className="form-label">Birthdate</label>
              <input type="date" className="form-control" id="birthdate" name="birthdate" required />
            </div>
          </>
        )}
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Sign Up'}</button>
        </div>
      </form>
      <div>
        {isLogin ? 'Want to create an account?' : 'Want to login into your account?'}
        <button onClick={toggleForm} className="btn btn-outline btn-link">{isLogin ? 'Sign Up' : 'Login'}</button>
      </div>
      <Link href="/recovery">
        <span className="nav-link">I forgot my password</span>
      </Link>
    </div>
  );
}
