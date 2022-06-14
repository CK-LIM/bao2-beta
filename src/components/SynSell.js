import React, { Component } from 'react'
import baklava from '../baklava.png';
import usbPicture from '../USB.png';
import Button from 'react-bootstrap/Button'
import bigInt from 'big-integer'
import 'reactjs-popup/dist/index.css';
import './App.css';

class SynSell extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newBorrowUSB: '0',
      messageSyn: '',
      messageUSB: '',
      txSynValidAmount: false,
      txUSBValidAmount: false,
      txPayValidAmount: false
    }
  }

  async changeHandler(eventSyn, eventUSB, i) {

    if (eventUSB == "") {
      this.setState({
        messageUSB: '',
        txUSBValidAmount: false
      })
    } else if ((eventUSB) <= (0)) {
      this.setState({
        messageUSB: 'Amount must be greater than 0',
        txUSBValidAmount: false
      })
    } else if (this.countDecimals(eventUSB) > 18) {
      this.setState({
        messageUSB: 'Amount must be within 18 decimal points',
        txUSBValidAmount: false
      })
    } else if (parseFloat(eventUSB) < 100) {
      this.setState({
        messageUSB: 'Notice: Min tx amount must be higher than 100 USB',
        txUSBValidAmount: false
      })
    } else {
      this.setState({
        messageUSB: '',
        txUSBValidAmount: true
      })
    }

    if (eventSyn == "") {
      this.setState({
        messageSyn: '',
        txSynValidAmount: false
      })
    } else if ((eventSyn) <= (0)) {
      this.setState({
        messageSyn: 'Amount must be greater than 0',
        txSynValidAmount: false
      })
    } else if (this.countDecimals(eventSyn) > 3) {
      this.setState({
        messageSyn: 'Amount must be within 3 decimal points',
        txSynValidAmount: false
      })
    }  else if (bigInt(window.web3Ava.utils.toWei(eventSyn, 'babbage')).value > bigInt(this.props.synUserBalance[i]).value) {
      this.setState({
        messageSyn: 'Amount more than wallet balance',
        txSynValidAmount: false
      })
    }  else if (parseFloat(eventSyn) < 0.01) {
      this.setState({
        messageSyn: `Notice: Min tx amount must be higher than 0.01 ${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}.`,
        txSynValidAmount: false
      })
    } else {
      this.setState({
        messageSyn: '',
        txSynValidAmount: true
      })
    }

    if (bigInt(window.web3Ava.utils.toWei('0.5', "Ether")).value > bigInt(this.props.systemCoinBalance).value) {
      this.setState({
        messagePayUSB: 'Not enough USB for transaction fee',
        txPayValidAmount: false
      })
    } else {
      this.setState({
        messagePayUSB: '',
        txPayValidAmount: true
      })
    }
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
      <div id="content">
        <div className="text-center">
        </div>

        <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          if (this.state.txUSBValidAmount === false || this.state.txSynValidAmount === false) {
            alert("Invalid input! PLease check your input again")
          } else {
            let amount = this.input.value.toString()
            amount = window.web3Ava.utils.toWei(amount, 'babbage')
            let minReceiveChange = window.web3Ava.utils.toWei((parseInt((this.input1.value * (10000 - this.props.slippage[this.props.i]) / 10000) * 100000) / 100000).toString(), 'Ether')
            this.props.synOpenOrder(this.props.i, '1', minReceiveChange, amount, '0', this.props.synPoolPrice[this.props.i])
          }
        }}>
          <div style={{ minWidth: "300px" }}>
            <div className="mb-1 float-left" style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}><b>Sell {this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}</b></div>
            <div className="mb-1 float-right"><b>Balance: {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
              <span>{window.web3Ava.utils.fromWei(this.props.synUserBalance[this.props.i], 'babbage')}</span>
              : <span > 0 </span>} {`${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}`}</b></div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                  <input
                    type="number"
                    id="inputColor"
                    step="any"
                    ref={(input) => { this.input = input }}
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                    className="form-control cell cardbody"
                    placeholder={`${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol} Token`}
                    onKeyPress={(event) => {
                      if (!/[0-9.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }
                  }
                    onChange={(e) => {
                      const value = e.target.value;
                      let getUSB = this.props.synPoolPrice[this.props.i] * parseFloat(value)
                      this.input1.value = getUSB.toFixed(3);
                      this.changeHandler(this.input.value, this.input1.value, this.props.i)
                      this.props.sellSyn(this.props.i, this.input1.value)
                    }}
                    required />
                  : <input
                    type="number"
                    id="inputColor"
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0', cursor: 'not-allowed' }}
                    placeholder={`${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol} Token`}
                    className="form-control cell cardbody"
                    disabled />}

                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                    <Button className="textTransparentButton2" size="sm" onClick={(event1) => {
                      this.input.value = window.web3Ava.utils.fromWei(this.props.synUserBalance[this.props.i], 'babbage')
                      let getUSB = (window.web3Ava.utils.fromWei(this.props.synUserBalance[this.props.i], 'babbage')) * this.props.synPoolPrice[this.props.i]
                      this.input1.value = getUSB.toFixed(3);
                      this.changeHandler(this.input.value, this.input1.value, this.props.i)
                      this.props.sellSyn(this.props.i, this.input1.value)
                    }}>Max</Button>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={`https://whitelist.mirror.finance/images/${this.props.synPoolSegmentInfo[this.props.i].icon}.png`} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div style={{ color: 'red', fontSize: '15px' }}>{this.state.messageSyn}</div>

            <div className="mt-3" style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}>
              <div className="mb-1 float-left"><b>To Get</b></div>
              <div className="mb-1 float-right"><b>Balance: {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
              <span>
                {parseFloat(window.web3Ava.utils.fromWei(this.props.systemCoinBalance, "Ether")).toLocaleString('en-US', { maximumFractionDigits: 3 })}
              </span>
              : <span > 0 </span>} USB</b></div>
            </div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                  <input
                    type="number"
                    id="inputColor"
                    step="any"                      // Comment: Solve input error: "please enter a valid value. the two nearest valid values are xx adn xx"
                    ref={(input) => { this.input1 = input }}
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                    className="form-control cell cardbody"
                    placeholder="0 USB token"
                    onKeyPress={(event) => {
                      if (!/[0-9.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      const value = event.target.value;
                      let getSyn = parseFloat(value) / (this.props.synPoolPrice[this.props.i])
                      this.input1.value = value
                      this.input.value = getSyn.toFixed(3);
                      this.changeHandler(this.input.value, this.input1.value, this.props.i)
                      this.props.sellSyn(this.props.i, this.input1.value)
                    }}
                    required />
                  : <input
                    type="number"
                    id="inputColor"
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0', cursor: 'not-allowed' }}
                    placeholder="0 USB token"
                    className="form-control cell cardbody"
                    disabled />}

                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>

                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={usbPicture} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div className="mb-1" style={{ color: 'red', fontSize: '15px' }}>{this.state.messageUSB} </div>
            <div className="mb-1" style={{ color: 'red', fontSize: '15px' }}>{this.state.messagePayUSB}</div>

            <div className="mt-3">
              <div className="float-left" style={{ color: 'grey' }}><img src={baklava} style={{ marginRight: '5px' }} height='20' alt="" /><small>Tx Fees is 0.50 USB</small></div>
              <div className="float-right" >{this.props.systemCoinSynAllowance > 2000000000000000000000000000 && this.props.synUserAllowance[this.props.i] > 2000000000000000000000000000 && (this.state.txUSBValidAmount === true && this.state.txSynValidAmount === true && this.state.txPayValidAmount === true) ?
                <Button type="submit" className="btn btn-primary btn-sm" style={{ height: '32px', fontSize: '15px' }} >Confirm</Button>
                : <Button className="textDarkMedium1 btn-sm" style={{ height: '32px', fontSize: '15px' }} variant="outline">
                  Confirm</Button>}
              </div>

              <div className="float-right mr-1">{this.props.systemCoinSynAllowance <= 2000000000000000000000000000 ?
                <Button className="btn btn-primary btn-sm" style={{ height: '32px', fontSize: '15px' }} onClick={(event) => {
                  this.props.systemCoinSyntheticApprove()
                }}>Approve USB</Button>
                : <div>{this.props.synUserAllowance[this.props.i] <= 2000000000000000000000000000 ? <Button className="btn btn-primary btn-sm" style={{ height: '32px', fontSize: '15px' }} onClick={(event) => {
                  this.props.synTokenSyntheticApprove(this.props.i)
                }}>Approve {`${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}`}</Button>
                  : <Button className="textDarkMedium1 btn-sm" style={{ height: '32px', fontSize: '15px' }} variant="outline">
                    Approved</Button>}</div>}
              </div>
            </div>
          </div>
        </form>
      </div>

    );
  }
}

export default SynSell;
