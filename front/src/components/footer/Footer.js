import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <footer className="bg-light py-4">
      <div className=''>
        <Row className="g-3">
          <Col md="3">
            <h5>{t('footer.wantTitle')}</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about-us')}>
                  {t('footer.aboutUs')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/careers')}>
                  {t('footer.data')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/contact-us')}>
                  {t('footer.contact')}
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>{t('footer.subscriptionsTitle')}</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about/wantplus')}>
                  {t('footer.wantPlus')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/pricing')}>
                  {t('footer.wantAI')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/download')}>
                  {t('footer.limitations')}
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>{t('footer.legalTitle')}</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/privacy-policy')}>
                  {t('footer.privacy')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/about/terms-and-conditions')}>
                  {t('footer.termsAndConditions')}
                </div>
              </li>
            </ul>
          </Col>
          <Col md="3">
            <h5>{t('footer.helpTitle')}</h5>
            <ul className="list-unstyled">
              <li>
                <div className="text-dark divhover" onClick={() => router.push('/')}>
                  {t('footer.howToUseWant')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('')}>
                  {t('footer.support')}
                </div>
              </li>
              <li>
                <div className="text-dark divhover" onClick={() => router.push('')}>
                  {t('footer.howTo')}
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Want, S.A.S | {t('footer.allRightsReserved')}</p>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;