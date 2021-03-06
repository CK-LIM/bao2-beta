import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWAVAX is IERC20{
    function deposit() external payable;

    function withdraw(uint256) external;
}