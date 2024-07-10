"use client";

import localFont from "next/font/local";
import Image from "next/image";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  UnstyledButton,
  rem,
  Text,
  Drawer,
  Flex,
  Box,
  Divider,
  Button,
  TextInput,
  TableScrollContainer,
  Table,
  TableTh,
  TableThead,
  TableTr,
  Pagination,
  Tabs,
  TabsList,
  TabsTab,
} from "@mantine/core";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";
import {
  IconPointFilled,
  IconDots,
  IconEye,
  IconTrash,
  IconX,
  IconCheck,
  IconSearch,
  IconListTree,
  IconBuildingSkyscraper,
  IconCurrencyEuro,
  IconFiles,
  IconKey,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import EmptyImage from "@/assets/empty.png";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton } from "@/lib/static";
import { useBusiness } from "@/lib/hooks/businesses";

const switzer = localFont({
  src: "../../../../assets/fonts/Switzer-Regular.woff2",
});

export default function DebitRequests() {
  const { loading, businesses } = useBusiness();
  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

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

  const rows: any[] = [];

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Debit Requests", href: "/admin/accounts" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            All Requests
          </Text>
        </div>

        <Tabs
          defaultValue="Business"
          variant="pills"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
        >
          <TabsList>
            <TabsTab
              value="Business"
              leftSection={<IconBuildingSkyscraper size={14} />}
            >
              Business Information
            </TabsTab>
            <TabsTab value="Documents" leftSection={<IconFiles size={14} />}>
              Documents
            </TabsTab>
            <TabsTab value="Directors" leftSection={<IconUsers size={14} />}>
              Directors
            </TabsTab>
            <TabsTab
              value="Shareholders"
              leftSection={<IconUsersGroup size={14} />}
            >
              Key Shareholders
            </TabsTab>
            <TabsTab
              value="Accounts"
              leftSection={<IconCurrencyEuro size={14} />}
            >
              Accounts
            </TabsTab>
            <TabsTab
              className={styles.tab}
              value="Keys"
              leftSection={<IconKey size={14} />}
            >
              API Keys
            </TabsTab>
          </TabsList>
        </Tabs>

        <div
          className={`${styles.container__search__filter} ${switzer.className}`}
        >
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            classNames={{ wrapper: styles.search, input: styles.input__search }}
          />

          <Button
            className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
          >
            <Text fz={12} fw={500}>
              Filter
            </Text>
          </Button>
        </div>

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>S/N</TableTh>
                <TableTh className={styles.table__th}>Business Name</TableTh>
                <TableTh className={styles.table__th}>Amount</TableTh>
                <TableTh className={styles.table__th}>Source Account</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                <TableTh className={styles.table__th}>Action</TableTh>
              </TableTr>
            </TableThead>
            {/* <TableTbody>{loading ? AllBusinessSkeleton : rows}</TableTbody> */}
          </Table>
        </TableScrollContainer>

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no debit requests.
            </Text>
            <Text fz={10} c="#667085">
              When a business is created, it will appear here
            </Text>
          </Flex>
        )}

        <div className={styles.pagination__container}>
          <Text fz={14}>Rows: {businesses.length}</Text>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>
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

          <Flex mt={40} justify="flex-end" gap={10}>
            <Button
              onClick={open}
              color="#D0D5DD"
              variant="outline"
              className={styles.cta}
            >
              Deny
            </Button>

            <Button
              className={styles.cta}
              onClick={openApprove}
              variant="filled"
              color="#D4F307"
            >
              Approve
            </Button>
          </Flex>
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
