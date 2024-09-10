import { Group, Text, TextInput, UnstyledButton } from "@mantine/core";
import React, { Fragment, useState } from "react";
import styles from "./(tabs)/styles.module.scss";
import { IconCheck, IconFileInfo, IconX } from "@tabler/icons-react";
import useNotification from "@/lib/hooks/notification";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { notifications } from "@mantine/notifications";
import { parseError } from "@/lib/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { areSomeDocumentsNotApproved } from "@/lib/helpers/document-status";
import { RequestData } from "@/lib/hooks/requests";

interface Props {
  url: string;
  label: string;
  placeholder: string;
  path: string;
  request: RequestData | null;
  revalidate: () => void;
  status: "APPROVED" | "REJECTED" | "PENDING";
}

export const FileTextInput = ({
  url,
  label,
  placeholder,
  path,
  request,
  revalidate,
  status,
}: Props) => {
  const { handleInfo, handleError, handleSuccess } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [processingRejection, setProcessingRejection] = useState(false);

  const handleRejection = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/request/reject/${request?.id}`,
        {
          reason:
            "This account request has been rejected because of a document that is not approved. Re-upload the document(s) to approve this request.",
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
    } catch (error) {
      return handleError("Request Approval Failed", parseError(error));
    }
  };

  const approveOrRejectDocument = async (type: "approve" | "reject") => {
    if (type === "approve") {
      setProcessing(true);
    }
    if (type === "reject") {
      setProcessingRejection(true);
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/request/${request?.id}/document/${type}`,
        { path },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      if (type === "reject" && request?.status === "PENDING") {
        await handleRejection();
        revalidate();
        return handleSuccess(
          "Action completed",
          "The document has been successfully rejected, and the account request has been marked as rejected."
        );
      }

      revalidate();
      handleSuccess(
        `Document ${type === "approve" ? "Approved" : "Rejected"}`,
        ""
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
      setProcessingRejection(false);
    }
  };

  return (
    <Fragment>
      <TextInput
        readOnly
        classNames={{
          input: styles.input,
          label: styles.label,
          section: styles.section,
        }}
        leftSection={<IconFileInfo />}
        leftSectionPointerEvents="none"
        rightSection={
          <UnstyledButton
            onClick={() => {
              if (!url) {
                notifications.clean();
                return handleInfo("No document was provided", "");
              }
              window.open(url || "", "_blank");
            }}
            className={styles.input__right__section}
          >
            <Text fw={600} fz={10} c="#475467">
              View
            </Text>
          </UnstyledButton>
        }
        label={label}
        placeholder={placeholder}
      />

      <Group mt={16}>
        {(status === "PENDING" || status === "APPROVED") && (
          <PrimaryBtn
            text={status === "APPROVED" ? "Approved" : "Approve"}
            color="#039855"
            c="#039855"
            variant="light"
            h={22}
            radius={8}
            action={() => approveOrRejectDocument("approve")}
            loading={processing}
            loaderProps={{ type: "dots" }}
            disabled={processingRejection}
            {...(status === "APPROVED" && { icon: IconCheck })}
          />
        )}

        {(status === "PENDING" || status === "REJECTED") && (
          <PrimaryBtn
            text={status === "REJECTED" ? "Rejected" : "Reject"}
            color="#D92D20"
            c="#D92D20"
            variant="light"
            h={22}
            radius={8}
            action={() => approveOrRejectDocument("reject")}
            loaderProps={{ type: "dots" }}
            loading={processingRejection}
            disabled={processing}
            {...(status === "REJECTED" && { icon: IconX })}
          />
        )}
      </Group>
    </Fragment>
  );
};
