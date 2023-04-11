import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div>
      <h1>Ups, esta pagina no es para ti</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link href="/">
        <h1>Ir al inicio</h1>
      </Link>
    </div>
  );
};

export default Custom404;