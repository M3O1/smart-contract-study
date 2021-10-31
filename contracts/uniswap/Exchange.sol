//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {
    address private tokenAddress;

    constructor(address _token) verify(_token) {
        tokenAddress = _token;
    }

    modifier verify(address addr){
        require(addr != address(0), "invalid token address");
        _;
    }

    function addLiquidity(uint256 _tokenAmount) public payable {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _tokenAmount);
    }

    function getTokenAddress() external view returns (address) {
        return tokenAddress;
    }

    function getReserve() external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}
