import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPostName = async (postId) => {
    if (!postId) {
      console.error("Error: postId is undefined");
      return "";
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`
    );
    const data = await response.json();
    return data.title;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const notificationsData = await response.json();
        const notificationsWithPostName = await Promise.all(
          notificationsData.map(async (notification) => {
            const postName = await fetchPostName(notification.postId);
            return { ...notification, postName };
          })
        );
        setNotifications(notificationsWithPostName);
        setUnreadNotifications(
          notificationsData.filter((notification) => !notification.isRead)
        );
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notificationId) => {
    setUnreadNotifications(
      unreadNotifications.filter(
        (notification) => notification._id !== notificationId
      )
    );

    // Marcar la notificación como leída en el servidor
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    router.push("/receivedOffers");
  };

  const handleModalOpen = async () => {
    setShowModal(true);
    updateNotifications();
  };

  const markAllNotificationsAsRead = async () => {
    setIsLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/markAllAsRead`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    setTimeout(() => {
      setIsLoading(false);
      updateNotifications();
    }, 3300);
  };

  const updateNotifications = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`,
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      const notificationsData = await response.json();
      const notificationsWithPostName = await Promise.all(
        notificationsData.map(async (notification) => {
          const postName = await fetchPostName(notification.postId);
          return { ...notification, postName };
        })
      );
      setNotifications(notificationsWithPostName);
      setUnreadNotifications(
        notificationsData.filter((notification) => !notification.isRead)
      );
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws`);

    ws.onopen = () => {
      
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "NEW_OFFER":
          updateNotifications();
          break;
        case "OFFER_DELETED":
          // Handle deleted offer here
          updateNotifications();
          break;
        case "POST_DELETED":
          // Handle deleted post here
          updateNotifications();
          break;
      }
    };

    return () => ws.close();
  }, []);

  return (
    <>
      <div className="divhover d-flex" onClick={handleModalOpen}>
        <i className="bi bi-bell fs-3"></i>
        {unreadNotifications.length > 0 && (
          <Badge pill bg="success" className="position-absolute">
            {unreadNotifications.length}
          </Badge>
        )}
      </div>

      <Modal
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("notifications.title")}</Modal.Title>
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
                className={`notification-item post-title ${
                  !notification.isRead ? "bg-success text-white" : ""
                }`}
              >
                {notification.type === "offer" ? (
                  <>
                    <span className="notification-type">{t("notifications.newOffer")} </span>
                    {notification.content}
                  </>
                ) : notification.type === "message" ? (
                  <>
                    <span className="notification-type">New message: </span>
                    {notification.content}
                  </>
                ) : (
                  notification.content
                )}
              </div>
            ))
          ) : (
            <div className="notification-item">{t("notifications.empty")}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className=" want-button want-rounded"
            onClick={markAllNotificationsAsRead}
            disabled={isLoading}
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {isLoading
              ? t("notifications.markingRead")
              : t("notifications.markAllRead")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
