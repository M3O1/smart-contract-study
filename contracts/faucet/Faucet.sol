//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable{

    // 요청하는 사람에게 이더 주기
    function withdraw(uint256 amount) onlyOwner public {
        require(amount <= 100_000_000);

        // Why wrap msg.sender by payable keyword?
        // TypeError: "send" and "transfer" are only available for objects of type "address payable", not "address".
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {
        // console.log("receive is called");
        // receive vs fallback
        // reference : https://blog.soliditylang.org/2020/03/26/fallback-receive-split/
        // React to Receiving Ether
    }
}
