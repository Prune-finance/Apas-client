import Photo1 from "@/assets/questionnaire/questionnaire1.png";
import Photo2 from "@/assets/questionnaire/questionnaire2.png";
import Photo3 from "@/assets/questionnaire/questionnaire3.png";
import Photo4 from "@/assets/questionnaire/questionnaire4.png";
import Photo5 from "@/assets/questionnaire/questionnaire5.png";
import Icon from "@/assets/LogoWhite.png";
import { BackgroundImage, Group, Image, Stack, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function NavbarContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams?.get("step");
  const step = stepParam !== null ? parseInt(stepParam, 10) : null;

  const selectedTestimonial = useMemo(() => {
    if (step === null || isNaN(step) || step < 0 || step > 4) return navBarPhotos[0];
    return navBarPhotos[step];
  }, [step]);

  return (
    <BackgroundImage
      src={selectedTestimonial.photo || Photo1.src}
      w="100%"
      h="100vh"
      p={32}
    >
      <Stack justify="space-between" c="#fff" h="100%">
        <Group gap={8} wrap="nowrap">
          <Image src={Icon.src} h={36} alt="prune logo" fit="contain" />
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

export default function Navbar() {
  return (
    <Suspense fallback={
      <BackgroundImage src={Photo1.src} w="100%" h="100vh" p={32}>
        <Group gap={8} wrap="nowrap">
          <Image src={Icon.src} h={36} alt="prune logo" fit="contain" />
        </Group>
      </BackgroundImage>
    }>
      <NavbarContent />
    </Suspense>
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
