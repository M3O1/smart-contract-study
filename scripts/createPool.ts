import * as hre from "hardhat";
import "@nomiclabs/hardhat-ethers/internal/type-extensions";
import "hardhat-deploy/dist/src/type-extensions";
import { ethers } from "hardhat";

// Kovan Network 위에 올려져있는 Address Book
const AddressBook = {
  sushiswapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  sushiswapFactory: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  uniswapRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  uniswapFactory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  woocoin: "0x12a00625454d4e1f5398f1f2c313dcddfd40f2dc",
  heocoin: "0xD05B8D5D55670452027fa0D5E7E6f118b80b5516"
}


async function main() {
  const accounts = await hre.ethers.getSigners();

  const Factory = await ethers.getContractFactory("UniswapV2Factory", accounts[0]);

  // [1] factory contract에 접속
  const uniswapFactory = await Factory.attach(AddressBook.uniswapFactory);
  const sushiswapFactory = await Factory.attach(AddressBook.sushiswapFactory);

  // [2] 유니스왑과 스시스왑에 풀을 생성
  const uniswapTransaction = await uniswapFactory.createPair(AddressBook.woocoin, AddressBook.heocoin);
  const sushiswapTransaction = await sushiswapFactory.createPair(AddressBook.woocoin, AddressBook.heocoin);

  // [3] 풀 생성 트랜잭션이 완료될 때까지 기다리기
  await uniswapTransaction.wait();
  await sushiswapTransaction.wait();

  // [4] LP 주소를 조회
  const uniswapPoolAddress = await uniswapFactory.getPair(AddressBook.woocoin, AddressBook.heocoin);
  const sushiswapPoolAddress = await sushiswapFactory.getPair(AddressBook.woocoin, AddressBook.heocoin);

  console.log("uniswap Pool Address : ", uniswapPoolAddress);
  console.log("sushiswap Pool Address : ", sushiswapPoolAddress);
}

main()
  .then(() => process.exit())
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  })

