import { Group, Text, Pagination, Select } from "@mantine/core";
import styles from "./pagination.module.scss";

export default function PaginationComponent() {
  return (
    <div className={styles.pagination__container}>
      <Group gap={9}>
        <Text fz={14}>Showing:</Text>

        <Select
          data={["10", "20", "50", "100"]}
          defaultValue={"10"}
          w={60}
          // h={24}
          size="xs"
          withCheckIcon={false}
        />
      </Group>
      <Pagination
        autoContrast
        color="#fff"
        total={1}
        classNames={{ control: styles.control, root: styles.pagination }}
      />
    </div>
  );
}
