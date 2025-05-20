import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import React, { useState } from "react";
import Skeleton from "./Skeleton";
import { OnboardingBusiness } from "@/lib/interface";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";

interface ProfileHeaderProps {
  data: OnboardingBusiness | null;
  loading: boolean;
}
export default function ProfileHeader({ data, loading }: ProfileHeaderProps) {
  const [loadingLink, setLoadingLink] = useState(false);
  const { handleSuccess, handleError } = useNotification();
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
    } catch (error) {
      return handleError("An Error occurred", parseError(error));
    } finally {
      setLoadingLink(false);
    }
  };
  const { queryFn: approveProfile, loading: approveProfileLoading } = useAxios({
    baseURL: "auth",
    endpoint: `/admin/onboardings/${data?.id}/approve`,
    method: "PATCH",
    enabled: true,
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
    enabled: true,
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

        {data?.processStatus === "QUESTIONNAIRE" &&
          data.questionnaireStatus === "SUBMITTED" && (
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
        {data?.processStatus === "ACTIVATION" &&
          data.onboardingStatus === "COMPLETED" && (
            <>
              <PrimaryBtn
                text="Reject Business"
                color="var(--prune-warning)"
                c="#fff"
                fw={600}
                action={rejectProfile}
                loading={rejectProfileLoading}
              />
              <PrimaryBtn
                text="Activate Business"
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
            action={() => handleSendingLink("questionnaire")}
            loading={loadingLink}
          />
        )}
        {data?.processStatus === "QUESTIONNAIRE" &&
          data.questionnaireStatus === "APPROVED" && (
            <PrimaryBtn
              text="Send Onboarding Link"
              fw={600}
              action={() => handleSendingLink("onboarding")}
              loading={loadingLink}
            />
          )}
      </Group>
    </Flex>
  );
}
