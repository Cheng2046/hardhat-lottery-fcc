const { networkConfig, developmentChains } = require("../helper-hardhat-config");


const BASE_FEE = ethers.utils.parseEther("0.25"); 
const GAS_PRICE_LINK = 1e9; 

// calculated value based on the gas price of the chain 
// 0.25 is cost for making request to LINK
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer, 
            log: true, 
            args: args
        })
        log("Mocks Deployed!!")
        log("----------------------------------------------")

        // deploy a mock 
    }
};

module.exports.tags = ["all", "mocks"];



// constructor(uint96 _baseFee, uint96 _gasPriceLink) {
//     BASE_FEE = _baseFee;
//     GAS_PRICE_LINK = _gasPriceLink;
//   }