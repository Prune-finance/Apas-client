"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import styles from "../styles.module.scss";
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { activeBadgeColor } from "@/lib/utils";

dayjs.extend(advancedFormat);

export default function SingleUser() {
  const params = useParams<{ id?: string }>();
  const { back } = useRouter();
  const CheckIcon = <IconCheck />;
  const details = [
    { label: "Email", placeholder: "janedoe@example.com" },
    { label: "Role", placeholder: "Admin" },
    { label: "Date Added", placeholder: dayjs().format("Do, MMMM YYYY") },
  ];

  const permissions = [
    { label: "Can view all accounts", value: true },
    { label: "Can edit all accounts", value: true },
    { label: "Can delete all accounts", value: true },
    { label: "Can create new accounts", value: true },
  ];

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

      <Paper className={styles.table__container} mih="calc(100vh - 150px)">
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
          <Group>
            {/* {account?.accountName ? ( */}
            <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
              Omega Chioma
            </Text>
            {/* ) : (
            <Skeleton h={10} w={100} />
          )} */}

            <Badge
              tt="capitalize"
              variant="light"
              color={activeBadgeColor("ACTIVE")}
              w={82}
              h={24}
              fw={400}
              fz={12}
            >
              Active
            </Badge>
          </Group>
          <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
            {`Last Seen: ${dayjs().format("Do, MMMM YYYY")}`}
          </Text>
        </Stack>

        <Divider my={24} />

        <Text fz={16} fw={500} mb={20}>
          Basic Details
        </Text>

        <Grid mt={20} className={styles.grid__container}>
          {details.map((detail) => (
            <GridCol key={detail.label} span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{
                  input: styles.input,
                  label: styles.label,
                }}
                label={detail.label}
                placeholder={detail.placeholder}
              />
            </GridCol>
          ))}
        </Grid>

        <Text fz={16} fw={500} mb={20} mt={40}>
          Permissions:
        </Text>

        <SimpleGrid cols={4}>
          {permissions.map((permission) => (
            <Checkbox
              key={permission.label}
              // icon={CheckIcon}
              label={permission.label}
              name="check"
              value="check"
              color="var(--prune-primary-700)"
              checked={permission.value}
              defaultChecked
              radius="xl"
            />
          ))}
        </SimpleGrid>
      </Paper>
    </main>
  );
}
