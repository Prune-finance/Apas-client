export const filteredSearch = <T>(
  arr: T[],
  properties: (keyof T)[],
  searchValue: string
): T[] => {
  if (properties.length === 0) return arr;

  return arr.filter((item) => {
    return properties.some((key) => {
      const itemValue = (item[key] as unknown as string)?.toLowerCase();
      return itemValue?.includes(searchValue.toLowerCase());
    });
  });
};
