import {
  Badge,
  Box,
  Card,
  CardProps,
  CardSection,
  CopyButton,
  Group,
  Loader,
  Skeleton,
  Switch,
  Text,
  ThemeIcon,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { GiEuropeanFlag, GiUsaFlag, GiNigeria } from "react-icons/gi";
import { SecondaryBtn } from "../Buttons";
import { IconCheck, IconCopy, IconReload } from "@tabler/icons-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { SeeAll } from ".";
import { MouseEvent, useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";
import NewAccountCard from "./NewAccountCard";

interface Props extends CardProps {
  currency: string;
  companyName?: string;
  iban: string;
  bic: string;
  balance: number;
  link?: string;
  loading: boolean;
  badgeText?: string;
  business?: boolean;
  disable?: boolean;
  children?: React.ReactNode;
  refresh?: boolean;
  revalidate?: () => Promise<void>;
}

export const AccountCard = ({
  currency,
  companyName,
  iban,
  bic,
  balance,
  link,
  loading,
  badgeText,
  business,
  disable,
  children,
  refresh,
  revalidate,
  ...props
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleSuccess } = useNotification();
  const axios = createAxiosInstance("accounts");

  const handlePropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    // return false;
  };

  const handleReload = async () => {
    setProcessing(true);
    try {
      await axios.get(`/accounts/${iban}/balance/dashboard`);
      revalidate && (await revalidate());
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <NewAccountCard
        currency={currency}
        companyName={companyName}
        link={link}
        iban={iban}
        bic={bic}
        balance={balance}
        loading={loading}
        badgeText={badgeText}
        business={business}
        disable={disable}
        refresh={refresh}
        revalidate={revalidate}
        {...props}
      />
    </>
  );
};
