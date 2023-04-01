import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div>
      <h1>Wow, this page is not for you</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link href="/">
        <h1>Go back home</h1>
      </Link>
    </div>
  );
};

export default Custom404;