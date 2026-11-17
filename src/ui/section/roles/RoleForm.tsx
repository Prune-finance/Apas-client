"use client";

import { useMemo, useState } from "react";
import {
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
  selectionKeys,
  useAdminPermissions,
} from "@/lib/hooks/adminRoles";
import styles from "./styles.module.scss";

export interface RoleFormValues {
  title: string;
  description: string;
  // privilege ids (or permission ids for permissions without privileges)
  selected: string[];
}

const roleSchema = z.object({
  title: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().optional(),
  selected: z.array(z.string()).min(1, "Select at least one privilege"),
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
    initialValues: initialValues ?? { title: "", description: "", selected: [] },
    validate: zodResolver(roleSchema),
  });

  const selected = form.values.selected;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // privilege id -> permission id (permission ids map to themselves)
  const keyToPermission = useMemo(() => {
    const map = new Map<string, string>();
    (permissions ?? []).forEach((p) => {
      map.set(p.id, p.id);
      p.privileges?.forEach((pr) => map.set(pr.id, p.id));
    });
    return map;
  }, [permissions]);

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

  const setKeys = (keys: string[], checked: boolean) => {
    const rest = selected.filter((k) => !keys.includes(k));
    form.setFieldValue("selected", checked ? [...rest, ...keys] : rest);
  };

  const permissionCount = useMemo(
    () =>
      new Set(selected.map((k) => keyToPermission.get(k)).filter(Boolean))
        .size,
    [selected, keyToPermission]
  );

  // Only permissions with at least one picked privilege are sent.
  const handleSubmit = (values: RoleFormValues) => {
    const permissionIds = Array.from(
      new Set(
        values.selected
          .map((k) => keyToPermission.get(k))
          .filter((id): id is string => !!id)
      )
    );

    onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      permissions: permissionIds,
    });
  };

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
            Select the privileges admins with this role can perform.{" "}
            <Text span fz={12} fw={600} c="#475467">
              {selected.length} privilege{selected.length === 1 ? "" : "s"}{" "}
              across {permissionCount} permission
              {permissionCount === 1 ? "" : "s"}
            </Text>
          </Text>
        </Box>
        <SearchInput
          search={search}
          setSearch={setSearch}
          placeholder="Search permissions..."
        />
      </Group>

      {form.errors.selected && (
        <Text fz={12} c="red" mb={12}>
          {form.errors.selected}
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
            const categoryKeys = perms.flatMap(selectionKeys);
            const categoryCount = categoryKeys.filter((k) =>
              selectedSet.has(k)
            ).length;

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
                    checked={categoryCount === categoryKeys.length}
                    indeterminate={
                      categoryCount > 0 && categoryCount < categoryKeys.length
                    }
                    onChange={(e) =>
                      setKeys(categoryKeys, e.currentTarget.checked)
                    }
                  />
                </div>

                <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} p={16}>
                  {perms.map((p) => (
                    <PermissionCard
                      key={p.id}
                      permission={p}
                      selectedSet={selectedSet}
                      setKeys={setKeys}
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
  selectedSet,
  setKeys,
}: {
  permission: AdminPermission;
  selectedSet: Set<string>;
  setKeys: (keys: string[], checked: boolean) => void;
}) {
  const keys = selectionKeys(p);
  const count = keys.filter((k) => selectedSet.has(k)).length;
  const hasPrivileges = !!p.privileges?.length;

  return (
    <Box className={styles.permission__card} data-checked={count > 0}>
      <Checkbox
        color="var(--prune-primary-700)"
        checked={count === keys.length}
        indeterminate={count > 0 && count < keys.length}
        onChange={(e) => setKeys(keys, e.currentTarget.checked)}
        label={
          <Text fz={13} fw={600} c="#344054">
            {p.title}
          </Text>
        }
        description={
          p.description && (
            <Text fz={12} c="#98A2B3" span>
              {p.description}
            </Text>
          )
        }
      />

      {hasPrivileges && (
        <Stack
          gap={10}
          mt={12}
          pt={12}
          pl={30}
          style={{ borderTop: "1px solid #EAECF0" }}
        >
          {p.privileges.map((pr) => (
            <Checkbox
              key={pr.id}
              size="xs"
              color="var(--prune-primary-700)"
              checked={selectedSet.has(pr.id)}
              onChange={(e) => setKeys([pr.id], e.currentTarget.checked)}
              label={
                <Text fz={12} c="#475467">
                  {pr.title}
                </Text>
              }
              description={
                pr.description && (
                  <Text fz={11} c="#98A2B3" span>
                    {pr.description}
                  </Text>
                )
              }
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
