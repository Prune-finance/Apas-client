import Link from "next/link";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowDownLeft,
  IconChevronRight,
  IconPlus,
  IconPointFilled,
} from "@tabler/icons-react";

import styles from "./styles.module.scss";
import { approvedBadgeColor, formatNumber, getInitials } from "@/lib/utils";
import dayjs from "dayjs";

import EmptyImage from "@/assets/empty.png";
import Image from "next/image";
import { BadgeComponent } from "../Badge";
import { DebitRequest } from "@/lib/hooks/requests";
import DebitDrawer from "@/app/admin/(dashboard)/requests/drawer";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface ICardOne {
  title: string;
  stat: number;
  text?: React.ReactElement;
  link?: string;
  colored?: boolean;
  formatted?: boolean;
  container?: boolean;
  withBorder?: boolean;
  loading?: boolean;
  currency?: string;
  flex?: number;
  btnLink?: string;
}

export const SeeAll = ({
  name = "See All",
  fontSize = 12,
}: {
  name?: string;
  fontSize?: number;
}) => {
  return (
    <div className={styles.card__link}>
      <Text fz={fontSize} td="underline" fw={600}>
        {name}
      </Text>
      <IconChevronRight size={16} />
    </div>
  );
};

export function CardOne({
  title,
  stat,
  text,
  link,
  colored,
  formatted,
  container,
  withBorder,
  loading,
  currency,
  flex,
}: ICardOne) {
  return (
    <Paper
      flex={flex}
      withBorder
      className={styles.card__one}
      style={{ height: container ? "100%" : "130px", borderColor: "#f2f4f7" }}
    >
      <div className={styles.card__title}>
        <Text fz={10} tt="uppercase" fw={600}>
          {title}
        </Text>

        {link && (
          <Link href={link}>
            <SeeAll />
          </Link>
        )}
      </div>

      <div className={styles.card__number}>
        {loading ? (
          <Skeleton w={30} h={10} color="red" />
        ) : (
          <Title fz={24} className={`${colored ? styles.light__green : ""}`}>
            {formatted ? formatNumber(stat, true, currency) : stat}
          </Title>
        )}
      </div>

      <Text fw={500} fz={10} className={styles.card__text}>
        {text}
      </Text>
    </Paper>
  );
}

export function CardOneBtn({
  title,
  stat,
  text,
  link,
  colored,
  formatted,
  container,
  withBorder,
  btnLink,
  loading,
}: ICardOne) {
  return (
    <Paper
      withBorder={!!withBorder}
      className={styles.card__one__btn}
      // style={{ height: "fit-container" }}
    >
      <div className={styles.card__title}>
        <Text fz={10} tt="uppercase" fw={600}>
          {title}
        </Text>

        {link && (
          <Link href={link}>
            <SeeAll />
          </Link>
        )}
      </div>

      <div className={styles.card__number}>
        {loading ? (
          <Skeleton height={20} width={50} />
        ) : (
          <Title fz={24} className={`${colored ? styles.light__green : ""}`}>
            {formatted ? formatNumber(stat, true, "EUR") : stat}
          </Title>
        )}
      </div>

      <Text fw={500} fz={10} className={styles.card__text}>
        {text}
      </Text>

      <Button
        component="a"
        href={btnLink}
        leftSection={<IconArrowDownLeft color="#344054" size={16} />}
        className={styles.login__cta}
        variant="filled"
        color="#D4F307"
      >
        Debit Request
      </Button>
    </Paper>
  );
}

interface ICardTwo {
  title: string;
  link?: string;
  items?: ICardTwoItems[];
}
interface ICardTwoItems {
  title: string;
  amount: number;
  subText: string | JSX.Element;
  status: string;
}
enum CardTwoStatus {
  PENDING = "PENDING",
  REJECTED = "  REJECTED",
  APPROVED = "APPROVED",
}

const badgeColor = (status: string) => {
  switch (status) {
    case CardTwoStatus.APPROVED:
      return "#12B76A";
    case CardTwoStatus.REJECTED:
      return "#D92D20";
    default:
      return "#C6A700";
  }
};
export function CardTwo({ title, link, items }: ICardTwo) {
  return (
    <div className={styles.card__two}>
      <div className={styles.card__title}>
        <Text fz={10} tt="uppercase" fw={600}>
          {title}
        </Text>

        {link && (
          <Link href={link}>
            <SeeAll />
          </Link>
        )}
      </div>

      <div className={styles.items__container}>
        {items?.map((item, index) => {
          return (
            <div key={index} className={styles.item__container}>
              <div className={styles.item__header}>
                <Group>
                  <Avatar
                    variant="filled"
                    color="var(--prune-primary-600)"
                    radius="sm"
                    styles={{
                      placeholder: { color: "var(--prune-text-gray-700)" },
                    }}
                  >
                    {getInitials(item.title)}
                  </Avatar>
                  <Text fz={12} fw={600} className={styles.header__text}>
                    {item.title}
                  </Text>
                </Group>
                <Text fz={12} fw={600} className={styles.header__text}>
                  {formatNumber(item.amount, true, "EUR")}
                </Text>
              </div>

              <div className={styles.item__subs}>
                <Text className={styles.sub__text} fz={10}>
                  {item.subText}
                </Text>

                <Badge
                  color={approvedBadgeColor(item.status)}
                  tt="capitalize"
                  fz={10}
                  fw={400}
                  variant="light"
                >
                  {item.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          );
        })}

        {items && !!!items.length && (
          <Flex
            style={{ flexGrow: 1 }}
            direction="column"
            align="center"
            justify="center"
            mt={24}
          >
            <Image src={EmptyImage} alt="no content" width={120} height={96} />
            <Text mt={14} fz={10} c="#1D2939">
              There are no debit requests.
            </Text>
            {/* <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text> */}
          </Flex>
        )}
      </div>
    </div>
  );
}

interface ICardThree {
  title: string;
  bg: string;
  color: string;
  minTitle: string;
  amount: number;
  percentage: string;
  subTitle?: string;
}
export function CardThree({
  title,
  bg,
  color,
  minTitle,
  amount,
  percentage,
  subTitle,
}: ICardThree) {
  return (
    <div className={styles.card__three}>
      <div className={styles.card__title}>
        <Text
          className={styles.card__title__text}
          fz={10}
          tt="uppercase"
          fw={600}
        >
          {title}
        </Text>
        <IconPointFilled size={14} color={color} />
      </div>

      <div className={styles.card__body}>
        <Text fz={12} fw={500} className={styles.card__body__text}>
          {minTitle}
        </Text>

        <div className={styles.card__body__stats}>
          <Text c={color} fz={23} fw={600} className={styles.stat__one}>
            {formatNumber(amount, false)}
          </Text>
          <Text bg={bg} c={color} className={styles.stat__two} fz={10}>
            {percentage}%
          </Text>
          <Text className={styles.stat__three} fz={10}>
            this month
          </Text>
        </div>

        <Text fz={9} className={styles.card__body__sub}>
          {subTitle}
        </Text>
      </div>
    </div>
  );
}

interface ICardFour {
  title: string;
  link?: string;
  items?: ICardFourItems[];
}

interface ICardFourItems {
  title: string;
  date: Date;
  type: "USER" | "CORPORATE";
  link: string;
  subText: string | JSX.Element;
  status: string;
}

export function CardFour({ title, link, items }: ICardFour) {
  return (
    <Box className={styles.card__four} mb={30}>
      <div className={styles.card__title}>
        <Text fz={10} tt="uppercase" fw={600}>
          {title}
        </Text>

        {link && (
          <Link href={link}>
            <SeeAll />
          </Link>
        )}
      </div>

      <div className={styles.items__container}>
        {items?.slice(0, 3)?.map((item, index) => {
          return (
            <Link href={item.link} key={index}>
              <div className={styles.item__container}>
                <div className={styles.item__header}>
                  <Avatar
                    variant="filled"
                    color="var(--prune-primary-600)"
                    radius="sm"
                    styles={{
                      placeholder: { color: "var(--prune-text-gray-700)" },
                    }}
                  >
                    <Text fw={600} c="#1D2939">
                      {item.title.split(" ")[0].charAt(0)}
                    </Text>{" "}
                    <Text fw={600} c="#1D2939">
                      {item.title.split(" ")[1]?.charAt(0) || ""}
                    </Text>
                  </Avatar>

                  <div className={styles.item__header__text}>
                    <Text
                      fz={12}
                      fw={600}
                      lts={0.5}
                      className={styles.header__text}
                    >
                      {item.title}
                    </Text>
                    <Text tt="capitalize" className={styles.sub__text} fz={10}>
                      {/* {item.type} Account */}
                      {/* {item.subText} */}
                    </Text>
                  </div>

                  {/* <Text fz={10} fw={500} className={styles.header__text}>
                    {dayjs(item.date).format("DD MMM, YYYY")}
                  </Text> */}

                  <Badge
                    color={badgeColor(item.status)}
                    tt="capitalize"
                    fz={10}
                    fw={400}
                    variant="light"
                  >
                    {item.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}

        {items && !!!items.length && (
          <Flex direction="column" align="center" mt={24}>
            <Image src={EmptyImage} alt="no content" width={120} height={96} />
            <Text mt={14} fz={10} c="#1D2939">
              There are no pending account requests.
            </Text>
            {/* <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text> */}
          </Flex>
        )}
      </div>
    </Box>
  );
}

interface ICardFive extends Omit<ICardOne, "text"> {
  borderRight?: boolean;
  locale?: string;
}

export function CardFive({
  title,
  stat,
  link,
  colored,
  formatted,
  container,
  withBorder,
  loading,
  currency,
  flex,
  borderRight,
  locale,
}: ICardFive) {
  return (
    <Paper
      flex={flex}
      withBorder={!!withBorder}
      className={styles.card__one}
      radius={0}
      style={{
        height: container ? "100%" : "130px",
        gap: "16px",
        borderRight: borderRight ? "1px solid #F5F5F5" : "none",
      }}
    >
      <div className={styles.card__title}>
        <Text fz={14} tt="capitalize" fw={400}>
          {title}
        </Text>

        {link && (
          <Link href={link}>
            <SeeAll />
          </Link>
        )}
      </div>

      <div className={styles.card__number}>
        {loading ? (
          <Skeleton w={100} h={35} color="red" />
        ) : (
          <Text
            fz={24}
            className={`${colored ? styles.light__green : ""}`}
            fw={600}
          >
            {formatted ? formatNumber(stat, true, currency, locale) : stat}
          </Text>
        )}
      </div>
    </Paper>
  );
}

interface ICardSix extends Omit<ICardOne, "text"> {
  locale?: string;
  requests: DebitRequest[];
  revalidate: () => Promise<void>;
}

export const DebitRequestCard = ({
  title,
  stat,
  link,
  colored,
  formatted,
  container,
  withBorder,
  loading,
  currency = "EUR",
  flex,
  requests,
  locale,
  revalidate,
}: ICardSix) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );
  return (
    <Paper
      flex={flex}
      withBorder={!!withBorder}
      className={styles.card__one}
      radius={0}
      style={{
        border: "1px solid #F5F5F5",
        height: container ? "100%" : "130px",
        gap: "16px",
        // borderRight: borderRight ? "1px solid #F5F5F5" : "none",
      }}
    >
      <Group justify="space-between">
        <Text fz={10} tt="uppercase" fw={600} c="var(--prune-text-gray-600)">
          {title}
        </Text>

        {link && (
          <Link href={link}>
            <SeeAll />
          </Link>
        )}
      </Group>

      {loading &&
        !!!requests.length &&
        Array.from({ length: 4 }).map((_, index, arr) => (
          <Box key={index}>
            <Flex align="center" gap={8}>
              <Skeleton w={35} h={35} />

              <Group justify="space-between" align="center" w="100%">
                <Stack gap={4}>
                  <Skeleton w={120} h={10} />

                  <Skeleton w={100} h={10} />
                </Stack>

                <Stack gap={4} align="end">
                  <Skeleton w={50} h={10} />

                  <Skeleton w={100} h={20} circle />
                </Stack>
              </Group>
            </Flex>
            {arr.length - 1 !== index && (
              <Divider style={{ border: "1px solid #f5f5f5" }} mt={15} />
            )}
          </Box>
        ))}

      {requests.map((request, index, arr) => (
        <Box
          key={request.id}
          onClick={() => {
            setSelectedRequest(request);
            open();
          }}
          style={{ cursor: "pointer" }}
        >
          <Flex align="center" gap={8}>
            <Avatar
              variant="filled"
              color="var(--prune-primary-600)"
              radius="sm"
              styles={{
                placeholder: { color: "var(--prune-text-gray-700)" },
              }}
            >
              {getInitials(request.Account.Company.name)}
            </Avatar>

            <Group justify="space-between" align="center" w="100%">
              <Stack gap={4}>
                <Text fz={12} fw={600} className={styles.header__text}>
                  {request.Account.Company.name}
                </Text>

                <Text fz={10} c="var(--prune-text-gray-400)">
                  Date Created:{" "}
                  {dayjs(request.createdAt).format("DD MMM, YYYY")}
                </Text>
              </Stack>

              <Stack gap={4} align="end">
                <Text fz={12} fw={600} className={styles.header__text}>
                  {formatNumber(request.amount, true, currency)}
                </Text>

                <BadgeComponent fz={10} status={request.status} />
              </Stack>
            </Group>
          </Flex>
          {arr.length - 1 !== index && (
            <Divider style={{ border: "1px solid #f5f5f5" }} mt={15} />
          )}
        </Box>
      ))}

      {!loading && !!!requests.length && (
        <Flex
          style={{ flexGrow: 1 }}
          direction="column"
          align="center"
          justify="center"
          mt={24}
        >
          <Image src={EmptyImage} alt="no content" width={120} height={96} />
          <Text mt={14} fz={10} c="#1D2939">
            There are no debit requests.
          </Text>
          {/* <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text> */}
        </Flex>
      )}

      {selectedRequest && (
        <DebitDrawer
          opened={opened}
          close={close}
          selectedRequest={selectedRequest}
          revalidate={revalidate}
        />
      )}
    </Paper>
  );
};
