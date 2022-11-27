//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./interfaces/IRentalContract.sol";
import {Order} from "./models/Order.sol";

/*
 * @author Alfred Sopi
 * @notice The Rental Contract can be used to create and manage ERC-721 lend and rent orders.
 * For the purpose of the pay-per-like pricing model, each order is associated with a counter that is used to calculate the rental fees.
 */
contract RentalContract is IRentalContract {
    using SafeERC20 for IERC20;
    mapping(bytes32 => Order) public orders;
    address public implementer;
    IERC20 private _token;
    uint256 private constant DAY_IN_SECONDS = 86400;

    /**
     * @dev Modifier to check if the sender is the implementer
     */
    modifier onlyImplementer() {
        require(
            msg.sender == implementer,
            "only implementer can call this method"
        );
        _;
    }

    constructor(address implementerAddress, address token) {
        implementer = implementerAddress;
        _token = IERC20(token);
    }

    /**
     * @dev See {IRentalContract-lend}.
     */
    function lend(
        address nftAddress,
        uint256 nftId,
        uint256 duration,
        uint256 countPrice
    ) external {
        require(duration > 0, "duration is <= 0");
        require(countPrice > 0, "countPrice is <= 0");
        orders[id(nftAddress, nftId)] = Order({
            nftAddress: nftAddress,
            nftId: nftId,
            lender: msg.sender,
            renter: payable(address(0)),
            duration: duration,
            countPrice: countPrice,
            count: 0,
            maxCount: 0,
            rentedAt: 0,
            renterClaimed: false,
            lenderClaimed: false
        });
        IERC721(nftAddress).transferFrom(msg.sender, address(this), nftId);
    }

    /**
     * @dev See {IRentalContract-rent}.
     */
    function rent(
        address nftAddress,
        uint256 nftId,
        uint256 duration,
        uint256 maxCount
    ) external payable {
        require(duration > 0, "duration is <= 0");
        require(maxCount > 0, "maxCount is <= 0");
        Order storage order = orders[id(nftAddress, nftId)];
        require(order.renter == address(0), "order already rented");
        order.renter = payable(msg.sender);
        order.duration = duration;
        order.maxCount = maxCount;
        order.rentedAt = uint32(block.timestamp);
        uint256 maxPrice = order.maxCount * order.countPrice;
        require(_token.balanceOf(msg.sender) > maxPrice, "not enough balance");
        _token.safeTransferFrom(msg.sender, address(this), maxPrice);
    }

    /**
     * @dev See {IRentalContract-stopRent}.
     */
    function stopRent(address nftAddress, uint256 nftId) external {
        bytes32 orderId = id(nftAddress, nftId);
        Order storage order = orders[orderId];
        require(order.duration != 0, "order already stopped");
        require(msg.sender == order.renter, "only renter can stop this order");
        order.duration = 0;
    }

    /**
     * @dev See {IRentalContract-stopLend}.
     */
    function stopLend(address nftAddress, uint256 nftId) external {
        bytes32 orderId = id(nftAddress, nftId);
        Order storage order = orders[orderId];
        require(order.lender == msg.sender, "only lender can stop this order");
        require(order.renter == address(0), "order already rented");
        delete orders[orderId];
        IERC721(nftAddress).transferFrom(address(this), msg.sender, nftId);
    }

    /**
     * @dev See {IRentalContract-claimFund}.
     */
    function claimFund(address nftAddress, uint256 nftId) external {
        Order storage order = orders[id(nftAddress, nftId)];
        require(
            order.lenderClaimed == false,
            "order fund already claimed"
        );
        require(
            msg.sender == order.lender,
            "only lender can claim the funds and nft from this order"
        );
        require(
            order.rentedAt + order.duration * DAY_IN_SECONDS <=
                uint32(block.timestamp),
            "rent duration not exceeded"
        );
        order.lenderClaimed = true;
        uint256 fund = order.count * order.countPrice;
        _token.safeTransfer(msg.sender, fund);
        IERC721(nftAddress).transferFrom(address(this), msg.sender, nftId);
    }

    /**
     * @dev See {IRentalContract-claimRefund}.
     */
    function claimRefund(address nftAddress, uint256 nftId) external {
        Order storage order = orders[id(nftAddress, nftId)];
        require(
            order.renterClaimed == false,
            "order refund already claimed"
        );
        require(
            msg.sender == order.renter,
            "only renter can claim refunds from this order"
        );
        require(
            order.rentedAt + order.duration * DAY_IN_SECONDS <=
                uint32(block.timestamp),
            "rent duration not exceeded"
        );
        uint256 refund = order.maxCount *
            order.countPrice -
            order.count *
            order.countPrice;
        order.renterClaimed = true;
        _token.safeTransfer(msg.sender, refund);
    }

    /**
     * @dev See {IRentalContract-increaseCount}.
     */
    function increaseCount(address nftAddress, uint256 nftId)
        external
        onlyImplementer
    {
        Order storage order = orders[id(nftAddress, nftId)];
        require(order.count <= order.maxCount, "max count is reached");
        require(
            order.rentedAt + order.duration * DAY_IN_SECONDS >
                uint32(block.timestamp),
            "rent duration exceeded"
        );
        order.count++;
    }

    /**
     * Returns an order stored in the Rental Contract that is associated with a specific NFT.
     *
     * @param nftAddress Contains the account address of an ERC-721 token
     * @param nftId Contains the tokenId of an ERC-721 token
     * @return order object
     */
    function getOrder(address nftAddress, uint256 nftId)
        external
        view
        returns (Order memory)
    {
        return orders[id(nftAddress, nftId)];
    }

    /**
     * Returns an id generated with a keccak256 hash that is derived from the nftAddress and the nftId.
     * This id is used to identify an order stored in the Rental Contract.
     *
     * @param nftAddress Contains the account address of an ERC-721 token
     * @param nftId Contains the tokenId of an ERC-721 token
     * @return id in bytes
     */
    function id(address nftAddress, uint256 nftId)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(nftAddress, nftId));
    }
}
