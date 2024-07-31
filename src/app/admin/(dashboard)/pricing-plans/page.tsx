"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  Button,
  Group,
  Paper,
  TextInput,
  Title,
  Text,
  Flex,
  TableTr,
  TableTd,
  Menu,
  MenuTarget,
  UnstyledButton,
  MenuDropdown,
  MenuItem,
  rem,
  Select,
  Pagination,
  Drawer,
} from "@mantine/core";
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import EmptyImage from "@/assets/empty.png";
import Image from "next/image";
import { TableComponent } from "@/ui/components/Table";
import { formatNumber } from "@/lib/utils";
import Plan from "@/lib/store/plan";
import styles from "@/ui/styles/accounts.module.scss";
import PaginationComponent from "@/ui/components/Pagination";
import PlanDrawer from "./drawer";

export type Plan = (typeof _plans)[0];
export default function PricingPlans() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [plans, setPlans] = useState<Plan[]>(_plans);

  const { opened, data, close } = Plan();

  return (
    <main>
      <Breadcrumbs
        items={[{ title: "Pricing Plan", href: "/admin/pricing-plans" }]}
      />

      <Paper px={28} py={32} mt={16} radius="xs">
        <Title order={1} fz={24} fw={500}>
          Pricing Plans
        </Title>

        <Group justify="space-between" mt={32} mb={28}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={<IconSearch size={20} />}
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            value={search}
            w={324}
            styles={{ input: { border: "1px solid #F5F5F5" } }}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <Button
            color="var(--prune-primary-600)"
            c="var(--prune-text-gray-800)"
            fz={12}
            fw={500}
            leftSection={<IconPlus size={14} />}
            component={Link}
            href={`/admin/pricing-plans/new`}
          >
            Create New Plan
          </Button>
        </Group>

        <TableComponent
          head={tableHeaders}
          rows={<RowComponent plans={plans} />}
          loading={loading}
        />

        {!loading && !!!plans.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no accounts.
            </Text>
            <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text>
          </Flex>
        )}

        <PaginationComponent />
      </Paper>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={
          <Text fz={20} fw={500} pl={20}>
            Plan Details
          </Text>
        }
        padding={0}
        closeButtonProps={{ mr: 20 }}
      >
        <PlanDrawer data={data} />
      </Drawer>
    </main>
  );
}

const tableHeaders = ["Plan Name", "Cycle", "Amount", "Description", "Action"];

const _plans = [
  {
    name: "Basic",
    cycle: "Monthly",
    amount: 5000,
    description: "This is the basic plan",
    id: 1,
  },
  {
    name: "Pro",
    cycle: "Monthly",
    amount: 10000,
    description: "This is the pro plan",
    id: 2,
  },
  {
    name: "Enterprise",
    cycle: "Monthly",
    amount: 20000,
    description: "This is the enterprise plan",
    id: 3,
  },
  {
    name: "Basic",
    cycle: "Yearly",
    amount: 50000,
    description: "This is the basic plan",
    id: 4,
  },
  {
    name: "Pro",
    cycle: "Yearly",
    amount: 100000,
    description: "This is the pro plan",
    id: 5,
  },
  {
    name: "Enterprise",
    cycle: "Yearly",
    amount: 200000,
    description: "This is the enterprise plan",
    id: 6,
  },
];

const RowComponent = ({ plans }: { plans: typeof _plans }) => {
  const { open, setData } = Plan();

  return plans.map((plan) => (
    <TableTr
      key={plan.id}
      onClick={() => {
        setData(plan);
        open();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{plan.name}</TableTd>
      <TableTd>{plan.cycle}</TableTd>
      <TableTd>{formatNumber(plan.amount)}</TableTd>
      <TableTd>{plan.description}</TableTd>
      <TableTd onClick={(e) => e.stopPropagation()}>
        <MenuComponent id={plan.id.toString()} />
      </TableTd>
    </TableTr>
  ));
};

const MenuComponent = ({ id }: { id: string }) => {
  return (
    <Menu shadow="md" width={150}>
      <MenuTarget>
        <UnstyledButton>
          <IconDotsVertical size={17} />
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        {/* <Link href={`/admin/accounts/${id}`}>
          <MenuItem
            fz={10}
            c="#667085"
            leftSection={
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            }
          >
            View
          </MenuItem>
        </Link> */}

        <MenuItem
          //   onClick={() => {
          //     setRowId(id);
          //     if (status === "FROZEN") return unfreezeOpen();
          //     freezeOpen();
          //   }}
          fz={10}
          c="#667085"
          leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
        >
          Edit
        </MenuItem>

        <MenuItem
          // onClick={() => {
          //   setRowId(id);
          //   if (status === "INACTIVE") return activateOpen();
          //   open();
          // }}
          fz={10}
          c="#667085"
          leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
        >
          Duplicate
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};
