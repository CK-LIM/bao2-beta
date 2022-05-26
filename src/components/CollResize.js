import React, { Component } from 'react'
import baklava from '../baklava.png';
import Button from 'react-bootstrap/Button'
import 'reactjs-popup/dist/index.css';
import './App.css';

class CollResize extends Component {

  constructor(props) {
    super(props)
    this.state = {
      addBRT: '0',
      newBorrowUSB: '0',
      messageBRT: '',
      messageCR: '',
      messageWarningCR: '',
      messageUSB: '',
      txBRTValidAmount: false,
      txUSBValidAmount: false
    }
  }

  changeHandlerBRT(event, i) {
    // console.log(isNaN(event)); // true if its a number, false if not
    if (event == '' || isNaN(event)) {
      this.state.addBRT = '0'
    } else {
      this.state.addBRT = event
    }

    let maxBorrow = (parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether')) + parseFloat(event)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100
    let maxBorrow80 = maxBorrow * 0.8
    let newDebt = parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i], 'Ether')) + parseFloat(this.state.newBorrowUSB)

    if (event == "") {
      this.setState({
        messageBRT: '',
        txBRTValidAmount: false
      })
    } else if (this.countDecimals(event) > 18) {
      this.setState({
        messageBRT: 'Input decimal more than 18.',
        txBRTValidAmount: false
      })
    } else if (parseFloat(event) > parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[i], 'ether'))) {
      this.setState({
        messageBRT: 'Value more than Wallet.',
        txBRTValidAmount: false
      })
    } else {
      this.setState({
        messageBRT: '',
        messageCR: '',
        messageWarningCR: '',
        txBRTValidAmount: true
      })
    }

    if (parseFloat(newDebt) > parseFloat(maxBorrow)) {
      this.setState({
        messageCR: 'Ratio is lower than Min Coll. Ratio.',
        txBRTValidAmount: false
      })
    } else {
      this.setState({
        messageCR: '',
      })
    }

    if ((newDebt > maxBorrow80) && (newDebt <= maxBorrow)) {
      this.setState({
        messageWarningCR: 'Notice: You will take a higher risk of liquidation when your Coll. Ratio is closer to Min Coll. Ratio.',
      })
    } else {
      this.setState({
        messageWarningCR: ''
      })
    }
  }

  changeHandlerUSB(event, i) {
    if (event != '' || !isNaN(event)) {     // true if its a number, false if not
      this.state.newBorrowUSB = event
    } else {
      this.state.newBorrowUSB = '0'
    }
    let maxBorrow = (parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether')) + parseFloat(this.state.addBRT)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100
    let maxBorrow80 = maxBorrow * 0.8
    let newDebt = parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i], 'Ether')) + parseFloat(event)
    let remainingAvailableUSB = this.props.collPoolRemainingAsset[this.props.i]

    if (event == "") {
      this.setState({
        messageUSB: '',
        txUSBValidAmount: false
      })
    } else if (this.countDecimals(event) > 18) {
      this.setState({
        messageUSB: 'Input decimal more than 18',
        txUSBValidAmount: false
      })
    } else if ((newDebt < 10) && (newDebt > 0)) {
      this.setState({
        messageUSB: 'To keep the system at a healthy state. If full repayment cannot be achieved, the remaining USB borrowed must be higher than 10.',
        txUSBValidAmount: false
      })
    } else if (parseFloat(event) > parseFloat(remainingAvailableUSB)) {
      this.setState({
        messageUSB: 'Borrow USB more than trove available USB.',
        txUSBValidAmount: false
      })
    } else {
      this.setState({
        messageUSB: '',
        messageCR: '',
        messageWarningCR: '',
        txUSBValidAmount: true
      })
    }

    console.log(newDebt)
    console.log(maxBorrow)
    if (parseFloat(newDebt) > parseFloat(maxBorrow)) {
      this.setState({
        messageCR: 'Ratio is lower than Min Coll. Ratio.',
        txUSBValidAmount: false
      })
    } else {
      this.setState({
        messageCR: '',
      })
    }

    if ((newDebt > maxBorrow80) && (newDebt <= maxBorrow)) {
      this.setState({
        messageWarningCR: 'Notice: You will take a higher risk of liquidation when your Coll. Ratio is closer to Min Coll. Ratio.',
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
          if (this.state.txUSBValidAmount === false || this.state.txBRTValidAmount === false) {
            alert("Invalid input! PLease check your input again")
          } else {
            let amount = this.input.value.toString()
            let amount1 = this.input1.value.toString()
            amount = window.web3Ava.utils.toWei(amount, 'Ether')
            amount1 = window.web3Ava.utils.toWei(amount1, 'Ether')
            this.props.depositAndBorrow(this.props.i, amount, amount1)
          }
        }}>
          <div style={{ minWidth: "300px" }}>
            <div className="mb-1" style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}><b>Deposit BRT</b></div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                <input
                  type="number"
                  id="inputColor"
                  step="any"
                  ref={(input) => { this.input = input }}
                  style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                  className="form-control cell cardbody"
                  placeholder="0 BRT token"
                  onKeyPress={(event) => {
                    if (!/[0-9.]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    this.changeHandlerBRT(value, this.props.i)
                    this.props.addLPCollRatio(value, this.props.i)
                  }}
                  required />

                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                    <Button className="textTransparentButton2" size="sm" onClick={(event1) => {
                      this.input.value = window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[this.props.i], 'Ether')
                      this.changeHandlerBRT(this.input.value, this.props.i)
                      this.props.addLPCollRatio(this.input.value, this.props.i)
                    }}>Max</Button>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={baklava} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div style={{ color: 'red' }}>{this.state.messageBRT}</div>

            <div className="mt-3" style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}>
              <div className="mb-1 float-left"><b>Borrow USB</b></div>
              <div className="mb-1 float-right"><b>Max: {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                <span> {parseInt(((parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether')) + parseFloat(this.state.addBRT)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100) * 1000) / 1000} </span>
                : <span > 0 </span>} USB</b></div>
            </div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                  <input
                    type="number"
                    id="inputColor"
                    step="any"                // Comment: Solve input error: "please enter a valid value. the two nearest valid values are xx adn xx"
                    ref={(input) => { this.input1 = input }}
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                    className="form-control cell cardbody"
                    placeholder="100 USB token"
                    onKeyPress={(event) => {
                      if (!/[0-9.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      this.changeHandlerUSB(value, this.props.i)
                      this.props.addUSBDebtRatio(value, this.props.i)
                    }}
                    required />
                  : <input
                    disabled />}
                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                    <Button className="textTransparentButton2" size="sm" onClick={(event1) => {
                      let maxBorrow = (parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether')) + parseFloat(this.state.addBRT)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100
                      if (maxBorrow > parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i], 'Ether'))) {
                        let value80Percent = (maxBorrow * 0.8) - parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i], 'Ether'))
                        if (value80Percent > 0) {
                          if (value80Percent > this.props.collPoolRemainingAsset[this.props.i]) {
                            this.input1.value = this.props.collPoolRemainingAsset[this.props.i]
                          } else {
                            this.input1.value = value80Percent
                          }
                        } else {
                          this.input1.value = 0
                        }
                      } else {
                        this.input1.value = 0
                      }
                      this.changeHandlerUSB(this.input1.value, this.props.i)
                      this.props.addUSBDebtRatio(this.input1.value, this.props.i)
                    }}>80%</Button>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={baklava} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div className="mb-1" style={{ color: 'red' }}>{this.state.messageUSB} </div>
            <div className="mb-1" style={{ color: 'red' }}>{this.state.messageCR} </div>
            <div className="mb-1 textWarningColor">{this.state.messageWarningCR} </div>
            <div className="mt-3">
              <div className="float-left" style={{ color: 'grey' }}><img src={baklava} height='20' alt="" />&nbsp;<small>Minimum borrowing amount: 10 USB </small></div>
              <div className="float-right" >{this.props.collBRTSegmentAllowance[this.props.i] > 2000000000000000000000000000 && (this.state.txUSBValidAmount === true && this.state.txBRTValidAmount === true) ?
                <Button type="submit" className="btn btn-primary btn-sm">&nbsp;Confirm&nbsp;</Button>
                : <Button className="textDarkMedium1 btn-sm" variant="outline">
                  &nbsp;Confirm&nbsp;</Button>}&nbsp;
              </div>
              <div className="float-right mr-1">{this.props.collBRTSegmentAllowance[this.props.i] <= 2000000000000000000000000000 ?
                <Button className="btn btn-primary btn-sm" onClick={(event) => {
                  this.props.collateralApprove(this.props.i)
                }}>&nbsp;Approve&nbsp;</Button>
                : <Button className="textDarkMedium1 btn-sm" variant="outline">
                  &nbsp;Approved&nbsp;</Button>}
              </div>
            </div>
          </div>
        </form>
      </div>

    );
  }
}

export default CollResize;
