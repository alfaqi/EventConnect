import dotenv from "dotenv";
dotenv.config();

import { Button, Modal } from "web3uikit";
import { useCreateStream } from "@livepeer/react";
import copy from "clipboard-copy";
import CreateEventModal from "./CreateEventModal";
import { useState } from "react";

export default ({
  name,
  date,
  duration,
  description,
  account,
  uploadFile,
  poapID,
  isVisible,
  onClose,
}) => {
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(
    name
      ? {
          name: name,
          // playbackPolicy: { type: "jwt" },
        }
      : null
  );
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const hideCreateEventModal = () => setShowCreateEventModal(false);

  return (
    <>
      <Modal
        isVisible={isVisible}
        onCancel={onClose}
        onOk={createStream}
        onCloseButtonPressed={onClose}
        title="Last step, Check the Event details"
        okText="Add Event"
        cancelText="Close"
        isOkDisabled={stream ? true : false}
      >
        <p>Name: {name}</p>
        <p>Date: {date}</p>
        <p>Duration: {duration}</p>
        <p>Description: {description}</p>
        <p>
          URL:{" "}
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
      {stream ? (
        <>
          <CreateEventModal
            stream={stream}
            name={name}
            date={date}
            duration={duration}
            description={description}
            uploadFile={uploadFile}
            account={account}
            poapID={poapID}
            isVisible={showCreateEventModal}
            onClose={hideCreateEventModal}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
