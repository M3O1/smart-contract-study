import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { toWei } from "../testUtils";
import { BasicToken, Exchange } from "../../typechain";
import exp from "constants";

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
    await basicToken.approve(exchange.address, tokenAmount);
    await exchange.addLiquidity(tokenAmount, {value: etherAmount});

    expect(await exchange.getSwapAmount(BigNumber.from(100), etherAmount, tokenAmount)).to.equal(198);
  });

  it("10000개의 이더와 20000개의 토큰이 있을 때, 100개의 이더를 swap요청하면 198개를 받을 수 있다.", async () => {
    const etherAmount = 10000;
    const tokenAmount = 20000;
    const [_, address1] = await ethers.getSigners();

    await basicToken.approve(exchange.address, tokenAmount);
    await exchange.addLiquidity(tokenAmount, {value: etherAmount});

    // address1의 token 갯수는 0개이다.
    expect(await basicToken.balanceOf(address1.address)).to.be.equal(BigNumber.from(0));

    await exchange.connect(address1).ethToTokenSwap(195, {value: 100});

    // address1의 token 갯수는 198개이다.
    expect(await basicToken.balanceOf(address1.address)).to.be.equal(BigNumber.from(198));
  })

  it("10000개의 이더와 20000개의 토큰이 있을 때, 100개의 이더를 swap요청 시 슬리피지로 200을 걸면, 받지 않는다.", async () => {
    const etherAmount = 10000;
    const tokenAmount = 20000;
    const [_, address1] = await ethers.getSigners();

    await basicToken.approve(exchange.address, tokenAmount);
    await exchange.addLiquidity(tokenAmount, {value: etherAmount});

    // address1의 token 갯수는 0개이다.
    expect(await basicToken.balanceOf(address1.address)).to.be.equal(BigNumber.from(0));

    await expect(exchange.connect(address1).ethToTokenSwap(200, {value: 100})).to.be.revertedWith("insufficient output amount");
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
