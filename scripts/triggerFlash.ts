import * as hre from "hardhat";
import "@nomiclabs/hardhat-ethers/internal/type-extensions";
import "hardhat-deploy/dist/src/type-extensions";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { toUtf8Bytes } from "ethers/lib/utils";

// Kovan Network 위에 올려져있는 Address Book
const AddressBook = {
  woocoin: "0x12a00625454d4e1f5398f1f2c313dcddfd40f2dc",
  heocoin: "0xD05B8D5D55670452027fa0D5E7E6f118b80b5516",
  sushiswapPool : "0xA16c28B25942E64eb42605FAc43977eF9B82F241",
  uniswapPool : "0x14C7BD5EA20F2BCD271b4A4C8449ce4d277267d9",
  flashswap: "0x2309881384a5Ed88173E7cfC5ae3c3d992D074FC"
}


async function main() {
  const accounts = await hre.ethers.getSigners();

  const Pool = await ethers.getContractFactory("UniswapV2Pair", accounts[0]);
  const Flash = await ethers.getContractFactory("FlashCallback", accounts[0]);

  // [1] Pool contract에 접속
  const swapPool = await Pool.attach(AddressBook.sushiswapPool);
  const flash = await Flash.attach(AddressBook.flashswap);

  // [2] 연결 확인
  console.log("Factory Address : ", await swapPool.factory());
  console.log("Token0 Address : ", await swapPool.token0());
  console.log("Token1 Address : ", await swapPool.token1());
  console.log("Sushi Factory Address : ", await flash.sushiFactory());
  console.log("uni Factory Address : ", await flash.uniFactory());




  // [3] 스왑 요청
  const trigger = await swapPool.swap(0, 1000, AddressBook.flashswap, [1]);
  const result = await trigger.wait();

  console.log(result);
}


main()
  .then(() => process.exit())
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  })