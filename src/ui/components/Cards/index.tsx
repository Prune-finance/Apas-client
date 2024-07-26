import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Paper,
  Skeleton,
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
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";

import EmptyImage from "@/assets/empty.png";
import Image from "next/image";

interface ICardOne {
  title: string;
  stat: number;
  text: React.ReactElement;
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

const SeeAll = () => {
  return (
    <div className={styles.card__link}>
      <Text fz={9} td="underline">
        See All
      </Text>
      <IconChevronRight size={11} />
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
      withBorder={!!withBorder}
      className={styles.card__one}
      style={{ height: container ? "100%" : "130px" }}
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
  subText: string;
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
                <Text fz={12} fw={600} className={styles.header__text}>
                  {item.title}
                </Text>
                <Text fz={12} fw={600} className={styles.header__text}>
                  {formatNumber(item.amount, true, "EUR")}
                </Text>
              </div>

              <div className={styles.item__subs}>
                <Text className={styles.sub__text} fz={10}>
                  {item.subText}
                </Text>

                <Badge
                  color={badgeColor(item.status)}
                  tt="capitalize"
                  fz={10}
                  fw={400}
                  variant="light"
                >
                  {item.status.toLowerCase()}
                </Badge>
                {/* <div className={styles.status__container}>
                  <IconPointFilled
                    size={12}
                    color={
                      item.status === CardTwoStatus.APPROVED
                        ? "#12B76A"
                        : item.status === CardTwoStatus.REJECTED
                        ? "#D92D20"
                        : "#C6A700"
                    }
                  />
                  <Text
                    tt="capitalize"
                    fz={10}
                    c={
                      item.status === CardTwoStatus.APPROVED
                        ? "#12B76A"
                        : item.status === CardTwoStatus.REJECTED
                        ? "#D92D20"
                        : "#C6A700"
                    }
                  >
                    {item.status}
                  </Text>
                </div> */}
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
  subTitle: string;
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
}

export function CardFour({ title, link, items }: ICardFour) {
  return (
    <div className={styles.card__four}>
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
            <Link href={item.link} key={index}>
              <div className={styles.item__container}>
                <div className={styles.item__header}>
                  <Avatar
                    variant="filled"
                    color="rgb(242, 251, 178)"
                    radius="sm"
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
                      {item.type} Account
                    </Text>
                  </div>

                  <Text fz={10} fw={500} className={styles.header__text}>
                    {dayjs(item.date).format("DD MMM, YYYY")}
                  </Text>
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
    </div>
  );
}
