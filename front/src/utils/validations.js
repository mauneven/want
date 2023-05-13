export const validations = async (router) => {

    const loggedInResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-logged-in`, {
      credentials: 'include',
    });
  
    if (!loggedInResponse.ok) {
      router.push('/login');
      return;
    }
  
    const blockedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-blocked`, {
      credentials: 'include',
    });
  
    if (!blockedResponse.ok) {
      router.push('/blocked');
      return;
    }
  
    const verifiedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-verified`, {
      credentials: 'include',
    });
  
    if (!verifiedResponse.ok) {
      router.push('/is-not-verified');
      return;
    }
  
    const deletionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-pending-deletion`, {
        credentials: 'include',
      });
    
      const deletionData = await deletionResponse.json();
      if (deletionData.pendingDeletion) {
        router.push('/deleteOn');
        return;
      }
  };
  