//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./interfaces/IRentalContract.sol";
import {Order} from "./models/Order.sol";

contract RentalContract is IRentalContract {
    using SafeERC20 for IERC20;
    mapping(bytes32 => Order) public orders;
    address public implementer;
    IERC20 public token;
    uint256 private constant DAY_IN_SECONDS = 86400;

    modifier onlyImplementer() {
        require(
            msg.sender == implementer,
            "only implementer can call this method"
        );
        _;
    }

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
        require(_duration > 0, "duration is <= 0");
        require(_maxCount > 0, "maxCount is <= 0");
        Order storage order = orders[id(_nftAddress, _nftId)];
        require(order._renter == address(0), "order already rented");
        order._renter = payable(msg.sender);
        order._duration = _duration;
        order._maxCount = _maxCount;
        order._rentedAt = uint32(block.timestamp);
        uint256 maxPrice = order._maxCount * order._countPrice;
        require(address(msg.sender).balance > maxPrice, "not enough balance");
        token.safeTransferFrom(msg.sender, address(this), maxPrice);
    }

    function stopRent(address _nftAddress, uint256 _nftId) external {
        bytes32 orderId = id(_nftAddress, _nftId);
        Order storage order = orders[orderId];
        require(order._duration != 0, "order already stopped");
        require(msg.sender == order._renter, "only renter can stop this order");
        order._duration = 0;
    }

    function stopLend(address _nftAddress, uint256 _nftId) external {
        bytes32 orderId = id(_nftAddress, _nftId);
        Order storage order = orders[orderId];
        require(order._lender == msg.sender, "only lender can stop this order");
        require(order._renter == address(0), "order already rented");
        delete orders[orderId];
        IERC721(_nftAddress).transferFrom(address(this), msg.sender, _nftId);
    }

    function claimFunds(address _nftAddress, uint256 _nftId) external {
        Order storage order = orders[id(_nftAddress, _nftId)];
        require(
            msg.sender == order._lender,
            "only lender can claim the funds and nft from this order"
        );
        require(
            order._rentedAt + order._duration * DAY_IN_SECONDS <=
                uint32(block.timestamp),
            "rent duration not exceeded"
        );
        uint256 fund = order._count * order._countPrice;
        order._renter = payable(address(0));
        token.safeTransfer(msg.sender, fund);
        IERC721(_nftAddress).transferFrom(address(this), msg.sender, _nftId);
    }

    function claimRefund(address _nftAddress, uint256 _nftId) external {
        Order storage order = orders[id(_nftAddress, _nftId)];
        require(
            msg.sender == order._renter,
            "only renter can claim refunds from this order"
        );
        require(
            order._rentedAt + order._duration * DAY_IN_SECONDS <=
                uint32(block.timestamp),
            "rent duration not exceeded"
        );
        uint256 refund = order._maxCount *
            order._countPrice -
            order._count *
            order._countPrice;
        order._renter = payable(order._lender);
        token.safeTransfer(msg.sender, refund);
    }

    function increaseCount(address _nftAddress, uint256 _nftId)
        external
        onlyImplementer
    {
        Order storage order = orders[id(_nftAddress, _nftId)];
        require(order._count <= order._maxCount, "max count is reached");
        require(
            order._rentedAt + order._duration * DAY_IN_SECONDS >
                uint32(block.timestamp),
            "rent duration exceeded"
        );
        order._count++;
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
