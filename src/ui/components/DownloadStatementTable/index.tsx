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
import styles from "@/ui/components/Table/table.module.scss";

interface Props extends TableProps {
  loading: boolean;
  //   head: JSX.Element;
  head: string[];
  rows: JSX.Element[] | JSX.Element;
  noBg?: boolean;
}

export function TableComponent({ loading, rows, head, noBg, ...props }: Props) {
  return (
    <TableScrollContainer minWidth="100%" maw="100%" mt={props.mt}>
      <Table
        // className={styles.table}
        style={{
          tableLayout: "fixed",
        }}
        verticalSpacing="md"
        borderColor="#F5F5F5"
        layout="fixed"
        {...props}
      >
        <TableThead bg={noBg ? "transparent" : "#000"}>
          <TableTr>
            {head.map((header, index) => (
              <TableTh
                key={index}
                className={styles.table__th}
                style={{ color: "#fff", fontSize: 14 }}
              >
                {header}
              </TableTh>
            ))}
          </TableTr>
        </TableThead>
        <TableTbody
          className={styles.table__td}
          style={{ wordBreak: "break-word", width: "100%" }}
        >
          {loading ? DynamicSkeleton2(head.length) : rows}
        </TableTbody>
      </Table>
    </TableScrollContainer>
  );
}
