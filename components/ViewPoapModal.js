import { useEffect, useState } from "react";
import { Input } from "web3uikit";
import dotenv from "dotenv";
import Image from "next/image";
dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;

//POAP Section
export default ({ poapEventID }) => {
  const [poapEvent, setPoapEvent] = useState("");
  async function getPoapEvent() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    };
    await fetch(`https://api.poap.tech/events/id/${poapEventID}`, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setPoapEvent(response);
      })
      .catch((err) => console.error(err));
    const text = poapEvent?.name;

    console.log(text?.split("-"));
  }

  //To find out whether your request is still pending or not, use the GET /redeem-requests/active/count endpoint.
  //A result of 0 means that there are no pending requests
  async function checkRequest() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    };

    fetch(
      `https://api.poap.tech/redeem-requests/active/count?event_id=${poapEventID}&redeem_type=qr_code`,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }
  useEffect(() => {
    getPoapEvent();
  }, []);

  return (
    <>
      <div className="container mx-auto my-auto h-30 grid grid-cols-2 ">
        <div>
          <div className="m-4">
            <Input
              label="Drop ID"
              value={poapEvent.id}
              state="disabled"
              type="text"
            />
          </div>
          <div className="m-4">
            <Input
              label="Event Name"
              value={poapEvent && poapEvent.name.split("-")[1]}
              state="disabled"
              type="text"
            />
          </div>
          <div className="m-4">
            <Input
              label="Event Description"
              value={poapEvent.description}
              state="disabled"
              type="text"
            />
          </div>
        </div>

        <div>
          <div className="m-4">
            <Input
              label="Start Date"
              value={poapEvent.start_date}
              state="disabled"
              type="text"
            />
          </div>
          <div className="m-4">
            <Input
              label="End Date"
              value={poapEvent.end_date}
              state="disabled"
            />
          </div>
          <div className="m-4">
            <Input
              label="Virtual Event"
              value={poapEvent.virtual_event}
              state="disabled"
            />
          </div>
        </div>
      </div>
      <div>
        <Image
          loader={() => poapEvent.image_url}
          src={poapEvent.image_url}
          alt={poapEvent.name}
          width="400"
          height="400"
        />
      </div>
    </>
  );
};
