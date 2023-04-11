import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-light py-4">
      <Container>
        <Row className="g-3">
          <Col md="3">
            <h5>Want</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about-us')}>
                  Acerca de nosotros
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/careers')}>
                  Datos de la empresa
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/contact-us')}>
                  Contáctanos
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Suscripciones</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about/wantplus')}>
                  Want +
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/pricing')}>
                  Características
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/download')}>
                  Limitaciones
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/privacy-policy')}>
                  Política de privacidad
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about/terms-and-conditions')}>
                  Términos de servicio
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Ayuda</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/')}>
                  Cómo usar Want
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('')}>
                  Contactar soporte
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('')}>
                  Preguntas frecuentes
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Want, S.A.S. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
