import GoBackButton from "@/components/reusable/GoBackButton";
import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
        <GoBackButton/>
      <h1>{t("privacyPolicy.title")}</h1>
      <p>{t("privacyPolicy.intro")}</p>

      <h2>{t("privacyPolicy.informationCollectionTitle")}</h2>
      <p>{t("privacyPolicy.informationCollectionContent")}</p>

      <h2>{t("privacyPolicy.informationUsageTitle")}</h2>
      <p>{t("privacyPolicy.informationUsageContent")}</p>

      <h2>{t("privacyPolicy.informationSharingTitle")}</h2>
      <p>{t("privacyPolicy.informationSharingContent")}</p>

      <h2>{t("privacyPolicy.dataSecurityTitle")}</h2>
      <p>{t("privacyPolicy.dataSecurityContent")}</p>

      <h2>{t("privacyPolicy.dataRetentionTitle")}</h2>
      <p>{t("privacyPolicy.dataRetentionContent")}</p>

      <h2>{t("privacyPolicy.preferencesTitle")}</h2>
      <p>{t("privacyPolicy.preferencesContent")}</p>

      <h2>{t("privacyPolicy.thirdPartyWebsitesTitle")}</h2>
      <p>{t("privacyPolicy.thirdPartyWebsitesContent")}</p>

      <h2>{t("privacyPolicy.updatesTitle")}</h2>
      <p>{t("privacyPolicy.updatesContent")}</p>

      <h2>{t("privacyPolicy.contactTitle")}</h2>
      <p>{t("privacyPolicy.contactContent")}</p>

      <h2>{t("privacyPolicy.agreementTitle")}</h2>
      <p>{t("privacyPolicy.agreementContent")}</p>

      <p>{t("privacyPolicy.lastUpdated")}</p>
    </div>
  );
};

export default PrivacyPage;
