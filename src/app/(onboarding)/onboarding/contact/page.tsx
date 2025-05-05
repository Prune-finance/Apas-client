"use client";

import React, { useState } from "react";
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridCol,
  Image,
  Text,
} from "@mantine/core";
import ContactFAQIcon from "@/assets/contact-faq-icon.png";
import { PrimaryBtn } from "@/ui/components/Buttons";
import AvatarStack from "@/ui/components/AvatarStack";
import { SearchInput } from "@/ui/components/Inputs";

function Page() {
  const [search, setSearch] = useState("");
  return (
    <Box>
      <Flex align="center" justify="center" mt={96} direction="column" gap={24}>
        <Badge
          radius={16}
          bg="#F2FBB2"
          c="#344054"
          px={8}
          py={2}
          fz={12}
          fw={400}
        >
          FAQ
        </Badge>
        <Text fz={48} fw={600} c="#344054">
          Still Have Any Questions?
        </Text>

        <Text fz={20} fw={400} c="#667085">
          Then don’t hesitate to get in touch with us. We’ll help in any way we
          can.
        </Text>

        <Flex align="center" justify="center" gap={8}>
          <SearchInput size="lg" search={search} setSearch={setSearch} />
          <PrimaryBtn text="Search" w={177} h={48} fz={14} fw={600} />
        </Flex>
      </Flex>

      <Box mt={96}>
        <Text fz={36} fw={600} c="#344054" mb={16}>
          Frequently Asked Questions
        </Text>

        <Text fz={20} fw={400} c="#667085">
          Here are the most asked questions based from our users.
        </Text>

        <Container size={900}>
          <Grid align="center" justify="center" mt={96} gutter={32}>
            {data?.map((d, i) => (
              <GridCol span={6} key={i}>
                <Image
                  src={ContactFAQIcon.src}
                  alt="icon"
                  h={48}
                  w={48}
                  mb={20}
                />

                <Box w={384}>
                  <Text fz={20} fw={600} c="#344054" mb={8}>
                    {d?.title}
                  </Text>

                  <Text fz={16} fw={400} c="#667085">
                    {d?.desc}
                  </Text>
                </Box>
              </GridCol>
            ))}
          </Grid>
        </Container>

        <Box bg="#FCFCFD" p={40} mt={64} mb={96}>
          <Flex align="center" justify="center" direction="column">
            <AvatarStack images={imagesArray} maxVisible={5} />

            <Text fz={20} fw={600} c="#344054" mt={32}>
              Join Our Support Live Chat
            </Text>

            <Text fz={18} fw={400} c="#667085" mt={8}>
              If you still have other questions, why not join our live chat
              channel?
            </Text>

            <PrimaryBtn
              text="Get in Touch"
              mt={32}
              w={177}
              h={48}
              fz={14}
              fw={600}
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

const imagesArray = [
  "https://res.cloudinary.com/eworldtech/image/upload/v1746456589/Avatar_rdivgr.png",
  "https://res.cloudinary.com/eworldtech/image/upload/v1746456589/Avatar_1_kjliiy.png",
  "https://res.cloudinary.com/eworldtech/image/upload/v1746456589/Avatar_2_jgisfu.png",
  "https://res.cloudinary.com/eworldtech/image/upload/v1746456589/Avatar_3_nhyfqd.png",
  "https://res.cloudinary.com/eworldtech/image/upload/v1746456590/Avatar_4_umhl1m.png",
];

const data = [
  {
    title: " Do you offer refund?",
    desc: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  },

  {
    title: "Can i try free trial now?",
    desc: "Eget dolor morbi non arcu risus quis. Tincidunt dui ut ornare lectus sit amet est placerat.  vestibulum lorem sed risus ultricies.",
  },

  {
    title: "How can i reach support?",
    desc: "Enim praesent elementum facilisis leo. Diam donec adipiscing tristique risus nec feugiat in fermentum. Non diam phasellus.",
  },

  {
    title: "Will it work for me?",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  },

  {
    title: "How much does it cost?",
    desc: "Eget dolor morbi non arcu risus quis. Tincidunt dui ut ornare lectus sit amet est placerat.  vestibulum lorem sed risus ultricies.",
  },

  {
    title: "How to change profile pics?",
    desc: "Enim praesent elementum facilisis leo. Diam donec adipiscing tristique risus nec feugiat in fermentum. Non diam phasellus.",
  },
];

export default Page;
