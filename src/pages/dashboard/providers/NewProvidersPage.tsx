import { useTranslation } from "react-i18next";
import { UserForm } from "../../../components/users/UserForm";
import { ButtonBack } from "../../../components/layout/ButtonBack";

export const NewProvidersPage = () => {
  const { t } = useTranslation("providers");

  return (
    <div className="space-y-4">
      <ButtonBack />

      <h1 className="text-xl text-center font-varien text-oxford-blue-800">
        {t("new.title", "Create new user")}
      </h1>

      <div className="items-center w-full justify-center flex">
        <UserForm
          title={t("new.formTitle", "Create provider")}
          defaultRole="PROVIDER"
          hideRoleSelect
          submitLabel={t("new.submit", "Create provider")}
        />
      </div>
    </div>
  );
};
