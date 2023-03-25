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
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/user', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setPhone(data.user.phone);
        setBirthdate(
          data.user.birthdate
            ? new Date(data.user.birthdate).toISOString().split('T')[0]
            : ''
        );
        setPhoto(data.user.photo);
      });
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setEditingField('photo');
    }
  };

  const handleCancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone);
    setBirthdate(user.birthdate);
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

  const inputFields = [{ name: 'firstName', label: 'First Name', type: 'text', value: firstName, onChange: (e) => setFirstName(e.target.value), required: true, }, { name: 'lastName', label: 'Last Name', type: 'text', value: lastName, onChange: (e) => setLastName(e.target.value), required: true, }, { name: 'phone', label: 'Phone', type: 'text', value: phone, onChange: (e) => setPhone(e.target.value), required: true, }, {
    name: 'birthdate',
    label: 'Birthdate',
    type: 'date',
    value: birthdate,
    onChange: (e) => setBirthdate(e.target.value),
    required: true,
  },
  ];
  const photoUrl = typeof File !== 'undefined' && photo instanceof File ? URL.createObjectURL(photo) : (user?.photo ? `http://localhost:4000/${user.photo}` : null) ;

  return (
    <div className="container">
      <div className="text-center my-4">
        <img
          src={photoUrl}
          alt="User"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <label htmlFor="photo" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <div
            className="overlay"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i className="bi bi-pencil text-primary"></i> Change photo
          </div>
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
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
                className="btn btn-outline-secondary"
                onClick={() => setEditingField(field.name)}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          </div>
        ))}
        {editingField === 'photo' && (
          <>
            <button
              type="button"
              className="btn btn-secondary me-3"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!photo}
            >
              Save Changes
            </button>
          </>
        )}
        {editingField !== 'photo' && editingField !== null && (
          <>
            <button
              type="button"
              className="btn btn-secondary me-3"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!editingField}
            >
              Save Changes
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default EditProfile;