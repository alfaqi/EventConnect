import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eduConnectAbi from "@/constants/EventConnect.json";
import EventCard from "@/components/EventCard";
import Link from "next/link";

// const eventListOffChain = [
//   "https://bafkreidqrgi5kun2eszgighfylpa5zkzsyc4lhiftyiyoqcrrb4uaqrvty.ipfs.w3s.link/",
//   "https://bafkreiarhst57ojfns3ujxo65gqopguefehow4vfq7uwltl7j7mxhgpen4.ipfs.w3s.link/",
//   "https://bafkreihebgteiy3hccjb4kjjjcdztoquqf5bbbz27vg3iqx3af3h363fhy.ipfs.w3s.link/",
// ];

export default function Events() {
  const [eventConnectAddress, setEventConnectAddress] = useState(0);

  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [onlineEvents, setOnlineEvents] = useState([]);
  const [endedEvents, setEndedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // const [lastEventIndex, setLastEventIndex] = useState(0);

  // // Get last Index of the Event
  // const { runContractFunction: getEventIndex } = useWeb3Contract({
  //   abi: eduConnectAbi,
  //   contractAddress: networkMapping[chainIdString].EventConnect[0],
  //   functionName: "getEventIndex",
  // });

  // const { runContractFunction: getEvent } = useWeb3Contract({
  //   abi: eduConnectAbi,
  //   contractAddress: eventConnectAddress,
  //   functionName: "getEvent",
  //   params: { eventIndex: "EventId" },
  // });

  // Get all Events
  const { runContractFunction: getAllEvents } = useWeb3Contract({
    abi: eduConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getAllEvents",
  });

  async function updateUI() {
    //on chain
    const allEvents = await getAllEvents();
    console.log(await getAllEvents());
    if (!allEvents) return;
    console.log(allEvents);
    // const getEventIndexa = await getEventIndex();
    // console.log(getEventIndexa);
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
          if (data.isEnded || nowTime > data.date) {
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
      console.log(chainIdString);
      setEventConnectAddress(networkMapping[chainIdString].EventConnect[0]);

      console.log(networkMapping[chainIdString].EventConnect[0]);
      console.log(eventConnectAddress);

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
          <Link
            href={"/Events"}
            className="bg-green-500 hover:bg-green-700 text-white  py-1 px-2 rounded mt-2 inline-block"
          >
            Back
          </Link>
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Now Events</h1>
            <div className="flex flex-wrap gap-2">
              {onlineEvents.length != 0 ? (
                onlineEvents.map((event, index) => {
                  // if (index < 3) {
                  return (
                    <EventCard
                      key={index}
                      eventConnectAddress={eventConnectAddress}
                      event={event}
                      time="online"
                      myEvents={false}
                    />
                  );
                  // }
                })
              ) : (
                <div>There is no any Online Events</div>
              )}
            </div>
            <br />
            <hr />
            <h1 className="py-4 px-4 font-bold text-2xl">Upcoming Events</h1>
            <div className="flex flex-wrap gap-2">
              {upcomingEvents.length != 0 ? (
                upcomingEvents.map((event, index) => {
                  // if (index < 3) {
                  return (
                    <EventCard
                      key={index}
                      eventConnectAddress={eventConnectAddress}
                      event={event}
                      time="upcoming"
                      myEvents={false}
                    />
                  );
                  // }
                })
              ) : (
                <div>There is no any upcoming Events</div>
              )}
            </div>
            <br />
            <hr />

            <h1 className="py-4 px-4 font-bold text-2xl">Event Ended</h1>
            <div className="flex flex-wrap gap-2">
              {endedEvents.length != 0 ? (
                endedEvents.map((event, index) => {
                  // if (index < 2) {
                  return (
                    <EventCard
                      key={index}
                      eventConnectAddress={eventConnectAddress}
                      event={event}
                      time="ended"
                      myEvents={false}
                    />
                  );
                  // }
                })
              ) : (
                <div>There is no any ended Events</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>Please connect your wallet</>
      )}
    </>
  );
}
