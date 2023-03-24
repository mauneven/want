import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/users/me', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone);
        setBirthdate(data.birthdate);
      });
  }, []);

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

      const response = await fetch('http://localhost:4000/api/users/me', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  return (
    <div className="container">
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label htmlFor="firstName" className="form-label">
        First Name
      </label>
      <input
        type="text"
        className="form-control"
        id="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="lastName" className="form-label">
        Last Name
      </label>
      <input
        type="text"
        className="form-control"
        id="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="phone" className="form-label">
        Phone
      </label>
      <input
        type="text"
        className="form-control"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="birthdate" className="form-label">
        Birthdate
      </label>
      <input
        type="date"
        className="form-control"
        id="birthdate"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="photo" className="form-label">
        Photo
      </label>
      <input
        type="file"
        className="form-control"
        id="photo"
        onChange={(e) => setPhoto(e.target.files[0])}
      />
    </div>
    <button type="submit" className="btn btn-primary">
      Update Profile
    </button>
  </form>
</div>
  )
};

export default EditProfile;