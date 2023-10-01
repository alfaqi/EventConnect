import { Modal } from "web3uikit";
import {
  EventBy,
  EventDuration,
  EventDate,
  EventDescription,
  EventName,
  EventParticipants,
  EventStatus,
  EventImage,
  EventID,
} from "../Commons/index";

export default ({
  eventEnded,
  event,
  eventBy,
  attendees,
  broadCast,
  isVisible,
  onClose,
}) => {
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
          {eventEnded === "ended" && (
            <div className="text-red-700 font-bold text-xl">Event Ended</div>
          )}

          <EventID eventID={event.eventID} />
          <div className="flex flex-col gap-2 items-center border-solid border-2 border-gray-400 rounded p-2 w-fit">
            <EventImage name={event.name} banner={event.banner} />
            <EventName name={event.name} />
            <EventDescription description={event.description} />
          </div>
          <div className="p-1 text-base">
            <EventDate date={event.date} />
            <hr />
            <EventDuration duration={event.duration} />
            <hr />
            <EventBy eventBy={eventBy} />
            <hr />
            <EventParticipants attendees={attendees} />
          </div>
          <EventStatus
            name={event.name}
            eventStatus={eventEnded}
            broadCast={broadCast}
            playbackId={event.playbackId}
          />
        </div>
      </div>
    </Modal>
  );
};
