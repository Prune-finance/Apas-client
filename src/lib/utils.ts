import dayjs from "dayjs";
import { RequestData } from "./hooks/requests";

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
  if (status === "PENDING") return "#C6A700";
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
    case status === "PENDING" || status === "PROCESSING":
      return "#C6A700";
    case status === "CLOSED":
      return "#0065FF";
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

type Status = "APPROVED" | "REJECTED" | "PENDING";

// export const getDocumentStatus = (
//   request: RequestData,
//   key: string
// ): Status => {
//   if (key in request.documentApprovals)
//     return request.documentApprovals[key] ? "APPROVED" : "REJECTED";

//   return "PENDING";
// };

// export const getDocumentStatus = (
//   request: RequestData,
//   key: string,
//   subKey?: string
// ): Status => {
//   // If no subKey is provided, assume it's a top-level key (flat structure)
//   if (!subKey) {
//     if (key in request.documentApprovals)
//       return request.documentApprovals[key] ? "APPROVED" : "REJECTED";

//     return "PENDING";
//   }

//   // Handle the nested case
//   const categoryData = request.documentApprovals[key];

//   if (categoryData && subKey in categoryData)
//     return categoryData[subKey] ? "APPROVED" : "REJECTED";

//   return "PENDING";
// };

export const getDocumentStatus = (
  request: RequestData,
  key: string,
  subKey?: string,
  nestedKey?: string
): Status => {
  // If no subKey or nestedKey is provided, assume it's a top-level key (flat structure)
  if (!subKey && !nestedKey) {
    if (key in request.documentApprovals) {
      if (request.documentApprovals[key] === null) return "PENDING";
      return request.documentApprovals[key] ? "APPROVED" : "REJECTED";
    }

    return "PENDING";
  }

  // Handle the nested case (key -> subKey -> nestedKey)
  const categoryData = request.documentApprovals[key];

  // If only subKey is provided, treat it as a 2-level structure
  if (categoryData && subKey && !nestedKey) {
    if (subKey in categoryData)
      return categoryData[subKey] ? "APPROVED" : "REJECTED";
    return "PENDING";
  }

  // If both subKey and nestedKey are provided, treat it as a 3-level structure
  if (categoryData && subKey && nestedKey) {
    if (subKey in categoryData && nestedKey in categoryData[subKey]) {
      if (categoryData[subKey][nestedKey] === null) return "PENDING";
      return categoryData[subKey][nestedKey] ? "APPROVED" : "REJECTED";
    }
    return "PENDING";
  }

  return "PENDING";
};

export const removeWhitespace = (text: string) => text.replace(/\s/g, "");

export const calculateTotalPages = (
  limit: string | null,
  total: number | null | undefined
) => {
  return Math.ceil((total ?? 0) / parseInt(limit ?? "10", 10));
};

export const isDummyIBAN = (iban: string): boolean =>
  iban === "GBXXXXXXXXXXXXXXXXXX";
