// pages/blocked.js

import React from 'react';
import { Container } from 'react-bootstrap';

const Blocked = () => {
  return (
    <Container>
      <h1>You have been banned</h1>
      <p>Your account has been blocked due to multiple reports.</p>
      <p>
      If you think this is a mistake, please contact support.
      </p>
    </Container>
  );
};

export default Blocked;
