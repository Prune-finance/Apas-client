import { Group, Radio, RadioProps, Text } from "@mantine/core";
import classes from "./services.module.css";

interface Props extends RadioProps {}

export default function CustomRadio({ label, value }: Props) {
  return (
    <Radio.Card
      value={String(value)}
      color="var(--prune-primary-700)"
      classNames={{ card: classes.card }}
    >
      <Group wrap="nowrap" align="center" justify="space-between">
        <Text>{label}</Text>
        <Radio.Indicator color="var(--prune-primary-700)" />
      </Group>
    </Radio.Card>
  );
}
