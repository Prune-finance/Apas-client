"use client";

import localFont from "next/font/local";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Paper,
  Title,
  UnstyledButton,
  rem,
  Text,
  Pagination,
  Drawer,
  Flex,
  Box,
  Stack,
  Divider,
  Button,
} from "@mantine/core";
import { AgGridReact } from "ag-grid-react";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";
import {
  IconPointFilled,
  IconDots,
  IconEye,
  IconTrash,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { formatNumber } from "@/lib/utils";

const switzer = localFont({
  src: "../../../assets/fonts/Switzer-Regular.woff2",
});

export default function DebitRequests() {
  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const CustomButtonComponent = (props: any) => {
    return (
      <div className={styles.table__td__container}>
        <div className={styles.table__td__status}>
          <IconPointFilled size={14} color="#12B76A" />
          <Text tt="capitalize" fz={12} c="#12B76A">
            {props.value}
          </Text>
        </div>
      </div>
    );
  };

  const MenuComponent = (props: any) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <MenuItem
            onClick={openDrawer}
            fz={10}
            c="#667085"
            leftSection={
              <IconEye
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            View
          </MenuItem>

          <MenuItem
            onClick={open}
            fz={10}
            c="#667085"
            leftSection={
              <IconTrash
                color="#667085"
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Delete
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  const rowData = [
    {
      "BUSINESS NAME": "C80 Limited",
      AMOUNT: "24000000",
      // "ACCOUNT BALANCE": 64950,
      "SOURCE ACCOUNT": "Sandra Chijioke",
      "DATE CREATED": "25th May,2024",
      STATUS: "Active",
      ACTION: "",
    },
    {
      "BUSINESS NAME": "TechNexus",
      AMOUNT: "54000000",
      // "ACCOUNT BALANCE": 8377250,
      "SOURCE ACCOUNT": "Grace Whitman",
      "DATE CREATED": "25th May,2024",
      STATUS: "Active",
      ACTION: "",
    },
    {
      "BUSINESS NAME": "Digital Horizons",
      AMOUNT: "400000",
      // "ACCOUNT BALANCE": 977250,
      "SOURCE ACCOUNT": "Sophia Blake",
      "DATE CREATED": "25th May,2024",
      STATUS: "Active",
      ACTION: "",
    },
    {
      "BUSINESS NAME": "NanoSphere ",
      AMOUNT: "22000000",
      // "ACCOUNT BALANCE": 977250,
      "SOURCE ACCOUNT": "Ethan Hayes",
      "DATE CREATED": "25th May,2024",
      STATUS: "Active",
      ACTION: "",
    },
    {
      "BUSINESS NAME": "NexGen",
      AMOUNT: "14000000",
      // "ACCOUNT BALANCE": 977250,
      "SOURCE ACCOUNT": "Liam Donovan",
      "DATE CREATED": "25th May,2024",
      STATUS: "Active",
      ACTION: "",
    },
    {
      "BUSINESS NAME": "DataStream",
      AMOUNT: "5000000",
      // "ACCOUNT BALANCE": 8377250,
      "SOURCE ACCOUNT": "Chloe Ramsey",
      "DATE CREATED": "25th May,2024",
      STATUS: "Active",
      ACTION: "",
    },
  ];

  const colDefs = [
    {
      field: "BUSINESS NAME",
      filter: true,
      floatingFilter: true,
      checkboxSelection: true,
      flex: 2,
    },
    {
      field: "AMOUNT",
      filter: true,
      floatingFilter: true,
      cellStyle: { color: "#667085" },
    },
    {
      field: "SOURCE ACCOUNT",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "DATE CREATED",
      filter: true,
      floatingFilter: true,
      cellStyle: { color: "#667085" },
    },
    {
      field: "STATUS",
      cellRenderer: CustomButtonComponent,
    },
    {
      field: "ACTION",
      cellRenderer: MenuComponent,
    },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Debit Requests", href: "/debit-requests" },
        ]}
      />

      <div className={styles.table__container}>
        <Paper withBorder py={24}>
          <Title mx={28} fz={18} fw={500}>
            Debit Requests
          </Title>

          <div
            className={`${switzer.className} ${styles.accounts___container} ag-theme-quartz`}
            style={{ height: 500 }}
          >
            <AgGridReact
              rowData={rowData}
              // @ts-ignore
              columnDefs={colDefs}
            />
          </div>

          <div className={styles.pagination__container}>
            <Text fz={14}>Rows: 5</Text>
            <Pagination
              autoContrast
              color="#fff"
              total={2}
              classNames={{ control: styles.control, root: styles.pagination }}
            />
          </div>
        </Paper>
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        withCloseButton={false}
        size="30%"
      >
        <Flex justify="space-between" pb={28}>
          <Text fz={18} fw={600} c="#1D2939">
            Request Details
          </Text>

          <IconX onClick={closeDrawer} />
        </Flex>

        <Box>
          <Flex direction="column">
            <Text c="#8B8B8B" fz={12} tt="uppercase">
              Amount
            </Text>

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(930000)}
            </Text>
          </Flex>

          <Divider my={30} />

          <Flex direction="column" gap={30}>
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Business Name:
              </Text>

              <Text fz={14}>C80 Limited</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Source Account:
              </Text>

              <Text fz={14}>Sandra Chijioke</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Date Created:
              </Text>

              <Text fz={14}>24th May, 2024</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Status:
              </Text>

              <Text fz={14}>Pending</Text>
            </Flex>
          </Flex>

          <Divider my={30} />

          <Text fz={12} c="#1D2939" fw={600}>
            REASON FOR DEBIT
          </Text>

          <div
            style={{
              marginTop: "15px",
              background: "#F9F9F9",
              padding: "12px 16px",
            }}
          >
            <Text fz={12} c="#667085">
              The reason for this debit is to acquire more properties for the
              enhancement of the business.
            </Text>
          </div>
        </Box>
      </Drawer>

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={opened}
        close={close}
        title="Deny This Debit Request?"
        text="This means you are rejecting the debit request of this business."
        customApproveMessage="Yes, Deny It"
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={approveOpened}
        close={closeApprove}
        title="Approve This Debit Request?"
        text="This means you are accepting the debit request of this business"
        customApproveMessage="Yes, Approve It"
      />
    </main>
  );
}
