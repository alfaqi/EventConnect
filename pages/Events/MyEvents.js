import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import eventConnectAbi from "@/constants/EventConnect.json";
import networkMapping from "@/constants/networkMapping.json";
import Link from "next/link";
import EventCard from "@/components/EventCard";

export default () => {
  const [eventConnectAddress, setEventConnectAddress] = useState(0);

  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [arr, setArr] = useState([]);

  // Get last Index of the Event
  const { runContractFunction: getEventIndex } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getEventIndex",
  });

  const { runContractFunction } = useWeb3Contract();
  // Getting the events I have participated in
  async function getMyEvents() {
    let myEventsArr = [];
    const LastEventIndex = await getEventIndex();
    for (let i = 0; i < LastEventIndex; i++) {
      const funcOptions = {
        abi: eventConnectAbi,
        contractAddress: networkMapping[chainIdString].EventConnect[0],
        functionName: "isParticipantRegistered",
        params: {
          eventID: i,
          participant: account,
        },
      };

      const isParticipated = await runContractFunction({
        params: funcOptions,
      });

      console.log(isParticipated);
      console.log(isParticipated);

      const getEventOptions = {
        abi: eventConnectAbi,
        contractAddress: networkMapping[chainIdString].EventConnect[0],
        functionName: "getOneEvent",
        params: {
          eventID: i,
        },
      };

      const event = await runContractFunction({
        params: getEventOptions,
      });
      if (event?.creator.toLowerCase() === account) {
        await fetch(event.eventURI)
          .then((response) => {
            if (!response) {
              throw new Error("Request failed!");
            }
            return response.json();
          })
          .then((data) => {
            myEventsArr.push(data);
          });
      } else if (isParticipated) {
        await fetch(event.eventURI)
          .then((response) => {
            if (!response) {
              throw new Error("Request failed!");
            }
            return response.json();
          })
          .then((data) => {
            myEventsArr.push(data);
          });
      }
    }
    setArr(myEventsArr);
    console.log(!arr);
  }

  async function updateUI() {
    setEventConnectAddress(networkMapping[chainIdString].EventConnect[0]);
    console.log(networkMapping[chainIdString].EventConnect[0]);
    await getMyEvents();
  }

  useEffect(() => {
    const updateUIFunc = async () => {
      await updateUI();
    };
    updateUIFunc();
  }, [isWeb3Enabled, account]);
  return (
    <>
      {account ? (
        <>
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">My Events</h1>
            <div className="flex flex-wrap gap-2">
              {arr.length != 0 ? (
                arr.map((event) => {
                  return (
                    <EventCard
                      eventConnectAddress={eventConnectAddress}
                      event={event}
                      myEvents={true}
                    />
                  );
                })
              ) : (
                <div>
                  <div className="m-2">You did not create an Eevnt </div>
                  <br />
                  <div className="m-2">OR </div>
                  <br />
                  <div className="m-2">You did not participate an Eevnt </div>
                  <br />
                  <div className="m-2">
                    <Link href="/Events/" className="Link__Click">
                      Do it NOW!
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>Please connect your wallet</>
      )}
    </>
  );
};
