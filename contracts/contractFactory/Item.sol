//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Factory에서 생성하는 아이템 컨트랙트
contract Item {
    address private owner;
    string public name;

    constructor() {
        owner = msg.sender;
    }

    // Explicit data location for all variables of struct,
    // array or mapping types is now mandatory.
    // This is also applied to function parameters and return variables.
    // For example, change uint[] x = m_x to uint[] storage x = m_x,
    // and function f(uint[][] x) to function f(uint[][] memory x)
    // where memory is the data location and might be replaced by storage or calldata accordingly.
    // Note that external functions require parameters with a data location of calldata.


    // CALL DATA VS MEMORY
    // One good way to think about the difference and how they should be used
    // is that calldata is allocated by the caller, while memory is allocated by the callee.
    // reference : https://ethereum.stackexchange.com/questions/74442/when-should-i-use-calldata-and-when-should-i-use-memory
    function initialize(string memory name_) external {
        require(owner == msg.sender, "No Permission");
        name = name_;
    }
}
