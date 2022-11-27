import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IERC20 } from './../typechain-types/@openzeppelin/contracts/token/ERC20/IERC20';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('Rental Solution', () => {
  let rentalContract: any;
  let rentalToken: IERC20;
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
    const RentalToken = await ethers.getContractFactory('RentalToken');
    rentalToken = await RentalToken.deploy();

    rentalToken.transfer(implementer.address, 500000000);
    rentalToken.transfer(lender.address, 500000000);
    rentalToken.transfer(renter.address, 500000000);

    // Load contracts
    const RentalNFT = await ethers.getContractFactory('RentalNFT');
    const RentalContract = await ethers.getContractFactory('RentalContract');

    // Deploy contracts
    rentalNft = await RentalNFT.deploy();
    await rentalNft.deployed();
    rentalContract = await RentalContract.deploy(
      implementer.address,
      rentalToken.address
    );
    await rentalContract.deployed();

    // Allow rental contract to move myTokens (only for testing)
    await rentalToken
      .connect(renter)
      .approve(rentalContract.address, 500000000);
    // Initial mint
    await rentalNft.mint(
      'https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS'
    );

    // Deployer sends NFT to Lender
    await rentalNft.transferFrom(deployer.address, lender.address, nftId);

    // Lender Approves NFT
    await rentalNft.connect(lender).approve(rentalContract.address, nftId);

    // Initial lend and rent
    await rentalContract.connect(lender).lend(rentalNft.address, nftId, 12, 10);

    await rentalContract.connect(renter).rent(rentalNft.address, nftId, 12, 10);
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
      await rentalContract
        .connect(implementer)
        .increaseCount(rentalNft.address, nftId);
      const rentOrderIncreased = await rentalContract.getOrder(
        rentalNft.address,
        nftId
      );
      expect(rentOrderIncreased.count).to.equal(1);
    });

    it('should execute increaseCount transaction until maxcount is reached', async () => {
      for (let i = 0; i <= 10; i++) {
        await rentalContract
          .connect(implementer)
          .increaseCount(rentalNft.address, nftId);
      }
      await expect(
        rentalContract
          .connect(implementer)
          .increaseCount(rentalNft.address, nftId)
      ).to.be.revertedWith('max count is reached');
    });

    it('should not execute increaseCount when order is expired', async () => {
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      await time.increaseTo(
        order.rentedAt + Number(order.duration) * DAY_IN_SECONDS + 1
      );
      await expect(
        rentalContract
          .connect(implementer)
          .increaseCount(rentalNft.address, nftId)
      ).to.be.revertedWith('rent duration exceeded');
    });
  });

  describe('Renter', () => {
    it('should execute rent transaction', async () => {
      await rentalNft
        .connect(lender)
        .mint(
          'https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1'
        );
      const nextNftId = nftId + 1;
      await rentalNft
        .connect(lender)
        .approve(rentalContract.address, nextNftId);
      await rentalContract
        .connect(renter)
        .rent(rentalNft.address, nextNftId, 12, 10);
      const order = await rentalContract.getOrder(rentalNft.address, nextNftId);
      expect(order.renter).to.equal(renter.address);
    });

    it('should not execute rent transaction with a duration <= 0', async () => {
      await expect(
        rentalContract.connect(renter).rent(rentalNft.address, nftId, 0, 10)
      ).to.be.revertedWith('duration is <= 0');
    });

    it('should not execute rent transaction with a max count <= 0', async () => {
      await expect(
        rentalContract.connect(renter).rent(rentalNft.address, nftId, 12, 0)
      ).to.be.revertedWith('maxCount is <= 0');
    });

    it('should not execute rent transaction when renter has not enough balance', async () => {
      let balance = await rentalToken.balanceOf(renter.address);
      await rentalToken
        .connect(renter)
        .transfer(lender.address, Number(balance));
      await rentalNft
        .connect(lender)
        .mint(
          'https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1'
        );
      const nextNftId = nftId + 1;
      await rentalNft
        .connect(lender)
        .approve(rentalContract.address, nextNftId);
      await expect(
        rentalContract
          .connect(renter)
          .rent(rentalNft.address, nextNftId, 12, 10)
      ).to.be.revertedWith('not enough balance');
    });

    it('should not execute rent transaction when nft is already rented', async () => {
      await expect(
        rentalContract.connect(renter).rent(rentalNft.address, nftId, 12, 10)
      ).to.be.revertedWith('order already rented');
    });

    it('should not execute increaseCount', async () => {
      await expect(
        rentalContract.connect(renter).increaseCount(rentalNft.address, nftId)
      ).to.be.revertedWith('only implementer can call this method');
    });

    it('should execute stop rent transaction', async () => {
      await rentalContract.connect(renter).stopRent(rentalNft.address, nftId);
      const order = await rentalContract.getOrder(rentalNft.address, nftId);
      expect(order.duration).to.equal(0);
    });

    it('should not execute stop lend transaction', async () => {
      await expect(
        rentalContract.connect(renter).stopLend(rentalNft.address, nftId)
      ).to.be.revertedWith('only lender can stop this order');
    });

    it('should not execute stop rent transaction when order is already stopped or expired', async () => {
      await rentalContract.connect(renter).stopRent(rentalNft.address, nftId);
      await expect(
        rentalContract.connect(renter).stopRent(rentalNft.address, nftId)
      ).to.be.revertedWith('order already stopped');
    });

    it('should claim refund when order is stopped', async () => {
      let balanceBefore = await rentalToken.balanceOf(renter.address);
      for (let i = 0; i <= 6; i++) {
        await rentalContract
          .connect(implementer)
          .increaseCount(rentalNft.address, nftId);
      }
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      const refund =
        order.maxCount * order.countPrice - order.count * order.countPrice;
      const expectedBalance = Number(balanceBefore) + refund;
      await rentalContract.connect(renter).stopRent(rentalNft.address, nftId);
      await rentalContract
        .connect(renter)
        .claimRefund(rentalNft.address, nftId);
      order = await rentalContract.getOrder(rentalNft.address, nftId);
      expect(order.renterClaimed).to.equal(true);
      expect(await rentalToken.balanceOf(renter.address)).to.equal(
        expectedBalance
      );
    });

    it('should claim refund when order is expired', async () => {
      let balanceBefore = await rentalToken.balanceOf(renter.address);
      for (let i = 0; i <= 6; i++) {
        await rentalContract
          .connect(implementer)
          .increaseCount(rentalNft.address, nftId);
      }
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      const refund =
        order.maxCount * order.countPrice - order.count * order.countPrice;
      const expectedBalance = Number(balanceBefore) + refund;
      await time.increaseTo(
        order.rentedAt + Number(order.duration) * DAY_IN_SECONDS + 1
      );
      await rentalContract
        .connect(renter)
        .claimRefund(rentalNft.address, nftId);
      order = await rentalContract.getOrder(rentalNft.address, nftId);
      expect(order.renterClaimed).to.equal(true);
      expect(await rentalToken.balanceOf(renter.address)).to.equal(
        expectedBalance
      );
    });

    it('should not allow renter to claim already claimed refund', async () => {
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      await time.increaseTo(
        order.rentedAt + Number(order.duration) * DAY_IN_SECONDS + 1
      );
      await rentalContract
        .connect(renter)
        .claimRefund(rentalNft.address, nftId);
      await expect(
        rentalContract.connect(renter).claimRefund(rentalNft.address, nftId)
      ).to.be.revertedWith('order refund already claimed');
    });

    it('should not claim refund when order is not expired', async () => {
      await expect(
        rentalContract.connect(renter).claimRefund(rentalNft.address, nftId)
      ).to.be.revertedWith('rent duration not exceeded');
    });

    it('should not claim refund when calles is not renter', async () => {
      await expect(
        rentalContract.connect(lender).claimRefund(rentalNft.address, nftId)
      ).to.be.revertedWith('only renter can claim refunds from this order');
    });
  });

  describe('Lender', () => {
    it('should execute lend transaction', async () => {
      await rentalNft
        .connect(lender)
        .mint(
          'https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1'
        );
      const nextNftId = nftId + 1;
      await rentalNft
        .connect(lender)
        .approve(rentalContract.address, nextNftId);
      await rentalContract
        .connect(lender)
        .lend(rentalNft.address, nextNftId, 12, 10);
      const order = await rentalContract.getOrder(rentalNft.address, nextNftId);
      expect(order.lender).to.equal(lender.address);
    });

    it('should not execute lend transaction with a duration <= 0', async () => {
      await expect(
        rentalContract.connect(lender).lend(rentalNft.address, nftId, 0, 10)
      ).to.be.revertedWith('duration is <= 0');
    });

    it('should not execute lend transaction with a count price <= 0', async () => {
      await expect(
        rentalContract.connect(lender).lend(rentalNft.address, nftId, 12, 0)
      ).to.be.revertedWith('countPrice is <= 0');
    });

    it('should not execute lend transaction when nft is already lent', async () => {
      await expect(
        rentalContract.connect(lender).lend(rentalNft.address, nftId, 12, 10)
      ).to.be.revertedWith('ERC721: transfer from incorrect owner');
    });

    it('should not execute increaseCount', async () => {
      await expect(
        rentalContract.connect(lender).increaseCount(rentalNft.address, nftId)
      ).to.be.revertedWith('only implementer can call this method');
    });

    it('should execute stop lend transaction and return the nft back to the lender', async () => {
      await rentalNft
        .connect(lender)
        .mint(
          'https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS'
        );
      const nextNftId = nftId + 1;
      await rentalNft
        .connect(lender)
        .approve(rentalContract.address, nextNftId);
      await rentalContract
        .connect(lender)
        .lend(rentalNft.address, nextNftId, 12, 10);
      await rentalContract
        .connect(lender)
        .stopLend(rentalNft.address, nextNftId);
      const orderAfter = await rentalContract.getOrder(
        rentalNft.address,
        nextNftId
      );
      expect(orderAfter.lender).to.equal(ethers.constants.AddressZero);
      expect(await rentalNft.ownerOf(nextNftId)).to.equal(lender.address);
    });

    it('should not execute stop rent', async () => {
      await expect(
        rentalContract.connect(lender).stopRent(rentalNft.address, nftId)
      ).to.be.revertedWith('only renter can stop this order');
    });

    it('should not execute stop lend transaction when order is already rented', async () => {
      await expect(
        rentalContract.connect(lender).stopLend(rentalNft.address, nftId)
      ).to.be.revertedWith('order already rented');
    });

    it('should claim fund and nft when order is stopped', async () => {
      let balanceBefore = await rentalToken.balanceOf(lender.address);
      for (let i = 0; i <= 6; i++) {
        await rentalContract
          .connect(implementer)
          .increaseCount(rentalNft.address, nftId);
      }
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      const expectedBalance =
        Number(balanceBefore) + order.count * order.countPrice;
      await rentalContract.connect(renter).stopRent(rentalNft.address, nftId);
      await rentalContract.connect(lender).claimFund(rentalNft.address, nftId);
      expect(await rentalNft.ownerOf(nftId)).to.equal(lender.address);
      expect(await rentalToken.balanceOf(lender.address)).to.equal(
        expectedBalance
      );
    });

    it('should claim fund and nft when order is expired', async () => {
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      let balanceBefore = await rentalToken.balanceOf(lender.address);
      const expectedBalance =
        Number(balanceBefore) + order.count * order.countPrice;
      await time.increaseTo(
        order.rentedAt + Number(order.duration) * DAY_IN_SECONDS + 1
      );
      await rentalContract.connect(lender).claimFund(rentalNft.address, nftId);
      order = await rentalContract.getOrder(rentalNft.address, nftId);
      expect(order.lenderClaimed).to.equal(true);
      expect(await rentalNft.ownerOf(nftId)).to.equal(lender.address);
      expect(await rentalToken.balanceOf(lender.address)).to.equal(
        expectedBalance
      );
    });

    it('should not allow lender to claim already claimed fund', async () => {
      let order = await rentalContract.getOrder(rentalNft.address, nftId);
      await time.increaseTo(
        order.rentedAt + Number(order.duration) * DAY_IN_SECONDS + 1
      );
      await rentalContract.connect(lender).claimFund(rentalNft.address, nftId);
      await expect(
        rentalContract.connect(lender).claimFund(rentalNft.address, nftId)
      ).to.be.revertedWith('order fund already claimed');
    });

    it('should not claim fund and nft when order is not stopped or expired', async () => {
      await expect(
        rentalContract.connect(lender).claimFund(rentalNft.address, nftId)
      ).to.be.revertedWith('rent duration not exceeded');
    });

    it('should not claim fund and nft when caller is not lender', async () => {
      await expect(
        rentalContract.connect(renter).claimFund(rentalNft.address, nftId)
      ).to.be.revertedWith(
        'only lender can claim the funds and nft from this order'
      );
    });
  });
});
