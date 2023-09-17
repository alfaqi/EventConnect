import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default function Events() {
  const [eventConnectAddress, setEventConnectAddress] = useState(0);
  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Get all Events
  const { runContractFunction: getAllEvents } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getAllEvents",
  });

  async function updateUI() {
    const allEvents = await getAllEvents();
    if (!allEvents) return;

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
          if (nowTime < data.date) {
            upcomingEventsArr.push(data);
          }
        })
        .catch((err) => console.error(err));
    }

    setUpcomingEvents(upcomingEventsArr);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      setEventConnectAddress(networkMapping[chainIdString].EventConnect[0]);
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
            href={"/Events/Events"}
            className="bg-green-500 hover:bg-green-700 text-white  py-1 px-2 rounded mt-2 inline-block"
          >
            Back
          </Link>
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Upcoming Events</h1>
            <div className="flex flex-wrap gap-2">
              {upcomingEvents.map((event, index) => {
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
