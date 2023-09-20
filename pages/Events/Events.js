import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Link from "next/link";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";
import EventCard from "@/components/EventCard";

export default () => {
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
      setEventConnectAddress(networkMapping[chainIdString].EventConnect[0]);
      const updateUIFunc = async () => {
        try {
          await updateUI();
        } catch (error) {
          console.error("Error updating UI:", error);
        }
      };
      updateUIFunc();
    }
  }, [isWeb3Enabled, account]);

  // Render UI
  return (
    <>
      {isWeb3Enabled ? (
        <>
          <Link href={"/Events"} className="Link__Back">
            Back
          </Link>
          <div className="container mx-auto">
            {/* Render online events */}
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
                <div>There are no online events</div>
              )}
              {onlineEvents.length > maxEvents && (
                <Link href="/Events/NowEvents" className="underline">
                  More Events
                </Link>
              )}
            </div>
            <br />
            <hr />

            {/* Render upcoming events */}
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
                <div>There are no upcoming events</div>
              )}
              {upcomingEvents.length > maxEvents && (
                <Link href="/Events/UpcomingEvents" className="underline">
                  More Events
                </Link>
              )}
            </div>
            <br />
            <hr />

            {/* Render ended events */}
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
              {endedEvents.length === 0 && <div>There are no ended events</div>}
              {endedEvents.length > maxEvents && (
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
};
