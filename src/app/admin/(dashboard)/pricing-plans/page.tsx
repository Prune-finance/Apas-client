"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  Group,
  Paper,
  Title,
  Text,
  TableTr,
  TableTd,
  Menu,
  MenuTarget,
  UnstyledButton,
  MenuDropdown,
  MenuItem,
  rem,
  Drawer,
} from "@mantine/core";
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { TableComponent } from "@/ui/components/Table";
import { formatNumber } from "@/lib/utils";
import Plan from "@/lib/store/plan";
import PaginationComponent from "@/ui/components/Pagination";
import PlanDrawer from "./drawer";
import EmptyTable from "@/ui/components/EmptyTable";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { PricingPlan, usePricingPlan } from "@/lib/hooks/pricing-plan";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import { SearchInput } from "@/ui/components/Inputs";
import { useDebouncedValue } from "@mantine/hooks";
import { filteredSearch } from "@/lib/search";
import Link from "next/link";

export default function PricingPlans() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { pricingPlan, loading, meta } = usePricingPlan();

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
          <SearchInput search={search} setSearch={setSearch} />

          <PrimaryBtn
            text="Create New Plan"
            icon={IconPlus}
            link="/admin/pricing-plans/new"
          />
        </Group>

        <TableComponent
          head={tableHeaders}
          rows={
            <RowComponent plans={pricingPlan} searchValue={debouncedSearch} />
          }
          loading={loading}
        />

        <EmptyTable
          rows={pricingPlan}
          loading={loading}
          title="There are no pricing plans"
          text="When a pricing plan is created, it will appear here."
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />
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

const tableHeaders = [
  "Plan Name",
  "Cycle",
  "Amount",
  "Date Created",
  "Description",
  // "Features",
  "Action",
];

const RowComponent = ({
  plans,
  searchValue,
}: {
  plans: PricingPlan[];
  searchValue: string;
}) => {
  const { open, setData } = Plan();

  return filteredSearch(plans, ["name", "cost", "cycle"], searchValue).map(
    (plan) => (
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
        <TableTd>{formatNumber(plan.cost, true, "EUR")}</TableTd>
        <TableTd>{dayjs(plan.createdAt).format("Do MMM, YYYY")}</TableTd>
        <TableTd>
          <Text fz={12} lineClamp={1}>
            {plan.description ? plan.description : "-"}
          </Text>
        </TableTd>
        {/* <TableTd>
          {plan.features.length ? plan.features.join(", ") : "-"}
        </TableTd> */}
        <TableTd onClick={(e) => e.stopPropagation()}>
          <MenuComponent id={plan.id.toString()} />
        </TableTd>
      </TableTr>
    )
  );
};

const MenuComponent = ({ id }: { id: string }) => {
  const menuItems = {
    edit: <IconEdit style={{ width: rem(14), height: rem(14) }} />,
    duplicate: <IconCopy style={{ width: rem(14), height: rem(14) }} />,
  };

  return (
    <Menu shadow="md" width={150}>
      <MenuTarget>
        <UnstyledButton>
          <IconDotsVertical size={17} />
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        {Object.entries(menuItems).map(([key, item]) => (
          <MenuItem
            key={key}
            component={Link}
            href={`/admin/pricing-plans/${id}/${key}`}
            fz={10}
            c="#667085"
            tt="capitalize"
            leftSection={item}
          >
            {key}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
};
