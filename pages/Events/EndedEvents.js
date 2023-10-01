import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";
import EventCard from "@/components/Cards/EventCard";
import Link from "next/link";

export default () => {
  const [eventConnectAddress, setEventConnectAddress] = useState(0);

  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [endedEvents, setEndedEvents] = useState([]);

  // Get all Events
  const { runContractFunction: getAllEvents } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getAllEvents",
  });

  async function updateUI() {
    const allEvents = await getAllEvents();
    if (!allEvents) return;

    let endedEventsArr = [];
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
          }
        })
        .catch((err) => console.error(err));
    }

    setEndedEvents(endedEventsArr);
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
          <Link href={"/Events/Events"} className="Link__Back">
            Back
          </Link>
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Event Ended</h1>
            <div className="flex flex-wrap gap-2">
              {endedEvents.map((event, index) => {
                return (
                  <EventCard
                    key={index}
                    eventConnectAddress={eventConnectAddress}
                    event={event}
                    time="ended"
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
};
