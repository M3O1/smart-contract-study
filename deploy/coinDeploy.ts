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

const func: DeployFunction = async (hre:HardhatRuntimeEnvironment) => {
  await deploySimpleCoin(hre, "WOOCOIN", "WC");
  await deploySimpleCoin(hre, "HEOCOIN", "HC");
}

async function deploySimpleCoin(hre: HardhatRuntimeEnvironment, name: string, symbol: string) {
  const {admin} = await hre.getNamedAccounts();
  const {deploy} = hre.deployments;

  const deployment = await deploy("SimpleToken", {
    from: admin,
    args: [name, symbol],
    log: true
  });

  const simpleToken = await hre.ethers.getContractAt(
    deployment.abi,
    deployment.address
  ) as SimpleToken;

  console.log("Deployment Success. name : ", await simpleToken.name());
}

export default func;
func.tags = ['COIN_DEPLOY'];