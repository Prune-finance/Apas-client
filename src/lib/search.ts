// const getNestedValue = <T>(obj: T, path: string): any => {
//   return path
//     .split(".")
//     .reduce((acc, part) => (acc ? acc[part] : undefined), obj as any);
// };

const getNestedValue = <T>(obj: T, path: string): any => {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object") {
      return acc[part];
    }
    return undefined;
  }, obj as any);
};

export const filteredSearch = <T>(
  arr: T[],
  properties: string[],
  searchValue: string
): T[] => {
  if (properties.length === 0) return arr;
  if (arr.length === 0) return arr;

  return arr.filter((item) => {
    return properties.some((key) => {
      const itemValue = (
        getNestedValue(item, key) as unknown as string
      )?.toLowerCase();

      // Check if itemValue is undefined or null
      // if (itemValue === undefined || itemValue === null) {
      //   return true;
      // }

      // return itemValue.includes(searchValue.toLowerCase());

      // Ensure itemValue is a string, or an empty string if it's null/undefined
      const normalizedValue =
        itemValue != null ? String(itemValue).toLowerCase() : "";

      return normalizedValue.includes(searchValue.toLowerCase());
    });
  });
};

// export const filteredSearch = <T>(
//   arr: T[],
//   properties: (keyof T)[],
//   searchValue: string
// ): T[] => {
//   if (properties.length === 0) return arr;

//   return arr.filter((item) => {
//     return properties.some((key) => {
//       const itemValue = (item[key] as unknown as string)?.toLowerCase();
//       return itemValue?.includes(searchValue.toLowerCase());
//     });
//   });
// };

const matchesSearchTerms = <T>(
  item: T,
  properties: string[],
  searchTerms: string[]
): boolean => {
  const concatenatedValues = properties
    .map((key) => {
      const itemValue = getNestedValue(item, key) as unknown as string;
      return itemValue != null ? String(itemValue).toLowerCase() : "";
    })
    .join(" ");

  console.log({
    concatenatedValues,
    searchTerms: searchTerms.every((term) => concatenatedValues.includes(term)),
  });

  return searchTerms.every((term) => concatenatedValues.includes(term));
};

export const multiKeySearch = <T>(
  arr: T[],
  properties: string[],
  searchValue: string
): T[] => {
  if (properties.length === 0) return arr;
  if (arr.length === 0) return arr;

  const searchTerms = searchValue.toLowerCase().split(" ");

  return arr.filter((item) =>
    matchesSearchTerms(item, properties, searchTerms)
  );
};
