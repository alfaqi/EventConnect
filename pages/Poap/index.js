import Link from "next/link";
import { useMoralis } from "react-moralis";

export default () => {
  const { isWeb3Enabled } = useMoralis();

  return (
    <>
      {isWeb3Enabled ? (
        <div className="container mx-auto">
          <h1 className="py-4 m-2 font-bold text-2xl">
            Create Drop (POAP) for Participatns
          </h1>
          <p className="m-2">
            Easily reward event participants with Proof of Attendance Protocol
            (POAP) NFTs through EventConnect. This feature allows event
            organizers to create and distribute POAP tokens to attendees,
            providing them with a unique and collectible digital badge that
            signifies their participation in educational events.
          </p>
          <div className="m-2">
            <Link href="/Poap/CreatePoap" className="Link__Click">
              Create Drop
            </Link>
          </div>
          <div>
            <ol className="m-2">
              <h5 className="font-bold text-l">Steps to Create POAP </h5>
              <li>Check the Event is existed</li>
              <li>Create to Artwork using recommended site</li>
              <li>Upload your Artwork</li>
              <li>
                Add your email to receive the Drop into your account, so you can
                manage them.{" "}
                <p>
                  Please goto Main site of POAP{" "}
                  <a
                    className="underline"
                    href="https://drops.poap.xyz/"
                    target="_blank"
                  >
                    https://drops.poap.xyz/
                  </a>
                </p>
              </li>
              <li>Click Create Drop</li>
            </ol>
          </div>
          <br />
          <hr />

          <h1 className="py-4 m-2 font-bold text-2xl">
            View Drop (POAP) Details
          </h1>
          <p className="m-2">
            Event organizers and participants can easily access information
            about their POAP tokens, including event names, dates, and
            additional metadata. Stay informed about your earned POAPs and
            showcase your participation in educational events.
          </p>
          <div className="m-2">
            <Link href="/Poap/ViewPoap" className="Link__Click">
              View Poap
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
};
