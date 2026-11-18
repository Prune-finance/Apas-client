"use client";

import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import {
  AdminRole,
  adminRolesApi,
  isRoleActive,
  refreshAdminMe,
  useAdminRoles,
} from "@/lib/hooks/adminRoles";

import RolesTable from "@/ui/section/roles/RolesTable";
import RoleDrawer from "@/ui/section/roles/Drawers/RoleDrawer";
import RoleStatusModal from "@/ui/section/roles/Modals/RoleStatusModal";
import styles from "@/ui/section/roles/styles.module.scss";

export default function Roles() {
  const { roles, loading, revalidate } = useAdminRoles();
  const { handleSuccess, handleError } = useNotification();

  const [selected, setSelected] = useState<AdminRole | null>(null);
  const [processing, setProcessing] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  // the copy of /admin/me saved at login can be stale; refresh it so the
  // Super Admin-only buttons reflect the admin's current role
  useEffect(() => {
    refreshAdminMe();
  }, []);

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
      // the signed-in admin may hold this role
      refreshAdminMe();
    } catch (error) {
      handleError("An error occurred", parseError(error));
      refreshAdminMe();
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
            Create roles and choose the permissions that admins assigned to
            them can use.
          </Text>
        </div>

        <RolesTable
          roles={roles ?? []}
          loading={loading}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
        />
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
