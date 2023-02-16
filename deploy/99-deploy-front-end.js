const { ethers, deployments } = require("hardhat")
const fs = require("fs")

const NftMarketplaceAddress =
    "../nextjs-frontend-moralis/constants/NftMarketplaceAddress.json"
const BasicNftAddress =
    "../nextjs-frontend-moralis/constants/BasicNftAddress.json"
const frontEndAbiFileNftMarketplace =
    "../nextjs-frontend-moralis/constants/MarketplaceAbi.json"
const frontEndAbiFileBasicNft =
    "../nextjs-frontend-moralis/constants/BasicNftAbi.json"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("--------------------------------------")
        console.log("Deploying 99-deploy front-end...")
        console.log("Writing address to front end...")
        await updateContractAddress()
        console.log("Writing abi to front end...")
        await updateAbi()
        console.log("Done writing to front end...")
        console.log("--------------------------------------")
    }
}

async function updateAbi() {
    const NftMarketplace = await deployments.get("NftMarketplace")
    const nftMarketplace = await ethers.getContractAt(
        NftMarketplace.abi,
        NftMarketplace.address
    )
    fs.writeFileSync(
        frontEndAbiFileNftMarketplace,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const BasicNft = await deployments.get("BasicNft")
    const basicNft = await ethers.getContractAt(BasicNft.abi, BasicNft.address)
    fs.writeFileSync(
        frontEndAbiFileBasicNft,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddress() {
    const nftMarketplace = await deployments.get("NftMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddress = JSON.parse(
        fs.readFileSync(NftMarketplaceAddress, "utf8")
    )
    if (chainId in contractAddress) {
        if (!contractAddress[chainId].includes(nftMarketplace.address)) {
            contractAddress[chainId].push(nftMarketplace.address)
        }
    }
    {
        contractAddress[chainId] = [nftMarketplace.address]
    }
    fs.writeFileSync(NftMarketplaceAddress, JSON.stringify(contractAddress))

    //Update Basic Nft
    const basicNft = await deployments.get("BasicNft")
    const BasicNftContractAddress = JSON.parse(
        fs.readFileSync(BasicNftAddress, "utf8")
    )
    if (chainId in BasicNftContractAddress) {
        if (!BasicNftContractAddress[chainId].includes(basicNft.address)) {
            BasicNftContractAddress[chainId].push(basicNft.address)
        }
    }
    {
        BasicNftContractAddress[chainId] = [basicNft.address]
    }
    fs.writeFileSync(BasicNftAddress, JSON.stringify(BasicNftContractAddress))
}

module.exports.tags = ["all", "front-end"]
