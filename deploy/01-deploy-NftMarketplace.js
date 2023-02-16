const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config") //
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const args = []
    log("Deploying 01-NftMarketplace...")
    const NftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    })
    log("Successfully deployed 01-NftMarketplace")
    log(`Contract deployed at ${NftMarketplace.address}`)
    log("Verifying 01-Nft Marketplace...")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(NftMarketplace.address, args)
    }
}

module.exports.tags = ["all", "NftMarketplace"]
