// pages/blocked.js

import React from 'react';
import { Container } from 'react-bootstrap';

const Blocked = () => {
  return (
    <Container>
      <h1>Has sido bloqueado</h1>
      <p>Tu cuenta ha sido bloqueada debido a múltiples informes.</p>
      <p>
        Si crees que esto es un error, por favor, ponte en contacto con el
        soporte.
      </p>
    </Container>
  );
};

export default Blocked;
