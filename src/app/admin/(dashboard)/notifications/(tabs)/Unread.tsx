import { useAdminNotifications } from "@/lib/hooks/notifications";
import EmptyTable from "@/ui/components/EmptyTable";
import { NotificationRow } from "@/ui/components/NotificationRow";
import PaginationComponent from "@/ui/components/Pagination";
import { Center, Box, ScrollArea, Loader } from "@mantine/core";
import dayjs from "dayjs";
import React, { Fragment, useState } from "react";

interface Props {
  date: Date | null;
  endDate: Date | null;
}

export const UnreadNotification = ({ date, endDate }: Props) => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const { loading, notifications, meta, revalidate } = useAdminNotifications({
    page: active,
    limit: parseInt(limit ?? "10", 10),
    status: "unread",
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
  });

  return (
    <>
      <ScrollArea h="calc(100vh - 307px)" pr={20}>
        {loading ? (
          <Center h="calc(100vh - 307px)">
            <Loader size={50} color="var(--prune-primary-600)" />
          </Center>
        ) : (
          <Fragment>
            {notifications.length > 0 ? (
              <Fragment>
                {notifications.map((notification, index, arr) => (
                  <NotificationRow
                    {...notification}
                    lastRow={arr.length - 1 === index}
                    key={index}
                    revalidate={revalidate}
                  />
                ))}
              </Fragment>
            ) : (
              <Center h="calc(100vh - 350px)">
                <EmptyTable
                  rows={notifications}
                  title="No unread notification yet"
                  text="When there is an unread notification, it will appear here"
                  loading={loading}
                />
              </Center>
            )}
          </Fragment>
        )}
      </ScrollArea>

      {notifications.length > 0 && (
        <PaginationComponent
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
        />
      )}
    </>
  );
};
