import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IERC20 } from './../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20';

describe('Rental', () => {
    let rental: any;
    let token: IERC20;
    let nft: any;
    let deployer: SignerWithAddress;
    let implementer: SignerWithAddress;
    let lender: SignerWithAddress;
    let renter: SignerWithAddress;
    let nftId = 1;


    beforeEach(async () => {
        // Setup Accounts
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        implementer = accounts[1];
        lender = accounts[2];
        renter = accounts[3];

        // Setup Token
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();

        token.transfer(implementer.address, 500000000);
        token.transfer(lender.address, 500000000);
        token.transfer(renter.address, 500000000);

        // await myToken.connect(renter).allowance(renter.address, rental.address);
        // Load contracts
        const NFT = await ethers.getContractFactory('NFT');
        const Rental = await ethers.getContractFactory('Rental');

        // Deploy contracts
        nft = await NFT.deploy();
        rental = await Rental.deploy(
            implementer.address,
            token.address
        );
        await rental.deployed();

        // Allow rental contract to move myTokens, only for testing
        await token.connect(renter).approve(rental.address, 500000000);

        // Deployer sends NFT to Lender
        await nft.transferFrom(deployer.address, lender.address, nftId);

        // Lender Approves NFT
        await nft.connect(lender).approve(rental.address, nftId);

        // Initial lend and rent
        await rental.connect(lender).lend(
            nft.address,
            nftId,
            12,
            10
        );

        await rental.connect(renter).rent(
            nft.address,
            nftId,
            12,
            10
        );
    });

    describe('Deployer', () => {
        it('should set implementer', async () => {
            expect(await rental.implementer()).to.equal(implementer.address);
        });
    });

    describe('Renter', () => {
        it('should execute rent transaction', async () => {
            await nft.connect(lender).mint("https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1");
            const nextNftId = nftId + 1;
            await nft.connect(lender).approve(rental.address, nextNftId);
            await rental.connect(renter).rent(
                nft.address,
                nextNftId,
                12,
                10
            );
            const order = await rental.getOrder(
                nft.address,
                nextNftId
            );
            expect(order._renter).to.equal(renter.address);
        });
    });

    describe('Lender', () => {
        it('should execute lend transaction', async () => {
            await nft.connect(lender).mint("https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1");
            const nextNftId = nftId + 1;
            await nft.connect(lender).approve(rental.address, nextNftId);
            await rental.connect(lender).lend(
                nft.address,
                nextNftId,
                12,
                10
            );
            const order = await rental.getOrder(
                nft.address,
                nextNftId
            );
            expect(order._lender).to.equal(lender.address);
        });
    });
});