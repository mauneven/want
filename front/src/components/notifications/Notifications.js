import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Modal, Badge } from 'react-bootstrap';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPostName = async (postId) => {
    if (!postId) {
      console.error('Error: postId is undefined');
      return '';
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`);
    const data = await response.json();
    return data.title;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`, {
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
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    router.push('/receivedOffers');
  };

  return (
    <>
      <div className='notification-icon' onClick={() => setShowModal(true)}>
        <i className="bi bi-bell fs-20"></i>
        {unreadNotifications.length > 0 && (
          <Badge pill bg="danger" className="position-absolute" style={{ top: -5, right: -10 }}>
            {unreadNotifications.length}
          </Badge>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => {
                  handleNotificationClick(notification._id);
                  setShowModal(false);
                }}
                className={`notification-item ${!notification.isRead ? 'bg-primary text-white' : ''}`}
              >
                {notification.content}
              </div>
            ))
          ) : (
            <div className="notification-item">Empty</div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};