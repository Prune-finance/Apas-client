import { Grid, GridCol, Text, TextInput } from "@mantine/core";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { usePricingPlan } from "@/lib/hooks/pricing-plan";
import { BasicInfoType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import dayjs from "dayjs";
import { BadgeComponent } from "@/ui/components/Badge";
import { approvedBadgeColor } from "@/lib/utils";
import {
  useAllCompanyRequests,
  useCompanyRequests,
  usePayoutRequests,
} from "@/lib/hooks/requests";
import { useParams } from "next/navigation";

export const Access = () => {
  const { id } = useParams<{ id: string }>();
  const { requests, revalidate } = useAllCompanyRequests(id, {
    type: "ACCOUNT_ISSUANCE",
    companyId: id,
  });

  const { requests: payoutRequests, revalidate: revalidatePR } =
    usePayoutRequests({ companyId: id });
  return (
    <div className={styles.business__tab}>
      {payoutRequests.length === 0 && requests.length === 0 && (
        <Text fz={14} fw={600} c="var(--prune-text-gray-700)">
          No Service Request
        </Text>
      )}
      {payoutRequests.map((req, index) => (
        <RequestAccess
          key={index}
          title="Payout Account Request"
          date={req.createdAt}
          status={req.status}
        />
      ))}

      {requests.map((req, index) => (
        <RequestAccess
          key={index}
          title={"Issued Accounts Access Request"}
          date={req.createdAt}
          status={req.status}
        />
      ))}
    </div>
  );
};

interface IProps {
  title: string;
  date: Date;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

const RequestAccess = ({ title, date, status }: IProps) => {
  return (
    <div className={styles.top__container}>
      <Text fz={12} fw={600} tt="uppercase">
        {title}
      </Text>

      <Grid mt={20} className={styles.grid__container}>
        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            labelProps={{
              fz: 12,
              fw: 400,
              tt: "capitalize",
              c: "var(--prune-text-gray-500",
            }}
            label="Request Date"
            placeholder={dayjs(date).format("Do MMMM, YYYY")}
          />
        </GridCol>

        <GridCol span={4} className={styles.grid}>
          <TextInput
            readOnly
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            label="Status"
            labelProps={{
              fz: 12,
              fw: 400,
              tt: "capitalize",
              c: "var(--prune-text-gray-500",
            }}
            styles={{
              input: {
                color: approvedBadgeColor(status),
                textTransform: "capitalize",
              },
            }}
            value={status.toLowerCase()}
            // placeholder={status}
            tt="capitalize"
          />
        </GridCol>
      </Grid>
    </div>
  );
};
