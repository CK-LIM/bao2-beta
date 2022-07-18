import React, { Component } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import bigInt from 'big-integer'
import Buttons from 'react-bootstrap/Button'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './App.css';
import Footer from './Footer'

class Stake extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: '',
            txValidAmount: false,
            txDeposit: false,
            txWithdraw: false
        }
        this.clickHandlerDeposit = this.clickHandlerDeposit.bind(this)
        this.clickHandlerWithdraw = this.clickHandlerWithdraw.bind(this)
    }

    changeHandler(event) {
        let result = !isNaN(+event); // true if its a number, false if not
        if (event == "") {
            this.setState({
                message: ''
            })
            this.setState({
                txValidAmount: false
            })
        } else if (result == false) {
            this.setState({
                message: 'Not a valid number'
            })
            this.setState({
                txValidAmount: false
            })
        } else if (event <= 0) {
            this.setState({
                message: 'Value need to be greater than 0'
            })
            this.setState({
                txValidAmount: false
            })
        }
        else {
            this.setState({
                message: ''
            })
            this.setState({
                txValidAmount: true
            })
        }
    }

    clickHandlerDeposit() {
        this.setState({
            txDeposit: true,
            txWithdraw: false
        })
    }

    clickHandlerWithdraw() {
        this.setState({
            txDeposit: false,
            txWithdraw: true
        })
    }

    setStake() {
        if (this.state.stakeOpen == true) {
            this.setState({
                unstakeOpen: false,
                stakeOpen: false
            })
        } else {
            this.setState({
                unstakeOpen: false,
                stakeOpen: true
            })
        }
    }

    setUnstake() {
        if (this.state.unstakeOpen == true) {
            this.setState({
                unstakeOpen: false,
                stakeOpen: false
            })
        } else {
            this.setState({
                unstakeOpen: true,
                stakeOpen: false
            })
        }
    }

    render() {
        const contentStyle = { background: '#fffae6', border: "1px solid #596169", width: "30%", borderRadius: "15px", minWidth: "320px" };
        return (
            <div id="content" style={{ margin: "0", color: '#ff9a04' }}>
                <label className="textWhite center mb-3" style={{ fontSize: '40px', color: 'black' }}><big><b>BAVA Staking</b></big></label>
                <div className="center mb-4" style={{ color: 'grey' }}>Deposit and stake your BAVA tokens to maximize your yield. No Impermanent Loss.</div>
                <div className="ml-auto mr-auto card mb-3 cardbody" style={{ width: '1000px', height: '140px', color: 'black' }}>
                    <div className="card-body">
                        <div className="center mb-3">
                            <table style={{ width: "900px" }}>
                                <thead className="textBlackSmall" style={{ color: 'black' }}>
                                    <tr>
                                        <th scope="col" width="100" style={{ border: '0px' }}><img src="/images/logo.png" width="50" height="50" alt="" /></th>
                                        <th scope="col" width="120" style={{ border: '0px' }}>BAVA Balance<div className='mt-3'>{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center">
                                            <div className="lds-facebook mt-3"><div></div><div></div><div></div></div></div>}</div></th>
                                        <th scope="col" width="120" style={{ border: '0px' }}>Staked BAVA<div className='mt-3'>{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.stakeAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.stakeAmount, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center">
                                            <div className="lds-facebook mt-3"><div></div><div></div><div></div></div></div>}</div></th>
                                        <th scope="col" width="120" style={{ border: '0px' }}>Unclaimed Reward<div className='mt-3'>{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.earnedAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.earnedAmount, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center">
                                            <div className="lds-facebook mt-3"><div></div><div></div><div></div></div></div>}</div></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="ml-auto mr-auto card mb-3 cardbody" style={{ width: '1000px', height: '140px', color: 'black' }}>
                    <div className="card-body ">
                        <div className="center ">
                            <table style={{ width: "900px" }}>
                                <thead className="textBlackSmall" style={{ color: 'black' }}>
                                    <tr>
                                        <th scope="col" width="100" style={{ border: '0px' }}><img src="/images/logo.png" width="50" height="50" alt="" /></th>
                                        <th scope="col" width="120" style={{ border: '0px' }}>Total BAVA Staked<div className='mt-3'><div>{parseFloat(window.web3Ava.utils.fromWei(this.props.totalStake, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.totalStake, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div></div></th>
                                        <th scope="col" width="120" style={{ border: '0px' }}>APR<div className='mt-3'><div>{parseFloat(this.props.rewardRate / this.props.totalStake * 31556926 * 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div></div></th>
                                        <th scope="col" width="120" style={{ border: '0px' }}>Your Pool%<div className='mt-3'>{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(this.props.stakeAmount / this.props.totalStake * 100).toLocaleString('en-US', { maximumFractionDigits: 5 })}% </div> : <div className="center">
                                            <div className="lds-facebook mt-3"><div></div><div></div><div></div></div></div>}</div></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="ml-auto mr-auto card mb-3 cardbody" style={{ width: '1000px', height: '140px', color: 'black' }}>
                    <div className="card-body ">
                        {this.props.wallet || this.props.walletConnect ?
                            <div className="card-body">
                                <div className="center ">
                                    {this.props.bavaTokenAllowance > 1000000000000000000 ?
                                        <div><Buttons className="textDarkMedium" variant="outline" size="lg" style={{ width: '160px', marginRight: '60px' }} onClick={async () => {
                                            await this.setStake(true)
                                        }}>Stake</Buttons>
                                            <Buttons className="textDarkMedium" variant="outline" size="lg" style={{ width: '160px', marginRight: '60px' }} onClick={async () => {
                                                await this.setUnstake(true)
                                            }}>Unstake</Buttons>
                                            <Buttons className="textDarkMedium" variant="outline" size="lg" style={{ width: '160px', marginRight: '60px' }} onClick={async () => {
                                                if (this.props.earnedAmount > 0) {
                                                    await this.props.getReward()
                                                } else {
                                                    alert("No unclaimed reward")
                                                }
                                            }}>Claim Reward</Buttons>
                                            <Buttons className="textDarkMedium" variant="outline" size="lg" style={{ width: '160px' }} onClick={async () => {
                                                if (this.props.stakeAmount > 0) {
                                                    await this.props.exit()
                                                } else {
                                                    alert("No staked BAVA token")
                                                }
                                            }}>Claim & Unstake</Buttons></div>
                                        :
                                        <div>
                                            <Buttons className="textDarkMedium" variant="outline" size="lg" style={{ width: '160px', marginRight: '60px' }} onClick={async () => {
                                                await this.props.approveStake()
                                            }}>Approve BAVA</Buttons>
                                            <Buttons className="textDarkMedium1" variant="outline" size="lg" style={{ width: '160px', marginRight: '60px' }} >Unstake</Buttons>
                                            <Buttons className="textDarkMedium1" variant="outline" size="lg" style={{ width: '160px', marginRight: '60px' }} >Claim Reward</Buttons>
                                            <Buttons className="textDarkMedium1" variant="outline" size="lg" style={{ width: '160px' }} >Claim & Unstake</Buttons>
                                        </div>}
                                </div>
                            </div> :
                            <div className="card-body">
                                <div className="center">
                                    {this.props.farmloading ?
                                        <div>
                                            <Popup trigger={open => (<Buttons className="textDarkMedium" variant="outline" size="lg" >Connect to display</Buttons>)} modal {...{ contentStyle }}>
                                                {close => (
                                                    <div>
                                                        <Buttons className="close cell2" style={{ background: "#fffae6", borderRadius: "12px", padding: "2px 5px", fontSize: "18px" }} onClick={close}>
                                                            &times;
                                                        </Buttons>
                                                        <div className="textWhiteMedium mb-2" style={{ borderBottom: "1px Solid Gray", padding: "10px" }}> Connect a Wallet </div>
                                                        <div className="center mt-4 mb-2">
                                                            <Buttons type="button" variant="secondary" style={{ height: "50px", width: "100%", minWidth: "150px", maxWidth: "300px", padding: "6px 25px" }} onClick={async () => {
                                                                await this.props.connectMetamask()
                                                            }}><img src="/images/metamask-fox.svg" width="23" height="23" className="float-right" alt="" /><span className="float-left">Metamask</span></Buttons>
                                                        </div>
                                                        <div className="center mt-2 mb-2">
                                                            <Buttons type="button" variant="secondary" style={{ height: "50px", width: "100%", minWidth: "150px", maxWidth: "300px", padding: "6px 25px" }} onClick={async () => {
                                                                await this.props.connectCoin98()
                                                            }}><img src="/images/coin98.png" width="23" height="23" className="float-right" alt="" /><span className="float-left">Coin98</span></Buttons>
                                                        </div>
                                                        <div className="center mt-2 mb-4">
                                                            <Buttons type="button" variant="secondary" style={{ height: "50px", width: "100%", minWidth: "150px", maxWidth: "300px", padding: "6px 25px" }} onClick={async () => {
                                                                await this.props.mobileWalletConnect()
                                                            }}><img src="/images/walletconnect-logo.svg" width="26" height="23" className="float-right" alt="" /><span className="float-left">WalletConnect</span></Buttons>
                                                        </div>
                                                    </div>
                                                )}
                                            </Popup>
                                        </div>
                                        : <Buttons className="textDarkMedium1" variant="outline" size="lg" >Connect to display</Buttons>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>


                {/* ******************************************************* PopUp deposit and withdraw menu ******************************************************* */}


                {(this.props.wallet || this.props.walletConnect) && (this.state.stakeOpen || this.state.unstakeOpen) ?
                    <div className="center">
                        <span className="card cardbody" style={{ width: '1000px' }}>
                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                <div>
                                    {this.state.stakeOpen ?
                                        <div className="float-right mr-2 mt-1 mb-2" style={{ color: 'black', fontSize: '16px' }}>Available to stake: {parseFloat(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div>
                                        :
                                        <div className="float-right mr-2 mt-1 mb-2" style={{ color: 'black', fontSize: '16px' }}>Available to unstake: {parseFloat(window.web3Ava.utils.fromWei(this.props.stakeAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div>
                                    }
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        if (this.state.txValidAmount === false) {
                                            alert("Invalid input! PLease check your input again")
                                        } else {
                                            let amount
                                            amount = this.input.value.toString()
                                            amount = window.web3Ava.utils.toWei(amount, 'Ether')

                                            if (this.state.txDeposit === true && this.state.txWithdraw === false) {
                                                if (this.props.bavaTokenBalance == 0) {
                                                    alert("Please get BAVA token to stake.")
                                                } else if (bigInt(amount).value > this.props.bavaTokenBalance) {
                                                    alert("Not enough funds")
                                                } else {
                                                    this.props.stake(amount)
                                                }
                                            } else if (this.state.txDeposit === false && this.state.txWithdraw === true) {
                                                if (this.props.stakeAmount == 0) {
                                                    alert("No staked BAVA token.")
                                                } else if (bigInt(amount).value > this.props.stakeAmount) {
                                                    alert("Withdraw tokens more than deposit tokens")
                                                } else {
                                                    this.props.unstake(amount)
                                                }
                                            }
                                        }
                                    }}>
                                        <div >
                                            <div className="input-group mb-4">
                                                <input
                                                    type="text"
                                                    ref={(input) => { this.input = input }}
                                                    className="form-control form-control-lg cardbody"
                                                    placeholder="0"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        this.changeHandler(value)
                                                    }}
                                                    required />
                                                <div className="input-group-append" >
                                                    <div className="input-group-text cardbody">
                                                        {<img src="/images/logo.png" height='32' alt="" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ color: 'red' }}>{this.state.message} </div>

                                            <div className="rowC center mb-3">
                                                {this.state.stakeOpen ?
                                                    <ButtonGroup>
                                                        <Buttons type="submit" className="textDarkMedium" variant="outline" size="lg" style={{ width: '120px' }} onClick={(event) => {
                                                            this.clickHandlerDeposit()
                                                        }}>&nbsp;Stake&nbsp;</Buttons>
                                                        <Buttons type="text" className="textDarkMedium" variant="outline" size="lg" style={{ width: '60px' }} onClick={(event1) => {
                                                            this.state.txDeposit = false
                                                            this.state.txWithdraw = false
                                                            this.input.value = window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether')
                                                        }}>All</Buttons>
                                                    </ButtonGroup> :
                                                    <ButtonGroup>
                                                        <Buttons type="submit" className="textDarkMedium" variant="outline" size="lg" style={{ width: '120px' }} onClick={(event2) => {
                                                            this.clickHandlerWithdraw()
                                                        }}>Unstake</Buttons>
                                                        <Buttons type="text" className="textDarkMedium" variant="outline" size="lg" style={{ width: '60px' }} onClick={(event3) => {
                                                            this.state.txDeposit = false
                                                            this.state.txWithdraw = false
                                                            this.input.value = window.web3Ava.utils.fromWei(this.props.stakeAmount, 'Ether')
                                                        }}>All</Buttons>
                                                    </ButtonGroup>
                                                }
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </span>
                    </div> :
                    <div>
                    </div>}<br /><br /><br /><Footer />
            </div >
        );
    }
}

export default Stake;
