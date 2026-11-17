"use client";

import { useState } from "react";
import { Box, Skeleton, Stack, Text } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import {
  AdminRolePayload,
  adminRolesApi,
  selectionKeys,
  useAdminRole,
} from "@/lib/hooks/adminRoles";
import RoleForm from "@/ui/section/roles/RoleForm";

export default function EditRole() {
  const { id } = useParams<{ id: string }>();
  const { push } = useRouter();
  const { handleSuccess, handleError } = useNotification();
  const { role, loading } = useAdminRole(id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: AdminRolePayload) => {
    setSubmitting(true);
    try {
      await adminRolesApi.update(id, values);
      handleSuccess("Role update", `${values.title} role successfully updated`);
      push("/admin/roles");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Roles & Permissions", href: "/admin/roles" },
          {
            title: role?.title ?? "Role",
            href: `/admin/roles/${id}/edit`,
            loading,
          },
          { title: "Edit", href: `/admin/roles/${id}/edit` },
        ]}
      />

      <Box mt={20}>
        <Text fz={18} fw={600}>
          Edit Role
        </Text>
      </Box>

      {loading ? (
        <Stack mt={20} gap={16}>
          <Skeleton height={44} maw={600} />
          <Skeleton height={70} maw={600} />
          <Skeleton height={200} />
        </Stack>
      ) : !role ? (
        <Text fz={14} c="#667085" mt={40} ta="center">
          This role could not be found.
        </Text>
      ) : (
        // keyed so the form re-initialises if a different role loads
        <RoleForm
          key={role.id}
          initialValues={{
            title: role.title,
            description: role.description ?? "",
            selected: role.permissions.flatMap(selectionKeys),
          }}
          submitText="Save Changes"
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => push("/admin/roles")}
        />
      )}
    </main>
  );
}
