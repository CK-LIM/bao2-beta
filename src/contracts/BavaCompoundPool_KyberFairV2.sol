// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./BRTERC20.sol";

import "./IBavaMasterFarm.sol";
import "./IBavaToken.sol";
import "./IPair.sol";
import "./IWAVAX.sol";
import "./IKyberFairLaunchV2.sol";
import "./IKyberRewardLockerV2.sol";
import "./IRouter.sol";
import "./IDMMRouter.sol";

// BavaCompoundPool is the compoundPool of BavaMasterFarmer. It will autocompound user LP.
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once Bava is sufficiently
// distributed and the community can show to govern itself.

contract BavaCompoundPool_KyberFairV2 is BRTERC20, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeERC20 for IPair;
    using SafeERC20 for IWAVAX;

    // Info of each user.
    struct UserInfo {
        uint256 receiptAmount;      // user receipt tokens.
        uint256 rewardDebt;         // Reward debt. See explanation below.
        uint256 rewardDebtAtBlock;  // the last block user stake
		uint256 lastWithdrawBlock;  // the last block a user withdrew at.
		uint256 firstDepositBlock;  // the first block a user deposited at.
		uint256 blockdelta;         // time passed since withdrawals
		uint256 lastDepositBlock;   // the last block a user deposited at.
    }

    // Info of pool.
    struct PoolInfo {
        IPair lpToken;             // Address of LP token contract.
        uint256 depositAmount;      // Total deposit amount
        bool deposits_enabled;
    }
    
    // Info of 3rd party restaking farm 
    struct PoolRestakingInfo {
        IKyberFairLaunchV2 stakingContract; // Kyber LP Staking contract
        IKyberRewardLockerV2 rewardLocker;  // Kyber reward locker
        uint256 restakingFarmID;            // RestakingFarm ID
    }

    IWAVAX private constant WAVAX = IWAVAX(0x52B654763F016dAF087d163c9EB6c7F486261019);     // 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7
    IERC20 private constant USDCE = IERC20(0x3800955b7A4233A2a4f2344a43362D9126E9FC81);     // 0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664
    IPair private constant KNC_WAVAX = IPair(0xc35E87661E246489bCd242f0C9Da48254aEa1cA5);     // 0x4797D61A80FBb90Aa060c6d8Fe9991c41C4868BF

    uint256 public MIN_TOKENS_TO_REINVEST;
    uint256 public DEV_FEE_BIPS;
    uint256 public REINVEST_REWARD_BIPS;
    uint256 constant internal BIPS_DIVISOR = 10000;

    IRouter public router;                  // Router1 for swap token
    IDMMRouter public router2;              // Router2 for add and remove liquidity
    IBAVAMasterFarm public BavaMasterFarm;  // MasterFarm to mint BAVA token.
    IBavaToken public Bava;                 // The Bava TOKEN!
    uint256 public bavaPid;                 // BAVA Master Farm Pool Id
    address public devaddr;                 // Developer/Employee address.
    address public liqaddr;                 // Liquidate address

    IERC20 public rewardToken;
    IERC20[] public bonusRewardTokens;
    uint256[] public blockDeltaStartStage;
    uint256[] public blockDeltaEndStage;
    uint256[] public userFeeStage;
    uint256 public userDepFee;
    uint256 public PERCENT_LOCK_BONUS_REWARD;           // lock xx% of bounus reward in 3 year

    PoolInfo public poolInfo;                           // Info of each pool.
    PoolRestakingInfo public poolRestakingInfo;         // Info of each pool restaking farm.
    mapping (address => UserInfo) public userInfo;      // Info of each user that stakes LP tokens. pid => user address => info

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount, uint256 devAmount);
    event SendBavaReward(address indexed user, uint256 indexed pid, uint256 amount, uint256 lockAmount);
    event DepositsEnabled(bool newValue);
    event Liquidate(address indexed userAccount, uint256 amount);

    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        require(authorized[msg.sender] || owner() == msg.sender);
        _;
    }

    constructor(
        IBavaToken _IBava,
        IBAVAMasterFarm _BavaMasterFarm,
        address _devaddr,
        address _liqaddr,
        uint256 _userDepFee,
        uint256 _newlock,
        uint256 _bavaPid,
        uint256[] memory _blockDeltaStartStage,
        uint256[] memory _blockDeltaEndStage,
        uint256[] memory _userFeeStage
    ) {
        Bava = _IBava;
        BavaMasterFarm = _BavaMasterFarm;
        devaddr = _devaddr;
        liqaddr = _liqaddr;
	    userDepFee = _userDepFee;
        PERCENT_LOCK_BONUS_REWARD = _newlock; 
        bavaPid = _bavaPid;
	    blockDeltaStartStage = _blockDeltaStartStage;
	    blockDeltaEndStage = _blockDeltaEndStage;
	    userFeeStage = _userFeeStage;
    }

    receive() external payable {}

    /******************************************* INITIAL SETUP START ******************************************/
    // Init the pool. Can only be called by the owner. Support LP from kyber fair launch.
    function initPool(
        IPair _lpToken,
        IKyberFairLaunchV2 _stakingContract,
        IKyberRewardLockerV2 _rewardLocker,
        uint256 _restakingFarmID,
        IERC20 _rewardToken,
        IERC20[] memory _bonusRewardTokens,
        IRouter _router,
        IDMMRouter _router2,
        uint256 _MIN_TOKENS_TO_REINVEST,
        uint256 _DEV_FEE_BIPS,
        uint256 _REINVEST_REWARD_BIPS
    ) external onlyOwner {
        // require(address(_lpToken) != address(0));
        // require(address(_stakingContract) != address(0));
        poolInfo = PoolInfo({
            lpToken : _lpToken,
            depositAmount : 0,
            deposits_enabled : true
        });
        poolRestakingInfo = PoolRestakingInfo({
            stakingContract : _stakingContract,
            rewardLocker : _rewardLocker,
            restakingFarmID : _restakingFarmID
        });
        rewardToken = _rewardToken;
        bonusRewardTokens = _bonusRewardTokens;
        router = _router;
        router2 = _router2;
        MIN_TOKENS_TO_REINVEST = _MIN_TOKENS_TO_REINVEST;
        DEV_FEE_BIPS = _DEV_FEE_BIPS;
        REINVEST_REWARD_BIPS = _REINVEST_REWARD_BIPS;
    }

    /**
     * @notice Approve tokens for use in Strategy, Restricted to avoid griefing attacks
     */

    function setAllowances(uint256 _amount) external onlyOwner {
        poolInfo.lpToken.approve(address(poolRestakingInfo.stakingContract), _amount);

        if (address(router) != address(0)) {
            WAVAX.approve(address(router), _amount);
            IERC20(poolInfo.lpToken.token0()).approve(address(router), _amount);
            IERC20(poolInfo.lpToken.token1()).approve(address(router), _amount);
        }
        if (address(router2) != address(0)) {
            WAVAX.approve(address(router2), _amount);
            IERC20(poolInfo.lpToken.token0()).approve(address(router2), _amount);
            IERC20(poolInfo.lpToken.token1()).approve(address(router2), _amount);
            (poolInfo.lpToken).approve(address(router2), _amount);
            rewardToken.approve(address(router2), _amount);
        }
    }
    /******************************************** INITIAL SETUP END ********************************************/

    /****************************************** FARMING CORE FUNCTION ******************************************/
    // Update reward variables of the given pool to be up-to-date.
    function updatePool() public {
        ( , , , uint256 lastRewardBlock, ) = BavaMasterFarm.poolInfo(bavaPid);
        if (block.number <= lastRewardBlock) {
            return;
        }
        BavaMasterFarm.updatePool(bavaPid);
    }

    function claimReward() external nonReentrant {
        updatePool();
        _harvest(msg.sender);
    }

    // lock 95% of reward
    function _harvest(address account) private {
        UserInfo storage user = userInfo[account];
        (, , , , uint256 accBavaPerShare) = BavaMasterFarm.poolInfo(bavaPid);
        if (user.receiptAmount > 0) {
            uint256 pending = user.receiptAmount*(accBavaPerShare)/(1e12)-(user.rewardDebt);
            uint256 masterBal = Bava.balanceOf(address(this));

            if (pending > masterBal) {
                pending = masterBal;
            }
            
            if(pending > 0) {
                Bava.transfer(account, pending);
                uint256 lockAmount = 0;
                lockAmount = pending*(PERCENT_LOCK_BONUS_REWARD)/(100);
                Bava.lock(account, lockAmount);

                user.rewardDebtAtBlock = block.number;

                emit SendBavaReward(account, bavaPid, pending, lockAmount);
            }
            user.rewardDebt = user.receiptAmount*(accBavaPerShare)/(1e12);
        }
    }
    
    // Deposit LP tokens to BavaMasterFarmer for $Bava allocation.
    function deposit(uint256 _amount) external nonReentrant {
        // require(_amount > 0, "#<0");
        require(poolInfo.deposits_enabled == true, "Fal");

        UserInfo storage user = userInfo[msg.sender];
        UserInfo storage devr = userInfo[devaddr];
        
        (uint256 estimatedTotalReward, uint256 estimatedAVAXReward, uint256 rewardBalance, uint256 avaxBalance) = checkLockerReward();
        if (estimatedTotalReward + estimatedAVAXReward + rewardBalance + avaxBalance > MIN_TOKENS_TO_REINVEST) {
            _reinvest(estimatedTotalReward, estimatedAVAXReward);
        }

        updatePool();
        _harvest(msg.sender);
        (, , , , uint256 accBavaPerShare) = BavaMasterFarm.poolInfo(bavaPid);
        
        poolInfo.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        uint poolReceiptAmount = getSharesForDepositTokens(_amount);
        poolInfo.depositAmount += _amount;

        if (user.receiptAmount == 0) {
            user.rewardDebtAtBlock = block.number;
        }
        uint userReceiptAmount = poolReceiptAmount - (poolReceiptAmount * userDepFee / BIPS_DIVISOR);  
        uint devrReceiptAmount = poolReceiptAmount - userReceiptAmount;

        user.receiptAmount += userReceiptAmount;
        user.rewardDebt = user.receiptAmount * (accBavaPerShare) / (1e12);
        devr.receiptAmount += devrReceiptAmount;
        devr.rewardDebt = devr.receiptAmount * (accBavaPerShare) / (1e12);
        _mint(msg.sender, userReceiptAmount);
        _mint(devaddr, devrReceiptAmount);

        // _stakeDepositTokens(_amount);
        poolRestakingInfo.stakingContract.deposit(poolRestakingInfo.restakingFarmID, _amount, true);
        
        emit Deposit(msg.sender, bavaPid, _amount);
		if(user.firstDepositBlock > 0){
		} else {
			user.firstDepositBlock = block.number;
		}
		user.lastDepositBlock = block.number;
    }
    
  // Withdraw LP tokens from BavaMasterFarmer. argument "_amount" is receipt amount.
    function withdraw(uint256 _amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint depositTokenAmount = getDepositTokensForShares(_amount);
        require(poolInfo.depositAmount >= depositTokenAmount, "#>B");
        require(user.receiptAmount >= _amount, "#>N");
        updatePool();
        _harvest(msg.sender);
        (, , , , uint256 accBavaPerShare) = BavaMasterFarm.poolInfo(bavaPid);

        if(depositTokenAmount > 0) {
            _withdrawDepositTokens(depositTokenAmount);
            user.receiptAmount = user.receiptAmount-(_amount);
            _burn(msg.sender, _amount);
			if(user.lastWithdrawBlock > 0){
				user.blockdelta = block.number - user.lastWithdrawBlock; 
            } else {
                user.blockdelta = block.number - user.firstDepositBlock;
			}
            poolInfo.depositAmount -= depositTokenAmount;
            user.rewardDebt = user.receiptAmount*(accBavaPerShare)/(1e12);
            user.lastWithdrawBlock = block.number;
			if(user.blockdelta == blockDeltaStartStage[0] || block.number == user.lastDepositBlock){
				//25% fee for withdrawals of LP tokens in the same block this is to prevent abuse from flashloans
                _withdrawLPTokens(depositTokenAmount, userFeeStage[0]);
			} else if (user.blockdelta >= blockDeltaStartStage[1] && user.blockdelta <= blockDeltaEndStage[0]){
				//8% fee if a user deposits and withdraws in under between same block and 59 minutes.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[1]);
			} else if (user.blockdelta >= blockDeltaStartStage[2] && user.blockdelta <= blockDeltaEndStage[1]){
				//4% fee if a user deposits and withdraws after 1 hour but before 1 day.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[2]);
			} else if (user.blockdelta >= blockDeltaStartStage[3] && user.blockdelta <= blockDeltaEndStage[2]){
				//2% fee if a user deposits and withdraws between after 1 day but before 3 days.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[3]);
			} else if (user.blockdelta >= blockDeltaStartStage[4] && user.blockdelta <= blockDeltaEndStage[3]){
				//1% fee if a user deposits and withdraws after 3 days but before 5 days.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[4]);
			}  else if (user.blockdelta >= blockDeltaStartStage[5] && user.blockdelta <= blockDeltaEndStage[4]){
				//0.5% fee if a user deposits and withdraws if the user withdraws after 5 days but before 2 weeks.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[5]);
			} else if (user.blockdelta >= blockDeltaStartStage[6] && user.blockdelta <= blockDeltaEndStage[5]){
				//0.25% fee if a user deposits and withdraws after 2 weeks.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[6]);
			} else if (user.blockdelta > blockDeltaStartStage[7]) {
				//0.1% fee if a user deposits and withdraws after 4 weeks.
                _withdrawLPTokens(depositTokenAmount, userFeeStage[7]);
			}
            emit Withdraw(msg.sender, bavaPid, depositTokenAmount);
		}
    }

    // EMERGENCY ONLY. Withdraw without caring about rewards.  
    // This has the same 25% fee as same block withdrawals and ucer receipt record set to 0 to prevent abuse of thisfunction.
    function emergencyWithdraw() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint256 userBRTAmount = balanceOf(msg.sender);
        uint depositTokenAmount = getDepositTokensForShares(userBRTAmount);

        require(poolInfo.depositAmount >= depositTokenAmount, "#>B");      //  pool.lpToken.balanceOf(address(this))
        _withdrawDepositTokens(depositTokenAmount);
        _burn(msg.sender, userBRTAmount);
        // Reordered from Sushi function to prevent risk of reentrancy
        uint256 amountToSend = depositTokenAmount*(75)/(100);
        uint256 devToSend = depositTokenAmount - amountToSend;  //25% penalty
        user.receiptAmount = 0;
        user.rewardDebt = 0;
        poolInfo.depositAmount -= depositTokenAmount;
        poolInfo.lpToken.safeTransfer(address(msg.sender), amountToSend);
        poolInfo.lpToken.safeTransfer(address(devaddr), devToSend);

        emit EmergencyWithdraw(msg.sender, bavaPid, amountToSend, devToSend);
    }

    // Withdraw LP token from this farm
    function _withdrawLPTokens(uint _depositTokenAmount, uint _userFeeStage) private {
        uint256 userWithdrawFee = _depositTokenAmount * _userFeeStage / BIPS_DIVISOR;
        poolInfo.lpToken.safeTransfer(address(msg.sender), userWithdrawFee);
        poolInfo.lpToken.safeTransfer(address(devaddr), _depositTokenAmount - userWithdrawFee);
    }

    // Withdraw LP token from 3rd party restaking farm
    function _withdrawDepositTokens(uint amount) private {
        (uint256 depositAmount,,) = poolRestakingInfo.stakingContract.getUserInfo(poolRestakingInfo.restakingFarmID, address(this));
        if(depositAmount >= amount) {
            poolRestakingInfo.stakingContract.withdraw(poolRestakingInfo.restakingFarmID, amount);
        } else {
            poolRestakingInfo.stakingContract.withdraw(poolRestakingInfo.restakingFarmID, depositAmount);
        }
    }

    // Claim LP restaking reward from 3rd party restaking contract
    function _getReinvestReward(uint256 estimatedTotalReward, uint256 estimatedAVAXReward) private {
        if (estimatedTotalReward > 0) {
            poolRestakingInfo.rewardLocker.vestCompletedSchedules(address(rewardToken));
        }
        if (estimatedAVAXReward > 0) {
            poolRestakingInfo.rewardLocker.vestCompletedSchedules(address(0));
        }
    }

    function harvestKyberReward() external {
        poolRestakingInfo.stakingContract.harvest(poolRestakingInfo.restakingFarmID);
        (uint256 estimatedTotalReward, uint256 estimatedAVAXReward, , ) = checkLockerReward();
        _getReinvestReward(estimatedTotalReward, estimatedAVAXReward);        
    }

    function reinvest() external nonReentrant {
        (uint256 estimatedTotalReward, uint256 estimatedAVAXReward, uint256 rewardBalance, uint256 avaxBalance) = checkLockerReward();
        require((estimatedTotalReward + estimatedAVAXReward + rewardBalance + avaxBalance) >= MIN_TOKENS_TO_REINVEST, "#<M");
        _reinvest(estimatedTotalReward, estimatedAVAXReward);
    }

    // Emergency withdraw LP token from 3rd party restaking contract
    function emergencyWithdrawDepositTokens(bool disableDeposits) external onlyOwner {
        poolRestakingInfo.stakingContract.emergencyWithdraw(poolRestakingInfo.restakingFarmID);
        if (poolInfo.deposits_enabled == true && disableDeposits == true) {
            updateDepositsEnabled(false);
        }
    }
    
    function liquidateCollateral(address userAccount, uint256 amount) external onlyAuthorized {
        _liquidateCollateral(userAccount, amount);
    }


    /**************************************** VIEW FUNCTIONS ****************************************/
    /**
     * @notice Calculate receipt tokens for a given amount of deposit tokens
     * @dev If contract is empty, use 1:1 ratio
     * @dev Could return zero shares for very low amounts of deposit tokens
     * @param amount deposit tokens
     * @return receipt tokens
     */
    function getSharesForDepositTokens(uint amount) public view returns (uint) {
        if (totalSupply() * poolInfo.depositAmount == 0) {
            return amount;
        }
        return (amount*totalSupply() / poolInfo.depositAmount);
    }

    /**
     * @notice Calculate deposit tokens for a given amount of receipt tokens
     * @param amount receipt tokens
     * @return deposit tokens
     */
    function getDepositTokensForShares(uint amount) public view returns (uint) {
        if (totalSupply() * poolInfo.depositAmount == 0) {
            return 0;
        }
        return (amount * poolInfo.depositAmount / totalSupply());
    }

    // View function to see pending Bavas on frontend.
    function pendingReward(address _user) external view returns (uint) {
        UserInfo storage user = userInfo[_user];
        (, , uint256 allocPoint, uint256 lastRewardBlock, uint256 accBavaPerShare) = BavaMasterFarm.poolInfo(bavaPid);

        if (block.number > lastRewardBlock && totalSupply() > 0) {
            (, uint256 BavaForFarmer, , ,) = BavaMasterFarm.getPoolReward(lastRewardBlock, block.number, allocPoint);
            accBavaPerShare = accBavaPerShare+(BavaForFarmer*(1e12)/(totalSupply()));
        }
        return user.receiptAmount*(accBavaPerShare)/(1e12)-(user.rewardDebt);
    }

    // View function to see pending 3rd party reward
    function checkReward() public view returns (uint, uint[] memory) {
        uint256[] memory pending = poolRestakingInfo.stakingContract.pendingRewards(poolRestakingInfo.restakingFarmID, address(this));

        return (pending[1], pending);
    }

    function checkLockerReward() public view returns (uint, uint, uint, uint) {
        return (
            _checkLockerReward(address(rewardToken)),
            _checkLockerReward(address(0)),
            rewardToken.balanceOf(address(this)),
            address(this).balance
            );
    }

    function _checkLockerReward(address token) internal view returns (uint) {
        IKyberRewardLockerV2.VestingSchedule[] memory schedules = poolRestakingInfo.rewardLocker.getVestingSchedules(address(this), token);
        uint256 schedulesLength = schedules.length;
        uint256 totalVesting;

        for (uint256 i = 0; i < schedulesLength; i++) {
            IKyberRewardLockerV2.VestingSchedule memory schedule = schedules[i];
            if (block.timestamp < schedule.endTime) {
                continue;
            }
            uint256 vestQuantity = uint256(schedule.quantity) - (schedule.vestedQuantity);
            if (vestQuantity == 0) {
                continue;
            }
            schedules[i].vestedQuantity = schedule.quantity;
            totalVesting = totalVesting + vestQuantity;
        }
        return (totalVesting);
    }

    /**************************************** ONLY OWNER FUNCTIONS ****************************************/
    // Rescue any token function, just in case if any user not able to withdraw token from the smart contract.
    function rescueDeployedFunds(address token, uint256 amount, address _to) external onlyOwner {
        require(_to != address(0), "0A");
        IERC20(token).safeTransfer(_to, amount);
    }

    // Update the given pool's Bava restaking contract. Can only be called by the owner.
    function setPoolRestakingInfo(IKyberFairLaunchV2 _stakingContract, IKyberRewardLockerV2 _rewardLocker, uint256 _restakingFarmID, IERC20 _rewardToken, IERC20[] memory _bonusRewardTokens, IRouter _router, IDMMRouter _router2, bool _withUpdate) external onlyOwner {      
        if (_withUpdate) {
            updatePool();
        }
        poolRestakingInfo = PoolRestakingInfo({
            stakingContract : _stakingContract,
            rewardLocker : _rewardLocker,
            restakingFarmID : _restakingFarmID
        });
        rewardToken = _rewardToken;
        bonusRewardTokens = _bonusRewardTokens;
        router = _router;
        router2 = _router2;
    }

    function setBavaMasterFarm(IBAVAMasterFarm _BavaMasterFarm, uint256 _bavaPid) external onlyOwner {
        BavaMasterFarm = _BavaMasterFarm;
        bavaPid = _bavaPid;
    }

    function devAddrUpdate(address _devaddr, address _liqaddr) public onlyOwner {
        devaddr = _devaddr;
        liqaddr = _liqaddr;
    }

    function addAuthorized(address _toAdd) onlyOwner public {
        authorized[_toAdd] = true;
    }

    function removeAuthorized(address _toRemove) onlyOwner public {
        require(_toRemove != msg.sender);
        authorized[_toRemove] = false;
    }

    /**
     * @notice Enable/disable deposits
     * @param newValue bool
     */
    function updateDepositsEnabled(bool newValue) public onlyOwner {
        require(poolInfo.deposits_enabled != newValue);
        poolInfo.deposits_enabled = newValue;
        emit DepositsEnabled(newValue);
    }

    /**************************************** ONLY AUTHORIZED FUNCTIONS ****************************************/
    // Update % lock for general users & percent for other roles
    function percentUpdate(uint _newlock) public onlyAuthorized {
       PERCENT_LOCK_BONUS_REWARD = _newlock;
    }

	function setStageStarts(uint[] memory _blockStarts, uint[] memory _blockEnds) public onlyAuthorized {
        blockDeltaStartStage = _blockStarts;
        blockDeltaEndStage = _blockEnds;
    }
    
    function setUserFeeStage(uint _usrDepFees, uint[] memory _userFees) public onlyAuthorized {
        userDepFee = _usrDepFees;
        userFeeStage = _userFees;
    }

    function setMinReinvestToken(uint _MIN_TOKENS_TO_REINVEST) public onlyAuthorized {
        MIN_TOKENS_TO_REINVEST = _MIN_TOKENS_TO_REINVEST;
    }

    function setDevFeeBips(uint _DEV_FEE_BIPS, uint _REINVEST_REWARD_BIPS) public onlyAuthorized {
        DEV_FEE_BIPS = _DEV_FEE_BIPS;
        REINVEST_REWARD_BIPS = _REINVEST_REWARD_BIPS;
    }

    /*********************** Autocompound Strategy ******************
    * Swap all reward tokens to WAVAX and swap half/half WAVAX token to both LP  token0 & token1, Add liquidity to LP token
    ****************************************/
    function _reinvest(uint256 estimatedTotalReward, uint256 estimatedAVAXReward) private {
        _getReinvestReward(estimatedTotalReward, estimatedAVAXReward);
        uint wavaxAmount = _convertRewardIntoWAVAX();
        uint liquidity = _convertWAVAXTokenToDepositToken(wavaxAmount);

        poolRestakingInfo.stakingContract.deposit(poolRestakingInfo.restakingFarmID, liquidity, true);
        poolInfo.depositAmount += liquidity;
    }

    function _convertRewardIntoWAVAX() private returns (uint) {
        uint pathLength = 2;
        address[] memory path = new address[](pathLength);
        uint256 avaxAmount;

        path[0] = address(rewardToken);
        path[1] = address(WAVAX);
        uint256 rewardBal = rewardToken.balanceOf(address(this));
        if (rewardBal > 0) {
            _convertExactTokentoToken(path, rewardBal, 1);
        }

        uint256 avaxBal =  address(this).balance;
        if (avaxBal > 0) {
            WAVAX.deposit{value: avaxBal}();
        }

        avaxAmount = WAVAX.balanceOf(address(this));
        uint256 devFee = avaxAmount*(DEV_FEE_BIPS)/(BIPS_DIVISOR);
        uint256 reinvestFee = avaxAmount*(REINVEST_REWARD_BIPS)/(BIPS_DIVISOR);
        if (devFee > 0) {
            WAVAX.safeTransfer(devaddr, devFee);
            WAVAX.safeTransfer(msg.sender, reinvestFee);
        }

        return (avaxAmount-reinvestFee-devFee);
    }

    function _convertWAVAXTokenToDepositToken(uint256 amount) private returns (uint) {
        require(amount > 0, "#<0");
        uint amountIn = amount / 2;

        (address[] memory path0, uint amountOutToken0) = _convertWAVAXtoLpOriginalToken(amountIn, poolInfo.lpToken.token0());
        (address[] memory path1, uint amountOutToken1) = _convertWAVAXtoLpOriginalToken(amountIn, poolInfo.lpToken.token1());

        // swap to deposit(LP) Token
        (,,uint liquidity) = router2.addLiquidity(
            path0[path0.length - 1], path1[path1.length - 1], address(poolInfo.lpToken),
            amountOutToken0, amountOutToken1,
            0, 0, [1,115792089237316195423570985008687907853269984665640564039457584007913129639935],
            address(this),
            block.timestamp+1200
        );
        return liquidity;
    }

    // Liquidate user collateral when user LP token value lower than user borrowed fund.
    function _liquidateCollateral(address userAccount, uint256 amount) private onlyAuthorized {
        UserInfo storage user = userInfo[userAccount];
        uint depositTokenAmount = getDepositTokensForShares(amount);
        updatePool();
        _harvest(userAccount);
        (, , , , uint256 accBavaPerShare) = BavaMasterFarm.poolInfo(bavaPid);
       
        require(poolInfo.depositAmount >= depositTokenAmount, "#>B");
        _burn(msg.sender, amount);
        _withdrawDepositTokens(depositTokenAmount);
        // Reordered from Sushi function to prevent risk of reentrancy
        user.receiptAmount -= amount;
        user.rewardDebt = user.receiptAmount * (accBavaPerShare) / (1e12);
        poolInfo.depositAmount -= depositTokenAmount;

        (uint balance0, uint balance1) = poolInfo.lpToken.getReserves();
        uint _totalSupply = poolInfo.lpToken.totalSupply();                     // gas savings, must be defined here since totalSupply can update in _mintFee
        uint amount0 = depositTokenAmount * (balance0) / _totalSupply * 8/10;   // using balances ensures pro-rata distribution
        uint amount1 = depositTokenAmount * (balance1) / _totalSupply * 8/10;   // using balances ensures pro-rata distribution
        // swap to original Tokens
        (uint amountA, uint amountB) = router2.removeLiquidity(poolInfo.lpToken.token0(), poolInfo.lpToken.token1(), address(poolInfo.lpToken), depositTokenAmount, amount0, amount1, address(this), block.timestamp+1200);

        uint liquidateAmountA = _convertTokentoUSDCE(amountA, 0);
        uint liquidateAmountB = _convertTokentoUSDCE(amountB, 1);

        USDCE.safeTransfer(address(liqaddr), (liquidateAmountA + liquidateAmountB));
        emit Liquidate(userAccount, amount);
    }

    function _convertWAVAXtoLpOriginalToken(uint amountIn, address token) private returns (address[] memory, uint) {
        uint pathLength = 2;
        address[] memory path = new address[](pathLength);
        path[0] = address(WAVAX);
        path[1] = token;

        uint amountOutToken = amountIn;
        // Check if path[1] equal to WAVAX 
        if (path[0] != path[pathLength - 1]) {
            amountOutToken = _convertExactTokentoToken(path, amountIn, 0);
        }

        return (path, amountOutToken);
    }

    function _convertTokentoUSDCE(uint amount, uint token) private returns (uint) {
        address oriToken;
        if (token == 0) {
            oriToken = poolInfo.lpToken.token0();
        } else if (token == 1) {
            oriToken = poolInfo.lpToken.token1();
        }
        // swap tokenA to USDC
        uint amountUSDCE;
        if (oriToken == address(USDCE)) {
            amountUSDCE = amount;
        } else {
            address[] memory path;
            uint pathLength = 2;
            path = new address[](pathLength);
            path[0] = oriToken;
            path[1] = address(USDCE);
            
            amountUSDCE = _convertExactTokentoToken(path, amount, 0);
        }
        return amountUSDCE;
    }

    // routerIndex 0 for pangolin/traderjoe router, 1 for kyber DMMrouter02
    function _convertExactTokentoToken(address[] memory path, uint amount, uint routerIndex) private returns (uint) {
        uint swapAmount;
        uint[] memory amountOut;

        if (routerIndex == 0) {
            uint[] memory amountsOutToken = router.getAmountsOut(amount, path);
            uint amountOutToken = amountsOutToken[amountsOutToken.length - 1];
            amountOut = router.swapExactTokensForTokens(amount, amountOutToken, path, address(this), block.timestamp+1200);
        } else if(routerIndex == 1) {
            address[] memory poolsPath = new address[](1);
            poolsPath[0] = address(KNC_WAVAX);

            uint[] memory amountsOutToken = router2.getAmountsOut(amount, poolsPath, path);
            uint amountOutToken = amountsOutToken[amountsOutToken.length - 1];
            amountOut = router2.swapExactTokensForTokens(amount, amountOutToken, poolsPath, path, address(this), block.timestamp+1200);
        }
        swapAmount = amountOut[amountOut.length - 1];
        return swapAmount;
    }
}