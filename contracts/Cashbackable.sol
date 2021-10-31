//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Cashbackable {
    mapping(address => uint8) private cashbackRate;

    event SetCashback(address indexed addr, uint8 rate);
    event Cashback(address indexed from, address indexed to, uint256 value);

    function setCashbackRate(uint8 _rate) external {
        require(_rate <= 100 && _rate > 0, "rate not allowed");

        cashbackRate[msg.sender] = _rate;
        emit SetCashback(msg.sender, _rate);
    }

    function getCashbackRate(address _address) external view returns (uint8) {
        return cashbackRate[_address];
    }

    function calculateCashback(address to, uint256 amount) public view returns (uint256) {
        uint256 rate = cashbackRate[to];
        return rate > 0 ? amount / 100 * uint256(rate) : 0;
    }
}
