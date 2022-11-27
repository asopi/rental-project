//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/*
* @author Alfred Sopi
* @notice The Rental NFT contract can be used to create a unlimited amount of ERC-721 tokens.
*/
contract RentalNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Rental NFT", "RNFT") {}

     /**
     * @dev Creates new ERC-721 tokens and increments the tokenId counter
     *
     * @param tokenURI Contains the URI to the content and metadata of the ERC-721 token
     * @return tokenId associated with the new created ERC-721 token
     */
    function mint(string memory tokenURI) external returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
