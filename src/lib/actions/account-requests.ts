import { parseError } from "./auth";
import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("accounts");

export const approveRequest = async (id: string) => {
  //   if (processing) return;
  //   setProcessing(true);
  try {
    await axios.post(`/admin/request/approve/${id}`, {});

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
    await axios.post(`/admin/request/reject/${id}`, {});
    return { success: true, message: "Request Rejected" };
    // close();
    // handleSuccess("Request Rejected", "You have rejected this account request");
    // revalidate();
  } catch (error) {
    return { success: false, message: parseError(error) };
  }
};
