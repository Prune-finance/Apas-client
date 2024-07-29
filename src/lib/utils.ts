import dayjs from "dayjs";

export const formatNumber = (
  number: number,
  currency: boolean = true,
  type: string = "NGN"
) => {
  if (!currency) {
    return new Intl.NumberFormat("en-NG", {}).format(number);
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: type,
  }).format(number);
};

export const activeBadgeColor = (status: string) => {
  if (status === "ACTIVE") return "#12B76A";
  return "#C6A700";
};

export const formatTime = (time: string) => {
  return dayjs(time).format("DD-MM-YYYY");
};

export const formatDateTime = (time: string) => {
  return dayjs(time).format("DD-MM-YYYY HH:mm");
};

export const approvedBadgeColor = (status: string) => {
  switch (true) {
    case status === "APPROVED":
      return "#12B76A";
    case status === "REJECTED":
      return "#FF4D4F";
    case status === "PENDING":
      return "#C6A700";
    default:
      return "#FFA940";
  }
};
