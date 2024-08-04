import { activeBadgeColor, approvedBadgeColor } from "@/lib/utils";
import { Badge, BadgeProps } from "@mantine/core";
import { ReactNode } from "react";

interface IBadge extends BadgeProps {
  active?: boolean;
  status: string;
}

export const BadgeComponent = ({ active, status, ...props }: IBadge) => {
  return (
    <Badge
      {...props}
      tt="capitalize"
      variant="light"
      color={active ? activeBadgeColor(status) : approvedBadgeColor(status)}
      w={props.w ? props.w : 82}
      h={props.h ? props.h : 24}
      fw={props.fw ? props.fw : 400}
      fz={props.fz ? props.fz : 12}
    >
      {status.toLowerCase()}
    </Badge>
  );
};
