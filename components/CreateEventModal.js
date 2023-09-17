import { useEffect, useState } from "react";

import dotenv from "dotenv";
dotenv.config();

import { Web3Storage } from "web3.storage";
import { Button, Modal, useNotification } from "web3uikit";

import networkMapping from "../constants/networkMapping.json";
import eventConnectAbi from "../constants/EventConnect.json";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default ({
  name,
  date,
  duration,
  description,
  stream,
  account,
  uploadFile,
  poapID,
  isVisible,
  onClose,
}) => {
  const { chainId } = useMoralis();

  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  const eventConnectAddress = networkMapping[chainIdString].EventConnect[0];

  const { runContractFunction: getEventIndex } = useWeb3Contract({
    abi: eventConnectAbi,
    contractAddress: eventConnectAddress,
    functionName: "getEventIndex",
  });

  const { runContractFunction } = useWeb3Contract();

  const dispatch = useNotification();

  async function checkAndSubmit(fullCID) {
    const addEventOptions = {
      abi: eventConnectAbi,
      contractAddress: eventConnectAddress,
      functionName: "addEvent",
      params: {
        eventURI: fullCID,
        streamKey: stream.streamKey,
        poapID: poapID,
      },
    };

    await runContractFunction({
      params: addEventOptions,
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => {
        console.log(error);
      },
    });

    console.log("Event Added!");
  }

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "The operation was successful",
      title: "Successful",
      position: "topR",
    });
    onClose && onClose();
  };

  /**
   * CID
   */

  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_API_TOKEN;

  const client = new Web3Storage({ token });

  const prefix = "https://";
  const suffix = ".ipfs.w3s.link";

  let cid;

  async function createNewEvent() {
    /*
     ** Get CID
     */
    // const res = await client.get(CID); // Web3Response
    // const files = await res.files(); // Web3File[]
    // for (const file of files) {
    //   console.log(`${file.cid} ${file.name} ${file.size}`);
    // }

    /*
     * Storing Files (Uploading to IPFS)
     */

    console.log(`Uploading ${uploadFile.name}...`);

    // const onRootCidReady = (rootCid) => console.log("root cid:", rootCid);
    // cid = await client.put([uploadFile], { onRootCidReady });

    cid = await client.put([uploadFile], {
      wrapWithDirectory: false,
    });
    console.log(`Getting files of ${cid}`);
    // console.log(`stream ${stream}`);

    await setMetadata();
    // await checkAndSubmit();
  }

  async function setMetadata() {
    // const eventIndex = await getEventIndex();
    // setEventID(eventIndex);
    // console.log(`eventID`);
    // console.log(await getEventIndex());

    let eventMetadata = { ...metadataTemplate };

    console.log(`Working on ${uploadFile.name}...`);
    console.log(uploadFile.name);

    eventMetadata.eventID = `${await getEventIndex()}`;
    eventMetadata.name = name;
    eventMetadata.date = date;
    eventMetadata.duration = duration;
    eventMetadata.description = description;
    eventMetadata.banner = `${prefix}${cid}${suffix}`;
    eventMetadata.playbackId = stream.playbackId;

    await setJsonFile(eventMetadata);
  }

  const metadataTemplate = {
    eventID: "",
    name: "",
    date: "",
    duration: "",
    description: "",
    banner: "",
    playbackId: "",
  };

  async function setJsonFile(eventMetadata) {
    console.log(`Writing JSON file: ${eventMetadata.name}.json`);
    const buffer = Buffer.from(JSON.stringify(eventMetadata));
    const files = [new File([buffer], `${eventMetadata.name}.json`)];
    cid = await client.put(files, { wrapWithDirectory: false });
    console.log(`Done writing JSON file: ${eventMetadata.name}.json`);

    checkAndSubmit(`${prefix}${cid}${suffix}`);
    onClose && onClose();
  }

  useEffect(() => {
    createNewEvent();
  }, []);
  return (
    <>
      <Modal
        isVisible={isVisible}
        onCancel={onClose}
        onOk={onClose}
        onCloseButtonPressed={onClose}
        title="Last step, Check a Banner for your Event"
        okText="Done"
        cancelText="Close"
        // isOkDisabled={!uploadFile}
      >
        <p>Event Name: {name}</p>
        <p>Event Date: {date}</p>
        <p>Event Duration: {duration}</p>
        <p>Event Description: {description}</p>
        <p>
          Event URL:{" "}
          {stream ? (
            <>
              <a
                id="liveStream"
                href={"https://lvpr.tv?v=" + stream.playbackId}
                target="_blank"
              >
                {"https://lvpr.tv?v=" + stream.playbackId}
              </a>{" "}
              <Button
                text="copy"
                onClick={() => {
                  copy(`https://lvpr.tv?v=${stream.playbackId}`);
                }}
              />
            </>
          ) : (
            <></>
          )}
        </p>
        <p>Event By: {account}</p>
      </Modal>
    </>
  );
};
