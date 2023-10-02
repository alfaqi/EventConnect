import Link from "next/link";
import { ConnectButton } from "web3uikit";
import { EventsMenu } from "./NavBar";

export default () => {
  return (
    <nav className="p-5 border-b-2  flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">Event Connect</h1>
      <div className="flex flex-row items-center space-x-4">
        <Link className="mr-4 p-6" href="/Events/Events">
          Home
        </Link>
        {/* <EventsMenu /> */}

        <Link className="mr-4 p-6" href="/Events/">
          Events
        </Link>

        <Link className="mr-4 p-6" href="/Poap/">
          POAP
        </Link>

        <Link className="mr-4 p-6" href="/Events/MyEvents">
          My Events
        </Link>

        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
};
