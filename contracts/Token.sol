//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// Simple Smart Contract That Implements a Token that can be transferred
contract Token is Ownable {
    string public name = "M301";
    string public symbol = "MT";

    // Fixed Amount of token stored in an unsigned integer type.
    uint256 public totalSupply;

    // Key-Value Store For each account balance
    mapping(address => uint256) balances;

    constructor(uint256 _totalSupply) {
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not Enough Tokens");

        // transfer the amount
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256){
        return balances[account];
    }
}
