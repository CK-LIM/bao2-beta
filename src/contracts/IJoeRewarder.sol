// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IJoeRewarder {
    function onJoeReward(address user, uint256 newLpAmount) external;

    function pendingTokens(address user) external view returns (uint256 pending);

    function rewardToken() external view returns (address);
}