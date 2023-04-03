// pages/myOffers.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function sentOffers() {
  const [offers, setOffers] = useState([]);
  const router = useRouter();

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
  
      const verifiedResponse = await fetch('http://want.com.co/api/is-not-verified', {
        credentials: 'include',
      });
  
      if (!verifiedResponse.ok) {
        router.push('/verify-email');
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);

  useEffect(() => {
    const fetchMyOffers = async () => {
      const response = await fetch('http://want.com.co/api/my-offers', {
        credentials: 'include',
      });

      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
      }
    };

    fetchMyOffers();
  }, []);

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