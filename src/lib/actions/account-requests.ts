import axios from "axios";
import { parseError } from "./auth";

export const approveRequest = async (id: string) => {
  //   if (processing) return;
  //   setProcessing(true);
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/request/approve/${id}`,
      {},
      { withCredentials: true }
    );

    return { success: true, message: "Request Approved" };

    // closeApprove();
    // handleSuccess("Request Approved", "You have approved this account request");
    // revalidate();
  } catch (error) {
    return { success: false, message: parseError(error) };
  }
};

export const rejectRequest = async (id: string) => {
  //   if (processing) return;
  //   setProcessing(true);
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/request/reject/${id}`,
      {},
      { withCredentials: true }
    );
    return { success: true, message: "Request Rejected" };
    // close();
    // handleSuccess("Request Rejected", "You have rejected this account request");
    // revalidate();
  } catch (error) {
    return { success: false, message: parseError(error) };
  }
};
