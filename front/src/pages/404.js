import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div>
      <h1>Ups, this page ins't for you</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <h1>Go home</h1>
      </Link>
    </div>
  );
};

export default Custom404;