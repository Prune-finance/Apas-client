import {
  Box,
  Divider,
  Flex,
  Grid,
  GridCol,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import React from "react";

export default function Notifications() {
  const notifications = [
    {
      title: "Email Notifications",
      description:
        "Get  emails to find out what is going on when you are not online. You can turn this off whenever you want.",
      switch: [
        {
          label: "News and Update",
          description:
            "Get notified about products and features update on the app.",
        },
        {
          label: "Promotions",
          description: "Get notified about promotions and offers on the app.",
        },
        {
          label: "Account Activities",
          description:
            "Get notified about account activities like password reset, login, and more.",
        },
        {
          label: "Tips and Tutorials",
          description:
            "Get notified on tips on how to get the best out of the app.",
        },
      ],
    },
    {
      title: "Push Notifications",
      description:
        "Get push notifications to find out what is going on when you are not online. You can turn this off whenever you want.",
      switch: [
        {
          label: "News and Update",
          description:
            "Get notified about products and features update on the app.",
        },
        {
          label: "Promotions",
          description: "Get notified about promotions and offers on the app.",
        },
        {
          label: "Account Activities",
          description:
            "Get notified about account activities like password reset, login, and more.",
        },
        {
          label: "Tips and Tutorials",
          description:
            "Get notified on tips on how to get the best out of the app.",
        },
      ],
    },
  ];
  return (
    <Box mt={30} mih="calc(100vh - 290px)">
      {/* {notifications.map((notification) => ( */}
      <Grid gutter={33}>
        <GridCol span={4}>
          <Stack gap={4}>
            <Text fz={16} fw={600}>
              {notifications[0].title}
            </Text>

            <Text fz={12} fw={400} c="var(--prune-text-gray-500)" w="50ch">
              {notifications[0].description}
            </Text>
          </Stack>
        </GridCol>
        <GridCol span={8}>
          <SimpleGrid cols={2} spacing={33}>
            {notifications[0].switch.map((item, index) => (
              <Switch
                key={index}
                defaultChecked
                color="var(--prune-primary-700)"
                label={item.label}
                description={item.description}
                fz={12}
                //   fw={600}
                styles={{
                  label: { fontWeight: 600 },
                }}
              />
            ))}
          </SimpleGrid>
        </GridCol>
      </Grid>

      <Divider my={100} />

      <Grid gutter={33}>
        <GridCol span={4}>
          <Stack gap={4}>
            <Text fz={16} fw={600}>
              {notifications[1].title}
            </Text>

            <Text fz={12} fw={400} c="var(--prune-text-gray-500)" w="50ch">
              {notifications[1].description}
            </Text>
          </Stack>
        </GridCol>
        <GridCol span={8}>
          <SimpleGrid cols={2} spacing={33}>
            {notifications[1].switch.slice(0, 2).map((item, index) => (
              <Switch
                key={index}
                defaultChecked
                color="var(--prune-primary-700)"
                label={item.label}
                description={item.description}
                fz={12}
                //   fw={600}
                styles={{
                  label: { fontWeight: 600 },
                }}
              />
            ))}
          </SimpleGrid>
        </GridCol>
      </Grid>
      {/* ))} */}
    </Box>
  );
}
