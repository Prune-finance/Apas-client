"use client";

import { NotificationStore } from "@/lib/store/notification";
import { Notifications } from "@mantine/notifications";

export const NotificationProvider = () => {
  const { position, limit } = NotificationStore();
  return (
    <>
      <Notifications limit={limit} position={position} />
    </>
  );
};
