// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface IBavaToken {
    function transfer(address to, uint tokens) external returns (bool success);

    function balanceOf(address tokenOwner) external view returns (uint balance);

    function totalSupply() external view returns (uint _totalSupply);

    function lock(address _holder, uint256 _amount) external;
}


contract StakingRewards is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IBavaToken public Bava;                 // The Bava reward TOKEN!
    IERC20 public stakingToken;             // Staking Token
    uint256 public periodFinish;            // Reward period end timestamp
    uint256 public rewardRate;              // Reward rate
    uint256 public rewardsDuration;         // Reward duration
    uint256 public lastUpdateTime;          // Last pool update time
    uint256 public rewardPerTokenStored;    // Reward per token stored by pool

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private _totalSupply;
    mapping (address => UserInfo) public userInfo;

    address public devaddr;                         // Developer address.
    uint256[] public blockDeltaStartStage;
    uint256[] public blockDeltaEndStage;
    uint256[] public userFeeStage;
    uint256 public userDepFee;
    uint256 public PERCENT_LOCK_BONUS_REWARD;       // lock xx% of bounus reward in 3 year

    // Info of each user.
    struct UserInfo {
        uint256 amount;             // How many LP tokens the user has provided.
		uint256 lastWithdrawBlock;  // the last block a user withdrew at.
		uint256 firstDepositBlock;  // the first block a user deposited at.
		uint256 blockdelta;         // time passed since withdrawals
		uint256 lastDepositBlock;   // the last block a user deposited at.
        
        // We do some fancy math here. Basically, any point in time, the amount of Bavas
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accBavaPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accBavaPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }


    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _bavaToken,
        address _stakingToken,
        uint256 _userDepFee,
        address _devaddr,
        uint256[] memory _blockDeltaStartStage,
        uint256[] memory _blockDeltaEndStage,
        uint256[] memory _userFeeStage,
        uint256 _PERCENT_LOCK_BONUS_REWARD
    ) {
        Bava = IBavaToken(_bavaToken);
        stakingToken = IERC20(_stakingToken);
        userDepFee = _userDepFee;
        devaddr = _devaddr;
        blockDeltaStartStage = _blockDeltaStartStage;
	    blockDeltaEndStage = _blockDeltaEndStage;
        userFeeStage = _userFeeStage;
        PERCENT_LOCK_BONUS_REWARD = _PERCENT_LOCK_BONUS_REWARD;
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * (1e18) / _totalSupply);
    }

    function earned(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        return user.amount * (rewardPerToken() - userRewardPerTokenPaid[account]) / (1e18) + (rewards[account]);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate * rewardsDuration;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        UserInfo storage user = userInfo[msg.sender];
        UserInfo storage devr = userInfo[devaddr];
        _totalSupply = _totalSupply + amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 userAmount = amount - (amount * userDepFee / 10000);
        user.amount += userAmount;
        devr.amount += (amount - userAmount);

        if (user.firstDepositBlock > 0) {
		} else {
			user.firstDepositBlock = block.number;
		}
		user.lastDepositBlock = block.number;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= amount, "withdraw amount > deposit");

        _totalSupply = _totalSupply - amount;
        user.amount -= amount;

        if (user.lastWithdrawBlock > 0) {
            user.blockdelta = block.number - user.lastWithdrawBlock; }
        else {
            user.blockdelta = block.number - user.firstDepositBlock;
        }

        if(user.blockdelta == blockDeltaStartStage[0] || block.number == user.lastDepositBlock){
            //25% fee for withdrawals of LP tokens in the same block this is to prevent abuse from flashloans
            uint256 userWithdrawFee = amount*(userFeeStage[0])/100;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        } else if (user.blockdelta >= blockDeltaStartStage[1] && user.blockdelta <= blockDeltaEndStage[0]){
            //8% fee if a user deposits and withdraws in under between same block and 59 minutes.
            uint256 userWithdrawFee = amount*(userFeeStage[1])/100;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        } else if (user.blockdelta >= blockDeltaStartStage[2] && user.blockdelta <= blockDeltaEndStage[1]){
            //4% fee if a user deposits and withdraws after 1 hour but before 1 day.
            uint256 userWithdrawFee = amount*(userFeeStage[2])/100;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        } else if (user.blockdelta >= blockDeltaStartStage[3] && user.blockdelta <= blockDeltaEndStage[2]){
            //2% fee if a user deposits and withdraws between after 1 day but before 3 days.
            uint256 userWithdrawFee = amount*(userFeeStage[3])/100;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        } else if (user.blockdelta >= blockDeltaStartStage[4] && user.blockdelta <= blockDeltaEndStage[3]){
            //1% fee if a user deposits and withdraws after 3 days but before 5 days.
            uint256 userWithdrawFee = amount*(userFeeStage[4])/100;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        }  else if (user.blockdelta >= blockDeltaStartStage[5] && user.blockdelta <= blockDeltaEndStage[4]){
            //0.5% fee if a user deposits and withdraws if the user withdraws after 5 days but before 2 weeks.
            uint256 userWithdrawFee = amount*(userFeeStage[5])/1000;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        } else if (user.blockdelta >= blockDeltaStartStage[6] && user.blockdelta <= blockDeltaEndStage[5]){
            //0.25% fee if a user deposits and withdraws after 2 weeks.
            uint256 userWithdrawFee = amount*(userFeeStage[6])/10000;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);
        } else if (user.blockdelta > blockDeltaStartStage[7]) {
            //0.1% fee if a user deposits and withdraws after 4 weeks.
            uint256 userWithdrawFee = amount*(userFeeStage[7])/10000;
            stakingToken.safeTransfer(address(msg.sender), userWithdrawFee);
            stakingToken.safeTransfer(address(devaddr), amount-userWithdrawFee);

		user.lastWithdrawBlock = block.number;
		}

        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];

        uint256 remaining = periodFinish - block.timestamp;     // time
        uint256 leftover = remaining * rewardRate;              // tokens

        if (reward > leftover) {
            reward = leftover;
        }

        if (reward > 0) {
            rewards[msg.sender] = 0;
            Bava.transfer(msg.sender, reward);
            uint256 lockAmount = 0;
            lockAmount = reward*(PERCENT_LOCK_BONUS_REWARD)/(100);
            Bava.lock(msg.sender, lockAmount);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external {
        UserInfo storage user = userInfo[msg.sender];
        withdraw(user.amount);
        getReward();
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    // Always needs to update the balance of the contract when calling this method
    function notifyRewardAmount(uint256 reward) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward / rewardsDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;     // time
            uint256 leftover = remaining * rewardRate;              // tokens
            rewardRate = (reward + leftover) / rewardsDuration;
        }

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = Bava.balanceOf(address(this));
        require(rewardRate <= balance / rewardsDuration, "Provided reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + rewardsDuration;
        emit RewardAdded(reward);
    }

    // Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(owner(), tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        require(_rewardsDuration > 0, "Reward duration can't be zero");
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);
}