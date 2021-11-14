import { ethers } from "hardhat";
import { BigNumber } from "ethers";

export const toWei = (value: any) => ethers.utils.parseEther(value.toString());
export const getBalance = (address: string) => ethers.provider.getBalance(address);

export async function chargeEther(to: string, value: BigNumber) {
  const [owner] = await ethers.getSigners();
  await owner.sendTransaction({ to, value});
  return;
}