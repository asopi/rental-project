//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

struct Order {
    address _nftAddress;
    uint256 _nftId;
    address _lender;
    address payable _renter;
    uint256 _duration;
    uint256 _countPrice;
    uint256 _count;
    uint256 _maxCount;
    uint32 _rentedAt;
}
