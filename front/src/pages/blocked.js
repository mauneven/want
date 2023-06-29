import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Blocked = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <h1>{t('blocked.title')}</h1>
      <p>{t('blocked.description')}</p>
      <p>{t('blocked.contactSupport')}</p>
    </Container>
  );
};

export default Blocked;