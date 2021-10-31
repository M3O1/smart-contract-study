import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { toWei } from "../testUtils";
import { BasicToken, Exchange } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";

describe("exchange", () => {
  let basicToken: BasicToken;
  let exchange: Exchange;

  async function chargeToken(address:string, amount:BigNumber) {
    await basicToken.transfer(address, amount);
  }

  beforeEach(async () => {
    basicToken = await deployBasicTokenContract(toWei(1000000));
    exchange = await deployExchangeContract(basicToken.address);
  })

  it("유동성 풀에 ether는 100만큼 넣고, token은 120만큼 넣는다", async () => {

    const etherAmount = toWei(100);
    const tokenAmount = toWei(120);
    const [_, address1] = await ethers.getSigners();

    // Given token
    await chargeToken(address1.address, tokenAmount);

    // When
    await basicToken.connect(address1).approve(exchange.address, tokenAmount);
    await exchange.connect(address1).addLiquidity(tokenAmount, { value: etherAmount });

    // Then
    expect(await exchange.getBalance()).to.equal(etherAmount);
    expect(await exchange.getReserve()).to.equal(tokenAmount);
    expect(await exchange.getK()).to.equal(etherAmount.mul(tokenAmount));
  });

  it("10000개의 이더와 20000개의 토큰이 있을 때, 100개의 이더에 대한 토큰 비율은 198이다.", async () => {
    const etherAmount = 10000;
    const tokenAmount = 20000;
    await  basicToken.approve(exchange.address, tokenAmount);
    await  exchange.addLiquidity(tokenAmount, {value: etherAmount});

    expect(await exchange.getSwapAmount(BigNumber.from(100), etherAmount, tokenAmount)).to.equal(198);
  })
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
