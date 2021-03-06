import React, { Component } from 'react'
import './App.css';
import Footer from './Footer'
import MediaQuery from 'react-responsive';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown'
import { BsFillQuestionCircleFill, BsGearFill } from 'react-icons/bs';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import SynBuy from './SynBuy'
import SynSell from './SynSell'
import SynBuyLimit from './SynBuyLimit'
import SynSellLimit from './SynSellLimit'

class Airdrop extends Component {

    constructor(props) {
        super(props)
        this.state = {
            synPoolOpen: [false],
            slippageButtons: [{ name: '0.5%', value: 0.5 }, { name: '1.0%', value: 1 }],
            slippage: [100, 100, 100, 100, 100],
            limitOrder: [false, false, false, false, false],
            searchKeyword: '',
            minReceive: [0],
            minReceiveChangeUpdate: [false],
            actionOpen: [[false], [false], [false], [false], [false]],
            radioValue: [1, 1, 1, 1, 1],
            show: false,
            messageSlippage: [],
            buyReceiveSynAmount: [],
            sellReceiveUsbAmount: []
        }
        this.clickfarmOpen = this.clickfarmOpen.bind(this)
        this.buySyn = this.buySyn.bind(this)
        this.buyLimitSyn = this.buyLimitSyn.bind(this)
        this.sellLimitSyn = this.sellLimitSyn.bind(this)
        this.sellSyn = this.sellSyn.bind(this)
        this.setSlipage = this.setSlippage.bind(this)
        this.setLimitOrder = this.setLimitOrder.bind(this)
    }

    setLimitOrder(i) {
        console.log("abc")
        let ntg = 0
        this.setState(state => {
            const limitOrder = state.limitOrder.map((item, j) => {
                if (j === i) {
                    return !item;
                } else {
                    return item;
                }
            });
            return {
                limitOrder,
            };
        });
        this.state.minReceive[i] = 0
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    clickfarmOpen(i) {
        let ntg = 0
        this.state.synPoolOpen[i] = (!this.state.synPoolOpen[i])
        this.state.actionOpen[i][0] = true
        this.state.minReceiveChangeUpdate[i] = false
        this.state.minReceive[i] = 0
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    setAction(i, page, boolean) {
        let ntg = 0
        if (this.state.actionOpen[i][page] != true) {
            this.state.actionOpen[i][page] = boolean
            this.state.limitOrder[i] = false
            this.state.minReceive[i] = 0
        }
        if (page == 0) {
            this.state.actionOpen[i][1] = false
            this.state.minReceiveChangeUpdate[i] = false
        } else {
            this.state.actionOpen[i][0] = false
            this.state.minReceiveChangeUpdate[i] = true
        }
        this.setState({ ntg })
    }

    changeHandlerSearch(event) {
        this.setState({ searchKeyword: event })
    }

    buySyn(i, synAmount) {
        console.log(synAmount)
        let ntg = 0
        let minReceiveChange = 0

        if (synAmount == "" || isNaN(synAmount)) {
            synAmount = 0
        }

        if (!isNaN(this.state.slippage[i]) || !(this.state.slippage[i] == '')) {
            minReceiveChange = synAmount * (10000 - this.state.slippage[i]) / 10000
        } else {
            this.state.slippage[i] = 100
            minReceiveChange = synAmount * (10000 - this.state.slippage[i]) / 10000
        }
        this.state.minReceive[i] = minReceiveChange
        this.state.buyReceiveSynAmount[i] = synAmount
        this.setState({ ntg })
    }

    buyLimitSyn(i, synAmount) {
        let ntg = 0
        let minReceiveChange = 0
        minReceiveChange = synAmount

        this.state.minReceive[i] = minReceiveChange
        this.setState({ ntg })
    }

    sellSyn(i, USBAmount) {
        let ntg = 0
        let minReceiveChange = 0

        if (USBAmount == "" || isNaN(USBAmount)) {
            USBAmount = 0
        }

        if (!isNaN(this.state.slippage[i]) || !(this.state.slippage[i] == '')) {
            minReceiveChange = USBAmount * (10000 - this.state.slippage[i]) / 10000
        } else {
            this.state.slippage[i] = 100
            minReceiveChange = USBAmount * (10000 - this.state.slippage[i]) / 10000
        }
        this.state.minReceive[i] = minReceiveChange
        this.state.sellReceiveUsbAmount[i] = USBAmount
        this.setState({ ntg })
    }

    sellLimitSyn(i, USBAmount) {
        let ntg = 0
        let minReceiveChange = 0
        this.state.slippage[i] = 100
        minReceiveChange = USBAmount

        this.state.minReceive[i] = minReceiveChange
        this.setState({ ntg })
    }

    async setSlippage(i, page, newSlippage) {
        let ntg = 0
        if (isNaN(newSlippage) || (newSlippage == '')) {
            console.log("abc")
            this.state.radioValue[i] = 1
            this.state.slippage[i] = 100
        } else {
            this.state.radioValue[i] = newSlippage
            this.state.slippage[i] = newSlippage * 100
        }

        if (this.countDecimals(newSlippage) > 2) {
            this.state.messageSlippage[i] = 'Slippage should be within 2 decimal points'
            this.state.slippage[i] = 100
        } else if (!(newSlippage > 0 && newSlippage < 20)) {
            this.state.messageSlippage[i] = 'Enter a valid slippage percentage'
            this.state.slippage[i] = 100
        } else {
            this.state.messageSlippage[i] = ''
        }

        await this.setState({ ntg })
        if (page == 0) {
            this.buySyn(i, this.state.buyReceiveSynAmount[i])
        } else {
            this.sellSyn(i, this.state.sellReceiveUsbAmount[i])
        }
    }

    async setSlipageButton(i, page, value) {
        let ntg
        this.state.radioValue[i] = value
        this.state.messageSlippage[i] = ''
        this.state.slippage[i] = value * 100
        // await this.setState(state => {
        //     const slippage = state.slippage.map((item, j) => {
        //         if (j === i) {
        //             return value * 100;
        //         } else {
        //             return item;
        //         }
        //     });
        //     return {
        //         slippage,
        //     };
        // });

        if (page == 0) {
            this.buySyn(i, this.state.buyReceiveSynAmount[i])
        } else {
            this.sellSyn(i, this.state.sellReceiveUsbAmount[i])
        }
        this.setState({ ntg })
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

    render() {
        return (
            <div id="content" style={{ minWidth: '350px' }}>
                <label className="textWhite left mb-2 mt-2" style={{ fontSize: '35px', color: 'black' }}><big><b>Trade</b></big></label>

                <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0rem' }}>
                    <div className="input-group mb-2" >
                        <div className="input-group-prepend" >
                            <div className="input-group-text cardbodyRight" style={{ padding: '0 1.0rem' }}>
                                <img src="/images/search.png" height='25' className="" alt="" />
                            </div>
                        </div >
                        {this.props.farmloading ?
                            <input
                                type="text"
                                name="searchmSyn"
                                id="inputColor"
                                step="any"
                                ref={(input) => { this.input = input }}
                                style={{ fontSize: '18px', backgroundColor: '#fffcf0', height: '60px' }}
                                className="form-control cell inputCardbody"
                                placeholder="Search mSynthetic Ticker"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    this.changeHandlerSearch(value);
                                }}
                                required />
                            : <input
                                type="text"
                                name="searchmSyn"
                                id="inputColor"
                                style={{ fontSize: '18px', backgroundColor: '#fffcf0', cursor: 'not-allowed', height: '60px' }}
                                placeholder="Search mSynthetic Ticker"
                                className="form-control cell inputCardbody"
                                disabled />}
                    </div>
                </div>


                <div className="ml-auto mr-auto mt-3" style={{ minWidth: '350px' }}>
                    {this.props.farmloading ?
                        <div className="" style={{ marginBottom: '500px' }}>
                            {this.props.synPoolSegmentInfo.map((synPoolSegmentInfo, key) => {
                                let i = this.props.synPoolSegmentInfo.indexOf(synPoolSegmentInfo)
                                return (
                                    <div key={key}>
                                        <div>
                                            {!(this.props.synPoolSegmentInfo[i].synTokenPairsymbol.toLowerCase()).includes(`${this.state.searchKeyword.toLowerCase()}`) ? <div></div> :
                                                <div className="card mb-3 cardbody" >
                                                    <div className="card-body" style={{ padding: '1rem' }}>
                                                        <div className="card cardbody" style={{ border: '0px' }}>
                                                            <div className="card-body rowC" style={{ padding: '0rem', cursor: 'pointer' }} onClick={() => {
                                                                this.clickfarmOpen(i)
                                                            }}>
                                                                <MediaQuery minWidth={901}>
                                                                    <div className="float-left rowC" style={{ minWidth: '220px' }}>
                                                                        <span className="mr-3">
                                                                            <div className="textMiddle"><img src={`https://whitelist.mirror.finance/images/${this.props.synPoolSegmentInfo[i].icon}.png`} width="50" height="50" alt="" /></div>
                                                                            {/* https://whitelist.mirror.finance/images/${this.props.synPoolSegmentInfo[i].icon}.png, https://testnet-dex.functionx.io/img/${this.props.synPoolSegmentInfo[i].icon}.svg, https://eodhistoricaldata.com/img/logos/US/TSLA.png, https://cdn.indiawealth.in/public/images/techstars/TSLA.png */}
                                                                        </span>
                                                                        <span>
                                                                            <div className="textMiddle"><b>{this.props.synPoolSegmentInfo[i].synTokenPairsymbol}{this.props.synPoolSegmentInfo[i].status}</b></div>
                                                                            <div className="textGrey exLink0" onClick={() => {
                                                                                window.open(this.props.synPoolSegmentInfo[i].projectLink, '_blank')
                                                                            }}>{this.props.synPoolSegmentInfo[i].synTokenCompany}</div>
                                                                        </span>
                                                                    </div>
                                                                </MediaQuery>
                                                                <MediaQuery maxWidth={900}>
                                                                    <div className="float-left rowC" style={{ minWidth: '220px' }}>
                                                                        <span className="mr-3">
                                                                            <div className="textMiddle"><img src={`https://whitelist.mirror.finance/images/${this.props.synPoolSegmentInfo[i].icon}.png`} width="40" height="40" alt="" /></div>
                                                                        </span>
                                                                        <span>
                                                                            <div className="textMiddle"><b>{this.props.synPoolSegmentInfo[i].synTokenPairsymbol}{this.props.synPoolSegmentInfo[i].status}</b></div>
                                                                            <div className="textGrey exLink0" onClick={() => {
                                                                                window.open(this.props.synPoolSegmentInfo[i].projectLink, '_blank')
                                                                            }}>{this.props.synPoolSegmentInfo[i].synTokenCompany}</div>
                                                                        </span>
                                                                    </div>
                                                                </MediaQuery>
                                                                <span className="ml-5">
                                                                    <MediaQuery minWidth={901}>
                                                                        <table className="float-right">
                                                                            <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                <tr>
                                                                                    <th scope="col">Wallet</th>
                                                                                    <th scope="col">Oracle Price</th>
                                                                                    {/* <th scope="col">Pool Price</th> */}
                                                                                    <th scope="col">Total Supply</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <tbody className="textGrey">
                                                                                <tr>
                                                                                    <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{(this.props.synUserBalance[i] / 1000).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div>
                                                                                        : <div className="center"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                    <td className=""><div>{(this.props.synOraclePrice[i] / (10 ** this.props.synPriceDecimal[i])).toLocaleString('en-US', { maximumFractionDigits: 3 })} USB</div></td>
                                                                                    {/* <td className=""><div>{(this.props.synPoolPrice[i]).toLocaleString('en-US', { maximumFractionDigits: 3 })} USB</div></td> */}
                                                                                    <td className="">{this.props.synTotalSupply[i] / 1000}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </MediaQuery>
                                                                    <MediaQuery maxWidth={900}>
                                                                        <table className="float-right">
                                                                            <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                <tr>
                                                                                    <th scope="col" style={{ textAlign: 'end' }}>Oracle Price</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="textGrey">
                                                                                <tr>
                                                                                    <td className="" style={{ textAlign: 'end' }}><div>{(this.props.synOraclePrice[i] / (10 ** this.props.synPriceDecimal[i])).toLocaleString('en-US', { maximumFractionDigits: 3 })} USB</div></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </MediaQuery>
                                                                </span>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        {this.state.synPoolOpen[i] ?
                                                            <div>
                                                                {this.props.wallet || this.props.walletConnect ?
                                                                    <div className="borderTop ">
                                                                        <div className="mt-3">
                                                                            <MediaQuery minWidth={761}>
                                                                                <div className="float-left">
                                                                                    <div className="card cardbody mr-3 mb-2">
                                                                                        <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                            <div className="" style={{ marginBottom: '5px', color: 'black' }}><small>Min Received after slippage ({(this.state.slippage[i] / 100).toFixed(2)}%)</small></div>
                                                                                            <div className="" style={{ color: 'black' }}><small>
                                                                                                <div>{(this.state.minReceiveChangeUpdate[i] == true) ?
                                                                                                    <div>{this.state.minReceive[i] >= 0 ?
                                                                                                        <div style={{ color: 'black' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 5 })} USB</div>
                                                                                                        : <div style={{ color: 'red' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 5 })} USB</div>
                                                                                                    }</div>
                                                                                                    : <div>{this.state.minReceive[i] >= 0 ?
                                                                                                        <div style={{ color: 'black' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 3 })} {this.props.synPoolSegmentInfo[i].synTokenPairsymbol}</div>
                                                                                                        : <div style={{ color: 'red' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 3 })} {this.props.synPoolSegmentInfo[i].synTokenPairsymbol}</div>
                                                                                                    }</div>}
                                                                                                </div>
                                                                                            </small>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* <Popup trigger={open => (
                                                                                        <div className="card cardbody textDarkOpenOrder mr-3 mb-2" style={{ width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <div className="" style={{ marginBottom: '5px', color: 'black' }}><small>Pending Orders</small></div>
                                                                                                <div className="" style={{ color: 'black' }}><small>{this.props.accountLoading ?
                                                                                                    <div>{this.props.synUserOpenOrderLength[i]}</div>
                                                                                                    : <div className="ml-2"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                        on="click"
                                                                                        position="bottom left"
                                                                                        offsetY={5}
                                                                                        mouseLeaveDelay={100}
                                                                                        contentStyle={{ padding: '2px', minWidth: '300px', backgroundColor: '#fffcf0', boxShadow: '0 0 10px #9ecaed', borderColor: 'green' }}
                                                                                        arrow={false}
                                                                                    >
                                                                                        <div>
                                                                                            {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                                                                                                <table style={{ maxWidth: '280px' }}>
                                                                                                    <thead className="textBlackSmall" style={{ color: 'black', padding: '0px' }}>
                                                                                                        <tr>
                                                                                                            <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '55px' }}>Order</th>
                                                                                                            <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '65px' }}>Amount</th>
                                                                                                            <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '100px' }}>Position(USB)</th>
                                                                                                            <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '70px' }}>
                                                                                                                {this.props.synUserOpenOrderLength[i] > 1 ?
                                                                                                                    <Button className='center cell2 ml-1' style={{ fontSize: '12px', height: '20px', width: '60px', padding: '2px' }} variant="outline-success" size="sm"
                                                                                                                        onClick={async () => {
                                                                                                                            await this.props.synCancelAllOrder(i)
                                                                                                                        }}>Cancel All</Button>
                                                                                                                    : <div style={{ padding: '1px', width: '40px' }}></div>}</th>
                                                                                                        </tr>
                                                                                                    </thead>
                                                                                                    {this.props.synUserOrderInfo[i].map((orderInfo, key) => {
                                                                                                        return (
                                                                                                            <tbody key={key} style={{ color: 'black', padding: '0px' }}>
                                                                                                                {orderInfo.status != 0 ?
                                                                                                                    <tr></tr> :
                                                                                                                    <tr>
                                                                                                                        <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{orderInfo.orderType == 0 ? "Buy" : "Sell"}</div></td>
                                                                                                                        <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{window.web3Ava.utils.fromWei(orderInfo.synTokenAmount, 'babbage')}</div></td>
                                                                                                                        <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{window.web3Ava.utils.fromWei(orderInfo.synTokenPrice, 'ether').toLocaleString('en-US', { maximumFractionDigits: 3 })}</div></td>
                                                                                                                        <td className="" style={{ fontSize: '12px', padding: '1px', width: '65px' }}><Button className='center cell2 ml-1' style={{ fontSize: '12px', height: '20px', width: '60px', padding: '2px' }} variant="outline-success" size="sm"
                                                                                                                            onClick={async () => {
                                                                                                                                await this.props.synCancelOrder(i, orderInfo.orderId)
                                                                                                                            }}>Cancel</Button></td>
                                                                                                                    </tr>
                                                                                                                }
                                                                                                            </tbody>
                                                                                                        )
                                                                                                    })
                                                                                                    }
                                                                                                </table>
                                                                                                : <div className="center" style={{ height: '20px' }}><div className="lds-facebook"><div></div><div></div><div></div></div></div>}
                                                                                        </div>
                                                                                    </Popup> */}






                                                                                    <Dropdown autoClose="outside" align="end" style={{ padding: "0px" }}>
                                                                                        <div className="card cardbody textDarkOpenOrder mr-3 mb-2" style={{ width: '300px' }}>
                                                                                            <Dropdown.Toggle className="cell2" style={{ padding: "0px" }} variant="transparent">
                                                                                                <div className="card-body float-left" style={{ padding: '0.4rem 0.5rem' }}>
                                                                                                    <div className="" style={{ marginBottom: '5px', color: 'black' }}><small>Pending Orders</small></div>
                                                                                                    <div className="float-left" style={{ color: 'black' }}><small>{this.props.accountLoading ?
                                                                                                        <div>{this.props.synUserOpenOrderLength[i]}</div>
                                                                                                        : <div className="float-left ml-2"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Dropdown.Toggle>
                                                                                        </div>


                                                                                        <Dropdown.Menu style={{ padding: '2px', marginLeft: '0px', marginTop: '5px', width: '300px', backgroundColor: '#fffcf0', boxShadow: '0 0 10px #9ecaed', borderColor: 'green' }}>
                                                                                            <Dropdown.Item className="cell2" style={{ padding: '0px' }}>
                                                                                                <div>
                                                                                                    {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                                                                                                        <table style={{ maxWidth: '280px' }}>
                                                                                                            <thead className="textBlackSmall" style={{ color: 'black', padding: '0px' }}>
                                                                                                                <tr>
                                                                                                                    <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '55px' }}>Order</th>
                                                                                                                    <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '65px' }}>Amount</th>
                                                                                                                    <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '100px' }}>Position(USB)</th>
                                                                                                                    <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '70px' }}>
                                                                                                                        {this.props.synUserOpenOrderLength[i] > 1 ?
                                                                                                                            <Button className='textGreenButton center cell2 ml-1' style={{ fontSize: '12px', height: '20px', width: '60px', padding: '2px' }} variant="outline-success" size="sm"
                                                                                                                                onClick={async () => {
                                                                                                                                    await this.props.synCancelAllOrder(i)
                                                                                                                                }}>Cancel All</Button>
                                                                                                                            : <div style={{ padding: '1px', width: '40px' }}></div>}</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            {this.props.synUserOrderInfo[i].map((orderInfo, key) => {
                                                                                                                return (
                                                                                                                    <tbody key={key} style={{ color: 'black', padding: '0px' }}>
                                                                                                                        {orderInfo.status != 0 ?
                                                                                                                            <tr></tr> :
                                                                                                                            <tr>
                                                                                                                                <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{orderInfo.orderType == 0 ? "Buy" : "Sell"}</div></td>
                                                                                                                                <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{window.web3Ava.utils.fromWei(orderInfo.synTokenAmount, 'babbage')}</div></td>
                                                                                                                                <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{window.web3Ava.utils.fromWei(orderInfo.synTokenPrice, 'ether').toLocaleString('en-US', { maximumFractionDigits: 3 })}</div></td>
                                                                                                                                <td className="" style={{ fontSize: '12px', padding: '1px', width: '65px' }}><Button className='textGreenButton center cell2 ml-1' style={{ fontSize: '12px', height: '20px', width: '60px', padding: '2px' }} variant="outline-success" size="sm"
                                                                                                                                    onClick={async () => {
                                                                                                                                        await this.props.synCancelOrder(i, orderInfo.orderId)
                                                                                                                                    }}>Cancel</Button></td>
                                                                                                                            </tr>
                                                                                                                        }
                                                                                                                    </tbody>
                                                                                                                )
                                                                                                            })
                                                                                                            }
                                                                                                        </table>
                                                                                                        : <div className="center" style={{ height: '20px' }}><div className="lds-facebook"><div></div><div></div><div></div></div></div>}
                                                                                                </div>
                                                                                            </Dropdown.Item>
                                                                                        </Dropdown.Menu>
                                                                                    </Dropdown>








                                                                                </div>
                                                                            </MediaQuery>



                                                                            <MediaQuery maxWidth={760}>
                                                                                <div className="card cardbody mb-2">
                                                                                    <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                        <div className="" style={{ marginBottom: '5px', color: 'black' }}><small>Min Received after slippage ({(this.state.slippage[i] / 100).toFixed(2)}%)</small></div>
                                                                                        <div className="" style={{ color: 'black' }}><small>
                                                                                            <div>{(this.state.minReceiveChangeUpdate[i] == true) ?
                                                                                                <div>{this.state.minReceive[i] >= 0 ?
                                                                                                    <div style={{ color: 'black' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 5 })} USB</div>
                                                                                                    : <div style={{ color: 'red' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 5 })} USB</div>
                                                                                                }</div>
                                                                                                : <div>{this.state.minReceive[i] >= 0 ?
                                                                                                    <div style={{ color: 'black' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 3 })} {this.props.synPoolSegmentInfo[i].synTokenPairsymbol}</div>
                                                                                                    : <div style={{ color: 'red' }}>{(parseInt(this.state.minReceive[i] * 1000) / 1000).toLocaleString('en-US', { maximumFractionDigits: 3 })} {this.props.synPoolSegmentInfo[i].synTokenPairsymbol}</div>
                                                                                                }</div>}
                                                                                            </div>
                                                                                        </small>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <Popup trigger={open => (
                                                                                    <div className="card cardbody textDarkOpenOrder mb-2">
                                                                                        <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                            <div className="" style={{ marginBottom: '5px', color: 'black' }}><small>Pending Orders</small></div>
                                                                                            <div className="" style={{ color: 'black' }}><small>{this.props.accountLoading ?
                                                                                                <div>{this.props.synUserOpenOrderLength[i]}</div>
                                                                                                : <div className="ml-2"><div className="lds-facebook"><div></div><div></div><div></div></div></div>}</small>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                                    on="click"
                                                                                    position="bottom left"
                                                                                    offsetY={5}
                                                                                    mouseLeaveDelay={100}
                                                                                    contentStyle={{ padding: '2px', minWidth: '320px', backgroundColor: '#fffcf0', boxShadow: '0 0 10px #9ecaed', borderColor: 'green' }}
                                                                                    arrow={false}
                                                                                >
                                                                                    <div>
                                                                                        {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                                                                                            <table style={{ maxWidth: '280px' }}>
                                                                                                <thead className="textBlackSmall" style={{ color: 'black', padding: '0px' }}>
                                                                                                    <tr>
                                                                                                        <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '55px' }}>Order</th>
                                                                                                        <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '55px' }}>Amount</th>
                                                                                                        <th scope="col" style={{ fontSize: '12px', padding: '1px', width: '95px' }}>Position(USB)</th>
                                                                                                        <th scope="col" className="center" style={{ fontSize: '12px', padding: '1px', width: '65px' }}>
                                                                                                            {this.props.synUserOpenOrderLength[i] > 1 ?
                                                                                                                <Button className='textGreenButton center cell2' style={{ fontSize: '12px', height: '20px', width: '60px', padding: '2px' }} variant="outline-success" size="sm"
                                                                                                                    onClick={async () => {
                                                                                                                        await this.props.synCancelAllOrder(i)
                                                                                                                    }}>Cancel All</Button>
                                                                                                                : <div style={{ padding: '1px', width: '40px' }}></div>}</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.props.synUserOrderInfo[i].map((orderInfo, key) => {
                                                                                                    return (
                                                                                                        <tbody key={key} style={{ color: 'black', padding: '0px' }}>
                                                                                                            {orderInfo.status != 0 ?
                                                                                                                <tr></tr> :
                                                                                                                <tr>
                                                                                                                    <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{orderInfo.orderType == 0 ? "Buy" : "Sell"}</div></td>
                                                                                                                    <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{window.web3Ava.utils.fromWei(orderInfo.synTokenAmount, 'babbage')}</div></td>
                                                                                                                    <td className="" style={{ fontSize: '12px', padding: '1px' }}><div>{window.web3Ava.utils.fromWei(orderInfo.synTokenPrice, 'ether').toLocaleString('en-US', { maximumFractionDigits: 3 })}</div></td>
                                                                                                                    <td className="center" style={{ fontSize: '12px', padding: '1px', width: '65px' }}><Button className='textGreenButton center cell2' style={{ fontSize: '12px', height: '20px', width: '60px', padding: '2px' }} variant="outline-success" size="sm"
                                                                                                                        onClick={async () => {
                                                                                                                            await this.props.synCancelOrder(i, orderInfo.orderId)
                                                                                                                        }}>Cancel</Button></td>
                                                                                                                </tr>
                                                                                                            }
                                                                                                        </tbody>
                                                                                                    )
                                                                                                })
                                                                                                }
                                                                                            </table>
                                                                                            : <div className="center" style={{ height: '20px' }}><div className="lds-facebook"><div></div><div></div><div></div></div></div>}
                                                                                    </div>
                                                                                </Popup>

                                                                            </MediaQuery>






                                                                            <div className="card cardbody" style={{ minWidth: '350px' }}>
                                                                                <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                    <div className='ml-2 mt-2 mb-2'>
                                                                                        {this.state.actionOpen[i][0] == true ?
                                                                                            <div style={{ height: '30px' }}>
                                                                                                <div className='float-left' style={{ paddingTop: '0px' }}>
                                                                                                    <ButtonGroup>
                                                                                                        <div>
                                                                                                            <Button className="textTransparentButton center" style={{ textDecoration: 'none', marginRight: '5px' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(i, 0, true)
                                                                                                            }}><b>Buy</b></Button></div>
                                                                                                        <div>
                                                                                                            <Button className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(i, 1, true)
                                                                                                            }}>Sell</Button></div>
                                                                                                    </ButtonGroup>
                                                                                                </div>
                                                                                                <div className='float-right mr-1' style={{ paddingTop: '5px' }}>
                                                                                                    <div className='rowC'>
                                                                                                        <div className='mr-2' style={{ paddingTop: '2px' }}>
                                                                                                            <label className="switch">
                                                                                                                <input name="buy" type="checkbox" checked={this.state.limitOrder[i]} onChange={() => {
                                                                                                                    this.setLimitOrder(i)
                                                                                                                }} /><span className="slider round"></span>
                                                                                                            </label>
                                                                                                        </div>
                                                                                                        <div className='mr-2'><small>Limit Order</small></div>
                                                                                                        {this.state.limitOrder[i] == true ? <div style={{ cursor: 'not-allowed' }}><BsGearFill size={16} /></div> :
                                                                                                            <div style={{ cursor: 'pointer' }}>

                                                                                                                {/* <Popup trigger={open => (
                                                                                                                    <div><BsGearFill size={16} /></div>
                                                                                                                )}
                                                                                                                    on="click"
                                                                                                                    position="bottom right"
                                                                                                                    offsetY={10}
                                                                                                                    mouseLeaveDelay={100}
                                                                                                                    contentStyle={{ padding: '10px', minWidth: '300px', backgroundColor: '#fffcf0' }}
                                                                                                                    arrow={false}
                                                                                                                >
                                                                                                                    <div>
                                                                                                                        <div className="mb-2" style={{ fontSize: '18px' }}>Slippage tolerance</div>
                                                                                                                        <div className='rowC'>
                                                                                                                            {this.state.slippageButtons.map((slippageButton, idx) => (
                                                                                                                                <ToggleButton
                                                                                                                                    key={idx}
                                                                                                                                    id={`radio-${idx}`}
                                                                                                                                    type="checkbox"
                                                                                                                                    className="switch2 cell2 mr-2"
                                                                                                                                    variant={'outline-secondary'}
                                                                                                                                    name="radio"
                                                                                                                                    size="sm"
                                                                                                                                    style={{ cursor: 'pointer', height: '30px' }}
                                                                                                                                    value={slippageButton.value}
                                                                                                                                    checked={this.state.radioValue[i] == slippageButton.value}
                                                                                                                                    onChange={(e) => this.setSlipageButton(i, 0, e.currentTarget.value)}
                                                                                                                                >
                                                                                                                                    {slippageButton.name}
                                                                                                                                </ToggleButton>
                                                                                                                            ))}
                                                                                                                            <span>
                                                                                                                                <div className="input-group mb-2" >
                                                                                                                                    <input
                                                                                                                                        type="number"
                                                                                                                                        id="input3Color"
                                                                                                                                        step="any"
                                                                                                                                        ref={(input) => { this.input = input }}
                                                                                                                                        style={{ fontSize: '18px', backgroundColor: '#fffcf0', height: '30px' }}
                                                                                                                                        className="form-control cell cardbody"
                                                                                                                                        placeholder={`${this.state.radioValue[i]}`}
                                                                                                                                        onKeyPress={(event) => {
                                                                                                                                            if (!/[0-9.]/.test(event.key)) {
                                                                                                                                                event.preventDefault();
                                                                                                                                            }
                                                                                                                                        }}
                                                                                                                                        onChange={(e) => {
                                                                                                                                            const value = e.target.value;
                                                                                                                                            this.setSlippage(i, 0, value);
                                                                                                                                        }}
                                                                                                                                        required />
                                                                                                                                    <div className="input-group-append" >
                                                                                                                                        <div className="input-group-text cardbody" style={{ padding: '0 0.3rem' }}>%
                                                                                                                                        </div>
                                                                                                                                    </div >
                                                                                                                                </div >
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ color: 'red', fontSize: '13px' }}>{this.state.messageSlippage}</div>
                                                                                                                </Popup> */}





                                                                                                                <Dropdown className="cell2" autoClose="outside" style={{ padding: "0px" }}>
                                                                                                                    <Dropdown.Toggle className="cell2" style={{ padding: "0px", position: "relative", top: "-3px" }} variant="transparent">
                                                                                                                        <div><BsGearFill size={16} /></div>
                                                                                                                    </Dropdown.Toggle>
                                                                                                                    <Dropdown.Menu className="cell2" style={{ padding: '10px', minWidth: '300px', backgroundColor: '#fffcf0' }}>
                                                                                                                        <Dropdown.Item className="cell2" style={{ padding: '0px' }}>
                                                                                                                            <div className="cell2">
                                                                                                                                <div className="mb-2" style={{ fontSize: '18px', color: "black" }}>Slippage tolerance</div>
                                                                                                                                <div className='rowC'>
                                                                                                                                    {this.state.radioValue[i] == 1 ?
                                                                                                                                        <div className='rowC'>
                                                                                                                                            <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                await this.setSlipageButton(i, 0, 0.5)
                                                                                                                                            }}><b>0.5%</b></Button>
                                                                                                                                            <Button className="textTransparentButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                                await this.setSlipageButton(i, 0, 1)
                                                                                                                                            }}><b>1.0%</b></Button>
                                                                                                                                        </div> : <div>{
                                                                                                                                            this.state.radioValue[i] == 0.5 ?
                                                                                                                                                <div className='rowC'>
                                                                                                                                                    <Button className="textTransparentButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                                        await this.setSlipageButton(i, 0, 0.5)
                                                                                                                                                    }}><b>0.5%</b></Button>
                                                                                                                                                    <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                        this.setSlipageButton(i, 0, 1)
                                                                                                                                                    }}><b>1.0%</b></Button>
                                                                                                                                                </div>
                                                                                                                                                : <div className='rowC'>
                                                                                                                                                    <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                        await this.setSlipageButton(i, 0, 1)
                                                                                                                                                    }}><b>0.5%</b></Button>
                                                                                                                                                    <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                        await this.setSlipageButton(i, 0, 1)
                                                                                                                                                    }}><b>1.0%</b></Button>
                                                                                                                                                </div>
                                                                                                                                        }</div>
                                                                                                                                    }
                                                                                                                                    <span>
                                                                                                                                        <div className="input-group mb-2" >
                                                                                                                                            <input
                                                                                                                                                type="number"
                                                                                                                                                id="input3Color"
                                                                                                                                                step="any"
                                                                                                                                                ref={(input) => { this.input = input }}
                                                                                                                                                style={{ fontSize: '18px', backgroundColor: '#fffcf0', height: '30px' }}
                                                                                                                                                className="form-control cell cardbody"
                                                                                                                                                placeholder={`${this.state.radioValue[i]}`}
                                                                                                                                                onKeyPress={(event) => {
                                                                                                                                                    if (!/[0-9.]/.test(event.key)) {
                                                                                                                                                        event.preventDefault();
                                                                                                                                                    }
                                                                                                                                                }}
                                                                                                                                                onChange={(e) => {
                                                                                                                                                    const value = e.target.value;
                                                                                                                                                    this.setSlippage(i, 0, value);
                                                                                                                                                }}
                                                                                                                                                required />
                                                                                                                                            <div className="input-group-append" >
                                                                                                                                                <div className="input-group-text cardbody" style={{ padding: '0 0.3rem' }}>%
                                                                                                                                                </div>
                                                                                                                                            </div >
                                                                                                                                        </div >
                                                                                                                                    </span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div style={{ color: 'red', fontSize: '13px' }}>{this.state.messageSlippage}</div>
                                                                                                                        </Dropdown.Item>
                                                                                                                    </Dropdown.Menu>
                                                                                                                </Dropdown>
                                                                                                            </div>
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            : <div style={{ height: '30px' }}>
                                                                                                <div className='float-left' style={{ paddingTop: '0px' }}>
                                                                                                    <ButtonGroup>
                                                                                                        <div>
                                                                                                            <Button className="textBlackButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(i, 0, true)
                                                                                                            }}><b>Buy</b></Button></div>
                                                                                                        <div>
                                                                                                            <Button className="textTransparentButton center mr-1" style={{ textDecoration: 'none' }} variant="link" size="sm" onClick={async () => {
                                                                                                                await this.setAction(i, 1, true)
                                                                                                            }}>Sell</Button></div>
                                                                                                    </ButtonGroup>
                                                                                                </div>
                                                                                                <div className='float-right mr-1' style={{ paddingTop: '5px' }}>
                                                                                                    <div className='rowC'>
                                                                                                        <div className='mr-2' style={{ paddingTop: '2px' }}>
                                                                                                            <label className="switch">
                                                                                                                <input name="sell" type="checkbox" checked={this.state.limitOrder[i]} onChange={() => {
                                                                                                                    this.setLimitOrder(i)
                                                                                                                }} /><span className="slider round"></span>
                                                                                                            </label>
                                                                                                        </div>
                                                                                                        <div className='mr-2'><small>Limit Order</small></div>
                                                                                                        {this.state.limitOrder[i] == true ? <div style={{ cursor: 'not-allowed' }}><BsGearFill size={16} /></div> :
                                                                                                            <div style={{ cursor: 'pointer' }}>
                                                                                                                {/* <Popup trigger={open => (
                                                                                                                    <div><BsGearFill size={16} /></div>
                                                                                                                )}
                                                                                                                    on="click"
                                                                                                                    position="bottom right"
                                                                                                                    offsetY={10}
                                                                                                                    mouseLeaveDelay={100}
                                                                                                                    contentStyle={{ padding: '10px', minWidth: '300px', backgroundColor: '#fffcf0' }}
                                                                                                                    arrow={false}
                                                                                                                >
                                                                                                                    <div>
                                                                                                                        <div className="mb-2" style={{ fontSize: '18px' }}>Slippage tolerance</div>
                                                                                                                        <div className='rowC'>
                                                                                                                            {this.state.slippageButtons.map((slippageButton, idx) => (
                                                                                                                                <ToggleButton
                                                                                                                                    key={idx}
                                                                                                                                    id={`radio-${idx}`}
                                                                                                                                    type="checkbox"
                                                                                                                                    className="cell2 mr-2"
                                                                                                                                    variant={'outline-secondary'}
                                                                                                                                    name="radio"
                                                                                                                                    size="sm"
                                                                                                                                    style={{ cursor: 'pointer', height: '30px' }}
                                                                                                                                    value={slippageButton.value}
                                                                                                                                    checked={this.state.radioValue[i] == slippageButton.value}
                                                                                                                                    onChange={(e) => this.setSlipageButton(i, 1, e.currentTarget.value)}
                                                                                                                                >
                                                                                                                                    {slippageButton.name}
                                                                                                                                </ToggleButton>
                                                                                                                            ))}
                                                                                                                            <span>
                                                                                                                                <div className="input-group mb-2" >
                                                                                                                                    <input
                                                                                                                                        type="number"
                                                                                                                                        id="input3Color"
                                                                                                                                        step="any"
                                                                                                                                        ref={(input) => { this.input = input }}
                                                                                                                                        style={{ fontSize: '18px', backgroundColor: '#fffcf0', height: '30px' }}
                                                                                                                                        className="form-control cell cardbody"
                                                                                                                                        placeholder={`${this.state.radioValue[i]}`}
                                                                                                                                        onKeyPress={(event) => {
                                                                                                                                            if (!/[0-9.]/.test(event.key)) {
                                                                                                                                                event.preventDefault();
                                                                                                                                            }
                                                                                                                                        }}
                                                                                                                                        onChange={(e) => {
                                                                                                                                            const value = e.target.value;
                                                                                                                                            this.setSlippage(i, 1, value);
                                                                                                                                        }}
                                                                                                                                        required />
                                                                                                                                    <div className="input-group-append" >
                                                                                                                                        <div className="input-group-text cardbody" style={{ padding: '0 0.3rem' }}>%
                                                                                                                                        </div>
                                                                                                                                    </div >
                                                                                                                                </div >
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div style={{ color: 'red', fontSize: '13px' }}>{this.state.messageSlippage}</div>
                                                                                                                </Popup> */}

                                                                                                                <Dropdown className="cell2" autoClose="outside" style={{ padding: "0px" }}>
                                                                                                                    <Dropdown.Toggle className="cell2" style={{ padding: "0px", position: "relative", top: "-3px" }} variant="transparent">
                                                                                                                        <div><BsGearFill size={16} /></div>
                                                                                                                    </Dropdown.Toggle>
                                                                                                                    <Dropdown.Menu className="cell2" style={{ padding: '10px', minWidth: '300px', backgroundColor: '#fffcf0' }}>
                                                                                                                        <Dropdown.Item className="cell2" style={{ padding: '0px' }}>
                                                                                                                            <div className="cell2">
                                                                                                                                <div className="mb-2" style={{ fontSize: '18px', color: "black" }}>Slippage tolerance</div>
                                                                                                                                <div className='rowC'>
                                                                                                                                    {this.state.radioValue[i] == 1 ?
                                                                                                                                        <div className='rowC'>
                                                                                                                                            <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                await this.setSlipageButton(i, 0, 0.5)
                                                                                                                                            }}><b>0.5%</b></Button>
                                                                                                                                            <Button className="textTransparentButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                                await this.setSlipageButton(i, 0, 1)
                                                                                                                                            }}><b>1.0%</b></Button>
                                                                                                                                        </div> : <div>{
                                                                                                                                            this.state.radioValue[i] == 0.5 ?
                                                                                                                                                <div className='rowC'>
                                                                                                                                                    <Button className="textTransparentButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px' }} variant="link" size="sm" onClick={async () => {
                                                                                                                                                        await this.setSlipageButton(i, 0, 0.5)
                                                                                                                                                    }}><b>0.5%</b></Button>
                                                                                                                                                    <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                        this.setSlipageButton(i, 0, 1)
                                                                                                                                                    }}><b>1.0%</b></Button>
                                                                                                                                                </div>
                                                                                                                                                : <div className='rowC'>
                                                                                                                                                    <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                        await this.setSlipageButton(i, 0, 1)
                                                                                                                                                    }}><b>0.5%</b></Button>
                                                                                                                                                    <Button className="textBlackButton center cell2" style={{ textDecoration: 'none', marginRight: '5px', width: '50px', height: '30px', border: "1px Solid Grey" }} variant="outline-secondary" size="sm" onClick={async () => {
                                                                                                                                                        await this.setSlipageButton(i, 0, 1)
                                                                                                                                                    }}><b>1.0%</b></Button>
                                                                                                                                                </div>
                                                                                                                                        }</div>
                                                                                                                                    }
                                                                                                                                    <span>
                                                                                                                                        <div className="input-group mb-2" >
                                                                                                                                            <input
                                                                                                                                                type="number"
                                                                                                                                                id="input3Color"
                                                                                                                                                step="any"
                                                                                                                                                ref={(input) => { this.input = input }}
                                                                                                                                                style={{ fontSize: '18px', backgroundColor: '#fffcf0', height: '30px' }}
                                                                                                                                                className="form-control cell cardbody"
                                                                                                                                                placeholder={`${this.state.radioValue[i]}`}
                                                                                                                                                onKeyPress={(event) => {
                                                                                                                                                    if (!/[0-9.]/.test(event.key)) {
                                                                                                                                                        event.preventDefault();
                                                                                                                                                    }
                                                                                                                                                }}
                                                                                                                                                onChange={(e) => {
                                                                                                                                                    const value = e.target.value;
                                                                                                                                                    this.setSlippage(i, 1, value);
                                                                                                                                                }}
                                                                                                                                                required />
                                                                                                                                            <div className="input-group-append" >
                                                                                                                                                <div className="input-group-text cardbody" style={{ padding: '0 0.3rem' }}>%
                                                                                                                                                </div>
                                                                                                                                            </div >
                                                                                                                                        </div >
                                                                                                                                    </span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div style={{ color: 'red', fontSize: '13px' }}>{this.state.messageSlippage}</div>
                                                                                                                        </Dropdown.Item>
                                                                                                                    </Dropdown.Menu>
                                                                                                                </Dropdown>

                                                                                                            </div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>


                                                                                    <div className='borderBottom'></div>
                                                                                    <div className='ml-1 mr-1'>
                                                                                        {this.state.actionOpen[i][0] == true ?
                                                                                            <div>
                                                                                                {this.state.limitOrder[i] == true ?
                                                                                                    <SynBuyLimit
                                                                                                        wallet={this.props.wallet}
                                                                                                        synPoolSegmentInfo={this.props.synPoolSegmentInfo}
                                                                                                        walletConnect={this.props.walletConnect}
                                                                                                        accountLoading={this.props.accountLoading}
                                                                                                        synOraclePrice={this.props.synOraclePrice}
                                                                                                        synPriceDecimal={this.props.synPriceDecimal}
                                                                                                        // synPoolPrice={this.props.synPoolPrice}
                                                                                                        synUserBalance={this.props.synUserBalance}
                                                                                                        synUserAllowance={this.props.synUserAllowance}
                                                                                                        slippage={this.state.slippage}
                                                                                                        buyLimitSyn={this.buyLimitSyn}
                                                                                                        synOpenMarketOrder={this.props.synOpenMarketOrder}
                                                                                                        synOpenLimitOrder={this.props.synOpenLimitOrder}
                                                                                                        systemCoinSyntheticApprove={this.props.systemCoinSyntheticApprove}
                                                                                                        systemCoinSynAllowance={this.props.systemCoinSynAllowance}
                                                                                                        systemCoinBalance={this.props.systemCoinBalance}
                                                                                                        i={i}
                                                                                                    />
                                                                                                    : <SynBuy
                                                                                                        wallet={this.props.wallet}
                                                                                                        synPoolSegmentInfo={this.props.synPoolSegmentInfo}
                                                                                                        walletConnect={this.props.walletConnect}
                                                                                                        accountLoading={this.props.accountLoading}
                                                                                                        synOraclePrice={this.props.synOraclePrice}
                                                                                                        synPriceDecimal={this.props.synPriceDecimal}
                                                                                                        // synPoolPrice={this.props.synPoolPrice}
                                                                                                        synUserBalance={this.props.synUserBalance}
                                                                                                        synUserAllowance={this.props.synUserAllowance}
                                                                                                        slippage={this.state.slippage}
                                                                                                        buySyn={this.buySyn}
                                                                                                        synOpenMarketOrder={this.props.synOpenMarketOrder}
                                                                                                        synOpenLimitOrder={this.props.synOpenLimitOrder}
                                                                                                        systemCoinSyntheticApprove={this.props.systemCoinSyntheticApprove}
                                                                                                        systemCoinSynAllowance={this.props.systemCoinSynAllowance}
                                                                                                        systemCoinBalance={this.props.systemCoinBalance}
                                                                                                        i={i}
                                                                                                    />}</div>
                                                                                            : <div>
                                                                                                {this.state.limitOrder[i] == true ?
                                                                                                    <SynSellLimit
                                                                                                        wallet={this.props.wallet}
                                                                                                        synPoolSegmentInfo={this.props.synPoolSegmentInfo}
                                                                                                        walletConnect={this.props.walletConnect}
                                                                                                        accountLoading={this.props.accountLoading}
                                                                                                        synOraclePrice={this.props.synOraclePrice}
                                                                                                        synPriceDecimal={this.props.synPriceDecimal}
                                                                                                        // synPoolPrice={this.props.synPoolPrice}
                                                                                                        synUserBalance={this.props.synUserBalance}
                                                                                                        synUserAllowance={this.props.synUserAllowance}
                                                                                                        slippage={this.state.slippage}
                                                                                                        sellLimitSyn={this.sellLimitSyn}
                                                                                                        synOpenMarketOrder={this.props.synOpenMarketOrder}
                                                                                                        synOpenLimitOrder={this.props.synOpenLimitOrder}
                                                                                                        systemCoinSyntheticApprove={this.props.systemCoinSyntheticApprove}
                                                                                                        synTokenSyntheticApprove={this.props.synTokenSyntheticApprove}
                                                                                                        systemCoinSynAllowance={this.props.systemCoinSynAllowance}
                                                                                                        systemCoinBalance={this.props.systemCoinBalance}
                                                                                                        i={i}
                                                                                                    />
                                                                                                    : <SynSell
                                                                                                        wallet={this.props.wallet}
                                                                                                        synPoolSegmentInfo={this.props.synPoolSegmentInfo}
                                                                                                        walletConnect={this.props.walletConnect}
                                                                                                        accountLoading={this.props.accountLoading}
                                                                                                        synOraclePrice={this.props.synOraclePrice}
                                                                                                        synPriceDecimal={this.props.synPriceDecimal}
                                                                                                        // synPoolPrice={this.props.synPoolPrice}
                                                                                                        synUserBalance={this.props.synUserBalance}
                                                                                                        synUserAllowance={this.props.synUserAllowance}
                                                                                                        slippage={this.state.slippage}
                                                                                                        sellSyn={this.sellSyn}
                                                                                                        synOpenMarketOrder={this.props.synOpenMarketOrder}
                                                                                                        synOpenLimitOrder={this.props.synOpenLimitOrder}
                                                                                                        systemCoinSyntheticApprove={this.props.systemCoinSyntheticApprove}
                                                                                                        synTokenSyntheticApprove={this.props.synTokenSyntheticApprove}
                                                                                                        systemCoinSynAllowance={this.props.systemCoinSynAllowance}
                                                                                                        systemCoinBalance={this.props.systemCoinBalance}
                                                                                                        i={i}
                                                                                                    />}
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
                                                            </div>
                                                            : <div></div>
                                                        }
                                                    </div>
                                                </div>}
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
                <Footer />
            </div>
        );
    }
}

export default Airdrop;