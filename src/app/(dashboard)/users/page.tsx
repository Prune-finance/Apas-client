"use client";

import TabsComponent from "@/ui/components/Tabs";
import { Stack, TabsPanel, Text } from "@mantine/core";
import { IconBriefcase, IconUsers } from "@tabler/icons-react";
import { Suspense } from "react";
import ActiveUsers from "./(tabs)/activeUsers";
import ActiveRoles from "./(tabs)/activeRole";
import DeactivatedRoles from "./(tabs)/deactivatedRole";

function Users() {
  return (
    <main style={{ padding: 20 }}>
      <Stack gap={8}>
        <Text fz={20} fw={600} c="var(--prune-text-gray-700)">
          User Management
        </Text>
        <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
          Create Roles and permissions that will be assigned to team members
          that are invited.
        </Text>
      </Stack>

      <TabsComponent
        tabs={tabs}
        tt="capitalize"
        mt={38}
        styles={{ list: { marginBottom: "30px" } }}
        keepMounted={false}
      >
        <TabsPanel value={tabs[0].value}>
          <TabsComponent
            tabs={roleTabs}
            tt="capitalize"
            styles={{ list: { border: "none" } }}
          >
            <TabsPanel value={roleTabs[0].value}>
              <ActiveRoles />
            </TabsPanel>
            <TabsPanel value={roleTabs[1].value}>
              <DeactivatedRoles />
            </TabsPanel>
          </TabsComponent>
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <TabsComponent
            tabs={userTabs}
            tt="capitalize"
            styles={{ list: { border: "none" } }}
          >
            <TabsPanel value={userTabs[0].value}>
              <ActiveUsers />
            </TabsPanel>
            <TabsPanel value={userTabs[1].value}>
              <ActiveUsers />
            </TabsPanel>
          </TabsComponent>
        </TabsPanel>
      </TabsComponent>
    </main>
  );
}

export default function UsersSuspense() {
  return (
    <Suspense>
      <Users />
    </Suspense>
  );
}

const tabs = [
  {
    title: "Roles & Permissions",
    value: "roles",
    icon: <IconUsers size={15} />,
  },
  { title: "Team Members", value: "users", icon: <IconBriefcase size={15} /> },
];

const userTabs = [
  {
    value: "Active Members",
  },
  { value: "Deactivated Members" },
];

const roleTabs = [
  {
    value: "Active Roles",
  },
  { value: "Deactivated Roles" },
];
