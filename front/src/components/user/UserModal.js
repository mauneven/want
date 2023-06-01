import React from "react";
import { Modal } from "react-bootstrap";

const UserModal = ({ selectedUser, showModal, closeModal }) => {
  return (
    <Modal show={showModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <>
            <div className="row align-items-center">
              <div className="col-1">
                <img
                  src={
                    selectedUser.photo
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedUser.photo}`
                      : "icons/person-circle.svg"
                  }
                  alt=""
                  className="createdBy-photo-id"
                />
              </div>
              <div className="col-9 ms-4">
                <h5>{selectedUser.firstName} {selectedUser.lastName}</h5>
              </div>
            </div>
            <div>
              <p className="h4 mt-4">Principal aspects</p>
              <p>On Want since {selectedUser.createdAt}</p>
              <p>has done {selectedUser.totalPosts} posts</p>
              <p>has done {selectedUser.totalOffers} offers</p>
              <p>Reputation: <i class="bi bi-star-fill"></i> {selectedUser.reports ? 5 - (0.3 * selectedUser.reports.length) : ""}</p>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;