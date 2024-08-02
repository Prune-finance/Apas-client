import { Group, Text, Pagination, Select } from "@mantine/core";
import styles from "./pagination.module.scss";
import { Dispatch, SetStateAction } from "react";

type Props = {
  total: number;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<string | null>>;
  limit: string | null;
};

export default function PaginationComponent({
  total,
  limit,
  setActive,
  setLimit,
  active,
}: Props) {
  return (
    <div className={styles.pagination__container}>
      <Group gap={9}>
        <Text fz={14}>Showing:</Text>

        <Select
          data={["2", "10", "20", "50", "100"]}
          defaultValue={"10"}
          allowDeselect={false}
          w={60}
          // h={24}
          size="xs"
          withCheckIcon={false}
          value={limit}
          onChange={(value) => {
            setActive(1);
            setLimit(value);
          }}
        />
      </Group>
      <Pagination
        autoContrast
        color="#fff"
        total={total}
        classNames={{ control: styles.control, root: styles.pagination }}
        value={active}
        onChange={(value) => setActive(value)}
      />
    </div>
  );
}
