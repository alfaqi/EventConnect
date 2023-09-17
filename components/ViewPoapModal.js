// import React from "react";
// import { Modal } from "web3uikit";
// import dotenv from "dotenv";
// import Image from "next/image";
// dotenv.config();

// export default ({ poapEvent, code, isVisible, onClose }) => {
//   return (
//     <Modal
//       isVisible={isVisible}
//       onCancel={onClose}
//       onCloseButtonPressed={onClose}
//       title="View Drop Details"
//       okText="OK"
//       cancelText="Back"
//       onOk={onClose}
//       isOkDisabled="true"
//     >
//       <div
//         style={{
//           alignItems: "center",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         <div className="flex flex-col items-center ">
//           <div className="flex flex-col gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
//             <Image
//               loader={() => poapEvent.image_url}
//               src={poapEvent.image_url}
//               alt={poapEvent.name}
//               width="400"
//               height="400"
//             />
//             <b className="text-lg">{poapEvent.id}</b>
//             <b className="text-lg">{poapEvent.name}</b>
//             {poapEvent.description}
//           </div>
//           <div className="p-1 text-base">
//             <p>start_date: {poapEvent.start_date}</p>
//             <hr />
//             <p>end_date: {poapEvent.end_date}</p>
//             <hr />
//             <p>expiry_date: {poapEvent.expiry_date}</p>
//             <hr />
//             {code ? (
//               <>
//                 <p>Secret Code / Edit Code: {code}</p>
//                 <hr />
//               </>
//             ) : (
//               <></>
//             )}
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };
