import { useEffect, useState } from "react";
import { Card } from "web3uikit";
import Image from "next/image";
import EventViewModal from "./EventViewModal";
import eventConnectAbi from "../constants/EventConnect.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import EventRegisterModal from "./EventRegisterModal";

//Event Card
export default ({ eventConnectAddress, event, time, myEvents }) => {
  const { isWeb3Enabled, account } = useMoralis();

  const [name, setName] = useState("");
  const [eventBy, setEventBy] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [banner, setBanner] = useState("");
  const [eventTime, setEventTime] = useState("ended");
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
    // } else
  };

  //MyEvents Section
  const gotoEventFunc = () => {
    if (eventBy.toLowerCase() === account) {
      window.open(
        `/Live/Live?id=${broadCastKey}&title=${event.name}&auth=0`,
        "_blank"
      );
    } else {
      window.open(
        `/Live/Live?id=${event.playbackId}&title=${event.name}&auth=1`,
        "_blank"
      );
    }
  };

  async function updateUI() {
    // Index Section
    setName(event.name);
    setBanner(event.banner);

    const eventDate = new Date(event.date * 1000);
    const timeSettings = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };
    const formattedDate = eventDate.toLocaleDateString("en-US", timeSettings);
    setDate(formattedDate);

    const aCount = await getEventParticipants();
    setAttendees(aCount ? aCount.length : 0);

    setIsParticipantRegistered(await isParticipantRegisteredFunc());
    const creatoR = await getOneEvent();
    console.log(event);
    console.log(await getOneEvent());
    setEventBy(creatoR.creator);
    setBroadCastKey(creatoR.streamKey);
    // console.log(creatoR.streamKey);

    // My Events Section
    const nowTime = new Date() / 1000;

    if (event.date <= nowTime && nowTime < event.date + event.duration * 60) {
      setEventTime("online");
    } else if (nowTime < event.date) {
      setEventTime("upcoming");
    }
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
      <EventViewModal
        eventConnectAddress={eventConnectAddress}
        eventEnded={time}
        event={event}
        date={date}
        isParticipantRegistered={isParticipantRegistered}
        eventBy={eventBy}
        attendees={attendees}
        broadCast={broadCastKey}
        isVisible={showEventViewModal}
        onClose={hideEventViewModal}
      />
      <EventRegisterModal
        eventConnectAddress={eventConnectAddress}
        event={event}
        date={date}
        eventBy={eventBy}
        attendees={attendees}
        isParticipantRegistered={isParticipantRegistered}
        isVisible={showRegisteringModal}
        onClose={hideRegisteringModal}
      />
      {myEvents ? (
        <>
          <Card
            title={name}
            description={"Date: " + date}
            onClick={eventTime == "online" ? gotoEventFunc : () => {}}
          >
            <p>Event ID: {Number(event.eventID) + 1}</p>
            <Image
              loader={() => banner}
              src={banner}
              alt={name}
              width="300"
              height="250"
            />
            <div className="p-1 text-base">
              {/* <hr /> */}
              <p>Date: {date}</p>
              <hr />
              <p>Duration: {event.duration}</p>
              <hr />
              <p>By: {eventBy.toLowerCase() === account ? "You" : eventBy}</p>
              <hr />
              <p>{attendees} attendees</p>
              <hr />
              {eventTime != "ended" ? (
                eventTime == "online" ? (
                  <p>Goto Event</p>
                ) : (
                  <p>Upcoming Event</p>
                )
              ) : (
                <p>Event Ended</p>
              )}
              <hr />
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card
            title={name}
            description={"Date: " + date}
            onClick={handleCardClick}
          >
            <p>Event ID: {Number(event.eventID) + 1}</p>
            <Image
              loader={() => banner}
              src={banner}
              alt={name}
              width="300"
              height="250"
            />
          </Card>
        </>
      )}
    </div>
  );
};
