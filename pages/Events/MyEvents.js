import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import eventConnectAbi from "@/constants/EventConnect.json";
import networkMapping from "@/constants/networkMapping.json";
import Link from "next/link";
import MyEventCard from "@/components/Cards/MyEventCard";

export default () => {
  const [eventConnectAddress, setEventConnectAddress] = useState(0);

  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  const [loadingData, setLoadingData] = useState(false);
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
      if (!event) return;
      setLoadingData(false);
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
    setLoadingData(true);
  }

  async function updateUI() {
    setEventConnectAddress(networkMapping[chainIdString].EventConnect[0]);
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
              {loadingData ? (
                <>
                  {arr.length != 0 ? (
                    arr.map((event) => {
                      return (
                        <MyEventCard
                          eventConnectAddress={eventConnectAddress}
                          event={event}
                        />
                      );
                    })
                  ) : (
                    <div>
                      <div className="m-2">You did not create an event </div>
                      <br />
                      <div className="m-2">OR </div>
                      <br />
                      <div className="m-2">
                        You did not participate in an event{" "}
                      </div>
                      <br />
                      <div className="m-2">
                        <Link href="/Events/" className="Link__Click">
                          Do it NOW!
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>Loading data...</p>
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
