import { PrimaryBtn } from "@/ui/components/Buttons";
import { Flex, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

const questAxios = createAxiosInstance("questionnaire");

interface ConsentModalProps {
  opened: boolean;
  close: () => void;
}

export default function ConsentModal({ opened, close }: ConsentModalProps) {
  const { handleError } = useNotification();
  const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();

  const getReference = () =>
    (params?.slug?.[0] as string | undefined) ??
    (typeof window !== "undefined" ? sessionStorage.getItem("quest_reference") : null);

  const getResumeToken = () =>
    searchParams?.get("token") ??
    (typeof window !== "undefined" ? sessionStorage.getItem("quest_token") : null);

  const handleConsent = async () => {
    const reference = getReference();
    const token = getResumeToken();

    if (!reference || !token) {
      handleError("Unable to submit", "Session reference not found. Please refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      await questAxios.post(
        `/business/questionnaire/${reference}/submit`,
        {},
        { headers: { "X-Resume-Token": token } }
      );
      close();
      openConfirm();
    } catch (err) {
      handleError("Submission failed", parseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Questionnaire Consent"
        styles={{
          title: {
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--prune-primary-800)",
          },
        }}
        padding={24}
        centered
      >
        <Stack gap={24}>
          <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
            Declaration & Consent
          </Text>

          <Stack gap={12}>
            <Text fz={14} c="var(--prune-text-gray-600)" lh={1.6}>
              By clicking <strong>I Consent</strong>, you confirm that the information provided in
              this questionnaire is accurate and complete to the best of your knowledge.
            </Text>
            <Text fz={14} c="var(--prune-text-gray-600)" lh={1.6}>
              You consent to Prune Payments collecting, processing, and sharing the information
              submitted in this form for the purpose of reviewing your business application and
              conducting any required due diligence in accordance with applicable regulations.
            </Text>
            <Text fz={14} c="var(--prune-text-gray-600)" lh={1.6}>
              Your information will be handled in accordance with our Privacy Policy and will only
              be used for purposes related to your onboarding and account management.
            </Text>
          </Stack>

          <Flex justify="end">
            <PrimaryBtn
              text="I Consent"
              fw={600}
              action={handleConsent}
              loading={submitting}
            />
          </Flex>
        </Stack>
      </Modal>

      <ConfirmationModal opened={openedConfirm} close={closeConfirm} />
    </>
  );
}
