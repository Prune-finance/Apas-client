import Image from "next/image";
import { StaticImageData } from "next/image";

import EUIcon from "@/assets/EU-icon.png";
import GBIcon from "@/assets/GB.png";
import GHIcon from "@/assets/GH.png";
import USDIcon from "@/assets/USD.png";
import NGIcon from "@/assets/Nigeria.png";

// Maps both currency codes and ISO 2-letter country codes to local assets.
// Keys are normalised to uppercase.
const flagAssets: Record<string, StaticImageData> = {
  // Currency codes
  EUR: EUIcon,
  GBP: GBIcon,
  USD: USDIcon,
  GHS: GHIcon,
  NGN: NGIcon,

  // ISO country codes
  EU: EUIcon,
  GB: GBIcon,
  UK: GBIcon,
  US: USDIcon,
  GH: GHIcon,
  NG: NGIcon,
};

function getFlagEmoji(code: string) {
  const upper = code.toUpperCase();
  if (upper.length !== 2) return "🌍";
  return (
    String.fromCodePoint(127397 + upper.charCodeAt(0)) +
    String.fromCodePoint(127397 + upper.charCodeAt(1))
  );
}

interface CountryFlagProps {
  code: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * Renders a flag for a currency code (EUR, GBP, USD, GHS, NGN)
 * or an ISO country code (EU, GB, UK, US, GH, NG).
 * Unknown codes fall back to a Unicode flag emoji.
 */
export default function CountryFlag({ code, size = 20, style }: CountryFlagProps) {
  const upper = (code ?? "").toUpperCase();
  const asset = flagAssets[upper];

  if (asset) {
    return (
      <Image
        src={asset}
        alt={upper}
        height={size}
        width={size}
        style={{ objectFit: "contain", flexShrink: 0, ...style }}
      />
    );
  }

  // Emoji fallback — works for any valid 2-letter ISO code
  return (
    <span
      style={{ fontSize: size, lineHeight: 1, flexShrink: 0, ...style }}
      role="img"
      aria-label={upper}
    >
      {getFlagEmoji(upper)}
    </span>
  );
}
