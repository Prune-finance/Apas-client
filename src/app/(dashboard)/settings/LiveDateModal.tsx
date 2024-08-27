import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Modal, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendarMonth } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  opened: boolean;
  close: () => void;
  processing: boolean;
  action: () => void;
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}

export const LiveDateModal = ({
  opened,
  close,
  processing,
  action,
  date,
  setDate,
}: Props) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      //   size="xl"
      closeButtonProps={closeButtonProps}
      centered
    >
      <Stack align="center" gap={8}>
        <Text fz={20} fw={600}>
          Select Go Live Date
        </Text>
        <Text c="var(--prune-text-gray-500)" fz={12}>
          Please select the date you plan to go live.
        </Text>

        <Box w="100%" my={20}>
          <DateInput
            rightSection={<IconCalendarMonth />}
            placeholder="Select Date"
            clearable
            value={date}
            onChange={(value) => setDate(value)}
          />
        </Box>

        <PrimaryBtn
          fullWidth
          text="Submit"
          fw={600}
          mb={10}
          loading={processing}
          action={action}
        />
      </Stack>
    </Modal>
  );
};
