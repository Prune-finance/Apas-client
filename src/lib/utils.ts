import dayjs from "dayjs";

export const formatNumber = (
  number: number,
  currency: boolean = true,
  type: string = "NGN",
  locale: string = "en-NG"
) => {
  if (!currency) {
    return new Intl.NumberFormat(locale, {}).format(number);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: type,
  }).format(number);
};

export const activeBadgeColor = (status: string) => {
  if (status === "ACTIVE") return "#12B76A";
  return "#D92D20";
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
    case status === "SUCCESSFUL":
      return "#12B76A";
    case status === "REJECTED":
      return "#FF4D4F";
    case status === "FAILED":
      return "#FF4D4F";
    case status === "PENDING":
      return "#C6A700";
    default:
      return "#FFA940";
  }
};
