import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import bigInt from 'big-integer'
import 'reactjs-popup/dist/index.css';
import './App.css';

class SynBuyLimit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      payUSB: '0',
      messagePrice: '',
      messageSyn: '',
      messagePayUSB: '',
      txSynValidAmount: false,
      txPriceValidAmount: false,
      txPayValidAmount: true
    }
  }

  changeHandler(eventSyn, eventPrice, i) {
    if (eventSyn == "") {
      eventSyn = 0
      this.setState({
        messageSyn: '',
        txPriceValidAmount: false
      })
    } else if (this.countDecimals(eventSyn) > 3) {
      this.setState({
        messageSyn: 'Amount must be within 3 decimal points',
        txPriceValidAmount: false
      })
    } else if (parseFloat(eventSyn) < 0.001) {
      this.setState({
        messageSyn: `Notice: Min tx amount must be higher than or equal to 0.01 ${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}.`,
        txSynValidAmount: false
      })
    } else {
      this.setState({
        messageSyn: '',
        txPriceValidAmount: true
      })
    }

    if (eventPrice == "") {
      eventPrice = 0
      this.setState({
        messagePrice: '',
        txSynValidAmount: false
      })
    } else if (this.countDecimals(eventPrice) > 3) {
      this.setState({
        messagePrice: 'Amount must be within 3 decimal points',
        txSynValidAmount: false
      })
    } else if (parseFloat(eventPrice) <= 0) {
      this.setState({
        messagePrice: 'Target price must be greater than 0',
        txSynValidAmount: false
      })
    } else if (eventPrice > (this.props.synOraclePrice[this.props.i]/(10**this.props.synPriceDecimal[this.props.i]))) {
      this.setState({
        messagePrice: `Target price must be between 0 and ${(this.props.synOraclePrice[this.props.i]/(10**this.props.synPriceDecimal[this.props.i])).toLocaleString('en-US', { maximumFractionDigits: 3 })}`,
        txSynValidAmount: false
      })
    } else {
      this.setState({
        messagePrice: '',
        txSynValidAmount: true
      })
    }

    if (!isNaN(eventSyn) && !isNaN(eventPrice) && (eventSyn != '') && (eventPrice != '')) {
      let payUSB = parseInt((parseFloat(eventPrice) * parseFloat(eventSyn)) * 1000000) / 1000000
      let totalPayUSB = parseInt((parseFloat(eventPrice) * parseFloat(eventSyn) + 0.5) * 1000000) / 1000000
      console.log(payUSB, totalPayUSB)
      this.setState({ payUSB })
      if (parseFloat(payUSB) < 10) {
        this.setState({
          messagePayUSB: 'Notice: Min tx amount must be higher than 10 USB',
          txPayValidAmount: false
        })
      } else if (bigInt(window.web3Ava.utils.toWei((totalPayUSB).toString(), "Ether")).value > bigInt(this.props.systemCoinBalance).value) {
        this.setState({
          messagePayUSB: 'Not enough USB',
          txPayValidAmount: false
        })
      } else {
        this.setState({
          messagePayUSB: '',
          txPayValidAmount: true
        })
      }
    } else {
      this.setState({
        payUSB: 0,
        messagePayUSB: '',
        txPayValidAmount: false
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
        <div className="text-center"></div>
        <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let synTokenAmount = this.input.value.toString()
          synTokenAmount = window.web3Ava.utils.toWei(synTokenAmount, 'babbage')
          let synTokenPrice = this.input1.value.toString()
          synTokenPrice = window.web3Ava.utils.toWei(synTokenPrice, 'ether')
          this.props.synOpenLimitOrder(this.props.i, '0', synTokenAmount, synTokenPrice)
        }}>
          <div style={{ minWidth: "300px" }}>
            <div className="mb-1 ml-1 float-left" style={{ color: 'black', fontSize: '16px' }}><b>Order to Buy</b></div>
            <div className="mb-1 float-right"><b>Balance: {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
              <span>
                {parseFloat(window.web3Ava.utils.fromWei(this.props.systemCoinBalance, "Ether")).toLocaleString('en-US', { maximumFractionDigits: 3 })}
              </span>
              : <span > 0 </span>} USB</b></div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                  <input
                    type="number"
                    id="inputColor"
                    step="any"                // Comment: Solve input error: "please enter a valid value. the two nearest valid values are xx and xx"
                    ref={(input) => { this.input = input }}
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                    className="form-control cell cardbody"
                    placeholder={`${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol} Token`}
                    onKeyPress={(event) => {
                      if (!/[0-9.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      const value = event.target.value;
                      this.changeHandler(this.input.value, this.input1.value, this.props.i)
                      this.props.buyLimitSyn(this.props.i, this.input.value)
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
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={`https://whitelist.mirror.finance/images/${this.props.synPoolSegmentInfo[this.props.i].icon}.png`} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div className='ml-1' style={{ color: 'red', fontSize: '15px' }}>{this.state.messageSyn}</div>


            <div className="mt-3 ml-1" style={{ color: 'black', fontSize: '16px' }}>
              <div className="mb-1"><b>At USB per {this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}</b></div>
            </div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                {(this.props.wallet || this.props.walletConnect) && this.props.accountLoading ?
                  <input
                    type="number"
                    id="inputColor"
                    step="any"
                    ref={(input) => { this.input1 = input }}
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                    className="form-control cell cardbody"
                    placeholder={`USB per ${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}`}
                    onKeyPress={(event) => {
                      if (!/[0-9.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      this.changeHandler(this.input.value, this.input1.value, this.props.i)
                      this.props.buyLimitSyn(this.props.i, this.input.value)
                    }}
                    required />
                  : <input
                    type="number"
                    id="inputColor"
                    style={{ fontSize: '18px', backgroundColor: '#fffcf0', cursor: 'not-allowed' }}
                    placeholder={`USB per ${this.props.synPoolSegmentInfo[this.props.i].synTokenPairsymbol}`}
                    className="form-control cell cardbody"
                    disabled />}
                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src="/images/usb.png" height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div className="mb-1 ml-1" style={{ color: 'red', fontSize: '15px' }}>{this.state.messagePrice} </div>


            {/* *************************************************************************************************** */}

            <div className="mt-3 ml-1" style={{ color: 'black', fontSize: '16px' }}>
              <div className="mb-1"><b>And Pay USB</b></div>
            </div>
            <div className="card-body" style={{ backgroundColor: '#fffcf0', padding: '0 0' }}>
              <div className="input-group mb-2" >
                <input
                  type="number"
                  id="input2Color"
                  step="any"
                  ref={(input2) => { this.input2 = input2 }}
                  style={{ fontSize: '18px', backgroundColor: '#fffcf0' }}
                  className="form-control cell cardbody"
                  placeholder={this.state.payUSB}
                  disabled />
                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src="/images/usb.png" height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>
            <div className='ml-1' style={{ color: 'red', fontSize: '15px' }}>{this.state.messagePayUSB}</div>

            <div className="mt-3">
              <div className="float-left" style={{ color: 'grey' }}><img src="/images/baklava.png" style={{ marginRight: '5px' }} height='20' alt="" /><small>Tx Fees is 0.50 USB </small></div>
              <div className="float-right" >{this.props.systemCoinSynAllowance > 2000000000000000000000000000 && (this.state.txPriceValidAmount === true && this.state.txSynValidAmount === true && this.state.txPayValidAmount === true) ?
                <Button type="submit" className="btn btn-primary btn-sm" style={{ height: '32px', fontSize: '15px' }} >Confirm</Button>
                : <Button className="btn textDarkMedium1 btn-sm" style={{ height: '32px', fontSize: '15px' }} variant="outline">
                  Confirm</Button>}
              </div>
              <div className="float-right mr-1">{this.props.systemCoinSynAllowance <= 2000000000000000000000000000 ?
                <Button className="btn btn-primary btn-sm" style={{ height: '32px', fontSize: '15px' }} onClick={(event) => {
                  this.props.systemCoinSyntheticApprove()
                }}>Approve USB</Button>
                : <Button className="textDarkMedium1 btn-sm" style={{ height: '32px', fontSize: '15px' }} variant="outline">
                  Approved</Button>}
              </div>
            </div>
          </div>
        </form>
      </div>

    );
  }
}

export default SynBuyLimit;
