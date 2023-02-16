const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("In verication...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Done verication...")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
