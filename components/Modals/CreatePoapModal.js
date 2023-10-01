import React, { useEffect } from "react";
import { Modal, useNotification } from "web3uikit";
import eventConnectAbi from "@/constants/EventConnect.json";

import { useWeb3Contract } from "react-moralis";
import dotenv from "dotenv";
dotenv.config();

export default ({
  eventID,
  poapID,
  eventConnectAddress,
  isVisible,
  onClose,
}) => {
  const { runContractFunction: addPoapID } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: eventConnectAddress,
    functionName: "addPoapID",
    params: {
      eventID: eventID,
      poapID: poapID,
    },
  });

  const dispatch = useNotification();

  const handleSuccess = async () => {
    dispatch({
      type: "success",
      message: "The operation was successful",
      title: "Successful",
      position: "topR",
    });

    alert("Please write down your secret code (Edit code)");
  };

  async function addPoapIdFunc() {
    await addPoapID({
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => console.error(error),
    });
  }

  useEffect(() => {
    addPoapIdFunc();
  }, []);
  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      title="View Drop Details"
      okText="OK"
      cancelText="Back"
      onOk={onClose}
      isOkDisabled="true"
    ></Modal>
  );
};
