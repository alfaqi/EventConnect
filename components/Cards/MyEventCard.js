import { useEffect, useState } from "react";
import { Card } from "web3uikit";
import eventConnectAbi from "@/constants/EventConnect.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  EventBy,
  EventDate,
  EventParticipants,
  EventStatus,
  EventImage,
  EventDuration,
  EventID,
  EventName,
} from "../Commons/index";

export default ({ eventConnectAddress, event }) => {
  const { isWeb3Enabled, account } = useMoralis();

  const [eventBy, setEventBy] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [eventTime, setEventTime] = useState("ended");
  const [broadCastKey, setBroadCastKey] = useState("");

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

  useEffect(() => {
    if (isWeb3Enabled) {
      const updateUIFunc = async () => {
        const aCount = await getEventParticipants();
        setAttendees(aCount);

        const creatoR = await getOneEvent();
        setEventBy(creatoR.creator);
        setBroadCastKey(creatoR.streamKey);
        // My Events Section
        const nowTime = new Date() / 1000;

        if (
          event.date <= nowTime &&
          nowTime < event.date + event.duration * 60
        ) {
          setEventTime("online");
        } else if (nowTime < event.date) {
          setEventTime("upcoming");
        }
      };
      updateUIFunc();
    }
  }, [isWeb3Enabled, account]);
  return (
    <div>
      <Card
        title={<EventName name={event.name} />}
        description={<EventDate date={event.date} />}
        cursorType="pointer"
      >
        <EventID eventID={event.eventID} />
        <EventImage name={event.name} banner={event.banner} />
        <div className="p-1 text-base">
          <EventDate date={event.date} />
          <hr />
          <EventDuration duration={event.duration} />
          <hr />
          <EventBy eventBy={eventBy} />
          <hr />
          <EventParticipants attendees={attendees} />
          <hr />
          {eventTime != "ended" ? (
            eventTime == "online" ? (
              <EventStatus
                name={event.name}
                eventStatus={eventTime}
                broadCast={broadCastKey}
                playbackId={event.playbackId}
              />
            ) : (
              <p>Upcoming Event</p>
            )
          ) : (
            <p>Event Ended</p>
          )}
          <hr />
        </div>
      </Card>
    </div>
  );
};
