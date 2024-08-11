"use client";

import { Button, ButtonProps } from "@mantine/core";
import { Icon, IconArrowLeft, IconPlus, IconProps } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface Props extends ButtonProps {
  link?: string;
  text?: string;
}

export const BackBtn = ({ link, text = "Back", ...props }: Props) => {
  const { back } = useRouter();

  return link ? (
    <Button
      //   {...(link ? { component: Link, href: link } : { onClick: back })}
      component={Link}
      href={link}
      fz={14}
      c="var(--prune-text-gray-500)"
      fw={400}
      px={0}
      variant="transparent"
      leftSection={
        <IconArrowLeft
          color="#1D2939"
          style={{ width: "70%", height: "70%" }}
        />
      }
      {...props}
    >
      {text}
    </Button>
  ) : (
    <Button
      onClick={back}
      fz={14}
      c="var(--prune-text-gray-500)"
      fw={400}
      px={0}
      variant="transparent"
      leftSection={
        <IconArrowLeft
          color="#1D2939"
          style={{ width: "70%", height: "70%" }}
        />
      }
      {...props}
    >
      {text}
    </Button>
  );
};

interface PrimaryBtnProps extends Props {
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  action?: () => void;
  showIcon?: boolean;
}
export const PrimaryBtn = ({
  link,
  text,
  icon,
  action,
  showIcon,
  ...props
}: PrimaryBtnProps) => {
  const Icon = icon;
  return link ? (
    <Button
      color="var(--prune-primary-600)"
      c="var(--prune-text-gray-800)"
      fz={12}
      fw={500}
      leftSection={Icon && <Icon size={14} />}
      component={Link}
      href={link}
      {...props}
    >
      {text}
    </Button>
  ) : (
    <Button
      color="var(--prune-primary-600)"
      c="var(--prune-text-gray-800)"
      fz={12}
      fw={500}
      leftSection={Icon && <Icon size={14} />}
      onClick={action}
      {...props}
    >
      {text}
    </Button>
  );
};

interface PrimaryBtnProps extends Props {
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  action?: () => void;
  showIcon?: boolean;
  type?: "button" | "reset" | "submit";
}
export const SecondaryBtn = ({
  link,
  text,
  icon,
  action,
  showIcon,
  type = "button",
  ...props
}: PrimaryBtnProps) => {
  const Icon = icon;
  return link ? (
    <Button
      color="var(--prune-text-gray-200)"
      c="var(--prune-text-gray-800)"
      variant="outline"
      fz={12}
      fw={500}
      leftSection={Icon && <Icon size={14} />}
      component={Link}
      href={link}
      type={type}
      {...props}
    >
      {text}
    </Button>
  ) : (
    <Button
      color="var(--prune-text-gray-200)"
      c="var(--prune-text-gray-800)"
      variant="outline"
      fz={12}
      fw={500}
      leftSection={Icon && <Icon size={14} />}
      onClick={action}
      type={type}
      {...props}
    >
      {text}
    </Button>
  );
};
