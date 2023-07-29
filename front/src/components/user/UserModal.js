import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const UserModal = ({ selectedUser, showModal, closeModal }) => {

  const { t } = useTranslation();
  const getYearFromDate = (date) => {
    return new Date(date).getFullYear();
  };

  return (
    <Modal show={showModal} onHide={closeModal} centered className="modal-lg">
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <>
            <div className="row">
              <div className="col-lg-6 p-2 d-flex justify-content-center">
                <img
                  src={
                    selectedUser.photo
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedUser.photo}`
                      : "/icons/person-circle.svg"
                  }
                  alt=""
                  className="user-photo img-fluid"
                />
              </div>
              <div className="col-lg-6 d-grid justify-content-center align-items-center">
                <h2>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <h2>
                  <i className="bi bi-star-fill"></i>{" "}
                  {selectedUser.reports
                    ? 5 - 0.3 * selectedUser.reports.length
                    : ""}
                </h2>
                <div>
                  <p>
                  {t('aboutUser.wantUserSince')} {getYearFromDate(selectedUser.createdAt)}
                  </p>
                  <p>{t('aboutUser.hasMade')} {selectedUser.totalPosts} {t('aboutUser.posts')}</p>
                  <p>{t('aboutUser.hasMade')} {selectedUser.totalOffers} {t('aboutUser.offers')}</p>
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
