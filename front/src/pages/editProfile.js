import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { validations } from '@/utils/validations';
import { useTranslation } from 'react-i18next';
import GoBackButton from '@/components/reusable/GoBackButton';

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [initialBirthdate, setInitialBirthdate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    validations(router); 
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          router.push('/login');
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUser(data.user);
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
          setPhone(data.user.phone);
          setBirthdate(
            data.user.birthdate
              ? new Date(data.user.birthdate).toISOString().split('T')[0]
              : ''
          );
          setInitialBirthdate(
            data.user.birthdate
              ? new Date(data.user.birthdate).toISOString().split('T')[0]
              : ''
          );
          setPhoto(data.user.photo);
        }
      });
  }, []);

  const validateImageFile = (file) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    const maxSize = 50 * 1024 * 1024; // 50 MB
  
    if (!allowedExtensions.exec(file.name)) {
      alert(t('editProfile.invalidImageFileType'));
      return false;
    }
  
    if (file.size > maxSize) {
      alert(t('editProfile.imageFileSizeExceeded'));
      return false;
    }
  
    return true;
  };  

  const handleDeleteAccount = async () => {
    if (window.confirm(t('editProfile.deleteAccountConfirmation'))) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-account`, {
          method: 'DELETE',
          credentials: 'include',
        });
  
        if (response.ok) {
          router.push('/logout');
        } else {
          console.error(t('editProfile.deleteAccountError'));
        }
      } catch (error) {
        console.error(t('editProfile.deleteAccountError'), error);
      }
    }
  };  
  
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateImageFile(file)) {
        return;
      }
      if (file) {
        const fileName = user._id + '_' + file.name;
        const renamedFile = new File([file], fileName, { type: file.type });
        setPhoto(renamedFile);
        setEditingField('photo');
  
        const formData = new FormData();
        formData.append('photo', renamedFile);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/photo`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        });
        if (!response.ok) {
          console.error(t('editProfile.updateUserPhotoError'));
        }
      }
    }
  };  

  const handleCancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone);
    setBirthdate(initialBirthdate);
    setPhoto(user.photo);
    setEditingField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('phone', phone);
      formData.append('birthdate', birthdate);

      if (photo) {
        formData.append('photo', photo);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error(t('editProfile.updateUserError'));
      }
    } catch (error) {
      console.error(t('editProfile.updateUserError'), error);
    }
  };

  const inputFields = [
    { name: 'firstName', label: t('editProfile.firstName'), type: 'text', value: firstName, onChange: (e) => setFirstName(e.target.value), required: true },
    { name: 'lastName', label: t('editProfile.lastName'), type: 'text', value: lastName, onChange: (e) => setLastName(e.target.value), required: true },
    { name: 'phone', label: t('editProfile.phone'), type: 'text', value: phone, onChange: (e) => setPhone(e.target.value), required: true },
    { name: 'birthdate', label: t('editProfile.birthdate'), type: 'date', value: birthdate, onChange: (e) => setBirthdate(e.target.value), required: true }
  ];
  
  const photoUrl = typeof File !== 'undefined' && photo instanceof File ? URL.createObjectURL(photo) : (user?.photo ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}` : "/icons/person-circle.svg");

  return (
    <div className="container">
      <h1 className='my-4'>{t('editProfile.checkEditProfile')}</h1>
      <GoBackButton/>
      <div className="card want-rounded my-4">
        <div className="card-body">
          <div className="text-center">
            <img
              src={photoUrl}
              alt=""
              className="rounded-circle"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
              }}
            />
            <label htmlFor="photo" className="mt-3">
              <div className="overlay">
                <i className="bi bi-pencil want-color ms-4"></i> {t('editProfile.changeProfilePhoto')}
              </div>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/png, image/jpeg"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
          <form onSubmit={handleSubmit}>
            {inputFields.map((field) => (
              <div key={field.name} className="mb-3">
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <div className="input-group">
                  <input
                    type={field.type}
                    className={`form-control${editingField === field.name ? '' : ' bg-light'}`}
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    readOnly={editingField !== field.name}
                    required={field.required}
                  />
                  <button
                    type="button"
                    className="btn-outline-secondary"
                    onClick={() => setEditingField(field.name)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              </div>
            ))}
            {editingField && (
              <div className="text-center">
                <button type="button" className="generic-button want-rounded me-3" onClick={handleCancel}>
                  {t('editProfile.cancel')}
                </button>
                <button type="submit" className="want-button want-rounded" disabled={!editingField || (editingField === 'photo' && !photo)}>
                  {t('editProfile.update')}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="my-5 card p-3  -secondary want-rounded">
        <h3 className="text">{t('navbar.logout')}</h3>
        <Link href="/logout">
          <button className="generic-button want-rounded">{t('navbar.logout')}</button>
        </Link>
      </div>
      <div className="my-5 card p-3   want-rounded">
        <h3 className="want-color">{t('editProfile.changePassword')}</h3>
        <Link href="/changePassword">
          <button className="want-button want-rounded">{t('editProfile.changePassword')}</button>
        </Link>
      </div>
      <div className="my-5  -danger want-rounded p-3">
        <h3 className="text-danger">{t('editProfile.deleteAccount')}</h3>
        <button className="btn-danger want-rounded" onClick={handleDeleteAccount}>
          {t('editProfile.deleteAccount')}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;