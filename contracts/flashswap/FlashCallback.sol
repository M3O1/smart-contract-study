//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./UniswapV2Library.sol";
import "../uniswapv2/interfaces/IUniswapV2Callee.sol";
import "../uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "../uniswapv2/interfaces/IERC20.sol";

contract FlashCallback is IUniswapV2Callee{
    address public immutable uniFactory;
    address public immutable sushiFactory;

    uint constant deadline = 1 hours;

    address public immutable uniRouter;
    address public immutable sushiRouter;

    constructor(address uniRouterAddress, address sushiRouterAddress) public {
        // 주소 가져오기
        uniRouter = uniRouterAddress;
        sushiRouter = sushiRouterAddress;

        // Factory 주소 가져오기
        uniFactory = IUniswapV2Router02(uniRouterAddress).factory();
        sushiFactory = IUniswapV2Router02(sushiRouterAddress).factory();
    }

    // 콜백 호출만 허용하도록 구성
    modifier onlyAllowCallback() {
        address factory = IUniswapV2Pair(msg.sender).factory();
        require((factory == uniFactory) || (factory == sushiFactory), "ABANDONED");
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        require(msg.sender == UniswapV2Library.pairFor(factory, token0, token1), "ABANDONED");
        _;
    }

    // UniswapV2Call의 호출
    function uniswapV2Call(
        address sender_,
        uint amount0_,
        uint amount1_,
        bytes calldata data_
    ) override external onlyAllowCallback() {
        address[] memory path;
        IERC20 token;
        uint amountToken;
        {
            // true이면, token1을 lending 받은 콜백 요청
            // false이면, token0을 lending 받은 콜백 요청
            bool lendToken1 = isLendingToken1(amount1_);
            address token0 = IUniswapV2Pair(msg.sender).token0();
            address token1 = IUniswapV2Pair(msg.sender).token1();

            path = new address[](2);
            path[0] = lendToken1 ? token1 : token0;
            path[1] = lendToken1 ? token0 : token1;

            token = IERC20(lendToken1 ? token1 : token0);
            amountToken = lendToken1 ? amount1_ : amount0_;
            token.approve(sushiRouter, amountToken);
        }

        // Uniswap에 갚아야 하는 금액
        uint amountRequired = UniswapV2Library.getAmountsIn(uniFactory, amountToken, path)[0];
        // sushiswap으로부터 받는 금액
        uint amountReceived = IUniswapV2Router02(sushiRouter).swapExactTokensForTokens(amountToken, amountRequired, path, msg.sender, block.timestamp + deadline)[1];

        // Profit Earned
        token.transfer(sender_, amountReceived - amountRequired);
    }

    function isLendingToken1(uint amount1) private returns (bool) {
        return amount1 != 0;
    }
}
