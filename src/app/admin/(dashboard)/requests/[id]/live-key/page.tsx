"use client";

import { getInitials } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import styles from "@/ui/styles/accounts.module.scss";
import {
  Avatar,
  Divider,
  Group,
  Select,
  SimpleGrid,
  Stack,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useParams } from "next/navigation";
import classes from "@/ui/styles/containedInput.module.css";
import { SearchInput } from "@/ui/components/Inputs";
import { filteredSearch } from "@/lib/search";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../../businesses/schema";
import { IconCheck, IconListTree, IconX } from "@tabler/icons-react";
import useNotification from "@/lib/hooks/notification";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import PaginationComponent from "@/ui/components/Pagination";
import ModalComponent from "@/ui/components/Modal";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import Cookies from "js-cookie";

export default function SingleLiveKey() {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [limit, setLimit] = useState<string | null>("10");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { handleError, handleSuccess } = useNotification();
  const [opened, { toggle }] = useDisclosure(false);
  const [openedApprove, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [openedReject, { open: openReject, close: closeReject }] =
    useDisclosure(false);

  //   const { loading, requests, revalidate, meta } = useSingleLiveKeyRequest(id);

  //   const rows = filteredSearch(requests, ["Company.name"], debouncedSearch).map(
  //     (element, index) => (
  //       <TableTr
  //         key={index}
  //         onClick={() => handleRowClick(element.id)}
  //         style={{ cursor: "pointer" }}
  //       >
  //         <TableTd>{element.Company.name}</TableTd>
  //         <TableTd>{dayjs(element.date).format("Do MMM, YYYY")}</TableTd>
  //         <TableTd>{dayjs(element.createdAt).format("Do MMM, YYYY")}</TableTd>

  //         <TableTd>
  //           <BadgeComponent status={element.status} />
  //         </TableTd>

  //         {/* <TableTd className={`${styles.table__td}`}>
  //           <MenuComponent request={element} />
  //         </TableTd> */}
  //       </TableTr>
  //     )
  //   );

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });
  const info = {
    Service: "Payout Service",
    "Go Live Date": dayjs().format("Do MMMM, YYYY"),
    "Request Date": dayjs().format("Do MMMM, YYYY"),
  };

  const completeRequest = async (type: "approve" | "reject") => {
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/keys/requests/${id}/${type}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      //    await revalidate();
      if (type === "approve") closeApprove();
      if (type === "reject") closeReject();

      handleSuccess(
        `Request ${type === "approve" ? "Approved" : "Rejected"}`,
        `This live key request has been ${
          type === "approve" ? "approved" : "rejected"
        } successfully.`
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Requests", href: "/admin/requests" },
          { title: "Live Keys", href: `/admin/requests/${id}live-key` },
        ]}
      />

      <Group justify="space-between" mt={28}>
        <Group>
          <Avatar color="var(--prune-primary-700)" variant="filled" size={39}>
            {getInitials("Emmanuel Okoye")}
          </Avatar>

          <Stack gap={0}>
            <Text>Emmanuel Okoye</Text>
            <Text fz={10} tt="lowercase">
              emmanuel.okoye@gmail.com
            </Text>
          </Stack>

          <BadgeComponent status="PENDING" />
        </Group>

        {!["PENDING"].includes("REJECTED") && (
          <Group>
            <SecondaryBtn text="Reject" fw={600} action={openReject} />
            <PrimaryBtn text="Approve" fw={600} action={openApprove} />
          </Group>
        )}
      </Group>

      <Group justify="space-between" w={{ base: "100%", md: "50%" }} mt={40}>
        {Object.entries(info).map(([title, value]) => (
          <Stack key={title} gap={2}>
            <Text fz={12} c="var(--prune-text-gray-400)">
              {title}:
            </Text>
            <Text fz={14} c="var(--prune-text-gray-800)" fw={600}>
              {value}
            </Text>
          </Stack>
        ))}
      </Group>

      <Divider my={23} />

      <Text fz={14} fw={700} tt="uppercase" mb={16}>
        SET DURATION FOR THE LIVE KEYs
      </Text>

      <Select
        mt="md"
        w={{ base: "100%", md: "50%" }}
        comboboxProps={{ withinPortal: true }}
        data={["1 Month", "6 Months", "1 Year", "No Expiry"]}
        placeholder="Select Duration"
        label="Duration"
        classNames={classes}
      />

      <Text tt="uppercase" mt={32} mb={20} fz={14} fw={700}>
        API HISTORY
      </Text>

      <Group justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>

      <Filter<BusinessFilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        isStatus={true}
      />

      <TableComponent head={tableHeaders} rows={[]} loading={false} />

      <EmptyTable
        rows={[]}
        loading={false}
        title="There are no api calls"
        text="When api calls are made, they will appear here"
      />

      <PaginationComponent
        total={0}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={openedReject}
        close={closeReject}
        action={() => completeRequest("reject")}
        processing={processing}
        title="Reject this Live Key Request?"
        text="This means you are rejecting the live key request of this business."
        customApproveMessage="Yes, Reject"
      />

      <ModalComponent
        opened={openedApprove}
        close={closeApprove}
        title="Approve this Live Key Request?"
        text="This means you are approving the live key request for the business."
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        processing={processing}
        action={() => completeRequest("approve")}
        customApproveMessage="Yes, Approve"
      />
    </main>
  );
}

const tableHeaders = ["API Calls", "Date & Time"];
