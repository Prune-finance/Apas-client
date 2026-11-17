"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Checkbox,
  Flex,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import {
  AdminPermission,
  AdminRolePayload,
  formatCategory,
  groupPermissionsByCategory,
  useAdminPermissions,
} from "@/lib/hooks/adminRoles";
import styles from "./styles.module.scss";

// A role holds whole permissions and gets every privilege inside each one,
// so admins tick permissions; privileges are shown as what each includes.
export interface RoleFormValues {
  title: string;
  description: string;
  permissions: string[];
}

const roleSchema = z.object({
  title: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().optional(),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

interface Props {
  initialValues?: RoleFormValues;
  submitText: string;
  submitting: boolean;
  onSubmit: (values: AdminRolePayload) => void;
  onCancel: () => void;
}

export default function RoleForm({
  initialValues,
  submitText,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const { permissions, loading } = useAdminPermissions();
  const [search, setSearch] = useState("");

  const form = useForm<RoleFormValues>({
    initialValues: initialValues ?? {
      title: "",
      description: "",
      permissions: [],
    },
    validate: zodResolver(roleSchema),
  });

  const selected = form.values.permissions;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const privilegeCount = useMemo(
    () =>
      (permissions ?? [])
        .filter((p) => selectedSet.has(p.id))
        .reduce((sum, p) => sum + (p.privileges?.length ?? 0), 0),
    [permissions, selectedSet]
  );

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = (permissions ?? []).filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.privileges?.some((pr) => pr.title.toLowerCase().includes(q))
    );
    return groupPermissionsByCategory(list);
  }, [permissions, search]);

  const setIds = (ids: string[], checked: boolean) => {
    const rest = selected.filter((id) => !ids.includes(id));
    form.setFieldValue("permissions", checked ? [...rest, ...ids] : rest);
  };

  const handleSubmit = (values: RoleFormValues) =>
    onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      permissions: values.permissions,
    });

  return (
    <Box
      component="form"
      className={styles.form__container}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Stack gap={20} maw={600}>
        <TextInput
          label="Role Name"
          placeholder="e.g. Rates Manager"
          size="md"
          withAsterisk
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          placeholder="What is this role responsible for?"
          size="md"
          autosize
          minRows={2}
          {...form.getInputProps("description")}
        />
      </Stack>

      <Group justify="space-between" align="flex-end" mt={40} mb={20}>
        <Box>
          <Text fz={16} fw={600}>
            Set Permissions
          </Text>
          <Text fz={12} c="#98A2B3">
            A role gets every privilege in the permissions you select.{" "}
            <Text span fz={12} fw={600} c="#475467">
              {selected.length} permission{selected.length === 1 ? "" : "s"},{" "}
              {privilegeCount} privilege{privilegeCount === 1 ? "" : "s"}
            </Text>
          </Text>
        </Box>
        <SearchInput
          search={search}
          setSearch={setSearch}
          placeholder="Search permissions..."
        />
      </Group>

      {form.errors.permissions && (
        <Text fz={12} c="red" mb={12}>
          {form.errors.permissions}
        </Text>
      )}

      {loading ? (
        <Stack>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={90} />
          ))}
        </Stack>
      ) : !Object.keys(grouped).length ? (
        <Text fz={12} c="#667085" ta="center" py={40}>
          {search
            ? "No permission matches your search."
            : "No permissions available."}
        </Text>
      ) : (
        <Stack gap={20}>
          {Object.entries(grouped).map(([category, perms]) => {
            const ids = perms.map((p) => p.id);
            const count = ids.filter((id) => selectedSet.has(id)).length;

            return (
              <Box key={category} className={styles.category}>
                <div className={styles.category__header}>
                  <Text fz={13} fw={600} c="#344054">
                    {formatCategory(category)}
                  </Text>
                  <Checkbox
                    size="xs"
                    label={<Text fz={12}>Select all</Text>}
                    color="var(--prune-primary-700)"
                    checked={count === ids.length}
                    indeterminate={count > 0 && count < ids.length}
                    onChange={(e) => setIds(ids, e.currentTarget.checked)}
                  />
                </div>

                <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} p={16}>
                  {perms.map((p) => (
                    <PermissionCard
                      key={p.id}
                      permission={p}
                      checked={selectedSet.has(p.id)}
                      onChange={(checked) => setIds([p.id], checked)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            );
          })}
        </Stack>
      )}

      <Flex mt={40} justify="flex-end" gap={15}>
        <SecondaryBtn text="Cancel" action={onCancel} />
        <PrimaryBtn text={submitText} type="submit" loading={submitting} />
      </Flex>
    </Box>
  );
}

function PermissionCard({
  permission: p,
  checked,
  onChange,
}: {
  permission: AdminPermission;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.permission__card} data-checked={checked}>
      <Flex gap={12} align="flex-start">
        <Checkbox
          mt={2}
          color="var(--prune-primary-700)"
          checked={checked}
          onChange={(e) => onChange(e.currentTarget.checked)}
        />
        <Box>
          <Text fz={13} fw={600} c="#344054">
            {p.title}
          </Text>
          {p.description && (
            <Text fz={12} c="#98A2B3">
              {p.description}
            </Text>
          )}
          {!!p.privileges?.length && (
            <>
              <Text fz={10} fw={600} c="#667085" tt="uppercase" mt={10}>
                Includes
              </Text>
              <Flex gap={6} wrap="wrap" mt={6}>
                {p.privileges.map((pr) => (
                  <Badge
                    key={pr.id}
                    variant="light"
                    color="gray"
                    tt="none"
                    fw={500}
                    size="sm"
                  >
                    {pr.title}
                  </Badge>
                ))}
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </label>
  );
}
