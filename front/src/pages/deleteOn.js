import { useRouter } from 'next/router';
import { validations } from '@/utils/validations';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DeleteOn = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleContinueDeletion = () => {
    window.location.href = '/logout'; // Redireccionar directamente a la página de Logout
  };

  useEffect(() => {
    validations(router); 
  }, []);

  const handleCancelDeletion = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cancel-deletion-process`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        router.push('/');
      } else {
        console.error('Error canceling deletion process');
      }
    } catch (error) {
      console.error('Error canceling deletion process', error);
    }
  };  

  return (
    <div className="">
      <div className="card my-4">
        <div className="card-body">
          <h2>{t('deleteOn.deletionProcessTitle')}</h2>
          <button className="want-button me-3" onClick={handleContinueDeletion}>
            {t('deleteOn.continueDeletionProcess')}
          </button>
          <button className="btn-danger" onClick={handleCancelDeletion}>
            {t('deleteOn.cancelDeletionProcess')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOn;