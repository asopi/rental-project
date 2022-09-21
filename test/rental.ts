import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe('Rental', () => {
    let rentalContract: any;
    let deployer: SignerWithAddress;
    let implementer: SignerWithAddress;

    beforeEach(async () => {
        // Setup Accounts
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        implementer = accounts[1];

        const Rental = await ethers.getContractFactory('Rental');
        rentalContract = await Rental.deploy(implementer.address);
        await rentalContract.deployed();
    });

    describe('Deployer', () => {
        it('should set implementer', async () => {
            expect(await rentalContract.implementer()).to.equal(implementer.address);
        });
    });

});