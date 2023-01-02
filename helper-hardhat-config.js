const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0xc587d9053cd1118f25F645F9E08BB98c9712A4EE",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04",
        SUBSCRIPTIONid: "8174",
        callbackGasLimit: "500000",
        interval: "30"
    },
    31337: {
        name: "localhost",
        subscriptionId: "588",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}