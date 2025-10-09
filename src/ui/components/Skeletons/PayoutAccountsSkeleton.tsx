import React from "react";
import styles from "./payoutAccountsSkeleton.module.scss";
import { Group, Skeleton, Stack } from "@mantine/core";

interface Props {
  rows?: number;
  cards?: number;
}

export default function PayoutAccountsSkeleton({ rows = 5, cards = 3 }: Props) {
  return (
    <Stack mt={32} gap={16}>
      <Group gap={20}>
        {Array.from({ length: cards }).map((_, i) => (
          <Skeleton key={i} w={220} h={30} />
        ))}
      </Group>

      <Group gap={20} wrap="nowrap">
        <Skeleton w="70%" h={400} />
        <Skeleton w="30%" h={400} />
      </Group>

      <Group gap={20} wrap="nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} w="100%" h={80} />
        ))}
      </Group>

      <Group justify="space-between" align="center" mt={32}>
        <Skeleton w={250} h={30} />

        <Group>
          <Skeleton w={100} h={30} />
          <Skeleton w={100} h={30} />
        </Group>
      </Group>
    </Stack>
  );
}
// <div className={styles.container}>
//   <div className={styles.cards}>
//     {Array.from({ length: cards }).map((_, i) => (
//       <div key={i} className={`${styles.card} ${styles.shimmer}`} />
//     ))}
//   </div>

//   <div className={styles.toolbar}>
//     <div className={`${styles.search} ${styles.shimmer}`} />
//     <div className={styles.actions}>
//       <div className={`${styles.button} ${styles.shimmer}`} />
//       <div className={`${styles.button} ${styles.shimmer}`} />
//     </div>
//   </div>

//   <div className={styles.filters}>
//     <div className={`${styles.filter} ${styles.shimmer}`} />
//     <div className={`${styles.filter} ${styles.shimmer}`} />
//     <div className={`${styles.filter} ${styles.shimmer}`} />
//   </div>

//   <div className={styles.tableHeader}>
//     {[
//       "Business Account Name",
//       "Account Number",
//       "Account Balance",
//       "Date Created",
//       "Status",
//       "Action",
//     ].map((h) => (
//       <div key={h} className={`${styles.headerCell} ${styles.shimmer}`} />
//     ))}
//   </div>

//   <div className={styles.rows}>
//     {Array.from({ length: rows }).map((_, i) => (
//       <div key={i} className={styles.row}>
//         {Array.from({ length: 6 }).map((__, j) => (
//           <div
//             key={j}
//             className={`${styles.cell} ${styles.shimmer}`}
//             style={{ width: `${120 + (j % 3) * 40}px` }}
//           />
//         ))}
//       </div>
//     ))}
//   </div>

//   <div className={styles.pagination}>
//     {Array.from({ length: 5 }).map((_, i) => (
//       <div key={i} className={`${styles.page} ${styles.shimmer}`} />
//     ))}
//   </div>
// </div>
