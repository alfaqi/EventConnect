import { Modal, useNotification } from "web3uikit";
import Image from "next/image";

import eventConnectAbi from "@/constants/EventConnect.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import EventImage from "./Commons/EventImage";
import EventName from "./Commons/EventName";
import EventDescription from "./Commons/EventDescription";
import EventDate from "./Commons/EventDate";
import EventDuration from "./Commons/EventDuration";
import EventBy from "./Commons/EventBy";
import EventParticipants from "./Commons/EventParticipants";

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
            <EventImage name={event.name} banner={event.banner} />
            <EventName name={event.name} />
            <EventDescription description={event.description} />
          </div>
          <div className="p-1 text-base">
            <EventDate date={event.date} />
            <hr />
            <EventDuration duration={event.duration} />
            <hr />
            <EventBy eventBy={eventBy} />
            <hr />
            <EventParticipants attendees={attendees} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
