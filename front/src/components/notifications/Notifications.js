import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavDropdown, Badge } from 'react-bootstrap';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const fetchPostName = async (postId) => {
    if (!postId) {
      console.error('Error: postId is undefined');
      return '';
    }
    const response = await fetch(`https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/posts/${postId}`);
    const data = await response.json();
    return data.title;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/notifications', {
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
        setUnreadNotifications(notificationsData.filter((notification) => !notification.isRead));
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notificationId) => {
    setUnreadNotifications(unreadNotifications.filter((notification) => notification._id !== notificationId));

    // Marcar la notificación como leída en el servidor
    await fetch(`https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    router.push('/receivedOffers');
  };

  return (
    <NavDropdown
      title={
        <div style={{ position: 'relative' }}>
          <i className="bi bi-bell fs-20"></i>
          {unreadNotifications.length > 0 && (
            <Badge pill bg="danger" className="position-absolute" style={{ top: -5, right: -10 }}>
              {unreadNotifications.length}
            </Badge>
          )}
        </div>
      }
      id="notification-dropdown"
      className={`notification-dropdown ${unreadNotifications.length > 0 ? 'text-success' : ''} no-dropdown-toggle`}
    >
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NavDropdown.Item
            key={notification._id}
            onClick={() => handleNotificationClick(notification._id)}
            className={!notification.isRead ? 'bg-primary text-white' : ''}
          >
            {notification.content}
          </NavDropdown.Item>
        ))
      ) : (
        <NavDropdown.Item disabled>No hay notificaciones</NavDropdown.Item>
      )}
    </NavDropdown>
  );
}
