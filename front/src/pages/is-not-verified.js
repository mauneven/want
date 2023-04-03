import React from 'react';
import Link from 'next/link';

const isNotVerfied = () => {
  return (
    <div>
      <h1>Wow, not so fast</h1>
      <p>First validate your account by opening the link that we sent you to your email.</p>
      <Link href="/">
        <h1>Go back home</h1>
      </Link>
    </div>
  );
};

export default isNotVerfied;