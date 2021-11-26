import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-ethers/internal/type-extensions";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";


/* This Loads the variables in your .env file to 'process.env' */
dotenv.config();

// 환경 정보 가져오기
const { ETHERSCAN_API_KEY, DEPLOYER_PRIVATE_KEY, INFURA_PROJECT_ID } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.4",

  defaultNetwork: "kovan",

  // @ts-ignore
  namedAccounts: {
    admin: 0,
  },

  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 1,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 42,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`]
    }
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
