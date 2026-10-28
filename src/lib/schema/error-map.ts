import { z } from "zod";

// Turn a schema key into readable text: "businessCountry" → "Business country",
// "first_name" → "First name", "ceoIdType" → "CEO ID type".
const humanize = (key: string) => {
  const words = key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .map((w) => ({ ceo: "CEO", id: "ID", poa: "proof of address", url: "document", dob: "date of birth", cac: "CAC", aml: "AML", mermat: "MEMART" }[w] ?? w));
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Empty fields (a cleared Select gives `null`, a missing value is `undefined`) would
// otherwise show Zod's default "Expected string, received null" / "Required".
// Schemas that define their own messages keep them.
const prettyErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (
    issue.code === z.ZodIssueCode.invalid_type &&
    (issue.received === "null" || issue.received === "undefined")
  ) {
    const key = [...issue.path].reverse().find((p) => typeof p === "string");
    return { message: key ? `${humanize(key as string)} is required` : "This field is required" };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(prettyErrorMap);
