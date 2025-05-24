import {
  activeBadgeColor,
  approvedBadgeColor,
  STAGE,
  stageColor,
  tierColor,
} from "@/lib/utils";
import { Badge, BadgeProps } from "@mantine/core";
import { ReactNode } from "react";

interface IBadge extends BadgeProps {
  active?: boolean;
  tier?: boolean;
  stage?: boolean;
  status: string;
}

export const BadgeComponent = ({
  active,
  tier,
  stage,
  status,
  ...props
}: IBadge) => {
  return (
    <Badge
      tt="capitalize"
      variant="light"
      color={
        active
          ? activeBadgeColor(status)
          : tier
          ? tierColor(status)
          : stage
          ? stageColor(status as STAGE)
          : approvedBadgeColor(status)
      }
      w={props.w ? props.w : 82}
      h={props.h ? props.h : 24}
      fw={props.fw ? props.fw : 400}
      fz={props.fz ? props.fz : 12}
      {...props}
    >
      {status?.toLowerCase()}
    </Badge>
  );
};

export const BadgeFunc = (status: string, active: boolean = false) => {
  return <BadgeComponent status={status} active={active} />;
};
