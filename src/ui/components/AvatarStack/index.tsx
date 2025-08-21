import { Avatar, AvatarGroup, Text } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

interface AvatarStack {
  images: string[];
  maxVisible?: number;
}

const AvatarStack: React.FC<AvatarStack> = ({ images, maxVisible = 2 }) => {
  // Calculate how many additional images are not shown
  const additionalCount = Math.max(0, images.length - maxVisible);
  // Get images to display (limited by maxVisible)
  const visibleImages = images.slice(0, maxVisible);

  return (
    <>
      <AvatarGroup spacing="lg">
        {visibleImages.map((image: string, index: number) => (
          <Avatar key={index} src={image} radius="xl" size={68} />
        ))}

        {/* Show the "+" indicator if there are additional images */}
        {additionalCount > 0 && (
          <Avatar
            radius="xl"
            size={68}
            bg="#D3CCFF"
            color="#000"
            style={{ border: `1px solid #FFFAFA` }}
          >
            {additionalCount <= 99 ? (
              <Text fz={20}>+</Text>
            ) : (
              <IconUsers size={18} />
            )}
          </Avatar>
        )}
      </AvatarGroup>
    </>
  );
};

export default AvatarStack;
