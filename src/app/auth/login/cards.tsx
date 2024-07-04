import { Divider, Skeleton, Text } from "@mantine/core";
import { motion } from "framer-motion";
import Image from "next/image";

import EU from "@/assets/eu.png";
import UK from "@/assets/uk.png";
import US from "@/assets/us.png";
import styles from "@/ui/styles/auth.module.scss";

export function CardOne() {
  return (
    <motion.div
      className={`${styles.card} ${styles.card__one}`}
      animate={{ x: 0, rotate: 2.5 }}
      initial={{ x: 500 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
    >
      <div className={`${styles.images__container}`}>
        <Image
          width={37.25}
          height={37.25}
          src={EU}
          alt="European Union Flag"
        />
        <Image
          width={37.25}
          height={37.25}
          src={UK}
          alt="United Kingdom Flag"
        />
        <Image width={37.25} height={37.25} src={US} alt="United States Flag" />
        <Divider w={200} color="#f0f2f5" my="sm" size="xs" />
      </div>

      <CardInfo />
    </motion.div>
  );
}

export function CardTwo() {
  return (
    <motion.div
      animate={{ x: 0, rotate: -5 }}
      initial={{ x: 500 }}
      transition={{ ease: "easeOut", duration: 0.7 }}
      className={`${styles.card} ${styles.card__two}`}
    >
      <div className={`${styles.images__container}`}>
        <Image width={37.25} height={37.25} src={US} alt="United States Flag" />
        <Image
          width={37.25}
          height={37.25}
          src={EU}
          alt="European Union Flag"
        />
        <Image
          width={37.25}
          height={37.25}
          src={UK}
          alt="United Kingdom Flag"
        />
        <Divider w={200} color="#f0f2f5" my="sm" size="xs" />
      </div>

      <CardInfo />
    </motion.div>
  );
}

export function CardThree() {
  return (
    <motion.div
      animate={{ x: 0, rotate: -10 }}
      initial={{ x: 500 }}
      transition={{ ease: "easeOut", duration: 1.1 }}
      className={`${styles.card} ${styles.card__three}`}
    >
      <div className={`${styles.images__container}`}>
        <Image
          width={37.25}
          height={37.25}
          src={UK}
          alt="United Kingdom Flag"
        />
        <Image
          width={37.25}
          height={37.25}
          src={EU}
          alt="European Union Flag"
        />
        <Image width={37.25} height={37.25} src={US} alt="United States Flag" />
        <Divider w={200} color="#f0f2f5" my="sm" size="xs" />
      </div>

      <CardInfo />
    </motion.div>
  );
}

const CardInfo = () => {
  return (
    <div className={styles.card__info}>
      <div className={styles.info}>
        <Text fz={14} className={styles.info__text}>
          Account Holder
        </Text>
        <Skeleton height={13.39} mt={6} width={152.36} radius="xl" />
      </div>

      <div className={styles.info}>
        <Text fz={14} className={styles.info__text}>
          Account Number
        </Text>
        <Skeleton height={13.39} mt={6} width={105.87} radius="xl" />
      </div>

      <div className={styles.info}>
        <Text fz={14} className={styles.info__text}>
          IBAN
        </Text>
        <Skeleton height={13.39} mt={6} width={218.11} radius="xl" />
      </div>

      <div className={styles.info}>
        <Text fz={14} className={styles.info__text}>
          Sort Code
        </Text>
        <Skeleton height={13.39} mt={6} width={72.2} radius="xl" />
      </div>

      <div className={styles.info}>
        <Text fz={14} className={styles.info__text}>
          ACH Routing
        </Text>
        <Skeleton height={13.39} mt={6} width={98.95} radius="xl" />
      </div>
    </div>
  );
};
