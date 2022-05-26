import React, { Component } from 'react'
import baklava from '../baklava.png';
import Button from 'react-bootstrap/Button'
import 'reactjs-popup/dist/index.css';
import './App.css';

class CollOnlyDep extends Component {

  constructor(props) {
    super(props)
    this.state = {
      addBRT: '0',
      messageBRT: '',
      txValidAmount: false
    }
  }

  changeHandlerBRT(event, i) {
    // console.log(isNaN(event)); // true if its a number, false if not
    if (event == '' || isNaN(event)) {
      this.state.addBRT = '0'
    } else {
      this.state.addBRT = event
    }

    // let maxBorrow = (parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether')) + parseFloat(event)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100
    // let maxBorrow80 = maxBorrow * 0.8
    // let newDebt = parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i], 'Ether'))

    // console.log(newDebt)
    if (event == "") {
      this.setState({
        messageBRT: '',
        txValidAmount: false
      })
    } else if (this.countDecimals(event) > 18) {
      this.setState({
        messageBRT: 'Input decimal more than 18',
        txValidAmount: false
      })
    } else if (parseFloat(event) > parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[i], 'ether'))) {
      this.setState({
        messageBRT: 'Value more than Wallet',
        txValidAmount: false
      })
    } else {
      this.setState({
        messageBRT: '',
        txValidAmount: true
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
          if (this.state.txValidAmount === false) {
            alert("Invalid input! PLease check your input again")
          } else {
            let amount = this.input.value.toString()
            amount = window.web3Ava.utils.toWei(amount, 'Ether')
            this.props.depositAndBorrow(this.props.i, amount, '0')
          }
        }}>
          <div style={{ minWidth: "300px" }}>
            <div className="mb-1" style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}><b>Deposit BRT</b></div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                  <input
                    type="number"
                    id="inputColor"
                    step="any" 
                    ref={(input) => { this.input = input }}
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0'}}
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
                  : <input
                    type="number"
                    id="inputColor"
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0', cursor: 'not-allowed' }}
                    placeholder="0 BRT token"
                    className="form-control cell cardbody"
                    disabled />}

                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                    <Button className="textTransparentButton2" size="sm" onClick={(event1) => {
                      this.state.txValidAmount = true
                      this.setState({ message: "" })
                      this.input.value = window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[this.props.i], 'Ether')
                      this.changeHandlerBRT(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[this.props.i], 'Ether'), this.props.i)
                      this.props.addLPCollRatio(window.web3Ava.utils.fromWei(this.props.collBRTBalanceAccount[this.props.i], 'Ether'), this.props.i)
                    }}>Max</Button>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={baklava} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div style={{ color: 'red' }}>{this.state.messageBRT}</div>

            <div className="mt-3">
              <div className="float-left" style={{ color: 'grey' }}><img src={baklava} height='20' alt="" />&nbsp;<small>Minimum borrowing amount: 10 USB </small></div>
              <div className="float-right" >{this.props.collBRTSegmentAllowance[this.props.i] > 2000000000000000000000000000 ?
                <Button type="submit" className="btn btn-primary btn-sm">&nbsp;Confirm&nbsp;</Button>
                : <Button className="textDarkMedium1 btn-sm" variant="outline">
                  &nbsp;Confirm&nbsp;</Button>}&nbsp;
              </div>
              <div className="float-right mr-1">{this.props.collBRTSegmentAllowance[this.props.i] <= 2000000000000000000000000000 ?
                <Button className="btn btn-primary btn-sm" onClick={(e) => {
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

export default CollOnlyDep;
