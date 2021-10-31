//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Exchange {
    address private tokenAddress;

    constructor(address _token) verify(_token) {
        tokenAddress = _token;
    }

    modifier verify(address addr){
        require(addr != address(0), "invalid token address");
        _;
    }

    function ethToTokenSwap(uint256 _minTokens) public payable {
        uint256 tokensBought = getSwapAmount(
            msg.value,
            _getBalance() - msg.value,
            _getReserve()
        );
        console.log(tokensBought, _minTokens);
        require(tokensBought >= _minTokens, "insufficient output amount");

        IERC20(tokenAddress).transfer(msg.sender, tokensBought);
    }

    function addLiquidity(uint256 _tokenAmount) public payable {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _tokenAmount);
    }

    function getTokenAddress() external view returns (address) {
        return tokenAddress;
    }

    // 유동성 비율 계산
    function getSwapAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        return (outputReserve * inputAmount) / (inputReserve + inputAmount);
    }

    // 현재 유동성 풀 내 토큰 보유량
    function getReserve() external view returns (uint256) {
        return _getReserve();
    }

    // 현재 유동성 풀 내 이더 보유량
    function getBalance() external view returns (uint256) {
        return _getBalance();
    }

    // 현재 유동성 상수
    function getK() external view returns (uint256) {
        return invariant();
    }

    function invariant() internal view returns (uint256) {
        return _getReserve() * _getBalance();
    }

    function _getReserve() internal view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function _getBalance() internal view returns (uint256) {
        return address(this).balance;
    }
}
