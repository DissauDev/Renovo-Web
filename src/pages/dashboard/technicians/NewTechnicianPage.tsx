import { useTranslation } from "react-i18next";

import { UserForm } from "../../../components/users/UserForm";
import { ButtonBack } from "../../../components/layout/ButtonBack";

export const NewTechnicianPage = () => {
  const { t } = useTranslation("technicians");

  return (
    <div>
      <ButtonBack />

      <h1 className="text-xl text-center font-varien text-oxford-blue-800 mb-4">
        {t("technicians.createPageTitle")}
      </h1>

      <div className="items-center w-full justify-center flex">
        <UserForm
          title={t("technicians.createFormTitle")}
          defaultRole="EMPLOYEE"
          hideRoleSelect
          submitLabel={t("technicians.createSubmit")}
        />
      </div>
    </div>
  );
};
