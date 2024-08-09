import { Text, Title } from "@mantine/core";
import { Suspense } from "react";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import PruneIcon from "@/assets/icon.png";
import { inter, pjs } from "@/ui/fonts";
import { CardOne, CardThree, CardTwo } from "./cards";
import LoginForm from "./form";
import { checkToken } from "@/lib/actions/checkToken";
import { redirect } from "next/navigation";

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
          LOG IN
        </Title>

        <Text className={styles.paper__text}>
          Enter your details below to have access to your account
        </Text>

        <LoginForm />

        {/* <div className={styles.text__input__container}>
          <Text fz={12} px={10} className={styles.container__label}>
            Email
          </Text>
          <TextInput
            size="xs"
            classNames={{
              input: styles.text__input,
            }}
            placeholder="jane.zi@prune.io"
            {...form.getInputProps("email")}
          />
        </div>

        <div className={styles.text__input__container}>
          <Text fz={12} px={10} className={styles.container__label}>
            Password
          </Text>
          <PasswordInput
            size="xs"
            classNames={{
              input: styles.text__input,
            }}
            placeholder="******************"
            {...form.getInputProps("password")}
          />
        </div>

        <div className={styles.login__actions}>
          <Checkbox label="Remember me" size="xs" color="#C1DD06" />

          <Button
            className={styles.login__cta}
            variant="filled"
            color="#C1DD06"
            onClick={handleLogin}
            loading={processing}
          >
            Log In
          </Button>
        </div>

        <div className={styles.rdr__link}>
          <Text fz={14} className={styles.rdr__text}>
            Forgot Password?
          </Text>
          <Text fz={14} mt={10} className={styles.rdr__text}>
            New user?{" "}
            <Text fz={14} span className={styles.register__rdr}>
              Learn how to sign up
            </Text>
          </Text>
        </div> */}
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
