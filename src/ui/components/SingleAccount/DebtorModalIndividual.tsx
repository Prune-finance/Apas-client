import { Box, Flex, Modal, TabsPanel, Text, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import styles from "./sendMoney.module.scss";

interface DebtorModalIndividual {
  closeDebtor: () => void;
  openSendMoney: () => void;
  handlePreviewState: () => void;
}

function DebtorModalIndividual({
  closeDebtor,
  openSendMoney,
  handlePreviewState,
}: DebtorModalIndividual) {
  return (
    <TabsPanel value="To Individual">
      <Flex
        align="center"
        justify="center"
        h={56}
        w="100%"
        my={30}
        bg="#F9F6E6"
        p={12}
      >
        <Text fz={12} fw={400} c="#8D7700">
          This means that you are not making this payment on behalf of someone,
          if you are please go back and check the option
        </Text>
      </Flex>

      <Flex gap={20}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              Full Name
            </Text>
          }
          placeholder="Enter first name"
          // {...form.getInputProps("firstName")}
          errorProps={{
            fz: 12,
          }}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              Address
            </Text>
          }
          placeholder="Enter Address"
          // {...form.getInputProps("firstName")}
          errorProps={{
            fz: 12,
          }}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              Country
            </Text>
          }
          placeholder="Enter Country"
          // {...form.getInputProps("destinationIBAN")}
          errorProps={{
            fz: 12,
          }}
        />

        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              Post Code
            </Text>
          }
          placeholder="Enter Post Code"
          // {...form.getInputProps("destinationBIC")}
          errorProps={{
            fz: 12,
          }}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              State
            </Text>
          }
          placeholder="Enter State"
          // {...form.getInputProps("destinationIBAN")}
          errorProps={{
            fz: 12,
          }}
        />

        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              City
            </Text>
          }
          placeholder="Enter City"
          // {...form.getInputProps("destinationBIC")}
          errorProps={{
            fz: 12,
          }}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              ID Type
            </Text>
          }
          placeholder="Enter ID Type"
          // {...form.getInputProps("destinationIBAN")}
          errorProps={{
            fz: 12,
          }}
        />

        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              ID Number
            </Text>
          }
          placeholder="Enter ID Number"
          // {...form.getInputProps("destinationBIC")}
          errorProps={{
            fz: 12,
          }}
        />
      </Flex>

      <Flex gap={20} mt={30}>
        <SecondaryBtn
          text="Back"
          h={48}
          fw={600}
          fullWidth
          action={() => {
            closeDebtor();
            openSendMoney();
          }}
        />
        <PrimaryBtn
          action={handlePreviewState}
          // loading={processing}
          text="Continue"
          fullWidth
          fw={600}
          h={48}

          // w={126}
        />
      </Flex>
    </TabsPanel>
  );
}

export default DebtorModalIndividual;
