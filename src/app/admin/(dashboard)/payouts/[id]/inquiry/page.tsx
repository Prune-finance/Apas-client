"use client";

import { inquiry, Message } from "@/lib/static";
import { formatNumber, getInitials } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  ActionIcon,
  Avatar,
  Box,
  Collapse,
  Divider,
  Group,
  Paper,
  rem,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconPaperclip,
  IconSend,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { color } from "framer-motion";
import { get } from "http";

dayjs.extend(advancedFormat);
import { useParams } from "next/navigation";

export default function InquiryPage() {
  const { id } = useParams<{ id: string }>();
  const [opened, { toggle }] = useDisclosure(true);

  const trxDetails = {
    "Sender Name": inquiry.transaction.senderName,
    "Beneficiary Name": inquiry.transaction.recipientName,
    Amount: formatNumber(inquiry.transaction.amount, true, "EUR"),
    "Date Requested": dayjs(inquiry.createdAt).format("Do MMMM, YYYY"),
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Payouts", href: "/admin/payouts" },
          {
            title: "Inquiry",
            href: `/admin/payouts/${id}/inquiry`,
            loading: false,
          },
        ]}
      />
      <Group mt={28} justify="space-between">
        <Group>
          <Avatar
            size={40}
            color="var(--prune-primary-700)"
            variant="filled"
            radius="xl"
          >
            {getInitials(inquiry.transaction.company.name)}
          </Avatar>

          <Text fz={20} fw={600} c="var(--prune-text-gray-700)">
            Query: {inquiry.transaction.centrolinkRef}
          </Text>

          <BadgeComponent status={inquiry.status} w={100} />
        </Group>

        <PrimaryBtn text="Close Ticket" fw={600} h={40} />
      </Group>
      <Divider mb={20} mt={27} color="#EEF0F2" />

      <Group gap={5}>
        <Text fz={12} fw={600} c="var(--prune-text-gray-800)">
          Transaction Details:
        </Text>

        <SecondaryBtn
          text={opened ? "Hide" : "Show"}
          action={toggle}
          variant="transparent"
          td="underline"
          fz={10}
          px={0}
          m={0}
          rightSection={
            opened ? <IconChevronDown size={10} /> : <IconChevronUp size={10} />
          }
        />
      </Group>

      <Collapse in={opened} mt={16}>
        <SimpleGrid cols={4} w="60%">
          {Object.entries(trxDetails).map(([title, value]) => (
            <Stack key={title} gap={0}>
              <Text fz={10} fw={500} c="var(--prune-text-gray-400)" key={title}>
                {title}
              </Text>
              <Text fz={12} fw={600} c="var(--prune-text-gray-700)" key={title}>
                {value}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Collapse>

      <Divider mt={20} mb={27} color="#EEF0F2" />

      <ScrollArea h={`calc(100vh - ${opened ? "450px" : "400px"})`}>
        <Stack gap={40}>
          {inquiry.messages.map((mes, index) => (
            <ChatComponent guest={mes.senderType === "user"} key={index} />
          ))}
        </Stack>
      </ScrollArea>

      <Divider mt={20} mb={27} color="#EEF0F2" />

      <Group>
        <ThemeIcon variant="transparent" color="var(--prune-primary-600)">
          <IconPaperclip />
        </ThemeIcon>

        <TextInput
          placeholder="Reply..."
          variant="filled"
          flex={1}
          rightSection={
            <ActionIcon
              size={32}
              radius="xl"
              color="var(--prune-primary-600)"
              variant="transparent"
            >
              <IconSend
                style={{ width: rem(18), height: rem(18) }}
                stroke={2}
              />
            </ActionIcon>
          }
        />
      </Group>
    </main>
  );
}

interface ChatProps {
  guest?: boolean;
}

const ChatComponent = ({ guest }: ChatProps) => {
  return (
    <Group
      align="flex-start"
      w="50%"
      style={{ alignSelf: guest ? "start" : "end" }}
    >
      <Avatar
        color="var(--prune-text-gray-100)"
        radius="xl"
        variant="filled"
        styles={{ placeholder: { color: "var(--prune-text-gray-800)" } }}
        display={guest ? "block" : "none"}
        size={40}
      >
        {getInitials(inquiry.transaction.company.name)}
      </Avatar>

      <Stack gap={0} flex={1}>
        <Text
          //   lh={0}
          fz={14}
          fw={600}
          c="var(--prune-text-gray-800)"
          display={guest ? "block" : "none"}
        >
          {inquiry.transaction.company.name}
        </Text>

        <Paper
          bg={guest ? "var(--prune-text-gray-100)" : "#F2FBB2"}
          px={15}
          py={10}
          radius={guest ? "0px 10px 10px 10px" : "10px 0px 10px 10px"}
        >
          <Text fz={12} c="var(--prune-text-gray-800)">
            The transaction has been pending for a while now. I want to know if
            its is going to go through, and if i will be debited if it does not.
          </Text>
        </Paper>
        <Text
          lh={0}
          fz={10}
          fw={600}
          mt={10}
          c="var(--prune-text-gray-400)"
          style={{ alignSelf: guest ? "end" : "start" }}
        >
          {dayjs(inquiry.transaction.createdAt).format(
            "Do MMMM, YYYY - hh:mmA"
          )}
        </Text>
      </Stack>
    </Group>
  );
};

// { message }: { message: Message }
