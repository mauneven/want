import React from "react";
import { Modal } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";

const UserModal = ({ selectedUser, showModal, closeModal }) => {
  const getFormattedDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Modal show={showModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <>
            <div className="user-profile">
              <div className="user-profile__image">
                <img
                  src={
                    selectedUser.photo
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedUser.photo}`
                      : "icons/person-circle.svg"
                  }
                  alt=""
                  className="user-profile__photo"
                />
              </div>
              <div className="user-profile__info">
                <h5 className="user-profile__name">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h5>
                <div className="user-profile__stats">
                  <p className="user-profile__stat">
                    <span className="user-profile__stat-label">Want user for:</span>{" "}
                    {getFormattedDate(selectedUser.createdAt)}
                  </p>
                  <p className="user-profile__stat">
                    <span className="user-profile__stat-label">Total posts:</span>{" "}
                    {selectedUser.totalPosts}
                  </p>
                  <p className="user-profile__stat">
                    <span className="user-profile__stat-label">Total offers:</span>{" "}
                    {selectedUser.totalOffers}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;