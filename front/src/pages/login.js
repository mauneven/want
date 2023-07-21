import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

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
      setAlertMessage(t('login.ageValidationMessage'));
      window.scrollTo(0, 0); // Scroll to the top
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
        setAlertMessage(t('login.passwordMatchErrorMessage'));
        window.scrollTo(0, 0); // Scroll to the top
        return;
      }
  
      if (!passwordRegex.test(password)) {
        setAlertMessage(t('login.passwordValidationErrorMessage'));
        window.scrollTo(0, 0); // Scroll to the top
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
        router.push('/verify');
      } else {
        router.push('/');
      }
    } else {
      if (response.status === 409) {
        setAlertMessage(t('login.userAlreadyExistsErrorMessage'));
      } else if (response.headers.get('Content-Type') === 'application/json') {
        const responseData = await response.json();
        setAlertMessage(responseData.error || t('login.invalidCredentialsErrorMessage'));
      } else {
        setAlertMessage(t('login.invalidCredentialsErrorMessage'));
      }
  
      setTimeout(() => {
        setAlertMessage('');
      }, 10000);
  
      window.scrollTo(0, 0); // Scroll to the top
    }
  };

  return (
    <div className="container form-container ">
      <div className='card login-form want-rounded pt-3 pb-3'>
        <div className='card-body'>
          <div className="container">
            <h1 className="text-center">{isLogin ? t('login.loginTitle') : t('login.signupTitle')}</h1>
            {alertMessage && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {alertMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">{t('login.emailLabel')}</label>
                <input type="email" className="form-control want-rounded" id="email" name="email" placeholder={t('login.emailPlaceholder')} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">{t('login.passwordLabel')}</label>
                <input type="password" className="form-control want-rounded" id="password" name="password" placeholder={t('login.passwordPlaceholder')} required />
              </div>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">{t('login.confirmPasswordLabel')}</label>
                    <input type="password" className="form-control want-rounded" id="confirmPassword" name="confirmPassword" placeholder={t('login.confirmPasswordPlaceholder')} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">{t('login.firstNameLabel')}</label>
                    <input type="text" className="form-control want-rounded" id="firstName" name="firstName" placeholder={t('login.firstNamePlaceholder')} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">{t('login.lastNameLabel')}</label>
                    <input type="text" className="form-control want-rounded" id="lastName" name="lastName" placeholder={t('login.lastNamePlaceholder')} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">{t('login.phoneLabel')}</label>
                    <input type="tel" className="form-control want-rounded" id="phone" name="phone" placeholder={t('login.phonePlaceholder')}  required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="birthdate" className="form-label">{t('login.birthdateLabel')}</label>
                    <input type="date" className="form-control want-rounded" id="birthdate" name="birthdate" required />
                  </div>
                </>
              )}
              {!isLogin && (
                <div className='text-small small d-block text-price'>
                  <p>{t('login.termsandprivacycheck')}</p>
                  <p className='links' onClick={() => router.push('/about/terms-and-conditions')}>{t('login.termsAndConditions')}</p>
                  <p className='links' onClick={() => router.push('/about/terms-and-conditions')}>{t('login.privacy')}</p>
                </div>
              )}
              <div className="mb-3">
                <button type="submit" className="want-button ">{isLogin ? t('login.loginButton') : t('login.signupButton')}</button>
              </div>
            </form>
            <div>
              {isLogin ? t('login.noAccountText') : t('login.haveAccountText')}
              <button onClick={toggleForm} className="want-button m-2">{isLogin ? t('login.signupLink') : t('login.loginLink')}</button>
            </div>
            <Link href="/recovery">
              <span className="divhover want-color">{t('login.forgotPasswordLink')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}