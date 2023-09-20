// No need for ending Evets manually

// import React, { useEffect, useState } from "react";
// import { useMoralis, useWeb3Contract } from "react-moralis";
// import { Form, useNotification } from "web3uikit";
// import networkMapping from "../constants/networkMapping.json";
// import eventConnectAbi from "../constants/EventConnect.json";

// export default () => {
//   const { isWeb3Enabled, chainId, account } = useMoralis();
//   const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
//   const eventConnectAddress = networkMapping[chainIdString].EventConnect[0];

//   const dispatch = useNotification();
//   const { runContractFunction } = useWeb3Contract();

//   async function EndEvent(data) {
//     console.log("Ending Event...");
//     const number = data.data[0].inputResult;

//     const endEventOptions = {
//       abi: eventConnectAbi,
//       contractAddress: eventConnectAddress,
//       functionName: "endEvent",
//       params: {
//         eventID: number,
//       },
//     };

//     await runContractFunction({
//       params: endEventOptions,
//       onSuccess: (tx) => handleListSuccess(tx),
//       onError: (error) => {
//         console.log(error);
//       },
//     });

//     console.log("Event Ended!");
//   }

//   async function handleListSuccess(tx) {
//     await tx.wait(1);
//     dispatch({
//       type: "success",
//       message: "Event Ended!",
//       title: "Ending Event",
//       position: "topR",
//     });
//   }

//   async function setupUI() {}

//   useEffect(() => {
//     setupUI();
//   }, [account, isWeb3Enabled, chainId]);

//   return (
//     <>
//       <div className="flex gap-2">
//         <Form
//           onSubmit={EndEvent}
//           data={[
//             {
//               name: "Event Number",
//               type: "number",
//               value: "",
//               key: "event",
//             },
//           ]}
//           title="End Event"
//           id="Main Form"
//         />
//       </div>
//     </>
//   );
// };
