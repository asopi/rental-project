// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./interfaces/IRental.sol";
import {Order} from "./models/Order.sol";

contract Rental is IRental {
    using SafeERC20 for IERC20;
    mapping(bytes32 => Order) public orders;
    address public implementer;
    IERC20 public token;

    constructor(address _implementer, address _token) {
        implementer = _implementer;
        token = IERC20(_token);
    }

    function lend(
        address _nftAddress,
        uint256 _nftId,
        uint256 _duration,
        uint256 _countPrice
    ) external {
        require(_duration > 0, "duration is <= 0");
        require(_countPrice > 0, "countPrice is <= 0");
        orders[id(_nftAddress, _nftId)] = Order({
            _nftAddress: _nftAddress,
            _nftId: _nftId,
            _lender: msg.sender,
            _renter: payable(address(0)),
            _duration: _duration,
            _countPrice: _countPrice,
            _count: 0,
            _maxCount: 0,
            _rentedAt: 0
        });
        IERC721(_nftAddress).transferFrom(msg.sender, address(this), _nftId);
    }

    function rent(
        address _nftAddress,
        uint256 _nftId,
        uint256 _duration,
        uint256 _maxCount
    ) external payable {
        // TODO: check if order is already rented and if sender has enough balance
        Order storage order = orders[id(_nftAddress, _nftId)];
        order._renter = payable(msg.sender);
        order._duration = _duration;
        order._maxCount = _maxCount;
        order._rentedAt = uint32(block.timestamp);
        uint256 maxPrice = order._maxCount * order._countPrice;
        token.safeTransferFrom(msg.sender, address(this), maxPrice);
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

    function getOrder(address _nftAddress, uint256 _nftId)
        external
        view
        returns (Order memory)
    {
        return orders[id(_nftAddress, _nftId)];
    }

    function id(address _nftAddress, uint256 _nftId)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_nftAddress, _nftId));
    }
}