"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams } from "next/navigation";
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
import { BackBtn, PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { BadgeComponent } from "@/ui/components/Badge";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import ModalComponent from "@/ui/components/Modal";
import UpdateModal from "../../../modal";
import { IconPencilMinus, IconUserCheck, IconUserX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { newAdmin, validateNewAdmin } from "@/lib/schema";

dayjs.extend(advancedFormat);

export default function SingleUser() {
  const params = useParams<{ userId: string; id: string }>();

  const [deactivateOpened, { open: openDeactivate, close: closeDeactivate }] =
    useDisclosure(false);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);
  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState("");

  const { user, loading, revalidate } = useSingleAdmin(params.userId);
  const { business, loading: loadingBiz } = useSingleBusiness(params.id);

  const form = useForm<typeof newAdmin>({
    initialValues: newAdmin,
    validate: zodResolver(validateNewAdmin),
  });

  const details = [
    { label: "Business Name", placeholder: business?.name },
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

  const handleUserStatus = async (status: "ACTIVE" | "INACTIVE") => {};

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

        <Group justify="space-between">
          <Stack gap={8}>
            <Group>
              {!loading ? (
                <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
                  {`${user?.firstName ?? "First Name Here"} ${
                    user?.lastName ?? "Last Name Here"
                  }`}
                </Text>
              ) : (
                <Skeleton h={10} w={100} />
              )}

              <BadgeComponent status={user?.status ?? "ACTIVE"} active />
            </Group>
            <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
              {`Last Seen: ${
                user?.lastLogIn
                  ? dayjs(user?.lastLogIn).format("Do MMMM, YYYY")
                  : "Nil"
              }`}
            </Text>
          </Stack>

          <Group>
            <SecondaryBtn text="Reset Password" fw={600} />
            <PrimaryBtn
              text={user?.status === "ACTIVE" ? "Deactivate" : "Activate"}
              fw={600}
              color={user?.status === "ACTIVE" ? "#D92D20" : "#027A48"}
              c="#fff"
              action={openDeactivate}
            />
          </Group>
        </Group>

        <Divider my={24} />

        <Group justify="space-between">
          <Text fz={16} fw={600} mb={20}>
            Basic Details
          </Text>

          <SecondaryBtn
            text="Update Details"
            icon={IconPencilMinus}
            fw={600}
            mah={30}
            action={() => {
              openUpdate();
              form.setValues({
                firstName: user?.firstName ?? "Benson",
                lastName: user?.lastName ?? "Salasi",
                email: user?.email,
                role: user?.role,
              });
            }}
          />
        </Group>

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
      {/* Modal for handling status change */}
      <ModalComponent
        processing={processing}
        action={() =>
          handleUserStatus(user?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")
        }
        color={user?.status === "ACTIVE" ? "#FEF3F2" : "#ECFDF3"}
        icon={
          user?.status === "ACTIVE" ? (
            <IconUserX color="#D92D20" />
          ) : (
            <IconUserCheck color="#12B76A" />
          )
        }
        opened={deactivateOpened}
        close={closeDeactivate}
        title={
          user?.status === "ACTIVE" ? "Deactivate User?" : "Activate User?"
        }
        text={
          user?.status === "ACTIVE"
            ? "This means you are about to deactivate this user from the system."
            : "This means you are about to reactivate this user on the system."
        }
        addReason
        reason={reason}
        setReason={setReason}
        customApproveMessage={`Yes, ${
          user?.status === "ACTIVE" ? "Deactivate" : "Activate"
        }`}
      />

      {/* Update Details Modal */}
      <UpdateModal
        opened={updateOpened}
        close={closeUpdate}
        action={() => {}}
        processing={processing}
        isEdit
        setIsEdit={() => {}}
        form={form}
      />
    </main>
  );
}