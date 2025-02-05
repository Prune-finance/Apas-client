"use client";

import { parseError } from "@/lib/actions/auth";
import { useSingleInquiry } from "@/lib/hooks/inquiries";
import useNotification from "@/lib/hooks/notification";

import { camelCaseToTitleCase, formatNumber, getInitials } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import ModalComponent from "@/ui/components/Modal";

import { TicketChatComponent } from "@/ui/components/TicketChat";
import { FileUploadModal } from "@/ui/components/TicketChat/FileUploadModal";
import {
  ActionIcon,
  Avatar,
  Box,
  Collapse,
  Divider,
  FileButton,
  Flex,
  Group,
  Loader,
  rem,
  ScrollArea,
  SimpleGrid,
  Skeleton,
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
import { useRef, useState } from "react";
import { z } from "zod";

import { useForm, zodResolver } from "@mantine/form";
import createAxiosInstance from "@/lib/axios";

export default function InquiryPage() {
  const { id } = useParams<{ id: string }>();
  const axios = createAxiosInstance("payouts");
  const [opened, { toggle }] = useDisclosure(true);
  const [closeOpened, { open, close }] = useDisclosure(false);
  const [processing, setProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { inquiry, loading, revalidate } = useSingleInquiry(id);
  const { handleError, handleSuccess } = useNotification();
  const resetFileInputRef = useRef<() => void>(null);

  const form = useForm<FormValues>({
    initialValues,
    validate: zodResolver(schema),
  });

  const trxDetails = {
    "Sender Name": inquiry?.Transaction?.senderName,
    "Beneficiary Name": inquiry?.Transaction?.recipientName,
    Amount: formatNumber(inquiry?.Transaction?.amount ?? 0, true, "EUR"),
    "Date Requested": dayjs(inquiry?.createdAt).format("Do MMMM, YYYY"),
  };

  const getMsgType = (text?: string, file?: string) => {
    if (file && text) return "text-file";
    if (file && !text) return "file";
    return "text";
  };

  const sendMessage = async () => {
    if (form.validate().hasErrors) return;
    setProcessingMsg(true);
    try {
      const { text, file, extension } = form.values;
      const type = getMsgType(text, file);

      await axios.put(`/admin/inquiries/${id}/message`, {
        type,
        ...(file && { file }),
        ...(extension && { extension }),
        ...(text && { text }),
      });

      form.reset();
      setFile(null);
      revalidate();
      // scrollIntoView();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessingMsg(false);
    }
  };

  const handleInquiryStatus = async (type: "close" | "open") => {
    setProcessing(true);
    try {
      await axios.patch(`/admin/inquiries/${id}/${type}`, {});

      const title = `${camelCaseToTitleCase(
        inquiry?.type.toLowerCase() ?? ""
      )} ${type === "close" ? "closed" : "reopened"} successfully`;

      handleSuccess(title, "");
      revalidate();
      if (type === "close") return close();
      // if (type === "open") return reClose();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleUpload = async (file: File | null) => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data: res } = await axios.post(`/admin/upload`, formData);

      form.setFieldValue("file", res.data.url);
      form.setFieldValue("extension", file.type);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
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
              {inquiry?.Company?.name ? (
                <Avatar
                  size={40}
                  color="var(--prune-primary-700)"
                  variant="filled"
                  radius="xl"
                >
                  {getInitials(inquiry?.Company.name ?? "")}
                </Avatar>
              ) : (
                <Skeleton circle w={40} h={40} />
              )}

              {inquiry?.type ? (
                <Text
                  fz={20}
                  fw={600}
                  c="var(--prune-text-gray-700)"
                  tt="capitalize"
                >
                  {inquiry?.type.toLowerCase()}:{" "}
                  {inquiry?.Transaction.centrolinkRef}
                </Text>
              ) : (
                <Skeleton w={100} h={10} />
              )}

              {inquiry?.status ? (
                <BadgeComponent status={inquiry?.status ?? ""} w={100} />
              ) : (
                <Skeleton w={100} h={20} />
              )}
            </Group>
            {inquiry?.status ? (
              <PrimaryBtn
                text="Close Ticket"
                fw={600}
                h={40}
                action={open}
                loading={loading}
                loaderProps={{ type: "dots" }}
                display={inquiry?.status === "PROCESSING" ? "block" : "none"}
              />
            ) : (
              <Skeleton w={100} h={40} />
            )}
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

                  {value ? (
                    <Text fz={12} fw={600} c="var(--prune-text-gray-700)">
                      {value}
                    </Text>
                  ) : (
                    <Skeleton h={10} w={100} mt={10} />
                  )}
                </Stack>
              ))}
            </SimpleGrid>
          </Collapse>

          <Divider mt={20} mb={27} color="#EEF0F2" />

          <ScrollArea h={`calc(100vh - ${!opened ? "400px" : "450px"})`}>
            <Stack gap={40}>
              {inquiry?.Messages.map((mes, index) => (
                <TicketChatComponent
                  guest={mes.senderType === "user"}
                  key={index}
                  message={mes}
                  companyName={inquiry?.Company.name}
                />
              ))}
            </Stack>
          </ScrollArea>
        </Box>

        {/* New Chat Starts Here */}
        {inquiry?.status === "PROCESSING" && (
          <>
            <Divider mt={20} mb={27} color="#EEF0F2" />
            <Group>
              <FileButton
                onChange={(file) => {
                  setFile(file);
                  handleUpload(file);
                }}
                resetRef={resetFileInputRef}
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

              <Box
                component="form"
                onSubmit={form.onSubmit(() => sendMessage())}
                flex={1}
              >
                <TextInput
                  placeholder="Reply..."
                  variant="filled"
                  flex={1}
                  {...form.getInputProps("text")}
                  rightSection={
                    processingMsg ? (
                      <Loader
                        type="dots"
                        color="var(--prune-primary-600)"
                        size="sm"
                      />
                    ) : (
                      <ActionIcon
                        size={32}
                        radius="xl"
                        color="var(--prune-primary-600)"
                        variant="transparent"
                        component="button"
                        type="submit"
                      >
                        <IconSend
                          style={{ width: rem(18), height: rem(18) }}
                          stroke={2}
                        />
                      </ActionIcon>
                    )
                  }
                />
              </Box>
            </Group>
          </>
        )}
      </Flex>

      <ModalComponent
        processing={processing}
        action={() => handleInquiryStatus("close")}
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={closeOpened}
        close={close}
        title={`Close this ${inquiry?.type.toLowerCase()} Ticket?`}
        text={`By closing this ${inquiry?.type.toLowerCase()} ticket, it means your transaction has been completed`}
        customApproveMessage="Yes, Close"
      />

      <FileUploadModal
        file={file}
        opened={!!file}
        close={() => {
          setFile(null);
          form.setFieldValue("file", "");
          if (resetFileInputRef.current) {
            resetFileInputRef.current(); // Call the reset function
          }
        }}
        processing={processing}
        processingMsg={processingMsg}
        sendMessage={sendMessage}
        form={form}
      />
    </main>
  );
}

const initialValues = { text: "", file: "", extension: "" };

const schema = z
  .object({
    text: z.string(),
    file: z.string().optional(),
    extension: z.string().optional(),
  })
  .refine((data) => data.text || data.file, {
    message: "Either add a message or a file.",
    path: ["text"],
  });

export type FormValues = z.infer<typeof schema>;
