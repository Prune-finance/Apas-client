import { IParams } from "../schema";
import { useMemo } from "react";

export const useParam = (customParams: IParams = {}) => {
  /**
   * @description - This will ensure that parameters are readily available for api calls.
   *
   * @param {Object} customParams - The custom parameters passed in.
   * @returns {Object} - An object with the parameters for the api call.
   */

  const param = useMemo(() => {
    return {
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
      ...(customParams.senderIban && { senderIban: customParams.senderIban }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.search && { search: customParams.search }),
      ...(customParams.not && { not: customParams.not }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.email && { email: customParams.email }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.accountNumber && {
        accountNumber: customParams.accountNumber,
      }),
      ...(customParams.accountType && {
        accountType: customParams.accountType,
      }),
      ...(customParams.companyId && { companyId: customParams.companyId }),
      ...(customParams.beneficiaryName && {
        beneficiaryName: customParams.beneficiaryName,
      }),
      ...(customParams.bank && { bank: customParams.bank }),
      ...(customParams.query && { query: customParams.query }),
      ...(customParams.destinationBank && {
        destinationBank: customParams.destinationBank,
      }),
      ...(customParams.destinationIban && {
        destinationIban: customParams.destinationIban,
      }),
      ...(customParams.firstName && { firstName: customParams.firstName }),
      ...(customParams.lastName && { lastName: customParams.lastName }),
      ...(customParams.amount && { amount: customParams.amount }),
      ...(customParams.country && { country: customParams.country }),
      ...(customParams.period && { period: customParams.period }),
    };
  }, [customParams]);

  return { param };
};
