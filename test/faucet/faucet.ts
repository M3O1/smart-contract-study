import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumberish, Signer } from "ethers";

describe("faucet", () => {
  it("faucet의 fallback 함수를 호출하면 돈을 입금할 수 있다.", async () => {
    const [owner, address1] = await ethers.getSigners();
    const faucet = await initializeFaucet(owner);
    const faucet_account = await ethers.getSigner(faucet.address);

    const value = 100000;

    const before = await faucet_account.getBalance();
    await faucet.connect(address1).fallback({value});
    const after = await faucet_account.getBalance();

    expect(after.sub(before)).to.equal(value);
  });

  it("faucet의 withdraw 함수를 호출하면 돈을 뺄 수 있다.", async () => {
    const [owner] = await ethers.getSigners();
    const givenValue = 10000;
    const faucet = await initializeFaucet(owner);

    await faucet.connect(owner).fallback({value:100000});

    // 이전 잔액
    const before = await owner.getBalance();

    const result = await faucet.connect(owner).withdraw(givenValue);
    // receipt를 통해, 실제로 얼마나 GAS를 썼는지를 알 수 있음
    const receipt = await result.wait();

    // 이후 잔액
    const after = await owner.getBalance();

    // 총 Gas 사용량
    const totalGasPrice = receipt.gasUsed.mul(result.gasPrice!)

    expect(before.add(givenValue).sub(totalGasPrice)).to.eq(after);
  })
})

async function initializeFaucet(signer: Signer) {
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.connect(signer).deploy();
  await faucet.deployed();
  return faucet;
}