import React, { Component } from 'react'
import baklava from '../baklava.png';
import Button from 'react-bootstrap/Button'
import bigInt from 'big-integer'
import 'reactjs-popup/dist/index.css';
import './App.css';

class CollWithdraw extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messageCR: '',
      messageWarningCR: '',
      messageBRT: '',
      txValidAmount: false
    }
  }

  changeHandlerBRT(event, i) {
    console.log(!isNaN(+event)); // true if its a number, false if not

    // let collTokenAmount = this.props.collUserSegmentInfo[this.props.i]*window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i],'Ether')
    // let collLockedAmount = (this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio / 100 * this.props.collDebtBalance[this.props.i])
    // let maxWithdrawAmount = (this.props.collUserSegmentInfo[this.props.i]*window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i],'Ether') - (this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio / 100 * this.props.collDebtBalance[this.props.i])) / window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i],'Ether')
    
    let maxBorrow = (parseFloat(window.web3Ava.utils.fromWei(this.props.collUserSegmentInfo[this.props.i], 'Ether')) - parseFloat(event)) * parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i].toLocaleString('en-US'), 'Ether')) / parseFloat(this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio).toLocaleString('en-US') * 100
    let maxBorrow80 = maxBorrow * 0.8
    let newDebt = parseFloat(window.web3Ava.utils.fromWei(this.props.collDebtBalance[this.props.i]))

    if (event == "") {
      this.setState({
        messageBRT: '',
        txValidAmount: false
      })
    } else if (this.countDecimals(event) > 18) {
      console.log(event)
      this.setState({
        messageBRT: 'Input decimal more than 18',
        txValidAmount: false
      })
    } else if (bigInt(window.web3Ava.utils.toWei(event, 'Ether')).value > bigInt(this.props.collUserSegmentInfo[this.props.i]).value) {
      this.setState({
        messageBRT: 'Amount more than deposited collateral',
        txValidAmount: false
      })
    } else {
      this.setState({
        messageBRT: '',
        messageCR: '',
        messageWarningCR: '',
        txValidAmount: true
      })
    }

    if (parseFloat(newDebt) > parseFloat(maxBorrow)) {
      this.setState({
        messageCR: 'Coll. Ratio is lower than Min Coll. Ratio.',
        txValidAmount: false
      })
    } else {
      this.setState({
        messageCR: '',
      })
    }

    if ((newDebt > maxBorrow80) && (newDebt <= maxBorrow) && (maxBorrow80 > 0)) {
      this.setState({
        messageWarningCR: 'Notice: You will take a higher risk of liquidation when your Coll. Ratio is closer to Min Coll. Ratio.',
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
            this.props.withdrawBRTColl(this.props.i, amount)
          }
        }}>
          <div style={{ minWidth: "300px" }}>
            <div style={{ color: 'black', fontSize: '16px', minWidth: "120px" }}>
              <div className="mb-1 float-left"><b>Withdraw BRT</b></div>
              <div className="mb-1 float-right"><b>Max: {window.web3Ava.utils.fromWei(parseInt((this.props.collUserSegmentInfo[this.props.i]*window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i],'Ether') - (this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio / 100 * this.props.collDebtBalance[this.props.i])) / window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i],'Ether')).toLocaleString('en-US', {useGrouping:false}),'Ether')} BRT</b></div>
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
                    this.changeHandlerBRT(this.input.value, this.props.i)
                    this.props.reduceLPCollRatio(this.input.value, this.props.i)
                  }}
                  required />

                <div className="input-group-append" >
                  <div className="input-group-text cardbodyLeft" style={{ padding: '0 0.5rem' }}>
                    <Button className="textTransparentButton2" size="sm" onClick={(e) => {

                      let collDebtToken = parseFloat(this.props.collDebtBalance[this.props.i]) / parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i], 'Ether'))
                      let maxBorrowedToken = this.props.collUserSegmentInfo[this.props.i] / this.props.collateralPoolSegmentInfo[this.props.i].minCollRatio * 100
                      let maxBorrowed80Token = parseInt(maxBorrowedToken * 0.8)

                      if (collDebtToken < maxBorrowed80Token) {
                        let collateralValue = parseFloat(this.props.collUserSegmentInfo[this.props.i])
                        let collateral80Value = parseFloat(this.props.collDebtBalance[this.props.i]) * 250 / 100 / parseFloat(window.web3Ava.utils.fromWei(this.props.collBRTValue[this.props.i], 'Ether'))
                        let max80WithdrawAmount = parseInt(collateralValue - collateral80Value)
                        this.input.value = window.web3Ava.utils.fromWei(max80WithdrawAmount.toLocaleString('en-US', {useGrouping:false}), 'Ether')
                      } else {
                        this.input.value = 0
                      }
                      this.changeHandlerBRT(this.input.value, this.props.i)
                      this.props.reduceLPCollRatio(this.input.value, this.props.i)
                    }}>{this.props.collDebtBalance[this.props.i] == 0 ? 100 : 80}%</Button>
                  </div>
                  <div className="input-group-text cardbody" style={{ padding: '0 0.5rem' }}>
                    <img src={baklava} height='25' className="" alt="" />
                  </div>
                </div >
              </div>
            </div>

            <div className="mb-1" style={{ color: 'red' }}>{this.state.messageBRT} </div>
            <div className="mb-1" style={{ color: 'red' }}>{this.state.messageCR} </div>
            <div className="mb-1 textWarningColor">{this.state.messageWarningCR} </div>

            <div className="mt-3">
              <div className="float-left" style={{ color: 'grey' }}><img src={baklava} style={{ marginRight: '5px' }} height='20' alt="" /><small>Minimum borrowing amount: 10 USB </small></div>
              <div className="float-right" >{this.props.collUserSegmentInfo[this.props.i] > 0 && this.state.txValidAmount == true?
                <Button type="submit" className="btn btn-primary btn-sm">Confirm</Button>
                : <Button className="textDarkMedium1 btn-sm" variant="outline">
                  Confirm</Button>}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CollWithdraw;
