import React from 'react';
import Image from 'next/image';

const WantPlusAnnouncement = () => {
    return (
      <div className="bg-light py-4">
        <div className="container text-center">
          <h2 className="mb-4">¡Estamos trabajando en Want+!</h2>
          <p className="lead mb-4">
            Nos complace anunciar que estamos trabajando en Want+, una nueva función que te permitirá resaltar tus publicaciones en los feeds de las personas y llegar a más usuarios.
          </p>
          <p className="mb-4">
            También nos comprometemos a desarrollar una estrategia de monetización transparente y razonable que no comprometa la experiencia del usuario.
          </p>
          <button className="btn btn-primary btn-lg">Aprende más</button>
        </div>
      </div>
    );
  };
  
export default WantPlusAnnouncement;