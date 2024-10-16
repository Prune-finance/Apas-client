"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../styles.module.scss";
import {
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useSingleAdmin } from "@/lib/hooks/admins";
import { BackBtn } from "@/ui/components/Buttons";
import { BadgeComponent } from "@/ui/components/Badge";
import { useSingleBusiness } from "@/lib/hooks/businesses";

dayjs.extend(advancedFormat);

export default function SingleUser() {
  const params = useParams<{ userId: string; id: string }>();
  const { back } = useRouter();

  const { user, loading, revalidate } = useSingleAdmin(params.userId);
  const { business, loading: loadingBiz } = useSingleBusiness(params.id);

  const details = [
    { label: "Email", placeholder: user?.email },
    { label: "Role", placeholder: user?.role },
    {
      label: "Date Added",
      placeholder: dayjs(user?.createdAt).format("Do MMMM, YYYY"),
    },
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
          { title: "User Management", href: "/admin/users?tab=Business Users" },
          {
            title: `${business?.name}`,
            href: `/admin/users/${params.id}/business`,
            loading: loadingBiz,
          },
          {
            title: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
            href: `/admin/users/${params.id}/business/${params.userId}`,
            loading: loading,
          },
        ]}
      />

      <Paper className={styles.table__container} mih="calc(100vh - 150px)">
        <BackBtn />

        <Stack gap={0}>
          <Group>
            {!loading ? (
              <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
                {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {/* <Badge
              tt="capitalize"
              variant="light"
              color={activeBadgeColor("ACTIVE")}
              w={82}
              h={24}
              fw={400}
              fz={12}
            >
              Active
            </Badge> */}
            <BadgeComponent status="ACTIVE" active />
          </Group>
          <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
            {`Last Seen: ${
              user?.lastLogIn
                ? dayjs(user?.lastLogIn).format("Do MMMM, YYYY")
                : "Nil"
            }`}
          </Text>
        </Stack>

        <Divider my={24} />

        <Text fz={16} fw={600} mb={20}>
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

        {/* <Text fz={16} fw={500} mb={20} mt={40}>
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
        </SimpleGrid> */}
      </Paper>
    </main>
  );
}
