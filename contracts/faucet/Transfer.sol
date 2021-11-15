//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Transfer {
    function execute(address to) public payable {
        payable(to).transfer(msg.value);
    }
}
