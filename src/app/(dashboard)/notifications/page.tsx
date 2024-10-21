"use client";

import { notifications } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { NotificationRow } from "@/ui/components/NotificationRow";
import TabsComponent from "@/ui/components/Tabs";
import { Flex, TabsPanel, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarMonth, IconChecks } from "@tabler/icons-react";

export default function UserNotification() {
  return (
    <main>
      <Flex justify="space-between">
        <Title fz={20} c="var(--prune-text-gray-700)" order={3}>
          Notifications
        </Title>

        <Flex gap={8} wrap="nowrap">
          <DatePickerInput
            placeholder="Date Range"
            valueFormat="YYYY-MM-DD"
            // {...form.getInputProps("createdAt")}
            size="xs"
            maw={250}
            styles={{ input: { height: "35px" } }}
            type="range"
            allowSingleDateInRange
            leftSection={<IconCalendarMonth size={12} />}
            numberOfColumns={2}
            clearable
          />

          <SecondaryBtn
            text="Mark all as read"
            icon={IconChecks}
            // fullWidth
            // action={() => setOpened(false)}
          />
        </Flex>
      </Flex>

      <TabsComponent
        tabs={tabs}
        tt="capitalize"
        mt={37}
        styles={{
          list: { marginBottom: "24px" },
        }}
      >
        <TabsPanel value={tabs[0].value}>
          {notifications.map((notification, index, arr) => (
            <NotificationRow
              {...notification}
              lastRow={arr.length - 1 === index}
              key={index}
            />
          ))}
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          {notifications
            .filter((n) => n.status === "unread")
            .map((notification, index, arr) => (
              <NotificationRow
                {...notification}
                lastRow={arr.length - 1 === index}
                key={index}
              />
            ))}
        </TabsPanel>
        <TabsPanel value={tabs[2].value}>
          {notifications
            .filter((n) => n.status === "read")
            .map((notification, index, arr) => (
              <NotificationRow
                {...notification}
                lastRow={arr.length - 1 === index}
                key={index}
              />
            ))}
        </TabsPanel>
      </TabsComponent>
    </main>
  );
}

const tabs = [{ value: "All" }, { value: "Unread" }, { value: "Read" }];
