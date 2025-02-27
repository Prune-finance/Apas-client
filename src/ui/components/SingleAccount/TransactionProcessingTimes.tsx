import React from "react";
import { Group, Avatar, Text, Accordion, Box, Table } from "@mantine/core";

const charactersList = [
  {
    id: "bender",

    label: "Transaction Processing Times",
    description:
      "We strive to make your money transfers as fast as possible. However, processing times may vary depending on time of submission.",
    table: [
      {
        submitted: "2:45 PM – 5:30 PM",
        creditTime: "7:10 PM",
      },
      {
        submitted: "5:30 PM – 8:00 PM",
        creditTime: "1:40 PM",
      },
      {
        submitted: "8:00 PM – 10:30 PM",
        creditTime: "12:10 AM (Next Day)",
      },
      {
        submitted: "10:30 PM – 12:45 AM",
        creditTime: "1:40 AM (Next Day)",
      },
      {
        submitted: "12:45 AM – 2:45 PM",
        creditTime: "5:00 PM (Following Business Day)",
      },
    ],
  },
];

interface AccordionLabelProps {
  label: string;
  description: string;
}

function TransactionProcessingTimes() {
  const items = charactersList.map((item) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>

      <Accordion.Panel>
        <Table
          withTableBorder
          withColumnBorders
          withRowBorders={false}
          borderColor="#97AD053D"
        >
          <Table.Thead bg="#C1DD06">
            <Table.Tr>
              <Table.Th fz={12} fw={500} c="#1D2939">
                Submitted for execution
              </Table.Th>
              <Table.Th fz={12} fw={500} c="#1D2939">
                Approximate Credit Time
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {item.table.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td fz={12} fw={400} c="#1D2939">
                  {row.submitted}
                </Table.Td>
                <Table.Td fz={12} fw={400} c="#1D2939">
                  {row.creditTime}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion
      mt={24}
      chevronPosition="right"
      variant="contained"
      bg="#F2F5DE"
      styles={{
        control: {
          border: "none",
          backgroundColor: "#F2F5DE",
          transition: "none",
          "&:hover": {
            backgroundColor: "#F2F5DE",
          },
        },
        item: {
          border: "none",
          backgroundColor: "#F2F5DE",
          transition: "none",
          "&:hover": {
            backgroundColor: "#F2F5DE",
          },
        },
      }}
    >
      {items}
    </Accordion>
  );
}

function AccordionLabel({ label, description }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap" p={6}>
      <Box>
        <Text c="#97AD05" fz={12} fw={600}>
          {label}
        </Text>
        <Text fz={12} c="#2F3F53" fw={400}>
          {description}
        </Text>
      </Box>
    </Group>
  );
}

export default TransactionProcessingTimes;
