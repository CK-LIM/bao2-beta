import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from '@material-ui/core/Button';
import exlink from '../link.png'
import Buttons from 'react-bootstrap/Button'
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Deposit from './Deposit'
import './App.css';
import Footer from './Footer'

class TraderJoe extends Component {

    render() {
        return (
            <div id="content" className="mt-3" style={{ margin: "0", color: '#ff9a04' }}>
                <div >
                    <div className="ml-auto mr-auto card mb-3 cardbody" style={{ width: '1000px', height: '170px', color: 'black' }}>
                        {this.props.wallet || this.props.walletConnect ?
                            <div className="card-body">
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
                                            offsetY={-10}
                                            offsetX={10}
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
                            <div className="card-body ">
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
                                        <Buttons className="textDarkMedium" variant="outline" size="lg" onClick={async () => {
                                            await this.props.connectMetamask()
                                        }}>Connect to display</Buttons> :
                                        <Buttons className="textDarkMedium1" variant="outline" size="lg" >Connect to display</Buttons>
                                    }
                                </span>
                                <span>
                                    <span className="float-left" style={{ color: 'silver' }}>Total pending harvest&nbsp;&nbsp;
                                        <Popup
                                            trigger={open => (
                                                <span><BsFillQuestionCircleFill size={13} /></span>
                                            )}
                                            on="hover"
                                            offsetY={-10}
                                            offsetX={10}
                                            position="right center"
                                        ><span className="textInfo"><small>Total BAVA tokens earned acrossed all farm </small></span>
                                        </Popup>
                                    </span><br />
                                    <span className="float-left ">
                                        <div style={{ color: 'silver' }}><b>0 BAVA</b></div>
                                    </span>
                                    <span className="float-right" style={{ color: 'silver' }}>
                                        <small><span>All pools compound at an optimal rate</span></small>
                                    </span>
                                </span>
                            </div>
                        }
                    </div>
                </div>

                {/* <div className="textMiddle center" ><b><big>BAVA Price: $ {this.props.BAVAPrice}&nbsp;&nbsp;
                    <Popup
                        trigger={open => (
                            <span><BsFillQuestionCircleFill size={13} /></span>
                        )}
                        on="hover"
                        offsetY={-10}
                        offsetX={10}
                        position="right center"
                    ><span className="textInfo"><small>Initial BAVA token price to USD will be fixed at the rate $ 0.10 </small></span>
                    </Popup></big></b></div>

                <div className="center" style={{ color: 'grey' }}><small>&nbsp;! Attention:&nbsp;Be sure to read <a href="https://baklavaspace.gitbook.io/" target="_blank">baklavaspace.gitbook</a> before using the pools so you are familiar with protocol risks and fees!</small></div> */}
               <div className="center mt-4" style={{ color: 'black' }}><big><b>&nbsp;! Attention:&nbsp;Please use Version 2 farm for higher yield!&nbsp;&nbsp;&gt;&gt;&nbsp;<Link to="/menu/v2/"><Buttons className="textDarkMedium" variant="outline" size="sm" >Switch to V2</Buttons></Link></b></big></div>
            

                <div className="ml-auto mr-auto mt-3" style={{ width: '1000px' }}>
                    <div className="">
                        <div className="textMiddleBold1 float-left" style={{ marginLeft: '2px' }}><big>Select Platform</big></div>
                        <div className="textMiddleBold1 float-right" style={{ marginRight: '5px' }}><big>TVL $ {parseFloat(this.props.totalTVL).toLocaleString('en-US', { maximumFractionDigits: 0 })}</big></div><br /><br />
                        <span className="float-left">
                            <ButtonGroup>
                                <Button variant="text" size="small" color="inherit" component={Link} to="/menu/">Pangolin</Button>
                                <Button variant="outlined" size="small" color="inherit" component={Link} to="/menu/traderjoe/">Trader Joe</Button>
                            </ButtonGroup>
                        </span>
                        {/* <span className="float-right mr-4">
                            <ButtonGroup>
                                <Button variant="text" size="small" color="inherit" >Sort by</Button>
                            </ButtonGroup>
                        </span> */}
                    </div>
                    <br /><br />












                    <div>
                        {this.props.farmloading ?
                            <div className="" style={{ width: '1000px' }}>
                                {this.props.bavaPoolSegmentInfo[1].map((bavaPoolSegmentInfo, key) => {
                                    let i = this.props.bavaPoolSegmentInfo[1].indexOf(bavaPoolSegmentInfo)
                                    return (
                                        <div key={key}>
                                            <div>
                                                <div className="card mb-3 cardbody">
                                                    <div className="card-body" style={{ padding: '1rem' }}>
                                                        <div>
                                                            <div>
                                                                <div className="float-left">
                                                                    <div className="textMiddle"><b>{this.props.bavaPoolSegmentInfo[1][i].lpName}{this.props.bavaPoolSegmentInfo[1][i].status}</b></div>
                                                                    <div className="textGrey exLink0" onClick={() => {
                                                                        window.open(this.props.bavaPoolSegmentInfo[1][i].projectLink, '_blank')
                                                                    }}>Uses: {this.props.bavaPoolSegmentInfo[1][i].platform} <img src={exlink} style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                    <div className="textGrey exLink0" onClick={() => {
                                                                        window.open(this.props.bavaPoolSegmentInfo[1][i].getLPLink, '_blank')
                                                                    }}>Get {this.props.bavaPoolSegmentInfo[1][i].lpName} <img src={exlink} style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                    <div className="textGrey exLink0" onClick={() => {
                                                                        window.open(this.props.bavaContract, '_blank')
                                                                    }}>View On Explorer <img src={exlink} style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                </div>
                                                                <div className="float-right mr-auto">
                                                                    <table>
                                                                        <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                            <tr>
                                                                                <th scope="col" width="140">Wallet</th>
                                                                                <th scope="col" width="140">Deposited</th>
                                                                                <th scope="col">Growth</th>
                                                                                <th scope="col">APR&nbsp;<Popup
                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                    on="hover"
                                                                                    offsetY={-8}
                                                                                    offsetX={5}
                                                                                    position="right center"
                                                                                    contentStyle={{ width: '150px' }}
                                                                                ><div className="textInfo">APR Breakdown: </div><br />
                                                                                    <div className="textInfo">Baklava   : {parseFloat(this.props.bavaapr[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                    <div className="textInfo">TraderJoe : {parseFloat(this.props.bavaPoolSegmentInfo[1][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                </Popup></th>
                                                                                <th scope="col">APY <Popup
                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                    on="hover"
                                                                                    offsetY={-8}
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
                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.bavaLpBalanceAccount[1][i]), 'Ether').toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.bavaUserSegmentInfo[1][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.bavaReturnRatio[1][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.bavaapr[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.bavaapyDaily[1][i])>1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.bavaapyDaily[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                    <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                <td className="">$ {parseFloat(this.props.bavatvl[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <br /><br /><br /><br />
                                                            {this.props.farmV1Open[i] ?
                                                                <div>
                                                                    <div>
                                                                        <Buttons variant="outline-secondary" size="sm" style={{ width: '60px' }} onClick={() => {
                                                                            this.props.setI(i, false, 1)
                                                                        }}>Close</Buttons>&nbsp;&nbsp;&nbsp;</div>
                                                                    {this.props.wallet || this.props.walletConnect ? <div className="borderTop "><div className="rowC mt-3">
                                                                        <div className="card cardbody float-left mr-3" style={{ width: '300px' }}>
                                                                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                <span className="float-left" style={{ color: 'black' }}><small>BAVA earned</small></span><br />
                                                                                <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.bavaPendingSegmentReward[1][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> :
                                                                                    <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                <span className="float-right">
                                                                                    <Buttons
                                                                                        variant="success"
                                                                                        size="sm"
                                                                                        style={{ minWidth: '80px' }}
                                                                                        onClick={(event) => {
                                                                                            event.preventDefault()
                                                                                            this.props.harvest(i, 1, 1)
                                                                                        }}>
                                                                                        Harvest
                                                                                    </Buttons></span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="float-right">
                                                                            <span className="card cardbody float-right" style={{ width: '650px' }}>
                                                                                <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                    {this.props.bavaLpSegmentAllowance[1][i] > 2000000000000000000000000000 ?
                                                                                        <div><Deposit
                                                                                            lpBalanceAccount={this.props.bavaLpBalanceAccount}
                                                                                            poolSegmentInfo={this.props.bavaPoolSegmentInfo}
                                                                                            userSegmentInfo={this.props.bavaUserSegmentInfo}
                                                                                            i={i}
                                                                                            n='1'
                                                                                            v='1'
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
                                                                                                    this.props.approve(i, 1, 1)
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
                                                                <div>
                                                                    <Buttons variant="outline-secondary" size="sm" style={{ width: '60px' }} onClick={() => {
                                                                        this.props.setI(i, true, 1)
                                                                    }}><b>Open</b></Buttons></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}










                                {this.props.poolSegmentInfo[1].map((poolSegmentInfo, key) => {
                                    let i = this.props.poolSegmentInfo[1].indexOf(poolSegmentInfo)
                                    return (
                                        <div key={key}>
                                            {this.props.poolSegmentInfo[1][i].lpName == "AVAX-JOE" ? <div></div> :
                                                <div>
                                                    <div className="card mb-3 cardbody">
                                                        <div className="card-body" style={{ padding: '1rem' }}>
                                                            <div>
                                                                <div>
                                                                    <div className="float-left">
                                                                        <div className="textMiddle"><b>{this.props.poolSegmentInfo[1][i].lpName}{this.props.poolSegmentInfo[1][i].status}</b></div>
                                                                        <div className="textGrey exLink0" onClick={() => {
                                                                            window.open(this.props.poolSegmentInfo[1][i].projectLink, '_blank')
                                                                        }}>Uses: {this.props.poolSegmentInfo[1][i].platform} <img src={exlink} style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                        <div className="textGrey exLink0" onClick={() => {
                                                                            window.open(this.props.poolSegmentInfo[1][i].getLPLink, '_blank')
                                                                        }}>Get {this.props.poolSegmentInfo[1][i].lpName} <img src={exlink} style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                        <div className="textGrey exLink0" onClick={() => {
                                                                            window.open(this.props.bavaContract, '_blank')
                                                                        }}>View On Explorer <img src={exlink} style={{ marginBottom: "3px" }} height='12' alt="" /></div>
                                                                    </div>
                                                                    <div className="float-right mr-auto">
                                                                        <table>
                                                                            <thead className="textBlackSmall" style={{ color: 'black' }}>
                                                                                <tr>
                                                                                    <th scope="col" width="140">Wallet</th>
                                                                                    <th scope="col" width="140">Deposited</th>
                                                                                    <th scope="col">Growth</th>
                                                                                    <th scope="col">APR&nbsp;<Popup
                                                                                        trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                        on="hover"
                                                                                        offsetY={-8}
                                                                                        offsetX={5}
                                                                                        position="right center"
                                                                                        contentStyle={{ width: '150px' }}
                                                                                    ><div className="textInfo">APR Breakdown: </div><br />
                                                                                        <div className="textInfo">Baklava   : {parseFloat(this.props.apr[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div><br />
                                                                                        <div className="textInfo">TraderJoe : {parseFloat(this.props.poolSegmentInfo[1][i].total3rdPartyAPR).toLocaleString('en-US', { maximumFractionDigits: 0 })} %</div>
                                                                                    </Popup></th>
                                                                                    <th scope="col">APY <Popup
                                                                                    trigger={open => (<span><BsFillQuestionCircleFill style={{ marginBottom: "2px" }} size={10} /></span>)}
                                                                                    on="hover"
                                                                                    offsetY={-8}
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
                                                                                    <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.lpBalanceAccount[1][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                    <td className="">{(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.userSegmentInfo[1][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 18 })}</div> : <div className="center">
                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                    <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.returnRatio[1][i]).toLocaleString('en-US', { maximumFractionDigits: 5 })}</div> : <div className="center">
                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                    <td className="">{this.props.aprloading ? <div>{(parseFloat(this.props.apr[1][i]) + + parseFloat(this.props.poolSegmentInfo[1][i].total3rdPartyAPR)).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div> : <div className="center">
                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>} </td>
                                                                                    <td className="">{this.props.aprloading ? <div>{parseFloat(this.props.apyDaily[1][i])>1000000 ? <div>&#x3e;100,000%</div> : <div>{parseFloat(this.props.apyDaily[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })}%</div>}</div> : <div className="center">
                                                                                        <div className="lds-facebook"><div></div><div></div><div></div></div></div>}</td>
                                                                                    <td className="">$ {parseFloat(this.props.tvl[1][i]).toLocaleString('en-US', { maximumFractionDigits: 0 })} </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                                <br /><br /><br /><br />
                                                                {this.props.farmV2Open[i] ?
                                                                    <div>
                                                                        <div>
                                                                            <Buttons variant="outline-secondary" size="sm" style={{ width: '60px' }} onClick={() => {
                                                                                // this.props.setTrigger(true)
                                                                                this.props.setI(i, false, 2)
                                                                            }}>Close</Buttons>&nbsp;&nbsp;&nbsp;</div>
                                                                        {this.props.wallet || this.props.walletConnect ? <div className="borderTop "><div className="rowC mt-3">
                                                                            <div className="card cardbody float-left mr-3" style={{ width: '300px' }}>
                                                                                <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                    <span className="float-left" style={{ color: 'black' }}><small>BAVA earned</small></span><br />
                                                                                    <span className="float-left" style={{ color: 'black', marginTop: '8px' }}><small>{this.props.accountLoading ? <div>{parseFloat(window.web3Ava.utils.fromWei(this.props.pendingSegmentReward[1][i], 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div> :
                                                                                        <div className="ml-3 lds-facebook"><div></div><div></div><div></div></div>}</small></span>
                                                                                    <span className="float-right">
                                                                                        <Buttons
                                                                                            variant="success"
                                                                                            size="sm"
                                                                                            style={{ minWidth: '80px' }}
                                                                                            onClick={(event) => {
                                                                                                event.preventDefault()
                                                                                                this.props.harvest(i, 1, 2)
                                                                                            }}>
                                                                                            Harvest
                                                                                        </Buttons></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="float-right">
                                                                                <span className="card cardbody float-right" style={{ width: '650px' }}>
                                                                                    <div className="card-body" style={{ padding: '0.5rem' }}>
                                                                                        {this.props.lpSegmentAllowance[1][i] > 2000000000000000000000000000 ?
                                                                                            <div><Deposit
                                                                                                lpBalanceAccount={this.props.lpBalanceAccount}
                                                                                                poolSegmentInfo={this.props.poolSegmentInfo}
                                                                                                userSegmentInfo={this.props.userSegmentInfo}
                                                                                                i={i}
                                                                                                n='1'
                                                                                                v='2'
                                                                                                deposit={this.props.deposit}
                                                                                                withdraw={this.props.withdraw}
                                                                                                approve={this.props.approve}
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
                                                                                                        this.props.approve(i, 1, 2)
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
                                                                    <div>
                                                                        <Buttons variant="outline-secondary" size="sm" style={{ width: '60px' }} onClick={() => {
                                                                            // this.props.setTrigger(true)
                                                                            this.props.setI(i, true, 2)
                                                                        }}><b>Open</b></Buttons>&nbsp;&nbsp;&nbsp;</div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div className="center">
                                <div style={{ marginBottom: '350px' }}>
                                    <div className="bounceball"></div> &nbsp;
                                    <div className="textLoadingSmall">NETWORK IS Loading...</div>
                                    {/* <div className="textLoadingSmall">Sorry, we're down for scheduled mainenance right now.</div> */}
                                </div>
                            </div>
                        }
                    </div>
                </div><br/>
                <Footer/>
            </div >
        );
    }
}

export default TraderJoe;
