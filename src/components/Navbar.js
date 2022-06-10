import React, { Component } from 'react'
import MediaQuery from 'react-responsive';
import Buttons from 'react-bootstrap/Button'
import baklava from '../baklava.png'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import fox from '../metamask-fox.svg'
import coin98 from '../coin98.png'
import walletconnectLogo from '../walletconnect-logo.svg'
import Popup from 'reactjs-popup';
import { slide as Menu } from 'react-burger-menu'
import discord from '../discord.svg';
import twitter from '../twitter.svg';
import medium from '../medium.svg';
import git from '../github.svg';
import gitbook from '../docs.svg';
import 'reactjs-popup/dist/index.css';
import './App.css';

class Navb extends Component {
  render() {
    return (
      <Navbar style={{ padding: "0" }}>
        <Nav style={{ minWidth: '250px' }}>
          <MediaQuery maxWidth={1250}>
            <Menu >
              <div className='dropdown0'><NavLink className='dropdown' to='/menu/v2/' activeStyle={{ fontWeight: "bold", color: "#ffae00" }}>Farm</NavLink></div>
              <div className='dropdown0'><NavLink className='dropdown' to='/stake/' activeStyle={{ fontWeight: "bold", color: "#ffae00" }}>Stake</NavLink></div>
              {/* <div className='dropdown0'><NavLink className='dropdown' to='/claim/' activeStyle={{ fontWeight: "bold", color: "#ffae00" }}>Claim</NavLink></div> */}
              <div className='dropdown0'><NavLink className='dropdown' to='/collateral/' activeStyle={{ fontWeight: "bold", color: "#ffae00" }}>Collateral</NavLink></div>
              <div className='dropdown0'><NavLink className='dropdown' to='/synthetic/' activeStyle={{ fontWeight: "bold", color: "#ffae00" }}>Synthetic</NavLink></div>
              <div className='dropdown0'><NavLink className='dropdown' to='/litepaper/' activeStyle={{ fontWeight: "bold", color: "#ffae00" }}>LitePaper</NavLink></div>
            </Menu>
          </MediaQuery>

          <MediaQuery minWidth={1251}>
            <NavLink className="topleft" to="/"><img src={baklava} width="35" alt="" /></NavLink>
          </MediaQuery>
          <MediaQuery minWidth={351}>
            <NavLink className="topleft1 textMiddleBold2 reallyBold" to="/"><b>BAKLAVA.SPACE</b></NavLink>
          </MediaQuery>
          <MediaQuery minWidth={280} maxWidth={350}>
            <NavLink className="topleft1 textMiddleBold2 reallyBold" to="/"><b>BAKLAVA</b></NavLink>
          </MediaQuery>


          <div className="rowS topleft2" style={{ textDecoration: 'none' }}>
            <MediaQuery minWidth={1251}>
              <div
                style={{ marginLeft: "25px" }}
              ><Popup trigger={open => (
                <NavLink className="textSmallBold1" activeClassName=" " activeStyle={{ fontWeight: "bold", color: "#ffc400" }} to="/menu/v2/">Farm &#8595;</NavLink>
              )}
                on="hover"
                position="bottom center"
                offsetY={5}
                offsetX={0}
                mouseLeaveDelay={100}
                contentStyle={{ padding: '3px', width: '90px', textDecoration: "none" }}
                arrow={false}
              ><div>
                    <Link to="/traderjoe/"></Link>
                    <div className='dropdown0'><Link className="textInfo center" to="/menu/">Version 1</Link></div>
                    <div className='dropdown'><Link className="textInfo center" to="/menu/v2/">Version 2</Link></div>
                  </div>
                </Popup>
              </div>
              <div
                style={{ marginLeft: "25px" }}
              ><NavLink className="textSmallBold1" activeClassName=" " activeStyle={{ fontWeight: "bold", color: "#ffc400" }} to="/stake/">Stake</NavLink></div>
              {/* <div
                style={{ marginLeft: "25px" }}
              ><NavLink className="textSmallBold1" activeClassName=" " activeStyle={{ fontWeight: "bold", color: "#ffc400" }} to="/claim/">Claim</NavLink></div> */}
              <div
                style={{ marginLeft: "25px" }}
              ><NavLink className="textSmallBold1" activeClassName=" " activeStyle={{ fontWeight: "bold", color: "#ffc400" }} to="/collateral/">Collateral</NavLink></div>
              <div
                style={{ marginLeft: "25px" }}
              ><NavLink className="textSmallBold1" activeClassName=" " activeStyle={{ fontWeight: "bold", color: "#ffc400" }} to="/synthetic/">Synthetic</NavLink></div>
              <div
                style={{ marginLeft: "25px" }}
              ><NavLink className="textSmallBold1" activeClassName=" " activeStyle={{ fontWeight: "bold", color: "#ffc400" }} to="/litepaper/">LitePaper</NavLink></div>
            </MediaQuery>
          </div>

          <div>
            <MediaQuery minWidth={771}>
              <div className="center topright1">
                <div className="rowC">
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://baklavaspace.gitbook.io/" }} target="_blank">
                    <div className="center mb-2"><img src={gitbook} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://twitter.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={twitter} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://medium.com/@baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={medium} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://github.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={git} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '20px' }} to={{ pathname: "https://discord.gg/E6aYX5ukAw" }} target="_blank">
                    <div className="center mb-2"><img src={discord} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                </div>
              </div>
            </MediaQuery>

            <div>
              <ul className="topright rowC">
                <MediaQuery minWidth={500}>
                  <div>
                    <Link to="/menu/v2/">
                      <Buttons className="textWhiteLarge center" style={{ width: '100px', height: '30px', marginRight: '10px' }} variant="secondary" size="lg"> Menu</Buttons>
                    </Link>
                  </div>
                </MediaQuery>
                <div>
                  {this.props.wallet || this.props.walletConnect ?
                    <div>
                      <Popup trigger={open => (
                        <Buttons className="textWhiteLarge center" style={{ width: '100px', height: '30px' }} variant="warning" size="sm" > {this.props.first4Account}...{this.props.last4Account}</Buttons>
                      )}
                        on="hover"
                        position="bottom right"
                        offsetY={5}
                        offsetX={0}
                        mouseLeaveDelay={100}
                        contentStyle={{ padding: '5px' }}
                        arrow={false}
                      ><div>
                          <div className='dropdown0' onClick={() => {
                            window.open(`https://snowtrace.io/address/${this.props.account}`, '_blank')
                          }}>Wallet</div>
                          <div className='dropdown' onClick={() => {
                            this.props.setWalletTrigger(false)
                            if (this.props.walletConnect == true) {
                              this.props.WalletDisconnect()
                            }
                          }}>Disconnect</div>
                        </div>
                      </Popup>
                    </div>
                    : <div>
                      <Popup trigger={open => (
                        <Buttons className="textWhiteLarge center" style={{ width: '100px', height: '30px' }} variant="warning" size="lg" >CONNECT</Buttons>
                      )}
                        on="hover"
                        position="bottom right"
                        offsetY={5}
                        offsetX={0}
                        mouseLeaveDelay={100}
                        contentStyle={{ padding: '5px' }}
                        arrow={false}
                      >
                        <div>
                          <div className='dropdown0' onClick={async () => {
                            await this.props.connectMetamask()
                          }}><img src={fox} width="23" height="23" className="d-inline-block" alt="" />&nbsp; Metamask</div>
                          <div className='dropdown0' onClick={async () => {
                            await this.props.connectCoin98()
                          }}><img src={coin98} width="23" height="23" className="d-inline-block" alt="" />&nbsp; Coin98</div>
                          <div className='dropdown' onClick={async () => {
                            await this.props.mobileWalletConnect()
                          }}><img src={walletconnectLogo} width="26" height="23" className="d-inline-block" alt="" />&nbsp; WalletConnect</div>
                        </div>
                      </Popup>
                    </div>}
                </div>&nbsp;
              </ul>
            </div>
          </div>
        </Nav>
      </Navbar>
    );
  }
}

export default Navb;
