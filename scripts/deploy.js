const { network, ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const frontEndContractsFile = "./constants/networkMapping.json";
const frontEndContractsABIPath = "./constants/";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deployed by:", deployer.address);

  const EventConnect = await ethers.deployContract("EventConnect");
  console.log("Deployed at:", EventConnect.target);

  // Updating Addresses and ABIs of FrontEnd
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to frontend...");
    await updateContractAddresses(EventConnect);
    await updateAbi(EventConnect);
    console.log("Frontend written!");
  }
}

// There are some issues with verification
async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

async function updateAbi(eventConnect) {
  fs.writeFileSync(
    `${frontEndContractsABIPath}EventConnect.json`,
    eventConnect.interface.formatJson()
  );
}

async function updateContractAddresses(eventConnect) {
  const chainId = network.config.chainId.toString();
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );

  if (chainId in contractAddresses) {
    if (contractAddresses[chainId]["EventConnect"]) {
      if (
        !contractAddresses[chainId]["EventConnect"].includes(
          eventConnect.target
        )
      ) {
        contractAddresses[chainId]["EventConnect"].push(eventConnect.target);
      }
    } else {
      contractAddresses[chainId]["EventConnect"] = eventConnect.target;
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
