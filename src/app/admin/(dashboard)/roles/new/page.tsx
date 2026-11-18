"use client";

import { useState } from "react";
import { Box, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import {
  AdminRolePayload,
  adminRolesApi,
  refreshAdminMe,
} from "@/lib/hooks/adminRoles";
import RoleForm from "@/ui/section/roles/RoleForm";

export default function NewRole() {
  const { push } = useRouter();
  const { handleSuccess, handleError } = useNotification();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: AdminRolePayload) => {
    setSubmitting(true);
    try {
      await adminRolesApi.create(values);
      handleSuccess("Role creation", `${values.title} role successfully created`);
      push("/admin/roles");
    } catch (error) {
      handleError("An error occurred", parseError(error));
      refreshAdminMe();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Roles & Permissions", href: "/admin/roles" },
          { title: "Create new role", href: "/admin/roles/new" },
        ]}
      />

      <Box mt={20}>
        <Text fz={18} fw={600}>
          Create New Role
        </Text>
      </Box>

      {/* the page guard only lets admins with roles.create in */}
      <RoleForm
        submitText="Create Role"
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => push("/admin/roles")}
      />
    </main>
  );
}
