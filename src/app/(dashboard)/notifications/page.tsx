"use client";

import { useUserNotifications } from "@/lib/hooks/notifications";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { NotificationRow } from "@/ui/components/NotificationRow";
import PaginationComponent from "@/ui/components/Pagination";
import TabsComponent from "@/ui/components/Tabs";
import { Box, Center, Flex, TabsPanel, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarMonth, IconChecks } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { AllNotification } from "./(tabs)/All";
import { UnreadNotification } from "./(tabs)/Unread";
import { ReadNotification } from "./(tabs)/Read";
import axios from "axios";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

export default function UserNotification() {
  const [processing, setProcessing] = useState(false);

  const { handleSuccess, handleError } = useNotification();

  const markAllNotificationAsRead = async () => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/mark-all-as-read`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess(
        "Mark All Notifications",
        "All notifications marked as read successfully"
      );
    } catch (error) {
      handleError(
        "An error occurred while marking all notifications as read",
        parseError(error)
      );
    } finally {
      setProcessing(false);
    }
  };

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
            loading={processing}
            action={markAllNotificationAsRead}
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
          <AllNotification />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <UnreadNotification />
        </TabsPanel>
        <TabsPanel value={tabs[2].value}>
          <ReadNotification />
        </TabsPanel>
      </TabsComponent>
    </main>
  );
}

const tabs = [{ value: "All" }, { value: "Unread" }, { value: "Read" }];
