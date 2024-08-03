import Link from "next/link";
import {
  Breadcrumbs as MantineBreadcrumbs,
  Skeleton,
  Text,
} from "@mantine/core";

import styles from "./styles.module.scss";
import { IconChevronRight } from "@tabler/icons-react";

export default function Breadcrumbs({ items }: { items: IItems[] }) {
  const links = items.map((item, index) => (
    <Link href={item.href} key={index}>
      {!item.loading ? (
        <Text
          fz={11}
          tt="uppercase"
          className={`${styles.current__link} ${
            index === items.length - 1 && styles.active__link
          }`}
        >
          {item.title}
        </Text>
      ) : (
        <Skeleton height={8} width={60} radius="xl" />
      )}
    </Link>
  ));

  return (
    <MantineBreadcrumbs separator={<IconChevronRight size={14} />}>
      {links}
    </MantineBreadcrumbs>
  );
}

interface IItems {
  title: string;
  href: string;
  loading?: boolean;
}
