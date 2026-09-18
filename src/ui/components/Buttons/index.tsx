"use client";

import { Button, ButtonProps, Group, Indicator, UnstyledButton } from "@mantine/core";
import {
  Icon,
  IconArrowLeft,
  IconCircleChevronLeft,
  IconPlus,
  IconProps,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import styles from "./button.module.scss";

const BUTTON_RADIUS = 9999;

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
      color="var(--prune-text-gray-700)"
      fw={400}
      px={0}
      variant="transparent"
      m={0}
      leftSection={
        <FaCircleChevronLeft size={20} fill="var(--prune-text-gray-700)" />
      }
      {...props}
      radius={BUTTON_RADIUS}
    >
      {text}
    </Button>
  ) : (
    <Button
      onClick={back}
      fz={14}
      color="var(--prune-text-gray-700)"
      fw={400}
      px={0}
      variant="transparent"
      m={0}
      leftSection={
        <FaCircleChevronLeft size={20} fill="var(--prune-text-gray-700)" />
      }
      {...props}
      radius={BUTTON_RADIUS}
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
  onClick,
  ...props
}: PrimaryBtnProps) => {
  const Icon = icon;
  return link ? (
    <Button
      color="var(--prune-primary-600)"
      c="var(--prune-text-gray-800)"
      fz={14}
      fw={600}
      leftSection={Icon && <Icon size={14} />}
      component={Link}
      href={link}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) action?.();
      }}
      {...props}
      radius={BUTTON_RADIUS}
      className={[styles.primary__btn, props.className].filter(Boolean).join(" ")}
    >
      {text}
    </Button>
  ) : (
    <Button
      color="var(--prune-primary-600)"
      c="var(--prune-text-gray-800)"
      fz={14}
      fw={600}
      leftSection={Icon && <Icon size={14} />}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
        if (!e.defaultPrevented) action?.();
      }}
      {...props}
      radius={BUTTON_RADIUS}
      className={[styles.primary__btn, props.className].filter(Boolean).join(" ")}
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
  indicator?: number;
}
export const SecondaryBtn = ({
  link,
  text,
  icon,
  action,
  showIcon,
  type = "button",
  indicator,
  ...props
}: PrimaryBtnProps) => {
  const Icon = icon;
  const btn = link ? (
    <Button
      color="var(--prune-primary-600)"
      c="var(--prune-text-gray-800)"
      variant="outline"
      fz={12}
      fw={600}
      leftSection={Icon && <Icon size={14} />}
      component={Link}
      onClick={action}
      href={link}
      type={type}
      {...props}
      radius={BUTTON_RADIUS}
      className={[styles.secondary__btn, props.className].filter(Boolean).join(" ")}
    >
      {text}
    </Button>
  ) : (
    <Button
      color="var(--prune-primary-600)"
      c="var(--prune-text-gray-800)"
      variant="outline"
      fz={12}
      fw={600}
      leftSection={Icon && <Icon size={14} />}
      onClick={(e) => {
        e.stopPropagation();
        action && action();
      }}
      type={type}
      {...props}
      radius={BUTTON_RADIUS}
      className={[styles.secondary__btn, props.className].filter(Boolean).join(" ")}
    >
      {text}
    </Button>
  );
  return indicator && indicator > 0 ? (
    <Indicator label={indicator} size={16} color="var(--prune-primary-600)" c="var(--prune-text-gray-800)" inline>
      {btn}
    </Indicator>
  ) : btn;
};
