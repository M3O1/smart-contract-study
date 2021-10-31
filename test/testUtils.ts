import { ethers } from "hardhat";

export const toWei = (value: any) => ethers.utils.parseEther(value.toString());
export const getBalance = (address: string) => ethers.provider.getBalance(address);