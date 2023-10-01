import { useState } from "react";

export default ({ attendees }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <p>
      {attendees?.length}{" "}
      <a onClick={() => setShowMore(!showMore)}>attendees</a>
      {showMore && (
        <>
          {attendees.map((att, i) => {
            return <p>{i + 1 + " " + att}</p>;
          })}
        </>
      )}
    </p>
  );
};
