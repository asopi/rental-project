//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

interface IRentalContract {
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

    function claimFunds(address _nftAddress, uint256 _nftId) external;

    function claimRefunds(address _nftAddress, uint256 _nftId) external;

    function increaseCount(address _nftAddress, uint256 _nftId) external;
}
