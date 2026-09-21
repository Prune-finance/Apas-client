import {
  activeBadgeColor,
  approvedBadgeColor,
  STAGE,
  stageColor,
  tierColor,
} from "@/lib/utils";
import { Badge, BadgeProps } from "@mantine/core";
import { ReactNode } from "react";

const StageDot = ({ color }: { color: string }) => (
  <span
    style={{
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

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
  const color = active
    ? activeBadgeColor(status)
    : tier
    ? tierColor(status)
    : stage
    ? stageColor(status as STAGE)
    : approvedBadgeColor(status);

  return (
    <Badge
      tt="capitalize"
      variant="light"
      color={color}
      w={props.w ? props.w : 82}
      h={props.h ? props.h : 24}
      fw={props.fw ? props.fw : 400}
      fz={props.fz ? props.fz : 12}
      {...props}
    >
      {stage ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <StageDot color={color} style={{marginRight: '4px'}} />
          {status?.toLowerCase()}
        </span>
      ) : (
        status?.toLowerCase()
      )}
    </Badge>
  );
};

export const BadgeFunc = (status: string, active: boolean = false) => {
  return <BadgeComponent status={status} active={active} />;
};
