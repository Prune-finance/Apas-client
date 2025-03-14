import { Box, Group, Text, Title } from "@mantine/core";
import { Suspense } from "react";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import PruneIcon from "@/assets/icon.png";
import { inter, pjs } from "@/ui/fonts";
import { CardOne, CardThree, CardTwo } from "./cards";
import LoginForm from "./form";
import { checkToken } from "@/lib/actions/checkToken";
import { redirect } from "next/navigation";
import { PrimaryBtn } from "@/ui/components/Buttons";

async function Login() {
  const { success } = await checkToken();
  if (success) return redirect("/");

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
              Prune makes your API generation easy, fast and reliable
            </Title>
            <Text fz={14} className={`${styles.text__sub} ${pjs.className}`}>
              {`The API's robust features and seamless integration capabilities
              have transformed the way we handle transactions, manage user
              accounts, and process payments..`}
            </Text>
          </div>
          {/* <div className={styles.notifications}>
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
          </div> */}
        </div>
      </div>

      <div className={styles.login__paper}>
        <Group
          gap={2}
          style={{
            // border: "1px solid red",
            alignSelf: "flex-end",
            justifySelf: "flex-start",
          }}
          justify="flex-end"
          pos="absolute"
          top={36}
          right={43}
        >
          <Text fz={14} className={styles.rdr__text}>
            Having Issues?{" "}
          </Text>
          <PrimaryBtn
            text="Contact Us"
            variant="transparent"
            fz={14}
            fw={600}
            p={0}
            c="var(--prune-primary-800)"
            link="https://prunepayments.com/contact-us"
          />
        </Group>
        <Box w={{ base: "90vw", sm: 394 }}>
          <Image width={29} height={29} src={PruneIcon} alt="prune icon" />

          <Title order={2} className={styles.paper__header}>
            LOG IN
          </Title>

          <Text className={styles.paper__text}>
            Enter your details below to have access to your account
          </Text>
          
          <LoginForm />
        </Box>
      </div>
    </main>
  );
}

export default function LoginWithSuspense() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
