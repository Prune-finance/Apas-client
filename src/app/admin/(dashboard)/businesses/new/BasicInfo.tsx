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
import { IconMail, IconPhone, IconWorldWww } from "@tabler/icons-react";

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
          label="Business Name"
          placeholder="Enter Legal Business Name"
          {...form.getInputProps("name")}
          withAsterisk
        />
        <Select
          placeholder="Select Country"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Country"
          withAsterisk
          data={["Nigeria", "Ghana", "Kenya"]}
          {...form.getInputProps("country")}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <Select
          placeholder="Select Business Type"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Legal Entity"
          withAsterisk
          data={["Corporate"]}
          {...form.getInputProps("legalEntity")}
        />

        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          label="Business domain"
          type="url"
          placeholder="Enter Domain"
          {...form.getInputProps("domain")}
          rightSection={<IconWorldWww size={14} />}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Business Address"
          withAsterisk
          placeholder="Enter Business Address"
          {...form.getInputProps("address")}
        />
        <Select
          placeholder="Enter Pricing Plan"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          label="Pricing plan"
          data={["Free", "Basic", "Premium"]}
          {...form.getInputProps("pricingPlan")}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          label="Contact email"
          type="email"
          placeholder="Enter Contact Email"
          {...form.getInputProps("contactEmail")}
          rightSection={<IconMail size={14} />}
        />
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          type="tel"
          label="Contact phone number"
          placeholder="Enter Contact Phone Number"
          {...form.getInputProps("contactNumber")}
          rightSection={<IconPhone size={14} />}
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
        label="Business Bio"
        placeholder="Business Bio"
        classNames={{ input: styles.input, label: styles.label }}
        {...form.getInputProps("businessBio")}
      />
    </Box>
  );
}
