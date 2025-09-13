import React, { useState } from "react";
import { NewDirectorOrShareholderModal, PanelWrapper } from "./utils";
import { Flex, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import PaperContainer from "../PaperContainer";
import {
  ProfileDateInput,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import dayjs from "dayjs";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { OnboardingBusiness } from "@/lib/interface";
import {
  DirectorType,
  OnboardingDirectorValues,
  OnboardingType,
} from "@/lib/schema/onboarding";
import { UseFormReturnType } from "@mantine/form";
import { Director as IDirector } from "@/lib/interface";
import { useDisclosure } from "@mantine/hooks";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
  revalidate?: () => Promise<void>;
}

export default function Directors({
  data,
  loading,
  form,
  revalidate,
}: ComponentProps) {
  const axios = createAxiosInstance("auth");
  const [opened, { open, close }] = useDisclosure(false);
  const [processing, setProcessing] = useState(false);
  const { handleError, handleSuccess } = useNotification();

  const updateDirector = async (newDirector?: DirectorType) => {
    setProcessing(true);
    try {
      await axios.patch(`/admin/onboardings/${data?.id}/update-directors`, {
        directors: newDirector
          ? [...form.getValues()?.directors, newDirector]
          : [...form.getValues()?.directors],
      });
      const msg = !newDirector
        ? "Director updated successfully"
        : "Director added successfully";
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
      panelName="All Directors"
    >
      <Flex justify="space-between" align="center">
        <Text fw={600} fz={16} c="var(--prune-text-gray-700)">
          All Directors
        </Text>
        <PrimaryBtn
          text="Add Director"
          fw={600}
          fz={12}
          leftSection={<IconPlus size={16} />}
          action={() => {
            open();

            // form.insertListItem("directors", {
            //   ...OnboardingDirectorValues,
            //   id: crypto.randomUUID(),
            // });
          }}
        />
      </Flex>

      <Stack mt={24} gap={24}>
        {form.values?.directors.map((director, idx) => (
          <Director
            key={idx}
            idx={idx}
            director={director}
            form={form}
            updateDirector={updateDirector}
            processing={processing}
          />
        ))}
      </Stack>

      <NewDirectorOrShareholderModal
        opened={opened}
        close={close}
        title="New Director"
        onSubmit={(values) => updateDirector(values)}
        loading={processing}
      />
    </PanelWrapper>
  );
}

interface DirectorProps {
  idx: number;
  director: DirectorType;
  // director: IDirector;
  form: UseFormReturnType<OnboardingType>;
  updateDirector: (newDirector?: DirectorType) => Promise<void>;
  processing?: boolean;
}
const Director = ({
  idx,
  director,
  form,
  updateDirector,
  processing,
}: DirectorProps) => {
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
        action={() => (editing ? handleAction() : setEditing(true))}
        loading={updating}
      />
      <SecondaryBtn
        text="Remove"
        fw={600}
        fz={12}
        leftSection={<IconTrash size={16} />}
        action={async () => {
          form.removeListItem("directors", idx);
          await updateDirector();
        }}
        disabled={processing}
      />
    </Group>
  );
  return (
    <PaperContainer title={`Director ${idx + 1}`} actionNode={actionNode}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <ProfileTextInput
          label="First Name"
          placeholder={director.first_name}
          editing={editing}
          {...form.getInputProps(`directors.${idx}.first_name`)}
          key={form.key(`directors.${idx}.first_name`)}
        />
        <ProfileTextInput
          label="Last Name"
          placeholder={director.last_name}
          editing={editing}
          {...form.getInputProps(`directors.${idx}.last_name`)}
          key={form.key(`directors.${idx}.last_name`)}
        />
        <ProfileTextInput
          label="Email"
          placeholder={director.email}
          editing={editing}
          {...form.getInputProps(`directors.${idx}.email`)}
          key={form.key(`directors.${idx}.email`)}
        />
        {/* <ProfileTextInput
          label="Phone Number"
          placeholder={director.}
          editing={editing}
        /> */}
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${
            director.date_of_birth
              ? dayjs(director.date_of_birth).format("DD-MM-YYYY")
              : ""
          }`}
          editing={editing}
          valueFormat="DD-MM-YYYY"
          {...form.getInputProps(`directors.${idx}.date_of_birth`)}
          key={form.key(`directors.${idx}.date_of_birth`)}
        />
        <DocumentPreview
          label="Identity Document"
          title={director.identityType || ""}
          value={director.identityFileUrl || ""}
          editing={editing}
          setValue={(value) =>
            form.setFieldValue(`directors.${idx}.identityFileUrl`, value)
          }
          type={director.identityType || ""}
          setType={(type) =>
            form.setFieldValue(`directors.${idx}.identityType`, type)
          }
        />
        <DocumentPreview
          label="Proof of Address"
          title={director.proofOfAddress || ""}
          value={director.proofOfAddressFileUrl || ""}
          editing={editing}
          setValue={(value) =>
            form.setFieldValue(`directors.${idx}.proofOfAddressFileUrl`, value)
          }
          type={director.proofOfAddress || ""}
          setType={(type) =>
            form.setFieldValue(`directors.${idx}.proofOfAddress`, type)
          }
        />
      </SimpleGrid>
    </PaperContainer>
  );
};
