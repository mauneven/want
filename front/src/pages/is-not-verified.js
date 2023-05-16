import React from 'react';
import Link from 'next/link';

const isNotVerified = () => {
  return (
    <div>
      <h1>We're almost there</h1>
      <p>You need to verify your account so we know it's you. We have sent an email with a link for you to verify your account.</p>
      <Link href="/">
        <h1>In the meantime, you can go back to the homepage</h1>
      </Link>
    </div>
  );
};

export default isNotVerified;