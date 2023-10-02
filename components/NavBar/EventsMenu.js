import Link from "next/link";
import { useState } from "react";

let showMore = false;
export default () => {
  const setShowMore = () => {
    showMore = !showMore;
  };
  console.log(showMore);
  return (
    <>
      <ul>
        <li>
          <Link className="mr-4 p-6" href="#" onClick={setShowMore}>
            Events
          </Link>
        </li>

        {showMore && (
          <>
            <li>
              <Link href="/Events/">Create Event</Link>
            </li>
            <li>
              <Link href="/Events/">Explorer Events</Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
};
