//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

/*
 * @author Alfred Sopi
 * @notice Interface that represents the functionalities implemented in the Rental Contact.
 */
interface IRentalContract {
     /**
      * Creates an order and transfers an ERC-721 token from the sender to the Rental Contract
      *
      * @param nftAddress Contains the account address of the ERC-721 token
      * @param nftId Contains the tokenId of the ERC-721 token
      * @param duration Contains the max. rent doration in days
      * @param countPrice Contains the price per count, used to set the price for a "like"
      */
    function lend(
        address nftAddress,
        uint256 nftId,
        uint256 duration,
        uint256 countPrice
    ) external;

     /**
      * Assigns the sender address to an order and transfers their Rental Tokens to the Rental Contract.
      *
      * @param nftAddress Contains the account address of the ERC-721 token
      * @param nftId Contains the tokenId of the ERC-721 token
      * @param duration Contains the rent doration in days
      * @param maxCount Contains the count limit, used to set the the limit for max. affordable likes
      */
    function rent(
        address nftAddress,
        uint256 nftId,
        uint256 duration,
        uint256 maxCount
    ) external payable;

     /**
      * Stops an order by setting the duration to 0, only the lender can execute this function.
      * In addition, the order needs to have an empty renter assigned
      *
      * @param nftAddress Contains the account address of the ERC-721 token
      * @param nftId Contains the tokenId of the ERC-721 token
      */
    function stopLend(address nftAddress, uint256 nftId) external;

     /**
       * Stops an order by setting the duration to 0, only the renter can execute this method.
       *
       * @param nftAddress Contains the account address of the ERC-721 token
       * @param nftId Contains the tokenId of the ERC-721 token
       */
    function stopRent(address nftAddress, uint256 nftId) external;

     /**
      * Transfers the funds and the ERC-721 token to the lender.
      *
      * @param nftAddress Contains the account address of the ERC-721 token
      * @param nftId Contains the tokenId of the ERC-721 token
      */
    function claimFund(address nftAddress, uint256 nftId) external;

     /**
      * Transfers the refunds to the renter.
      *
      * @param nftAddress Contains the account address of the ERC-721 token
      * @param nftId Contains the tokenId of the ERC-721 token
      */
    function claimRefund(address nftAddress, uint256 nftId) external;

     /**
      * Increases the count associated with an order.
      * Only the implementer is allowed to execute this function.
      *
      * @param nftAddress Contains the account address of the ERC-721 token
      * @param nftId Contains the tokenId of the ERC-721 token
      */
    function increaseCount(address nftAddress, uint256 nftId) external;
}
