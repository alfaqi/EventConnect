import Link from "next/link";
import { useMoralis } from "react-moralis";

export default function Events() {
  const { isWeb3Enabled } = useMoralis();

  return (
    <>
      {isWeb3Enabled ? (
        <div className="container mx-auto">
          <h1 className="py-4 m-2 font-bold text-2xl">Create an Event</h1>
          <p className="m-2">
            You can create a technical event such as a workshop or an online
            seminar to share knowledge and engage with your audience.
          </p>
          <div className="m-2">
            <Link
              href="/Events/CreateEvent"
              className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded mt-4 inline-block"
            >
              Create Now
            </Link>
          </div>
          <br />
          <hr />
          <h1 className="py-4 m-2 font-bold text-2xl">Explorer Events</h1>
          <p className="m-2">
            Discover events such as webinars, workshops, seminars, and
            conferences that align with your interests and learning goals.
            <br />
            Participate in these events to enhance your knowledge and skills.
          </p>
          <div className="m-2">
            <Link
              href="/Events/Events"
              className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded mt-4 inline-block"
            >
              Explorer
            </Link>
          </div>
          <br />
          <hr />

          <h1 className="py-4 m-2 font-bold text-2xl">My Events</h1>
          <p className="m-2">
            Manage your hosted events and track registrations within the
            EventConnect platform.
            <br />
            As an event organizer or educator, you can view and manage the
            details of events you've created.
          </p>
          <div className="m-2">
            <Link
              href="/Events/MyEvents"
              className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded mt-4 inline-block"
            >
              My Events
            </Link>
          </div>
          <br />
          <hr />
        </div>
      ) : (
        <>Please connect your wallet</>
      )}
    </>
  );
}
