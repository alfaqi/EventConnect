import { useEffect, useState } from "react";
import { Button, Input, Upload, useNotification } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";

import dotenv from "dotenv";
import Link from "next/link";
// import ViewPoapModal from "@/components/ViewPoapModal";
import CreatePoapModal from "@/components/CreatePoapModal";
import Image from "next/image";
// import Image from "next/image";
dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;
const authKey = "";
// const eventID = "142411";
// const eventID = "149135";
// const newEventId = "149614";

export default () => {
  // Pre-POAP Section
  const { isWeb3Enabled, account, chainId } = useMoralis();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [email, setEmail] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  // const [poapEvent, setPoapEvent] = useState("");
  const [poapID, setPoapID] = useState(0);
  const [poapEventID, setPoapEventID] = useState(0);

  const [secretCode, setSecretCode] = useState(0);

  const [options, setOpions] = useState("");

  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [showCreateStreamModal, setShowCreateStreamModal] = useState(false);
  const hideCreateStreamModal = () => setShowCreateStreamModal(false);

  const handleCardClick = async () => {
    account ? setShowCreateStreamModal(true) : setShowCreateStreamModal(false);
  };

  const [showCreatePaopModal, setShowCreatePoapModal] = useState(false);
  const hideCreatePoapModal = () => setShowCreatePoapModal(false);

  const handleCreateCardClick = async () => {
    account ? setShowCreatePoapModal(true) : setShowCreatePoapModal(false);
  };

  const [eventID, setEventID] = useState(0);

  const [eventObj, setEventObj] = useState(false);
  const [event, setEvent] = useState(false);

  const { runContractFunction } = useWeb3Contract();

  const { runContractFunction: addPoapID } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "addPoapID",
    params: {
      eventID: eventID,
      poapID: poapEventID,
    },
  });

  // async function addpID() {
  //   const a = await addPoapID();
  //   console.log(await addPoapID());
  //   console.log(poapEventID);
  //   console.log(a);
  // }

  async function checkEvent() {
    console.log(eventID);
    setEvent(false);

    //  1- get event id from user (Input)
    const getEventOptions = {
      abi: eventConnectAbi,
      contractAddress: networkMapping[chainIdString].EventConnect[0],
      functionName: "getEvent",
      params: {
        eventID: eventID,
      },
    };

    // 2- get event object
    const eventObj = await runContractFunction({
      params: getEventOptions,
      onSuccess: (a) => {
        if (a?.creator.toLowerCase() == account) setEvent(true);
        else alert("Event not existed");
      },
      onError: (error) => {
        console.log(error);
        setEvent(false);
        alert("Event not existed");
      },
    });

    if (!eventObj) return;
    console.log(eventObj);

    if (!eventObj.providePOAP) {
      if (eventObj.poapID.toString() == "1") {
        alert("You selected to not provide proof of attendance!");
        setEvent(false);
        return;
      }
    } else if (eventObj.poapID > 1) {
      alert("You already provided it!");
      setEvent(true);
      setPoapID(eventObj.poapID);
      // return;
    }
    await fetchEventData(eventObj.eventURI);
  }
  const dispatch = useNotification();

  const handleSuccess = async () => {
    dispatch({
      type: "success",
      message: "The operation was successful",
      title: "Successful",
      position: "topR",
    });
    alert("Please write down your secret code (Edit code)");
  };
  // 3- fetch event data from event object
  async function fetchEventData(eventObj) {
    if (!eventObj) return;
    console.log(eventObj);
    await fetch(eventObj)
      .then((response) => {
        if (!response) {
          throw new Error("Request failed!");
        }
        return response.json();
      })
      .then((data) => {
        // 4- fillful the data that related to create a Drop
        setEventObj(data);

        setName(`${eventID}-${data.name}-${data.date}`);
        setDescription(data.description);

        const timeSettings = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };

        let eventDate = new Date(data.date * 1000);
        const startDateFormatted = eventDate.toLocaleDateString(
          "en-CA",
          timeSettings
        );
        setStartDate(startDateFormatted);

        eventDate = new Date((data.date + data.duration * 24 * 60) * 1000);
        const endDateFormatted = eventDate.toLocaleDateString(
          "en-CA",
          timeSettings
        );
        setEndDate(endDateFormatted);

        // Add one Month to date
        const secondsInAMonth = 30 * 24 * 60 * 60;
        eventDate = new Date((data.date + secondsInAMonth) * 1000);
        const expiryDateFormatted = eventDate.toLocaleDateString(
          "en-CA",
          timeSettings
        );
        setExpiryDate(expiryDateFormatted);
        setSecretCode(Math.floor(100000 + Math.random() * 900000));
      });
  }

  /**
   * 1- get event id from contract
   * 2- get event object
   * 3- fetch data from event object
   * 4- fillful the data that related to create a Drop
   * 5- create Drop
   */

  //POAP Section

  async function mintLinks() {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        // "content-type": "application/json",
        "x-api-key": apiKey,
        mode: "no-cors",
      },
      body: JSON.stringify({
        notify_issuer: true,
        redeem_type: "qr_code",
        event_id: poapEventID,
        requested_codes: "5",
        secret_code: "123456",
      }),
    };

    fetch("https://api.poap.tech/redeem-requests", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  } // output =>  petition ID

  /**
   * Create drop (event)
   *  @returns
   */
  async function createPoapDrop() {
    await createDrop();
    await addPoapID();
    handleSuccess();
  }
  async function createDrop() {
    if (!uploadedImage) return;
    const form = new FormData();
    form.append("name", name);
    form.append("description", description ? description : "Description");
    form.append("start_date", startDate);
    form.append("end_date", endDate);
    form.append("expiry_date", expiryDate);
    form.append("image", uploadedImage);

    form.append("virtual_event", "true");
    form.append("event_template_id", "1");
    form.append("private_event", "true");
    form.append("notify_issuer", "true");
    form.append("city", "Online");
    form.append("country", "Online");
    form.append("secret_code", secretCode);
    // form.append("requested_codes", "0");

    form.append("email", email);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
        "content-type": "multipart/form-data",
      },
    };

    options.body = form;

    // setOpions(options);
    // return;
    await fetch("https://api.poap.tech/events", options)
      .then((response) => response.json())
      .then((response) => {
        if (response.statusCode) {
          alert(response.message);
          console.log(response);
          // setPoapEvent(response);
        } else {
          setPoapEventID(response?.id);
          console.log(response);
        }
      })
      .catch((err) => alert(err));
  } //  output => EventID

  const output = {
    id: 149971,
    fancy_id: "0-ai-in-business-strategy-1694649600-2023",
    name: "0-AI in Business Strategy-1694649600",
    description: "AI in Business Strategy",
    city: "Online",
    country: "Online",
    image_url:
      "https://assets.poap.xyz/0-ai-in-business-strategy-1694649600-2023-logo-1694629451056.png",
    year: 2023,
    start_date: "2023-09-14",
    end_date: "2023-09-15",
    expiry_date: "2023-10-14",
    from_admin: false,
    virtual_event: true,
    event_template_id: 1,
    private_event: true,
  };

  // To retrieve the mint links for your drop
  async function getMintLinks() {
    //     /event/{id}/qr-codes
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${authKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ secret_code: "234789" }),
    };

    fetch(`https://api.poap.tech/event/${poapEventID}/qr-codes`, options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  //To request additional mint links as a top-up, use POST /redeem-requests with the event_id
  // it takes about 24H
  async function moreMintLinks() {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${authKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        notify_issuer: true,
        redeem_type: "qr_code",
        event_id: 1,
        requested_codes: 1,
        secret_code: "234789",
      }),
    };

    fetch("https://api.poap.tech/redeem-requests", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
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

  /**
   * 4. Minting a POAP directly to a wallet
   * Prerequisites
   * - An API key to access POAP’s API, apply for one here
   * - An auth token to generate an access token, apply using the same link here
   * - An event has been created
   * - A user's Ethereum address, ENS, or email
   * Flow
   * 1- Use POST /event/{id}/qr-codes to get a qr_hash (claim codes) for your event.
   * 2- Use GET /actions/claim-qr and pass in a qr_hash from the previous step to get the claim secret.
   * 3- Once you have the qr_hash and the secret, you can mint the POAP to your user's Ethereum address, ENS, or email using POST /actions/claim-qr.
   */
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
          <CreatePoapModal
            options={options}
            isVisible={showCreatePaopModal}
            onClose={hideCreatePoapModal}
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="py-4 px-4 font-bold text-2xl">
              Create Drop (POAP) for participatns
            </h1>
            <div className="m-2">
              <Input
                label="Event ID"
                placeholder="Enter event id"
                onChange={(e) => setEventID(e.target.value)}
                type="number"
              />
            </div>
            <div className="m-2">
              <Button
                text="Check for Event"
                onClick={checkEvent}
                disabled={eventID ? false : true}
                theme="primary"
              />
            </div>
            <div>
              <h5 className="font-bold text-sm">
                Please use this site to create a Artwork{" "}
                <Link
                  href="https://snowdot.github.io/poap-place/"
                  target="_blank"
                  className="underline"
                >
                  Click here
                </Link>
              </h5>
            </div>
            {event ? (
              <div>
                <div className="m-4">
                  <Input
                    label="Drop ID"
                    value={poapEventID}
                    state="disabled"
                    type="text"
                    size="100%"
                  />
                </div>
                <div className="container mx-auto my-auto h-30 grid grid-cols-2 ">
                  <div>
                    <div className="m-4">
                      <Input
                        label="Event ID"
                        value={eventObj.eventId}
                        state="disabled"
                        type="text"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Event Name"
                        value={eventObj.name}
                        state="disabled"
                        type="text"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Event Description"
                        value={eventObj.description}
                        state="disabled"
                        type="text"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Event Start Date"
                        value={startDate}
                        state="disabled"
                        type="text"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="m-4">
                      <Input
                        label="Event End Date"
                        value={endDate}
                        state="disabled"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Duration"
                        value={eventObj.duration}
                        state="disabled"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="To notice you when your POAP is ready"
                      />
                    </div>
                    <div className="m-4">
                      <Input
                        label="Secret Code"
                        value={secretCode}
                        state="disabled"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-auto items-center">
                  <Image
                    loader={() => eventObj.banner}
                    src={eventObj.banner}
                    alt={eventObj.name}
                    width={"200"}
                    height={"200"}
                  />
                </div>

                {poapID > 1 ? (
                  <div className="container mx-auto ">
                    <div>
                      <Upload onChange={(e) => setUploadedImage(e)} />
                    </div>
                    <div className="m-4">
                      <Button
                        text="Create Drop"
                        onClick={createPoapDrop}
                        theme="primary"
                        disabled={uploadedImage ? false : true}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
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
