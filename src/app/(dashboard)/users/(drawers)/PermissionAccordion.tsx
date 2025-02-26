import { Permission, transformPermissionsToCategory } from "@/lib/hooks/roles";
import { Accordion, Grid, GridCol, Stack, Checkbox, Text } from "@mantine/core";
import { useState } from "react";

interface PermissionAccordionProps {
  permissions: Permission[];
  disabled?: boolean;
}
export const PermissionAccordion = ({
  permissions,
  disabled = false,
}: PermissionAccordionProps) => {
  const [rolesState, setRolesState] = useState<string | null>("");

  // Function to transform category names
  const transformCategoryName = (category: string) => {
    return category.split("_").join(" ");
  };

  const items =
    permissions &&
    Object.entries(transformPermissionsToCategory(permissions)).map(
      ([title, _item], parentIndex) => (
        <Accordion.Item key={title} value={title}>
          <Accordion.Control>
            <Text
              fz={14}
              c={title === rolesState ? "#1D2939" : "#667085"}
              fw={title === rolesState ? 500 : 400}
            >
              {transformCategoryName(title)}
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
                      defaultChecked
                      disabled={disabled}
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
      )
    );
  return (
    <Accordion
      mt={16}
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
      {items}
    </Accordion>
  );
};
