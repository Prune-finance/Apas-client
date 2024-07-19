import { Text, Title } from "@mantine/core";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import PruneIcon from "@/assets/icon.png";
import { inter, pjs } from "@/ui/fonts";
import { CardOne, CardThree, CardTwo } from "./cards";

import FormComponent from "./form";
import { checkToken } from "@/lib/actions/server";
import Link from "next/link";

type Props = {
  params: {
    id?: string;
  };
};

export default async function Register({ params }: Props) {
  const id = params.id;
  await checkToken(id || "");

  return (
    <main className={styles.login}>
      <div className={styles.login__frame}>
        <div className={styles.cards}>
          <CardThree />
          <CardTwo />
          <CardOne />
        </div>

        <div className={styles.text__notifications}>
          <div className={styles.text}>
            <Title
              order={3}
              fz={33}
              fw={500}
              className={`${styles.text__title} ${inter.className}`}
            >
              Seamlessly issue accounts with Prune
            </Title>
            <Text fz={14} className={`${styles.text__sub} ${pjs.className}`}>
              The API's robust features and seamless integration capabilities
              have transformed the way we handle transactions, manage user
              accounts, and process payments..
            </Text>
          </div>
          <div className={styles.notifications}>
            <div className={styles.notifications__card}>
              <Image width={66} height={66} src={PruneIcon} alt="prune icon" />
              <div className={styles.card__text}>
                <Text className={`${inter.className}`} fz={17.11} fw={600}>
                  Account Created
                </Text>
                <Text fz={15.18} fw={400} className={styles.text__sub}>
                  Your GBP account has been <br /> created successfully.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.login__paper}>
        <Image width={29} height={29} src={PruneIcon} alt="prune icon" />

        <Title order={2} className={styles.paper__header}>
          CREATE ACCOUNT
        </Title>

        <Text className={styles.paper__text}>
          Create your payment account now
        </Text>

        <FormComponent />

        <div className={styles.rdr__link}>
          <Text fz={14} mt={10} className={styles.rdr__text}>
            Already have an account?{" "}
            <Link href="/auth/login">
              <Text fz={14} span className={styles.register__rdr}>
                Sign in
              </Text>
            </Link>
          </Text>
        </div>
      </div>
    </main>
  );
}

// export default function RegisterWithSuspense() {
//   return (
//     // <Suspense>
//       <Register />
//     {/* </Suspense> */}
//   );
// }
