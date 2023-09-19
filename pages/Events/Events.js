import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";
import EventCard from "@/components/EventCard";
import Link from "next/link";

import { useQuery, gql } from "@apollo/client";

export default function Events() {
  // Using Thegraph indexer
  const GET_EVENT_CREATED = gql`
    {
      eventCreateds {
        id
        eventID
        eventURI
        poapID
      }
    }
  `;

  const { loading, error, data: eventCreated } = useQuery(GET_EVENT_CREATED);

  const [eventConnectAddress, setEventConnectAddress] = useState(0);

  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [onlineEvents, setOnlineEvents] = useState([]);
  const [endedEvents, setEndedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const maxEvents = 3;

  // Get all Events
  const { runContractFunction: getAllEvents } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getAllEvents",
  });

  async function updateUI() {
    const allEvents = await getAllEvents();
    if (!allEvents) return;

    let onlineEventsArr = [];
    let endedEventsArr = [];
    let upcomingEventsArr = [];

    // if (eventAdded.eventCreateds.length == 0) return;
    // for (let i of eventAdded.eventCreateds) {

    for (let i of allEvents) {
      await fetch(i.eventURI)
        .then((response) => {
          if (!response) {
            throw new Error("Request failed!");
          }
          return response.json();
        })
        .then((data) => {
          const nowTime = new Date() / 1000;

          if (data.isEnded || nowTime > data.date + data.duration * 60) {
            endedEventsArr.push(data);
          } else if (
            data.date < nowTime &&
            nowTime < data.date + data.duration * 60
          ) {
            onlineEventsArr.push(data);
          } else if (nowTime < data.date) {
            upcomingEventsArr.push(data);
          }
        })
        .catch((err) => console.error(err));
    }

    setEndedEvents(endedEventsArr);
    setOnlineEvents(onlineEventsArr);
    setUpcomingEvents(upcomingEventsArr);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      // console.log(chainIdString);
      setEventConnectAddress(networkMapping[chainIdString].EventConnect[0]);

      // console.log(networkMapping[chainIdString].EventConnect[0]);
      // console.log(eventConnectAddress);

      const updateUIFunc = async () => {
        await updateUI();
      };
      updateUIFunc();
    }
  }, [isWeb3Enabled, account]);
  return (
    <>
      {isWeb3Enabled ? (
        <>
          <Link href={"/Events"} className="Link__Back">
            Back
          </Link>
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Now Events</h1>
            <div className="flex flex-wrap gap-2">
              {onlineEvents.slice(0, maxEvents).map((event, index) => {
                return (
                  <EventCard
                    key={index}
                    eventConnectAddress={eventConnectAddress}
                    event={event}
                    time="online"
                    myEvents={false}
                  />
                );
              })}
              {onlineEvents.length === 0 && (
                <div>There is no any Online Events</div>
              )}
              {onlineEvents.length >= maxEvents && (
                <Link href="/Events/NowEvents" className="underline">
                  More Events
                </Link>
              )}
            </div>
            <br />
            <hr />
            <h1 className="py-4 px-4 font-bold text-2xl">Upcoming Events</h1>
            <div className="flex flex-wrap gap-2">
              {upcomingEvents.slice(0, maxEvents).map((event, index) => {
                return (
                  <EventCard
                    key={index}
                    eventConnectAddress={eventConnectAddress}
                    event={event}
                    time="upcoming"
                    myEvents={false}
                  />
                );
              })}
              {upcomingEvents.length === 0 && (
                <div>There is no any Online Events</div>
              )}
              {upcomingEvents.length >= maxEvents && (
                <Link href="/Events/UpcomingEvents" className="underline">
                  More Events
                </Link>
              )}
            </div>
            <br />
            <hr />

            <h1 className="py-4 px-4 font-bold text-2xl">Event Ended</h1>
            <div className="flex flex-wrap gap-2">
              {endedEvents.slice(0, maxEvents).map((event, index) => {
                return (
                  <EventCard
                    key={index}
                    eventConnectAddress={eventConnectAddress}
                    event={event}
                    time="ended"
                    myEvents={false}
                  />
                );
              })}
              {endedEvents.length === 0 && (
                <div>There is no any Online Events</div>
              )}
              {endedEvents.length >= maxEvents && (
                <Link href="/Events/EndedEvents" className="underline">
                  More Events
                </Link>
              )}
            </div>
            <br />
            <hr />
          </div>
        </>
      ) : (
        <>Please connect your wallet</>
      )}
    </>
  );
}
