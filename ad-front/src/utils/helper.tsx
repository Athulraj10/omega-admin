import { toast, ToastOptions, Id } from "react-toastify";
import React from "react";

// Use .env.local for Next.js; fallback is provided for clarity
export const url: string = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8001";

// ======== Toast UI Components ========
interface ToastComponentProps {
  msg: string;
}

export const ErrorToast: React.FC<ToastComponentProps> = ({ msg }) => (
  <div>
    <svg
      width="1.0625em"
      height="1em"
      viewBox="0 0 17 16"
      className="bi bi-exclamation-triangle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016z"
      />
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);

export const SuccessToast: React.FC<ToastComponentProps> = ({ msg }) => (
  <div>
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className="bi bi-check-circle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
      />
      <path
        fillRule="evenodd"
        d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
      />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);

export const WarningToast: React.FC<ToastComponentProps> = ({ msg }) => (
  <div>
    <svg
      width="1.0625em"
      height="1em"
      viewBox="0 0 17 16"
      className="bi bi-exclamation-triangle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016z"
      />
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);

// ======== Utility String Converters ========
export const convertToCamelCase = (text: string): string => {
  return text.split("-").join("");
};

export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// ======== Toast Notification Helpers ========
export const notifyWarning = (() => {
  let hasToastBeenShown = false;

  return (message: string): Id | undefined => {
    if (!hasToastBeenShown) {
      hasToastBeenShown = true;
      const theme = localStorage?.getItem("theme");

      const toastId = toast.warn(message, {
        className:
          theme === "true" ? "custom-toast-dark" : "custom-toast-light",
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: theme === "true" ? "dark" : "light",
        onClose: () => {
          hasToastBeenShown = false;
        },
      });

      return toastId;
    }
  };
})();

export const notifySuccess = (() => {
  let hasToastBeenShown = false;

  return (
    message: string,
    options: { delayTime?: number } = {},
  ): Id | undefined => {
    if (!hasToastBeenShown) {
      hasToastBeenShown = true;
      const theme = localStorage?.getItem("theme");
      const { delayTime = 1500 } = options;

      const toastId = toast.success(message, {
        className:
          theme === "true" ? "custom-toast-dark" : "custom-toast-light",
        position: "bottom-center",
        autoClose: delayTime,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: theme === "true" ? "dark" : "light",
        onClose: () => {
          hasToastBeenShown = false;
        },
      });

      return toastId;
    }
  };
})();

export const notifyDanger = (() => {
  let hasToastBeenShown = false;

  return (message: string): Id | undefined => {
    if (!hasToastBeenShown) {
      hasToastBeenShown = true;
      const theme = localStorage?.getItem("theme");

      const toastId = toast.error(message, {
        className:
          theme === "true" ? "custom-toast-dark" : "custom-toast-light",
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: theme === "true" ? "dark" : "light",
        onClose: () => {
          hasToastBeenShown = false;
        },
      });

      return toastId;
    }
  };
})();
