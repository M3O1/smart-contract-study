import { ethers } from "hardhat";
import { expect } from "chai";

describe("blacklistable", () => {
  it("소유주가 블랙리스트에 추가할수 있다..", async function() {
    const [_, address1] = await ethers.getSigners();
    const blacklist = await initializeBlacklist();

    // 블랙리스트 추가전에는 false여야 한다.
    expect(await blacklist.check(address1.address)).to.equal(false);

    await blacklist.blacklisting(address1.address);

    // 블랙리스트 추가 후에는 True여야 한다.
    expect(await blacklist.check(address1.address)).to.equal(true);
  });

  it("소유주가 아닌 유저가 블랙리스트에 추가를 시도하면, 실패해야 한다.", async function() {
    const [_, address1, address2] = await ethers.getSigners();
    const blacklist = await initializeBlacklist();

    // 블랙리스트 추가전에는 false여야 한다.
    await expect(blacklist.connect(address1).blacklisting(address2.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("소유주가 블랙리스트에서 제거할 수 있다", async function() {
    const [_, address1] = await ethers.getSigners();
    const blacklist = await initializeBlacklist();

    await blacklist.blacklisting(address1.address);
    await blacklist.deleteFromBlacklist(address1.address);

    expect(await blacklist.check(address1.address)).to.be.equal(false);
  });
});

async function initializeBlacklist() {
  const BlackListable = await ethers.getContractFactory("Blacklistable");
  const blacklist = await BlackListable.deploy();
  await blacklist.deployed();
  return blacklist;
}