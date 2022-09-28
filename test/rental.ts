import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IERC20 } from './../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20';
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe('Rental', () => {
    let rental: any;
    let token: IERC20;
    let nft: any;
    let deployer: SignerWithAddress;
    let implementer: SignerWithAddress;
    let lender: SignerWithAddress;
    let renter: SignerWithAddress;
    let nftId = 1;
    const DAY_IN_SECONDS = 86400;


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

        it('should set Rental Smart Contract to be NFT owner', async () => {
            expect(await nft.ownerOf(nftId)).to.equal(rental.address);
        });
    });

    describe('Implementer', () => {
        it('should execute increaseCount', async () => {
            await rental.connect(implementer).increaseCount(
                nft.address,
                nftId
            );
            const rentOrderIncreased = await rental.getOrder(
                nft.address,
                nftId
            );
            expect(rentOrderIncreased._count).to.equal(1);
        });

        it('should execute increaseCount transaction until maxcount is reached', async () => {
            for (let i = 0; i <= 10; i++) {
                await rental.connect(implementer).increaseCount(
                    nft.address,
                    nftId
                );
            }
            await expect(rental.connect(implementer).increaseCount(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "max count is reached"
            );
        });

        it('should not execute increaseCount when order is expired', async () => {
            let order = await rental.getOrder(
                nft.address,
                nftId
            );
            await time.increaseTo(order._rentedAt + Number(order._duration) * DAY_IN_SECONDS + 1);
            await expect(rental.connect(implementer).increaseCount(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "rent duration exceeded"
            );
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

        it('should not execute rent transaction when nft is already rented', async () => {
            await expect(rental.connect(renter).rent(
                nft.address,
                nftId,
                12,
                10
            )).to.be.revertedWith(
                "order already rented"
            );
        });

        it('should not execute increaseCount', async () => {
            await expect(rental.connect(renter).increaseCount(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "only implementer can call this method"
            );
        });

        it('should execute stop rent transaction', async () => {
            await rental.connect(renter).stopRent(
                nft.address,
                nftId
            );
            const order = await rental.getOrder(
                nft.address,
                nftId
            );
            expect(order._duration).to.equal(0);
        });

        it('should not execute stop lend transaction', async () => {
            await expect(rental.connect(renter).stopLend(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "only lender can stop this order"
            );
        });

        it('should not execute stop rent transaction when order is already stopped or expired', async () => {
            await rental.connect(renter).stopRent(
                nft.address,
                nftId
            );
            await expect(rental.connect(renter).stopRent(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "order already stopped"
            );
        });

        it('should claim refund when order is stopped', async () => {
            for (let i = 0; i <= 6; i++) {
                await rental.connect(implementer).increaseCount(
                    nft.address,
                    nftId
                );
            }
            await rental.connect(renter).stopRent(
                nft.address,
                nftId
            );

            await rental.connect(renter).claimRefund(nft.address, nftId);
            // TODO: expect balance check
        });

        it('should claim refund when order is expired', async () => {
            let order = await rental.getOrder(
                nft.address,
                nftId
            );
            await time.increaseTo(order._rentedAt + Number(order._duration) * DAY_IN_SECONDS + 1);
            await rental.connect(renter).claimRefund(nft.address, nftId);
            // TODO: expect balance check
        });

        it('should not claim refund when order is not expired', async () => {
            await expect(rental.connect(renter).claimRefund(nft.address, nftId)).to.be.revertedWith(
                "rent duration not exceeded"
            );
        });

        it('should not claim refund when calles is not renter', async () => {
            await expect(rental.connect(lender).claimRefund(nft.address, nftId)).to.be.revertedWith(
                "only renter can claim refunds from this order"
            );
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

        it('should not execute lend transaction when nft is already lended', async () => {
            await expect(rental.connect(lender).lend(
                nft.address,
                nftId,
                12,
                10
            )).to.be.revertedWith(
                "ERC721: transfer from incorrect owner"
            );
        });

        it('should not execute increaseCount', async () => {
            await expect(rental.connect(lender).increaseCount(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "only implementer can call this method"
            );
        });

        it('should execute stop lend transaction', async () => {
            await nft.connect(lender).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
            const nextNftId = nftId + 1;
            await nft.connect(lender).approve(rental.address, nextNftId);
            await rental.connect(lender).lend(
                nft.address,
                nextNftId,
                12,
                10
            );
            await rental.connect(lender).stopLend(
                nft.address,
                nextNftId
            );
            const orderAfter = await rental.getOrder(
                nft.address,
                nextNftId
            );
            expect(orderAfter._lender).to.equal(ethers.constants.AddressZero);
        });

        it('should not execute stop rent', async () => {
            await expect(rental.connect(lender).stopRent(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "only renter can stop this order"
            );
        });

        it('should not execute stop lend transaction when order is already rented', async () => {
            await expect(rental.connect(lender).stopLend(
                nft.address,
                nftId
            )).to.be.revertedWith(
                "order already rented"
            );
        });

        it('should claim fund and nft when order is stopped', async () => {
            for (let i = 0; i <= 6; i++) {
                await rental.connect(implementer).increaseCount(
                    nft.address,
                    nftId
                );
            }
            await rental.connect(renter).stopRent(
                nft.address,
                nftId
            );
            await rental.connect(lender).claimFund(nft.address, nftId);

            // TODO: expect balance check
            expect(await nft.ownerOf(nftId)).to.equal(lender.address);
        });

        it('should claim fund and nft when order is expired', async () => {
            let order = await rental.getOrder(
                nft.address,
                nftId
            );
            await time.increaseTo(order._rentedAt + Number(order._duration) * DAY_IN_SECONDS + 1);
            await rental.connect(lender).claimFund(nft.address, nftId);
            // TODO: check balance
        });

        it('should not claim fund and nft when order is not stopped or expired', async () => {
            await expect(rental.connect(lender).claimFund(nft.address, nftId)).to.be.revertedWith(
                "rent duration not exceeded"
            );
        });

        it('should not claim fund and nft when caller is not lender', async () => {
            await expect(rental.connect(renter).claimFund(nft.address, nftId)).to.be.revertedWith(
                "only lender can claim the funds and nft from this order"
            );
        });
    });
});