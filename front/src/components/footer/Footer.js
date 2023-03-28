import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-4">
      <Container>
        <Row className="g-3">
          <Col md="3">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/about-us">
                  <div className="text-dark">About Us</div>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <div className="text-dark">Company Data</div>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <div className="text-dark">Contact Us</div>
                </Link>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Subscriptions</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/features">
                  <div className="text-dark">Want +</div>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <div className="text-dark">Features</div>
                </Link>
              </li>
              <li>
                <Link href="/download">
                  <div className="text-dark">Limitations</div>
                </Link>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/privacy-policy">
                  <div className="text-dark">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <div className="text-dark">Terms of Service</div>
                </Link>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/" target="_blank">
                  <div className="text-dark">How to use Want</div>
                </Link>
              </li>
              <li>
                <Link href="">
                  <div className="text-dark">Contact support</div>
                </Link>
              </li>
              <li>
                <Link href="">
                  <div className="text-dark">Frequent questions</div>
                </Link>
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
