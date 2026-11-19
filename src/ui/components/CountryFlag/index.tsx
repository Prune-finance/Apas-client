"use client";

import { useEffect, useState } from "react";

// Maps currency codes to their ISO 2-letter country codes for flagcdn.com
const currencyToCountry: Record<string, string> = {
  EUR: "eu",
  GBP: "gb",
  USD: "us",
  GHS: "gh",
  NGN: "ng",
  UK: "gb",
};

/**
 * The code to show a currency's flag with. Shared currencies (EUR) use their own flag,
 * since their country code from the API (e.g. EZ) has no flag; others use the country.
 */
export const currencyFlagCode = (currencyCode: string, countryCode?: string | null) =>
  currencyToCountry[currencyCode?.toUpperCase()] && !["GBP", "USD", "GHS", "NGN"].includes(currencyCode?.toUpperCase())
    ? currencyCode
    : countryCode || currencyCode;

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
  /** Circular flag (circle-flags set) instead of the rectangular flagcdn image */
  round?: boolean;
}

// circle-flags by HatScripts (MIT), served by jsDelivr: each flag is drawn as a circle, so nothing is cropped
const CIRCLE_FLAGS = "https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags";

export default function CountryFlag({ code, size = 20, style, round }: CountryFlagProps) {
  const upper = (code ?? "").toUpperCase();
  // Shared currencies (EUR) win over whatever country code came with them
  const isoCode = currencyToCountry[upper] ?? (upper.length === 2 ? upper.toLowerCase() : null);
  // Sources to try in turn when one has no flag for the code; after the last, the emoji below
  const sources = isoCode
    ? round
      ? [`${CIRCLE_FLAGS}/${isoCode}.svg`, `https://flagcdn.com/w40/${isoCode}.png`]
      : [`https://flagcdn.com/w40/${isoCode}.png`]
    : [];
  const [attempt, setAttempt] = useState(0);
  useEffect(() => setAttempt(0), [upper]);

  if (attempt < sources.length) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sources[attempt]}
        alt={upper}
        height={size}
        width={size}
        style={{ objectFit: round ? "cover" : "contain", flexShrink: 0, borderRadius: round ? "50%" : 2, ...style }}
        onError={() => setAttempt((a) => a + 1)}
      />
    );
  }

  return (
    <span
      style={{
        fontSize: size, lineHeight: 1, flexShrink: 0, ...style,
        display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}
      role="img"
      aria-label={upper}
    >
      {getFlagEmoji(upper)}
    </span>
  );
}
