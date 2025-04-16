import Photo1 from "@/assets/questionnaire/questionnaire1.png";
import Photo2 from "@/assets/questionnaire/questionnaire2.png";
import Photo3 from "@/assets/questionnaire/questionnaire3.png";
import Photo4 from "@/assets/questionnaire/questionnaire4.png";
import Photo5 from "@/assets/questionnaire/questionnaire5.png";
import { BackgroundImage, Box } from "@mantine/core";
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
      src={selectedTestimonial.photo}
      w="100%"
      h="100vh"
    ></BackgroundImage>
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
