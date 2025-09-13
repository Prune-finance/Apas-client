import React, { useState } from "react";
import { NewDirectorOrShareholderModal, PanelWrapper } from "./utils";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  ProfileTextInput,
  ProfileDateInput,
} from "@/ui/components/InputWithLabel";
import { Flex, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import PaperContainer from "../PaperContainer";
import { Director, OnboardingBusiness } from "@/lib/interface";
import { DirectorType, OnboardingType } from "@/lib/schema/";
import { UseFormReturnType } from "@mantine/form";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { useDisclosure } from "@mantine/hooks";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
  revalidate?: () => Promise<void>;
}
export default function Shareholders({
  data,
  loading,
  form,
  revalidate,
}: ComponentProps) {
  const axios = createAxiosInstance("auth");
  const [opened, { open, close }] = useDisclosure(false);
  const [processing, setProcessing] = useState(false);
  const { handleError, handleSuccess } = useNotification();

  const updateDirector = async (newShareholder?: DirectorType) => {
    const { shareholders } = form.getValues();
    setProcessing(true);
    try {
      await axios.patch(`/admin/onboardings/${data?.id}/update-shareholders`, {
        shareholders: newShareholder
          ? [...(form.getValues()?.shareholders || []), newShareholder]
          : [...(form.getValues()?.shareholders || [])],
      });
      const msg = !newShareholder
        ? "Shareholder updated successfully"
        : "Shareholder added successfully";
      handleSuccess("Directors", msg);

      revalidate && (await revalidate());
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PanelWrapper
      loading={loading}
      rows={data?.onboardingStatus === "COMPLETED" ? [1] : []}
      panelName="All Shareholders"
    >
      <Flex justify="space-between" align="center">
        <Text fw={600} fz={16} c="var(--prune-text-gray-700)">
          All Shareholders
        </Text>
        <PrimaryBtn
          text="Add Shareholder"
          fw={600}
          fz={12}
          leftSection={<IconPlus size={16} />}
          action={open}
        />
      </Flex>

      <Stack mt={24} gap={24}>
        {data?.shareholders.map((shareholder, idx) => (
          <Shareholder
            key={idx}
            idx={idx}
            shareholder={shareholder}
            updateDirector={updateDirector}
            processing={processing}
            form={form}
          />
        ))}
      </Stack>

      <NewDirectorOrShareholderModal
        opened={opened}
        close={close}
        title="New Shareholder"
        onSubmit={(values) => updateDirector(values)}
        loading={processing}
      />
    </PanelWrapper>
  );
}

interface ShareholderProps {
  idx: number;
  shareholder: Director;
  updateDirector: (newDirector?: DirectorType) => Promise<void>;
  processing?: boolean;
  form: UseFormReturnType<OnboardingType>;
}
const Shareholder = ({
  idx,
  shareholder,
  updateDirector,
  processing,
  form,
}: ShareholderProps) => {
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleAction = async () => {
    setUpdating(true);

    try {
      await updateDirector();
      setEditing(false);
    } finally {
      setUpdating(false);
    }
  };

  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        text={editing ? "Update" : "Edit"}
        fw={600}
        fz={12}
        leftSection={<IconPencilMinus size={16} />}
        action={() => (editing ? handleAction() : setEditing((prev) => !prev))}
        loading={updating}
      />
      <SecondaryBtn
        text="Remove"
        fw={600}
        fz={12}
        leftSection={<IconTrash size={16} />}
        action={async () => {
          form.removeListItem("shareholders", idx);
          await updateDirector();
        }}
        disabled={processing}
      />
    </Group>
  );
  return (
    <PaperContainer title={`Shareholder ${idx + 1}`} actionNode={actionNode}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <ProfileTextInput
          label="First Name"
          placeholder={shareholder.first_name}
          editing={editing}
          {...form.getInputProps(`shareholders.${idx}.first_name`)}
          key={form.key(`shareholders.${idx}.first_name`)}
        />
        <ProfileTextInput
          label="Last Name"
          placeholder={shareholder.last_name}
          editing={editing}
          {...form.getInputProps(`shareholders.${idx}.last_name`)}
          key={form.key(`shareholders.${idx}.last_name`)}
        />
        <ProfileTextInput
          label="Email"
          placeholder={shareholder.email}
          editing={editing}
          {...form.getInputProps(`shareholders.${idx}.email`)}
          key={form.key(`shareholders.${idx}.email`)}
        />
        {/* <ProfileTextInput
          label="Phone Number"
          placeholder={"+234123456789"}
          editing={editing}
        /> */}
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${dayjs(shareholder.date_of_birth).format(
            "DD-MM-YYYY"
          )}`}
          editing={editing}
          valueFormat="DD-MM-YYYY"
          {...form.getInputProps(`shareholders.${idx}.date_of_birth`)}
          key={form.key(`shareholders.${idx}.date_of_birth`)}
        />
        <DocumentPreview
          label="Identity Document"
          title={shareholder.identityType || ""}
          value={shareholder.identityFileUrl || ""}
          editing={editing}
          setValue={(value) =>
            form.setFieldValue(`shareholders.${idx}.identityFileUrl`, value)
          }
          type={shareholder.identityType || ""}
          setType={(type) =>
            form.setFieldValue(`shareholders.${idx}.identityType`, type)
          }
        />
        <DocumentPreview
          label="Proof of Address"
          title={shareholder.proofOfAddress || ""}
          value={shareholder.proofOfAddressFileUrl || ""}
          editing={editing}
          setValue={(value) =>
            form.setFieldValue(
              `shareholders.${idx}.proofOfAddressFileUrl`,
              value
            )
          }
          type={shareholder.proofOfAddress || ""}
          setType={(type) =>
            form.setFieldValue(`shareholders.${idx}.proofOfAddress`, type)
          }
        />
      </SimpleGrid>
    </PaperContainer>
  );
};
