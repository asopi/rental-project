//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

/*
 * @author Alfred Sopi
 * @notice Structure representing an order used by the Rental Contract
 */
struct Order {
    address nftAddress;
    uint256 nftId;
    address lender;
    address payable renter;
    uint256 duration;
    uint256 countPrice;
    uint256 count;
    uint256 maxCount;
    uint32 rentedAt;
    bool renterClaimed;
    bool lenderClaimed;
}
