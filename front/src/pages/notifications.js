import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const fetchPostName = async (postId) => {
    if (!postId) {
      console.error('Error: postId is undefined');
      return '';
    }
    const response = await fetch(`http://localhost:4000/api/posts/${postId}`);
    const data = await response.json();
    return data.title;
  };  

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('http://localhost:4000/api/notifications', {
        credentials: 'include',
      });

      if (response.ok) {
        const notificationsData = await response.json();
        const notificationsWithPostName = await Promise.all(
          notificationsData.map(async (notification) => {
            const postName = await fetchPostName(notification.postId);
            return { ...notification, postName };
          })
        );
        setNotifications(notificationsWithPostName);
      }
    };

    fetchNotifications();
  }, []);

  const handleClick = () => {
    router.push('/receivedOffers');
  };

  return (
    <div className="container">
      <h1>Notificaciones</h1>
      <div className="row">
        {notifications.map((notification) => (
          <div className="col-md-4 mb-4" key={notification._id}>
            <div
              className={`card ${!notification.isRead ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={handleClick}
            >
              <div className="card-body">
                {/* Reemplaza "notification.message" por "notification.content" */}
                <p className="card-text">{notification.content}</p>
              </div>
              {!notification.isRead && (
                <div className="card-footer bg-primary text-white">
                  Nueva notificación
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
