import eventConnectAbi from "@/constants/EventConnect.json";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";

export default function uesGetAllEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const { runContractFunction: getAllEvents } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getAllEvents",
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUIFunc() {
        await getAllEvents({
          onSuccess: (s) => setAllEvents(s),
          onError: (e) => setAllEvents(e),
        });
      }
      updateUIFunc();
    }
  }, [isWeb3Enabled]);

  return allEvents;
}
