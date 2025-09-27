import { useRef, useState, useMemo, useEffect } from "react";
import { Flex, FloatingIndicator, Image, UnstyledButton } from "@mantine/core";
import GBImage from "@/assets/GB.png";
import EUImage from "@/assets/EU-icon.png";
import GHSImage from "@/assets/GH.png";
import classes from "./styles.module.scss";
import useCurrencySwitchStore from "@/lib/store/currency-switch";

const data = [
  {
    title: "EUR",
    icon: (
      <Image
        src={EUImage.src}
        alt="EUR"
        width={18}
        height={18}
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
        width={18}
        height={18}
        style={{ zIndex: 1 }}
      />
    ),
  },
  {
    title: "GHS",
    icon: (
      <Image
        src={GHSImage.src}
        alt="GHS"
        width={18}
        height={18}
        style={{ zIndex: 1 }}
      />
    ),
  },
];

function CurrencyTab() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controlsRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { switchCurrency, setSwitchCurrency } = useCurrencySwitchStore();

  // Convert switchCurrency to an index
  const active = useMemo(
    () => data.findIndex((item) => item?.title === switchCurrency),
    [switchCurrency]
  );

  const setControlRef = (index: number) => (node: HTMLButtonElement | null) => {
    if (node) {
      controlsRefs.current[index] = node;
    }
  };

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={item?.title}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => setSwitchCurrency(item?.title as "EUR" | "GBP")}
      mod={{ active: active === index }}
      fz={14}
      w={63}
    >
      <Flex align="center" gap={4}>
        {item.icon}
        <span className={classes.controlLabel}>{item.title}</span>
      </Flex>
    </UnstyledButton>
  ));

  return (
    <div className={classes.root} ref={rootRef}>
      {controls}

      {mounted && controlsRefs.current[active] && rootRef.current && (
        <FloatingIndicator
          target={controlsRefs.current[active]}
          parent={rootRef.current}
          className={classes.indicator}
        />
      )}
    </div>
  );
}

export default CurrencyTab;
