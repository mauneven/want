import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Custom404 = () => {
  const { t } = useTranslation();

  return (
    <div className=' text-center p-5'>
      <h1>{t('custom404.title')}</h1>
      <p>{t('custom404.description')}</p>
      <Link className='want-button want-rounded' href="/">
        <h1>{t('custom404.homeLink')}</h1>
      </Link>
    </div>
  );
};

export default Custom404;