import {
  Box,
  Flex,
  Modal,
  Select,
  TabsPanel,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import styles from "./debtor.module.scss";
import useDebtorStore, { DebtorFormState } from "@/lib/store/debtor";
import { useForm, zodResolver } from "@mantine/form";
import { countriesShortCode } from "@/lib/countries-short-code";
import { DebtorFormCompany } from "@/lib/schema";

interface DebtorModalCompany {
  closeDebtor: () => void;
  openSendMoney: () => void;
  handlePreviewState: () => void;
}

const DebtorForm = {
  location: "company",
  fullName: "",
  address: "",
  country: "",
  postCode: "",
  state: "",
  city: "",
  website: "",
  businessRegNo: "",
};

function DebtorModalCompany({
  closeDebtor,
  openSendMoney,
  handlePreviewState,
}: DebtorModalCompany) {
  const { setDebtorRequestForm } = useDebtorStore();

  const form = useForm<DebtorFormState>({
    initialValues: DebtorForm,
    validate: zodResolver(DebtorFormCompany),
  });

  const handleDebtor = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;
    handlePreviewState();
    setDebtorRequestForm(form.values);
  };

  return (
    <TabsPanel value="To A Company">
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
              Company Name
            </Text>
          }
          placeholder="Enter company name"
          {...form.getInputProps("fullName")}
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
          {...form.getInputProps("address")}
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
              City
            </Text>
          }
          placeholder="Enter City"
          {...form.getInputProps("city")}
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
              State
            </Text>
          }
          placeholder="Enter State"
          {...form.getInputProps("state")}
          errorProps={{
            fz: 12,
          }}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <Select
          data={countriesShortCode}
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              Country
            </Text>
          }
          placeholder="Enter Country"
          {...form.getInputProps("country")}
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
          {...form.getInputProps("postCode")}
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
              Website
            </Text>
          }
          placeholder="Enter Website"
          {...form.getInputProps("website")}
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
              Business Reg No
            </Text>
          }
          placeholder="Enter Business Reg No"
          {...form.getInputProps("businessRegNo")}
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
          action={handleDebtor}
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

export default DebtorModalCompany;
