import React from 'react';
import Link from 'next/link';

const isNotVerfied = () => {
  return (
    <div>
      <h1>Nos falta un ultimo paso</h1>
      <p>Tienes que validar tu cuenta para que sepamos que eres tu, por eso hemos enviado un correo con un link para que puedas verificar tu cuenta.</p>
      <Link href="/">
        <h1>Mientras tanto puedes volver al inicio</h1>
      </Link>
    </div>
  );
};

export default isNotVerfied;