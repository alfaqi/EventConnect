import { Button, Modal } from "web3uikit";
import Image from "next/image";
import { useMoralis } from "react-moralis";

//Attened Card

export default ({
  eventEnded,
  event,
  eventBy,
  date,
  attendees,
  isParticipantRegistered,
  broadCast,
  isVisible,
  onClose,
}) => {
  const { account } = useMoralis();

  const gotoEventFunc = () => {
    // if (eventBy.toLowerCase() === account) {
    //   window.open(
    //     `/Live/Live?id=${broadCast}&title=${event.name}&auth=0`,
    //     "_blank"
    //   );
    // } else {
    //   window.open(
    //     `/Live/Live?id=${event.playbackId}&title=${event.name}&auth=1`,
    //     "_blank"
    //   );
    // }

    const liveEventURL =
      eventBy.toLowerCase() === account
        ? `/Live/Live?id=${broadCast}&title=${event.name}&auth=0`
        : `/Live/Live?id=${event.playbackId}&title=${event.name}&auth=1`;

    window.location.href = liveEventURL;
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      title="View Event Details"
      okText="OK"
      cancelText="Back"
      onOk={onClose}
      isOkDisabled="true"
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col ">
          {eventEnded === "ended" ? (
            <>
              <div className="text-red-700 font-bold text-xl">Event Ended</div>
            </>
          ) : (
            <></>
          )}
          <p>Event ID: {Number(event.eventID) + 1}</p>
          <div className="flex flex-col gap-2 items-center border-solid border-2 border-gray-400 rounded p-2 w-fit">
            <Image
              loader={() => event.banner}
              src={event.banner}
              alt={event.name}
              width="400"
              height="400"
            />
            <b className="text-lg">{event.name}</b>
            {event.description}
          </div>
          <div className="p-1 text-base">
            <p>Date: {date}</p>
            <hr />
            <p>Duration: {event.duration}</p>
            <hr />

            <p>By: {eventBy.toLowerCase() === account ? "You" : eventBy}</p>
            <hr />
            <p>{attendees} attendees</p>
          </div>
          {eventEnded === "online" ? (
            <div>
              <Button text="Goto LiveStream" onClick={gotoEventFunc} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Modal>
  );
};
