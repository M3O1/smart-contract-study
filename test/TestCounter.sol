pragma solidity >=0.4 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Counter.sol";

// Counter에 대한 Instance가 공유되기 때문에, 독립적인 테스트가 어려운 환경.
//
//
contract TestCounter {

    function testInitializeCounter() public {
        Counter sut = Counter(DeployedAddresses.Counter());
        sut.initialize(10);

        Assert.equal(sut.get(), 10, "");
    }

    function testIncrementCounter() public {
        Counter sut = Counter(DeployedAddresses.Counter());
        sut.increment(10);

        Assert.equal(sut.get(), 20, "");
    }

    function testDecrementCounter() public {
        Counter sut = Counter(DeployedAddresses.Counter());
        sut.decrement(5);

        Assert.equal(sut.get(), 15, "");
    }
}
