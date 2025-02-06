"use client";
import React, { Suspense, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Flex,
  Grid,
  GridCol,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import styles from "../styles.module.scss";
import Breadcrumbs from "@/ui/components/Breadcrumbs";

function New() {
  const [rolesState, setRolesState] = useState<string | null>("");

  const items = roles.map((item) => (
    <Accordion.Item key={item.title} value={item.title}>
      <Accordion.Control>
        <Text
          fz={14}
          c={item?.title === rolesState ? "#1D2939" : "#667085"}
          fw={item?.title === rolesState ? 500 : 400}
        >
          {item.title}
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
            <SimpleGrid cols={3} spacing={33} p={0}>
              {item?.switch.map((item, index) => (
                <Switch
                  key={index}
                  defaultChecked
                  color="var(--prune-primary-700)"
                  label={
                    <Text fz={12} c="#475467" fw={500}>
                      {item.label}
                    </Text>
                  }
                  description={
                    <Text fz={12} c="#98A2B3" fw={400}>
                      {item.description}
                    </Text>
                  }
                  fz={12}
                  size="sm"
                />
              ))}
            </SimpleGrid>
          </GridCol>
        </Grid>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "roles & Permission", href: "/roles" },

          {
            title: "Create new role",
            href: `/roles/new`,
          },
        ]}
      />

      <Box mt={20} className={styles.container__header}>
        <Text fz={18} fw={600}>
          Create New Role
        </Text>
      </Box>

      <Box mt={20} className={styles.container__body}>
        <TextInput
          placeholder="Role Name"
          size="lg"
          styles={{ input: { border: "1px solid #F5F5F5" } }}
        />

        <Box mt={40} mb={28}>
          <Text fz={16} fw={600}>
            Set Permissions
          </Text>
          <Text fz={12} fw={400} c="#98A2B3">
            Select activities this new user role can perform in all pages.
          </Text>
        </Box>

        <Accordion
          defaultValue="Account Management"
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

        <Flex mt={40} justify="flex-end" gap={15}>
          <Button
            // onClick={() => {
            //   form.reset();
            // }}

            color="#D0D5DD"
            c="#344054"
            fz={12}
            variant="outline"
            className={styles.cta}
          >
            Cancel
          </Button>

          <Button
            // onClick={createDebitRequest}
            // loading={processing}
            className={styles.cta}
            variant="filled"
            fz={12}
            c="#344054"
            color="#D4F307"
          >
            Create Role
          </Button>
        </Flex>
      </Box>
    </main>
  );
}

const roles = [
  {
    title: "Account Management",
    switch: [
      {
        label: "Send Money",
        description:
          "Allows the user to initiate transactions to transfer money to their own or other accounts.",
      },
      {
        label: "Initiate Debit Request",
        description:
          "Enables the user to create a request to debit an issued account.",
      },
      {
        label: "Debit Issued Account",
        description:
          "Grants the ability to directly debit funds from an issued account.",
      },
      {
        label: "Activate Account",
        description:
          "Allows the user to activate a previously inactive or new account.",
      },
      {
        label: "Deactivate Account",
        description:
          "Enables the user to deactivate an account, restricting its use.",
      },
      {
        label: "Freeze Account",
        description:
          "Allows the user to temporarily suspend an account's activities.",
      },
      {
        label: "Unfreeze Account",
        description:
          "Grants permission to restore a frozen account to active status.",
      },
    ],
  },
  {
    title: "Debit Requests",
    switch: [
      {
        label: "Create New Request",
        description:
          "Enables the user to create a new debit request for processing.",
      },
      {
        label: "Cancel Debit Request",
        description:
          "Allows the user to cancel a previously submitted debit request.",
      },
      {
        label: "Resubmit Debit Request",
        description:
          "Enables the user to modify and resubmit a rejected or incomplete debit request..",
      },
    ],
  },
  {
    title: "Payout Management",
    switch: [
      {
        label: "Request Live Keys",
        description:
          "Grants permission to request live API keys for payout accounts.",
      },
      {
        label: "View Live Keys",
        description:
          "Allows the user to view live API keys associated with payout accounts.",
      },
    ],
  },

  {
    title: "Payout - Inquiry",
    switch: [
      {
        label: "Close Ticket",
        description:
          "Enables the user to close an inquiry ticket once the issue has been resolved.",
      },
      {
        label: "Reopen Ticket",
        description:
          "Allows the user to reopen a previously closed inquiry ticket for further action.",
      },
    ],
  },

  {
    title: "Transaction Tracking",
    switch: [
      {
        label: "Query Transaction",
        description:
          "Enables the user to search for and view details of specific transactions.",
      },
      {
        label: "Trace Transaction",
        description:
          "Allows the user to track the progress or status of a transaction.",
      },
      {
        label: "Recall Transaction",
        description:
          "Grants the ability to recall or reverse a transaction that has already been initiated.",
      },
    ],
  },

  {
    title: "User Management",
    switch: [
      {
        label: "Invite New User",
        description:
          "Enables the user to send invitations to onboard new users to the platform.",
      },
      {
        label: "Deactivate User",
        description:
          "Allows the user to deactivate another user's account, removing their access.",
      },
    ],
  },

  {
    title: "Settings",
    switch: [
      {
        label: "Reset API Keys",
        description:
          "Grants permission to reset API keys for security or troubleshooting purposes.",
      },
      {
        label: "Edit Webhooks",
        description:
          "Allows the user to modify webhook URLs and settings for system integrations.",
      },
    ],
  },
];

export default function RolesSuspense() {
  return (
    <Suspense>
      <New />
    </Suspense>
  );
}
