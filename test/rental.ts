import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IERC20 } from './../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20';
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe('Rental', () => {
  let rentalContract: any;
  let token: IERC20;
  let rentalNft: any;
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

    // Setup RentalToken
    const RentalToken = await ethers.getContractFactory("RentalToken");
    token = await RentalToken.deploy();

    token.transfer(implementer.address, 500000000);
    token.transfer(lender.address, 500000000);
    token.transfer(renter.address, 500000000);

    // Load contracts
    const RentalNFT = await ethers.getContractFactory('RentalNFT');
    const RentalContract = await ethers.getContractFactory('RentalContract');

    // Deploy contracts
    rentalNft = await RentalNFT.deploy();
    await rentalNft.deployed();
    rentalContract = await RentalContract.deploy(
      implementer.address,
      token.address
    );
    await rentalContract.deployed();

    // Allow rental contract to move myTokens (only for testing)
    await token.connect(renter).approve(rentalContract.address, 500000000);
    // Initial mint
    await rentalNft.mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");

    // Deployer sends NFT to Lender
    await rentalNft.transferFrom(deployer.address, lender.address, nftId);

    // Lender Approves NFT
    await rentalNft.connect(lender).approve(rentalContract.address, nftId);

    // Initial lend and rent
    await rentalContract.connect(lender).lend(
      rentalNft.address,
      nftId,
      12,
      10
    );

    await rentalContract.connect(renter).rent(
      rentalNft.address,
      nftId,
      12,
      10
    );
  });

  describe('Deployer', () => {
    it('should set implementer', async () => {
      expect(await rentalContract.implementer()).to.equal(implementer.address);
    });

    it('should set Rental Smart Contract to be NFT owner', async () => {
      expect(await rentalNft.ownerOf(nftId)).to.equal(rentalContract.address);
    });
  });

  describe('Implementer', () => {
    it('should execute increaseCount', async () => {
      await rentalContract.connect(implementer).increaseCount(
        rentalNft.address,
        nftId
      );
      const rentOrderIncreased = await rentalContract.getOrder(
        rentalNft.address,
        nftId
      );
      expect(rentOrderIncreased._count).to.equal(1);
    });

    it('should execute increaseCount transaction until maxcount is reached', async () => {
      for (let i = 0; i <= 10; i++) {
        await rentalContract.connect(implementer).increaseCount(
          rentalNft.address,
          nftId
        );
      }
      await expect(rentalContract.connect(implementer).increaseCount(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "max count is reached"
      );
    });

    it('should not execute increaseCount when order is expired', async () => {
      let order = await rentalContract.getOrder(
        rentalNft.address,
        nftId
      );
      await time.increaseTo(order._rentedAt + Number(order._duration) * DAY_IN_SECONDS + 1);
      await expect(rentalContract.connect(implementer).increaseCount(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "rent duration exceeded"
      );
    });
  });

  describe('Renter', () => {
    it('should execute rent transaction', async () => {
      await rentalNft.connect(lender).mint("https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1");
      const nextNftId = nftId + 1;
      await rentalNft.connect(lender).approve(rentalContract.address, nextNftId);
      await rentalContract.connect(renter).rent(
        rentalNft.address,
        nextNftId,
        12,
        10
      );
      const order = await rentalContract.getOrder(
        rentalNft.address,
        nextNftId
      );
      expect(order._renter).to.equal(renter.address);
    });

    it('should not execute rent transaction when nft is already rented', async () => {
      await expect(rentalContract.connect(renter).rent(
        rentalNft.address,
        nftId,
        12,
        10
      )).to.be.revertedWith(
        "order already rented"
      );
    });

    it('should not execute increaseCount', async () => {
      await expect(rentalContract.connect(renter).increaseCount(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "only implementer can call this method"
      );
    });

    it('should execute stop rent transaction', async () => {
      await rentalContract.connect(renter).stopRent(
        rentalNft.address,
        nftId
      );
      const order = await rentalContract.getOrder(
        rentalNft.address,
        nftId
      );
      expect(order._duration).to.equal(0);
    });

    it('should not execute stop lend transaction', async () => {
      await expect(rentalContract.connect(renter).stopLend(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "only lender can stop this order"
      );
    });

    it('should not execute stop rent transaction when order is already stopped or expired', async () => {
      await rentalContract.connect(renter).stopRent(
        rentalNft.address,
        nftId
      );
      await expect(rentalContract.connect(renter).stopRent(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "order already stopped"
      );
    });

    it('should claim refund when order is stopped', async () => {
      for (let i = 0; i <= 6; i++) {
        await rentalContract.connect(implementer).increaseCount(
          rentalNft.address,
          nftId
        );
      }
      await rentalContract.connect(renter).stopRent(
        rentalNft.address,
        nftId
      );

      await rentalContract.connect(renter).claimRefund(rentalNft.address, nftId);
      // TODO: expect balance check
    });

    it('should claim refund when order is expired', async () => {
      let order = await rentalContract.getOrder(
        rentalNft.address,
        nftId
      );
      await time.increaseTo(order._rentedAt + Number(order._duration) * DAY_IN_SECONDS + 1);
      await rentalContract.connect(renter).claimRefund(rentalNft.address, nftId);
      // TODO: expect balance check
    });

    it('should not claim refund when order is not expired', async () => {
      await expect(rentalContract.connect(renter).claimRefund(rentalNft.address, nftId)).to.be.revertedWith(
        "rent duration not exceeded"
      );
    });

    it('should not claim refund when calles is not renter', async () => {
      await expect(rentalContract.connect(lender).claimRefund(rentalNft.address, nftId)).to.be.revertedWith(
        "only renter can claim refunds from this order"
      );
    });
  });

  describe('Lender', () => {
    it('should execute lend transaction', async () => {
      await rentalNft.connect(lender).mint("https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1");
      const nextNftId = nftId + 1;
      await rentalNft.connect(lender).approve(rentalContract.address, nextNftId);
      await rentalContract.connect(lender).lend(
        rentalNft.address,
        nextNftId,
        12,
        10
      );
      const order = await rentalContract.getOrder(
        rentalNft.address,
        nextNftId
      );
      expect(order._lender).to.equal(lender.address);
    });

    it('should not execute lend transaction when nft is already lended', async () => {
      await expect(rentalContract.connect(lender).lend(
        rentalNft.address,
        nftId,
        12,
        10
      )).to.be.revertedWith(
        "ERC721: transfer from incorrect owner"
      );
    });

    it('should not execute increaseCount', async () => {
      await expect(rentalContract.connect(lender).increaseCount(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "only implementer can call this method"
      );
    });

    it('should execute stop lend transaction', async () => {
      await rentalNft.connect(lender).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
      const nextNftId = nftId + 1;
      await rentalNft.connect(lender).approve(rentalContract.address, nextNftId);
      await rentalContract.connect(lender).lend(
        rentalNft.address,
        nextNftId,
        12,
        10
      );
      await rentalContract.connect(lender).stopLend(
        rentalNft.address,
        nextNftId
      );
      const orderAfter = await rentalContract.getOrder(
        rentalNft.address,
        nextNftId
      );
      expect(orderAfter._lender).to.equal(ethers.constants.AddressZero);
    });

    it('should not execute stop rent', async () => {
      await expect(rentalContract.connect(lender).stopRent(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "only renter can stop this order"
      );
    });

    it('should not execute stop lend transaction when order is already rented', async () => {
      await expect(rentalContract.connect(lender).stopLend(
        rentalNft.address,
        nftId
      )).to.be.revertedWith(
        "order already rented"
      );
    });

    it('should claim fund and nft when order is stopped', async () => {
      for (let i = 0; i <= 6; i++) {
        await rentalContract.connect(implementer).increaseCount(
          rentalNft.address,
          nftId
        );
      }
      await rentalContract.connect(renter).stopRent(
        rentalNft.address,
        nftId
      );
      await rentalContract.connect(lender).claimFund(rentalNft.address, nftId);

      // TODO: expect balance check
      expect(await rentalNft.ownerOf(nftId)).to.equal(lender.address);
    });

    it('should claim fund and nft when order is expired', async () => {
      let order = await rentalContract.getOrder(
        rentalNft.address,
        nftId
      );
      await time.increaseTo(order._rentedAt + Number(order._duration) * DAY_IN_SECONDS + 1);
      await rentalContract.connect(lender).claimFund(rentalNft.address, nftId);
      // TODO: check balance
    });

    it('should not claim fund and nft when order is not stopped or expired', async () => {
      await expect(rentalContract.connect(lender).claimFund(rentalNft.address, nftId)).to.be.revertedWith(
        "rent duration not exceeded"
      );
    });

    it('should not claim fund and nft when caller is not lender', async () => {
      await expect(rentalContract.connect(renter).claimFund(rentalNft.address, nftId)).to.be.revertedWith(
        "only lender can claim the funds and nft from this order"
      );
    });
  });
});
