// src/__tests__/example.test.ts

import { sum } from "@/lib/utils";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
