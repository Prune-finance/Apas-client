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
  style?: any;
  size?: number | string;
}

function SuccessModal({
  openedSuccess,
  handleCloseSuccessModal,
  image,
  desc,
  title,
  style,
  size = 400,
}: successModalProps) {
  return (
    <Modal
      opened={openedSuccess}
      onClose={handleCloseSuccessModal}
      centered
      bg="#fff"
      title=""
      size={size}
    >
      <Flex align="center" justify="center" direction="column" mb={40} px={30}>
        <Box style={style}>
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
