require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const GOERLI_API_KEY = process.env.GOERLI_API_KEY || "http://eth-goerli";
const accounts = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
// let accounts = ["your private key here"];
// let accounts = { mnemonic: "your mnemonic here" };

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: "./public/artifacts",
  },
  solidity: "0.8.19",
  //2) select the default network "gnosis" or "chiado"
  // defaultNetwork: "chiado",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_API_KEY,
      accounts: [accounts],
      chainId: 5,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      blockConfirmations: 1,
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [accounts],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: [accounts],
    },
  },
  etherscan: {
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: ETHERSCAN_API_KEY,
      // gnosis: "your key",
    },
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
  },
};
