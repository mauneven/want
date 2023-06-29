import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';



const IsNotVerified = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('isNotVerified.title')}</h1>
      <p>{t('isNotVerified.description')}</p>
      <Link href="/">
        <h1>{t('isNotVerified.homepageLink')}</h1>
      </Link>
    </div>
  );
};

export default IsNotVerified;