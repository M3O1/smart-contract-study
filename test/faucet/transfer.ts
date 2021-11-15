import { ethers } from "hardhat";
import { expect } from "chai";

describe("transfer", () => {
  it("Transfer 함수를 통해 10만 wei를 보낼 수 있다.", async () => {
    const transfer = await initializeTransfer();
    const [_, address1, address2] = await ethers.getSigners();
    const value = 100000;

    const before = await address2.getBalance();
    await transfer.connect(address1).execute(address2.address,{value});
    const after = await address2.getBalance();

    expect(after.sub(before)).to.eq(value)
  });
})

async function initializeTransfer() {
  const Transfer = await ethers.getContractFactory("Transfer");
  const transfer = await Transfer.deploy();
  await transfer.deployed();
  return transfer;
}