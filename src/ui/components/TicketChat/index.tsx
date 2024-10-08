import { getFileIcon, getFileType } from "@/lib/helpers/file-type";
import { getInitials } from "@/lib/utils";
import {
  Group,
  Avatar,
  Stack,
  Paper,
  ThemeIcon,
  Modal,
  Box,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { Fragment } from "react";
import { SecondaryBtn } from "../Buttons";
import FileDisplay from "../DocumentViewer";
import { Message } from "@/lib/hooks/inquiries";

interface ChatProps {
  guest?: boolean;
  message: Message;
  companyName: string;
}

export const TicketChatComponent = ({
  guest,
  message,
  companyName,
}: ChatProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Fragment>
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
          {getInitials(companyName)}
        </Avatar>

        <Stack gap={0} flex={1}>
          <Text
            //   lh={0}
            fz={14}
            fw={600}
            c="var(--prune-text-gray-800)"
            display={guest ? "block" : "none"}
          >
            {companyName}
          </Text>

          <Paper
            bg={guest ? "var(--prune-text-gray-100)" : "#F2FBB2"}
            p={15}
            radius={guest ? "0px 10px 10px 10px" : "10px 0px 10px 10px"}
          >
            {message.type === "text" && (
              <Text fz={12} c="var(--prune-text-gray-800)">
                {message.text}
              </Text>
            )}

            {message.type === "file" && (
              <Group justify="space-between">
                <Group gap={8}>
                  <ThemeIcon
                    variant="transparent"
                    color="var(--prune-text-gray-600)"
                  >
                    {getFileIcon(message.extension)}
                  </ThemeIcon>
                  <Text fz={12} fw={600} c="var(--prune-text-gray-800)">
                    {getFileType(message.extension)}
                  </Text>
                </Group>

                <SecondaryBtn
                  text="Click to View"
                  td="underline"
                  fz={10}
                  fw={600}
                  variant="transparent"
                  action={open}
                />
              </Group>
            )}

            {message.type === "text-file" && (
              <Stack gap={0}>
                <Group justify="space-between">
                  <Group gap={8}>
                    <ThemeIcon
                      variant="transparent"
                      color="var(--prune-text-gray-600)"
                    >
                      {getFileIcon(message.extension)}
                    </ThemeIcon>
                    <Text fz={12} fw={600} c="var(--prune-text-gray-800)">
                      {getFileType(message.extension)}
                    </Text>
                  </Group>

                  <SecondaryBtn
                    text="Click to View"
                    td="underline"
                    fz={10}
                    fw={600}
                    variant="transparent"
                    action={open}
                  />
                </Group>

                <Text fz={12} c="var(--prune-text-gray-800)">
                  {message.text}
                </Text>
              </Stack>
            )}
          </Paper>
          <Text
            lh={0}
            fz={10}
            fw={600}
            mt={10}
            c="var(--prune-text-gray-400)"
            style={{ alignSelf: guest ? "end" : "start" }}
          >
            {dayjs(message.createdAt).format("Do MMMM, YYYY - hh:mmA")}
          </Text>
        </Stack>
      </Group>

      {(message.type === "file" || message.type === "text-file") && (
        <Modal
          opened={opened}
          onClose={close}
          size={800}
          centered
          title={
            <Text fz={14} fw={500}>
              Document Preview
            </Text>
          }
        >
          <Box>
            <FileDisplay fileUrl={message.file} />
          </Box>
        </Modal>
      )}
    </Fragment>
  );
};
