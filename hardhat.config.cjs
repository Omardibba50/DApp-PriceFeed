// require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers');
require("dotenv").config();

// require("@nomicfoundation/hardhat-ethers");
// require("hardhat-deploy");
// require("hardhat-deploy-ethers");

const { QUICKNODE_API_KEY, METAMASK_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    fuji: {
      url: QUICKNODE_API_KEY,
      accounts: [METAMASK_PRIVATE_KEY],
      chainId: 43113,
    },
  },
};
