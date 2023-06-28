import React from "react";

const GoBackButton = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <button className="btn rounded-5 border d-flex justify-content-center align-items-center mb-5" onClick={handleGoBack}>
      <i className="bi bi-arrow-left fs-1 me-2"></i>
      <p className="justify-content-center text-center align-items-center fs-3 m-0">Go Home</p>
      </button>
    </>
  );
};

export default GoBackButton;
