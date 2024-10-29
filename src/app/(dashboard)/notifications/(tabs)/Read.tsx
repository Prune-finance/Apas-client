import { useUserNotifications } from "@/lib/hooks/notifications";
import EmptyTable from "@/ui/components/EmptyTable";
import { NotificationRow } from "@/ui/components/NotificationRow";
import PaginationComponent from "@/ui/components/Pagination";
import { Center, Box, ScrollArea } from "@mantine/core";
import React, { useState } from "react";

export const ReadNotification = () => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const { loading, notifications, meta, revalidate } = useUserNotifications({
    page: active,
    limit: parseInt(limit ?? "10", 10),
    status: "read",
  });

  return (
    <>
      <ScrollArea h="calc(100vh - 307px)" pr={20}>
        {notifications.map((notification, index, arr) => (
          <NotificationRow
            {...notification}
            lastRow={arr.length - 1 === index}
            key={index}
            business
            revalidate={revalidate}
          />
        ))}
      </ScrollArea>

      {notifications.length === 0 && (
        <Center h="calc(100vh - 350px)">
          <EmptyTable
            rows={notifications}
            title="No read notification yet"
            text="When there is a read notification, it will appear here"
            loading={loading}
          />
        </Center>
      )}

      {notifications.length > 0 && (
        <PaginationComponent
          total={meta?.page ?? 0}
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
        />
      )}
    </>
  );
};