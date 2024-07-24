import { Fragment } from "react";

import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";

import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";

import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Select,
  TableTbody,
  TableTd,
} from "@mantine/core";
import { Flex, Box, Divider, Button, TextInput } from "@mantine/core";
import { UnstyledButton, rem, Text, Drawer } from "@mantine/core";
import { Table, TableTh, TableThead } from "@mantine/core";
import { TableTr, Pagination, TableScrollContainer } from "@mantine/core";

import { IconDots, IconEye } from "@tabler/icons-react";
import { IconX, IconCheck, IconSearch } from "@tabler/icons-react";
import { IconPointFilled } from "@tabler/icons-react";
import { IconListTree } from "@tabler/icons-react";

import ModalComponent from "@/ui/components/Modal";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";

import EmptyImage from "@/assets/empty.png";

import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton, DynamicSkeleton } from "@/lib/static";
import { DebitRequest, useDebitRequests } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useForm, zodResolver } from "@mantine/form";
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../businesses/schema";
import Filter from "@/ui/components/Filter";
import { DateInput } from "@mantine/dates";
import { useSearchParams } from "next/navigation";

export default function Debit() {
  const searchParams = useSearchParams();

  const {
    rows: limit = "10",
    status,
    createdAt,
    sort,
  } = Object.fromEntries(searchParams.entries());
  const { handleError, handleSuccess } = useNotification();
  const { loading, requests, revalidate } = useDebitRequests({
    ...(isNaN(Number(limit)) ? { limit: 10 } : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
  });
  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/reject`,
        {},
        { withCredentials: true }
      );

      await revalidate();
      close();
      closeDrawer();
      handleSuccess("Action Completed", "Request Denied");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/approve`,
        {},
        { withCredentials: true }
      );

      await revalidate();
      closeApprove();
      closeDrawer();
      handleSuccess("Action Completed", "Request Approved");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const MenuComponent = ({ request }: { request: DebitRequest }) => {
    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <MenuItem
            onClick={() => {
              setSelectedRequest(request);
              openDrawer();
            }}
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
        </MenuDropdown>
      </Menu>
    );
  };

  const rows = requests.map((element, index) => (
    <TableTr key={index}>
      <TableTd className={styles.table__td}>{index + 1}</TableTd>
      <TableTd className={styles.table__td}>
        {element.Account.Company.name}
      </TableTd>
      <TableTd className={styles.table__td}>{element.amount}</TableTd>
      <TableTd className={styles.table__td}>
        {element.Account.accountNumber}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <div
          className={styles.table__td__status}
          style={{
            background:
              element.status === "PENDING"
                ? "#FFFAEB"
                : element.status === "REJECTED"
                ? "#FCF1F2"
                : "#ECFDF3",
          }}
        >
          <IconPointFilled
            size={14}
            color={
              element.status === "PENDING"
                ? "#C6A700"
                : element.status === "REJECTED"
                ? "#D92D20"
                : "#12B76A"
            }
          />
          <Text
            tt="capitalize"
            fz={12}
            c={
              element.status === "PENDING"
                ? "#C6A700"
                : element.status === "REJECTED"
                ? "#D92D20"
                : "#12B76A"
            }
          >
            {element.status.toLowerCase()}
          </Text>
        </div>
      </TableTd>

      <TableTd className={`${styles.table__td}`}>
        <MenuComponent request={element} />
      </TableTd>
    </TableTr>
  ));

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  return (
    <Fragment>
      <div className={`${styles.container__search__filter}`}>
        <TextInput
          placeholder="Search here..."
          leftSectionPointerEvents="none"
          leftSection={searchIcon}
          classNames={{ wrapper: styles.search, input: styles.input__search }}
        />

        <Button
          className={styles.filter__cta}
          rightSection={<IconListTree size={14} />}
          fz={12}
          fw={500}
          onClick={toggle}
        >
          Filter
        </Button>
      </div>

      <Filter<BusinessFilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
      />

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
          <TableTbody>{loading ? DynamicSkeleton(1) : rows}</TableTbody>
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
        <Text fz={14}>Rows: {requests.length}</Text>
        <Pagination
          autoContrast
          color="#fff"
          total={1}
          classNames={{ control: styles.control, root: styles.pagination }}
        />
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
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Flex>

          <Divider my={30} />

          <Flex direction="column" gap={30}>
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Business Name:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.Company.name}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Source Account:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.accountName}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Date Created:
              </Text>

              <Text fz={14}>
                {dayjs(selectedRequest?.createdAt).format("DD MMM, YYYY")}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Status:
              </Text>

              <Text fz={14}>{selectedRequest?.status}</Text>
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
              {selectedRequest?.reason || ""}
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
        action={handleRejectRequest}
        processing={processing}
        title="Deny This Debit Request?"
        text="This means you are rejecting the debit request of this business."
        customApproveMessage="Yes, Deny It"
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={approveOpened}
        close={closeApprove}
        action={handleAcceptRequest}
        processing={processing}
        title="Approve This Debit Request?"
        text="This means you are accepting the debit request of this business"
        customApproveMessage="Yes, Approve It"
      />
    </Fragment>
  );
}
