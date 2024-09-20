"use client";

import { inquiry } from "@/lib/static";
import { formatNumber, getInitials } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";

import { TicketChatComponent } from "@/ui/components/TicketChat";
import {
  ActionIcon,
  Avatar,
  Box,
  Collapse,
  Divider,
  FileButton,
  Flex,
  Group,
  rem,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import {
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
  MIME_TYPES,
} from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconPaperclip,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useParams } from "next/navigation";
import { useState } from "react";

export default function InquiryPage() {
  const { id } = useParams<{ id: string }>();
  const [opened, { toggle }] = useDisclosure(true);
  const [closeOpened, { open, close }] = useDisclosure(false);
  const [processing, setProcessing] = useState(false);

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
          { title: "Payouts", href: "/admin/payouts?tab=Inquiries" },
          {
            title: "Inquiry",
            href: `/admin/payouts/${id}/inquiry`,
            loading: false,
          },
        ]}
      />
      <Flex direction="column" h="calc(100vh - 350px)">
        <Box flex={1}>
          {/* Chat Header */}
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

            <PrimaryBtn text="Close Ticket" fw={600} h={40} action={open} />
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
                opened ? (
                  <IconChevronDown size={10} />
                ) : (
                  <IconChevronUp size={10} />
                )
              }
            />
          </Group>

          <Collapse in={opened} mt={16}>
            <SimpleGrid cols={4} w="60%">
              {Object.entries(trxDetails).map(([title, value]) => (
                <Stack key={title} gap={0}>
                  <Text
                    fz={10}
                    fw={500}
                    c="var(--prune-text-gray-400)"
                    key={title}
                  >
                    {title}
                  </Text>
                  <Text
                    fz={12}
                    fw={600}
                    c="var(--prune-text-gray-700)"
                    key={title}
                  >
                    {value}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Collapse>

          <Divider mt={20} mb={27} color="#EEF0F2" />

          <ScrollArea h={`calc(100vh - ${!opened ? "400px" : "450px"})`}>
            <Stack gap={40}>
              {inquiry.messages.map((mes, index) => (
                <TicketChatComponent
                  guest={mes.senderType === "user"}
                  key={index}
                  message={mes}
                  companyName={inquiry.transaction.company.name}
                />
              ))}
            </Stack>
          </ScrollArea>
        </Box>

        {/* New Chat Starts Here */}
        <Divider mt={20} mb={27} color="#EEF0F2" />
        <Group>
          <FileButton
            onChange={() => {}}
            // onChange={setFile}
            //   accept="image/png,image/jpeg"
            accept={[
              ...IMAGE_MIME_TYPE,
              ...PDF_MIME_TYPE,
              ...MS_WORD_MIME_TYPE,
              ...MS_EXCEL_MIME_TYPE,
              MIME_TYPES.csv,
            ].join(",")}
          >
            {(props) => (
              <ThemeIcon
                {...props}
                style={{ cursor: "pointer" }}
                variant="transparent"
                color="var(--prune-primary-600)"
              >
                <IconPaperclip />
              </ThemeIcon>
            )}
          </FileButton>

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
      </Flex>

      <ModalComponent
        processing={processing}
        action={() => {}}
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={closeOpened}
        close={close}
        title="Close this query Ticket?"
        text="By closing this query ticket, it means your transaction has been completed"
        customApproveMessage="Yes, Close"
      />
    </main>
  );
}
