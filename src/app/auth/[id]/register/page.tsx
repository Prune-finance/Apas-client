import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import PruneIcon from "@/assets/icon.png";
import { inter, pjs } from "@/ui/fonts";
import { CardOne, CardThree, CardTwo } from "./cards";

import FormComponent from "./form";
import { checkToken } from "@/lib/actions/server";
import Link from "next/link";
import { PrimaryBtn } from "@/ui/components/Buttons";

type Props = {
  params: {
    id?: string;
  };
};

export default async function Register({ params }: Props) {
  const id = params.id;
  const res = await checkToken(id || "");

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
              The API's robust features and seamless integration capabilities
              have transformed the way we handle transactions, manage user
              accounts, and process payments..
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
          flex={1}
          style={{
            // border: "1px solid red",
            alignSelf: "flex-end",
            justifySelf: "flex-start",
          }}
          justify="flex-end"
          // pos="absolute"
          // top={36}
          // right={43}
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
            link="https://prune-payments.gitbook.io/prune-api-services/"
          />
        </Group>

        <Box w={{ base: "90vw", sm: 394 }} flex={5}>
          <Stack justify="space-between" h="100%">
            <Box>
              <Image width={29} height={29} src={PruneIcon} alt="prune icon" />

              <Title order={2} className={styles.paper__header}>
                CREATE ACCOUNT
              </Title>

              <Text className={styles.paper__text}>
                Create your payment account now
              </Text>

              <FormComponent email={res.email} />

              <Group
                gap={2}
                mt={10}
                style={{ fontFamily: inter.style.fontFamily }}
                mb="auto"
              >
                <Text fz={14}>Already have an account?</Text>
                <PrimaryBtn
                  variant="transparent"
                  text="Sign In"
                  link="/auth/login"
                  c="var(--prune-primary-700)"
                  fz={14}
                  px={0}
                  fw={600}
                />
              </Group>
            </Box>

            <Flex
              gap={2}
              align="center"
              wrap="wrap"
              columnGap={2}
              style={{ fontFamily: inter.style.fontFamily }}
            >
              <Text fz={14} p={0} m={0}>
                By clicking on Sign Up, you agree to our
              </Text>
              <PrimaryBtn
                text="Privacy Policy"
                variant="transparent"
                fz={14}
                fw={600}
                p={0}
                m={0}
                c="var(--prune-primary-800)"
                link="https://prunepayments.com/privacy-policy"
                h={"auto"}
              />
              <Text fz={14}>and</Text>
              <PrimaryBtn
                text="Terms of Use"
                variant="transparent"
                fz={14}
                fw={600}
                p={0}
                m={0}
                c="var(--prune-primary-800)"
                link="https://app.prunepayments.com/docs/termsofService.pdf"
                h={"auto"}
              />
            </Flex>
          </Stack>
        </Box>
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
