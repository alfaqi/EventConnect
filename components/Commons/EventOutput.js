import { useMoralis } from "react-moralis";

import { useState } from "react";

export default ({ name, eventBy, description, duration, date }) => {
  const { account } = useMoralis();

  const [formattedDate, setFormattedDate] = useState("");

  const eventDate = new Date(date * 1000);
  const timeSettings = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };
  setFormattedDate(eventDate.toLocaleDateString("en-US", timeSettings));
  return (
    <>
      <p>By: {eventBy.toLowerCase() === account ? "You" : eventBy}</p>
      <b className="text-lg">{name}</b>
      <p> {description}</p>
      <p>Duration: {duration}</p>
      <p>Date: {formattedDate}</p>
    </>
  );
};
