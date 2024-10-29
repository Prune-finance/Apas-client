import { notifications, showNotification } from "@mantine/notifications";
import {
  IconBell,
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { NotificationStore } from "../store/notification";

const useNotification = () => {
  const { setProps } = NotificationStore();
  const handleError = (title: string, msg: string) => {
    setProps({ position: "top-center", limit: 1 });
    notifications.show({
      title: title,
      message: msg,
      icon: <IconX size="0.8rem" />,
      color: "red",
      // position: "top-center",
      // limit: 1,
      styles: (theme) => ({
        root: {
          backgroundColor: "#FEEDE6",
          border: "1px solid #F44708",
          width: "500px",
          borderRadius: "5px",
        },

        title: { fontSize: "13px", fontWeight: 700, color: "#F44708" },
        description: { color: "#F44708", fontSize: "11px" },
        closeButton: {
          color: "#F44708",
          "&:hover": { backgroundColor: "none" },
        },
      }),
    });
  };

  const handleSuccess = (title: string, msg: string) => {
    setProps({ position: "top-center", limit: 1 });
    showNotification({
      title: title,
      message: msg,
      icon: <IconCheck size="0.8rem" />,
      color: "teal",
      // position: "top-center",
      // limit: 1,
      styles: (theme) => ({
        root: {
          backgroundColor: "#EFF5F1",
          border: "1px solid #76AD87",
          width: "500px",
          borderRadius: "5px",

          //   "&::before": { backgroundColor: theme.white },
        },

        title: { fontSize: "13px", fontWeight: 700, color: "#375F43" },
        description: { color: "#375F43", fontSize: "11px" },
        closeButton: {
          color: "teal",
          "&:hover": { backgroundColor: "none" },
        },
      }),
    });
  };

  const handleInfo = (title: string, msg: string) => {
    setProps({ position: "top-center", limit: 1 });
    notifications.show({
      title: title,
      message: msg,
      icon: <IconInfoCircle size="0.8rem" />,
      color: "blue",
      autoClose: false,
      // position: "top-center",
      // limit: 1,
      styles: (theme) => ({
        root: {
          backgroundColor: "#E7F5FF",
          border: "1px solid #228BE6",
          width: "500px",
          borderRadius: "5px",
          //   "&::before": { backgroundColor: theme.white },
        },

        title: { fontSize: "13px", fontWeight: 700, color: "#228BE6" },
        description: { color: "#228BE6", fontSize: "11px" },
        closeButton: {
          color: "#228BE6",
          // "&:hover": { backgroundColor: theme.colors.blue[7] },
        },
      }),
    });
  };

  const handleInfoForNotification = (title: string, msg: string) => {
    setProps({ position: "top-left", limit: 5 });
    showNotification({
      title: title,
      message: msg,
      icon: <IconBell size="0.8rem" />,
      color: "blue",
      autoClose: false,
      // position: "bottom-center",
      // limit: 5,
      styles: (theme) => ({
        root: {
          backgroundColor: "#E7F5FF",
          border: "1px solid #228BE6",
          width: "500px",
          borderRadius: "5px",
          //   "&::before": { backgroundColor: theme.white },
        },

        title: { fontSize: "13px", fontWeight: 700, color: "#228BE6" },
        description: { color: "#228BE6", fontSize: "11px" },
        closeButton: {
          color: "#228BE6",
          // "&:hover": { backgroundColor: theme.colors.blue[7] },
        },
      }),
    });
  };

  return {
    handleError,
    handleInfo,
    handleSuccess,
    handleInfoForNotification,
  };
};

export default useNotification;
