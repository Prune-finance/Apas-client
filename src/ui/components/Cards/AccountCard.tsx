import {
  Badge,
  Card,
  CardProps,
  CardSection,
  CopyButton,
  Group,
  Skeleton,
  Text,
  ThemeIcon,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { GiEuropeanFlag, GiUsaFlag, GiNigeria } from "react-icons/gi";
import { SecondaryBtn } from "../Buttons";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface Props extends CardProps {
  currency: string;
  companyName?: string;
  iban: string;
  bic: string;
  balance: number;
  link?: string;
  loading: boolean;
  badgeText?: string;
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
  ...props
}: Props) => {
  return link ? (
    <Card
      padding={19}
      radius={8}
      component={Link}
      href={link}
      classNames={{
        root: styles.account__card,
        section: styles.account__card__section,
      }}
      style={{ cursor: "pointer" }}
      {...props}
    >
      <CardSection px={19} py={13} c="#fff">
        <Group justify="space-between">
          <Group>
            <ThemeIcon color="#0052B4" radius="xl">
              <GiEuropeanFlag />
            </ThemeIcon>

            {!loading ? (
              <Text>{`${currency} ${
                companyName ? "- " + companyName : ""
              }`}</Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}
          </Group>

          <Badge tt="capitalize" color="#fff" c="#000" fz={10} fw={500}>
            {badgeText ? badgeText : "Account"}
          </Badge>
        </Group>
      </CardSection>

      <Group justify="space-between" mt={27.47}>
        <Group gap={2} align="center" c="var(--prune-text-gray-900)">
          <Text tt="uppercase" fz={10} fw={400}>
            IBAN:
          </Text>
          {!loading ? (
            <Text fz={14} fw={600}>
              {iban}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}
        </Group>

        <CopyButton value={iban}>
          {({ copied, copy }) => (
            <SecondaryBtn
              icon={copied ? IconCheck : IconCopy}
              text={copied ? "Copied" : "Copy"}
              action={copy}
              variant="transparent"
              td="underline"
            />
          )}
        </CopyButton>
      </Group>

      {!loading ? (
        <Text c="var(--prune-text-gray-900)" fz={26} fw={600} mt={13}>
          {formatNumber(balance, true, "EUR")}
        </Text>
      ) : (
        <Skeleton mt={13.61} h={30} w={100} />
      )}

      <Group gap={2} align="center" mt={13} c="var(--prune-text-gray-900)">
        <Text tt="uppercase" fz={10} fw={400}>
          BIC:
        </Text>
        {!loading ? (
          <Text fz={14} fw={600}>
            {bic}
          </Text>
        ) : (
          <Skeleton h={10} w={100} />
        )}
      </Group>
    </Card>
  ) : (
    <Card
      padding={19}
      radius={8}
      classNames={{
        root: styles.account__card,
        section: styles.account__card__section,
      }}
      {...props}
    >
      <CardSection px={19} py={13} c="#fff">
        <Group justify="space-between">
          <Group>
            <ThemeIcon color="#0052B4" radius="xl">
              <GiEuropeanFlag />
            </ThemeIcon>

            {!loading ? (
              <Text>{`${currency} ${
                companyName ? "- " + companyName : ""
              }`}</Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}
          </Group>

          <Badge tt="capitalize" color="#fff" c="#000" fz={10} fw={500}>
            {badgeText ? badgeText : "Account"}
          </Badge>
        </Group>
      </CardSection>

      <Group justify="space-between" mt={27.47}>
        <Group gap={2} align="center" c="var(--prune-text-gray-900)">
          <Text tt="uppercase" fz={10} fw={400}>
            IBAN:
          </Text>
          {!loading ? (
            <Text fz={14} fw={600}>
              {iban}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}
        </Group>

        <CopyButton value={iban}>
          {({ copied, copy }) => (
            <SecondaryBtn
              icon={copied ? IconCheck : IconCopy}
              text={copied ? "Copied" : "Copy"}
              action={copy}
              variant="transparent"
              td="underline"
            />
          )}
        </CopyButton>
      </Group>

      {!loading ? (
        <Text c="var(--prune-text-gray-900)" fz={26} fw={600} mt={13.61}>
          {formatNumber(balance, true, "EUR")}
        </Text>
      ) : (
        <Skeleton mt={13.61} h={20} w={100} />
      )}

      <Group gap={2} align="center" mt={13} c="var(--prune-text-gray-900)">
        <Text tt="uppercase" fz={10} fw={400}>
          BIC:
        </Text>
        {!loading ? (
          <Text fz={14} fw={600}>
            {bic}
          </Text>
        ) : (
          <Skeleton h={10} w={100} />
        )}
      </Group>
    </Card>
  );
};
