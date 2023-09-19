import { Modal, useNotification } from "web3uikit";
import Image from "next/image";

import eventConnectAbi from "../constants/EventConnect.json";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default ({
  eventConnectAddress,
  event,
  date,
  eventBy,
  attendees,
  isParticipantRegistered,
  isVisible,
  onClose,
}) => {
  const { runContractFunction } = useWeb3Contract();

  const dispatch = useNotification();

  async function registerEvent() {
    const registerEventOptions = {
      abi: eventConnectAbi,
      contractAddress: eventConnectAddress,
      functionName: "register",
      params: {
        eventID: event.eventID,
      },
    };

    await runContractFunction({
      params: registerEventOptions,
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => {
        console.log(event);
        console.log(error);
      },
    });
  }
  async function UnregisterEvent() {
    const unregisterEventOptions = {
      abi: eventConnectAbi,
      contractAddress: eventConnectAddress,
      functionName: "unregister",
      params: {
        eventID: event.eventID,
      },
    };

    await runContractFunction({
      params: unregisterEventOptions,
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => {
        console.log(error);
      },
    });
  }
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "The operation was successful",
      title: "Successful",
      position: "topR",
    });
    onClose && onClose();
    window.location.reload();
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      title={isParticipantRegistered ? "Unregister" : "Register"}
      okText={isParticipantRegistered ? "Unregister" : "Register"}
      cancelText="Back"
      onOk={isParticipantRegistered ? UnregisterEvent : registerEvent}
      // isOkDisabled="true"
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col">
          <p>Event ID: {Number(event.eventID) + 1}</p>
          <div className="flex flex-col gap-2 items-center border-solid border-2 border-gray-400 rounded p-2 w-fit">
            <Image
              loader={() => event.banner}
              src={event.banner}
              alt={event.name}
              width="400"
              height="400"
            />
            <b className="text-lg">{event.name}</b>
            {event.description}
          </div>
          <div className="p-1 text-base">
            <p>Date: {date}</p>
            <hr />
            <p>By: {eventBy}</p>
            <hr />
            <p>{attendees} attendees</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
