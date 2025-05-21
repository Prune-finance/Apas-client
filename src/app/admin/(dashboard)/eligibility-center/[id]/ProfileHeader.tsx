import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { Flex, Group, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import React, { useState } from "react";
import Skeleton from "./Skeleton";
import { OnboardingBusiness } from "@/lib/interface";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";
import { boolean } from "zod";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";

interface ProfileHeaderProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  revalidate: () => Promise<void>;
}
export default function ProfileHeader({
  data,
  loading,
  revalidate,
}: ProfileHeaderProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedProfile, { open: openProfile, close: closeProfile }] =
    useDisclosure(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [loadingProfileApproval, setLoadingProfileApproval] = useState(false);
  const [loadingProfileRejection, setLoadingProfileRejection] = useState(false);
  const [loadingBusinessApproval, setLoadingBusinessApproval] = useState(false);
  const [loadingBusinessRejection, setLoadingBusinessRejection] =
    useState(false);
  const { handleSuccess, handleError, handleInfo } = useNotification();
  const axios = createAxiosInstance("auth");

  const handleSendingLink = async (reqType: "questionnaire" | "onboarding") => {
    setLoadingLink(true);
    try {
      const path = reqType === "questionnaire" ? `/questionnaire` : "";
      await axios.get(`/admin/onboardings${path}/${data?.id}/link`);

      const title =
        reqType === "questionnaire"
          ? `Questionnaire link sent to ${data?.contactPersonEmail}`
          : "Onboarding link sent successfully";

      const msg =
        reqType === "questionnaire"
          ? "Questionnaire sent successfully"
          : `Onboarding link sent to ${data?.contactPersonEmail}`;

      handleSuccess(title, msg);
      await revalidate();
    } catch (error) {
      return handleError("An Error occurred", parseError(error));
    } finally {
      setLoadingLink(false);
    }
  };

  const handleQuestionnaireApproval = async (
    status: "APPROVED" | "REJECTED"
  ) => {
    if (status === "REJECTED") {
      setLoadingProfileRejection(true);
    }
    if (status === "APPROVED") {
      setLoadingProfileApproval(true);
    }

    try {
      await axios.patch(
        `/admin/onboardings/questionnaire/${data?.id}/${
          status === "APPROVED" ? "approve" : "reject"
        }`
      );

      const msg =
        status === "APPROVED" ? "Profile approved" : "Profile rejected";
      handleSuccess("Profile Approval", msg);
      await revalidate();
    } catch (error) {
      handleError("An Error occurred", parseError(error));
    } finally {
      setLoadingProfileApproval(false);
      setLoadingProfileRejection(false);
    }
  };

  /**
   * Checks if all required documents have been reviewed and approved
   *
   * @returns {Promise<boolean>} Returns true if all documents are approved, false otherwise
   *
   * The function performs two main checks:
   * 1. Verifies if all required documents are present by comparing the number of documents
   *    - Checks if documentData keys length matches total expected documents (custom docs + 3 required docs)
   *
   * 2. Verifies if any document is rejected
   *    - Returns false if any document status is false (rejected)
   *    - A document status of false indicates rejection
   *
   * Note: The +3 in length check accounts for the three required documents:
   * - CAC Certificate
   * - AML Compliance
   * - MERMAT
   */

  const checkDocumentStatus = async (): Promise<boolean> => {
    // Check if all required documents are present
    if (
      Object.keys(data?.documentData || {}).length <
      (data?.documents || []).length + 3
    )
      return false;

    // Check if any value is false
    if (
      Object.values(data?.documentData || {}).some((value) => value === false)
    )
      return false;

    return true;
  };

  const handleBusinessApproval = async (status: "approve" | "reject") => {
    const isApproved = await checkDocumentStatus();
    if (status === "approve" && !isApproved)
      return handleInfo(
        "Hold up!!!",
        "You haven't approved all of this business's documents. You need to approve them before activating this business."
      );
    if (status === "reject") {
      setLoadingBusinessRejection(true);
    }
    if (status === "approve") {
      setLoadingBusinessApproval(true);
    }

    try {
      await axios.patch(`/admin/onboardings/${data?.id}/${status}`);
      const msg =
        status === "approve" ? "Business approved" : "Business rejected";
      handleSuccess("Business Approval", msg);
      await revalidate();
    } catch (error) {
      handleError("An Error occurred", parseError(error));
    } finally {
      setLoadingBusinessApproval(false);
      setLoadingBusinessRejection(false);
    }
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify={{ base: "flex-start", md: "space-between" }}
      align={{ base: "start", md: "center" }}
      m="32px 0px 24px"
      gap={24}
    >
      <Group gap={10}>
        <Skeleton loading={loading} w={150}>
          <Text c="var(--prune-text-gray-700)" fw={500} fz={18}>
            {data?.businessName}
          </Text>
        </Skeleton>

        <Skeleton loading={loading} w={150}>
          <BadgeComponent
            status={data?.processStatus || "QUESTIONNAIRE"}
            stage
            // variant="dot"
            w={150}
          />
        </Skeleton>
      </Group>

      <Group gap={10}>
        <ThemeIcon color="var(--prune-text-gray-700)" variant="light" size={36}>
          <IconDownload size={24} />
        </ThemeIcon>

        {data?.processStatus === "QUESTIONNAIRE" &&
          data.questionnaireStatus === "SUBMITTED" && (
            <>
              <PrimaryBtn
                text="Reject Profile"
                color="var(--prune-warning)"
                c="#fff"
                fw={600}
                action={openProfile}
                // action={() => handleQuestionnaireApproval("REJECTED")}
                // loading={loadingProfileRejection}
              />
              <PrimaryBtn
                text="Approve Profile"
                fw={600}
                action={() => handleQuestionnaireApproval("APPROVED")}
                loading={loadingProfileApproval}
              />
            </>
          )}
        {data?.processStatus === "ACTIVATION" &&
          data.onboardingStatus === "COMPLETED" && (
            <>
              <PrimaryBtn
                text="Reject Business"
                color="var(--prune-warning)"
                c="#fff"
                fw={600}
                action={open}
                // loading={loadingBusinessRejection}
              />
              <PrimaryBtn
                text="Activate Business"
                fw={600}
                action={() => handleBusinessApproval("approve")}
                loading={loadingBusinessApproval}
              />
            </>
          )}
        {data?.processStatus === "PROFILE" && (
          <PrimaryBtn
            text="Send Questionnaire"
            fw={600}
            action={() => handleSendingLink("questionnaire")}
            loading={loadingLink}
          />
        )}
        {(data?.processStatus === "QUESTIONNAIRE" ||
          data?.processStatus === "ONBOARDING") &&
          data.questionnaireStatus === "APPROVED" && (
            <PrimaryBtn
              text="Send Onboarding Link"
              fw={600}
              action={() => handleSendingLink("onboarding")}
              loading={loadingLink}
            />
          )}
      </Group>

      <RejectModal
        opened={opened}
        close={close}
        action={() => handleBusinessApproval("reject")}
        loading={loadingBusinessRejection}
      />

      <RejectModal
        opened={openedProfile}
        close={closeProfile}
        action={() => handleQuestionnaireApproval("REJECTED")}
        loading={loadingProfileRejection}
      />

      {/* <ModalComponent  /> */}
    </Flex>
  );
}

interface RejectModalProps {
  opened: boolean;
  close: () => void;
  loading: boolean;
  action: () => void;
}

const RejectModal = ({ opened, close, loading, action }: RejectModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Are you sure?"
      size="md"
      centered
      styles={{
        title: {
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--prune-text-gray-700)",
        },
      }}
    >
      <Stack gap={24}>
        <Text fz={16} fw={400} c="var(--prune-text-gray-700)">
          Rejecting this company means they are not eligible to use Prune
          Payments
        </Text>

        <Flex justify="end" align="center" gap={12}>
          <SecondaryBtn text="Cancel" fw={600} action={close} />

          <PrimaryBtn
            text="Reject"
            color="var(--prune-warning)"
            c="#fff"
            fw={600}
            action={action}
            loading={loading}
          />
        </Flex>
      </Stack>
    </Modal>
  );
};
