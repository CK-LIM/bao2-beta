import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Buttons from 'react-bootstrap/Button'
import bigInt from 'big-integer'
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CollDepBorrow from './CollDepBorrow'
import CollResize from './CollResize'
import CollOnlyDep from './CollOnlyDep'
import CollRepay from './CollRepay'
import CollWithdraw from './CollWithdraw'
import CollOnlyBorrow from './CollOnlyBorrow'
import './App.css';
import Footer from './Footer'

class Collateral extends Component {

    constructor(props) {
        super(props)
        this.state = {
            collVaultOpen: [],
            collRatioChange: [],
            collRatioChangeUpdate: [],
            addLP: [],
            borrowUSB: [],
            actionOpen: [[], []]
        }
        this.clickfarmOpen = this.clickfarmOpen.bind(this)
        this.addLPCollRatio = this.addLPCollRatio.bind(this)
        this.addUSBDebtRatio = this.addUSBDebtRatio.bind(this)
        this.reduceUSBDebtRatio = this.reduceUSBDebtRatio.bind(this)
        this.reduceLPCollRatio = this.reduceLPCollRatio.bind(this)
        // this.countDecimals = this.countDecimals.bind(this)
        this.setAction = this.setAction.bind(this)
    }

    addLPCollRatio(newAddLP, i) {
        let ntg = 0
        this.state.addLP[i] = newAddLP
        if (newAddLP == '' || isNaN(newAddLP)) {
            this.state.addLP[i] = 0
        } else {
            this.state.addLP[i] = newAddLP
        }

        if (this.state.borrowUSB[i] == '' || isNaN(this.state.borrowUSB[i])) {
            this.state.borrowUSB[i] = 0
        }
        this.state.collRatioChange[i] = ((parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) + parseFloat(this.state.addLP[i])) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[i], 'Ether'))) / (parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[i].toLocaleString('en-US', 'Ether'))) + parseFloat(this.state.borrowUSB[i])) * 100
        this.state.collRatioChangeUpdate[i] = true
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    reduceLPCollRatio(newReduceLP, i) {
        let ntg = 0
        // this.state.addLP[i] = newAddLP
        if (this.props.collDebtBalance[i] == 0) {
            this.state.collRatioChange[i] = 1 / 0
        } else {
            if (newReduceLP == '' || isNaN(newReduceLP)) {
                newReduceLP = 0
            }
            let newCollRatio = ((parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) - parseFloat(newReduceLP)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[i], 'Ether'))) / parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[i].toLocaleString('en-US', 'Ether'))) * 100
            if (newCollRatio > 0) {
                this.state.collRatioChange[i] = newCollRatio
            } else {
                this.state.collRatioChange[i] = 0
            }
        }
        this.state.collRatioChangeUpdate[i] = true
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    addUSBDebtRatio(newBorrow, i) {
        let ntg = 0
        if (newBorrow == '' || isNaN(newBorrow)) {
            this.state.borrowUSB[i] = 0
        } else {
            this.state.borrowUSB[i] = newBorrow
        }
        if (this.state.addLP[i] == '' || isNaN(this.state.addLP[i])) {
            this.state.addLP[i] = 0
        }

        this.state.collRatioChange[i] = ((parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) + parseFloat(this.state.addLP[i])) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[i].toLocaleString('en-US'), 'Ether'))) / (parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[i].toLocaleString('en-US', 'Ether'))) + parseFloat(this.state.borrowUSB[i])) * 100
        this.state.collRatioChangeUpdate[i] = true
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    reduceUSBDebtRatio(newRepay, i) {
        let ntg = 0
        let newCollRatioChange

        if (newRepay == '' || isNaN(newRepay)) {
            this.state.borrowUSB[i] = '0'
        } else {
            if (this.countDecimals(newRepay) > 18) {
                this.state.borrowUSB[i] = (parseFloat(newRepay).toLocaleString('en-US', { maximumFractionDigits: 18 }))
            } else {
                this.state.borrowUSB[i] = newRepay
            }
        }
        let totalCollateral = bigInt(this.props.collUserSegmentInfo[i]).value * bigInt(window.web3Ava.utils.fromWei(this.props.collBRTValue[i].toLocaleString('en-US'), 'Ether')).value
        let totalDebt = bigInt(this.props.collDebtBalance[i]).value - bigInt(window.web3Ava.utils.toWei(this.state.borrowUSB[i], 'Ether')).value
        if (totalDebt <= 0) {
            newCollRatioChange = 1 / 0
        } else {
            newCollRatioChange = (totalCollateral) * bigInt(100000).value / (totalDebt)
        }
        this.state.collRatioChange[i] = Number(newCollRatioChange) / 1000
        this.state.collRatioChangeUpdate[i] = true
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    countDecimals(x) {
        if (Math.floor(x.valueOf()) === x.valueOf()) return 0;
        var str = x.toString();
        if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
            return str.split("-")[1] || 0;
        } else if (str.indexOf(".") !== -1) {
            return str.split(".")[1].length || 0;
        }
        return str.split("-")[1] || 0;
    }

    setAction(page, i, boolean) {
        let ntg = 0
        this.state.actionOpen[i][page] = boolean
        this.state.collRatioChange[i] = '0'
        this.state.addLP[i] = '0'
        this.state.borrowUSB[i] = '0'
        this.state.collRatioChangeUpdate[i] = false
        this.setState({ ntg })
    }

    clickfarmOpen(pair) {
        let ntg = 0
        this.state.collVaultOpen[pair] = !(this.state.collVaultOpen[pair])
        this.state.actionOpen[pair][0] = true
        this.setState({ ntg })  //do ntg, just to push react setstate
    }


    render() {
        const contentStyle = { background: '#fffae6', border: "1px solid #596169", width: "30%", borderRadius: "15px", minWidth: "320px" };
        return (
            <div id="content" style={{color: '#ff9a04' }}>
                <div >
                    <div className="ml-auto mr-auto card mb-3 cardbody" style={{ height: '170px', color: 'black' }}>
                        {this.props.wallet || this.props.walletConnect ?
                            <div className="card-body">
                                <div className='mb-5'>
                                    <span className="float-left" style={{ color: 'black', fontSize: '16px' }}>USB supply&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={12} /></span>
                                            )}
                                            on="hover"
                                            offsetX={10}
                                            position="right center"
                                        ><span className="textInfo"><small>The total USB minted by the Baklava Protocol.</small></span>
                                        </Popup><br /><b>{parseFloat(window.web3Ava.utils.fromWei(this.props.systemCoinSupply, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} USB</b>
                                    </span>
                                    <span className="float-right" style={{ color: 'black', fontSize: '16px' }}>
                                        Troves<br /><b className="float-right">{this.props.collateralPoolLength}</b>
                                    </span>
                                </div><br /><br />
                                <div>
                                    <span className="float-left" style={{ color: 'black', fontSize: '16px' }}>Total pending Debt&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={12} /></span>
                                            )}
                                            on="hover"
                                            offsetX={10}
                                            position="right center"
                                        ><span className="textInfo"><small>Total USB Debt acrossed all collateral troves.</small></span>
                                        </Popup>
                                    </span><br />
                                    <span className="float-left " style={{ color: 'black', fontSize: '16px' }}><b>
                                        {parseFloat(window.web3Ava.utils.fromWei(this.props.totalPendingDebt, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} USB
                                    </b>
                                    </span>
                                </div>
                            </div>
                            :
                            <div className="card-body ">
                                <span>
                                    <span className="float-left" style={{ color: 'silver' }}>
                                        USB supply<br />
                                        <div style={{ color: 'silver' }}><b>0 USB</b></div>
                                    </span>
                                    <span className="float-right" style={{ color: 'silver' }}>
                                        Troves<br />
                                        <div className="float-right" style={{ color: 'silver' }}><b>0 </b></div>
                                    </span>
                                    <br /><br />
                                </span>
                                <span className="center mb-1">
                                    {this.props.farmloading ?
                                        <div>
                                        <Popup trigger={open => (<Buttons className="textDarkMedium cell2" variant="outline" size="lg" >Connect to display</Buttons>)} modal {...{ contentStyle }}>
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
                                    </div> :
                                        <Buttons className="textDarkMedium1 cell2" variant="outline" size="lg" >Connect to display</Buttons>
                                    }
                                </span>
                                <span>
                                    <span className="float-left" style={{ color: 'silver' }}>Your total pending Debt&nbsp;&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={12} /></span>
                                            )}
                                            on="hover"
                                            offsetX={10}
                                            position="right center"
                                        ><span className="textInfo"><small>Total USB Debt acrossed all collateral troves.</small></span>
                                        </Popup>
                                    </span><br />
                                    <span className="float-left ">
                                        <div style={{ color: 'silver' }}><b>0 USB</b></div>
                                    </span>
                                </span>
                            </div>
                        }
                    </div>
                </div>

                <div className="textMiddle center" ><b><big>BAVA Price: $ {this.props.BAVAPrice}&nbsp;&nbsp;</big></b></div>
                <div className="center" style={{ color: 'grey' }}><small>&nbsp;! Attention:&nbsp;Be sure to read <a href="https://baklavaspace.gitbook.io/" target="_blank">baklavaspace.gitbook</a> before using the pools so you are familiar with protocol risks and fees!</small></div>

                <div className="ml-auto mr-auto mt-3">
                    <div className="">
                        <div className="textMiddleBold1 float-left" style={{ marginLeft: '2px' }}><big>Platform</big></div>
                        <div className="textMiddleBold1 float-right" style={{ marginRight: '5px' }}><big>TVL $ {parseFloat(this.props.collTotalTVL).toLocaleString('en-US', { maximumFractionDigits: 0 })}</big></div><br /><br />
                        <span className="float-left">
                            <ButtonGroup>
                                <Buttons className="mr-1" variant="outlined" size="small" color="inherit" as={Link} to="/collateral/">Pangolin</Buttons>
                            </ButtonGroup>
                        </span>
                    </div>
                    <br /><br />



                    <div>
                        {this.props.farmloading ?
                            <div className="">
                                {this.props.collateralPoolSegmentInfo.map((collateralPoolSegmentInfo, key) => {
                                    let i = this.props.collateralPoolSegmentInfo.indexOf(collateralPoolSegmentInfo)
                                    return (
                                        <div key={key}>
                                            <div>
                                                {this.props.collateralPoolSegmentInfo[i].lpName == "BAVA-AVAX" ? <div></div> :
                                                    <div className="card mb-3 cardbody">
                                                        <div className="card-body" style={{ padding: '1rem' }}>
                                                            <div className="card cardbody" style={{ border: '0px' }}>
                                                                <MediaQuery minWidth={1001}>
                                                                    <div className='card-body rowC' style={{ padding: '0rem', cursor: 'pointer' }} onClick={() => {
                                                                        this.clickfarmOpen(i)
                                                                    }}>
                                                                        <div className="float-left rowC" style={{ minWidth: '250px' }}>
                                                                            <span className="mr-3 mt-2">
                                                                                <div className="textMiddle" style={{ width: '48px' }}>
                                                                                    {this.props.collateralPoolSegmentInfo[i].icon.map((icon, key) => {
                                                                                        return (
                                                                                            <img key={key} className={icon.imagePosition} src={`/images/${icon.image}`} width={icon.imageSize} height={icon.imageSize} alt="" />
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </span>
                                                                            <span>
                                                                                <div className="textMiddle"><b>{this.props.collateralPoolSegmentInfo[i].lpName} (BRT){this.props.collateralPoolSegmentInfo[i].status}</b></div>
                                                                                <div className="textGrey exLink0" style={{ width: "140px" }} onClick={() => {
                                                                                    window.open(this.props.collateralPoolSegmentInfo[i].projectLink, '_blank')
                                                                                }}>LP-Platform: {this.props.collateralPoolSegmentInfo[i].platform} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" style={{ width: "140px" }} onClick={() => {
                                                                                    window.open(this.props.collateralPoolSegmentInfo[i].getLPLink, '_blank')
                                                                                }}>Get {this.props.collateralPoolSegmentInfo[i].lpName}(BRT) <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                            </span>
                                                                        </div>
                                                                        <div className="ml-5">
                                                                            <table className="float-right mr-auto">
                                                                                <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                    <tr>
                                                                                        <th scope="col" width="140">Wallet</th>
                                                                                        <th scope="col" width="140">Collateral</th>
                                                                                        <th scope="col">Min Coll. Ratio</th>
                                                                                        <th scope="col">Borrowing Fee</th>
                                                                                        <th scope="col">TVL</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="textGrey">
                                                                                    <tr>
                                                                                        <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                            : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                        <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                            : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className=""><div>{parseFloat(this.props.collateralPoolSegmentInfo[i].minCollRatio).toLocaleString('en-US', { maximumFractionDigits: 5 })}%</div></td>
                                                                                        <td className="">1%</td>
                                                                                        <td className="">{this.props.aprloading ? <div>$ {parseFloat(this.props.colltvl[i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </MediaQuery>

                                                                <MediaQuery maxWidth={1000}>
                                                                    <div className='card-body' style={{ padding: '0rem', cursor: 'pointer' }} onClick={() => {
                                                                        this.clickfarmOpen(i)
                                                                    }}>
                                                                        <div className="float-left rowC mb-3" style={{ minWidth: '250px' }}>
                                                                            <span className="mr-3 mt-2">
                                                                                <div className="textMiddle" style={{ width: '48px' }}>
                                                                                    {this.props.collateralPoolSegmentInfo[i].icon.map((icon, key) => {
                                                                                        return (
                                                                                            <img key={key} className={icon.imagePosition} src={`/images/${icon.image}`} width={icon.imageSize} height={icon.imageSize} alt="" />
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </span>
                                                                            <span>
                                                                                <div className="textMiddle"><b>{this.props.collateralPoolSegmentInfo[i].lpName} (BRT){this.props.collateralPoolSegmentInfo[i].status}</b></div>
                                                                                <div className="textGrey exLink0" style={{ width: "140px" }} onClick={() => {
                                                                                    window.open(this.props.collateralPoolSegmentInfo[i].projectLink, '_blank')
                                                                                }}>LP-Platform: {this.props.collateralPoolSegmentInfo[i].platform} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" style={{ width: "140px" }} onClick={() => {
                                                                                    window.open(this.props.collateralPoolSegmentInfo[i].getLPLink, '_blank')
                                                                                }}>Get {this.props.collateralPoolSegmentInfo[i].lpName}(BRT) <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                            </span>
                                                                        </div>
                                                                        <MediaQuery minWidth={701}>
                                                                            <div>
                                                                                <table className="float-right mr-auto">
                                                                                    <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                        <tr>
                                                                                            <th scope="col" width="140">Wallet</th>
                                                                                            <th scope="col" width="140">Collateral</th>
                                                                                            <th scope="col">Min Coll. Ratio</th>
                                                                                            <th scope="col">Borrowing Fee</th>
                                                                                            <th scope="col">TVL</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className="textGrey">
                                                                                        <tr>
                                                                                            <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                                : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                            <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                                : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            <td className=""><div>{parseFloat(this.props.collateralPoolSegmentInfo[i].minCollRatio).toLocaleString('en-US', { maximumFractionDigits: 5 })}%</div></td>
                                                                                            <td className="">1%</td>
                                                                                            <td className="">{this.props.aprloading ? <div>$ {parseFloat(this.props.colltvl[i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </MediaQuery>
                                                                        <MediaQuery maxWidth={700}>
                                                                            <MediaQuery minWidth={551}>
                                                                                <div>
                                                                                    <table className="float-right mr-auto">
                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col" width="140">Wallet</th>
                                                                                                <th scope="col" width="140">Collateral</th>
                                                                                                <th scope="col">Min Coll. Ratio</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                                    : <div className="center">
                                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                                    : <div className="center">
                                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                                <td className=""><div>{parseFloat(this.props.collateralPoolSegmentInfo[i].minCollRatio).toLocaleString('en-US', { maximumFractionDigits: 5 })}%</div></td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col">Borrowing Fee</th>
                                                                                                <th scope="col">TVL</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">1%</td>
                                                                                                <td className="">{this.props.aprloading ? <div>$ {parseFloat(this.props.colltvl[i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </MediaQuery>
                                                                            
                                                                            <MediaQuery maxWidth={550}>
                                                                                <div>
                                                                                    <table className="float-right mr-auto">
                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col" width="140">Wallet</th>
                                                                                                <th scope="col" width="140">Collateral</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                                    : <div className="center" style={{ height: '15.5px' }}><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div>
                                                                                                    : <div className="center" style={{ height: '15.5px' }}><div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            </tr>
                                                                                        </tbody>

                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col">Min Coll. Ratio</th>
                                                                                                <th scope="col">Borrowing Fee</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className=""><div>{parseFloat(this.props.collateralPoolSegmentInfo[i].minCollRatio).toLocaleString('en-US', { maximumFractionDigits: 5 })}%</div></td>
                                                                                                <td className="">1%</td>
                                                                                            </tr>
                                                                                        </tbody>

                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col">TVL</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{this.props.aprloading ? <div>$ {parseFloat(this.props.colltvl[i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> : <div className="center" style={{ height: '15.5px' }}>
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </MediaQuery>
                                                                        </MediaQuery>
                                                                    </div>
                                                                </MediaQuery>
                                                            </div>


                                                            {this.state.collVaultOpen[i] ?
                                                                <div>
                                                                    {this.props.wallet || this.props.walletConnect ?
                                                                        <div className="borderTop ">
                                                                            <div className="mt-3">
                                                                                <MediaQuery minWidth={851}>
                                                                                    <div className="float-left">
                                                                                        <div className="card cardbody mr-2" style={{ marginBottom: '6px', width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Trove available USB</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{(parseFloat(this.props.collPoolRemainingAsset[i]).toLocaleString('en-US', { maximumFractionDigits: 2 }))} USB</div> :
                                                                                                    <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody mr-3" style={{ marginBottom: '6px', width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Your Coll. Ratio</small></span><br />
                                                                                                <span className="float-left" style={{ marginTop: '8px' }}><small>{this.props.accountLoading ?
                                                                                                    <div>
                                                                                                        {(this.state.collRatioChangeUpdate[i] == true) ?
                                                                                                            <div>{this.state.collRatioChange[i] > this.props.collateralPoolSegmentInfo[i].minCollRatio ? <div style={{ color: 'black' }}>{this.state.collRatioChange[i].toLocaleString('en-US', { maximumFractionDigits: 3 })} %</div>
                                                                                                                : <div style={{ color: 'red' }}>{parseFloat(this.state.collRatioChange[i]).toLocaleString('en-US', { maximumFractionDigits: 3 })}%</div>}</div>
                                                                                                            : <div>{this.props.collRatio[i] > this.props.collateralPoolSegmentInfo[i].minCollRatio ? <div style={{ color: 'black' }}>{this.props.collRatio[i].toLocaleString('en-US', { maximumFractionDigits: 3 })} %</div>
                                                                                                                : <div style={{ color: 'red' }}>{parseFloat(this.props.collRatio[i]).toLocaleString('en-US', { maximumFractionDigits: 3 })} %</div>}</div>}
                                                                                                    </div>
                                                                                                    : <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody mr-3" style={{ marginBottom: '6px', width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Collateral to be locked </small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ?
                                                                                                    <div>
                                                                                                        {this.props.collDebtBalance[i] == 0 ? <div>0 / $ 0</div> : <div>{this.props.collMaxBorrowAmount > 0 ?
                                                                                                            <div>{(parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) - parseFloat(this.props.collMaxBorrowAmount / this.props.collBRTValue[i] * this.props.collateralPoolSegmentInfo[i].minCollRatio / 100)).toLocaleString('en-US', { maximumFractionDigits: 18 })} BRT / $ {((parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) - parseFloat(this.props.collMaxBorrowAmount / this.props.collBRTValue[i] * this.props.collateralPoolSegmentInfo[i].minCollRatio / 100)) * window.web3Ava.utils.fromWei(this.props.collBRTValue[i], 'ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })}</div>
                                                                                                            : <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })} BRT / $ {(parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) * window.web3Ava.utils.fromWei(this.props.collBRTValue[i], 'ether')).toLocaleString('en-US', { maximumFractionDigits: 2 })} </div>}</div>}
                                                                                                    </div>
                                                                                                    : <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody  mr-3" style={{ width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Total Debt</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[i].toLocaleString('en-US'), 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })} USB</div>
                                                                                                    : <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </MediaQuery>

                                                                                <MediaQuery maxWidth={850}>
                                                                                    <div>
                                                                                        <div className="card cardbody" style={{ marginBottom: '6px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Trove available USB</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{(parseFloat(this.props.collPoolRemainingAsset[i]).toLocaleString('en-US', { maximumFractionDigits: 2 }))} USB</div> :
                                                                                                    <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody" style={{ marginBottom: '6px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Your Coll. Ratio</small></span><br />
                                                                                                <span className="float-left" style={{ marginTop: '8px' }}><small>{this.props.accountLoading ?
                                                                                                    <div>
                                                                                                        {(this.state.collRatioChangeUpdate[i] == true) ?
                                                                                                            <div>{this.state.collRatioChange[i] > this.props.collateralPoolSegmentInfo[i].minCollRatio ? <div style={{ color: 'black' }}>{this.state.collRatioChange[i].toLocaleString('en-US', { maximumFractionDigits: 3 })} %</div>
                                                                                                                : <div style={{ color: 'red' }}>{parseFloat(this.state.collRatioChange[i]).toLocaleString('en-US', { maximumFractionDigits: 3 })}%</div>}</div>
                                                                                                            : <div>{this.props.collRatio[i] > this.props.collateralPoolSegmentInfo[i].minCollRatio ? <div style={{ color: 'black' }}>{this.props.collRatio[i].toLocaleString('en-US', { maximumFractionDigits: 3 })} %</div>
                                                                                                                : <div style={{ color: 'red' }}>{parseFloat(this.props.collRatio[i]).toLocaleString('en-US', { maximumFractionDigits: 3 })} %</div>}</div>}
                                                                                                    </div>
                                                                                                    : <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody" style={{ marginBottom: '6px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Collateral to be locked </small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ?
                                                                                                    <div>
                                                                                                        {this.props.collDebtBalance[i] == 0 ? <div>0 / $ 0</div> : <div>{this.props.collMaxBorrowAmount > 0 ?
                                                                                                            <div>{(parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) - parseFloat(this.props.collMaxBorrowAmount / this.props.collBRTValue[i] * this.props.collateralPoolSegmentInfo[i].minCollRatio / 100)).toLocaleString('en-US', { maximumFractionDigits: 18 })} BRT / $ {((parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) - parseFloat(this.props.collMaxBorrowAmount / this.props.collBRTValue[i] * this.props.collateralPoolSegmentInfo[i].minCollRatio / 100)) * window.web3Ava.utils.fromWei(this.props.collBRTValue[i], 'ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })}</div>
                                                                                                            : <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })} BRT / $ {(parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[i], 'Ether')) * window.web3Ava.utils.fromWei(this.props.collBRTValue[i], 'ether')).toLocaleString('en-US', { maximumFractionDigits: 2 })} </div>}</div>}
                                                                                                    </div>
                                                                                                    : <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody" style={{ marginBottom: '6px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Total Debt</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[i].toLocaleString('en-US'), 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 3 })} USB</div>
                                                                                                    : <div className="ml-3"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </MediaQuery>



                                                                                <div className="card cardbody" style={{ minWidth: '350px' }}>
                                                                                    <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                        {this.props.collUserSegmentInfo[i] > 0 ?
                                                                                            <div className='ml-2 mt-2 mb-2'>
                                                                                                {this.state.actionOpen[i][0] == true ?
                                                                                                    <ButtonGroup>
                                                                                                        <div>
                                                                                                            <Buttons className="textTransparentButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, true)
                                                                                                                await this.setAction(1, i, false)
                                                                                                                await this.setAction(2, i, false)
                                                                                                                await this.setAction(3, i, false)
                                                                                                            }}><b>Resize Vault</b></Buttons></div>
                                                                                                        <div>
                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, false)
                                                                                                                await this.setAction(1, i, true)
                                                                                                                await this.setAction(2, i, false)
                                                                                                                await this.setAction(3, i, false)
                                                                                                            }}>Borrow USB</Buttons></div>
                                                                                                        <div>
                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, false)
                                                                                                                await this.setAction(1, i, false)
                                                                                                                await this.setAction(2, i, true)
                                                                                                                await this.setAction(3, i, false)
                                                                                                            }}>Repay USB</Buttons></div>
                                                                                                        <div>
                                                                                                            <Buttons className="textBlackButton center" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, false)
                                                                                                                await this.setAction(1, i, false)
                                                                                                                await this.setAction(2, i, false)
                                                                                                                await this.setAction(3, i, true)
                                                                                                            }}>Withdraw BRT</Buttons></div>
                                                                                                    </ButtonGroup>
                                                                                                    : <div>
                                                                                                        {this.state.actionOpen[i][1] == true ?
                                                                                                            <ButtonGroup>
                                                                                                                <div>
                                                                                                                    <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                        await this.setAction(0, i, true)
                                                                                                                        await this.setAction(1, i, false)
                                                                                                                        await this.setAction(2, i, false)
                                                                                                                        await this.setAction(3, i, false)
                                                                                                                    }}><b>Resize Vault</b></Buttons></div>
                                                                                                                <div>
                                                                                                                    <Buttons className="textTransparentButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                        await this.setAction(0, i, false)
                                                                                                                        await this.setAction(1, i, true)
                                                                                                                        await this.setAction(2, i, false)
                                                                                                                        await this.setAction(3, i, false)
                                                                                                                    }}>Borrow USB</Buttons></div>
                                                                                                                <div>
                                                                                                                    <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                        await this.setAction(0, i, false)
                                                                                                                        await this.setAction(1, i, false)
                                                                                                                        await this.setAction(2, i, true)
                                                                                                                        await this.setAction(3, i, false)
                                                                                                                    }}>Repay USB</Buttons></div>
                                                                                                                <div>
                                                                                                                    <Buttons className="textBlackButton center" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                        await this.setAction(0, i, false)
                                                                                                                        await this.setAction(1, i, false)
                                                                                                                        await this.setAction(2, i, false)
                                                                                                                        await this.setAction(3, i, true)
                                                                                                                    }}>Withdraw BRT</Buttons></div>
                                                                                                            </ButtonGroup>
                                                                                                            : <div>
                                                                                                                {this.state.actionOpen[i][2] == true ?
                                                                                                                    <ButtonGroup>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, true)
                                                                                                                                await this.setAction(1, i, false)
                                                                                                                                await this.setAction(2, i, false)
                                                                                                                                await this.setAction(3, i, false)
                                                                                                                            }}><b>Resize Vault</b></Buttons></div>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, false)
                                                                                                                                await this.setAction(1, i, true)
                                                                                                                                await this.setAction(2, i, false)
                                                                                                                                await this.setAction(3, i, false)
                                                                                                                            }}>Borrow USB</Buttons></div>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textTransparentButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, false)
                                                                                                                                await this.setAction(1, i, false)
                                                                                                                                await this.setAction(2, i, true)
                                                                                                                                await this.setAction(3, i, false)
                                                                                                                            }}>Repay USB</Buttons></div>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textBlackButton center" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, false)
                                                                                                                                await this.setAction(1, i, false)
                                                                                                                                await this.setAction(2, i, false)
                                                                                                                                await this.setAction(3, i, true)
                                                                                                                            }}>Withdraw BRT</Buttons></div>
                                                                                                                    </ButtonGroup>
                                                                                                                    : <ButtonGroup>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, true)
                                                                                                                                await this.setAction(1, i, false)
                                                                                                                                await this.setAction(2, i, false)
                                                                                                                                await this.setAction(3, i, false)
                                                                                                                            }}><b>Resize Vault</b></Buttons></div>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, false)
                                                                                                                                await this.setAction(1, i, true)
                                                                                                                                await this.setAction(2, i, false)
                                                                                                                                await this.setAction(3, i, false)
                                                                                                                            }}>Borrow USB</Buttons></div>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, false)
                                                                                                                                await this.setAction(1, i, false)
                                                                                                                                await this.setAction(2, i, true)
                                                                                                                                await this.setAction(3, i, false)
                                                                                                                            }}>Repay USB</Buttons></div>
                                                                                                                        <div>
                                                                                                                            <Buttons className="textTransparentButton center" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                await this.setAction(0, i, false)
                                                                                                                                await this.setAction(1, i, false)
                                                                                                                                await this.setAction(2, i, false)
                                                                                                                                await this.setAction(3, i, true)
                                                                                                                            }}>Withdraw BRT</Buttons></div>
                                                                                                                    </ButtonGroup>
                                                                                                                }
                                                                                                            </div>
                                                                                                        }
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                            :
                                                                                            <div className='ml-2 mt-2 mb-2'>
                                                                                                {(this.state.actionOpen[i][1]) ?
                                                                                                    <ButtonGroup>
                                                                                                        <div>
                                                                                                            <Buttons className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, true)
                                                                                                                await this.setAction(1, i, false)
                                                                                                            }}><b>Deposit & Borrow</b></Buttons>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <Buttons className="textTransparentButton center" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, false)
                                                                                                                await this.setAction(1, i, true)
                                                                                                            }}>Only Deposit</Buttons>
                                                                                                        </div>
                                                                                                    </ButtonGroup>
                                                                                                    :
                                                                                                    <ButtonGroup>
                                                                                                        <div>
                                                                                                            <Buttons className="textTransparentButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, true)
                                                                                                                await this.setAction(1, i, false)
                                                                                                            }}><b>Deposit & Borrow</b></Buttons>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <Buttons className="textBlackButton center" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(0, i, false)
                                                                                                                await this.setAction(1, i, true)
                                                                                                            }}>Only Deposit</Buttons>
                                                                                                        </div>
                                                                                                    </ButtonGroup>
                                                                                                }
                                                                                            </div>
                                                                                        }

                                                                                        <div className='borderBottom'></div>
                                                                                        <div className='ml-1 mr-1'>
                                                                                            {this.props.collUserSegmentInfo[i] > 0 ?
                                                                                                <div>
                                                                                                    {this.state.actionOpen[i][0] == true ?
                                                                                                        <div>
                                                                                                            <CollResize
                                                                                                                wallet={this.props.wallet}
                                                                                                                walletConnect={this.props.walletConnect}
                                                                                                                accountLoading={this.props.accountLoading}
                                                                                                                collBRTBalanceAccount={this.props.collBRTBalanceAccount}
                                                                                                                collDebtBalance={this.props.collDebtBalance}
                                                                                                                collBRTValue={this.props.collBRTValue}
                                                                                                                collateralPoolSegmentInfo={this.props.collateralPoolSegmentInfo}
                                                                                                                collBRTSegmentAllowance={this.props.collBRTSegmentAllowance}
                                                                                                                collUserSegmentInfo={this.props.collUserSegmentInfo}
                                                                                                                systemCoinBalance={this.props.systemCoinBalance}
                                                                                                                collPoolRemainingAsset={this.props.collPoolRemainingAsset}
                                                                                                                addLPCollRatio={this.addLPCollRatio}
                                                                                                                addUSBDebtRatio={this.addUSBDebtRatio}
                                                                                                                collateralApprove={this.props.collateralApprove}
                                                                                                                depositAndBorrow={this.props.depositAndBorrow}
                                                                                                                i={i}
                                                                                                            />
                                                                                                        </div>
                                                                                                        : <div>
                                                                                                            {this.state.actionOpen[i][1] == true ?
                                                                                                                <div >
                                                                                                                    <CollOnlyBorrow
                                                                                                                        wallet={this.props.wallet}
                                                                                                                        walletConnect={this.props.walletConnect}
                                                                                                                        accountLoading={this.props.accountLoading}
                                                                                                                        collBRTBalanceAccount={this.props.collBRTBalanceAccount}
                                                                                                                        collDebtBalance={this.props.collDebtBalance}
                                                                                                                        collBRTValue={this.props.collBRTValue}
                                                                                                                        collateralPoolSegmentInfo={this.props.collateralPoolSegmentInfo}
                                                                                                                        collBRTSegmentAllowance={this.props.collBRTSegmentAllowance}
                                                                                                                        collUserSegmentInfo={this.props.collUserSegmentInfo}
                                                                                                                        systemCoinBalance={this.props.systemCoinBalance}
                                                                                                                        collPoolRemainingAsset={this.props.collPoolRemainingAsset}
                                                                                                                        addLPCollRatio={this.addLPCollRatio}
                                                                                                                        addUSBDebtRatio={this.addUSBDebtRatio}
                                                                                                                        collateralApprove={this.props.collateralApprove}
                                                                                                                        depositAndBorrow={this.props.depositAndBorrow}
                                                                                                                        i={i}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                : <div>
                                                                                                                    {this.state.actionOpen[i][2] == true ?
                                                                                                                        <div>
                                                                                                                            <CollRepay
                                                                                                                                wallet={this.props.wallet}
                                                                                                                                walletConnect={this.props.walletConnect}
                                                                                                                                accountLoading={this.props.accountLoading}
                                                                                                                                collBRTBalanceAccount={this.props.collBRTBalanceAccount}
                                                                                                                                collDebtBalance={this.props.collDebtBalance}
                                                                                                                                collBRTValue={this.props.collBRTValue}
                                                                                                                                collateralPoolSegmentInfo={this.props.collateralPoolSegmentInfo}
                                                                                                                                collUserSegmentInfo={this.props.collUserSegmentInfo}
                                                                                                                                systemCoinBalance={this.props.systemCoinBalance}
                                                                                                                                systemCoinCollAllowance={this.props.systemCoinCollAllowance}
                                                                                                                                reduceUSBDebtRatio={this.reduceUSBDebtRatio}
                                                                                                                                systemCoinCollApprove={this.props.systemCoinCollApprove}
                                                                                                                                repayUSB={this.props.repayUSB}
                                                                                                                                i={i}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                        : <div>
                                                                                                                            <CollWithdraw
                                                                                                                                wallet={this.props.wallet}
                                                                                                                                walletConnect={this.props.walletConnect}
                                                                                                                                accountLoading={this.props.accountLoading}
                                                                                                                                collBRTBalanceAccount={this.props.collBRTBalanceAccount}
                                                                                                                                collDebtBalance={this.props.collDebtBalance}
                                                                                                                                collBRTValue={this.props.collBRTValue}
                                                                                                                                collateralPoolSegmentInfo={this.props.collateralPoolSegmentInfo}
                                                                                                                                collBRTSegmentAllowance={this.props.collBRTSegmentAllowance}
                                                                                                                                collUserSegmentInfo={this.props.collUserSegmentInfo}
                                                                                                                                systemCoinBalance={this.props.systemCoinBalance}
                                                                                                                                reduceLPCollRatio={this.reduceLPCollRatio}
                                                                                                                                withdrawBRTColl={this.props.withdrawBRTColl}
                                                                                                                                i={i}
                                                                                                                            />
                                                                                                                        </div>}
                                                                                                                </div>
                                                                                                            }</div>
                                                                                                    }</div> :
                                                                                                <div>
                                                                                                    {this.state.actionOpen[i][1] ?
                                                                                                        <div>
                                                                                                            <CollOnlyDep
                                                                                                                wallet={this.props.wallet}
                                                                                                                walletConnect={this.props.walletConnect}
                                                                                                                accountLoading={this.props.accountLoading}
                                                                                                                collBRTBalanceAccount={this.props.collBRTBalanceAccount}
                                                                                                                collDebtBalance={this.props.collDebtBalance}
                                                                                                                collBRTValue={this.props.collBRTValue}
                                                                                                                collateralPoolSegmentInfo={this.props.collateralPoolSegmentInfo}
                                                                                                                collBRTSegmentAllowance={this.props.collBRTSegmentAllowance}
                                                                                                                collUserSegmentInfo={this.props.collUserSegmentInfo}
                                                                                                                systemCoinBalance={this.props.systemCoinBalance}
                                                                                                                addLPCollRatio={this.addLPCollRatio}
                                                                                                                addUSBDebtRatio={this.addUSBDebtRatio}
                                                                                                                collateralApprove={this.props.collateralApprove}
                                                                                                                depositAndBorrow={this.props.depositAndBorrow}
                                                                                                                i={i}
                                                                                                            />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <CollDepBorrow
                                                                                                                wallet={this.props.wallet}
                                                                                                                walletConnect={this.props.walletConnect}
                                                                                                                accountLoading={this.props.accountLoading}
                                                                                                                collBRTBalanceAccount={this.props.collBRTBalanceAccount}
                                                                                                                collDebtBalance={this.props.collDebtBalance}
                                                                                                                collBRTValue={this.props.collBRTValue}
                                                                                                                collateralPoolSegmentInfo={this.props.collateralPoolSegmentInfo}
                                                                                                                collBRTSegmentAllowance={this.props.collBRTSegmentAllowance}
                                                                                                                collUserSegmentInfo={this.props.collUserSegmentInfo}
                                                                                                                systemCoinBalance={this.props.systemCoinBalance}
                                                                                                                collPoolRemainingAsset={this.props.collPoolRemainingAsset}
                                                                                                                addLPCollRatio={this.addLPCollRatio}
                                                                                                                addUSBDebtRatio={this.addUSBDebtRatio}
                                                                                                                collateralApprove={this.props.collateralApprove}
                                                                                                                depositAndBorrow={this.props.depositAndBorrow}
                                                                                                                i={i}
                                                                                                            />
                                                                                                        </div>
                                                                                                    }
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div> :
                                                                        <div className="center borderTop" >
                                                                            <span className="mt-3" style={{ color: 'black' }}><small>Wallet Connection to Avalanche required</small></span>
                                                                        </div>}
                                                                </div> :
                                                                <div></div>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div className="center">
                                <div style={{ marginBottom: '350px' }}>
                                    <div className="bounceball"></div> &nbsp;
                                    <div className="textLoadingSmall">NETWORK IS Loading...</div>
                                </div>
                            </div>
                        }
                    </div>
                </div><br /><br /><br />
                <Footer />
            </div >
        );
    }
}

export default Collateral;