import { Flex, Text } from "@mantine/core";
import Image from "next/image";
import EmptyImage from "@/assets/empty.png";

type Props = {
  loading: boolean;
  rows: any[];
  title: string;
  text: string;
};

export default function EmptyTable({ loading, rows, text, title }: Props) {
  return (
    <>
      {!loading && !!!rows.length && (
        <Flex direction="column" align="center" mt={70}>
          <Image src={EmptyImage} alt="no content" width={156} height={120} />
          <Text mt={14} fz={14} c="#1D2939">
            {title}
          </Text>
          <Text fz={10} c="#667085">
            {text}
          </Text>
        </Flex>
      )}
    </>
  );
}
