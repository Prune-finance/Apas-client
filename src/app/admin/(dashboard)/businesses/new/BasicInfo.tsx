import form from "@/app/auth/[id]/register/form";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { UseFormReturnType } from "@mantine/form";
import { NewBusinessType } from "@/lib/schema";
import { IconMail } from "@tabler/icons-react";

type Props = {
  form: UseFormReturnType<NewBusinessType>;
};

export default function BasicInfo({ form }: Props) {
  return (
    <Box>
      <Text fz={18} fw={600} c="var(--prune-text-gray-700)" mb={24}>
        Basic Information
      </Text>

      <Flex gap={20}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          //   label="Business Name"
          placeholder="Enter Legal Business Name"
          {...form.getInputProps("name")}
          withAsterisk
        />
        <Select
          placeholder="Select Country"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          //   label="Country"
          data={["Nigeria", "Ghana", "Kenya"]}
          {...form.getInputProps("country")}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <Select
          placeholder="Select Business Type"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          //   label="Legal Entity"
          data={["Corporate"]}
          {...form.getInputProps("legalEntity")}
        />

        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          //   label="Business domain"
          placeholder="Enter Domain"
          {...form.getInputProps("domain")}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          //   label="Business Address"
          placeholder="Enter Business Address"
          {...form.getInputProps("address")}
        />
        <Select
          placeholder="Enter Pricing Plan"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          //   label="Pricing plan"
          data={["Free", "Basic", "Premium"]}
          {...form.getInputProps("pricingPlan")}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          // label="Contact email"
          placeholder="Enter Contact Email"
          {...form.getInputProps("contactEmail")}
          rightSection={<IconMail size={14} />}
        />
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          //   label="Contact phone number"
          placeholder="Enter Contact Phone Number"
          {...form.getInputProps("contactNumber")}
          //   rightSection={
          //     <Group>
          //       <Avatar />
          //       <Select data={["US"]} variant="unstyled" />
          //     </Group>
          //   }
          //   rightSectionWidth={300}
        />
      </Flex>

      <Textarea
        mt={24}
        placeholder="Business Bio"
        classNames={{ input: styles.input, label: styles.label }}
        {...form.getInputProps("businessBio")}
      />
    </Box>
  );
}
