import { useState } from "react";
import { useMoralis } from "react-moralis";
import { Input, TextArea, Upload, Radios, Dropdown } from "web3uikit";
import Link from "next/link";

import CreateStreamModal from "@/components/Modals/CreateStreamModal";

export default () => {
  // Using Moralis's plan to check for Web3 enablement
  const { isWeb3Enabled, account } = useMoralis();

  // States for user-entered fields
  const [name, setName] = useState("");
  const [date, setDate] = useState(0);
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");

  const [poapID, setPoapID] = useState(1);
  const [uploadFile, setUploadFile] = useState("");

  // State for showing the active Create Event modal
  const [showCreateStreamModal, setShowCreateStreamModal] = useState(false);
  const hideCreateStreamModal = () => setShowCreateStreamModal(false);

  // Handle click on the button to create the event
  const handleCardClick = () => {
    const today = new Date();

    // Validate user-entered data
    if (name === "") {
      alert("Please fill the name of Event");
      return;
    }
    // if (new Date(today.getTime() + 24 * 60 * 60 * 1000) / 1000 >= date) {
    //   alert("The date must be bigger then today");
    //   return;
    // }

    if (!uploadFile) {
      alert("Please upload an image for Event");
      return;
    }
    if (uploadFile.size > 5242880) {
      console.log(uploadFile);
      alert("Image size must be less than 5MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif"].includes(uploadFile.type)) {
      alert("Image must be in PNG / JPG / GIF format");
      return;
    }

    // If logged in, open the Create Event modal
    account ? setShowCreateStreamModal(true) : setShowCreateStreamModal(false);
  };

  return (
    <>
      {isWeb3Enabled ? (
        <>
          <Link href={"/Events"} className="Link__Back">
            Back
          </Link>
          <div className="container mx-auto h-56 grid grid-cols-1 gap-2 ">
            <h1 className="py-4 px-4 font-bold text-2xl">Create An Event</h1>
            {showCreateStreamModal && (
              <CreateStreamModal
                name={name}
                date={date}
                duration={duration}
                description={description}
                poapID={poapID}
                uploadFile={uploadFile}
                account={account}
                // isVisible={}
                onClose={hideCreateStreamModal}
              />
            )}
            <div className="m-2">
              <Input
                id="name"
                label="Name"
                name="name"
                width="100%"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter Event name"
                validation={{
                  required: true,
                }}
              />
            </div>
            <div className="m-2">
              <input
                type="datetime-local"
                title="Date and Time"
                onChange={(e) => {
                  setDate(new Date(e.target.value) / 1000);
                  console.log(date);
                }}
              />
            </div>

            <div className="m-2">
              <Dropdown
                defaultOptionIndex={0}
                label="Duration: "
                onChange={(e) => {
                  setDuration(e.id);
                  console.log(e);
                }}
                options={[
                  {
                    id: "30",
                    label: "30 Minutes",
                  },
                  {
                    id: "60",
                    label: "60 Minutes",
                  },
                  {
                    id: "90",
                    label: "90 Minutes",
                  },
                ]}
              />
            </div>
            <div className="m-2">
              <TextArea
                label="Description"
                id="description"
                name="description"
                width="100%"
                onBlur={function noRefCheck() {}}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Type here field"
                validation={{
                  required: true,
                }}
              />
            </div>
            <div className="m-2">
              <Upload
                acceptedFiles="image/png"
                descriptionText="Recommendation: 250px by 250px"
                onChange={(e) => {
                  setUploadFile(e);
                }}
              />
            </div>
            <div className="m-2">
              <Radios
                id="radios"
                items={["Yes", "No"]}
                onBlur={function noRefCheck() {}}
                onChange={(e) => {
                  setPoapID(e.target.value);
                  console.log(e.target.value);
                }}
                onCreditCardRemoved={function noRefCheck() {}}
                setWhichIsChecked={1}
                title="Will you provide proof of attendance?"
              />
            </div>
            <div>
              <Link className="Link__Click" onClick={handleCardClick} href="#">
                Create Event
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div>Please connect your wallet</div>
      )}
    </>
  );
};
