import { toast, type ToastOptions } from "react-toastify";

export type ToastType = "success" | "error" | "warning" | "info";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

/**
 * Notificación reutilizable
 */
export function toastNotify(message: string, type: ToastType = "info") {
  switch (type) {
    case "success":
      toast.success(message, baseOptions);
      break;

    case "error":
      toast.error(message, baseOptions);
      break;

    case "warning":
      toast.warning(message, baseOptions);
      break;

    default:
      toast(message, baseOptions);
      break;
  }
}
