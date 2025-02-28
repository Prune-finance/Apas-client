"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Box,
  Checkbox,
  Flex,
  Grid,
  GridCol,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
// import styles from "../styles.module.scss";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  useUserPermissionsByCategory,
  Permission,
  useSingleUserRoles,
} from "@/lib/hooks/roles";
import { useForm, zodResolver } from "@mantine/form";
import { UpdateRoleType, updateRoleSchema } from "@/lib/schema";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { useParams, useRouter } from "next/navigation";
import { SearchInput } from "@/ui/components/Inputs";
import { useDebouncedValue } from "@mantine/hooks";

function UpdateRole() {
  const { id } = useParams<{ id: string }>();
  const [rolesState, setRolesState] = useState<string | null>("");
  const { handleSuccess } = useNotification();
  const { push, back } = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { permissions, loading } = useUserPermissionsByCategory({
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { role, loading: loadingRole } = useSingleUserRoles(id);

  const form = useForm<UpdateRoleType>({
    initialValues: {
      title: "",
      description: "",
      permissions: [],
    },
    validate: zodResolver(updateRoleSchema),
  });

  useEffect(() => {
    if (!permissions || !role) return;

    const permissionArray =
      permissions &&
      Object.entries(permissions).map(([title, items]) =>
        items.map((p: Permission) => ({
          title: p.title,
          status: role?.permissions.some((rp) => rp.id === p.id),
          id: p.id,
        }))
      );

    form.initialize({
      permissions: permissionArray,
      title: role?.title || "",
      description: role?.description || "",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, role]);

  const { queryFn: handleSubmit, loading: processing } = useAxios({
    baseURL: "auth",
    endpoint: `roles/${id}`,
    method: "PATCH",
    body: {
      permissions: form.values.permissions.flatMap((p) =>
        p.filter((filterP) => filterP.status).map((i) => i.id)
      ),
    },

    onSuccess: () => {
      handleSuccess(
        "Role Updated",
        `The ${form.values.title} role has been successfully updated`
      );

      form.reset();
      push("/users?tab=roles");
    },
  });

  const items =
    permissions &&
    Object.entries(permissions).map(([title, _item], parentIndex) => (
      <Accordion.Item key={title} value={title}>
        <Accordion.Control>
          <Text
            fz={14}
            c={title === rolesState ? "#1D2939" : "#667085"}
            fw={title === rolesState ? 500 : 400}
          >
            {title}
          </Text>
        </Accordion.Control>
        <Accordion.Panel
          mx={0}
          p={16}
          py={32}
          style={{ border: "1px solid #EAECF0" }}
        >
          <Grid gutter={33}>
            <GridCol span={12} p={0}>
              <Stack gap={32}>
                {_item.map((item: Permission, index: number) => (
                  <Checkbox
                    key={index}
                    {...form.getInputProps(
                      `permissions.${parentIndex}.${index}.status`,
                      { type: "checkbox" }
                    )}
                    color="var(--prune-primary-700)"
                    label={item.title}
                    description={item.description}
                    fz={12}
                    size="sm"
                    styles={{
                      description: {
                        fontSize: "12px",
                        color: "#98A2B3",
                        fontWeight: 400,
                      },
                      label: {
                        fontSize: "12px",
                        color: "#475467",
                        fontWeight: 500,
                      },
                    }}
                  />
                ))}
              </Stack>
            </GridCol>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>
    ));

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "User Management", href: "/users" },
          { title: "roles & Permission", href: "/users?tab=roles" },

          {
            title: "Create new role",
            href: `/roles/new`,
          },
        ]}
      />

      <Box
        // mt={20}
        // className={styles.container__body}
        component="form"
        onSubmit={form.onSubmit(handleSubmit, (error) => {
          console.log({ error });
        })}
        mt={48}
      >
        <Grid>
          <GridCol span={{ base: 12, md: 5 }}>
            <Header
              title="Enter Role Details"
              subtitle="Input details of the role you want to create"
            />
            <TextInput
              placeholder="Enter Role Name"
              size="md"
              {...form.getInputProps("title")}
              styles={{ input: { border: "1px solid #F5F5F5" } }}
              mb={16}
              disabled
            />

            <Textarea
              placeholder="Describe Role"
              size="md"
              {...form.getInputProps("description")}
              styles={{ input: { border: "1px solid #F5F5F5" } }}
              minRows={4}
              autosize
              maxRows={5}
              disabled
            />

            <Alert
              mt={16}
              title="Role details can not be changed once created, create new role"
              color="var(--prune-primary-900)"
              fz={12}
              fw={400}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 7 }}>
            <Header
              title="Roles Permissions"
              subtitle="Select what the user can do from the list of permission below"
            />

            <SearchInput
              w="100%"
              placeholder="Search permission"
              mb={24}
              search={search}
              setSearch={setSearch}
            />

            <Accordion
              defaultValue="Account Management"
              variant="contained"
              styles={{
                item: {
                  border: "none",
                  backgroundColor: "transparent",
                },
              }}
              value={rolesState}
              onChange={(value) => setRolesState(value)}
            >
              {loading && loadingRole ? (
                <Stack>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={index} height={30} />
                  ))}
                </Stack>
              ) : (
                items
              )}
            </Accordion>

            <Flex mt={40} justify="flex-end" gap={15}>
              <SecondaryBtn
                text="Cancel"
                fw={600}
                action={() => {
                  form.reset();
                  back();
                }}
              />

              <PrimaryBtn
                text="Save Changes"
                fw={600}
                type="submit"
                disabled={!form.isDirty()}
                // action={handleSubmit}
                loading={processing}
              />
            </Flex>
          </GridCol>
        </Grid>
      </Box>
    </main>
  );
}

export default function RolesSuspense() {
  return (
    <Suspense>
      <UpdateRole />
    </Suspense>
  );
}

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <Stack gap={4} mb={24}>
      <Text fz={20} fw={600} c="var(--prune-text-gray-700)">
        {title}
      </Text>
      <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
        {subtitle}
      </Text>
    </Stack>
  );
};
