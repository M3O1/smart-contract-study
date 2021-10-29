import { expect } from "chai";
import { ethers } from "hardhat";

describe("token Contract", () => {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    const [owner] = await ethers.getSigners();
    const m3o1Token = await initializeToken();

    const ownerBalance = await m3o1Token.balanceOf(owner.address);
    expect(await m3o1Token.totalSupply()).to.equal(ownerBalance);
  });

  it("Deployment Address should assign the owner of Token", async function() {
    const [owner] = await ethers.getSigners();
    const m3o1Token = await initializeToken();

    expect(await m3o1Token.owner()).to.equal(owner.address);
  });

  it("Should transfer tokens between account", async function() {
    const [_, address1, address2] = await ethers.getSigners();
    const m3o1Token = await initializeToken();

    // Transfer 50 Tokens from owner to addr1
    await m3o1Token.transfer(address1.address, 50);
    expect(await m3o1Token.balanceOf(address1.address)).to.equal(50);

    // Transfer 30 tokens from addr1 to addr2
    await m3o1Token.connect(address1).transfer(address2.address, 30);
    expect(await m3o1Token.balanceOf(address1.address)).to.equal(20);
    expect(await m3o1Token.balanceOf(address2.address)).to.equal(30);
  });

  it("Should fail if sender doesn't have enough tokens", async function() {
    const [_, address1, address2] = await ethers.getSigners();
    const m3o1Token = await initializeToken();

    // Transfer 50 Tokens from address1 to address2
    await expect(m3o1Token.connect(address1)
      .transfer(address2.address, 50))
      .to.be.revertedWith("Not Enough Tokens");

  });
});

async function initializeToken() {
  const Token = await ethers.getContractFactory("Token");
  const m3o1Token = await Token.deploy(10000);
  await m3o1Token.deployed();
  return m3o1Token;
}