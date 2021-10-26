const Counter = artifacts.require("Counter");

module.exports = async function (deployer, network, accounts) {
    /**
     * Migrations are JavaScript files that help you deploy contracts to the Ethereum network
     *
     * @param deployer object responsible for deploying contracts
     * @param network name (string) of the network being used during the migration
     * @param accounts array of the available (unlocked) accounts during the migration
     *
     * link : https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations
     */
    //

    // deployment steps
    await deployer.deploy(Counter);
};
