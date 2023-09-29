# Rental Project

This project contains the solution for my master thesis _(Renting NFTs with a pay-per-like pricing model)_.
It provides a decentralized application (dapp) consisting of Solidity smart contracts and an Angular frontend for a new NFT rental system based on a novel pay-per-like pricing model.

# Paper: 
Implementing Smart Contracts: The case of NFT-rental with pay-per-like, Alfred Sopi, Johannes Schneider, Jan vom Brocke, 18th International Conference on Business Informatics (Wirtschaftsinformatik), 2023

Paper Arxiv: https://arxiv.org/abs/2308.02424)

## Repository

This repository contains smart contracts, deployment scripts, unit tests, and an Angular frontend stored in these folders:

- contracts: Contains all smart contracts implemented with Solidity sources.
- scripts: Contains the deployment script to deploy the smart contracts on the Ethereum Goerli testnet. It also contains a script to mint new NFTs.
- src: Contains the Angular frontend, consisting of the Rental Project and the Showcase application.
- test: Contains all unit tests implemented for the smart contracts.

## Prerequisits

The following tools are required to run the solution:

- [Git](https://git-scm.com/): Install git to clone the project and use `git bash` to execute commands.
- [Node.js](https://nodejs.org/en/): Install Node.js on your local machine and ensure that `npm` is set as an environment variable.
- [MetaMask](https://metamask.io/): Install the MetaMask Chrome extention to import and connect your accounts.
  Follow the steps in the Appendix to import your accounts and connect your wallet with the Goerli testnet.

## Installation

Run the following commands to clone the project and install all required dependencies.

```bash
  git clone https://github.com/asopi/rental-project.git
  cd rental-project
  npm install
```

#### Configurations

- Create a `.env` file in the root directory and add all the required keys to your accounts, following the example `.env.example`.
- Add the required configurations also under `src/environments/environment.ts`.

**NOTE: The master thesis submission includes the `.env` and `.environment.ts` files used for this project.**

## Usage

To start the application, go to the root directory and run the following command:

```bash
  npm start
```

The application will be available via `http://localhost:4200`.

## Deployment

This command deploys the implemented smart contracts on the Ethereum Goerli testnet.

```shell
npm run deploy-contract
```

After successful deployment, a file called`.env.new` will be generated, including the new smart contract accounts.
These accounts can be adopted in the `environment.ts` and `.env` files.

## Mint NFTs

This command creates 10 predefined NFTs for the configured lender and renter account.

```shell
npm run mint
```

## Running Tests and Gas Fee Analysis

This commands runs all the unit tests implemented for the smart contracts. In addition, it also performs a gas fee analysis and appends the results to the unit test output.

```shell
// with gas fee analysis
npm run test-contract

// with code coverage
npm run test-coverage
```

## Feedback

If you have any feedback or questions, please contact me at alfred.sopi@hotmail.com.

## Appendix

### MetaMask: Import Accounts

Use the following instructions to import your accounts to MetaMask.
**NOTE: The Master Thesis submission includes Accounts that can be imported this way.**

1. Click on the MetaMask chrome extension and log in to your wallet
2. Click on your profile picture
3. Select `Import account`
4. Type in the private key of the Account you want to import
5. Click Import

### MetaMask: Goerli Testnet Setup

Use the following instructions to set up your MetaMask wallet with the Goerli testnet.

1. Click on the MetaMask chrome extension and log in to your wallet
2. Click on the Network dropdown located in the header
3. Select `Add network`
4. Select `Advanced` and activate the option `Show test networks`
5. Click on the Network dropdown located in the header and select `Goerli test network`

Optional: MetaMask uses `Infura` as RPC provider and gateway to the blockchain. Following these steps, you can also use another provider, such as Alchemy.

6. Follow steps 1-3
7. Select `Add network manually` and add a provider of your choice.
8. Fill the form with these values
   - Name: Goerli Test Network (Alchemy)
   - New RPC URL: https://eth-goerli.alchemyapi.io/v2/your_API_key>; see [Guide](https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask/) or use the RPC-URL provided in the `.env` file
   - Chain ID: 5
   - Currency Symbol: ETH
   - Block explorer URL: https://goerli.etherscan.io/
