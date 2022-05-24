// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./IERC20.sol";
import "./SafeERC20.sol";

interface IMigratorToBavaSwap {
    // Perform LP token migration from legacy UniswapV2 to BavaSwap.
    // Take the current LP token address and return the new LP token address.
    // Migrator should have full access to the caller's LP token.
    // Return the new LP token address.
    //
    // XXX Migrator must have allowance access to UniswapV2 LP tokens.
    // BavaSwap must mint EXACTLY the same amount of BavaSwap LP tokens or
    // else something bad will happen. Traditional UniswapV2 does not
    // do that so be careful!
    function migrate(IERC20 token) external returns (IERC20);
}

interface IBavaToken {

    function transfer(address to, uint tokens) external returns (bool success);

    function mint(address to, uint tokens) external;

    function balanceOf(address tokenOwner) external view returns (uint balance);

    function cap() external view returns (uint capSuppply);

    function totalSupply() external view returns (uint _totalSupply);

    function lock(address _holder, uint256 _amount) external;

}

// BavaMasterFarmer is the master of Bava. He can make Bava and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once Bava is sufficiently
// distributed and the community can show to govern itself.
//
contract BavaMasterFarmerV0 is Ownable, Authorizable {
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 rewardDebtAtBlock; // the last block user stake
		uint256 lastWithdrawBlock; // the last block a user withdrew at.
		uint256 firstDepositBlock; // the first block a user deposited at.
		uint256 blockdelta; //time passed since withdrawals
		uint256 lastDepositBlock; // the last block a user deposited at.
        //
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
    
    struct UserGlobalInfo {
        uint256 globalAmount;
        mapping(address => uint256) referrals;
        uint256 totalReferals;
        uint256 globalRefAmount;
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;             // Address of LP token contract.
        uint256 allocPoint;         // How many allocation points assigned to this pool. Bavas to distribute per block.
        uint256 lastRewardBlock;    // Last block number that Bavas distribution occurs.
        uint256 accBavaPerShare;    // Accumulated Bavas per share, times 1e12. See below.
        uint256 depositAmount;      // Total deposit amount
        uint256 lendAmount;         // Restaking borrow amount
    }

    // The Bava TOKEN!
    IBavaToken public Bava;
    //An ETH/USDC Oracle (Chainlink)
    address public usdOracle;
    // Developer/Employee address.
    address public devaddr;
	// Future Treasury address
	address public futureTreasuryaddr;
	// Advisor Address
	address public advisoraddr;
	// Founder Reward
	address public founderaddr;
    // Bava tokens created per block.
    uint256 public REWARD_PER_BLOCK;
    // Bonus muliplier for early Bava makers.
    uint256[] public REWARD_MULTIPLIER =[4096, 2048, 2048, 1024, 1024, 512, 512, 256, 256, 256, 256, 256, 256, 256, 256, 128, 128, 128, 128, 128, 128, 128, 128, 128, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 16, 8, 8, 8, 8, 32, 32, 64, 64, 64, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 256, 256, 256, 128, 128, 128, 128, 128, 128, 128, 128, 128, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 16, 16, 16, 16, 8, 8, 8, 4, 2, 1, 0];
    uint256[] public HALVING_AT_BLOCK; // init in constructor function
    uint256[] public blockDeltaStartStage;
    uint256[] public blockDeltaEndStage;
    uint256[] public userFeeStage;
    uint256[] public devFeeStage;
    uint256 public FINISH_BONUS_AT_BLOCK;
    uint256 public userDepFee;
    uint256 public devDepFee;

    // The block number when Bava mining starts.
    uint256 public START_BLOCK;

    uint256 public PERCENT_LOCK_BONUS_REWARD; // lock xx% of bounus reward in 3 year
    uint256 public PERCENT_FOR_DEV; // Dev bounties + Employees
	uint256 public PERCENT_FOR_FT; // Future Treasury fund
	uint256 public PERCENT_FOR_ADR; // Advisor fund
	uint256 public PERCENT_FOR_FOUNDERS; // founders fund

    // The migrator contract. It has a lot of power. Can only be set through governance (owner).
    IMigratorToBavaSwap public migrator;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    mapping(address => uint256) public poolId1; // poolId1 count from 1, subtraction 1 before using with poolInfo
    // Info of each user that stakes LP tokens. pid => user address => info
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    mapping (address => UserGlobalInfo) public userGlobalInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event SendBavaReward(address indexed user, uint256 indexed pid, uint256 amount, uint256 lockAmount);
    event Reinvest(address indexed user, uint256 indexed pid, uint256 lendAmount);
    event ReturnReinvest(address indexed user, uint256 indexed pid, uint256 lendAmount);

    constructor(
        IBavaToken _IBava,
        address _devaddr,
		address _futureTreasuryaddr,
		address _advisoraddr,
		address _founderaddr,
        uint256 _userDepFee,
        uint256 _devDepFee,
        uint256[] memory _blockDeltaStartStage,
        uint256[] memory _blockDeltaEndStage,
        uint256[] memory _userFeeStage,
        uint256[] memory _devFeeStage
    ) {
        Bava = _IBava;
        devaddr = _devaddr;
		futureTreasuryaddr = _futureTreasuryaddr;
		advisoraddr = _advisoraddr;
		founderaddr = _founderaddr;
	    userDepFee = _userDepFee;
	    devDepFee = _devDepFee;
	    blockDeltaStartStage = _blockDeltaStartStage;
	    blockDeltaEndStage = _blockDeltaEndStage;
	    userFeeStage = _userFeeStage;
	    devFeeStage = _devFeeStage;
        
    }

    function initPool(uint256 _rewardPerBlock, uint256 _startBlock,uint256 _halvingAfterBlock) public onlyOwner {
        REWARD_PER_BLOCK = _rewardPerBlock;
        START_BLOCK = _startBlock;
        for (uint256 i = 0; i < REWARD_MULTIPLIER.length - 1; i++) {
            uint256 halvingAtBlock = _halvingAfterBlock*(i + 1)+(_startBlock);
            HALVING_AT_BLOCK.push(halvingAtBlock);
        }
        FINISH_BONUS_AT_BLOCK = _halvingAfterBlock*(REWARD_MULTIPLIER.length - 1)+(_startBlock);
        HALVING_AT_BLOCK.push(type(uint256).max);
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }
    

    // Add a new lp to the pool. Can only be called by the owner.
    function add(uint256 _allocPoint, IERC20 _lpToken, bool _withUpdate) public onlyOwner {
        require(poolId1[address(_lpToken)] == 0, "lp is already in pool");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > START_BLOCK ? block.number : START_BLOCK;
        totalAllocPoint = totalAllocPoint+(_allocPoint);
        poolId1[address(_lpToken)] = poolInfo.length + 1;
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accBavaPerShare: 0,
            depositAmount: 0,
            lendAmount: 0
        }));
    }

    // Update the given pool's Bava allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint-(poolInfo[_pid].allocPoint)+(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // Set the migrator contract. Can only be called by the owner.
    function setMigrator(IMigratorToBavaSwap _migrator) public onlyOwner {
        migrator = _migrator;
    }

    // Migrate lp token to another lp contract. Can be called by anyone. We trust that migrator contract is good.
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "0 address");
        PoolInfo storage pool = poolInfo[_pid];
        IERC20 lpToken = pool.lpToken;

        uint256 bal = pool.depositAmount;
        // uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        pool.depositAmount -= bal;
        IERC20 newLpToken = migrator.migrate(lpToken);        
        require(bal == newLpToken.balanceOf(address(this)), "bad");
        pool.lpToken = newLpToken;
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.depositAmount;
        // uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 BavaForDev;
        uint256 BavaForFarmer;
		uint256 BavaForFT;
		uint256 BavaForAdr;
		uint256 BavaForFounders;
        (BavaForDev, BavaForFarmer, BavaForFT, BavaForAdr, BavaForFounders) = getPoolReward(pool.lastRewardBlock, block.number, pool.allocPoint);
        Bava.mint(address(this), BavaForFarmer);
        pool.accBavaPerShare = pool.accBavaPerShare+(BavaForFarmer*(1e12)/(lpSupply));
        pool.lastRewardBlock = block.number;
        if (BavaForDev > 0) {
            Bava.mint(address(devaddr), BavaForDev);
            //Dev fund has xx% locked during the starting bonus period. After which locked funds drip out linearly each block over 3 years.
            if (block.number <= FINISH_BONUS_AT_BLOCK) {
                Bava.lock(address(devaddr), BavaForDev*(75)/(100));
            }
        }
		if (BavaForFT > 0) {
            Bava.mint(futureTreasuryaddr, BavaForFT);
			//FT + Partnership fund has only xx% locked over time as most of it is needed early on for incentives and listings. The locked amount will drip out linearly each block after the bonus period.
			if (block.number <= FINISH_BONUS_AT_BLOCK) {
                Bava.lock(address(futureTreasuryaddr), BavaForFT*(45)/(100));
            }
        }
		if (BavaForAdr > 0) {
            Bava.mint(advisoraddr, BavaForAdr);
			//Advisor Fund has xx% locked during bonus period and then drips out linearly over 3 years.
            if (block.number <= FINISH_BONUS_AT_BLOCK) {
                Bava.lock(address(advisoraddr), BavaForAdr*(85)/(100));
            }
        }
		if (BavaForFounders > 0) {
            Bava.mint(founderaddr, BavaForFounders);
			//The Founders reward has xx% of their funds locked during the bonus period which then drip out linearly per block over 3 years.
			if (block.number <= FINISH_BONUS_AT_BLOCK) {
                Bava.lock(address(founderaddr), BavaForFounders*(95)/(100));
            }
        }
        
    }

    // |--------------------------------------|
    // [20, 30, 40, 50, 60, 70, 80, 99999999]
    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        uint256 result = 0;
        if (_from < START_BLOCK) return 0;

        for (uint256 i = 0; i < HALVING_AT_BLOCK.length; i++) {
            uint256 endBlock = HALVING_AT_BLOCK[i];

            if (_to <= endBlock) {
                uint256 m = (_to-_from)*(REWARD_MULTIPLIER[i]);
                return result+(m);
            }

            if (_from < endBlock) {
                uint256 m = (endBlock-_from)*(REWARD_MULTIPLIER[i]);
                _from = endBlock;
                result = result+(m);
            }
        }

        return result;
    }

    function getPoolReward(uint256 _from, uint256 _to, uint256 _allocPoint) public view returns (uint256 forDev, uint256 forFarmer, uint256 forFT, uint256 forAdr, uint256 forFounders) {
        uint256 multiplier = getMultiplier(_from, _to);
        uint256 amount = multiplier*(REWARD_PER_BLOCK)*(_allocPoint)/(totalAllocPoint);
        uint256 BavaCanMint = Bava.cap()-(Bava.totalSupply());

        if (BavaCanMint < amount) {
            forDev = 0;
			forFarmer = BavaCanMint;
			forFT = 0;
			forAdr = 0;
			forFounders = 0;
        }
        else {
            forDev = amount*(PERCENT_FOR_DEV)/(100000);
			forFarmer = amount;
			forFT = amount*(PERCENT_FOR_FT)/(100);
			forAdr = amount*(PERCENT_FOR_ADR)/(10000);
			forFounders = amount*(PERCENT_FOR_FOUNDERS)/(100000);
        }
    }

    // View function to see pending Bavas on frontend.
    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accBavaPerShare = pool.accBavaPerShare;
        uint256 lpSupply = pool.depositAmount;
        // uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply > 0) {
            uint256 BavaForFarmer;
            (, BavaForFarmer, , ,) = getPoolReward(pool.lastRewardBlock, block.number, pool.allocPoint);
            accBavaPerShare = accBavaPerShare+(BavaForFarmer*(1e12)/(lpSupply));

        }
        return user.amount*(accBavaPerShare)/(1e12)-(user.rewardDebt);
    }

    function claimReward(uint256 _pid) public {
        updatePool(_pid);
        _harvest(_pid);
    }

    // lock 95% of reward
    function _harvest(uint256 _pid) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        if (user.amount > 0) {
            uint256 pending = user.amount*(pool.accBavaPerShare)/(1e12)-(user.rewardDebt);
            uint256 masterBal = Bava.balanceOf(address(this));

            if (pending > masterBal) {
                pending = masterBal;
            }
            
            if(pending > 0) {
                Bava.transfer(msg.sender, pending);
                uint256 lockAmount = 0;
                // if (user.rewardDebtAtBlock <= FINISH_BONUS_AT_BLOCK) {
                lockAmount = pending*(PERCENT_LOCK_BONUS_REWARD)/(100);
                Bava.lock(msg.sender, lockAmount);
                // }

                user.rewardDebtAtBlock = block.number;

                emit SendBavaReward(msg.sender, _pid, pending, lockAmount);
            }

            user.rewardDebt = user.amount*(pool.accBavaPerShare)/(1e12);
        }
    }


    function getGlobalAmount(address _user) public view returns(uint256) {
        UserGlobalInfo storage current = userGlobalInfo[_user];
        return current.globalAmount;
    }
    
     function getGlobalRefAmount(address _user) public view returns(uint256) {
        UserGlobalInfo storage current = userGlobalInfo[_user];
        return current.globalRefAmount;
    }
    
    function getTotalRefs(address _user) public view returns(uint256) {
        UserGlobalInfo storage current = userGlobalInfo[_user];
        return current.totalReferals;
    }
    
    function getRefValueOf(address _user, address _user2) public view returns(uint256) {
        UserGlobalInfo storage current = userGlobalInfo[_user];
        uint256 a = current.referrals[_user2];
        return a;
    }
    
    // Deposit LP tokens to BavaMasterFarmer for $Bava allocation.
    function deposit(uint256 _pid, uint256 _amount, address _ref) public {
        require(_amount > 0, "amount must greater than 0");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        UserInfo storage devr = userInfo[_pid][devaddr];
        UserGlobalInfo storage refer = userGlobalInfo[_ref];
        UserGlobalInfo storage current = userGlobalInfo[msg.sender];
        
        if(refer.referrals[msg.sender] > 0){
            refer.referrals[msg.sender] = refer.referrals[msg.sender] + _amount;
            refer.globalRefAmount = refer.globalRefAmount + _amount;
        } else {
            refer.referrals[msg.sender] = refer.referrals[msg.sender] + _amount;
            refer.totalReferals = refer.totalReferals + 1;
            refer.globalRefAmount = refer.globalRefAmount + _amount;
        }

        
        // current.globalAmount = current.globalAmount + _amount*(userDepFee)/(100);
        current.globalAmount = current.globalAmount + (_amount-(_amount*(userDepFee)/(10000)));
        
        updatePool(_pid);
        _harvest(_pid);
        
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        pool.depositAmount += _amount;

        if (user.amount == 0) {
            user.rewardDebtAtBlock = block.number;
        }
        user.amount = user.amount+(_amount-(_amount*(userDepFee)/(10000)));
        user.rewardDebt = user.amount*(pool.accBavaPerShare)/(1e12);
        devr.amount = devr.amount+(_amount-(_amount*(devDepFee)/(10000)));
        devr.rewardDebt = devr.amount*(pool.accBavaPerShare)/(1e12);
        emit Deposit(msg.sender, _pid, _amount);
		if(user.firstDepositBlock > 0){
		} else {
			user.firstDepositBlock = block.number;
		}
		user.lastDepositBlock = block.number;
    }
    
  // Withdraw LP tokens from BavaMasterFarmer.
    function withdraw(uint256 _pid, uint256 _amount, address _ref) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 lpBal = pool.depositAmount;
        // uint256 lpBal = pool.lpToken.balanceOf(address(this));
        require(lpBal >= user.amount, "withdraw amount > farmBalance");
        UserGlobalInfo storage refer = userGlobalInfo[_ref];
        UserGlobalInfo storage current = userGlobalInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        if(_ref != address(0)){
                refer.referrals[msg.sender] = refer.referrals[msg.sender] - _amount;
                refer.globalRefAmount = refer.globalRefAmount - _amount;
            }
        current.globalAmount = current.globalAmount - _amount;
        
        updatePool(_pid);
        _harvest(_pid);

        if(_amount > 0) {
            user.amount = user.amount-(_amount);
			if(user.lastWithdrawBlock > 0){
				user.blockdelta = block.number - user.lastWithdrawBlock; }
			else {
				user.blockdelta = block.number - user.firstDepositBlock;
			}
			if(user.blockdelta == blockDeltaStartStage[0] || block.number == user.lastDepositBlock){
				//25% fee for withdrawals of LP tokens in the same block this is to prevent abuse from flashloans
                pool.depositAmount -= (_amount*(userFeeStage[0])/(100));
                pool.depositAmount -= (_amount*(devFeeStage[0])/(100));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[0])/(100));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[0])/(100));
			} else if (user.blockdelta >= blockDeltaStartStage[1] && user.blockdelta <= blockDeltaEndStage[0]){
				//8% fee if a user deposits and withdraws in under between same block and 59 minutes.
                pool.depositAmount -= (_amount*(userFeeStage[1])/(100));
                pool.depositAmount -= (_amount*(devFeeStage[1])/(100));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[1])/(100));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[1])/(100));
			} else if (user.blockdelta >= blockDeltaStartStage[2] && user.blockdelta <= blockDeltaEndStage[1]){
				//4% fee if a user deposits and withdraws after 1 hour but before 1 day.
                pool.depositAmount -= (_amount*(userFeeStage[2])/(100));
                pool.depositAmount -= (_amount*(devFeeStage[2])/(100));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[2])/(100));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[2])/(100));
			} else if (user.blockdelta >= blockDeltaStartStage[3] && user.blockdelta <= blockDeltaEndStage[2]){
				//2% fee if a user deposits and withdraws between after 1 day but before 3 days.
                pool.depositAmount -= (_amount*(userFeeStage[3])/(100));
                pool.depositAmount -= (_amount*(devFeeStage[3])/(100));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[3])/(100));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[3])/(100));
			} else if (user.blockdelta >= blockDeltaStartStage[4] && user.blockdelta <= blockDeltaEndStage[3]){
				//1% fee if a user deposits and withdraws after 3 days but before 5 days.
                pool.depositAmount -= (_amount*(userFeeStage[4])/(100));
                pool.depositAmount -= (_amount*(devFeeStage[4])/(100));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[4])/(100));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[4])/(100));
			}  else if (user.blockdelta >= blockDeltaStartStage[5] && user.blockdelta <= blockDeltaEndStage[4]){
				//0.5% fee if a user deposits and withdraws if the user withdraws after 5 days but before 2 weeks.
                pool.depositAmount -= (_amount*(userFeeStage[5])/(1000));
                pool.depositAmount -= (_amount*(devFeeStage[5])/(1000));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[5])/(1000));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[5])/(1000));
			} else if (user.blockdelta >= blockDeltaStartStage[6] && user.blockdelta <= blockDeltaEndStage[5]){
				//0.25% fee if a user deposits and withdraws after 2 weeks.
                pool.depositAmount -= (_amount*(userFeeStage[6])/(10000));
                pool.depositAmount -= (_amount*(devFeeStage[6])/(10000));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[6])/(10000));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[6])/(10000));
			} else if (user.blockdelta > blockDeltaStartStage[7]) {
				//0.1% fee if a user deposits and withdraws after 4 weeks.
                pool.depositAmount -= (_amount*(userFeeStage[7])/(10000));
                pool.depositAmount -= (_amount*(devFeeStage[7])/(10000));
				pool.lpToken.safeTransfer(address(msg.sender), _amount*(userFeeStage[7])/(10000));
				pool.lpToken.safeTransfer(address(devaddr), _amount*(devFeeStage[7])/(10000));
			}
		user.rewardDebt = user.amount*(pool.accBavaPerShare)/(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
		user.lastWithdrawBlock = block.number;
			}
        }


    // Withdraw without caring about rewards. EMERGENCY ONLY. This has the same 25% fee as same block withdrawals to prevent abuse of thisfunction.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 lpBal = pool.depositAmount;
        // uint256 lpBal = pool.lpToken.balanceOf(address(this));
        require(lpBal >= user.amount, "withdraw amount > farmBalance");
        //reordered from Sushi function to prevent risk of reentrancy
        uint256 amountToSend = user.amount*(75)/(100);
        uint256 devToSend = user.amount*(25)/(100);
        user.amount = 0;
        user.rewardDebt = 0;
        pool.depositAmount -= amountToSend;
        pool.depositAmount -= devToSend;
        pool.lpToken.safeTransfer(address(msg.sender), amountToSend);
        pool.lpToken.safeTransfer(address(devaddr), devToSend);
        emit EmergencyWithdraw(msg.sender, _pid, amountToSend);

    }

    // Safe Bava transfer function, just in case if rounding error causes pool to not have enough Bavas.
    function safeBavaTransfer(address _to, uint256 _amount) internal {
        uint256 BavaBal = Bava.balanceOf(address(this));
        if (_amount > BavaBal) {
            Bava.transfer(_to, BavaBal);
        } else {
            Bava.transfer(_to, _amount);
        }
    }
    
    // Borrower restaking lp token to compound reward.
    function reinvest(uint256 _pid, uint256 _amount, address _to) public onlyOwner {
        PoolInfo storage pool = poolInfo[_pid];

        uint256 lpBal = pool.depositAmount;
        // uint256 lpBal = pool.lpToken.balanceOf(address(this));
        require(lpBal >= _amount, "lend amount > farmBalance");

        pool.lendAmount +=  _amount;
        pool.depositAmount -= _amount;
        pool.lpToken.safeTransfer(address(_to), _amount);
        
        emit Reinvest(msg.sender, _pid, _amount);
    }

    function returnReinvest(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        uint256 _borrowedAmount = pool.lendAmount;
        require(_amount <= _borrowedAmount, "return Amount > lend amount");
        
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        pool.depositAmount += _amount;
        pool.lendAmount -=  _amount;
        
        emit ReturnReinvest(msg.sender, _pid, _amount);
    }

    // Update dev address by the previous dev.
    function devUpdate(address _devaddr) public onlyAuthorized {
        devaddr = _devaddr;
    }
    
    // Update Finish Bonus Block
    function bonusFinishUpdate(uint256 _newFinish) public onlyAuthorized {
        FINISH_BONUS_AT_BLOCK = _newFinish;
    }
    
    // Update Halving At Block
    function halvingUpdate(uint256[] memory _newHalving) public onlyAuthorized {
        HALVING_AT_BLOCK = _newHalving;
    }
    
    // Update FutureTreasuryaddr
    function ftUpdate(address _newFT) public onlyAuthorized {
       futureTreasuryaddr = _newFT;
    }
    
    // Update adrfundaddr
    function adrUpdate(address _newAdr) public onlyAuthorized {
       advisoraddr = _newAdr;
    }
    
    // Update founderaddr
    function founderUpdate(address _newFounder) public onlyAuthorized {
       founderaddr = _newFounder;
    }
    
    // Update Reward Per Block
    function rewardUpdate(uint256 _newReward) public onlyAuthorized {
       REWARD_PER_BLOCK = _newReward;
    }
    
    // Update Rewards Mulitplier Array
    function rewardMulUpdate(uint256[] memory _newMulReward) public onlyAuthorized {
       REWARD_MULTIPLIER = _newMulReward;
    }
    
    // Update % lock for general users
    function lockUpdate(uint _newlock) public onlyAuthorized {
       PERCENT_LOCK_BONUS_REWARD = _newlock;
    }
    
    // Update % lock for dev
    function lockdevUpdate(uint _newdevlock) public onlyAuthorized {
       PERCENT_FOR_DEV = _newdevlock;
    }
    
    // Update % lock for FT
    function lockftUpdate(uint _newftlock) public onlyAuthorized {
       PERCENT_FOR_FT = _newftlock;
    }
    
    // Update % lock for ADR
    function lockadrUpdate(uint _newadrlock) public onlyAuthorized {
       PERCENT_FOR_ADR = _newadrlock;
    }
    
    // Update % lock for Founders
    function lockfounderUpdate(uint _newfounderlock) public onlyAuthorized {
       PERCENT_FOR_FOUNDERS = _newfounderlock;
    }
    
    // Update START_BLOCK
    function starblockUpdate(uint _newstarblock) public onlyAuthorized {
       START_BLOCK = _newstarblock;
    }

    function getNewRewardPerBlock(uint256 pid1) public view returns (uint256) {
        uint256 multiplier = getMultiplier(block.number -1, block.number);
        if (pid1 == 0) {
            return multiplier*(REWARD_PER_BLOCK);
        }
        else {
            return multiplier
                *(REWARD_PER_BLOCK)
                *(poolInfo[pid1 - 1].allocPoint)
                /(totalAllocPoint);
        }
    }
	
	function userDelta(uint256 _pid) public view returns (uint256) {
        UserInfo storage user = userInfo[_pid][msg.sender];
		if (user.lastWithdrawBlock > 0) {
			uint256 estDelta = block.number - user.lastWithdrawBlock;
			return estDelta;
		} else {
		    uint256 estDelta = block.number - user.firstDepositBlock;
			return estDelta;
		}
	}
	
	function reviseWithdraw(uint _pid, address _user, uint256 _block) public onlyAuthorized() {
	   UserInfo storage user = userInfo[_pid][_user];
	   user.lastWithdrawBlock = _block;
	    
	}
	
	function reviseDeposit(uint _pid, address _user, uint256 _block) public onlyAuthorized() {
	   UserInfo storage user = userInfo[_pid][_user];
	   user.firstDepositBlock = _block;
	    
	}
	
	function setStageStarts(uint[] memory _blockStarts) public onlyAuthorized() {
        blockDeltaStartStage = _blockStarts;
    }
    
    function setStageEnds(uint[] memory _blockEnds) public onlyAuthorized() {
        blockDeltaEndStage = _blockEnds;
    }
    
    function setUserFeeStage(uint[] memory _userFees) public onlyAuthorized() {
        userFeeStage = _userFees;
    }
    
    function setDevFeeStage(uint[] memory _devFees) public onlyAuthorized() {
        devFeeStage = _devFees;
    }
    
    function setDevDepFee(uint _devDepFees) public onlyAuthorized() {
        devDepFee = _devDepFees;
    }
    
    function setUserDepFee(uint _usrDepFees) public onlyAuthorized() {
        userDepFee = _usrDepFees;
    }



}