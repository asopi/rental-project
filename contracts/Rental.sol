// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IRental.sol";
import {Order} from "./models/Order.sol";

contract Rental is IRental {
    mapping(address => Order) public orders;
    address public implementer;

    constructor(address _implementer) {
        implementer = _implementer;
    }

    function lend(
        address _nftAddress,
        uint256 _nftId,
        uint256 _duration,
        uint256 _countPrice
    ) external {
        // TODO: to be implemented
    }

    function rent(
        address _nftAddress,
        uint256 _nftId,
        uint256 _duration,
        uint256 _maxCount
    ) external payable {
        // TODO: to be implemented
    }

    function stopRent(address _nftAddress, uint256 _nftId) external {
        // TODO: to be implemented
    }

    function stopLend(address _nftAddress, uint256 _nftId) external {
        // TODO: to be implemented
    }

    function claimFund(address _nftAddress, uint256 _nftId) external {
        // TODO: to be implemented
    }

    function claimRefund(address _nftAddress, uint256 _nftId) external {
        // TODO: to be implemented
    }

    function increaseCount(address _nftAddress, uint256 _nftId) external {
        // TODO: to be implemented
    }
}
