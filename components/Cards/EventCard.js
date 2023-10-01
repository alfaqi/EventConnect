import { useEffect, useState } from "react";
import { Card } from "web3uikit";
import EventViewModal from "../Modals/EventViewModal";
import eventConnectAbi from "@/constants/EventConnect.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import EventRegisterModal from "../Modals/EventRegisterModal";
import { EventDate, EventImage, EventID, EventName } from "../Commons/index";
//Event Card
export default ({ eventConnectAddress, event, time }) => {
  const { isWeb3Enabled, account } = useMoralis();

  const [eventBy, setEventBy] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [broadCastKey, setBroadCastKey] = useState("");

  const [isParticipantRegistered, setIsParticipantRegistered] = useState(false);

  const [showRegisteringModal, setShowRegisteringModal] = useState(false);
  const [showEventViewModal, setShowEventViewModal] = useState(false);

  const hideRegisteringModal = () => setShowRegisteringModal(false);
  const hideEventViewModal = () => setShowEventViewModal(false);

  // getOneEventFunction
  const { runContractFunction: getOneEvent } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: eventConnectAddress,
    functionName: "getOneEvent",
    params: {
      eventID: event.eventID,
    },
  });

  // getEventParticipants Function
  const { runContractFunction: getEventParticipants } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: eventConnectAddress,
    functionName: "getEventParticipants",
    params: {
      eventID: event.eventID,
    },
  });

  // isParticipantRegistered Function
  const { runContractFunction: isParticipantRegisteredFunc } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: eventConnectAddress,
    functionName: "isParticipantRegistered",
    params: {
      eventID: event.eventID,
      participant: account,
    },
  });

  const handleCardClick = () => {
    if (!account) {
      alert(`Please connect your wallet`);
      setShowEventViewModal(true);
      return;
    }

    if (eventBy.toLowerCase() === account) {
      setShowEventViewModal(true);
      return;
    }
    if (time == "ended") {
      setShowEventViewModal(true);
      return;
    }
    if (time == "upcoming") {
      setShowRegisteringModal(true);
      return;
    }
    if (!isParticipantRegistered) {
      setShowRegisteringModal(true);
      return;
    }

    setShowEventViewModal(true);
  };

  async function updateUI() {
    const aCount = await getEventParticipants();
    setAttendees(aCount);
    setIsParticipantRegistered(await isParticipantRegisteredFunc());
    const creatoR = await getOneEvent();
    setEventBy(creatoR.creator);
    setBroadCastKey(creatoR.streamKey);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      const updateUIFunc = async () => {
        await updateUI();
      };
      updateUIFunc();

      setShowRegisteringModal(false);
      setShowEventViewModal(false);
    }
  }, [isWeb3Enabled, account]);
  return (
    <div>
      {showEventViewModal && (
        <EventViewModal
          eventConnectAddress={eventConnectAddress}
          eventEnded={time}
          event={event}
          // date={date}
          eventBy={eventBy}
          attendees={attendees}
          broadCast={broadCastKey}
          onClose={hideEventViewModal}
        />
      )}
      {showRegisteringModal && (
        <EventRegisterModal
          eventConnectAddress={eventConnectAddress}
          event={event}
          // date={date}
          eventBy={eventBy}
          attendees={attendees}
          isParticipantRegistered={isParticipantRegistered}
          onClose={hideRegisteringModal}
        />
      )}

      <Card
        title={<EventName name={event.name} />}
        description={<EventDate date={event.date} />}
        onClick={handleCardClick}
      >
        <EventID eventID={event.eventID} />
        <EventImage name={event.name} banner={event.banner} />
      </Card>
    </div>
  );
};
