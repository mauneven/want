import { useRouter } from 'next/router';
import { validations } from '@/utils/validations';
import { useEffect } from 'react';

const DeleteOn = () => {
  const router = useRouter();

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
    <div className="container">
      <div className="card my-4">
        <div className="card-body">
          <h2>Your account is in the process of being deleted.</h2>
          <button className="btn btn-primary me-3" onClick={handleContinueDeletion}>
            Continue with my deletion process
          </button>
          <button className="btn btn-danger" onClick={handleCancelDeletion}>
            Cancel my deletion process
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOn;