import { useEffect, useState } from "react";
import { Button, Input, Upload } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "@/constants/networkMapping.json";
import eventConnectAbi from "@/constants/EventConnect.json";

import dotenv from "dotenv";
import Link from "next/link";
import CreatePoapModal from "@/components/CreatePoapModal";
import Image from "next/image";
dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;

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

  const [showCreateButton, setShowCreateButton] = useState(false);

  const [poapEventID, setPoapEventID] = useState(0);

  const [secretCode, setSecretCode] = useState(0);

  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const [showCreatePaopModal, setShowCreatePoapModal] = useState(false);
  const hideCreatePoapModal = () => setShowCreatePoapModal(false);

  const [eventID, setEventID] = useState(0);

  const [eventObj, setEventObj] = useState(false);

  const [isThereEvent, setIsThereEvent] = useState(false);

  // Get Event by ID Function
  const { runContractFunction: getOneEvent } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: networkMapping[chainIdString].EventConnect[0],
    functionName: "getOneEvent",
    params: {
      eventID: eventID,
    },
  });

  // Check for event and meet the requirements
  async function checkEvent() {
    setIsThereEvent(false);
    setShowCreateButton(false);

    if (eventID <= 0) {
      alert("Event ID must be bigger then 0");
      return;
    }

    // 1- get event object
    const eventObj = await getOneEvent();

    if (!eventObj) {
      alert("Event not existed");
      return;
    }
    console.log(eventObj);

    if (eventObj.creator.toLowerCase() != account) {
      alert("This event was not created by you");
      return;
    }

    if (eventObj.poapID.toString() == "1") {
      alert("You selected to not provide proof of attendance!");
      return;
    }

    if (eventObj.providePOAP) {
      alert("You already created Drop!");
      setShowCreateButton(false);
    } else {
      setShowCreateButton(true);
    }

    setIsThereEvent(true);

    // After passing the requirements will
    // Calling function to gather the information from Event object
    await fetchEventData(eventObj.eventURI);
  }

  // 2- fetch event data from event object
  async function fetchEventData(eventObjURI) {
    await fetch(eventObjURI)
      .then((response) => {
        if (!response) {
          throw new Error("Request failed!");
        }
        return response.json();
      })
      .then((data) => {
        // 3- fillful the data that related to create a Drop
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
        if (secretCode == 0)
          setSecretCode(Math.floor(100000 + Math.random() * 900000));
      });
  }

  //POAP Section
  // Create Drop Function
  async function createDrop() {
    if (!uploadedImage) return;
    const form = new FormData();
    form.append("name", name);
    form.append("description", description ? description : "Description");
    form.append("start_date", startDate);
    form.append("end_date", endDate);
    form.append("expiry_date", expiryDate);
    form.append("image", uploadedImage);
    form.append("secret_code", secretCode);
    form.append("email", email ? email : "email@email.com");

    form.append("virtual_event", "true");
    form.append("event_template_id", "1");
    form.append("private_event", "true");
    form.append("notify_issuer", "true");
    form.append("city", "Online");
    form.append("country", "Online");
    // form.append("requested_codes", "0");

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
        // "content-type": "multipart/form-data",
      },
    };

    options.body = form;

    await fetch("https://api.poap.tech/events", options)
      .then((response) => response.json())
      .then((response) => {
        if (response.statusCode) {
          alert(response.message);
          console.log(response);
          return;
          // setPoapEvent(response);
        } else {
          setPoapEventID(response?.id);
          console.log(response);
        }
      })
      .catch((err) => alert(err));
  } //  output => EventID

  useEffect(() => {
    setIsThereEvent(false);
  }, [isWeb3Enabled, account]);
  return (
    <>
      {account ? (
        <>
          <Link href={"/Poap"} className="Link__Back">
            Back
          </Link>
          {poapEventID ? (
            <CreatePoapModal
              eventID={eventID}
              poapID={poapEventID}
              eventConnectAddress={
                networkMapping[chainIdString].EventConnect[0]
              }
              isVisible={showCreatePaopModal}
              onClose={hideCreatePoapModal}
            />
          ) : (
            <></>
          )}
          <div className="flex flex-col items-center ">
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
              <Link onClick={checkEvent} href={"#"} className="Link__Click">
                Check for Event
              </Link>
            </div>
            <div>
              <h5 className="font-bold m-2 text-sm">
                Please use this site to create your Artwork{" "}
                <Link
                  href="https://snowdot.github.io/poap-place/"
                  target="_blank"
                  className="underline"
                >
                  Click here
                </Link>
              </h5>
            </div>
            {isThereEvent ? (
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
                        value={eventObj.eventID}
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

                {showCreateButton && (
                  <div className="container mx-auto ">
                    <div>
                      <Upload onChange={(e) => setUploadedImage(e)} />
                    </div>
                    <div className="m-4">
                      <Button
                        text="Create Drop"
                        onClick={createDrop}
                        theme="primary"
                        disabled={uploadedImage ? false : true}
                      />
                    </div>
                  </div>
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
