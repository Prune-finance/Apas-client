"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import styles from "../styles.module.scss";
import { Button, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export default function SingleUser() {
  const params = useParams<{ id?: string }>();
  const { back } = useRouter();
  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Users", href: "/admin/users" },
          {
            title: "User Name",
            href: `/admin/users/${params.id}`,
          },
        ]}
      />

      <Paper className={styles.table__container}>
        <Button
          fz={14}
          c="var(--prune-text-gray-500)"
          fw={400}
          px={0}
          variant="transparent"
          onClick={back}
          leftSection={
            <IconArrowLeft
              color="#1D2939"
              style={{ width: "70%", height: "70%" }}
            />
          }
        >
          Back
        </Button>

        <Stack gap={0}>
          {/* {account?.accountName ? ( */}
          <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
            Omega Chioma
          </Text>
          {/* ) : (
            <Skeleton h={10} w={100} />
          )} */}
          <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
            {`Last Seen: ${dayjs().format("Do, MMMM YYYY")}`}
          </Text>
        </Stack>
      </Paper>
    </main>
  );
}
