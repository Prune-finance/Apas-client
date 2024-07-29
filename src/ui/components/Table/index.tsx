import { DynamicSkeleton, DynamicSkeleton2 } from "@/lib/static";
import {
  TableScrollContainer,
  Table,
  TableThead,
  TableTr,
  TableTh,
  Checkbox,
  TableTbody,
} from "@mantine/core";
import styles from "./table.module.scss";

type Props = {
  loading: boolean;
  //   head: JSX.Element;
  head: string[];
  rows: JSX.Element[] | JSX.Element;
};

export function TableComponent({ loading, rows, head }: Props) {
  return (
    <TableScrollContainer minWidth={500}>
      <Table className={styles.table} verticalSpacing="md">
        <TableThead>
          <TableTr>
            {head.map((header, index) => (
              <TableTh key={index} className={styles.table__th}>
                {header}
              </TableTh>
            ))}
          </TableTr>
        </TableThead>
        <TableTbody className={styles.table__td}>
          {loading ? DynamicSkeleton2(head.length) : rows}
        </TableTbody>
      </Table>
    </TableScrollContainer>
  );
}
