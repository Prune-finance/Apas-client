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
      return itemValue?.includes(searchValue.toLowerCase());
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
