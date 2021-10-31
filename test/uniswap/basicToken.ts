import { ethers } from "hardhat";
import { expect } from "chai";
import {toWei} from "../testUtils";
import { BigNumber } from "ethers";

describe("basicToken", () => {
  it("생성시 발행량은 발행자에게 넘어간다", async () => {
    const givenTotalSupply = toWei(100);
    const [owner] = await ethers.getSigners();
    const basicToken = await deployBasicTokenContract(givenTotalSupply);
    expect(await basicToken.balanceOf(owner.address)).to.equal(
      givenTotalSupply
    );
  });

  it("Approve 없이 TransferFrom이 불가능하다", async () => {
    const givenTotalSupply = toWei(1000);
    const [_, address1, address2] = await ethers.getSigners();
    const basicToken = await deployBasicTokenContract(givenTotalSupply);

    await basicToken.transfer(address1.address, toWei(100));
    await basicToken.transfer(address2.address, toWei(100));

    await expect(basicToken.transferFrom(address1.address, address2.address,  toWei(100)))
      .to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });

  it("Approve 후 TransferFrom은 성공한다", async () => {
    const givenTotalSupply = toWei(1000);
    const [_, address1, address2] = await ethers.getSigners();
    const basicToken = await deployBasicTokenContract(givenTotalSupply);

    await basicToken.transfer(address1.address, toWei(100));
    await basicToken.transfer(address2.address, toWei(100));
    await basicToken.connect(address1).approve(address2.address, toWei(100));

    await expect(basicToken.transferFrom(address1.address, address2.address,  toWei(100)))
      .to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });
});

async function deployBasicTokenContract(x: BigNumber) {
  const BasicToken = await ethers.getContractFactory("BasicToken");
  const basicToken = await BasicToken.deploy("basic", "bt", x);
  await basicToken.deployed();
  return basicToken;
}
