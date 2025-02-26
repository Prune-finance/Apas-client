import {
  Permission,
  useSingleUserRoles,
  useUserPermissionsByCategory,
} from "@/lib/hooks/roles";
import { InviteUserType } from "@/lib/schema";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import {
  Accordion,
  Checkbox,
  Grid,
  GridCol,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import React from "react";
import { useEffect, useState } from "react";

export default function PermissionsModal({ opened, close, form }: ModalProps) {
  const [rolesState, setRolesState] = useState<string | null>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { permissions, loading } = useUserPermissionsByCategory({
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { role, loading: loadingRole } = useSingleUserRoles(form.values.roleId);

  useEffect(() => {
    if (!permissions || !role) return;

    const permissionArray =
      permissions &&
      Object.entries(permissions).map(([title, items]) =>
        items.map((p: Permission) => ({
          title: p.title,
          status: (role?.permissions ?? []).some((rp) => rp.id === p.id),
          id: p.id,
        }))
      );

    form.setValues({
      permissions: permissionArray,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, role]);

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
    <Modal
      opened={opened}
      onClose={close}
      centered
      padding={40}
      size="lg"
      withCloseButton={false}
      title={
        <Text fz={24} fw={500}>
          Permissions
        </Text>
      }
    >
      <SearchInput search={search} setSearch={setSearch} w="100%" mb={24} />

      <Accordion
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

      <Group justify="flex-end" mt={24}>
        <PrimaryBtn text="Continue" fw={600} action={close} />
      </Group>
    </Modal>
  );
}

interface ModalProps {
  opened: boolean;
  close: () => void;

  form: UseFormReturnType<InviteUserType>;
}
