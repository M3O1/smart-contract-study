//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// BlackList Management Contract
contract Blacklistable is Ownable {
    mapping(address => int8) private blacklist;

    event Blacklisted(address indexed target);
    event DeleteFromBlacklist(address indexed target);

    // validation logic
    modifier verifyBlacklist(address _address) {
        require(!check(msg.sender), "Sender is Blacklisted");
        require(!check(_address), "_address is Blacklisted");
        _;
    }

    // Register the address in the blacklist
    function blacklisting(address _address) public onlyOwner {
        blacklist[_address] = 1;
        emit Blacklisted(_address);
    }

    // Unregister the address in the blacklist
    function deleteFromBlacklist(address _address) public onlyOwner {
        blacklist[_address] = - 1;
        emit DeleteFromBlacklist(_address);
    }

    // Check if the address is blacklisted
    function check(address _address) public view returns (bool) {
        return blacklist[_address] > 0;
    }
}
