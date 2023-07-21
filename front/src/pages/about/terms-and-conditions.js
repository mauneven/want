import GoBackButton from "@/components/reusable/GoBackButton";
import React from "react";
import { useTranslation } from "react-i18next";

const TermsAndConditionsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <GoBackButton/>
      <h1>{t("termsAndConditions.title")}</h1>
      <h2>{t("termsAndConditions.disclaimerTitle")}</h2>
      <p>{t("termsAndConditions.disclaimerContent")}</p>

      <h2>{t("termsAndConditions.paymentServicesTitle")}</h2>
      <p>{t("termsAndConditions.paymentServicesContent")}</p>

      <h2>{t("termsAndConditions.contentModerationTitle")}</h2>
      <p>{t("termsAndConditions.contentModerationContent")}</p>

      <h2>{t("termsAndConditions.dataSecurityTitle")}</h2>
      <p>{t("termsAndConditions.dataSecurityContent")}</p>

      <h2>{t("termsAndConditions.disputesTitle")}</h2>
      <p>{t("termsAndConditions.disputesContent")}</p>

      <h2>{t("termsAndConditions.accountSuspensionTitle")}</h2>
      <p>{t("termsAndConditions.accountSuspensionContent")}</p>

      <h2>{t("termsAndConditions.disputeResolutionTitle")}</h2>
      <p>{t("termsAndConditions.disputeResolutionContent")}</p>

      <h2>{t("termsAndConditions.userResponsibilityTitle")}</h2>
      <p>{t("termsAndConditions.userResponsibilityContent")}</p>

      <h2>{t("termsAndConditions.intellectualPropertyTitle")}</h2>
      <p>{t("termsAndConditions.intellectualPropertyContent")}</p>

      <h2>{t("termsAndConditions.accountCancellationTitle")}</h2>
      <p>{t("termsAndConditions.accountCancellationContent")}</p>

      <h2>{t("termsAndConditions.modificationsTitle")}</h2>
      <p>{t("termsAndConditions.modificationsContent")}</p>

      <h2>{t("termsAndConditions.cookiesTitle")}</h2>
      <p>{t("termsAndConditions.cookiesContent")}</p>

      <h2>{t("termsAndConditions.userLiabilityTitle")}</h2>
      <p>{t("termsAndConditions.userLiabilityContent")}</p>

      <h2>{t("termsAndConditions.privacyTitle")}</h2>
      <p>{t("termsAndConditions.privacyContent")}</p>
    </div>
  );
};

export default TermsAndConditionsPage;