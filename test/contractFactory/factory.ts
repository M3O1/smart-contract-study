import { ethers } from "hardhat";
import { expect } from "chai";
import { Factory } from "../../typechain";

describe("Factory", () => {
  it("Factory에서 이름이 m3o1인 Item을 생성한다.", async () => {
    const givenName = "m3o1";

    const factory = await initializeFactory();
    const transaction = await factory.createToken(givenName);
    const receipt = await transaction.wait();
    const address = receipt.events
      ?.filter(x => x.event == "ContractCreated")
      .map(x => x.args == null ? "" : x.args[0]).at(0);

    const contract = await ethers.getContractAt("Item", address);
    expect(await contract.name()).to.equal(givenName);
  });
});

async function initializeFactory() {
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  await factory.deployed();
  return factory;
}