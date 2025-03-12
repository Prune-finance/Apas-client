import { formatNumber, removeWhitespace } from "@/lib/utils";
import { Modal, Text } from "@mantine/core";

import { useState } from "react";
import SuccessModal from "../../SuccessModal";
import PreviewState from "../previewState";
import SendMoneyModal from "../sendMoneyModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { DefaultAccount } from "@/lib/hooks/accounts";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import PendingModalImage from "@/assets/pending-image.png";
import DebtorModal from "../DebtorModal";
import useDebtorStore from "@/lib/store/debtor";

interface Props {
  opened: boolean;
  openSendMoney: () => void;
  closeMoney: () => void;
  account: DefaultAccount | null;
}

export const SendMoney = ({
  opened,
  closeMoney,
  account,
  openSendMoney,
}: Props) => {
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
    bankAddress: "",
    destinationCountry: "",
    reference: crypto.randomUUID(),
    invoice: "",
    narration: "",
  });

  // const [debtorRequestForm, setDebtorRequestForm] = useState<DebtorForm>({
  //   location: "self",
  //   fullName: "",
  //   address: "",
  //   country: "",
  //   postCode: "",
  //   state: "",
  //   city: "",
  //   website: "",
  //   businessRegNo: "",
  // });

  const [companyRequestForm, setCompanyRequestForm] = useState({
    amount: "",
    companyName: "",
    destinationIBAN: "",
    destinationBIC: "",
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
        destinationBank,
        bankAddress,
        destinationCountry,
        amount,
        invoice,
        narration,
      } = requestForm;

      const { data } = await axios.post(`/payout/send-money`, {
        amount,
        destinationIBAN: removeWhitespace(destinationIBAN),
        destinationBIC: removeWhitespace(destinationBIC),
        destinationBank,
        bankAddress,
        destinationCountry,
        reference: crypto.randomUUID(),
        beneficiaryFullName: `${firstName} ${lastName}`,
        invoice,
        narration,
        // Debtor details
        debtorFullName: `${debtorRequestForm?.fullName}`,
        debtorAddress: `${debtorRequestForm?.address}`,
        debtorCountryCode: `${debtorRequestForm?.country}`,
        debtorPostCode: `${debtorRequestForm?.postCode}`,
        debtorState: `${debtorRequestForm?.state}`,
        debtorCity: `${debtorRequestForm?.city}`,
        debtorWebsite: `${debtorRequestForm?.website}`,
        debtorBusinessRegNo: `${debtorRequestForm?.businessRegNo}`,
        debtorType: `${debtorRequestForm?.location === "self" && "COMPANY"}`,
      });

      console.log({ sendMoney: data });
      setMoneySent(Number(amount));
      setReceiverName(`${firstName} ${lastName}`);
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
        destinationBank,
        bankAddress,
        destinationCountry,
        amount,
        invoice,
        narration,
        reference,
      } = companyRequestForm;
      const { data } = await axios.post(`/payout/send-money`, {
        amount,
        destinationIBAN: removeWhitespace(destinationIBAN),
        destinationBIC: removeWhitespace(destinationBIC),
        destinationBank,
        bankAddress,
        destinationCountry,
        reference: crypto.randomUUID(),
        beneficiaryFullName: companyName,
        invoice,
        narration,
      });
      setMoneySent(Number(amount));
      setReceiverName(companyName);
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
    closeSuccess();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeMoney}
        size={matches ? "90%" : 630}
        withCloseButton={false}
      >
        <SendMoneyModal
          account={account}
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
              {formatNumber(moneySent, true, "EUR")}
            </Text>{" "}
            to {receiverName} is in progress. It should be completed within the
            next 10 minutes. Please wait for confirm.
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
  bankAddress: string;
  destinationCountry: string;
  reference: string; // generated using crypto.randomUUID()
  firstName: string;
  lastName: string;
  invoice: string;
  narration: string;
}
