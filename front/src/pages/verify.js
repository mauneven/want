// frontend: Verify.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function Verify() {
  const { t } = useTranslation();
  const [alertMessage, setAlertMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data);
          console.log(data);
        }
      });
  }, []);

  useEffect(() => {
  const checkVerifiedStatus = async () => {
    const verifiedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-verified`, {
      credentials: 'include',
    });

    if (verifiedResponse.ok) {
      router.push('/');
    }
  };

  checkVerifiedStatus();
}, []);

  useEffect(() => {
    const verifyUser = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        router.push("/");
      } else {
        const responseData = await response.json();
        setAlertMessage(
          responseData.error || t("verificationPage.invalidTokenErrorMessage")
        );
      }
    };

    verifyUser();
  }, []);

  const handleResendVerification = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resend-verification`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Agrega el encabezado Content-Type
        },
        body: JSON.stringify({ email: userData.user.email }), // Utiliza userData.user.email en lugar de userData.email
      }
    );

    if (response.ok) {
      setAlertMessage(t("verificationPage.verificationCodeResentMessage"));
    } else {
      const responseData = await response.json();
      setAlertMessage(
        responseData.error ||
          t("verificationPage.resendVerificationErrorMessage")
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlertMessage("");
    const verificationCode = event.target.verificationCode.value;

    const data = {
      verificationCode,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      router.push("/");
    } else if (response.status === 400) {
      setAlertMessage(t("verificationPage.incorrectCode"));
    } else {
      const responseData = await response.json();
      setAlertMessage(
        responseData.error || t("verificationPage.invalidTokenErrorMessage")
      );
    }
  };

  return (
    <div className="container form-container">
      <div className="card verification-form want-rounded">
        <div className="card-body p-0">
          <div className="container">
            <h1 className="text-center">{t("verificationPage.title")}</h1>
            {alertMessage && (
              <div
                className="alert alert-primary alert-dismissible fade show"
                role="alert"
              >
                {alertMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setAlertMessage("")}
                ></button>
              </div>
            )}
            <p>{t("verificationPage.enterVerificationCodeMessage")}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="verificationCode" className="form-label">
                  {t("verificationPage.verificationCodeLabel")}
                </label>
                <input
                  type="text"
                  className="form-control want-rounded"
                  id="verificationCode"
                  name="verificationCode"
                  placeholder={t(
                    "verificationPage.verificationCodePlaceholder"
                  )}
                  required
                />
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn want-button want-rounded"
                  onClick={handleResendVerification}
                >
                  {t("verificationPage.resendVerificationButton")}
                </button>
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className="want-button want-rounded btn-verify"
                >
                  {t("verificationPage.verifyButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
