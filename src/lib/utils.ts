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
