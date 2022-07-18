import React, { Component } from 'react'
import MediaQuery from 'react-responsive';
import Buttons from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import { slide as Menu } from 'react-burger-menu'
import Dropdown from 'react-bootstrap/Dropdown'
import 'reactjs-popup/dist/index.css';
import './App.css';

class Navb extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      show2: false
    }
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropdown = this.hideDropdown.bind(this)
    this.show2Dropdown = this.show2Dropdown.bind(this)
    this.hide2Dropdown = this.hide2Dropdown.bind(this)
  }

  showDropdown(i) {
    let show = this.state.show
    this.setState({ show: !show })  //do ntg, just to push react setstate
  }

  hideDropdown() {
    let show = this.state.show
    this.setState({ show: false })  //do ntg, just to push react setstate
  }

  show2Dropdown(i) {
    let show2 = this.state.show2
    this.setState({ show2: true })  //do ntg, just to push react setstate
  }

  hide2Dropdown() {
    this.setState({ show2: false })  //do ntg, just to push react setstate
  }

  render() {

    const contentStyle = { background: '#fffae6', border: "1px solid #596169", width: "30%", borderRadius: "15px", minWidth: "320px" };

    return (
      <Navbar className="navbar top" style={{ height: "80px", position: "fixed", width: "100%", top: "0", zIndex: "999", backgroundColor:"#fffae6" }}>
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
            <NavLink className="topleft" to="/"><img src="/images/baklava.png" width="35" alt="" /></NavLink>
          </MediaQuery>
          <MediaQuery minWidth={351}>
            <NavLink className="topleft1 textMiddleBold2 reallyBold" to="/"><b>BAKLAVA.SPACE</b></NavLink>
          </MediaQuery>
          <MediaQuery minWidth={280} maxWidth={350}>
            <NavLink className="topleft1 textMiddleBold2 reallyBold" to="/"><b>BAKLAVA</b></NavLink>
          </MediaQuery>


          <div className="rowS topleft2" style={{ textDecoration: 'none' }}>
            <MediaQuery minWidth={1251}>
              {/* <div
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
              </div> */}

              <div style={{ marginLeft: "25px" }} >
                <Dropdown style={{ padding: "0px" }}
                  onMouseEnter={this.showDropdown}
                  onMouseLeave={this.hideDropdown}
                  show={this.state.show}
                >
                  <Dropdown.Toggle className='center cell2' variant="transparent" style={{ paddingLeft: "10px" }}>
                    <NavLink className="textSmallBold1" activeClassName="" activeStyle={{ fontWeight: "bold", color: "#ffae00" }} to="/menu/v2/">Farm &#8595;</NavLink>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ backgroundColor: "#fffae6", marginTop: "0px", padding: '0px', minWidth: '7rem' }}>
                    <Dropdown.Item as={Link} to="/menu/" className='cell2' style={{ padding: '0px', marginLeft: "8px", width: '50px' }}>
                      <div className="dropdown center" style={{ fontSize: '15px', marginLeft: "20px" }}>Version 1</div>
                    </Dropdown.Item>
                    <Dropdown.Divider style={{ marginTop: "4px", marginBottom: '4px' }} />
                    <Dropdown.Item as={Link} to="/menu/v2/" className='cell2' style={{ padding: '0px', marginLeft: "8px", width: '50px' }}>
                      <div className="dropdown center" style={{ fontSize: '15px', marginLeft: "20px" }}>Version 2</div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
                    <div className="center mb-2"><img src="/images/docs.svg" width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://twitter.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src="/images/twitter.svg" width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://medium.com/@baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src="/images/medium.svg" width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://github.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src="/images/github.svg" width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '20px' }} to={{ pathname: "https://discord.gg/E6aYX5ukAw" }} target="_blank">
                    <div className="center mb-2"><img src="/images/discord.svg" width="20" height="20" align="right" alt="" /></div>
                  </Link>
                </div>
              </div>
            </MediaQuery>

            <div>
              <ul className="topright rowC">
                <MediaQuery minWidth={500}>
                  <div>
                    <Link to="/menu/v2/">
                      <Buttons className="textWhiteLarge center" style={{ width: '110px', height: '30px', marginRight: '10px' }} variant="secondary" size="lg"> Menu</Buttons>
                    </Link>
                  </div>
                </MediaQuery>
                <div>
                  {this.props.wallet || this.props.walletConnect ?
                    // <div>
                    //   <Popup trigger={open => (
                    //     <Buttons className="textWhiteLarge center" style={{ width: '100px', height: '30px' }} variant="warning" size="sm" > {this.props.first4Account}...{this.props.last4Account}</Buttons>
                    //   )}
                    //     on="hover"
                    //     position="bottom right"
                    //     offsetY={5}
                    //     offsetX={0}
                    //     mouseLeaveDelay={100}
                    //     contentStyle={{ padding: '5px' }}
                    //     arrow={false}
                    //   ><div>
                    //       <div className='dropdown0' onClick={() => {
                    //         window.open(`https://snowtrace.io/address/${this.props.account}`, '_blank')
                    //       }}>Wallet</div>
                    //       <div className='dropdown' onClick={() => {
                    //         this.props.setWalletTrigger(false)
                    //         if (this.props.walletConnect == true) {
                    //           this.props.WalletDisconnect()
                    //         }
                    //       }}>Disconnect</div>
                    //     </div>
                    //   </Popup>
                    // </div>

                    <Dropdown
                    onMouseEnter={this.show2Dropdown}
                    onMouseLeave={this.hide2Dropdown}
                    show={this.state.show2}
                    autoClose="outside"
                    style={{ padding: '0px', paddingBottom: "5px" }}
                  >
                    <Dropdown.Toggle className='textWhiteLarge center cell2' variant="warning" size="sm" style={{ width: '110px', height: '30px' }}>
                      <div>{this.props.first4Account}...{this.props.last4Account}</div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ backgroundColor: "#fffae6", margin: "0px", padding: '5px', minWidth: '110px', maxWidth:'110px' }}>
                      <Dropdown.Item className="cell2 dropdown0" style={{ margin: '0px', padding: '5px', fontSize: '16px'}}>
                        <div onClick={() => {
                          window.open(`https://snowtrace.io/address/${this.props.account}`, '_blank')
                        }}>Wallet</div>
                      </Dropdown.Item>
                      <Dropdown.Item className="cell2 dropdown" style={{ margin: '0px', padding: '5px', fontSize: '16px'}}>
                        <div onClick={() => {
                          this.props.setWalletTrigger(false)
                          if (this.props.walletConnect == true) {
                            this.props.WalletDisconnect()
                          }
                        }}>Disconnect</div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                    : <div>
                      <Popup trigger={open => (<Buttons className="textWhiteLarge center" style={{ width: '110px', height: '30px' }} variant="warning" size="lg" >CONNECT</Buttons>)} modal {...{ contentStyle }}>
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
