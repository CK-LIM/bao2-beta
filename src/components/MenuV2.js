import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Buttons from 'react-bootstrap/Button'
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import Deposit from './Deposit'
import Footer from './Footer'
import 'reactjs-popup/dist/index.css';
import './App.css';

class Menu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            farmV2_3Open: []
        }
        this.clickfarmOpen = this.clickfarmOpen.bind(this)
    }

    clickfarmOpen(pair) {
        let ntg = 0
        this.state.farmV2_3Open[pair] = !(this.state.farmV2_3Open[pair])
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    render() {
        const contentStyle = { background: '#fffae6', border: "1px solid #596169", width: "30%", borderRadius: "15px", minWidth: "320px" };
        return (
            <div id="content" className="" style={{ margin: "0", color: '#ff9a04' }}>
                <MediaQuery minWidth={601}>
                    <div className="ml-auto mr-auto card mb-3 cardbody" style={{ color: 'black' }}>
                        {this.props.wallet || this.props.walletConnect ?
                            <div className="card-body" style={{ paddingBottom: '5px' }}>
                                <div className='mb-5'>
                                    <span className="float-left" style={{ color: 'black', fontSize: '16px' }}>
                                        Your BAVA Balance<br /><b>{parseFloat(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
                                    </span>
                                    <span className="float-right" style={{ color: 'black', fontSize: '16px' }}>
                                        Your Locked BAVA<br /><b>{parseFloat(window.web3Ava.utils.fromWei(this.props.lockedBavaTokenBalance, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.lockedBavaTokenBalance, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
                                    </span>
                                </div><br /><br />
                                <div>
                                    <span className="float-left" style={{ color: 'black', fontSize: '16px' }}>Total pending harvest&nbsp;&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={13} /></span>
                                            )}
                                            on="hover"
                                            offsetY={0}
                                            offsetX={5}
                                            position="right center"
                                        ><span className="textInfo"><small>Total BAVA tokens earned acrossed all farm </small></span>
                                        </Popup>
                                    </span><br />
                                    <span className="float-left " style={{ color: 'black', fontSize: '16px' }}><b>
                                        {parseFloat(window.web3Ava.utils.fromWei(this.props.totalpendingReward, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.totalpendingReward, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
                                    </span>
                                    <span className="float-right ">
                                        <span><small>All pools compound at an optimal rate</small></span>
                                    </span>
                                </div>
                            </div>
                            :
                            <div className="card-body" style={{ paddingBottom: '5px' }}>
                                <span>
                                    <span className="float-left" style={{ color: 'silver' }}>
                                        Your BAVA Balance<br />
                                        <div style={{ color: 'silver' }}><b>0 BAVA</b></div>
                                    </span>
                                    <span className="float-right" style={{ color: 'silver' }}>
                                        Your Locked BAVA<br />
                                        <div style={{ color: 'silver' }}><b>0 BAVA</b></div>
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
                                        </div>
                                        : <Buttons className="textDarkMedium1 cell2" variant="outline" size="lg" >Connect to display</Buttons>
                                    }
                                </span>
                                <span>
                                    <span className="float-left" style={{ color: 'silver' }}>Total pending harvest&nbsp;&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={13} /></span>
                                            )}
                                            on="hover"
                                            offsetY={0}
                                            offsetX={5}
                                            position="right center"
                                        ><span className="textInfo"><small>Total BAVA tokens earned acrossed all farm </small></span>
                                        </Popup>
                                    </span><br />
                                    <span className="float-left">
                                        <div style={{ color: 'silver' }}><b>0 BAVA</b></div>
                                    </span>
                                    <span className="float-right" style={{ color: 'silver' }}>
                                        <small><span>All pools compound at an optimal rate</span></small>
                                    </span>
                                </span>
                            </div>
                        }
                    </div>
                </MediaQuery>

                <MediaQuery maxWidth={600}>
                    <div className="ml-auto mr-auto card mb-3 cardbody" style={{ color: 'black' }}>
                        {this.props.wallet || this.props.walletConnect ?
                            <div className="card-body" style={{ paddingBottom: '5px' }}>
                                <div>
                                    <div className="left mb-3" style={{ color: 'black', fontSize: '16px' }}>
                                        Your BAVA Balance<br /><b>{parseFloat(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.bavaTokenBalance, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
                                    </div>
                                    <div className="left mb-3" style={{ color: 'black', fontSize: '16px' }}>
                                        Your Locked BAVA<br /><b>{parseFloat(window.web3Ava.utils.fromWei(this.props.lockedBavaTokenBalance, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.lockedBavaTokenBalance, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
                                    </div>
                                    <div className="left mb-2" style={{ color: 'black', fontSize: '16px' }}>Total pending harvest&nbsp;&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={13} /></span>
                                            )}
                                            on="hover"
                                            offsetY={0}
                                            offsetX={5}
                                            position="right center"
                                        ><span className="textInfo"><small>Total BAVA tokens earned acrossed all farm </small></span>
                                        </Popup><br /><b>{parseFloat(window.web3Ava.utils.fromWei(this.props.totalpendingReward, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} BAVA / $ {(window.web3Ava.utils.fromWei(this.props.totalpendingReward, 'Ether') * this.props.BAVAPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
                                    </div>
                                    <div className="left ">
                                        <span><small>All pools compound at an optimal rate</small></span>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="card-body" style={{ paddingBottom: '5px' }}>
                                <div>
                                    <div className="left mb-3" style={{ color: 'silver' }}>
                                        Your BAVA Balance<br />
                                        <div style={{ color: 'silver' }}><b>0 BAVA</b></div>
                                    </div>
                                    <div className="float-right mb-2">
                                        {this.props.farmloading ?
                                            <div>
                                                <Popup trigger={open => (<Buttons className="textDarkMedium cell2" style={{maxWidth:'120px'}} variant="outline" size="lg" >Connect to display</Buttons>)} modal {...{ contentStyle }}>
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
                                            : <Buttons className="textDarkMedium1 cell2" style={{maxWidth:'120px'}} variant="outline" size="lg" >Connect to display</Buttons>
                                        }
                                    </div>
                                    <div className="left mb-3" style={{ color: 'silver' }}>
                                        Your Locked BAVA<br />
                                        <div style={{ color: 'silver' }}><b>0 BAVA</b></div>
                                    </div>
                                    <div className="left mb-2" style={{ color: 'silver' }}>Total pending harvest&nbsp;&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={13} /></span>
                                            )}
                                            on="hover"
                                            offsetY={0}
                                            offsetX={5}
                                            position="right center"
                                        ><span className="textInfo"><small>Total BAVA tokens earned acrossed all farm </small></span>
                                        </Popup><br /><b></b><div style={{ color: 'silver' }}><b>0 BAVA</b></div>
                                    </div>

                                    <span className="left " style={{ color: 'silver' }}>
                                        <small><span>All pools compound at an optimal rate</span></small>
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                </MediaQuery>

                <div className="textMiddle center" ><b><big>BAVA Price: $ {this.props.BAVAPrice}&nbsp;&nbsp;</big></b></div>
                <div className="center" style={{ color: 'grey' }}><small>&nbsp;! Attention:&nbsp;Be sure to read <a href="https://baklavaspace.gitbook.io/" target="_blank">baklavaspace.gitbook</a> before using the pools so you are familiar with protocol risks and fees!</small></div>
                <div className="ml-auto mr-auto mt-3" style={{}}>
                    <div className="">
                        <div className="textMiddleBold1 float-left" style={{ marginLeft: '2px' }}><big>Select Platform</big></div>
                        <div className="textMiddleBold1 float-right" style={{ marginRight: '5px' }}><big>TVL $ {parseFloat(this.props.totalTVL).toLocaleString('en-US', { maximumFractionDigits: 0 })}</big></div><br /><br />
                        <span className="float-left">
                            <ButtonGroup>
                                <Buttons className="mr-1" variant="outlined" size="small" color="inherit" as={Link} to="/menu/v2">Pangolin</Buttons>
                                <Buttons className="mr-1" variant="text" size="small" color="inherit" as={Link} to="/menu/v2/kyber">KyberSwap</Buttons>
                                <Buttons variant="text" size="small" color="inherit" as={Link} to="/menu/v2/traderjoe">Trader Joe</Buttons>
                            </ButtonGroup>
                        </span>
                    </div>
                    <br /><br />


                    <div>
                        {this.props.farmloading ?
                            <div className="" style={{}}>
                                {this.props.poolSegmentInfoV2_3[0].map((poolSegmentInfoV2_3, key) => {
                                    let i = this.props.poolSegmentInfoV2_3[0].indexOf(poolSegmentInfoV2_3)
                                    return (
                                        <div key={key}>
                                            <div>
                                                {this.props.poolSegmentInfoV2_3[0][i].lpName != "BAVA-AVAX" ? <div></div> :
                                                    <div className="card mb-3 cardbody">
                                                        <div className="card-body" style={{ padding: '1rem' }}>
                                                            <div className="card cardbody" style={{ border: '0px' }}>
                                                                <MediaQuery minWidth={1001}>
                                                                    <div className='rowC' style={{ padding: '0rem', cursor: 'pointer' }} onClick={() => {
                                                                        this.clickfarmOpen(i)
                                                                    }}>
                                                                        <div className="float-left rowC" style={{ minWidth: '200px' }}>
                                                                            <span className="mr-3 mt-2">
                                                                                <div className="textMiddle" style={{ width: '48px' }}>
                                                                                    {this.props.poolSegmentInfoV2_3[0][i].icon.map((icon, key) => {
                                                                                        return (
                                                                                            <img key={key} className={icon.imagePosition} src={`/images/${icon.image}`} width={icon.imageSize} height={icon.imageSize} alt="" />
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </span>
                                                                            <span>
                                                                                <div className="textMiddle"><b>{this.props.poolSegmentInfoV2_3[0][i].lpName}{this.props.poolSegmentInfoV2_3[0][i].status}</b></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].projectLink, '_blank')
                                                                                }}>Uses: {this.props.poolSegmentInfoV2_3[0][i].platform} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].getLPLink, '_blank')
                                                                                }}>Get {this.props.poolSegmentInfoV2_3[0][i].lpName} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].farmContract, '_blank')
                                                                                }}>View On Explorer <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                            </span>
                                                                        </div>
                                                                        <div >
                                                                            <table className="float-right mr-auto">
                                                                                <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                    <tr>
                                                                                        <th scope="col" width="140">Wallet</th>
                                                                                        <th scope="col" width="140">Deposited</th>
                                                                                        <th scope="col">Growth</th>
                                                                                        <th scope="col">APR&nbsp;<Popup
                                                                                            trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                            on="hover"
                                                                                            offsetY={0}
                                                                                            offsetX={5}
                                                                                            position="right center"
                                                                                            contentStyle={{ width: '150px' }}
                                                                                        ><div className="textInfo">APR Breakdown: </div><br />
                                                                                            <div className="textInfo">Baklava   : {parseFloat(this.props.aprV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                            <div className="textInfo">Pangolin : {parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                        </Popup></th>
                                                                                        <th scope="col">APY <Popup
                                                                                            trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                            on="hover"
                                                                                            offsetY={0}
                                                                                            offsetX={5}
                                                                                            position="right center"
                                                                                            contentStyle={{ width: '150px' }}
                                                                                        ><div className="textInfo"><small>APY are calculated based on the compound APR number excluded locked reward.</small></div><br />
                                                                                            <div className="textInfo"><small>The value shown is based on daily compounding frequency.</small></div>
                                                                                        </Popup></th>
                                                                                        <th scope="col">TVL</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="textGrey">
                                                                                    <tr>
                                                                                        <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.lpBalanceAccountV2_3[0][i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                        <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.userSegmentInfoV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.returnRatioV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className="">{this.props.aprloading ? <div>{(parseFloat(this.props.aprV2_3[0][i]) + parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR)).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.apyDailyV2_3[0][i]) > 1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.apyDailyV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                        <td className="">$ {parseFloat(this.props.tvlV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </MediaQuery>



                                                                {this.state.farmV2_3Open[i] ?
                                                                    <div>
                                                                        {this.props.wallet || this.props.walletConnect ?
                                                                            <div className="borderTop ">
                                                                                <div className="mt-3">
                                                                                    <div className="float-left">
                                                                                        <div className="card cardbody mr-2" style={{ marginBottom: '6px', width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>BAVA earned</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.pendingSegmentRewardV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> :
                                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                                <span className="float-right">
                                                                                                    <Buttons
                                                                                                        variant="success"
                                                                                                        size="sm"
                                                                                                        style={{ minWidth: '80px' }}
                                                                                                        onClick={(event) => {
                                                                                                            event.preventDefault()
                                                                                                            console.log(i)
                                                                                                            this.props.harvest(i, 0, 4)
                                                                                                        }}>
                                                                                                        Harvest
                                                                                                    </Buttons></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody float-left mr-3" style={{ marginBottom: '6px', width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Reinvest </small><Popup
                                                                                                    trigger={open => (
                                                                                                        <span><BsFillQuestionCircleFill size={13} /></span>
                                                                                                    )}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                ><span className="textInfo"><small>This farm has a 2% reinvest reward paid in WAVAX. Pressing the button is optional.</small></span>
                                                                                                </Popup></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.reinvestAmount[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 5 })} WAVAX</div> :
                                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                                <span className="float-right">
                                                                                                    <Buttons
                                                                                                        variant="info"
                                                                                                        size="sm"
                                                                                                        style={{ minWidth: '80px' }}
                                                                                                        onClick={(event) => {
                                                                                                            event.preventDefault()
                                                                                                            console.log(i)
                                                                                                            this.props.reinvest(i, 0)
                                                                                                        }}>
                                                                                                        Reinvest
                                                                                                    </Buttons></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="float-right">
                                                                                        <span className="card cardbody float-right" style={{ width: '650px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                {this.props.lpSegmentAllowanceV2_3[0][i] > 2000000000000000000000000000 ?
                                                                                                    <div><Deposit
                                                                                                        lpBalanceAccount={this.props.lpBalanceAccountV2_3}
                                                                                                        poolSegmentInfo={this.props.poolSegmentInfoV2_3}
                                                                                                        userSegmentInfo={this.props.userSegmentInfoV2_3}
                                                                                                        i={i}
                                                                                                        n='0'
                                                                                                        v='4'
                                                                                                        deposit={this.props.deposit}
                                                                                                        withdraw={this.props.withdraw}
                                                                                                    /></div>
                                                                                                    :
                                                                                                    <div>
                                                                                                        <span className="float-left " style={{ color: 'black' }}><small>Enable Pool</small></span>
                                                                                                        <Buttons className="btn-block"
                                                                                                            variant="outline-primary"
                                                                                                            size="sm"
                                                                                                            style={{ minWidth: '80px' }}
                                                                                                            onClick={(event) => {
                                                                                                                event.preventDefault()
                                                                                                                this.props.approve(i, 0, 4)
                                                                                                            }}>
                                                                                                            Approve
                                                                                                        </Buttons>
                                                                                                    </div>}
                                                                                            </div>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> :
                                                                            <div className="center borderTop" >
                                                                                <span className="mt-3" style={{ color: 'black' }}><small>Wallet Connection to Avalanche required</small></span>
                                                                            </div>}
                                                                    </div> :
                                                                    <div></div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}



                                {this.props.poolSegmentInfoV2_3[0].map((poolSegmentInfoV2_3, key) => {
                                    let i = this.props.poolSegmentInfoV2_3[0].indexOf(poolSegmentInfoV2_3)
                                    return (
                                        <div key={key}>
                                            <div>
                                                {this.props.poolSegmentInfoV2_3[0][i].lpName == "BAVA-AVAX" ? <div></div> :
                                                    <div className="card mb-3 cardbody">
                                                        <div className="card-body" style={{ padding: '1rem' }}>
                                                            <div className="card cardbody" style={{ border: '0px' }}>
                                                                <MediaQuery minWidth={1001}>
                                                                    <div className='card-body rowC' style={{ padding: '0rem', cursor: 'pointer' }} onClick={() => {
                                                                        this.clickfarmOpen(i)
                                                                    }}>
                                                                        <div className="float-left rowC" style={{ minWidth: '200px' }}>
                                                                            <span className="mr-3 mt-2">
                                                                                <div className="textMiddle" style={{ width: '48px' }}>
                                                                                    {this.props.poolSegmentInfoV2_3[0][i].icon.map((icon, key) => {
                                                                                        return (
                                                                                            <img key={key} className={icon.imagePosition} src={`/images/${icon.image}`} width={icon.imageSize} height={icon.imageSize} alt="" />
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </span>
                                                                            <span>
                                                                                <div className="textMiddle"><b>{this.props.poolSegmentInfoV2_3[0][i].lpName}{this.props.poolSegmentInfoV2_3[0][i].status}</b></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].projectLink, '_blank')
                                                                                }}>Uses: {this.props.poolSegmentInfoV2_3[0][i].platform} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].getLPLink, '_blank')
                                                                                }}>Get {this.props.poolSegmentInfoV2_3[0][i].lpName} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].farmContract, '_blank')
                                                                                }}>View On Explorer <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                            </span>
                                                                        </div>
                                                                        <div className="ml-5">
                                                                            <table className="float-right mr-auto">
                                                                                <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                    <tr>
                                                                                        <th scope="col" width="140">Wallet</th>
                                                                                        <th scope="col" width="140">Deposited</th>
                                                                                        <th scope="col">Growth</th>
                                                                                        <th scope="col">APR&nbsp;<Popup
                                                                                            trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                            on="hover"
                                                                                            offsetY={0}
                                                                                            offsetX={5}
                                                                                            position="right center"
                                                                                            contentStyle={{ width: '150px' }}
                                                                                        ><div className="textInfo">APR Breakdown: </div><br />
                                                                                            <div className="textInfo">Baklava   : {parseFloat(this.props.aprV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                            <div className="textInfo">Pangolin : {parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                        </Popup></th>
                                                                                        <th scope="col">APY <Popup
                                                                                            trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                            on="hover"
                                                                                            offsetY={0}
                                                                                            offsetX={5}
                                                                                            position="right center"
                                                                                            contentStyle={{ width: '150px' }}
                                                                                        ><div className="textInfo"><small>APY are calculated based on the compound APR number excluded locked reward.</small></div><br />
                                                                                            <div className="textInfo"><small>The value shown is based on daily compounding frequency.</small></div>
                                                                                        </Popup></th>
                                                                                        <th scope="col">TVL</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="textGrey">
                                                                                    <tr>
                                                                                        <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.lpBalanceAccountV2_3[0][i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                        <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.userSegmentInfoV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.returnRatioV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className="">{this.props.aprloading ? <div>{(parseFloat(this.props.aprV2_3[0][i]) + parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR)).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                        <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.apyDailyV2_3[0][i]) > 1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.apyDailyV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                            <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                        <td className="">$ {parseFloat(this.props.tvlV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
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
                                                                        <div className="float-left rowC mb-3" style={{ minWidth: '200px' }}>
                                                                            <span className="mr-3 mt-2">
                                                                                <div className="textMiddle" style={{ width: '48px' }}>
                                                                                    {this.props.poolSegmentInfoV2_3[0][i].icon.map((icon, key) => {
                                                                                        return (
                                                                                            <img key={key} className={icon.imagePosition} src={`/images/${icon.image}`} width={icon.imageSize} height={icon.imageSize} alt="" />
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </span>
                                                                            <span>
                                                                                <div className="textMiddle"><b>{this.props.poolSegmentInfoV2_3[0][i].lpName}{this.props.poolSegmentInfoV2_3[0][i].status}</b></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].projectLink, '_blank')
                                                                                }}>Uses: {this.props.poolSegmentInfoV2_3[0][i].platform} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].getLPLink, '_blank')
                                                                                }}>Get {this.props.poolSegmentInfoV2_3[0][i].lpName} <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                                <div className="textGrey exLink0" onClick={() => {
                                                                                    window.open(this.props.poolSegmentInfoV2_3[0][i].farmContract, '_blank')
                                                                                }}>View On Explorer <img src="/images/link.png" style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                            </span>
                                                                        </div>
                                                                        <MediaQuery minWidth={701}>
                                                                            <div>
                                                                                <table className="float-right mr-auto">
                                                                                    <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                        <tr>
                                                                                            <th scope="col" width="140">Wallet</th>
                                                                                            <th scope="col" width="140">Deposited</th>
                                                                                            <th scope="col">Growth</th>
                                                                                            <th scope="col">APR&nbsp;<Popup
                                                                                                trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                                on="hover"
                                                                                                offsetY={0}
                                                                                                offsetX={5}
                                                                                                position="right center"
                                                                                                contentStyle={{ width: '150px' }}
                                                                                            ><div className="textInfo">APR Breakdown: </div><br />
                                                                                                <div className="textInfo">Baklava   : {parseFloat(this.props.aprV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                                <div className="textInfo">Pangolin : {parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                            </Popup></th>
                                                                                            <th scope="col">APY <Popup
                                                                                                trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                                on="hover"
                                                                                                offsetY={0}
                                                                                                offsetX={5}
                                                                                                position="right center"
                                                                                                contentStyle={{ width: '150px' }}
                                                                                            ><div className="textInfo"><small>APY are calculated based on the compound APR number excluded locked reward.</small></div><br />
                                                                                                <div className="textInfo"><small>The value shown is based on daily compounding frequency.</small></div>
                                                                                            </Popup></th>
                                                                                            <th scope="col">TVL</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className="textGrey">
                                                                                        <tr>
                                                                                            <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.lpBalanceAccountV2_3[0][i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                            <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.userSegmentInfoV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.returnRatioV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            <td className="">{this.props.aprloading ? <div>{(parseFloat(this.props.aprV2_3[0][i]) + parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR)).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.apyDailyV2_3[0][i]) > 1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.apyDailyV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                                <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                            <td className="">$ {parseFloat(this.props.tvlV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
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
                                                                                                <th scope="col" width="140">Deposited</th>
                                                                                                <th scope="col">Growth</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.lpBalanceAccountV2_3[0][i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.userSegmentInfoV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.returnRatioV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col">APR&nbsp;<Popup
                                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                    contentStyle={{ width: '150px' }}
                                                                                                ><div className="textInfo">APR Breakdown: </div><br />
                                                                                                    <div className="textInfo">Baklava   : {parseFloat(this.props.aprV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                                    <div className="textInfo">Pangolin : {parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                                </Popup></th>
                                                                                                <th scope="col">APY <Popup
                                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                    contentStyle={{ width: '150px' }}
                                                                                                ><div className="textInfo"><small>APY are calculated based on the compound APR number excluded locked reward.</small></div><br />
                                                                                                    <div className="textInfo"><small>The value shown is based on daily compounding frequency.</small></div>
                                                                                                </Popup></th>
                                                                                                <th scope="col">TVL</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{this.props.aprloading ? <div>{(parseFloat(this.props.aprV2_3[0][i]) + parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR)).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.apyDailyV2_3[0][i]) > 1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.apyDailyV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                                <td className="">$ {parseFloat(this.props.tvlV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
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
                                                                                                <th scope="col" width="140">Deposited</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.lpBalanceAccountV2_3[0][i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.userSegmentInfoV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col">Growth</th>
                                                                                                <th scope="col">APR&nbsp;<Popup
                                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                    contentStyle={{ width: '150px' }}
                                                                                                ><div className="textInfo">APR Breakdown: </div><br />
                                                                                                    <div className="textInfo">Baklava   : {parseFloat(this.props.aprV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                                    <div className="textInfo">Pangolin : {parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                                </Popup></th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.returnRatioV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                                <td className="">{this.props.aprloading ? <div>{(parseFloat(this.props.aprV2_3[0][i]) + parseFloat(this.props.poolSegmentInfoV2_3[0][i].total3rdPartyAPR)).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                            <tr>
                                                                                                <th scope="col">APY <Popup
                                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                    contentStyle={{ width: '150px' }}
                                                                                                ><div className="textInfo"><small>APY are calculated based on the compound APR number excluded locked reward.</small></div><br />
                                                                                                    <div className="textInfo"><small>The value shown is based on daily compounding frequency.</small></div>
                                                                                                </Popup></th>
                                                                                                <th scope="col">TVL</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="textGrey">
                                                                                            <tr>
                                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.apyDailyV2_3[0][i]) > 1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.apyDailyV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                                <td className="">$ {parseFloat(this.props.tvlV2_3[0][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </MediaQuery>
                                                                        </MediaQuery>
                                                                    </div>
                                                                </MediaQuery>
                                                            </div>


                                                            {this.state.farmV2_3Open[i] ?
                                                                <div>
                                                                    {this.props.wallet || this.props.walletConnect ?
                                                                        <div className="borderTop ">
                                                                            <div className="mt-3">
                                                                                <MediaQuery minWidth={851}>
                                                                                    <div className="float-left">
                                                                                        <div className="card cardbody mr-3" style={{ marginBottom: '6px', width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>BAVA earned</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.pendingSegmentRewardV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> :
                                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                                <span className="float-right">
                                                                                                    <Buttons
                                                                                                        variant="success"
                                                                                                        size="sm"
                                                                                                        style={{ minWidth: '80px' }}
                                                                                                        onClick={(event) => {
                                                                                                            event.preventDefault()
                                                                                                            console.log(i)
                                                                                                            this.props.harvest(i, 0, 4)
                                                                                                        }}>
                                                                                                        Harvest
                                                                                                    </Buttons></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody float-left mr-3" style={{ width: '300px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Reinvest </small><Popup
                                                                                                    trigger={open => (
                                                                                                        <span><BsFillQuestionCircleFill size={13} /></span>
                                                                                                    )}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                ><span className="textInfo"><small>This farm has a 2% reinvest reward paid in WAVAX. Pressing the button is optional.</small></span>
                                                                                                </Popup></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.reinvestAmount[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 5 })} WAVAX</div> :
                                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                                <span className="float-right">
                                                                                                    <Buttons
                                                                                                        variant="info"
                                                                                                        size="sm"
                                                                                                        style={{ minWidth: '80px' }}
                                                                                                        onClick={(event) => {
                                                                                                            event.preventDefault()
                                                                                                            console.log(i)
                                                                                                            this.props.reinvest(i, 0)
                                                                                                        }}>
                                                                                                        Reinvest
                                                                                                    </Buttons></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </MediaQuery>
                                                                                <MediaQuery maxWidth={850}>
                                                                                    <div>
                                                                                        <div className="card cardbody" style={{ marginBottom: '6px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>BAVA earned</small></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.pendingSegmentRewardV2_3[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> :
                                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                                <span className="float-right">
                                                                                                    <Buttons
                                                                                                        variant="success"
                                                                                                        size="sm"
                                                                                                        style={{ minWidth: '80px' }}
                                                                                                        onClick={(event) => {
                                                                                                            event.preventDefault()
                                                                                                            console.log(i)
                                                                                                            this.props.harvest(i, 0, 4)
                                                                                                        }}>
                                                                                                        Harvest
                                                                                                    </Buttons></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="card cardbody" style={{ marginBottom: '6px' }}>
                                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                                <span className="float-left" style={{ color: 'black' }}><small>Reinvest </small><Popup
                                                                                                    trigger={open => (
                                                                                                        <span><BsFillQuestionCircleFill size={13} /></span>
                                                                                                    )}
                                                                                                    on="hover"
                                                                                                    offsetY={0}
                                                                                                    offsetX={5}
                                                                                                    position="right center"
                                                                                                ><span className="textInfo"><small>This farm has a 2% reinvest reward paid in WAVAX. Pressing the button is optional.</small></span>
                                                                                                </Popup></span><br />
                                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.reinvestAmount[0][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 5 })} WAVAX</div> :
                                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                                <span className="float-right">
                                                                                                    <Buttons
                                                                                                        variant="info"
                                                                                                        size="sm"
                                                                                                        style={{ minWidth: '80px' }}
                                                                                                        onClick={(event) => {
                                                                                                            event.preventDefault()
                                                                                                            console.log(i)
                                                                                                            this.props.reinvest(i, 0)
                                                                                                        }}>
                                                                                                        Reinvest
                                                                                                    </Buttons></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </MediaQuery>


                                                                                <div className="card cardbody" style={{ minWidth: '350px' }}>
                                                                                    <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                        {this.props.lpSegmentAllowanceV2_3[0][i] > 2000000000000000000000000000 ?
                                                                                            <div><Deposit
                                                                                                lpBalanceAccount={this.props.lpBalanceAccountV2_3}
                                                                                                poolSegmentInfo={this.props.poolSegmentInfoV2_3}
                                                                                                userSegmentInfo={this.props.userSegmentInfoV2_3}
                                                                                                i={i}
                                                                                                n='0'
                                                                                                v='4'
                                                                                                deposit={this.props.deposit}
                                                                                                withdraw={this.props.withdraw}
                                                                                            /></div>
                                                                                            :
                                                                                            <div>
                                                                                                <span className="float-left " style={{ color: 'black' }}><small>Enable Pool</small></span>
                                                                                                <Buttons className="btn-block"
                                                                                                    variant="outline-primary"
                                                                                                    size="sm"
                                                                                                    style={{ minWidth: '80px' }}
                                                                                                    onClick={(event) => {
                                                                                                        event.preventDefault()
                                                                                                        this.props.approve(i, 0, 4)
                                                                                                    }}>
                                                                                                    Approve
                                                                                                </Buttons>
                                                                                            </div>}
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

export default Menu;