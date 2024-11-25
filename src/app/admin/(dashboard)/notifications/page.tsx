"use client";

import { SecondaryBtn } from "@/ui/components/Buttons";
import TabsComponent from "@/ui/components/Tabs";
import { Flex, TabsPanel, Title } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { IconCalendarMonth, IconChecks } from "@tabler/icons-react";
import { useState } from "react";
import { AllNotification } from "./(tabs)/All";
import { UnreadNotification } from "./(tabs)/Unread";
import { ReadNotification } from "./(tabs)/Read";
import axios from "axios";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useDebouncedValue } from "@mantine/hooks";

export default function AdminNotification() {
  const [processing, setProcessing] = useState(false);

  const initialDateRange: [Date | null, Date | null] = [null, null];
  const [dateRange, setDateRange] = useState<DatesRangeValue>(initialDateRange);
  const [debouncedDateRange] = useDebouncedValue(dateRange, 1000);

  const { handleSuccess, handleError } = useNotification();

  const markAllNotificationAsRead = async () => {
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/notifications/mark-all-as-read`,
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
            value={dateRange}
            onChange={(value) => setDateRange(value)}
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
        onChange={(value) => setDateRange(initialDateRange)}
        tt="capitalize"
        keepMounted={false}
        mt={37}
        styles={{
          list: { marginBottom: "24px" },
        }}
      >
        <TabsPanel value={tabs[0].value}>
          <AllNotification
            date={debouncedDateRange[0]}
            endDate={debouncedDateRange[1]}
          />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <UnreadNotification
            date={debouncedDateRange[0]}
            endDate={debouncedDateRange[1]}
          />
        </TabsPanel>
        <TabsPanel value={tabs[2].value}>
          <ReadNotification
            date={debouncedDateRange[0]}
            endDate={debouncedDateRange[1]}
          />
        </TabsPanel>
      </TabsComponent>
    </main>
  );
}

const tabs = [{ value: "All" }, { value: "Unread" }, { value: "Read" }];
