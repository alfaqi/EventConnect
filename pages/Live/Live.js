import { useEffect, useState } from "react";
import { Button } from "web3uikit";
import { parse } from "url";
import { useMoralis } from "react-moralis";
import LiveFrame from "@/components/LiveFrame";
import LiveBroadcast from "@/components/LiveBroadcast";

export default function live() {
  const { account } = useMoralis();
  const [playbackId, setPlaybackId] = useState("");
  const [streamKey, setStreamKey] = useState("");
  const [title, setTitle] = useState("");
  const [auth, setAuth] = useState(0);
  const [goLive, setGoLive] = useState(false);
  const goLiveFunc = () => {
    setGoLive(!goLive);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const parsedUrl = parse(currentUrl, true);
    if (parsedUrl.path == "/Live/Live") {
      window.open("/Events/Events", "_parent");
    }

    const urlAuth = parsedUrl.query.auth;
    setAuth(urlAuth);
    const urlTitle = parsedUrl.query.title ? parsedUrl.query.title : "null";

    let urlID;
    if (urlAuth == 0) {
      urlID = parsedUrl.query.id ? parsedUrl.query.id : "null";
      setStreamKey(urlID);
    } else {
      urlID = parsedUrl.query.id ? parsedUrl.query.id : "null";
      setPlaybackId(urlID);
    }

    setTitle(urlTitle);
  }, []);
  if (auth == "0") {
    return (
      <>
        {account ? (
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">{title}</h1>
            <Button
              text={goLive ? "Stop Event" : "Start Event"}
              onClick={goLiveFunc}
              theme={goLive ? "secondary" : "primary"}
            />
            {goLive && <LiveBroadcast title={title} streamKey={streamKey} />}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  } else {
    return (
      <>
        {account ? (
          <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">{title}</h1>
            <Button
              text={goLive ? "Leave Event" : "Go Live"}
              onClick={goLiveFunc}
              theme={goLive ? "secondary" : "primary"}
            />
            {goLive && <LiveFrame title={title} playbackId={playbackId} />}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
