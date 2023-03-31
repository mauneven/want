import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NavDropdown, Badge, Spinner } from 'react-bootstrap';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
          }),
        );
        setNotifications(notificationsWithPostName);
        setUnreadCount(notificationsData.filter((n) => !n.isRead).length);
      }
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  const handleDropdownToggle = async (isOpen) => {
    if (isOpen) {
      setUnreadCount(0);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, isRead: true })),
      );
    }
  };

  const handleClick = () => {
    router.push('/receivedOffers');
  };

  return (
    <NavDropdown
      title={
        <>
          <i className="bi bi-bell fs-20 navbar-icon"></i>
          {unreadCount > 0 && !isLoading && (
            <Badge pill bg="danger" className="position-absolute" style={{ top: -5, right: -10 }}>
              {unreadCount}
            </Badge>
          )}
          {isLoading && (
            <Spinner animation="border" size="sm" className="position-absolute" style={{ top: 0, right: -15 }} />
          )}
        </>
      }
      id="notification-dropdown"
      className={unreadCount > 0 ? 'text-success' : ''}
      onToggle={handleDropdownToggle}
    >
      {isLoading ? (
        <NavDropdown.Item disabled>
          <Spinner animation="border" size="sm" className="mr-2" />
          Loading...
        </NavDropdown.Item>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <NavDropdown.Item
            key={notification._id}
            href="/receivedOffers" // Cambiar onClick por href
            className={!notification.isRead ? 'bg-primary text-white' : ''}
          >
            {notification.content}
          </NavDropdown.Item>
        ))
      ) : (
        <NavDropdown.Item disabled>Empty</NavDropdown.Item>
      )}
    </NavDropdown>
  );
}
