import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { toWei, getBalance } from "../testUtils";

describe("exchange", () => {
  it("유동성 풀에 공급하면, Fee는 Exchange에 들어가고, BasicToken은 유동성 풀에 들어간다", async () => {

    const fee = toWei(100);
    const tokenAmount = toWei(120);
    const [owner, address1] = await ethers.getSigners();

    const basicToken = await deployBasicTokenContract(toWei(10000));
    const exchange = await deployExchangeContract(basicToken.address);

    // Given token
    await basicToken.connect(owner).transfer(address1.address, tokenAmount);

    // When
    await basicToken.connect(address1).approve(exchange.address, tokenAmount);
    await exchange.connect(address1).addLiquidity(tokenAmount, { value: fee });

    // Then
    expect(await getBalance(exchange.address)).to.equal(fee);
    expect(await exchange.getReserve()).to.equal(tokenAmount);
  });
});

async function deployBasicTokenContract(x: BigNumber) {
  const BasicToken = await ethers.getContractFactory("BasicToken");
  const basicToken = await BasicToken.deploy("basic", "bt", x);
  await basicToken.deployed();
  return basicToken;
}

async function deployExchangeContract(address: string) {
  const ExchangeContract = await ethers.getContractFactory("Exchange");
  const exchange = await ExchangeContract.deploy(address);
  await exchange.deployed();
  return exchange;
}
