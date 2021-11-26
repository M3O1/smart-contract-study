//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SimpleToken is ERC20 {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) public {
        _mint(msg.sender, 2**112);
    }

    //
    // @notice Faucet For Everyone. It's Test
    //
    function faucet(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}
