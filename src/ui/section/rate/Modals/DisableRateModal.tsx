"use client";

import { ActionIcon, Box, Group, Modal, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TextareaWithInsideLabel } from "@/ui/components/InputWithLabel";
import classes from "../styles.module.scss";

const consequences = [
  "New transactions and currency conversions using this pair are blocked via API.",
  "Completed transactions and their stored rates are not changed",
  "Rate history and audit records are kept.",
];

function ModalIcon({ name }: { name: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

export default function DisableRateModal({ pair, onClose, onConfirm, processing }: {
  pair: { code: string; statusLabel: string };
  onClose: () => void;
  onConfirm: (reason: string) => void;
  processing?: boolean;
}) {
  const form = useForm({
    initialValues: { reason: "" },
    validate: { reason: value => value.trim() ? null : "Enter a reason for this change" },
  });

  return (
    <Modal opened onClose={onClose} centered size={537} padding={0} radius={16}
      withCloseButton={false} aria-labelledby="disable-rate-title"
      classNames={{ content: classes.disableDialog }}>
      <form onSubmit={form.onSubmit(({ reason }) => onConfirm(reason.trim()))}>
        <Group className={classes.disableHeader} wrap="nowrap" gap={22}>
          <Box className={classes.disableIcon}><ModalIcon name="disable" /></Box>
          <Box flex={1}>
            <Text id="disable-rate-title" fz={24} fw={600} lh={1.2} style={{ fontFamily: "'EksellDisplay', serif", fontWeight: 400 }}>Disable {pair.code}</Text>
            <Text fz={14} lh={1} c="var(--prune-text-gray-500)" mt={8}>Currently {pair.statusLabel}</Text>
          </Box>
          <ActionIcon variant="transparent" size={24} aria-label="Close disable confirmation" onClick={onClose}>
            <ModalIcon name="close" />
          </ActionIcon>
        </Group>
        <Stack gap={16} className={classes.disableBody}>
          <Stack gap={8}>
            {consequences.map(message => <Group key={message} wrap="nowrap" gap={12}>
              <Box className={classes.checkIcon}><ModalIcon name="check" /></Box>
              <Text fz={14} fw={400} lh={1.5}>{message}</Text>
            </Group>)}
          </Stack>
          <TextareaWithInsideLabel standard label="Reason for change" withAsterisk
            placeholder="e.g. New corridor launch for UK → Nigeria"
            {...form.getInputProps("reason")} />
        </Stack>
        <Group justify="space-between" className={classes.disableFooter}>
          <SecondaryBtn text="Cancel" action={onClose} bg="#FBFEE6" bd="none" fw={500} />
          <PrimaryBtn text="Disable pair" type="submit" color="#FF5226" c="white" fw={500} loading={processing} />
        </Group>
      </form>
    </Modal>
  );
}
