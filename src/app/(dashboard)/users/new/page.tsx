"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Flex,
  Grid,
  GridCol,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import styles from "../styles.module.scss";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useUserPermissionsByCategory, Permission } from "@/lib/hooks/roles";
import { useForm, zodResolver } from "@mantine/form";
import { NewRoleType, newRoleSchema } from "@/lib/schema";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { useRouter } from "next/navigation";

function New() {
  const [rolesState, setRolesState] = useState<string | null>("");
  const { permissions, loading } = useUserPermissionsByCategory();
  const { handleSuccess } = useNotification();
  const { push } = useRouter();

  const form = useForm<NewRoleType>({
    initialValues: {
      title: "",
      permissions: [],
    },
    validate: zodResolver(newRoleSchema),
  });

  useEffect(() => {
    if (!permissions) return;

    const permissionArray =
      permissions &&
      Object.entries(permissions).map(([title, items]) =>
        items.map((p: Permission) => ({
          title: p.title,
          status: false,
        }))
      );

    form.initialize({ permissions: permissionArray, title: "" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);

  const { queryFn: handleSubmit, loading: processing } = useAxios({
    baseURL: "auth",
    endpoint: "roles",
    method: "POST",
    body: {
      title: form.values.title,
      permissions: form.values.permissions.flatMap((p) =>
        p.map((i) => ({ title: i.title, status: i.status }))
      ),
    },
    onSuccess: () => {
      handleSuccess(
        "Role creation",
        `${form.values.title} role successfully created`
      );

      form.reset();
      push("/roles");
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
              <SimpleGrid cols={3} spacing={33} p={0}>
                {_item.map((item: Permission, index: number) => (
                  <Switch
                    key={index}
                    {...form.getInputProps(
                      `permissions.${parentIndex}.${index}.status`,
                      { type: "checkbox" }
                    )}
                    // checked={
                    //   form.values.permissions?.[parentIndex]?.[index]?.status ||
                    //   false
                    // }
                    // onChange={(e) => {
                    //   form.setFieldValue(
                    //     `permissions.${parentIndex}.${index}.status`,
                    //     e.currentTarget.checked
                    //   );
                    // }}
                    color="var(--prune-primary-700)"
                    label={
                      <Text fz={12} c="#475467" fw={500}>
                        {item.title}
                      </Text>
                    }
                    description={
                      <Text fz={12} c="#98A2B3" fw={400}>
                        {item.description}
                      </Text>
                    }
                    fz={12}
                    size="sm"
                  />
                ))}
              </SimpleGrid>
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

      <Box mt={20} className={styles.container__header}>
        <Text fz={18} fw={600}>
          Create New Role
        </Text>
      </Box>

      <Box
        mt={20}
        className={styles.container__body}
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          placeholder="Role Name"
          size="md"
          {...form.getInputProps("title")}
          styles={{ input: { border: "1px solid #F5F5F5" } }}
        />

        <Box mt={40} mb={28}>
          <Text fz={16} fw={600}>
            Set Permissions
          </Text>
          <Text fz={12} fw={400} c="#98A2B3">
            Select activities this new user role can perform in all pages.
          </Text>
        </Box>

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
          {loading ? (
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
          <SecondaryBtn text="Cancel" fw={600} action={form.reset} />

          <PrimaryBtn
            text="Create Role"
            fw={600}
            type="submit"
            // action={handleSubmit}
            loading={processing}
          />
        </Flex>
      </Box>
    </main>
  );
}

export default function RolesSuspense() {
  return (
    <Suspense>
      <New />
    </Suspense>
  );
}
