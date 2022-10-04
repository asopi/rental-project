//SPDX-License-Identifier: AFL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RentalToken is ERC20 {
    constructor() ERC20("RentalToken", "RNT") {
        _mint(msg.sender, 10000 * 10**18);
    }
}
