import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import React from "react";
import Skeleton from "./Skeleton";
import { OnboardingBusiness } from "@/lib/interface";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";

interface ProfileHeaderProps {
  data: OnboardingBusiness | null;
  loading: boolean;
}
export default function ProfileHeader({ data, loading }: ProfileHeaderProps) {
  const { handleSuccess } = useNotification();
  const {
    queryFn: sendQuestionnaireLink,
    loading: sendQuestionnaireLinkLoading,
  } = useAxios({
    baseURL: "auth",
    endpoint: `/admin/onboardings/questionnaire/${data?.id}/link`,
    method: "GET",
    onSuccess: () => {
      handleSuccess(
        `Questionnaire link sent to ${data?.businessEmail}`,
        "Questionnaire sent successfully"
      );
    },
  });
  const { queryFn: sendOnboardingLink, loading: sendOnboardingLinkLoading } =
    useAxios({
      baseURL: "auth",
      endpoint: `/admin/onboardings/${data?.id}/link`,
      method: "GET",
      onSuccess: () => {
        handleSuccess(
          "Onboarding link sent successfully",
          `Onboarding link sent to ${data?.businessEmail}`
        );
      },
    });
  const { queryFn: approveProfile, loading: approveProfileLoading } = useAxios({
    baseURL: "auth",
    endpoint: `/admin/onboardings/${data?.id}/approve`,
    method: "PATCH",
    onSuccess: () => {
      handleSuccess(
        "Business has been approved.",
        `You have successfully approved ${data?.businessName}`
      );
    },
  });
  const { queryFn: rejectProfile, loading: rejectProfileLoading } = useAxios({
    baseURL: "auth",
    endpoint: `/admin/onboardings/${data?.id}/approve`,
    method: "PATCH",
    onSuccess: () => {
      handleSuccess(
        "Business has been rejected.",
        `You have successfully rejected ${data?.businessName}`
      );
    },
  });
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

        {data?.processStatus === "ONBOARDING" &&
          data.onboardingStatus === "COMPLETED" && (
            <>
              <PrimaryBtn
                text="Reject Profile"
                color="var(--prune-warning)"
                c="#fff"
                fw={600}
                action={rejectProfile}
                loading={rejectProfileLoading}
              />
              <PrimaryBtn
                text="Approve Profile"
                fw={600}
                action={approveProfile}
                loading={approveProfileLoading}
              />
            </>
          )}
        {data?.processStatus === "PROFILE" && (
          <PrimaryBtn
            text="Send Questionnaire"
            fw={600}
            action={sendQuestionnaireLink}
            loading={sendQuestionnaireLinkLoading}
          />
        )}
        {data?.processStatus === "QUESTIONNAIRE" &&
          data.questionnaireStatus === "APPROVED" && (
            <PrimaryBtn
              text="Send Onboarding Link"
              fw={600}
              action={sendOnboardingLink}
              loading={sendOnboardingLinkLoading}
            />
          )}
      </Group>
    </Flex>
  );
}
