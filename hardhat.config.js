require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli.g.alchemy.com/v2/BIUhUGSSQYE6n4Tlm3e5n7U6rJG5RuA_"
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      chainId: 5,
      blockConfirmations: 1,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      chainId: 31337,
      blockConfirmtions: 1,
    },
  },

  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },

  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
        default: 0,
    },
    player: {
      default: 1,
    },
  },

  mocha : {
    timeout: 200000,
  }
}
