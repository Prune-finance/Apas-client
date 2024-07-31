import { DynamicSkeleton, DynamicSkeleton2 } from "@/lib/static";
import {
  TableScrollContainer,
  Table,
  TableThead,
  TableTr,
  TableTh,
  Checkbox,
  TableTbody,
  TableProps,
} from "@mantine/core";
import styles from "./table.module.scss";

interface Props extends TableProps {
  loading: boolean;
  //   head: JSX.Element;
  head: string[];
  rows: JSX.Element[] | JSX.Element;
}

export function TableComponent({ loading, rows, head, ...props }: Props) {
  return (
    <TableScrollContainer minWidth={500} mt={props.mt}>
      <Table className={styles.table} verticalSpacing="md">
        <TableThead bg="#F9F9F9">
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
