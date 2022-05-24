// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable{
    using SafeERC20 for IERC20;
    
    address public admin;
    IERC20 public Bava;
    uint256 public airdropAmount;

    uint256 public validDuration = 7 days;
    uint256 public airdropIteration;

    mapping(uint256 => uint256) public accumulateAirdropAmount;
    mapping(uint256 => uint256) public endAirdrop;      // airdrop iteration => airdrop enddate?
    mapping(uint256 => uint256) public startAirdrop;    // airdrop iteration => airdrop startdate?
    mapping(address => mapping(uint256 => bool)) public processedAirdrops;   //user address => airdrop iteration => claim?

    event AirdropProcessed(address recipient, uint256 amount, uint256 date);

    constructor(address _token, address _admin, uint256 _airdropAmount) {
        admin = _admin;
        Bava = IERC20(_token);
        airdropAmount = _airdropAmount;
    }

    function updateAdmin(address newAdmin) external onlyOwner{
        admin = newAdmin;
    }

    function updateAmount(uint256 _newAmount) external onlyOwner{
        airdropAmount = _newAmount;
    }

    function updateEndAirdrop(uint256 _endAirdrop) public onlyOwner {
        endAirdrop[airdropIteration] = _endAirdrop;
    }

    function updateStartAirdrop(uint256 _airdropIteration, uint256 _startAirdrop) public onlyOwner {
        airdropIteration = _airdropIteration;
        startAirdrop[_airdropIteration] = _startAirdrop;
        endAirdrop[_airdropIteration] = _startAirdrop + validDuration;
    }

    function claimTokens(bytes calldata signature) external {
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, airdropAmount)));
        require(block.timestamp > startAirdrop[airdropIteration], "Airdrop havent start");
        require(block.timestamp < endAirdrop[airdropIteration], "Airdrop window over");
        require(recoverSigner(message, signature) == admin, "wrong signature");
        require(processedAirdrops[msg.sender][airdropIteration] == false, "airdrop already processed");

        processedAirdrops[msg.sender][airdropIteration] = true;
        accumulateAirdropAmount[airdropIteration] += airdropAmount;
        safeBavaTransfer(msg.sender, airdropAmount);
        emit AirdropProcessed(msg.sender, airdropAmount, block.timestamp);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }

    // Safe Bava transfer function, just in case if rounding error causes pool to not have enough Bavas.
    function safeBavaTransfer(address _to, uint256 _amount) private {
        uint256 BavaBal = Bava.balanceOf(address(this));
        if (_amount > BavaBal) {
            Bava.transfer(_to, BavaBal);
        } else {
            Bava.transfer(_to, _amount);
        }
    }

    // Return unclaimable token
    function returnToken(address _token, uint256 _amount, address _to) external onlyOwner {
        require(_to != address(0), "send to the zero address");
        IERC20(_token).safeTransfer(_to, _amount);
    }
}
