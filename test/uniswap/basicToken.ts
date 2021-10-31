import { ethers } from "hardhat";
import { expect } from "chai";

describe("basicToken", () => {
  it("생성시 발행량은 발행자에게 넘어간다", async () => {
    const givenTotalSupply = 100;
    const [owner] = await ethers.getSigners();
    const basicToken = await deployBasicTokenContract(givenTotalSupply);
    expect(await basicToken.balanceOf(owner.address)).to.equal(
      givenTotalSupply
    );
  });
});

async function deployBasicTokenContract(x: number) {
  const BasicToken = await ethers.getContractFactory("BasicToken");
  const basicToken = await BasicToken.deploy("basic", "bt", x);
  await basicToken.deployed();
  return basicToken;
}
