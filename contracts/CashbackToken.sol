//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Cashbackable.sol";

contract CashbackToken is Token, Cashbackable {
    constructor(uint256 _totalSupply) Token(_totalSupply) {
    }

    function transfer(address to, uint256 amount) external override {
        uint256 cashback = super.calculateCashback(to, amount);
        require(super._balanceOf(msg.sender) >= amount - cashback, "no balance");

        super._transfer(to, amount - cashback);
        emit Cashback(msg.sender, to, cashback);
    }
}
