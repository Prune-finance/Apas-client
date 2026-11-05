// Maps currency codes to their ISO 2-letter country codes for flagcdn.com
const currencyToCountry: Record<string, string> = {
  EUR: "eu",
  GBP: "gb",
  USD: "us",
  GHS: "gh",
  NGN: "ng",
  UK: "gb",
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

export default function CountryFlag({ code, size = 20, style }: CountryFlagProps) {
  const upper = (code ?? "").toUpperCase();
  const isoCode = currencyToCountry[upper] ?? (upper.length === 2 ? upper.toLowerCase() : null);

  if (isoCode) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://flagcdn.com/w40/${isoCode}.png`}
        alt={upper}
        height={size}
        width={size}
        style={{ objectFit: "contain", flexShrink: 0, borderRadius: 2, ...style }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

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
