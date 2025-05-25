import { Dispatch, SetStateAction, useEffect } from "react";
import { sanitizeURL } from "../utils";
import { IParams } from "@/lib/schema";

interface Props {
  queryParams: IParams;
  setActive: Dispatch<SetStateAction<number>>;
}
export const usePaginationReset = ({ queryParams, setActive }: Props) => {
  const dependencies = sanitizeURL({ ...queryParams, page: undefined });

  useEffect(() => {
    setActive(1);
  }, [dependencies, setActive]);
};
