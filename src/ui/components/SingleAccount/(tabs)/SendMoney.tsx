import { formatNumber, removeWhitespace } from "@/lib/utils";
import { Modal, Text } from "@mantine/core";

import { useEffect, useState } from "react";
import SuccessModal from "../../SuccessModal";
import PreviewState from "../previewState";
import SendMoneyModal from "../sendMoneyModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  DefaultAccount,
  useUserCurrencyGBPAccount,
  useUserDefaultAccount,
} from "@/lib/hooks/accounts";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import PendingModalImage from "@/assets/pending-image.png";
import DebtorModal from "../DebtorModal";
import useDebtorStore from "@/lib/store/debtor";
import useCurrencySwitchStore from "@/lib/store/currency-switch";

interface Props {
  opened: boolean;
  openSendMoney: () => void;
  closeMoney: () => void;
}

export const SendMoney = ({ opened, closeMoney, openSendMoney }: Props) => {
  const { account, loading, revalidate } = useUserDefaultAccount();
  const {
    account: gbpAccount,
    loading: gbpLoading,
    revalidate: gbpRevalidate,
  } = useUserCurrencyGBPAccount();

  const { switchCurrency } = useCurrencySwitchStore();

  const matches = useMediaQuery("(max-width: 768px)");
  const axios = createAxiosInstance("payouts");

  const { debtorRequestForm } = useDebtorStore();
  const { handleError, handleSuccess } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [sectionState, setSectionState] = useState("");
  const [moneySent, setMoneySent] = useState(0);
  const [receiverName, setReceiverName] = useState("");
  const [paymentType, setPaymentType] = useState("individual");

  const [openedPreview, { open: openPreview, close: closePreview }] =
    useDisclosure(false);
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const [openedDebtor, { open: openDebtor, close: closeDebtor }] =
    useDisclosure(false);

  const [requestForm, setRequestForm] = useState<RequestForm>({
    firstName: "",
    lastName: "",
    amount: "",
    destinationIBAN: "",
    destinationBIC: "",
    destinationBank: "",
    destinationAccountNumber: "",
    destinationSortCode: "",
    bankAddress: "",
    destinationCountry: "",
    reference: crypto.randomUUID(),
    invoice: "",
    narration: "",
  });

  const [companyRequestForm, setCompanyRequestForm] = useState({
    amount: "",
    companyName: "",
    destinationIBAN: "",
    destinationBIC: "",
    destinationAccountNumber: "",
    destinationSortCode: "",
    destinationBank: "",
    bankAddress: "",
    destinationCountry: "",
    invoice: "",
    reference: crypto.randomUUID(),
    narration: "",
  });

  const sendMoneyRequest = async () => {
    setProcessing(true);
    try {
      const {
        firstName,
        lastName,
        destinationIBAN,
        destinationBIC,
        destinationAccountNumber,
        destinationSortCode,
        destinationBank,
        bankAddress,
        destinationCountry,
        amount,
        invoice,
        narration,
      } = requestForm;

      const { data } = await axios.post(
        switchCurrency === "GBP" ? "/payout/send-gbp" : "/payout/send-money",
        {
          ...(switchCurrency === "GBP"
            ? {
                beneficiaryAccountNumber: removeWhitespace(
                  destinationAccountNumber
                ),
                beneficiarySortCode: removeWhitespace(destinationSortCode),
                beneficiaryBank: destinationBank,
                beneficiaryCountry: destinationCountry,
                beneficiaryFullName: `${firstName} ${lastName}`,
              }
            : {
                destinationIBAN: removeWhitespace(destinationIBAN),
                destinationBIC: removeWhitespace(destinationBIC),
                destinationBank,
                destinationCountry,
                beneficiaryFullName: `${firstName} ${lastName}`,
              }),

          bankAddress,
          amount,
          reference: crypto.randomUUID(),
          invoice,
          narration,

          // Debtor details
          debtorFullName: `${debtorRequestForm?.fullName}`,
          debtorAddress: `${debtorRequestForm?.address}`,
          debtorCountryCode: `${debtorRequestForm?.country}`,
          debtorPostCode: `${debtorRequestForm?.postCode}`,
          debtorState: `${debtorRequestForm?.state}`,
          debtorCity: `${debtorRequestForm?.city}`,
          debtorType: `${
            debtorRequestForm?.location === "self" ||
            debtorRequestForm.location === "company"
              ? "COMPANY"
              : "INDIVIDUAL"
          }`,
          ...(debtorRequestForm?.location === "individual" && {
            debtorIdType: `${debtorRequestForm?.idType}`,
            debtorIdNumber: `${debtorRequestForm?.idNumber}`,
          }),
          ...(debtorRequestForm?.location === "self" ||
          debtorRequestForm.location === "company"
            ? {
                debtorWebsite: `${debtorRequestForm?.website}`,
                debtorBusinessRegNo: `${debtorRequestForm?.businessRegNo}`,
              }
            : {}),
        }
      );

      console.log({ sendMoney: data });
      setMoneySent(Number(amount));
      setReceiverName(`${firstName} ${lastName}`);
      closeMoney();
      closeDebtor();
      closePreview();
      openSuccess();
      // handleSuccess("Action Completed", "You have successfully sent money");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const sendMoneyCompanyRequest = async () => {
    setProcessing(true);
    try {
      const {
        companyName,
        destinationIBAN,
        destinationBIC,
        destinationAccountNumber,
        destinationSortCode,
        destinationBank,
        bankAddress,
        destinationCountry,
        amount,
        invoice,
        narration,
        reference,
      } = companyRequestForm;

      const { data } = await axios.post(
        switchCurrency === "GBP" ? "/payout/send-gbp" : "/payout/send-money",
        {
          ...(switchCurrency === "GBP"
            ? {
                beneficiaryAccountNumber: removeWhitespace(
                  destinationAccountNumber
                ),
                beneficiarySortCode: removeWhitespace(destinationSortCode),
                beneficiaryBank: destinationBank,
                beneficiaryCountry: destinationCountry,
                beneficiaryFullName: companyName,
              }
            : {
                destinationIBAN: removeWhitespace(destinationIBAN),
                destinationBIC: removeWhitespace(destinationBIC),
                destinationBank,
                destinationCountry,
                beneficiaryFullName: companyName,
              }),

          bankAddress,
          amount,
          reference: crypto.randomUUID(),
          invoice,
          narration,
          // Debtor details
          debtorFullName: `${debtorRequestForm?.fullName}`,
          debtorAddress: `${debtorRequestForm?.address}`,
          debtorCountryCode: `${debtorRequestForm?.country}`,
          debtorPostCode: `${debtorRequestForm?.postCode}`,
          debtorState: `${debtorRequestForm?.state}`,
          debtorCity: `${debtorRequestForm?.city}`,
          debtorType: `${
            debtorRequestForm?.location === "self" ||
            debtorRequestForm.location === "company"
              ? "COMPANY"
              : "INDIVIDUAL"
          }`,
          ...(debtorRequestForm?.location === "individual" && {
            debtorIdType: `${debtorRequestForm?.idType}`,
            debtorIdNumber: `${debtorRequestForm?.idNumber}`,
          }),
          ...(debtorRequestForm?.location === "self" ||
          debtorRequestForm.location === "company"
            ? {
                debtorWebsite: `${debtorRequestForm?.website}`,
                debtorBusinessRegNo: `${debtorRequestForm?.businessRegNo}`,
              }
            : {}),
        }
      );
      setMoneySent(Number(amount));
      setReceiverName(companyName);
      closeMoney();
      closeDebtor();
      closePreview();
      openSuccess();
      // handleSuccess("Action Completed", "You have successfully sent money");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
      close();
    }
  };

  const handleCloseSuccessModal = () => {
    // router.push("/admin/businesses");
    closeMoney();
    closeDebtor();
    closeSuccess();
  };

  useEffect(() => {
    revalidate();
    gbpRevalidate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeMoney}
        size={matches ? "90%" : 630}
        withCloseButton={false}
      >
        <SendMoneyModal
          account={switchCurrency === "EUR" ? account : gbpAccount}
          loading={loading || gbpLoading}
          close={closeMoney}
          openPreview={openPreview}
          setRequestForm={setRequestForm}
          setCompanyRequestForm={setCompanyRequestForm}
          setSectionState={setSectionState}
          openDebtor={openDebtor}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
        />
      </Modal>

      <DebtorModal
        openedDebtor={openedDebtor}
        closeDebtor={closeDebtor}
        openPreview={openPreview}
        openDebtor={openDebtor}
        openSendMoney={openSendMoney}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
      />

      <Modal
        opened={openedPreview}
        onClose={closePreview}
        size={"35%"}
        centered
        withCloseButton={false}
      >
        <PreviewState
          requestForm={requestForm}
          account={account}
          closePreview={closePreview}
          sendMoneyRequest={sendMoneyRequest}
          processing={processing}
          sectionState={sectionState}
        />
      </Modal>

      <Modal
        opened={openedPreview}
        onClose={closePreview}
        size={"35%"}
        centered
        withCloseButton={false}
      >
        <PreviewState
          requestForm={requestForm}
          companyRequestForm={companyRequestForm}
          account={account}
          closePreview={closePreview}
          sendMoneyRequest={
            sectionState === "Company"
              ? sendMoneyCompanyRequest
              : sendMoneyRequest
          }
          processing={processing}
          sectionState={sectionState}
        />
      </Modal>

      <SuccessModal
        openedSuccess={openedSuccess}
        handleCloseSuccessModal={handleCloseSuccessModal}
        image={PendingModalImage.src}
        style={{ height: 120, width: 120, marginBottom: 10 }}
        desc={
          <Text fz={12}>
            Your transfer of{" "}
            <Text inherit span fw={600} c="#97AD05">
              {formatNumber(moneySent, true, switchCurrency ?? "EUR")}
            </Text>{" "}
            to {receiverName} is in progress. It will be processed shortly. You
            will be notified on resolution of payment.
          </Text>
        }
        title="Transaction Processing"
      />
    </>
  );
};

export interface RequestForm {
  amount: string;
  destinationIBAN: string;
  destinationBIC: string;
  destinationBank: string;
  destinationAccountNumber: string;
  destinationSortCode: string;
  bankAddress: string;
  destinationCountry: string;
  reference: string; // generated using crypto.randomUUID()
  firstName: string;
  lastName: string;
  invoice: string;
  narration: string;
}
