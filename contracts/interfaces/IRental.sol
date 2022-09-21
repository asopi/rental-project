// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IRental {
    function lend(
        address _nftAddress,
        uint256 _nftId,
        uint256 _duration,
        uint256 _countPrice
    ) external;

    function rent(
        address _nftAddress,
        uint256 _nftId,
        uint256 _duration,
        uint256 _maxCount
    ) external payable;

    function stopLend(address _nftAddress, uint256 _nftId) external;

    function stopRent(address _nftAddress, uint256 _nftId) external;

    function claimFund(address _nftAddress, uint256 _nftId) external;

    function claimRefund(address _nftAddress, uint256 _nftId) external;

    function increaseCount(address _nftAddress, uint256 _nftId) external;
}
