"use client";

import { Suspense, useMemo, useState } from "react";
import { TabsPanel, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBriefcase, IconUserX } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

import TabsComponent from "@/ui/components/Tabs";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import {
  AdminRole,
  adminRolesApi,
  isRoleActive,
  useAdminRoles,
} from "@/lib/hooks/adminRoles";

import RolesTable from "@/ui/section/roles/RolesTable";
import RoleDrawer from "@/ui/section/roles/Drawers/RoleDrawer";
import RoleStatusModal from "@/ui/section/roles/Modals/RoleStatusModal";
import styles from "@/ui/section/roles/styles.module.scss";

function Roles() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const { roles, loading, revalidate } = useAdminRoles();
  const { handleSuccess, handleError } = useNotification();

  const [selected, setSelected] = useState<AdminRole | null>(null);
  const [processing, setProcessing] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const { active, deactivated } = useMemo(() => {
    const list = roles ?? [];
    return {
      active: list.filter(isRoleActive),
      deactivated: list.filter((r) => !isRoleActive(r)),
    };
  }, [roles]);

  const handleView = (role: AdminRole) => {
    setSelected(role);
    openDrawer();
  };

  const handleToggleStatus = (role: AdminRole) => {
    setSelected(role);
    openModal();
  };

  const confirmToggleStatus = async () => {
    if (!selected) return;
    const deactivating = isRoleActive(selected);

    setProcessing(true);
    try {
      if (deactivating) await adminRolesApi.deactivate(selected.id);
      else await adminRolesApi.activate(selected.id);

      handleSuccess(
        `Role ${deactivating ? "deactivation" : "activation"}`,
        `${selected.title} has been ${
          deactivating ? "deactivated" : "activated"
        } successfully`
      );
      closeModal();
      closeDrawer();
      revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Roles & Permissions
          </Text>
          <Text fz={14} c="#667085">
            Create roles and choose the privileges that admins assigned to
            them can use.
          </Text>
        </div>

        <TabsComponent
          tabs={tabs}
          defaultValue={
            tabs.find((t) => t.value === tab)?.value ?? tabs[0].value
          }
          mt={32}
          tt="capitalize"
          keepMounted={false}
        >
          <TabsPanel value={tabs[0].value}>
            <RolesTable
              variant="active"
              roles={active}
              loading={loading}
              onView={handleView}
              onToggleStatus={handleToggleStatus}
            />
          </TabsPanel>

          <TabsPanel value={tabs[1].value}>
            <RolesTable
              variant="deactivated"
              roles={deactivated}
              loading={loading}
              onView={handleView}
              onToggleStatus={handleToggleStatus}
            />
          </TabsPanel>
        </TabsComponent>
      </div>

      <RoleDrawer
        role={selected}
        opened={drawerOpened}
        close={closeDrawer}
        onToggleStatus={handleToggleStatus}
      />

      <RoleStatusModal
        role={selected}
        opened={modalOpened}
        close={closeModal}
        onConfirm={confirmToggleStatus}
        processing={processing}
      />
    </main>
  );
}

const tabs = [
  { title: "Roles", value: "Roles", icon: <IconBriefcase size={14} /> },
  {
    title: "Deactivated",
    value: "Deactivated",
    icon: <IconUserX size={14} />,
  },
];

export default function RolesSuspense() {
  return (
    <Suspense>
      <Roles />
    </Suspense>
  );
}
