//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Item.sol";

contract Factory {

    event ContractCreated(address newAddress);

    function createToken(string memory name) external returns (address) {
        // 토큰을 생성
        Item item = new Item();
        emit ContractCreated(address(item));

        // 토큰을 초기화
        item.initialize(name);

        // 주소를 반환
        return address(item);
    }
}
