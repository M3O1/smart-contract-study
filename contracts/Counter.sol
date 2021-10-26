pragma solidity >=0.4 <0.9.0;

contract Counter {
    uint256 value;
    bool isInitialize;

    function initialize(uint256 _value) public {
        require(isInitialize == false, "Already Initialization");
        value = _value;
        isInitialize = true;
    }

    function get() view public returns (uint) {
        return value;
    }

    function increment(uint n) public {
        value += n;
    }

    function decrement(uint n) public {
        value -= n;
    }

}
