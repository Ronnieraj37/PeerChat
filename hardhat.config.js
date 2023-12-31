require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 250,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
  },
  paths: {
    artifacts: "./client/src/artifacts",
  },
};
