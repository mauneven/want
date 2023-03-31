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
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about-us')}>
                  About Us
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/careers')}>
                  Company Data
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/contact-us')}>
                  Contact Us
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Subscriptions</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about/wantplus')}>
                  Want +
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/pricing')}>
                  Features
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/download')}>
                  Limitations
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/privacy-policy')}>
                  Privacy Policy
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about/terms-and-conditions')}>
                  Terms of Service
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/')}>
                  How to use Want
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('')}>
                  Contact support
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('')}>
                  Frequent questions
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Want, Inc. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
