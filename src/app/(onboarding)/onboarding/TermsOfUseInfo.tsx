import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface TermsOfUseInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const TermsOfUseInfo = ({ setActive, active }: TermsOfUseInfo) => {
  return (
    <Box>
      <Text fz={24} fw={600} c="#344054">
        Read through Terms of use
      </Text>
      <Text c="#667085" fz={14} fw={500}>
        Understand our terms and policies
      </Text>

      <Text fz={14} fw={400} c="#344054" td="underline" mt={24}>
        Who we are and what we do
      </Text>

      <Text mt={24} fz={14} c="#667085">
        Prune Payments Limited is a UK company incorporated and licensed under
        the laws of the United Kingdom, (company number 07762021) with its
        Registered Office at 35-37 Ludgate Hill, Office 7, London, England, EC4M
        7JN. We are an entity committed to providing seamless money transfers
        and aim to ensure that regulatory compliance is at the fore of our
        existence through strict adherence to International regulations.
        Resultantly, we are authorized and regulated by the Financial Conduct
        Authority (“FCA”) as an Authorized Payment Institution (firm reference
        number 670226).This license enables us to open multiple doors to
        opportunities across International borders. We have a presence in the
        UK, across Europe and even Africa.
      </Text>

      <Text mt={24} fz={14} c="#667085">
        Our API license can be viewed on the FCA register at: 
      </Text>

      <Text fz={14} fw={400} c="#667085" td="underline" mt={24}>
        https://register.fca.org.uk/s/firm?id=001b000000k208LAAQ
      </Text>

      <Text mt={24} fz={14} c="#667085">
        Please note that by using our mobile application, visiting our website
        and accessing the information, resources, services, products and tools
        we provide for you, it is deemed that you agree to use these resources
        only for the purposes intended as permitted by:  these terms of use; 
        applicable laws;  regulations;   and generally accepted online practices
        or guidelines;   ‍Language & information The language of any agreement
        between Prune Payments Limited and its users (including these Terms of
        Use and our Privacy Policy) is English. Consequently, all transactions,
        payment instructions and services carried out, will be in English. Upon
        registering for a Prune account, the terms of use will be made available
        to you within the mobile application or on our website. Information on
        these Terms
      </Text>

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={500} />

        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={500}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn text="Next" w={126} fw={500} action={() => {}} />
        </Flex>
      </Flex>
    </Box>
  );
};
