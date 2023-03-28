import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavDropdown, Badge } from 'react-bootstrap';


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

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
    <NavDropdown
    title={
      <>
        <i className="bi bi-bell fs-20"></i>
        {hasUnreadNotifications && (
          <Badge pill bg="danger" className="position-absolute" style={{ top: -5, right: -10 }}>
            {notifications.filter((notification) => !notification.isRead).length}
          </Badge>
        )}
      </>
    }
    id="notification-dropdown"
    className={hasUnreadNotifications ? "text-success" : ""}
  >
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NavDropdown.Item
            key={notification._id}
            onClick={() => router.push('/receivedOffers')}
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