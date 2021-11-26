// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction } from "hardhat-deploy/types";
import {SimpleToken} from "../typechain";
import "hardhat-deploy/dist/src/type-extensions";
import "@nomiclabs/hardhat-ethers/internal/type-extensions";
import { verify } from "crypto";

const AddressBook = {
  uniswapRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  sushiswapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"

}

const func: DeployFunction = async (hre:HardhatRuntimeEnvironment) => {
  const {admin} = await hre.getNamedAccounts();
  const {deploy} = hre.deployments;

  const deployment = await deploy("FlashCallback", {
    from: admin,
    args: [AddressBook.uniswapRouter, AddressBook.sushiswapRouter],
    log: true
  });

  console.log("Deployment Success. ");
  console.log("  * Address : ", deployment.address);
  console.log("  * transactionHash : ", deployment.transactionHash);

  // Verify Process
  await hre.run("verify:verify", {
    address: deployment.address,
    constructorArguments: [AddressBook.uniswapRouter, AddressBook.sushiswapRouter],
    contract: "contracts/flashswap/FlashCallback.sol:FlashCallback"
  })
}

func.tags = ['FLASHCALLBACK_DEPLOY'];
export default func;
