import {
  Box,
  Flex,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useMemo } from "react";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import styles from "./debtor.module.scss";
import { useUserBusiness } from "@/lib/hooks/businesses";
import { useForm, zodResolver } from "@mantine/form";
import { countriesShortCode } from "@/lib/countries-short-code";
import useDebtorStore, { DebtorFormState } from "@/lib/store/debtor";
import { DebtorFormSelf } from "@/lib/schema";
import countries from "@/assets/countries.json";

interface DebtorModalIndividual {
  closeDebtor: () => void;
  openSendMoney: () => void;
  handlePreviewState: () => void;
}

const DebtorForm = {
  location: "self",
  fullName: "",
  address: "",
  country: "",
  postCode: "",
  state: "",
  city: "",
  website: "",
  businessRegNo: "",
};

function DebtorModalForm({
  closeDebtor,
  openSendMoney,
  handlePreviewState,
}: DebtorModalIndividual) {
  const { business, loading } = useUserBusiness();
  const { setDebtorRequestForm } = useDebtorStore();

  const form = useForm<DebtorFormState>({
    initialValues: DebtorForm,
    validate: zodResolver(DebtorFormSelf),
  });

  useMemo(() => {
    form.setValues({
      fullName: business?.name,
      address: business?.address,
      country:
        countriesShortCode.find(
          (country) =>
            country.label === business?.country ||
            country.value === business?.country
        )?.value || business?.country,
      website: business?.domain,

      // postCode: business?.postCode,
      // state: business?.state,
      // city: business?.city,
      // idType: business?.contactIdType,
      // idNumber: business?.contactIdUrl,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  const handleDebtor = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;
    handlePreviewState();
    setDebtorRequestForm(form.values);
  };

  return (
    <Box pos={"relative"}>
      <LoadingOverlay visible={loading} />

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
              Full Name <span style={{ color: "red" }}>*</span>
            </Text>
          }
          placeholder="Enter full name"
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
              Address <span style={{ color: "red" }}>*</span>
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
        <Select
          searchable
          classNames={{
            input: styles.input,
            label: styles.label,
            option: styles.option,
          }}
          flex={1}
          size="lg"
          label={
            <Text fz={14} c="#667085">
              Country <span style={{ color: "red" }}>*</span>
            </Text>
          }
          data={countries.map((c) => ({
            label: c?.name,
            value: c?.code,
          }))}
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
              Post Code <span style={{ color: "red" }}>*</span>
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
              State <span style={{ color: "red" }}>*</span>
            </Text>
          }
          placeholder="Enter State"
          {...form.getInputProps("state")}
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
              City <span style={{ color: "red" }}>*</span>
            </Text>
          }
          placeholder="Enter City"
          {...form.getInputProps("city")}
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
              Website <span style={{ color: "red" }}>*</span>
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
              Business Reg No <span style={{ color: "red" }}>*</span>
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
          // loading={processing}
          text="Continue"
          fullWidth
          fw={600}
          h={48}

          // w={126}
        />
      </Flex>
    </Box>
  );
}

export default DebtorModalForm;
