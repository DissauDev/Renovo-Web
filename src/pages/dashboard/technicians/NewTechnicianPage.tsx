import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { UserForm } from "../../../components/users/UserForm";
import { useNavigate } from "react-router-dom";

export const NewTechnicianPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/app/technicians")}
        className="px-4 flex flex-row py-2 text-sm
         items-center justify-center rounded-lg border font-semibold border-slate-300
                 text-slate-700 hover:bg-slate-300"
      >
        <ArrowLeftIcon className="size-6 mr-2" /> Go Back
      </button>

      <h1 className="text-xl text-center font-varien text-oxford-blue-800 mb-4">
        Create new user
      </h1>
      <div className="items-center w-full justify-center flex">
        <UserForm
          title="Create technician"
          defaultRole="EMPLOYEE"
          hideRoleSelect
          submitLabel="Create technician"
        />
      </div>
    </div>
  );
};
