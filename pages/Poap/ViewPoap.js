import { useEffect, useState } from "react";
import { Button, Input } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";
import Link from "next/link";

import dotenv from "dotenv";
import Image from "next/image";
dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;

export default () => {
  const { isWeb3Enabled, account, chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [poapEvent, setPoapEvent] = useState("");
  const [poapEventID, setPoapEventID] = useState("");

  const [secretCode, setSecretCode] = useState(0);

  const [event, setEvent] = useState(false);

  const { runContractFunction } = useWeb3Contract();

  async function checkEvent() {
    setEvent(false);

    const getEventOptions = {
      abi: eventConnectAbi,
      contractAddress: networkMapping[chainIdString].EventConnect[0],
      functionName: "getPoapID",
      params: {
        poapID: poapEventID,
      },
    };

    // 2- get event object
    const eventObj = await runContractFunction({
      params: getEventOptions,
      onSuccess: () => {
        // if (event?.creator.toLowerCase() == account)
        setEvent(true);
        // else alert("You didn't create this event!");
      },
      onError: (error) => {
        console.log(error);
        setEvent(false);
        alert("There is no event created!");
      },
    });

    console.log(eventObj);
    if (!eventObj) return;
    await getPoapEvent();
  }

  //POAP Section
  async function getPoapEvent() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    };
    fetch(`https://api.poap.tech/events/id/${poapEventID}`, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setPoapEvent(response);
      })
      .catch((err) => console.error(err));
  }

  //To find out whether your request is still pending or not, use the GET /redeem-requests/active/count endpoint.
  //A result of 0 means that there are no pending requests
  async function checkRequest() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    };

    fetch(
      `https://api.poap.tech/redeem-requests/active/count?event_id=${poapEventID}&redeem_type=qr_code`,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    setEvent(false);
  }, [isWeb3Enabled, account]);
  return (
    <>
      {account ? (
        <>
          <Link
            href={"/Poap"}
            className="bg-green-500 hover:bg-green-700 text-white  py-1 px-2 rounded mt-2 inline-block"
          >
            Back
          </Link>
          <div className="flex flex-col items-center gap-2">
            <h1 className="py-4 px-4 font-bold text-2xl">
              View Drop (POAP) details
            </h1>
            <div className="m-2">
              <Input
                label="Drop ID"
                placeholder="Enter Drop id"
                onChange={(e) => setPoapEventID(e.target.value)}
                type="number"
              />
            </div>
            <div className="m-4">
              <Button
                text="Check for Drop"
                onClick={checkEvent}
                disabled={poapEventID ? false : true}
                theme="primary"
              />
            </div>

            {event ? (
              <>
                <div className="container mx-auto my-auto h-30 grid grid-cols-2 ">
                  <div>
                    <div className="m-4">
                      <Input
                        label="Drop ID"
                        value={poapEvent.id}
                        state="disabled"
                        type="text"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Event Name"
                        value={poapEvent.name}
                        state="disabled"
                        type="text"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Event Description"
                        value={poapEvent.description}
                        state="disabled"
                        type="text"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="m-4">
                      <Input
                        label="Start Date"
                        value={poapEvent.start_date}
                        state="disabled"
                        type="text"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="End Date"
                        value={poapEvent.end_date}
                        state="disabled"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Virtual Event"
                        value={poapEvent.virtual_event}
                        state="disabled"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Image
                    loader={() => poapEvent.image_url}
                    src={poapEvent.image_url}
                    alt={poapEvent.name}
                    width="400"
                    height="400"
                  />
                </div>
              </>
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
