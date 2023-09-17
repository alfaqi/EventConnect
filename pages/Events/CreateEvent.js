import { useState } from "react";
import { useMoralis } from "react-moralis";
import { Button, Input, TextArea, Upload, Radios, Dropdown } from "web3uikit";
import Link from "next/link";

import CreateStreamModal from "@/components/CreateStreamModal";

export default () => {
  const { isWeb3Enabled, account } = useMoralis();

  const [name, setName] = useState("");
  const [date, setDate] = useState(0);
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");

  const [poapID, setPoapID] = useState(1);
  const [uploadFile, setUploadFile] = useState("");

  const [showCreateStreamModal, setShowCreateStreamModal] = useState(false);
  const hideCreateStreamModal = () => setShowCreateStreamModal(false);

  const handleCardClick = () => {
    const nowTime = new Date();
    const validDate = nowTime.getDate() + 1;

    const nowTime2 = new Date() / 1000;

    // console.log(nowTime);
    // console.log(nowTime / 1000);
    // console.log(nowTime2);
    // console.log(nowTime2 * 1000);
    // console.log(new Date(nowTime2));
    // console.log(new Date(nowTime2 * 1000));

    // const condition = (name, date, image) => {
    //   // تحقق من أن الاسم ليس فارغًا
    //   if (name === "") {
    //     return false;
    //   }

    // تحقق من أن التاريخ أكبر من تاريخ اليوم بيوم
    const today = new Date();
    // const dateObj = new Date(date);
    if (new Date(today.getTime() + 24 * 60 * 60 * 1000) / 1000 <= date) {
      console.log("الوقت المحدد اكبر من تاريخ اليوم");
      console.log("date < new Date(today.getTime() + 24 * 60 * 60 * 1000)");
      console.log(new Date(today.getTime() + 24 * 60 * 60 * 1000));
      console.log(new Date(today.getTime()));
      console.log(`date`);
      console.log(date);

      // return false;
    } else {
      console.log("الوقت المحدد اصغر من تاريخ اليوم");

      console.log(new Date(today.getTime() + 24 * 60 * 60 * 1000));
      console.log(new Date(today.getTime() + 24 * 60 * 60 * 1000) / 1000);
      console.log(new Date(today.getTime()));
      console.log(`date`);
      console.log(new Date(date * 1000));
      console.log(date);
    }

    // console.log(validDate);
    // if (name == "") return;
    // if (date < nowTime) return;
    // if (uploadFile.type != "image/png") return;
    // if (uploadFile.size > 10000) return;

    // alert("Please fill all required fields");
    account ? setShowCreateStreamModal(true) : setShowCreateStreamModal(false);
  };

  return (
    <>
      {isWeb3Enabled ? (
        <>
          <Link
            href={"/Events"}
            className="bg-green-500 hover:bg-green-700 text-white  py-1 px-2 rounded mt-2 inline-block"
          >
            Back
          </Link>
          <div className="container mx-auto h-56 grid grid-cols-1 gap-2 ">
            <h1 className="py-4 px-4 font-bold text-2xl">Create An Event</h1>
            <CreateStreamModal
              name={name}
              date={date}
              duration={duration}
              description={description}
              poapID={poapID}
              uploadFile={uploadFile}
              account={account}
              isVisible={showCreateStreamModal}
              onClose={hideCreateStreamModal}
            />
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
                    label: "60 Mintues",
                  },
                  {
                    id: "90",
                    label: "90 Mintues",
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
                  // console.log(uploadFile);
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
            <div className="m-2">
              <Button
                onClick={handleCardClick}
                text="Create Event"
                theme="primary"
              />
            </div>
          </div>
        </>
      ) : (
        <div>Please connect your wallet</div>
      )}
    </>
  );
};
