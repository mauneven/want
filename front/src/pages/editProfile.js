import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);

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
        router.push('/is-not-verified');
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
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
          setPhoto(data.user.photo);
        }
      });
  }, []);
  
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = user._id + '_' + file.name; // Renombrar el archivo con el id del usuario
      const renamedFile = new File([file], fileName, {type: file.type}); // Crear un nuevo objeto File con el archivo renombrado
      setPhoto(renamedFile);
      setEditingField('photo');
  
      // Actualizar el estado de la foto del usuario en la base de datos
      const formData = new FormData();
      formData.append('photo', renamedFile);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/photo`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });
      if (!response.ok) {
        console.error('Error updating user photo');
      }
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`, {
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
    label: 'Fecha de nacimiento',
    type: 'date',
    value: birthdate,
    onChange: (e) => setBirthdate(e.target.value),
    required: true,
  },
  ];
  const photoUrl = typeof File !== 'undefined' && photo instanceof File ? URL.createObjectURL(photo) : (user?.photo ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}` : "icons/person-circle.svg");

  return (
    <div className="container">
      <div className="card my-4">
        <div className="card-body">
          <div className="text-center">
            <img
              src={photoUrl}
              alt=""
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
                <i className="bi bi-pencil text-primary"></i> Cambiar foto de perfil
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
                  Cancelar y dejar como estaba
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!photo}
                >
                  Guardar los nuevos cambios
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
                  Cancelar y dejar como estaba
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!editingField}
                >
                  Guardar los nuevos cambios
                </button>
              </>
            )}
          </form>
          <Link href="/changePassword">
            <button className="btn btn-success">Cambiar contraseña</button>
          </Link>
        </div>
      </div>
    </div>
  );
  
};

export default EditProfile;