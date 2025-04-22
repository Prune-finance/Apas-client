import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Select, Text, Textarea } from "@mantine/core";
import React from "react";
import styles from "./addAccount.module.scss";
import { useDisclosure } from "@mantine/hooks";

interface AddAccountProps {
  onClose: () => void;
  openSuccess: () => void;
}

function AddAccount({ onClose, openSuccess }: AddAccountProps) {
  const handleAddAccount = () => {
    onClose();
    openSuccess();
  };

  const data = [
    { value: "euros", label: "🇪🇺 EUR Account (Euros)" },
    { value: "pounds", label: "🇬🇧 GBP Account (Pounds)" },
    { value: "naira", label: "🇳🇬 NGN Account (Naira)" },
  ];

  return (
    <>
      <Box>
        <Text fz={20} fw={600} mb={20} ff="switzer" lh="100%" ta="center">
          Request Account
        </Text>

        <Flex mb={24}>
          <Select
            searchable
            placeholder="Select Account"
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            data={data}
          />
        </Flex>

        <Textarea
          minRows={3}
          maxRows={4}
          autosize
          classNames={{
            input: styles.textarea,
          }}
          placeholder="Give reason here..."
        />

        <PrimaryBtn
          text={"Submit"}
          fullWidth
          h={44}
          mt={32}
          fw={600}
          fz={14}
          action={handleAddAccount}
        />
      </Box>
    </>
  );
}

export default AddAccount;
