import Photo1 from "@/assets/questionnaire/questionnaire1.png";
import Photo2 from "@/assets/questionnaire/questionnaire2.png";
import Photo3 from "@/assets/questionnaire/questionnaire3.png";
import Photo4 from "@/assets/questionnaire/questionnaire4.png";
import Photo5 from "@/assets/questionnaire/questionnaire5.png";
import Icon from "@/assets/icon.png";
import { BackgroundImage, Box, Group, Image, Stack, Text } from "@mantine/core";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function Navbar() {
  const { slug } = useParams();
  const isServices = slug && slug[0] === "services";
  const isOperationsAccount = isServices && slug[1] === "operations-account";
  const isVirtualAccount = isServices && slug[1] === "virtual-account";

  const selectedTestimonial = useMemo(() => {
    switch (true) {
      case slug === undefined:
        return navBarPhotos[0];
      case isOperationsAccount:
        return navBarPhotos[2];
      case isVirtualAccount:
        return navBarPhotos[3];
      case isServices:
        return navBarPhotos[1];
      default:
        return navBarPhotos[4];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug?.[0], slug?.[1], isOperationsAccount, isServices]);

  return (
    <BackgroundImage
      src={selectedTestimonial.photo || Photo1.src}
      w="100%"
      h="100vh"
      p={32}
    >
      <Stack justify="space-between" c="#fff" h="100%">
        <Group gap={8} wrap="nowrap">
          <Image src={Icon.src} alt="Logo" w={33} h={33} />
          <Text fz={20} fw={600} c="#fff">
            Prune Payments
          </Text>
        </Group>

        <Stack gap={4}>
          <Text fz={24} fw={700} mb={12}>
            {selectedTestimonial.comment}
          </Text>
          <Text fz={16} fw={700}>
            {selectedTestimonial.name}
          </Text>
          <Text fz={14} fw={400}>
            {selectedTestimonial.position}
          </Text>
        </Stack>
      </Stack>
    </BackgroundImage>
  );
}

const navBarPhotos = [
  {
    photo: Photo1.src,
    comment: "Just what I needed to settle my distributors.",
    name: "Karen Yue",
    position: "Director of Digital Marketing Technology",
  },
  {
    photo: Photo2.src,
    comment: "Simplified our international payments process.",
    name: "Oluwaseun Adebayo",
    position: "Finance Director",
  },
  {
    photo: Photo3.src,
    comment: "Great platform for managing client accounts.",
    name: "Charlotte Hughes",
    position: "Operations Manager",
  },
  {
    photo: Photo4.src,
    comment: "Streamlined our remittance operations.",
    name: "Chibueze Okonkwo",
    position: "Head of Payments",
  },
  {
    photo: Photo5.src,
    comment: "Perfect solution for our virtual account needs.",
    name: "Victoria Blackwood",
    position: "Treasury Manager",
  },
];
