import { useState } from "react";
import { Flex, FloatingIndicator, Image, UnstyledButton } from "@mantine/core";
import GBImage from "@/assets/GB.png";
import EUImage from "@/assets/EU-icon.png";
import classes from "./styles.module.scss";

const data = [
  {
    title: "EUR",
    icon: (
      <Image
        src={EUImage.src}
        alt="EUR"
        width={20}
        height={20}
        style={{ zIndex: 1 }}
      />
    ),
  },
  {
    title: "GBP",
    icon: (
      <Image
        src={GBImage.src}
        alt="GBP"
        width={20}
        height={20}
        style={{ zIndex: 1 }}
      />
    ),
  },
];

function CurrencyTab() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const [active, setActive] = useState(0);

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={item?.title}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
      fz={14}
      w={63}
    >
      <Flex align="center" gap={4}>
        {item?.icon}
        <span className={classes.controlLabel}>{item?.title}</span>
      </Flex>
    </UnstyledButton>
  ));

  return (
    <div className={classes.root} ref={setRootRef}>
      {controls}

      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className={classes.indicator}
      />
    </div>
  );
}

export default CurrencyTab;
