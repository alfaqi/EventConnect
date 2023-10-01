import { useEffect, useState } from "react";
import { Input } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";
import Link from "next/link";

import dotenv from "dotenv";
import ViewPoapModal from "@/components/Modals/ViewPoapModal";
dotenv.config();

export default () => {
  const { isWeb3Enabled, account, chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [poapEventID, setPoapEventID] = useState("");
  const [eventID, setEventID] = useState(0);

  const { runContractFunction } = useWeb3Contract();

  async function checkEvent() {
    setPoapEventID(0);
    if (eventID <= -1) {
      alert("Event ID must be bigger then 0");
      return;
    }
    const getEventOptions = {
      abi: eventConnectAbi,
      contractAddress: networkMapping[chainIdString].EventConnect[0],
      functionName: "getPoapID",
      params: {
        eventID: eventID,
      },
    };

    // 2- get event object
    const eventObj = await runContractFunction({
      params: getEventOptions,
      onSuccess: (poapIDD) => {
        if (poapIDD.toString() == 0) {
          alert("You didn't create a drop for this event");
          return;
        }
      },
      onError: () => {
        setPoapEventID(0);
        alert("There is no event created!");
        return;
      },
    });

    if (!eventObj) return;

    if (eventObj.toString() == "1") {
      setPoapEventID(0);
      alert("You selected to not provide proof of attendance!");
      return;
    }

    setPoapEventID(Number(eventObj));
  }

  useEffect(() => {
    setPoapEventID(0);
  }, [isWeb3Enabled, account]);
  return (
    <>
      {account ? (
        <>
          <Link href={"/Poap"} className="Link__Back">
            Back
          </Link>
          <div className="flex flex-col items-center gap-2">
            <h1 className="py-4 px-4 font-bold text-2xl">
              View Drop (POAP) details
            </h1>
            <div className="m-2">
              <Input
                label="Event ID"
                placeholder="Enter Event id"
                onChange={(e) => setEventID(e.target.value - 1)}
                type="number"
              />
            </div>
            <div className="m-2">
              <Link className="Link__Click" onClick={checkEvent} href="#">
                Check for Drop
              </Link>
            </div>

            {poapEventID != 0 ? (
              <ViewPoapModal poapEventID={poapEventID} />
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <>Please connect your wallet</>
      )}
    </>
  );
};
