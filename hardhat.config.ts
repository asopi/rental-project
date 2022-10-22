require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.9',
  networks: {
    goerli: {
      url: process.env.ALCHEMY_RPC_URL,
      accounts: [process.env.IMPLEMENTER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
    },
  },
};
