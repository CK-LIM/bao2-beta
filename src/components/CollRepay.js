import React, { Component } from 'react'
import baklava from '../baklava.png';
import Button from 'react-bootstrap/Button'
import bigInt from 'big-integer'
import 'reactjs-popup/dist/index.css';
import './App.css';

class CollRepay extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newBorrowUSB: '0',
      messageUSB: '',
      messageCR: '',
      messageWarningCR: '',
      txValidAmount: false
    }
  }

  changeHandlerUSB(event) {
    console.log(!isNaN(+event)); // true if its a number, false if not
    let maxBorrow = (parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether'))) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100
    let maxBorrow80 = maxBorrow * 0.8
    let newDebt = parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i])) - parseFloat(event)
    
    if (event == "") {
      this.setState({
        messageUSB: '',
        txValidAmount: false
      })
    } else if (this.countDecimals(event) > 18) {
      console.log(event)
      this.setState({
        messageUSB: 'Input decimal more than 18.',
        txValidAmount: false
      })
    } else if (bigInt(window.web3Ava.utils.toWei(event, 'Ether')).value > bigInt(this.props.systemCoinBalance).value) {
      this.setState({
        messageUSB: 'Amount more than Wallet.',
        txValidAmount: false
      })
    } else if (bigInt(window.web3Ava.utils.toWei(event, 'Ether')).value > bigInt(this.props.collDebtBalance[this.props.i]).value) {
      this.setState({
        messageUSB: 'Amount more than Debt balance.',
        txValidAmount: false
      })
    } else if ((newDebt < 10) && (newDebt > 0))  {
      this.setState({
        messageUSB: 'To keep the system at a healthy state. If full repayment cannot be achieved, the remaining USB borrewed must be higher than 10.',
        txValidAmount: false
      })
    } else {
      this.setState({
        messageUSB: '',
        messageCR: '',
        messageWarningCR: '',
        txValidAmount: true
      })
    }

    if (parseFloat(newDebt) > parseFloat(maxBorrow)) {
      this.setState({
        messageCR: 'Coll. Ratio is lower than Min Coll. Ratio.',
        txValidAmount: true
      })
    } else {
      this.setState({
        messageCR: '',
      })
    }

    if ((newDebt > maxBorrow80) && (newDebt <=maxBorrow) ) {
      this.setState({
        messageWarningCR: 'Notice: You will take a higher risk of liquidation when your Coll. Ratio is closer to Min Coll. Ratio.'
      })
    } else {
      this.setState({
        messageWarningCR: ''
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
        <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          if (this.state.txValidAmount === false) {
            alert("Invalid input! PLease check your input again")
          } else {
            let amount = this.input.value.toString()
            amount = window.web3Ava.utils.toWei(amount, 'Ether')
            console.log(amount)
            this.props.repayUSB(this.props.i, amount)
          }
        }}>
          <div style={{ minWidth: "300px" }}>
            <div style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}>
              <div className="mb-1 float-left"><b>Repay USB</b></div>
              <div className="mb-1 float-right"><b>USB Balance: {parseFloat(window.web3Ava.utils.fromWei(this.props.systemCoinBalance, "Ether")).toLocaleString('en-US', { maximumFractionDigits: 4 })}</b></div>
            </div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                <input
                  type="number"
                  id="inputColor"
                  step="any"
                  ref={(input) => { this.input = input }}
                  style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                  className="form-control cell cardbody"
                  placeholder="100 USB token"
                  onKeyPress={(event) => {
                    if (!/[0-9.]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(event) => {
                    const value = event.target.value;
                    this.changeHandlerUSB(value, this.props.i)
                    this.props.reduceUSBDebtRatio(value, this.props.i)
                  }}
                  required />

                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                    <Button className="textTransparentButton2" size="sm" onClick={(event1) => {
                      this.input.value = window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i], "Ether")
                      this.changeHandlerUSB(this.input.value, this.props.i)
                      this.props.reduceUSBDebtRatio(this.input.value, this.props.i)
                    }}>100%</Button>
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
              <div className="float-right" >{this.props.systemCoinCollAllowance > 2000000000000000000000000000 && (this.state.txValidAmount === true) ?
                <Button type="submit" className="btn btn-primary btn-sm">&nbsp;Confirm&nbsp;</Button>
                : <Button className="textDarkMedium1 btn-sm" variant="outline">
                  &nbsp;Confirm&nbsp;</Button>}&nbsp;
              </div>
              <div className="float-right mr-1">{this.props.systemCoinCollAllowance <= 2000000000000000000000000000 ?
                <Button className="btn btn-primary btn-sm" onClick={(event) => {
                  this.props.systemCoinCollApprove()
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

export default CollRepay;
