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
  if (status === "FROZEN") return "#344054";
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
    case status === "APPROVED" ||
      status === "COMPLETED" ||
      status === "SUCCESSFUL" ||
      status === "CONFIRMED":
      return "#12B76A";
    case status === "REJECTED" || status === "CANCELLED" || status === "FAILED":
      return "#FF4D4F";
    case status === "PENDING":
      return "#C6A700";
    case status === "FROZEN":
      return "#344054";
    default:
      return "#FFA940";
  }
};

export const serialNumber = (
  pageNumber: number,
  index: number,
  perPage: number
) => (pageNumber - 1) * perPage + index + 1;

export const frontendPagination = (
  data: any[],
  page: number,
  perPage: number
) => data.slice((page - 1) * perPage, page * perPage);

export function splitCamelCase(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item.charAt(0).toUpperCase())
    .join("");
};

export const getUserType = (userType: "USER" | "CORPORATE") => {
  if (userType === "USER") return "Individual";
  return "Corporate";
};

export function camelCaseToTitleCase(text: string): string {
  if (text === text.toLowerCase())
    return text.charAt(0).toUpperCase() + text.slice(1);

  const result = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  return result.charAt(0).toUpperCase() + result.slice(1);
}
