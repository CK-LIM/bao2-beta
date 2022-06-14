import React, { Component } from 'react'
import Web3 from 'web3'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WalletConnectProvider from "@walletconnect/web3-provider";

import LpToken from '../abis/Interface/LpToken.json'
import IPancakePair from '../abis/Interface/IPancakePair.json'
import BavaToken from '../abis/BavaToken.json'
import BavaMasterFarmer from '../abis/BavaMasterFarmerV2.json'
import BavaMasterFarmerV1 from '../abis/BavaMasterFarmerV1.json'
import BavaMasterFarmerV2_2 from '../abis/BavaMasterFarmerV2_2.json'
import BavaMasterFarmerV2_3 from '../abis/BavaMasterFarmerV2_3.json'
import BavaCompoundPool from '../abis/BavaCompoundPool.json'
import BavaCompoundPoolVariable from '../abis/BavaCompoundPoolVariable.json'
import BavaAirdrop from '../abis/BavaAirdrop.json'
import StakingRewards from '../abis/StakingRewards.json'
import CollateralVault from '../abis/CollateralVault.json'
import SyntheticPool from '../abis/SyntheticPool.json'
import AvaxChainlinkOracle from '../abis/AvaxChainlinkOracle.json'
import SystemCoin from '../abis/SystemCoin.json'
import ChainlinkAggreagator from '../abis/ChainlinkAggreagator.json'
import WrappedbSynthetic from '../abis/WrappedbSynthetic.json'

import Farm from './tokens_config/farm.json'
import FarmV1 from './tokens_config/farmV1.json'
import FarmV2_2 from './tokens_config/farmV2_2.json'
import FarmV2_3 from './tokens_config/farmV2_3.json'
import CollVault from './tokens_config/collVault.json'
import SynPool from './tokens_config/synPool.json'
import AirdropList from './tokens_config/airdrop.json'

import Navb from './Navbar'
import NavbMenu from './NavbarMenu'
import Main from './Main'
import Menu from './Menu'
import MenuV2 from './MenuV2'
import Kyber from './Kyber'
import Stake from './Stake'
import TraderJoe from './TraderJoe'
import TraderJoeV2 from './TraderJoeV2'
import Airdrop from './Airdrop'
import LitePaper from './LitePaper'
import Synthetic from './Synthetic'
import Collateral from './Collateral'
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadFarmData()
    await this.loadBlockchainData()
    this.loadTVLAPR()
    while ((this.state.wallet || this.state.walletConnect) == true) {
      await this.loadBlockchainUserData()
      await this.delay(5000);
    }
  }

  async loadFarmData() {
    const farm = Farm.farm
    this.setState({ farm })
    const farmBava = FarmV1.farm
    this.setState({ farmBava })
    const farmV2_2 = FarmV2_2.farm
    this.setState({ farmV2_2 })
    const farmV2_3 = FarmV2_3.farm
    this.setState({ farmV2_3 })
    const collVault = CollVault.vault
    this.setState({ collVault })
    const synPool = SynPool.pool
    this.setState({ synPool })
    const airdropList = AirdropList
    this.setState({ airdropList })
  }


  async loadBlockchainData() {
    const web3Ava = window.web3Ava
    const networkId = process.env.REACT_APP_networkid
    this.setState({ networkId })
    const farmNetworkId = process.env.REACT_APP_farmnetworkid
    this.setState({ farmNetworkId })
    const farmNetwork = process.env.REACT_APP_farmnetwork
    this.setState({ farmNetwork })

    const bavaContract = 'https://snowtrace.io/address/0xb5a054312a73581a3c0fed148b736911c02f4539'
    this.setState({ bavaContract })

    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.setState({ chainId })

      if (this.state.chainId == "0x61") {
        this.setState({ networkName: "BSC Testnet" })
      } else if (this.state.chainId == "0x38") {
        this.setState({ networkName: "BSC" })
      } else if (this.state.chainId == "0x1") {
        this.setState({ networkName: "Ethereum" })
      } else if (this.state.chainId == "0x3") {
        this.setState({ networkName: "Ropsten" })
      } else if (this.state.chainId == "0x4") {
        this.setState({ networkName: "Rinkeby" })
      } else if (this.state.chainId == "0x2a") {
        this.setState({ networkName: "Kovan" })
      } else if (this.state.chainId == "0x89") {
        this.setState({ networkName: "Polygon" })
      } else if (this.state.chainId == "0x13881") {
        this.setState({ networkName: "Mumbai" })
      } else if (this.state.chainId == "0xa869") {
        this.setState({ networkName: "Fuji" })
      } else if (this.state.chainId == "0xa86a") {
        this.setState({ networkName: "Avalanche" })
      }

      window.ethereum.on('chainChanged', this.handleChainChanged);
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);

    } else {
      this.setState({ chainID: "0x" })
      this.setState({ networkName: "Unavailable" })
    }

    // Load contract
    const bavaToken = new web3Ava.eth.Contract(BavaToken.abi, process.env.REACT_APP_bavatoken_address)
    const bavaMasterFarmer = new web3Ava.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
    const bavaMasterFarmerV1 = new web3Ava.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
    const bavaAirdrop = new web3Ava.eth.Contract(BavaAirdrop.abi, process.env.REACT_APP_airdrop_address)
    const bavaStake = new web3Ava.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    const bavaMasterFarmerV2_2 = new web3Ava.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
    const bavaMasterFarmerV2_3 = new web3Ava.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
    const collateralVault = new web3Ava.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
    const syntheticPool = new web3Ava.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
    const avaxChainlinkOracle = new web3Ava.eth.Contract(AvaxChainlinkOracle.abi, process.env.REACT_APP_chainlink_brt_address)
    const systemCoin = new web3Ava.eth.Contract(SystemCoin.abi, process.env.REACT_APP_usb_address)

    this.setState({ bavaToken })
    this.setState({ bavaMasterFarmer })
    this.setState({ bavaMasterFarmerV1 })
    this.setState({ bavaAirdrop })
    this.setState({ bavaStake })
    this.setState({ bavaMasterFarmerV2_2 })
    this.setState({ bavaMasterFarmerV2_3 })
    this.setState({ collateralVault })
    this.setState({ syntheticPool })
    this.setState({ avaxChainlinkOracle })
    this.setState({ systemCoin })

    let response0 = this.loadPoolLength()
    let response1 = this.loadBavaPoolLength()
    let response2 = this.loadAirdropIteration()
    let response3 = this.loadAirdropAmount()
    let response5 = this.loadAirdropStart()
    let response6 = this.loadAirdropEnd()
    let response7 = this.loadTotalStake()
    let response8 = this.loadRewardRate()
    let response9 = this.loadPoolLengthV2_2()
    let response10 = this.loadPoolLengthV2_3()
    let response11 = this.loadCollateralPoolLength()
    let response12 = this.loadSystemCoinSupply()
    let response13 = this.loadSyntheticPoolLength()

    let poolLength = await response0
    let bavaPoolLength = await response1
    let airdropIteration = await response2
    let airdropAmount = await response3
    let airdropStart = await response5
    let airdropEnd = await response6
    let totalStake = await response7
    let rewardRate = await response8
    let poolLengthV2_2 = await response9
    let poolLengthV2_3 = await response10
    let collateralPoolLength = await response11
    let systemCoinSupply = await response12
    let synPoolLength = await response13

    this.setState({ poolLength })
    this.setState({ bavaPoolLength })
    this.setState({ airdropIteration })
    this.setState({ airdropAmount })
    this.setState({ totalStake })
    this.setState({ rewardRate })
    this.setState({ airdropStart })
    this.setState({ airdropEnd })
    this.setState({ poolLengthV2_2 })
    this.setState({ poolLengthV2_3 })
    this.setState({ collateralPoolLength })
    this.setState({ systemCoinSupply })
    this.setState({ synPoolLength })

    if (this.state.wallet == false && this.state.walletConnect == false) {

      let bavaPoolSegmentInfo = [[], []]
      let poolSegmentInfo = [[], []]
      let poolSegmentInfoV2_2 = [[], []]
      let poolSegmentInfoV2_3 = [[], [], []]
      let collateralPoolSegmentInfo = []

      let returnRatio = [[], []]
      let bavaReturnRatio = [[], []]
      let returnRatioV2_2 = [[], []]
      let returnRatioV2_3 = [[], [], []]
      let reinvestAmount = [[], [], []]
      let n = 0   // poolV2
      let b = 0   // bavaPoolV1
      let c = 0   // poolV2_2
      let d = 0   // poolV2_3

      let bavaLpTokenPairsymbols = []
      let lpTokenPairsymbols = []
      let lpTokenPairsymbolsV2_2 = []
      let lpTokenPairsymbolsV2_3 = []

      let collTokensymbols = []
      let collTokenAddresses = []
      let collBRTValue = []
      let collPoolRemainingAsset = []

      let bavaLpTokenAddresses = []
      let lpTokenAddresses = []
      let lpTokenAddressesV2_2 = []
      let lpTokenAddressesV2_3 = []

      let synTokensymbols = []
      let synTokenAddresses = []
      let synPoolSegmentInfo = []
      let synOraclePrice = []
      let synPoolPrice = []
      let synTotalSupply = []

      let returnRatioArray = this.state.myJsonMongo["ReturnRatio"]
      let returnRatioArrayV2_2 = this.state.myJsonMongo["ReturnRatioV2_2"]
      let returnRatioArrayV2_3 = this.state.myJsonMongo["ReturnRatioV2_3"]

      let totalpendingReward = "0"
      let bavaTokenBalance = "0"
      let pendingSegmentReward = [[], []]

      this.setState({ bavaTokenBalance: bavaTokenBalance.toString() })
      this.setState({ totalpendingReward: totalpendingReward.toLocaleString('fullwide', { useGrouping: false }) })
      this.setState({ pendingSegmentReward })

      let responseV2_3 = []
      for (let i = 0; i < this.state.poolLengthV2_3; i++) {
        responseV2_3[i] = this.loadFarmReinvest(i)
      }

      let collPoolResponse1 = []
      let collPoolResponse2 = []
      for (let i = 0; i < this.state.collateralPoolLength; i++) {
        collPoolResponse1[i] = this.loadCollateralBRTValue(i)
        collPoolResponse2[i] = this.loadPoolCollateralAsset(i)
      }

      let synPoolResponse1 = []
      let synPoolResponse2 = []
      let synPoolResponse3 = []
      for (let i = 0; i < this.state.synPoolLength; i++) {
        synPoolResponse1[i] = this.loadSyntheticValue(i)
        synPoolResponse2[i] = this.loadSyntheticTotalSupply(i)
      }
      synPoolResponse3 = this.loadSyntheticPoolPrice()

      for (let i = 0; i < this.state.poolLengthV2_3; i++) {
        let poolInfo = this.state.farmV2_3[i]
        let lpTokenAddress = poolInfo.lpAddresses[farmNetworkId]
        let lpTokenPairsymbol = poolInfo.lpTokenPairsymbol
        lpTokenPairsymbolsV2_3[i] = lpTokenPairsymbol
        lpTokenAddressesV2_3[i] = lpTokenAddress
        if (lpTokenPairsymbol == "PGL" || lpTokenPairsymbol == "PNG") {
          poolSegmentInfoV2_3[0][d] = poolInfo
          returnRatioV2_3[0][d] = returnRatioArrayV2_3[d]["returnRatio"]
          reinvestAmount[0][d] = await responseV2_3[i]
          d += 1
        } else if (lpTokenPairsymbol == "JLP") {
          poolSegmentInfoV2_3[1][d] = poolInfo
          returnRatioV2_3[1][d] = returnRatioArrayV2_3[d]["returnRatio"]
          reinvestAmount[1][d] = await responseV2_3[i]
          d += 1
        } else {
          poolSegmentInfoV2_3[2][d] = poolInfo
          returnRatioV2_3[2][d] = returnRatioArrayV2_3[d]["returnRatio"]
          reinvestAmount[2][d] = await responseV2_3[i]
          d += 1
        }
      }

      for (let i = 0; i < this.state.bavaPoolLength; i++) {
        let bavaPoolInfo = this.state.farmBava[i]
        let bavaLpTokenAddress = bavaPoolInfo.lpAddresses[farmNetworkId]
        let bavaLpTokenPairsymbol = bavaPoolInfo.lpTokenPairsymbol
        bavaLpTokenPairsymbols[i] = bavaLpTokenPairsymbol
        bavaLpTokenAddresses[i] = bavaLpTokenAddress

        if (bavaLpTokenPairsymbol == "PGL" || bavaLpTokenPairsymbol == "PNG") {
          bavaPoolSegmentInfo[0][b] = bavaPoolInfo
          bavaReturnRatio[0][b] = 1
          b += 1
        } else {
          bavaPoolSegmentInfo[1][b] = bavaPoolInfo
          bavaReturnRatio[1][b] = 1
          b += 1
        }
      }

      for (let i = 0; i < this.state.poolLength; i++) {
        let poolInfo = this.state.farm[i]
        let lpTokenAddress = poolInfo.lpAddresses[farmNetworkId]
        let lpTokenPairsymbol = poolInfo.lpTokenPairsymbol
        lpTokenPairsymbols[i] = lpTokenPairsymbol
        lpTokenAddresses[i] = lpTokenAddress

        if (lpTokenPairsymbol == "PGL" || lpTokenPairsymbol == "PNG") {
          poolSegmentInfo[0][n] = poolInfo
          returnRatio[0][n] = returnRatioArray[n]["returnRatio"]
          n += 1
        } else {
          poolSegmentInfo[1][n] = poolInfo
          returnRatio[1][n] = returnRatioArray[n]["returnRatio"]
          n += 1
        }
      }

      for (let i = 0; i < this.state.poolLengthV2_2; i++) {
        let poolInfo = this.state.farmV2_2[i]
        let lpTokenAddress = poolInfo.lpAddresses[farmNetworkId]
        let lpTokenPairsymbol = poolInfo.lpTokenPairsymbol
        lpTokenPairsymbolsV2_2[i] = lpTokenPairsymbol
        lpTokenAddressesV2_2[i] = lpTokenAddress

        if (lpTokenPairsymbol == "PGL" || lpTokenPairsymbol == "PNG") {
          poolSegmentInfoV2_2[0][c] = poolInfo
          returnRatioV2_2[0][c] = returnRatioArrayV2_2[c]["returnRatio"]
          c += 1
        } else {
          poolSegmentInfoV2_2[1][c] = poolInfo
          returnRatioV2_2[1][c] = returnRatioArrayV2_2[c]["returnRatio"]
          c += 1
        }
      }

      for (let i = 0; i < this.state.collateralPoolLength; i++) {
        let poolInfo = this.state.collVault[i]
        let lpTokenAddress = poolInfo.lpAddresses[farmNetworkId]
        let lpTokenPairsymbol = poolInfo.lpTokenPairsymbol

        collTokensymbols[i] = lpTokenPairsymbol
        collTokenAddresses[i] = lpTokenAddress
        collateralPoolSegmentInfo[i] = poolInfo
        collBRTValue[i] = await collPoolResponse1[i]
        collPoolRemainingAsset[i] = await collPoolResponse2[i]
      }

      for (let i = 0; i < this.state.synPoolLength; i++) {
        let poolInfo = this.state.synPool[i]
        let syntokenAddress = poolInfo.synTokenAddresses[farmNetworkId]
        let synTokenPairsymbol = poolInfo.synTokenPairsymbol

        synTokensymbols[i] = synTokenPairsymbol
        synTokenAddresses[i] = syntokenAddress
        synPoolSegmentInfo[i] = poolInfo
        synOraclePrice[i] = await synPoolResponse1[i]
        synTotalSupply[i] = await synPoolResponse2[i]
      }
      synPoolPrice = await synPoolResponse3

      this.setState({ poolSegmentInfo })
      this.setState({ lpTokenPairsymbols })
      this.setState({ lpTokenAddresses })
      this.setState({ returnRatio })

      this.setState({ poolSegmentInfoV2_2 })
      this.setState({ lpTokenPairsymbolsV2_2 })
      this.setState({ lpTokenAddressesV2_2 })
      this.setState({ returnRatioV2_2 })

      this.setState({ poolSegmentInfoV2_3 })
      this.setState({ lpTokenPairsymbolsV2_3 })
      this.setState({ lpTokenAddressesV2_3 })
      this.setState({ returnRatioV2_3 })

      this.setState({ bavaPoolSegmentInfo })
      this.setState({ bavaLpTokenPairsymbols })
      this.setState({ bavaLpTokenAddresses })
      this.setState({ bavaReturnRatio })

      this.setState({ collateralPoolSegmentInfo })
      this.setState({ collTokensymbols })
      this.setState({ collTokenAddresses })
      this.setState({ collBRTValue })
      this.setState({ collPoolRemainingAsset })

      this.setState({ synPoolSegmentInfo })
      this.setState({ synTokensymbols })
      this.setState({ synTokenAddresses })
      this.setState({ synOraclePrice })
      this.setState({ synPoolPrice })
      this.setState({ synTotalSupply })

      this.setState({ reinvestAmount })
      this.setState({ farmloading: true })
    }
  }
  // ############ Load User blockchain data #############################################################################################################

  async loadBlockchainUserData() {
    // Load bavaToken
    let userResponse0 = this.loadBavaTokenBalance()
    let userResponse1 = this.loadLockedBavaTokenBalance()
    let userResponse2 = this.loadBavaTokenAllowance()
    let userResponse3 = this.loadEarnedAmount()
    let userResponse4 = this.loadStakeAmount()
    let userResponse5 = this.loadSystemCoinBalance()
    let userResponse6 = this.loadSystemCoinCollAllowance()
    let userResponse7 = this.loadSystemCoinSynAllowance()

    let bavaTokenBalance = await userResponse0
    let lockedBavaTokenBalance = await userResponse1
    let bavaTokenAllowance = await userResponse2
    let earnedAmount = await userResponse3
    let stakeAmount = await userResponse4
    let systemCoinBalance = await userResponse5
    let systemCoinCollAllowance = await userResponse6
    let systemCoinSynAllowance = await userResponse7

    this.setState({ bavaTokenBalance: bavaTokenBalance.toString() })
    this.setState({ lockedBavaTokenBalance: lockedBavaTokenBalance.toString() })
    this.setState({ bavaTokenAllowance: bavaTokenAllowance.toString() })
    this.setState({ stakeAmount: stakeAmount.amount })
    this.setState({ earnedAmount })
    this.setState({ systemCoinBalance: systemCoinBalance.toString() })
    this.setState({ systemCoinCollAllowance: systemCoinCollAllowance.toString() })
    this.setState({ systemCoinSynAllowance })

    let poolSegmentInfo = [[], []]
    let poolSegmentInfoV2_2 = [[], []]
    // let poolSegmentInfoV2_3 = [[], []]
    let bavaPoolSegmentInfo = [[], []]
    let totalpendingReward = 0
    let totalPendingDebt = 0

    let userSegmentInfo = [[], []]
    let lpBalanceAccount = [[], []]
    let lpSegmentAllowance = [[], []]
    let pendingSegmentReward = [[], []]

    let userSegmentInfoV2_2 = [[], []]
    let lpBalanceAccountV2_2 = [[], []]
    let lpSegmentAllowanceV2_2 = [[], []]
    let pendingSegmentRewardV2_2 = [[], []]

    let userSegmentInfoV2_3 = [[], [], []]
    let lpBalanceAccountV2_3 = [[], [], []]
    let lpSegmentAllowanceV2_3 = [[], [], []]
    let pendingSegmentRewardV2_3 = [[], [], []]

    let bavaUserSegmentInfo = [[], []]
    let bavaLpBalanceAccount = [[], []]
    let bavaLpSegmentAllowance = [[], []]
    let bavaPendingSegmentReward = [[], []]

    let collUserSegmentInfo = []
    let collBRTBalanceAccount = []
    let collBRTSegmentAllowance = []
    let collDebtBalance = []
    let collMaxBorrowAmount = []
    let collRatio = []

    let synUserBalance = []
    let synUserAllowance = []
    let synUserOpenOrderLength = []
    let synUserOrderInfo = []

    let b = 0
    let n = 0
    let c = 0
    let d = 0
    let i = 0

    let response0 = []
    let response1 = []
    let response2 = []
    let response3 = []
    let response0V2_2 = []
    let response1V2_2 = []
    let response2V2_2 = []
    let response3V2_2 = []
    let response0V2_3 = []
    let response1V2_3 = []
    let response2V2_3 = []
    let response3V2_3 = []
    let bavaResponse0 = []
    let bavaResponse1 = []
    let bavaResponse2 = []
    let bavaResponse3 = []
    let collateralResponse0 = []
    let collateralResponse1 = []
    let collateralResponse2 = []
    let collateralResponse3 = []
    let collateralResponse4 = []
    let synResponse0 = []
    let synResponse1 = []
    let synResponse2 = [[], []]

    for (i = 0; i < this.state.poolLength; i++) {
      response0[i] = this.loadUserInfo(i)
      response1[i] = this.loadUserInfo1(i)
      response2[i] = this.loadUserInfo2(i)
      response3[i] = this.loadUserInfo3(i)
    }

    for (i = 0; i < this.state.poolLengthV2_2; i++) {
      response0V2_2[i] = this.loadUserInfoV2_2(i)
      response1V2_2[i] = this.loadUserInfo1V2_2(i)
      response2V2_2[i] = this.loadUserInfo2V2_2(i)
      response3V2_2[i] = this.loadUserInfo3V2_2(i)
    }

    for (i = 0; i < this.state.poolLengthV2_3; i++) {
      response0V2_3[i] = this.loadUserInfoV2_3(i)
      response1V2_3[i] = this.loadUserInfo1V2_3(i)
      response2V2_3[i] = this.loadUserInfo2V2_3(i)
      response3V2_3[i] = this.loadUserInfo3V2_3(i)
    }

    for (i = 0; i < this.state.bavaPoolLength; i++) {
      bavaResponse0[i] = this.loadBavaUserInfo(i)
      bavaResponse1[i] = this.loadBavaUserInfo1(i)
      bavaResponse2[i] = this.loadBavaUserInfo2(i)
      bavaResponse3[i] = this.loadBavaUserInfo3(i)
    }

    for (i = 0; i < this.state.collateralPoolLength; i++) {
      collateralResponse0[i] = this.loadCollateralUserInfo(i)     // collateralBalance
      collateralResponse1[i] = this.loadCollateralUserInfo1(i)    // userbrtBalance
      collateralResponse2[i] = this.loadCollateralUserInfo2(i)    // brtAllowance
      collateralResponse3[i] = this.loadCollateralUserInfo3(i)    // debtBalance
      collateralResponse4[i] = this.loadCollateralUserInfo4(i)    // RemainingMaxBorrowAmount
    }

    for (i = 0; i < this.state.synPoolLength; i++) {
      synResponse0[i] = this.loadSynUserInfo(i)     // synTokenBalance
      synResponse1[i] = this.loadSynUserInfo1(i)    // synAllowance
      synResponse2[i] = this.loadSynUserInfo2(i)    // synPool userOpenOrderLength, user Order info
    }

    let synPoolResponse3 = []
    let synPoolPrice = []
    synPoolResponse3 = this.loadSyntheticPoolPrice()
    synPoolPrice = await synPoolResponse3
    this.setState({ synPoolPrice })
    // **********************************************************************

    for (i = 0; i < this.state.poolLength; i++) {
      if (this.state.lpTokenPairsymbols[i] == "PGL" || this.state.lpTokenPairsymbols[i] == "PNG") {
        userSegmentInfo[0][n] = (await response0[i]).amount
        poolSegmentInfo[0][n] = this.state.farm[i]
        lpBalanceAccount[0][n] = await response1[i]
        lpSegmentAllowance[0][n] = await response2[i]
        pendingSegmentReward[0][n] = await response3[i]
        n += 1
      } else {
        userSegmentInfo[1][n] = (await response0[i]).amount
        poolSegmentInfo[1][n] = this.state.farm[i]
        lpBalanceAccount[1][n] = await response1[i]
        lpSegmentAllowance[1][n] = await response2[i]
        pendingSegmentReward[1][n] = await response3[i]
        n += 1
      }
      totalpendingReward += parseInt(await response3[i])
    }

    for (i = 0; i < this.state.poolLengthV2_2; i++) {
      if (this.state.lpTokenPairsymbolsV2_2[i] == "PGL" || this.state.lpTokenPairsymbolsV2_2[i] == "PNG") {
        userSegmentInfoV2_2[0][c] = (await response0V2_2[i]).amount
        poolSegmentInfoV2_2[0][c] = this.state.farmV2_2[i]
        lpBalanceAccountV2_2[0][c] = await response1V2_2[i]
        lpSegmentAllowanceV2_2[0][c] = await response2V2_2[i]
        pendingSegmentRewardV2_2[0][c] = await response3V2_2[i]
        c += 1
      } else {
        userSegmentInfoV2_2[1][c] = (await response0V2_2[i]).amount
        poolSegmentInfoV2_2[1][c] = this.state.farmV2_2[i]
        lpBalanceAccountV2_2[1][c] = await response1V2_2[i]
        lpSegmentAllowanceV2_2[1][c] = await response2V2_2[i]
        pendingSegmentRewardV2_2[1][c] = await response3V2_2[i]
        c += 1
      }
      totalpendingReward += parseInt(await response3V2_2[i])
    }

    for (i = 0; i < this.state.poolLengthV2_3; i++) {
      if (this.state.lpTokenPairsymbolsV2_3[i] == "PGL" || this.state.lpTokenPairsymbolsV2_3[i] == "PNG") {
        userSegmentInfoV2_3[0][d] = await response0V2_3[i]
        lpBalanceAccountV2_3[0][d] = await response1V2_3[i]
        lpSegmentAllowanceV2_3[0][d] = await response2V2_3[i]
        pendingSegmentRewardV2_3[0][d] = await response3V2_3[i]
        d += 1
      } else if (this.state.lpTokenPairsymbolsV2_3[i] == "JLP") {
        userSegmentInfoV2_3[1][d] = await response0V2_3[i]
        lpBalanceAccountV2_3[1][d] = await response1V2_3[i]
        lpSegmentAllowanceV2_3[1][d] = await response2V2_3[i]
        pendingSegmentRewardV2_3[1][d] = await response3V2_3[i]
        d += 1
      } else {
        userSegmentInfoV2_3[2][d] = await response0V2_3[i]
        lpBalanceAccountV2_3[2][d] = await response1V2_3[i]
        lpSegmentAllowanceV2_3[2][d] = await response2V2_3[i]
        pendingSegmentRewardV2_3[2][d] = await response3V2_3[i]
      }
      totalpendingReward += parseInt(await response3V2_3[i])
    }

    for (i = 0; i < this.state.collateralPoolLength; i++) {
      collUserSegmentInfo[i] = await collateralResponse0[i]
      collBRTBalanceAccount[i] = await collateralResponse1[i]
      collBRTSegmentAllowance[i] = await collateralResponse2[i]
      collDebtBalance[i] = await collateralResponse3[i]
      collMaxBorrowAmount[i] = await collateralResponse4[i]
      collRatio[i] = parseFloat(window.web3Ava.utils.fromWei(collUserSegmentInfo[i].toLocaleString('en-US'), 'Ether')) * parseFloat(window.web3Ava.utils.fromWei(this.state.collBRTValue[i].toLocaleString('en-US'), 'Ether')) / parseFloat(window.web3Ava.utils.fromWei(collDebtBalance.toLocaleString('en-US'), 'Ether')) * 100
      if (isNaN(collRatio[i])) {
        collRatio[i] = 1 / 0
      }

      totalPendingDebt += parseInt(await collateralResponse3[i])
    }

    for (i = 0; i < this.state.synPoolLength; i++) {
      synUserBalance[i] = await synResponse0[i]
      synUserAllowance[i] = await synResponse1[i]
      let userOrderResponse = await synResponse2[i]
      synUserOpenOrderLength[i] = userOrderResponse[0]
      synUserOrderInfo[i] = userOrderResponse[1]
    }

    for (i = 0; i < this.state.bavaPoolLength; i++) {
      if (this.state.bavaLpTokenPairsymbols[i] == "PGL" || this.state.bavaLpTokenPairsymbols[i] == "PNG") {
        bavaUserSegmentInfo[0][b] = (await bavaResponse0[i]).amount
        bavaPoolSegmentInfo[0][b] = this.state.farmBava[i]
        bavaLpBalanceAccount[0][b] = await bavaResponse1[i]
        bavaLpSegmentAllowance[0][b] = await bavaResponse2[i]
        bavaPendingSegmentReward[0][b] = await bavaResponse3[i]
        b += 1
      } else {
        bavaUserSegmentInfo[1][b] = (await bavaResponse0[i]).amount
        bavaPoolSegmentInfo[1][b] = this.state.farmBava[i]
        bavaLpBalanceAccount[1][b] = await bavaResponse1[i]
        bavaLpSegmentAllowance[1][b] = await bavaResponse2[i]
        bavaPendingSegmentReward[1][b] = await bavaResponse3[i]
        b += 1
      }
      totalpendingReward += parseInt(await bavaResponse3[i])
    }

    this.setState({ poolSegmentInfo })
    this.setState({ userSegmentInfo })
    this.setState({ lpBalanceAccount })
    this.setState({ lpSegmentAllowance })
    this.setState({ pendingSegmentReward })

    this.setState({ poolSegmentInfoV2_2 })
    this.setState({ userSegmentInfoV2_2 })
    this.setState({ lpBalanceAccountV2_2 })
    this.setState({ lpSegmentAllowanceV2_2 })
    this.setState({ pendingSegmentRewardV2_2 })

    this.setState({ userSegmentInfoV2_3 })
    this.setState({ lpBalanceAccountV2_3 })
    this.setState({ lpSegmentAllowanceV2_3 })
    this.setState({ pendingSegmentRewardV2_3 })

    this.setState({ userSegmentInfoV2_3 })
    this.setState({ lpBalanceAccountV2_3 })
    this.setState({ lpSegmentAllowanceV2_3 })
    this.setState({ pendingSegmentRewardV2_3 })

    this.setState({ collUserSegmentInfo })
    this.setState({ collBRTBalanceAccount })
    this.setState({ collBRTSegmentAllowance })
    this.setState({ collDebtBalance })
    this.setState({ collMaxBorrowAmount })
    this.setState({ collRatio })

    this.setState({ bavaPoolSegmentInfo })
    this.setState({ bavaUserSegmentInfo })
    this.setState({ bavaLpBalanceAccount })
    this.setState({ bavaLpSegmentAllowance })
    this.setState({ bavaPendingSegmentReward })

    this.setState({ synUserBalance })
    this.setState({ synUserAllowance })
    this.setState({ synUserOpenOrderLength })
    this.setState({ synUserOrderInfo })

    this.setState({ totalpendingReward: totalpendingReward.toLocaleString('fullwide', { useGrouping: false }) })
    this.setState({ totalPendingDebt: totalPendingDebt.toLocaleString('fullwide', { useGrouping: false }) })
    this.setState({ farmloading: true })
    this.setState({ accountLoading: true })
  }

  // *************************** Async User Info ***********************************************************************************************
  // bavaToken
  async loadBavaTokenBalance() {
    let bavaTokenBalance = await this.state.bavaToken.methods.balanceOf(this.state.account).call()
    return bavaTokenBalance
  }

  async loadLockedBavaTokenBalance() {
    let lockedBavaTokenBalance = await this.state.bavaToken.methods.lockOf(this.state.account).call()
    return lockedBavaTokenBalance
  }

  async loadBavaTokenAllowance() {
    let bavaTokenAllowance = await this.state.bavaToken.methods.allowance(this.state.account, process.env.REACT_APP_staking_rewards_address).call()
    return bavaTokenAllowance
  }

  async loadEarnedAmount() {
    let earnedAmount = await this.state.bavaStake.methods.earned(this.state.account).call()
    return earnedAmount
  }

  async loadStakeAmount() {
    let stakeAmount = await this.state.bavaStake.methods.userInfo(this.state.account).call()
    return stakeAmount
  }

  // system coin
  async loadSystemCoinBalance() {
    let systemCoinBalance = await this.state.systemCoin.methods.balanceOf(this.state.account).call()
    return systemCoinBalance
  }

  async loadSystemCoinCollAllowance() {
    let systemCoinCollAllowance = await this.state.systemCoin.methods.allowance(this.state.account, process.env.REACT_APP_collateral_vault_address).call()
    return systemCoinCollAllowance
  }

  async loadSystemCoinSupply() {
    let systemCoinTSupply = await this.state.systemCoin.methods.totalSupply().call()
    return systemCoinTSupply
  }

  async loadSystemCoinSynAllowance() {
    let systemCoinSynAllowance = await this.state.systemCoin.methods.allowance(this.state.account, process.env.REACT_APP_synthetic_pool_address).call()
    return systemCoinSynAllowance
  }

  // bavaMasterFarmerV2

  async loadUserInfo(i) {
    let userInfo = await this.state.bavaMasterFarmer.methods.userInfo(i, this.state.account).call()
    return userInfo
  }

  async loadUserInfo1(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
    let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
    return lpTokenBalance
  }

  async loadUserInfo2(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
    let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, this.state.bavaMasterFarmer._address).call()
    return lpTokenAllowance
  }

  async loadUserInfo3(i) {
    let pendingReward = await this.state.bavaMasterFarmer.methods.pendingReward(i, this.state.account).call()
    return pendingReward
  }

  // bavaMasterFarmerV2_2

  async loadUserInfoV2_2(i) {
    let userInfo = await this.state.bavaMasterFarmerV2_2.methods.userInfo(i, this.state.account).call()
    return userInfo
  }

  async loadUserInfo1V2_2(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddressesV2_2[i])
    let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
    return lpTokenBalance
  }

  async loadUserInfo2V2_2(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddressesV2_2[i])
    let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, this.state.bavaMasterFarmerV2_2._address).call()
    return lpTokenAllowance
  }

  async loadUserInfo3V2_2(i) {
    let pendingReward = await this.state.bavaMasterFarmerV2_2.methods.pendingReward(i, this.state.account).call()
    return pendingReward
  }
  // #############################################################################################################
  // bavaMasterFarmerV2_3
  async loadUserInfoV2_3(i) {
    let poolAddress = (await this.state.bavaMasterFarmerV2_3.methods.poolInfo(i).call()).poolContract
    let bavaCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPool.abi, poolAddress)
    let userInfo = await bavaCompoundPool.methods.balanceOf(this.state.account).call()
    return userInfo
  }

  async loadUserInfo1V2_3(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddressesV2_3[i])
    let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
    return lpTokenBalance
  }

  async loadUserInfo2V2_3(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddressesV2_3[i])
    let poolAddress = (await this.state.bavaMasterFarmerV2_3.methods.poolInfo(i).call()).poolContract
    let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, poolAddress).call()
    return lpTokenAllowance
  }

  async loadUserInfo3V2_3(i) {
    let poolAddress = (await this.state.bavaMasterFarmerV2_3.methods.poolInfo(i).call()).poolContract
    let bavaCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPool.abi, poolAddress)
    let pendingReward = await bavaCompoundPool.methods.pendingReward(this.state.account).call()
    return pendingReward
  }
  // #############################################################################################################
  // collateral
  async loadCollateralDeposit(i) {
    let brtAddress = (await this.state.collateralVault.methods.poolInfo(i).call()).collateralToken
    let brtCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPool.abi, brtAddress)
    let totalBRTDeposit = await brtCompoundPool.methods.balanceOf(this.state.collateralVault._address).call()
    return totalBRTDeposit
  }

  async loadCollateralUserInfo(i) {
    let collateralBalance = await this.state.collateralVault.methods.collateralBalances(i, this.state.account).call()
    return collateralBalance
  }

  async loadCollateralUserInfo1(i) {
    let brtAddress = (await this.state.collateralVault.methods.poolInfo(i).call()).collateralToken
    let brtCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPool.abi, brtAddress)
    let userbrtBalance = await brtCompoundPool.methods.balanceOf(this.state.account).call()
    return userbrtBalance
  }

  async loadCollateralUserInfo2(i) {
    let brtAddress = (await this.state.collateralVault.methods.poolInfo(i).call()).collateralToken
    let brtCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPool.abi, brtAddress)
    let brtAllowance = await brtCompoundPool.methods.allowance(this.state.account, this.state.collateralVault._address).call()
    return brtAllowance
  }

  async loadCollateralUserInfo3(i) {
    let debtBalance = await this.state.collateralVault.methods.getAssetBalance(i, this.state.account).call()
    return debtBalance
  }

  async loadCollateralUserInfo4(i) {
    let remainingMaxBorrowAmount = await this.state.collateralVault.methods.getMaxBorrowAmount(i, this.state.account, 0).call()
    return remainingMaxBorrowAmount
  }
  // #############################################################################################################
  // synthetic

  async loadSynUserInfo(i) {
    let synAddress = (await this.state.syntheticPool.methods.poolInfo(i).call()).syntheticToken
    let wrappedbSynthetic = new window.web3Ava.eth.Contract(WrappedbSynthetic.abi, synAddress)
    let userSynBalance = await wrappedbSynthetic.methods.balanceOf(this.state.account).call()
    return userSynBalance
  }

  async loadSynUserInfo1(i) {
    let synAddress = (await this.state.syntheticPool.methods.poolInfo(i).call()).syntheticToken
    let wrappedbSynthetic = new window.web3Ava.eth.Contract(WrappedbSynthetic.abi, synAddress)
    let synAllowance = await wrappedbSynthetic.methods.allowance(this.state.account, this.state.syntheticPool._address).call()
    return synAllowance
  }

  async loadSynUserInfo2(i) {
    let userOrders = await this.state.syntheticPool.methods.getUserOrders(i, this.state.account).call()
    let pendingOpenOrder = 0
    for (let n = 0; n < userOrders.length; n++) {
      let orderStatus = userOrders[n].status
      if (orderStatus == 0) {
        pendingOpenOrder += 1
      }
    }
    return [pendingOpenOrder, userOrders]
  }

  // #############################################################################################################
  // bavaMasterFarmerV1 
  async loadBavaUserInfo(i) {
    let userInfo = await this.state.bavaMasterFarmerV1.methods.userInfo(i, this.state.account).call()
    return userInfo
  }

  async loadBavaUserInfo1(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.bavaLpTokenAddresses[i])
    let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
    return lpTokenBalance
  }

  async loadBavaUserInfo2(i) {
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.bavaLpTokenAddresses[i])
    let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, this.state.bavaMasterFarmerV1._address).call()
    return lpTokenAllowance
  }

  async loadBavaUserInfo3(i) {
    let pendingReward = await this.state.bavaMasterFarmerV1.methods.pendingReward(i, this.state.account).call()
    return pendingReward
  }

  // bavaMasterFarmerV2_2 poolLength
  async loadPoolLengthV2_2() {
    let poolLengthV2_2 = await this.state.bavaMasterFarmerV2_2.methods.poolLength().call()
    return poolLengthV2_2
  }

  // bavaMasterFarmerV2_3
  async loadPoolLengthV2_3() {
    let poolLengthV2_3 = await this.state.bavaMasterFarmerV2_3.methods.poolLength().call()
    poolLengthV2_3 = 1
    return poolLengthV2_3
  }

  async loadCollateralPoolLength() {
    let collateralPoolLength = await this.state.collateralVault.methods.getPoolLength().call()
    return collateralPoolLength
  }

  async loadCollateralBRTValue(i) {
    let poolData = await this.state.collateralVault.methods.poolInfo(i).call()
    let collateralBRTValue = await this.state.avaxChainlinkOracle.methods.getBRTPrice(poolData.collateralToken).call()
    if (collateralBRTValue[0] == true) {
      return collateralBRTValue[1]
    } else {
      return 0
    }
  }

  async loadSyntheticPoolLength() {
    let synPoolLength = await this.state.syntheticPool.methods.getPoolLength().call()
    return synPoolLength
  }

  async loadSyntheticValue(i) {
    const chainlinkAggreagator = new window.web3Eth.eth.Contract(ChainlinkAggreagator.abi, this.state.synPool[i].chainlink)
    let synOraclePrice = await chainlinkAggreagator.methods.latestAnswer().call()
    return synOraclePrice
  }

  async loadSyntheticPoolPrice() {
    const response = await fetch("https://trade.testnet.marginx.io/dex/common/queryPair", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const myJsonMarginX = await response.json()
    console.log(myJsonMarginX)
    let marginXPrice = myJsonMarginX["data"]
    for (let n = 0; n < marginXPrice.length; n++) {
      if (marginXPrice[n].pair == 'TSLA:USDT') {
        this.setState({ TSLAPrice: parseFloat(marginXPrice[n].markPrice) })
      } else if (marginXPrice[n].pair == 'AAPL:USDT') {
        this.setState({ AAPLPrice: parseFloat(marginXPrice[n].markPrice) })
      } else if (marginXPrice[n].pair == 'FB:USDT') {
        this.setState({ FBPrice: parseFloat(marginXPrice[n].markPrice)})
      } else if (marginXPrice[n].pair == 'GOOG:USDT') {
        this.setState({ GOOGPrice: parseFloat(marginXPrice[n].markPrice) })
      } else if (marginXPrice[n].pair == 'BTC:USDT') {
        this.setState({ BTCPrice: parseFloat(marginXPrice[n].markPrice) })
      }
    }

    let synPoolPrice = []
    for (let i = 0; i < this.state.synPoolLength; i++) {
      let pairSymbol = this.state.synPool[i].marginXPair
      if (pairSymbol == 'TSLA:USDT') {
        synPoolPrice[i] = this.state.TSLAPrice * 100000000
      } else if (pairSymbol == 'AAPL:USDT') {
        synPoolPrice[i] = this.state.AAPLPrice * 100000000
      } else if (pairSymbol == 'FB:USDT') {
        synPoolPrice[i] = this.state.FBPrice * 100000000
      } else if (pairSymbol == 'BTC:USDT') {
        synPoolPrice[i] = this.state.BTCPrice * 100000000
      }
    }
    return synPoolPrice
  }

  async loadSyntheticTotalSupply(i) {
    let synAddress = (await this.state.syntheticPool.methods.poolInfo(i).call()).syntheticToken
    let wrappedbSynthetic = new window.web3Ava.eth.Contract(WrappedbSynthetic.abi, synAddress)
    let synTotalSupply = await wrappedbSynthetic.methods.totalSupply().call()
    return synTotalSupply

  }

  async loadPoolCollateralAsset(i) {
    let poolData = await this.state.collateralVault.methods.poolInfo(i).call()
    let poolTotalAsset = poolData.totalAssetAmount
    let remainingPoolAvailableUSB = (parseFloat(window.web3Ava.utils.fromWei(poolData.assetCeiling, 'Ether')) - parseFloat(window.web3Ava.utils.fromWei(poolTotalAsset, 'Ether')))
    return (remainingPoolAvailableUSB)
  }

  async loadFarmReinvest(i) {
    let reinvestAmount
    let finalReinvestAmount = 0
    let bonusReinvestAmount = 0
    let bonusRewardPrice = 0
    if (i <= 5) {
      let poolAddress = (await this.state.bavaMasterFarmerV2_3.methods.poolInfo(i).call()).poolContract
      let bavaCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPool.abi, poolAddress)
      reinvestAmount = await bavaCompoundPool.methods.checkReward().call()
      finalReinvestAmount = reinvestAmount["0"] * this.state.PNGPrice / this.state.AVAXPrice
    } else if (i == 10 || i == 6) {

    } else {
      let poolAddress = (await this.state.bavaMasterFarmerV2_3.methods.poolInfo(i).call()).poolContract
      let bavaCompoundPool = new window.web3Ava.eth.Contract(BavaCompoundPoolVariable.abi, poolAddress)
      reinvestAmount = await bavaCompoundPool.methods.checkReward().call()


      if (reinvestAmount["1"].length > 0) {
        for (let n = 0; n < reinvestAmount["1"].length; n++) {
          if (this.state.farmV2_3[i]["bonusReward"][n] == "BAVA") {
            bonusRewardPrice = this.state.BAVAPrice
          } else if (this.state.farmV2_3[i]["bonusReward"][n] == "QI") {
            bonusRewardPrice = this.state.QIPrice
          } else if (this.state.farmV2_3[i]["bonusReward"][n] == "LUNA") {
            bonusRewardPrice = this.state.LUNAPrice
          } else if (this.state.farmV2_3[i]["bonusReward"][n] == "WAVAX") {
            bonusRewardPrice = this.state.AVAXPrice
          }
          bonusReinvestAmount += (reinvestAmount["1"][n] * bonusRewardPrice / this.state.AVAXPrice)
        }
      }
      finalReinvestAmount = reinvestAmount["0"] * this.state.PNGPrice / this.state.AVAXPrice + bonusReinvestAmount
    }
    return (finalReinvestAmount.toFixed(0)).toString()
  }

  // ***************************************** Async Airdrop *************************************************************

  async loadPoolLength() {
    let poolLength = await this.state.bavaMasterFarmer.methods.poolLength().call()
    return poolLength
  }

  async loadBavaPoolLength() {
    let bavaPoolLength = await this.state.bavaMasterFarmerV1.methods.poolLength().call()
    return bavaPoolLength
  }

  async loadAirdropIteration() {
    let airdropIteration = await this.state.bavaAirdrop.methods.airdropIteration().call()
    return airdropIteration
  }

  async loadAirdropAmount() {
    let airdropAmount = await this.state.bavaAirdrop.methods.airdropAmount().call()
    return airdropAmount
  }

  async loadAirdropStart() {
    let airdropIteration = await this.state.bavaAirdrop.methods.airdropIteration().call()
    let airdropStart = await this.state.bavaAirdrop.methods.startAirdrop(airdropIteration).call()
    return airdropStart
  }

  async loadAirdropEnd() {
    let airdropIteration = await this.state.bavaAirdrop.methods.airdropIteration().call()
    let airdropEnd = await this.state.bavaAirdrop.methods.endAirdrop(airdropIteration).call()
    return airdropEnd
  }

  // ***************************************** BAVA Stake *************************************************************

  async loadTotalStake() {
    let totalStake = await this.state.bavaStake.methods.totalSupply().call()
    return totalStake
  }

  async loadRewardRate() {
    let rewardRate = await this.state.bavaStake.methods.rewardRate().call()
    return rewardRate
  }

  // ***************************TVL & APR***********************************************************************
  async loadTVLAPR() {

    let tvl = [[], []]
    let apr = [[], []]
    let apyDaily = [[], []]

    let bavatvl = [[], []]
    let bavaapr = [[], []]
    let bavaapyDaily = [[], []]

    let tvlV2_2 = [[], []]
    let aprV2_2 = [[], []]
    let apyDailyV2_2 = [[], []]

    let tvlV2_3 = [[], [], []]
    let aprV2_3 = [[], [], []]
    let apyDailyV2_3 = [[], [], []]

    let colltvl = []

    let n = 0
    let b = 0
    let c = 0
    let d = 0
    let totalTVL = 0
    let collTotalTVL = 0

    let tvlArray = this.state.myJsonMongo["TVL"]
    let aprArray = this.state.myJsonMongo["APR"]
    let apyArray = this.state.myJsonMongo["APY"]
    let bavatvlArray = this.state.myJsonMongo["BAVATVL"]
    let bavaaprArray = this.state.myJsonMongo["BAVAAPR"]
    let bavaapyArray = this.state.myJsonMongo["BAVAAPY"]

    // let responseV2_2 = await this.loadTVLAPRV2_2()
    let tvlArrayV2_2 = this.state.myJsonMongo["TVLV2_2"]
    let aprArrayV2_2 = this.state.myJsonMongo["APRV2_2"]
    let apyArrayV2_2 = this.state.myJsonMongo["APYV2_2"]

    let tvlArrayV2_3 = this.state.myJsonMongo["TVLV2_3"]
    let aprArrayV2_3 = this.state.myJsonMongo["APRV2_3"]
    let apyArrayV2_3 = this.state.myJsonMongo["APYV2_3"]

    for (let i = 0; i < this.state.poolLength; i++) {
      totalTVL += parseInt(tvlArray[n]["tvl"])
      if (this.state.lpTokenPairsymbols[i] == "PGL" || this.state.lpTokenPairsymbols[i] == "PNG") {
        tvl[0][n] = tvlArray[n]["tvl"]
        apr[0][n] = parseFloat(aprArray[n]["apr"])
        apyDaily[0][n] = ((1 + (apr[0][n] * 0.05 + parseFloat(this.state.poolSegmentInfo[0][n].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + apr[0][n]
        n += 1
      } else {
        tvl[1][n] = tvlArray[n]["tvl"]
        apr[1][n] = parseFloat(aprArray[n]["apr"])
        apyDaily[1][n] = ((1 + (apr[1][n] * 0.05 + parseFloat(this.state.poolSegmentInfo[1][n].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + apr[1][n]
        n += 1
      }
    }

    for (let i = 0; i < this.state.bavaPoolLength; i++) {
      totalTVL += parseInt(bavatvlArray[b]["tvl"])
      if (this.state.bavaLpTokenPairsymbols[i] == "PGL" || this.state.bavaLpTokenPairsymbols[i] == "PNG") {
        bavatvl[0][b] = bavatvlArray[b]["tvl"]
        bavaapr[0][b] = parseFloat(bavaaprArray[b]["apr"])
        bavaapyDaily[0][b] = ((1 + (bavaapr[0][b] * 0.05 + parseFloat(this.state.bavaPoolSegmentInfo[0][b].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + bavaapr[0][b]
        b += 1
      } else {
        bavatvl[1][b] = bavatvlArray[b]["tvl"]
        bavaapr[1][b] = parseFloat(bavaaprArray[b]["apr"])
        bavaapyDaily[1][b] = ((1 + (bavaapr[1][b] * 0.05 + parseFloat(this.state.bavaPoolSegmentInfo[1][b].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + bavaapr[1][b]
        b += 1
      }
    }

    for (let i = 0; i < this.state.poolLengthV2_2; i++) {
      totalTVL += parseInt(tvlArrayV2_2[c]["tvl"])
      if (this.state.lpTokenPairsymbolsV2_2[i] == "PGL" || this.state.lpTokenPairsymbolsV2_2[i] == "PNG") {
        tvlV2_2[0][c] = tvlArrayV2_2[c]["tvl"]
        aprV2_2[0][c] = parseFloat(aprArrayV2_2[c]["apr"])
        apyDailyV2_2[0][c] = ((1 + (aprV2_2[0][c] * 0.05 + parseFloat(this.state.poolSegmentInfoV2_2[0][c].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + aprV2_2[0][c]
        c += 1
      } else {
        tvlV2_2[1][c] = tvlArrayV2_2[c]["tvl"]
        aprV2_2[1][c] = parseFloat(aprArrayV2_2[c]["apr"])
        apyDailyV2_2[1][c] = ((1 + (aprV2_2[1][c] * 0.05 + parseFloat(this.state.poolSegmentInfoV2_2[1][c].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + + aprV2_2[1][c]
        c += 1
      }
    }

    for (let i = 0; i < this.state.poolLengthV2_3; i++) {
      totalTVL += parseInt(tvlArrayV2_3[d]["tvl"])
      if (this.state.lpTokenPairsymbolsV2_3[i] == "PGL" || this.state.lpTokenPairsymbolsV2_3[i] == "PNG") {
        tvlV2_3[0][d] = tvlArrayV2_3[d]["tvl"]
        aprV2_3[0][d] = parseFloat(aprArrayV2_3[d]["apr"])
        apyDailyV2_3[0][d] = ((1 + (aprV2_3[0][d] * 0.05 + parseFloat(this.state.poolSegmentInfoV2_3[0][d].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + aprV2_3[0][d]
        d += 1
      } else if (this.state.lpTokenPairsymbolsV2_3[i] == "JLP") {
        tvlV2_3[1][d] = tvlArrayV2_3[d]["tvl"]
        aprV2_3[1][d] = parseFloat(aprArrayV2_3[d]["apr"])
        apyDailyV2_3[1][d] = ((1 + (aprV2_3[1][d] * 0.05 + parseFloat(this.state.poolSegmentInfoV2_3[1][d].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + aprV2_3[1][d]
        d += 1
      } else {
        tvlV2_3[2][d] = tvlArrayV2_3[d]["tvl"]
        aprV2_3[2][d] = parseFloat(aprArrayV2_3[d]["apr"])
        apyDailyV2_3[2][d] = ((1 + (aprV2_3[2][d] * 0.05 + parseFloat(this.state.poolSegmentInfoV2_3[2][d].total3rdPartyAPR)) / 36500) ** 365 - 1) * 100 + aprV2_3[2][d]
        d += 1
      }
    }

    totalTVL += (window.web3Ava.utils.fromWei(this.state.totalStake, 'Ether') * this.state.BAVAPrice)
    let collResponse1 = []
    for (let i = 0; i < this.state.collateralPoolLength; i++) {
      collResponse1[i] = this.loadCollateralDeposit(i)    // TVL
    }

    for (let i = 0; i < this.state.collateralPoolLength; i++) {
      colltvl[i] = window.web3Ava.utils.fromWei((await collResponse1[i]), 'ether') * window.web3Ava.utils.fromWei(this.state.collBRTValue[i], 'ether')    // collateralBalance
      collTotalTVL += parseInt(colltvl[i])
    }

    this.setState({ totalTVL })
    this.setState({ tvl })
    this.setState({ apr })
    this.setState({ apyDaily })

    this.setState({ tvlV2_2 })
    this.setState({ aprV2_2 })
    this.setState({ apyDailyV2_2 })

    this.setState({ tvlV2_3 })
    this.setState({ aprV2_3 })
    this.setState({ apyDailyV2_3 })

    this.setState({ colltvl })
    this.setState({ collTotalTVL })

    this.setState({ bavatvl })
    this.setState({ bavaapr })
    this.setState({ bavaapyDaily })
    this.setState({ aprloading: true })
  }

  // ************* load farmV2_2 tvl apr *************

  async loadTVLAPRV2_2(i) {

    let bavatvlArray = this.state.myJsonMongo["BAVATVL"]
    let lpTokenPair = new window.web3Ava.eth.Contract(IPancakePair.abi, this.state.lpTokenAddressesV2_2[0])
    let lpTokenBalance = await lpTokenPair.methods.balanceOf(process.env.REACT_APP_bavamasterfarmv1_address).call()
    let lpTokenValue = bavatvlArray[0]["tvl"] / window.web3Ava.utils.fromWei(lpTokenBalance, 'ether')

    let BAVAPrice = this.state.BAVAPrice
    let lpTokenInContract = await this.state.bavaMasterFarmerV2_2.methods.poolInfo(0).call()
    let rewardPerBlock = await this.state.bavaMasterFarmerV2_2.methods.REWARD_PER_BLOCK().call()
    lpTokenInContract = window.web3Ava.utils.fromWei(lpTokenInContract["depositAmount"], 'ether')
    let tvl = lpTokenValue * lpTokenInContract
    let apr = ((28000 * 365 * 645 * window.web3Ava.utils.fromWei(rewardPerBlock, 'ether') * BAVAPrice) / tvl) * 100
    let apyDaily = ((1 + apr / 36500) ** 365 - 1) * 100

    let array = { 'TVL': [{ 'tvl': tvl }], 'APR': [{ 'apr': apr }], 'APY': [{ 'apyDaily': apyDaily }] }
    return array
  }

  // ***********************************************************************************************************************************************

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
    }
    // window.web3Ava = new Web3(`https://api.avax.network/ext/bc/C/rpc`);
    window.web3Ava = new Web3(`https://api.avax-test.network/ext/bc/C/rpc`);
    window.web3Eth = new Web3(`https://mainnet.infura.io/v3/${process.env.REACT_APP_infuraapiKey}`);

    let responseMongo = await fetch(`https://ap-southeast-1.aws.data.mongodb-api.com/app/bdl-uyejj/endpoint/tvl`);
    const myJsonMongo = await responseMongo.json();
    this.setState({ myJsonMongo })


    let tokenPrice = myJsonMongo["TokenPrice"]
    this.setState({ AVAXPrice: parseFloat(tokenPrice[0].avaxPrice).toFixed(5) })
    this.setState({ BAVAPrice: parseFloat(tokenPrice[1].bavaPrice).toFixed(5) })
    this.setState({ PNGPrice: parseFloat(tokenPrice[2].pngPrice).toFixed(5) })
    this.setState({ LUNAPrice: parseFloat(tokenPrice[3].lunaPrice).toFixed(5) })
    this.setState({ JOEPrice: parseFloat(tokenPrice[4].joePrice).toFixed(5) })
    this.setState({ QIPrice: parseFloat(tokenPrice[5].qiPrice).toFixed(5) })
    this.setState({ loading: true })
  }

  connectMetamask = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async () => {
          await this.switchNetwork()
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId == process.env.REACT_APP_chainid) {
            // await this.WalletDisconnect()
            await this.setWalletTrigger(true)
            this.componentWillMount()
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert("Something went wrong...Code: 4001 User rejected the request.")
          } else {
            console.error(err);
          }
        });
    } else {
      alert("No wallet provider was found")
    }
  }

  connectCoin98 = () => {
    if (window.coin98) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          let chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId == "0xa86a") {
            if (accounts[0]) {
              this.WalletDisconnect()
              this.setWalletTrigger(true)
            } else {
              alert("No wallet found, please create wallet")
            }
          } else {
            alert("Wrong Network, please switch to Avalanche network")
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert("Something went wrong...Code: 4001 User rejected the request.")
          } else {
            console.error(err);
          }
        });
    } else {
      alert("No wallet provider was found")
    }
  }


  mobileWalletConnect = async () => {
    window.provider = new WalletConnectProvider({
      rpc: {
        43114: "https://api.avax.network/ext/bc/C/rpc"
        // 56: `https://bsc-dataseed.binance.org/`
        // 1: "https://api.avax.network/ext/bc/C/rpc"
      },
      chainId: 43114,
      // chainId: 56,
    });
    await window.provider.enable();
    window.web3Con = await new Web3(window.provider);
    const accounts = await window.web3Con.eth.getAccounts();
    const chainId = await window.provider.request('eth_chainId');
    this.setState({ account: accounts[0] })
    const first4Account = this.state.account.substring(0, 4)
    const last4Account = this.state.account.slice(-4)
    this.setState({ first4Account: first4Account })
    this.setState({ last4Account: last4Account })
    this.setState({ walletConnect: true })
    this.setWalletTrigger(false)
    this.componentWillMount()

    // Subscribe to accounts change
    window.provider.on("accountsChanged", this.handleAccountsChanged);
    // Subscribe to session disconnection
    window.provider.on("disconnect", (code, reason) => {
      // console.log(code, reason);
      this.WalletDisconnect()
    });
    window.provider.on("chainChanged", async () => {
      this.WalletDisconnect()
      alert("You're connected to an unsupported network.")
    });
  }

  WalletDisconnect = async () => {
    if (window.provider.connected == true) {
      await window.provider.disconnect()
      this.setState({ walletConnect: false })
      this.setState({ accountLoading: false })
    }
    this.componentWillMount()
  }

  switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: process.env.REACT_APP_chainid }],
      })
    }
    catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          // console.log(switchError.code)
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa86a', rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'], chainName: 'Avalanche Mainnet C-Chain',
              nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX', // 2-6 characters long
                decimals: 18
              }, blockExplorerUrls: ['https://snowtrace.io/']
            }],
          });
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          this.setState({ chainId })
          if (this.state.chainId == "0x61") {
            this.setState({ networkName: "BSC Testnet" })
          } else if (this.state.chainId == "0x38") {
            this.setState({ networkName: "BSC" })
          } else if (this.state.chainId == "0x1") {
            this.setState({ networkName: "Ethereum" })
          } else if (this.state.chainId == "0x3") {
            this.setState({ networkName: "Ropsten" })
          } else if (this.state.chainId == "0x4") {
            this.setState({ networkName: "Rinkeby" })
          } else if (this.state.chainId == "0x2a") {
            this.setState({ networkName: "Kovan" })
          } else if (this.state.chainId == "0x89") {
            this.setState({ networkName: "Polygon" })
          } else if (this.state.chainId == "0x13881") {
            this.setState({ networkName: "Mumbai" })
          } else if (this.state.chainId == "0xa869") {
            this.setState({ networkName: "Fuji" })
          } else if (this.state.chainId == "0xa86a") {
            this.setState({ networkName: "Avalanche" })
          }
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  setWalletTrigger = async (state) => {
    if (state == false) {
      await this.setState({ wallet: state })
      this.setState({ accountLoading: state })
    } else {
      const accounts = await window.web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      this.setState({ wallet: state })
    }
  }

  handleAccountsChanged = async (accounts) => {
    await window.location.reload(false);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      this.setWalletTrigger(false)
    } else if (accounts[0] !== this.state.account) {
      await this.setWalletTrigger(true)
      const accounts = await window.web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      this.setState({ airdropCheck: false })
      this.loadBlockchainUserData()
      // this.componentWillMount()
      // Do any other work!
    }
  }

  handleChainChanged = async () => {
    // We recommend reloading the page, unless you must do otherwise
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    this.setState({ chainId })
    if (chainId != process.env.REACT_APP_chainid) {
      this.setWalletTrigger(false)
    }
    if (this.state.chainId == "0x61") {
      this.setState({ networkName: "BSC Testnet" })
    } else if (this.state.chainId == "0x38") {
      this.setState({ networkName: "BSC" })
    } else if (this.state.chainId == "0x1") {
      this.setState({ networkName: "Ethereum" })
    } else if (this.state.chainId == "0x3") {
      this.setState({ networkName: "Ropsten" })
    } else if (this.state.chainId == "0x4") {
      this.setState({ networkName: "Rinkeby" })
    } else if (this.state.chainId == "0x2a") {
      this.setState({ networkName: "Kovan" })
    } else if (this.state.chainId == "0x89") {
      this.setState({ networkName: "Polygon" })
    } else if (this.state.chainId == "0x13881") {
      this.setState({ networkName: "Mumbai" })
    } else if (this.state.chainId == "0xa869") {
      this.setState({ networkName: "Fuji" })
    } else if (this.state.chainId == "0xa86a") {
      this.setState({ networkName: "Avalanche" })
    }
    this.switchNetwork()
    // Run any other necessary logic...
  }

  delay = ms => new Promise(res => setTimeout(res, ms));

  timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    var min = a.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    var sec = a.getSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }




  /** 
   * @description - Compound Pool deposit function
   * @param - i - pool index, n - platform, v - contract version
  */

  deposit = async (i, amount, n, v) => {
    let bavaMasterFarmer
    let bavaCompoundPool
    if (this.state.walletConnect == true) {
      if (v == 1) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
      } else if (v == 2) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
      } else if (v == 3) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
      } else if (v == 4) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
        let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
        bavaCompoundPool = new window.web3Con.eth.Contract(BavaCompoundPool.abi, poolAddress)
      }
    } else if (this.state.wallet == true) {
      if (v == 1) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
      } else if (v == 2) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
      } else if (v == 3) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
      } else if (v == 4) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
        let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
        bavaCompoundPool = new window.web3.eth.Contract(BavaCompoundPool.abi, poolAddress)
      }
    } if (v == 4) {
      await bavaCompoundPool.methods.deposit(amount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    } else {
      await bavaMasterFarmer.methods.deposit(i, amount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  approve = async (i, n, v) => {
    let lpTokenAddress
    let bavaMasterFarmerAddress
    let lpToken
    if (v == 1) {
      lpTokenAddress = this.state.bavaPoolSegmentInfo[n][i].lpAddresses[this.state.farmNetworkId]
      bavaMasterFarmerAddress = this.state.bavaMasterFarmerV1._address
    } else if (v == 2) {
      lpTokenAddress = this.state.poolSegmentInfo[n][i].lpAddresses[this.state.farmNetworkId]
      bavaMasterFarmerAddress = this.state.bavaMasterFarmer._address
    } else if (v == 3) {
      lpTokenAddress = this.state.poolSegmentInfoV2_2[n][i].lpAddresses[this.state.farmNetworkId]
      bavaMasterFarmerAddress = this.state.bavaMasterFarmerV2_2._address
    } else if (v == 4) {
      let bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
      lpTokenAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).lpToken
      bavaMasterFarmerAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
    }
    if (this.state.walletConnect == true) {
      lpToken = new window.web3Con.eth.Contract(LpToken.abi, lpTokenAddress)
    } else if (this.state.wallet == true) {
      lpToken = new window.web3.eth.Contract(LpToken.abi, lpTokenAddress)
    }
    await lpToken.methods.approve(bavaMasterFarmerAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
    });
  }

  withdraw = async (i, amount, n, v) => {
    let bavaMasterFarmer
    let bavaCompoundPool
    if (this.state.walletConnect == true) {
      if (v == 1) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
      } else if (v == 2) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
      } else if (v == 3) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
      } else if (v == 4) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
        let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
        bavaCompoundPool = new window.web3Con.eth.Contract(BavaCompoundPool.abi, poolAddress)
      }
    } else if (this.state.wallet == true) {
      if (v == 1) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
      } else if (v == 2) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
      } else if (v == 3) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
      } else if (v == 4) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
        let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
        bavaCompoundPool = new window.web3.eth.Contract(BavaCompoundPool.abi, poolAddress)
      }
    } if (v == 4) {
      await bavaCompoundPool.methods.withdraw(amount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    } else {
      await bavaMasterFarmer.methods.withdraw(i, amount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  harvest = async (i, n, v) => {
    let bavaMasterFarmer
    let bavaCompoundPool
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        if (v == 1) {
          bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
          if (this.state.bavaPendingSegmentReward[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        } else if (v == 2) {
          bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
          if (this.state.pendingSegmentReward[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        } else if (v == 3) {
          bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
          if (this.state.pendingSegmentRewardV2_2[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        } else if (v == 4) {
          bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
          let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
          bavaCompoundPool = new window.web3Con.eth.Contract(BavaCompoundPool.abi, poolAddress)
          if (this.state.pendingSegmentRewardV2_3[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        }
      } else if (this.state.wallet == true) {
        if (v == 1) {
          bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV1.abi, process.env.REACT_APP_bavamasterfarmv1_address)
          if (this.state.bavaPendingSegmentReward[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        } else if (v == 2) {
          bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmer.abi, process.env.REACT_APP_bavamasterfarmv2_address)
          if (this.state.pendingSegmentReward[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        } else if (v == 3) {
          bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_2.abi, process.env.REACT_APP_bavamasterfarmv2_2address)
          if (this.state.pendingSegmentRewardV2_2[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        } else if (v == 4) {
          bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
          let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
          bavaCompoundPool = new window.web3.eth.Contract(BavaCompoundPool.abi, poolAddress)
          if (this.state.pendingSegmentRewardV2_3[n][i] <= 0) {
            alert("No token to harvest! Please deposit LP to earn BAVA")
            return
          }
        }
      }
      if (v == 4) {
        bavaCompoundPool.methods.claimReward().send({ from: this.state.account }).then(async (result) => {
          this.componentWillMount()
        }).catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert("Something went wrong...Code: 4001 User rejected the request.")
          } else {
            console.error(err);
          }
        });
      } else {
        bavaMasterFarmer.methods.claimReward(i).send({ from: this.state.account }).then(async (result) => {
          this.componentWillMount()
        }).catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert("Something went wrong...Code: 4001 User rejected the request.")
          } else {
            console.error(err);
          }
        });
      }
    }
  }

  reinvest = async (i, n) => {
    let bavaMasterFarmer
    let bavaCompoundPool
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        bavaMasterFarmer = new window.web3Con.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
        let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
        bavaCompoundPool = new window.web3Con.eth.Contract(BavaCompoundPool.abi, poolAddress)
      } else if (this.state.wallet == true) {
        bavaMasterFarmer = new window.web3.eth.Contract(BavaMasterFarmerV2_3.abi, process.env.REACT_APP_bavamasterfarmv2_3address)
        let poolAddress = (await bavaMasterFarmer.methods.poolInfo(i).call()).poolContract
        bavaCompoundPool = new window.web3.eth.Contract(BavaCompoundPool.abi, poolAddress)
      }
      bavaCompoundPool.methods.reinvest().send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }


  /**
   * @description - Collateral pool function
   * @param {*} i - pool index
   * @param {*} collAmount - BRT amount
   * @param {*} borrowAmount - USB amount
   */

  depositAndBorrow = async (i, collAmount, borrowAmount) => {
    let collaVault
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        collaVault = new window.web3Con.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
      } else if (this.state.wallet == true) {
        collaVault = new window.web3.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
      }
      collaVault.methods.joinAndBorrow(i, collAmount, borrowAmount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  repayUSB = async (i, repayAmount) => {
    let collaVault
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        collaVault = new window.web3Con.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
      } else if (this.state.wallet == true) {
        collaVault = new window.web3.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
      }
      collaVault.methods.repaySystemCoin(i, this.state.account, repayAmount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  withdrawBRTColl = async (i, withdrawAmount) => {
    let collaVault
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        collaVault = new window.web3Con.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
      } else if (this.state.wallet == true) {
        collaVault = new window.web3.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
      }
      collaVault.methods.exit(i, this.state.account, withdrawAmount).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  collateralApprove = async (i) => {
    let collTokenAddress
    let collToken

    let collateralVault = new window.web3.eth.Contract(CollateralVault.abi, process.env.REACT_APP_collateral_vault_address)
    collTokenAddress = (await collateralVault.methods.poolInfo(i).call()).collateralToken

    if (this.state.walletConnect == true) {
      collToken = new window.web3Con.eth.Contract(LpToken.abi, collTokenAddress)
    } else if (this.state.wallet == true) {
      collToken = new window.web3.eth.Contract(LpToken.abi, collTokenAddress)
    }
    await collToken.methods.approve(this.state.collateralVault._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
    });
  }

  systemCoinCollApprove = async () => {
    let systemCoin

    if (this.state.walletConnect == true) {
      systemCoin = new window.web3Con.eth.Contract(LpToken.abi, process.env.REACT_APP_usb_address)
    } else if (this.state.wallet == true) {
      systemCoin = new window.web3.eth.Contract(LpToken.abi, process.env.REACT_APP_usb_address)
    }
    await systemCoin.methods.approve(this.state.collateralVault._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
    });
  }

  systemCoinSyntheticApprove = async () => {
    let systemCoin
    if (this.state.walletConnect == true) {
      systemCoin = new window.web3Con.eth.Contract(LpToken.abi, process.env.REACT_APP_usb_address)
    } else if (this.state.wallet == true) {
      systemCoin = new window.web3.eth.Contract(LpToken.abi, process.env.REACT_APP_usb_address)
    }
    await systemCoin.methods.approve(this.state.syntheticPool._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
    });
  }

  synTokenSyntheticApprove = async (i) => {
    let synTokenAddress
    let synToken

    let syntheticPool = new window.web3.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
    synTokenAddress = (await syntheticPool.methods.poolInfo(i).call()).syntheticToken

    if (this.state.walletConnect == true) {
      synToken = new window.web3Con.eth.Contract(LpToken.abi, synTokenAddress)
    } else if (this.state.wallet == true) {
      synToken = new window.web3.eth.Contract(LpToken.abi, synTokenAddress)
    }
    await synToken.methods.approve(this.state.syntheticPool._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
    });
  }

  synOpenOrder = async (i, orderType, minSystemCoinTxAmount, synTokenAmount, minSynTokenAmount, synTokenPrice) => {
    let syntheticPool
    console.log(minSystemCoinTxAmount)
    console.log(synTokenAmount)
    console.log(minSynTokenAmount)
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        syntheticPool = new window.web3Con.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      } else if (this.state.wallet == true) {
        syntheticPool = new window.web3.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      }
      if (orderType == 0) {
        syntheticPool.methods.openBuyOrder(i, synTokenAmount, minSynTokenAmount, synTokenPrice).send({ from: this.state.account }).then(async (result) => {
          this.componentWillMount()
        }).catch((err) => {
          if (err.code === 4001) {
            alert("Something went wrong...Code: 4001 User rejected the request.")
          } else {
            console.error(err);
          }
        });
      } else if (orderType == 1) {
        syntheticPool.methods.openSellOrder(i, synTokenAmount, minSystemCoinTxAmount, synTokenPrice).send({ from: this.state.account }).then(async (result) => {
          this.componentWillMount()
        }).catch((err) => {
          if (err.code === 4001) {
            alert("Something went wrong...Code: 4001 User rejected the request.")
          } else {
            console.error(err);
          }
        });
      }
    }
  }

  synOpenLimitOrder = async (i, orderType, synTokenAmount, synTokenPrice) => {
    let syntheticPool
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        syntheticPool = new window.web3Con.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      } else if (this.state.wallet == true) {
        syntheticPool = new window.web3.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      }
      syntheticPool.methods.openLimitOrder(i, orderType, synTokenAmount, synTokenPrice).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  synCancelOrder = async (i, orderId) => {
    let syntheticPool
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        syntheticPool = new window.web3Con.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      } else if (this.state.wallet == true) {
        syntheticPool = new window.web3.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      }
      syntheticPool.methods.cancelOrder(i, orderId).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  synCancelAllOrder = async (i) => {
    let syntheticPool
    if (this.state.walletConnect == false && this.state.wallet == false) {
      alert("Wallet is not connected")
    } else {
      if (this.state.walletConnect == true) {
        syntheticPool = new window.web3Con.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      } else if (this.state.wallet == true) {
        syntheticPool = new window.web3.eth.Contract(SyntheticPool.abi, process.env.REACT_APP_synthetic_pool_address)
      }
      syntheticPool.methods.cancelAllOrders(i).send({ from: this.state.account }).then(async (result) => {
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Something went wrong...Code: 4001 User rejected the request.")
        } else {
          console.error(err);
        }
      });
    }
  }

  /** 
   * @description - Bava airdrop function
   * @param {*} address 
   */
  checkAirdrop = async (address) => {
    let checksum = window.web3Ava.utils.toChecksumAddress(address)
    if (checksum in this.state.airdropList) {
      this.setState({ validAirdrop: true })
    } else {
      this.setState({ validAirdrop: false })
    }
    this.setState({ airdropCheck: true })
  }

  claimAirdrop = async () => {
    let bavaAirdrop
    if (this.state.walletConnect == true) {
      bavaAirdrop = new window.web3Con.eth.Contract(BavaAirdrop.abi, process.env.REACT_APP_airdrop_address)
    } else if (this.state.wallet == true) {
      bavaAirdrop = new window.web3.eth.Contract(BavaAirdrop.abi, process.env.REACT_APP_airdrop_address)
    }
    if ((Date.now() / 1000).toFixed(0) < this.state.airdropStart) {
      alert("Distribution not started yet")
    } else if ((Date.now() / 1000).toFixed(0) > this.state.airdropEnd) {
      alert("Distribution already end")
    } else {
      if ((this.state.account in this.state.airdropList) == true) {
        let processed = await bavaAirdrop.methods.processedAirdrops(this.state.account, this.state.airdropIteration).call()
        if (processed == false) {
          let hash = this.state.airdropList[this.state.account]
          await bavaAirdrop.methods.claimTokens(hash).send({ from: this.state.account }).then(async (result) => {
          }).catch((err) => {
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              alert("Something went wrong...Code: 4001 User rejected the request.")
            } else {
              console.error(err);
            }
          });
        } else {
          alert("Airdrop already claimed from this address")
        }
      }
    }
  }

  approveStake = async () => {
    let bavaToken
    if (this.state.walletConnect == true) {
      bavaToken = new window.web3Con.eth.Contract(BavaToken.abi, process.env.REACT_APP_bavatoken_address)
    } else if (this.state.wallet == true) {
      bavaToken = new window.web3.eth.Contract(BavaToken.abi, process.env.REACT_APP_bavatoken_address)
    }
    await bavaToken.methods.approve(process.env.REACT_APP_staking_rewards_address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
    });
  }

  /** 
   * @description - Bava staking function
   * @param {*} amount 
   */

  stake = async (amount) => {
    let bavaStake
    if (this.state.walletConnect == true) {
      bavaStake = new window.web3Con.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    } else if (this.state.wallet == true) {
      bavaStake = new window.web3.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    }
    await bavaStake.methods.stake(amount).send({ from: this.state.account }).then((result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
      // this.componentWillMount()
    });
  }

  unstake = async (amount) => {
    let bavaStake
    if (this.state.walletConnect == true) {
      bavaStake = new window.web3Con.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    } else if (this.state.wallet == true) {
      bavaStake = new window.web3.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    }
    await bavaStake.methods.withdraw(amount).send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
      this.componentWillMount()
    });
  }

  getReward = async () => {
    let bavaStake
    if (this.state.walletConnect == true) {
      bavaStake = new window.web3Con.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    } else if (this.state.wallet == true) {
      bavaStake = new window.web3.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    }
    await bavaStake.methods.getReward().send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
      this.componentWillMount()
    });
  }

  exit = async (amount) => {
    let bavaStake
    if (this.state.walletConnect == true) {
      bavaStake = new window.web3Con.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    } else if (this.state.wallet == true) {
      bavaStake = new window.web3.eth.Contract(StakingRewards.abi, process.env.REACT_APP_staking_rewards_address)
    }
    await bavaStake.methods.exit().send({ from: this.state.account }).then(async (result) => {
      this.componentWillMount()
    }).catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert("Something went wrong...Code: 4001 User rejected the request.")
      } else {
        console.error(err);
      }
      this.componentWillMount()
    });
  }








  setI = (pair, boolean, version) => {
    if (version == 1) {
      this.state.farmV1Open[pair] = boolean
    } else if (version == 2) {
      this.state.farmV2Open[pair] = boolean
    }
    this.setState({ i: pair })  //do ntg, just to push react setstate
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      lpToken: {},
      bavaToken: {},
      restakingFarm: {},
      bavaTokenBalance: '0',
      bavaTokenTotalSupply: '0',
      bavaTokenCapSupply: '0',
      bavaTokenLock: '0',
      bavaContract: '',
      i: '0',
      n: '0',
      loading: false,
      farmloading: false,
      wallet: false,
      aprloading: false,
      walletConnect: false,
      farmV1Open: [],
      farmV2Open: [],
      userSegmentInfo: [[], []],
      poolSegmentInfo: [[], []],
      poolSegmentInfoV2_2: [[], []],
      lpTokenSegmentInContract: [[], []],
      lpBalanceAccount: [[], []],
      lpTokenSegmentBsymbol: [[], []],
      pendingSegmentReward: [[], []],
      lpSegmentAllowance: [[], []],
      lpSegmentAllowanceV2_2: [[], []],
      lpSegmentAllowanceV2_3: [[], [], []],
      bavaLpSegmentAllowance: [[], []],
      collBRTSegmentAllowance: [],
      bavaLpBalanceAccount: [[], []],
      lpTokenValue: [[], []],
      collRatio: [],
      collUserSegmentInfo: [],
      collPoolRemainingAsset: [],
      synPoolSegmentInfo: [],
      synUserAllowance: [],
      synUserBalance: [],
      tvl: [[], []],
      apr: [[], []],
      apyDaily: [[], []],
      tvlV2_2: [[], []],
      aprV2_2: [[], []],
      apyDailyV2_2: [[], []],
      tvlV2_3: [[], [], []],
      aprV2_3: [[], [], []],
      apyDailyV2_3: [[], [], []],
      bavatvl: [[], []],
      bavaapr: [[], []],
      bavaapyDaily: [[], []],
      returnRatio: [[], []],
      bavaReturnRatio: [[], []],
      reinvestAmount: [[], []],
      synUserOrderInfo: [],
      totalpendingReward: '0',
      buttonPopup: false,
      networkName: "Loading",
      poolLength: '0',
      startBlk: '0',
      totalTVL: '0',
      lockedBavaTokenBalance: '0',
      accountLoading: false,
      totalAirdropAmount: '0',
      airdropAmount: '0',
      airdropStart: '0',
      airdropEnd: '0',
      validAirdrop: false,
      stakeAmount: '0',
      earnedAmount: '0',
      totalStake: '0',
      rewardRate: '0',
      bavaTokenAllowance: '0',
      totalPendingDebt: '0',
      systemCoinSupply: '0',
      collateralPoolLength: '0',
      synTotalSupply: '0'
    }
  }

  render() {
    let mainContent
    let menuContent
    let menuV2Content
    let kyberContent
    let traderjoeContent
    let airdropContent
    let stakeContent
    let litepaperContent
    let syntheticContent
    let traderjoeV2Content
    let navLandingContent
    let navMenuContent
    let collateralContent

    navLandingContent = <Navb
      account={this.state.account}
      first4Account={this.state.first4Account}
      last4Account={this.state.last4Account}
      wallet={this.state.wallet}
      setWalletTrigger={this.setWalletTrigger}
      loadWeb3={this.loadWeb3}
      connectMetamask={this.connectMetamask}
      mobileWalletConnect={this.mobileWalletConnect}
      WalletDisconnect={this.WalletDisconnect}
      connectCoin98={this.connectCoin98}
      networkName={this.state.networkName}
      walletConnect={this.state.walletConnect}
    />
    navMenuContent = <NavbMenu
      account={this.state.account}
      first4Account={this.state.first4Account}
      last4Account={this.state.last4Account}
      wallet={this.state.wallet}
      setWalletTrigger={this.setWalletTrigger}
      loadWeb3={this.loadWeb3}
      connectMetamask={this.connectMetamask}
      mobileWalletConnect={this.mobileWalletConnect}
      WalletDisconnect={this.WalletDisconnect}
      connectCoin98={this.connectCoin98}
      networkName={this.state.networkName}
      walletConnect={this.state.walletConnect}
    />
    mainContent = <Main
      lpTokenBalance={this.state.lpTokenBalance}
      bavaTokenBalance={this.state.bavaTokenBalance}
      deposit={this.deposit}
      withdraw={this.withdraw}
      lpTokenInContract={this.state.lpTokenInContract}
      poolLength={this.state.poolLength}
      startBlk={this.state.startBlk}
      bavaTokenTotalSupply={this.state.bavaTokenTotalSupply}
      bavaTokenCapSupply={this.state.bavaTokenCapSupply}
      bavaTokenLock={this.state.bavaTokenLock}
    />
    menuContent = <Menu
      lpTokenBalance={this.state.lpTokenBalance}
      bavaTokenBalance={this.state.bavaTokenBalance}
      deposit={this.deposit}
      withdraw={this.withdraw}
      approve={this.approve}
      setI={this.setI}
      connectMetamask={this.connectMetamask}
      lpSegmentAllowance={this.state.lpSegmentAllowance}
      bavaContract={this.state.bavaContract}
      bavaTokenTotalSupply={this.state.bavaTokenTotalSupply}
      totalpendingReward={this.state.totalpendingReward}
      userSegmentInfo={this.state.userSegmentInfo}
      poolSegmentInfo={this.state.poolSegmentInfo}
      lpBalanceAccount={this.state.lpBalanceAccount}
      pendingSegmentReward={this.state.pendingSegmentReward}
      buttonPopup={this.state.buttonPopup}
      harvest={this.harvest}
      BAVAPrice={this.state.BAVAPrice}
      tvl={this.state.tvl}
      apr={this.state.apr}
      apyDaily={this.state.apyDaily}
      farmloading={this.state.farmloading}
      aprloading={this.state.aprloading}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      farmV1Open={this.state.farmV1Open}
      farmV2Open={this.state.farmV2Open}
      accountLoading={this.state.accountLoading}
      lockedBavaTokenBalance={this.state.lockedBavaTokenBalance}
      totalTVL={this.state.totalTVL}
      bavaPoolSegmentInfo={this.state.bavaPoolSegmentInfo}
      bavaLpTokenPairsymbols={this.state.bavaLpTokenPairsymbols}
      bavaLpTokenAddresses={this.state.bavaLpTokenAddresses}
      bavaUserSegmentInfo={this.state.bavaUserSegmentInfo}
      bavaLpBalanceAccount={this.state.bavaLpBalanceAccount}
      bavaLpSegmentAllowance={this.state.bavaLpSegmentAllowance}
      bavaPendingSegmentReward={this.state.bavaPendingSegmentReward}
      bavatvl={this.state.bavatvl}
      bavaapr={this.state.bavaapr}
      bavaapyDaily={this.state.bavaapyDaily}
      returnRatio={this.state.returnRatio}
      bavaReturnRatio={this.state.bavaReturnRatio}
      poolSegmentInfoV2_2={this.state.poolSegmentInfoV2_2}
      lpTokenPairsymbolsV2_2={this.state.lpTokenPairsymbolsV2_2}
      lpTokenAddressesV2_2={this.state.lpTokenAddressesV2_2}
      returnRatioV2_2={this.state.returnRatioV2_2}
      tvlV2_2={this.state.tvlV2_2}
      aprV2_2={this.state.aprV2_2}
      apyDailyV2_2={this.state.apyDailyV2_2}
      userSegmentInfoV2_2={this.state.userSegmentInfoV2_2}
      lpBalanceAccountV2_2={this.state.lpBalanceAccountV2_2}
      lpSegmentAllowanceV2_2={this.state.lpSegmentAllowanceV2_2}
      pendingSegmentRewardV2_2={this.state.pendingSegmentRewardV2_2}
    />
    menuV2Content = <MenuV2
      lpTokenBalance={this.state.lpTokenBalance}
      bavaTokenBalance={this.state.bavaTokenBalance}
      deposit={this.deposit}
      withdraw={this.withdraw}
      approve={this.approve}
      setI={this.setI}
      connectMetamask={this.connectMetamask}
      lpSegmentAllowance={this.state.lpSegmentAllowance}
      bavaContract={this.state.bavaContract}
      bavaTokenTotalSupply={this.state.bavaTokenTotalSupply}
      totalpendingReward={this.state.totalpendingReward}
      poolSegmentInfo={this.state.poolSegmentInfo}
      buttonPopup={this.state.buttonPopup}
      harvest={this.harvest}
      reinvest={this.reinvest}
      reinvestAmount={this.state.reinvestAmount}
      BAVAPrice={this.state.BAVAPrice}
      AVAXPrice={this.state.AVAXPrice}
      tvl={this.state.tvl}
      apr={this.state.apr}
      apyDaily={this.state.apyDaily}
      farmloading={this.state.farmloading}
      aprloading={this.state.aprloading}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      farmV1Open={this.state.farmV1Open}
      farmV2Open={this.state.farmV2Open}
      accountLoading={this.state.accountLoading}
      lockedBavaTokenBalance={this.state.lockedBavaTokenBalance}
      totalTVL={this.state.totalTVL}
      returnRatio={this.state.returnRatio}
      bavaReturnRatio={this.state.bavaReturnRatio}
      poolSegmentInfoV2_3={this.state.poolSegmentInfoV2_3}
      lpTokenPairsymbolsV2_3={this.state.lpTokenPairsymbolsV2_3}
      lpTokenAddressesV2_3={this.state.lpTokenAddressesV2_3}
      returnRatioV2_3={this.state.returnRatioV2_3}
      tvlV2_3={this.state.tvlV2_3}
      aprV2_3={this.state.aprV2_3}
      apyDailyV2_3={this.state.apyDailyV2_3}
      userSegmentInfoV2_3={this.state.userSegmentInfoV2_3}
      lpBalanceAccountV2_3={this.state.lpBalanceAccountV2_3}
      lpSegmentAllowanceV2_3={this.state.lpSegmentAllowanceV2_3}
      pendingSegmentRewardV2_3={this.state.pendingSegmentRewardV2_3}
    />
    traderjoeContent = <TraderJoe
      lpTokenBalance={this.state.lpTokenBalance}
      bavaTokenBalance={this.state.bavaTokenBalance}
      deposit={this.deposit}
      withdraw={this.withdraw}
      approve={this.approve}
      setI={this.setI}
      connectMetamask={this.connectMetamask}
      lpSegmentAllowance={this.state.lpSegmentAllowance}
      bavaContract={this.state.bavaContract}
      bavaTokenTotalSupply={this.state.bavaTokenTotalSupply}
      totalpendingReward={this.state.totalpendingReward}
      userSegmentInfo={this.state.userSegmentInfo}
      poolSegmentInfo={this.state.poolSegmentInfo}
      lpBalanceAccount={this.state.lpBalanceAccount}
      pendingSegmentReward={this.state.pendingSegmentReward}
      buttonPopup={this.state.buttonPopup}
      harvest={this.harvest}
      BAVAPrice={this.state.BAVAPrice}
      tvl={this.state.tvl}
      apr={this.state.apr}
      apyDaily={this.state.apyDaily}
      farmloading={this.state.farmloading}
      aprloading={this.state.aprloading}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      farmV1Open={this.state.farmV1Open}
      farmV2Open={this.state.farmV2Open}
      accountLoading={this.state.accountLoading}
      lockedBavaTokenBalance={this.state.lockedBavaTokenBalance}
      totalTVL={this.state.totalTVL}
      bavaPoolSegmentInfo={this.state.bavaPoolSegmentInfo}
      bavaLpTokenPairsymbols={this.state.bavaLpTokenPairsymbols}
      bavaLpTokenAddresses={this.state.bavaLpTokenAddresses}
      bavaUserSegmentInfo={this.state.bavaUserSegmentInfo}
      bavaLpBalanceAccount={this.state.bavaLpBalanceAccount}
      bavaLpSegmentAllowance={this.state.bavaLpSegmentAllowance}
      bavaPendingSegmentReward={this.state.bavaPendingSegmentReward}
      bavatvl={this.state.bavatvl}
      bavaapr={this.state.bavaapr}
      bavaapyDaily={this.state.bavaapyDaily}
      returnRatio={this.state.returnRatio}
      bavaReturnRatio={this.state.bavaReturnRatio}
    />
    traderjoeV2Content = <TraderJoeV2
      lpTokenBalance={this.state.lpTokenBalance}
      bavaTokenBalance={this.state.bavaTokenBalance}
      deposit={this.deposit}
      withdraw={this.withdraw}
      approve={this.approve}
      setI={this.setI}
      connectMetamask={this.connectMetamask}
      lpSegmentAllowance={this.state.lpSegmentAllowance}
      bavaContract={this.state.bavaContract}
      bavaTokenTotalSupply={this.state.bavaTokenTotalSupply}
      totalpendingReward={this.state.totalpendingReward}
      userSegmentInfo={this.state.userSegmentInfo}
      poolSegmentInfo={this.state.poolSegmentInfo}
      lpBalanceAccount={this.state.lpBalanceAccount}
      pendingSegmentReward={this.state.pendingSegmentReward}
      buttonPopup={this.state.buttonPopup}
      harvest={this.harvest}
      BAVAPrice={this.state.BAVAPrice}
      tvl={this.state.tvl}
      apr={this.state.apr}
      apyDaily={this.state.apyDaily}
      farmloading={this.state.farmloading}
      aprloading={this.state.aprloading}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      farmV1Open={this.state.farmV1Open}
      farmV2Open={this.state.farmV2Open}
      accountLoading={this.state.accountLoading}
      lockedBavaTokenBalance={this.state.lockedBavaTokenBalance}
      totalTVL={this.state.totalTVL}
      bavaPoolSegmentInfo={this.state.bavaPoolSegmentInfo}
      bavaLpTokenPairsymbols={this.state.bavaLpTokenPairsymbols}
      bavaLpTokenAddresses={this.state.bavaLpTokenAddresses}
      bavaUserSegmentInfo={this.state.bavaUserSegmentInfo}
      bavaLpBalanceAccount={this.state.bavaLpBalanceAccount}
      bavaLpSegmentAllowance={this.state.bavaLpSegmentAllowance}
      bavaPendingSegmentReward={this.state.bavaPendingSegmentReward}
      bavatvl={this.state.bavatvl}
      bavaapr={this.state.bavaapr}
      bavaapyDaily={this.state.bavaapyDaily}
      returnRatio={this.state.returnRatio}
      bavaReturnRatio={this.state.bavaReturnRatio}
    />
    kyberContent = <Kyber
      lpTokenBalance={this.state.lpTokenBalance}
      bavaTokenBalance={this.state.bavaTokenBalance}
      deposit={this.deposit}
      withdraw={this.withdraw}
      approve={this.approve}
      setI={this.setI}
      connectMetamask={this.connectMetamask}
      lpSegmentAllowance={this.state.lpSegmentAllowance}
      bavaContract={this.state.bavaContract}
      bavaTokenTotalSupply={this.state.bavaTokenTotalSupply}
      totalpendingReward={this.state.totalpendingReward}
      poolSegmentInfo={this.state.poolSegmentInfo}
      buttonPopup={this.state.buttonPopup}
      harvest={this.harvest}
      reinvest={this.reinvest}
      reinvestAmount={this.state.reinvestAmount}
      BAVAPrice={this.state.BAVAPrice}
      AVAXPrice={this.state.AVAXPrice}
      tvl={this.state.tvl}
      apr={this.state.apr}
      apyDaily={this.state.apyDaily}
      farmloading={this.state.farmloading}
      aprloading={this.state.aprloading}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      farmV1Open={this.state.farmV1Open}
      farmV2Open={this.state.farmV2Open}
      accountLoading={this.state.accountLoading}
      lockedBavaTokenBalance={this.state.lockedBavaTokenBalance}
      totalTVL={this.state.totalTVL}
      returnRatio={this.state.returnRatio}
      bavaReturnRatio={this.state.bavaReturnRatio}
      poolSegmentInfoV2_3={this.state.poolSegmentInfoV2_3}
      lpTokenPairsymbolsV2_3={this.state.lpTokenPairsymbolsV2_3}
      lpTokenAddressesV2_3={this.state.lpTokenAddressesV2_3}
      returnRatioV2_3={this.state.returnRatioV2_3}
      tvlV2_3={this.state.tvlV2_3}
      aprV2_3={this.state.aprV2_3}
      apyDailyV2_3={this.state.apyDailyV2_3}
      userSegmentInfoV2_3={this.state.userSegmentInfoV2_3}
      lpBalanceAccountV2_3={this.state.lpBalanceAccountV2_3}
      lpSegmentAllowanceV2_3={this.state.lpSegmentAllowanceV2_3}
      pendingSegmentRewardV2_3={this.state.pendingSegmentRewardV2_3}
    />
    airdropContent = <Airdrop
      wallet={this.state.wallet}
      connectMetamask={this.connectMetamask}
      claimAirdrop={this.claimAirdrop}
      checkAirdrop={this.checkAirdrop}
      timeConverter={this.timeConverter}
      checkClaimAmount={this.checkClaimAmount}
      claimDistributePurse={this.claimDistributePurse}
      account={this.state.account}
      rewardEndTime={this.state.rewardEndTime}
      rewardStartTime={this.state.rewardStartTime}
      distributedAmount={this.state.distributedAmount}
      distributedPercentage={this.state.distributedPercentage}
      rewardStartTimeDate={this.state.rewardStartTimeDate}
      rewardEndTimeDate={this.state.rewardEndTimeDate}
      claimAmount={this.state.claimAmount}
      totalTransferAmount={this.state.totalTransferAmount}
      purseTokenTotalSupply={this.state.purseTokenTotalSupply}
      airdropStart={this.state.airdropStart}
      airdropEnd={this.state.airdropEnd}
      totalAirdropAmount={this.state.totalAirdropAmount}
      airdropAmount={this.state.airdropAmount}
      validAirdrop={this.state.validAirdrop}
      airdropCheck={this.state.airdropCheck}
    />
    stakeContent = <Stake
      bavaTokenBalance={this.state.bavaTokenBalance}
      BAVAPrice={this.state.BAVAPrice}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      accountLoading={this.state.accountLoading}
      lockedBavaTokenBalance={this.state.lockedBavaTokenBalance}
      totalStake={this.state.totalStake}
      stakeAmount={this.state.stakeAmount}
      earnedAmount={this.state.earnedAmount}
      rewardRate={this.state.rewardRate}
      bavaTokenAllowance={this.state.bavaTokenAllowance}
      farmloading={this.state.farmloading}
      connectMetamask={this.connectMetamask}
      approveStake={this.approveStake}
      stake={this.stake}
      unstake={this.unstake}
      getReward={this.getReward}
      exit={this.exit}
    />
    litepaperContent = <LitePaper
    />
    collateralContent = <Collateral
      connectMetamask={this.connectMetamask}
      collateralApprove={this.collateralApprove}
      depositAndBorrow={this.depositAndBorrow}
      repayUSB={this.repayUSB}
      systemCoinCollApprove={this.systemCoinCollApprove}
      withdrawBRTColl={this.withdrawBRTColl}
      BAVAPrice={this.state.BAVAPrice}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      accountLoading={this.state.accountLoading}
      farmloading={this.state.farmloading}
      collateralPoolSegmentInfo={this.state.collateralPoolSegmentInfo}
      collUserSegmentInfo={this.state.collUserSegmentInfo}
      collBRTBalanceAccount={this.state.collBRTBalanceAccount}
      collBRTSegmentAllowance={this.state.collBRTSegmentAllowance}
      collDebtBalance={this.state.collDebtBalance}
      collMaxBorrowAmount={this.state.collMaxBorrowAmount}
      totalPendingDebt={this.state.totalPendingDebt}
      collBRTValue={this.state.collBRTValue}
      collRatio={this.state.collRatio}
      colltvl={this.state.colltvl}
      collTotalTVL={this.state.collTotalTVL}
      aprloading={this.state.aprloading}
      systemCoinBalance={this.state.systemCoinBalance}
      systemCoinCollAllowance={this.state.systemCoinCollAllowance}
      collPoolRemainingAsset={this.state.collPoolRemainingAsset}
      systemCoinSupply={this.state.systemCoinSupply}
      collateralPoolLength={this.state.collateralPoolLength}
    />
    syntheticContent = <Synthetic
      accountLoading={this.state.accountLoading}
      farmloading={this.state.farmloading}
      aprloading={this.state.aprloading}
      synPool={this.state.synPool}
      synTokensymbols={this.state.synTokenPairsymbol}
      synTokenAddresses={this.state.syntokenAddress}
      synPoolSegmentInfo={this.state.synPoolSegmentInfo}
      synOraclePrice={this.state.synOraclePrice}
      synPoolPrice={this.state.synPoolPrice}
      walletConnect={this.state.walletConnect}
      wallet={this.state.wallet}
      systemCoinSynAllowance={this.state.systemCoinSynAllowance}
      synUserBalance={this.state.synUserBalance}
      synUserAllowance={this.state.synUserAllowance}
      synUserOpenOrderLength={this.state.synUserOpenOrderLength}
      synTotalSupply={this.state.synTotalSupply}
      systemCoinBalance={this.state.systemCoinBalance}
      synUserOrderInfo={this.state.synUserOrderInfo}
      systemCoinSyntheticApprove={this.systemCoinSyntheticApprove}
      synOpenOrder={this.synOpenOrder}
      synOpenLimitOrder={this.synOpenLimitOrder}
      synTokenSyntheticApprove={this.synTokenSyntheticApprove}
      synCancelOrder={this.synCancelOrder}
      synCancelAllOrder={this.synCancelAllOrder}
    />



    return (
      <Router>
        <div>
          <Switch>
            <Route path="/" exact > {navLandingContent} </Route>
            <Route path="/home" exact > {navLandingContent} </Route>
            <Route path="/menu" exact > {navMenuContent} </Route>
            <Route path="/menu/v2" exact > {navMenuContent} </Route>
            <Route path="/menu/v2/kyber" exact > {navMenuContent} </Route>
            <Route path="/menu/v2/traderjoe" exact > {navMenuContent} </Route>
            <Route path="/menu/traderjoe/" exact > {navMenuContent} </Route>
            <Route path="/claim/" exact > {navMenuContent} </Route>
            <Route path="/stake/" exact > {navMenuContent} </Route>
            <Route path="/litepaper" exact > {navMenuContent} </Route>
            <Route path="/synthetic" exact > {navMenuContent} </Route>
            <Route path="/collateral" exact > {navMenuContent} </Route>
          </Switch>
          <div className="container-fluid" style={{ marginTop: "80px" }}>
            <main role="main" className="content ml-auto mr-auto" style={{ maxWidth: '1000px' }}>
              <Switch>
                <Route path="/" exact > {mainContent} </Route>
                <Route path="/home" exact > {mainContent} </Route>
                <Route path="/menu" exact > {menuContent} </Route>
                <Route path="/menu/v2" exact > {menuV2Content} </Route>
                <Route path="/menu/v2/kyber" exact > {kyberContent} </Route>
                <Route path="/menu/v2/traderjoe" exact > {traderjoeV2Content} </Route>
                <Route path="/menu/traderjoe/" exact > {traderjoeContent} </Route>
                <Route path="/claim/" exact > {airdropContent} </Route>
                <Route path="/stake/" exact > {stakeContent} </Route>
                <Route path="/litepaper" exact > {litepaperContent} </Route>
                <Route path="/synthetic" exact > {syntheticContent} </Route>
                <Route path="/collateral" exact > {collateralContent} </Route>
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;