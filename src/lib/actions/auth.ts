"use client";

import axios from "axios";

export function parseError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;
    return res.message || error.message || "";
  }
  const err = error as { message: string };
  return err.message || "Something went wrong while processing your request";
}
