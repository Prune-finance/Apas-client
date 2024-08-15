import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useUserBalances(id: string = "") {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  async function fetchBalance() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/balances`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setBalance(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchBalance();

  useEffect(() => {
    fetchBalance();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, balance, revalidate };
}
