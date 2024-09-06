import { inter } from "@/ui/fonts";
import { Box, Flex, Image, Modal, Text } from "@mantine/core";
import { StaticImageData } from "next/image";
import React from "react";

interface successModalProps {
  openedSuccess: boolean;
  handleCloseSuccessModal: () => void;
  image?: StaticImageData | string;
  desc?: any;
  title?: string;
}

function SuccessModal({
  openedSuccess,
  handleCloseSuccessModal,
  image,
  desc,
  title,
}: successModalProps) {
  return (
    <Modal
      opened={openedSuccess}
      onClose={handleCloseSuccessModal}
      centered
      bg="#fff"
      title=""
      size={400}
    >
      <Flex align="center" justify="center" direction="column" mb={40} px={30}>
        <Box>
          <Image src={image} h="100%" w="100%" alt="success-modal-image" />
        </Box>
        <Text fz={16} fw={600} c="#000">
          {title ? title : "Business Creation Successful"}
        </Text>
        <Text fz={14} c="#667085" ta="center" mt={10}>
          {desc ? desc : "You have successfully created a new business"}
        </Text>
      </Flex>
    </Modal>
  );
}

export default SuccessModal;
