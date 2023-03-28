// pages/myOffers.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function sentOffers() {
  const [offers, setOffers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();


useEffect(() => {
    fetch('http://localhost:4000/api/currentUser', { credentials: 'include' })
        .then((response) => response.json())
        .then((data) => setCurrentUser(data))
        .catch((error) => console.error('Error fetching current user:', error));
}, []);
const checkAuthentication = () => {
  if (!currentUser) {
      router.push('/login'); // Redirige al usuario a la página de inicio de sesión si no está autenticado
  }
};


  useEffect(() => {
    const fetchMyOffers = async () => {
      checkAuthentication(); // Asegura que el usuario esté autenticado antes de cargar la lista de ofertas
      const response = await fetch('http://localhost:4000/api/my-offers', {
        credentials: 'include',
      });

      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
      }
    };

    fetchMyOffers();
  }, [[currentUser]]);

  return (
    <div className="container">
      <h1>Mis Ofertas</h1>
      <div className="row">
        {offers.map((offer) => (
          <div key={offer._id} className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{offer.title}</h5>
                <p className="card-text">{offer.description}</p>
                <p className="card-text">
                  Precio: <strong>{offer.price}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}