import React, { Component } from 'react'
import baklava from '../baklava.png';
import pangolin from '../pangolin.png';
import joe from '../joe.png'
import kyberSwap from '../kyber.png'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import bigInt from 'big-integer'
import 'reactjs-popup/dist/index.css';
import './App.css';


class Deposit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
    this.state = {
      txValidAmount: false
    }
    this.state = {
      txDeposit: false
    }
    this.state = {
      txWithdraw: false
    }
    this.clickHandlerDeposit = this.clickHandlerDeposit.bind(this)
    this.clickHandlerWithdraw = this.clickHandlerWithdraw.bind(this)
  }

  changeHandler(event) {
    let result = !isNaN(+event); // true if its a number, false if not
    if (event == "") {
      this.setState({
        message: ''
      })
      this.setState({
        txValidAmount: false
      })
    } else if (result == false) {
      this.setState({
        message: 'Not a valid number'
      })
      this.setState({
        txValidAmount: false
      })
    } else if (event <= 0) {
      this.setState({
        message: 'Value need to be greater than 0'
      })
      this.setState({
        txValidAmount: false
      })
    } 
    else {
      this.setState({
        message: ''
      })
      this.setState({
        txValidAmount: true
      })
    }
  }

  clickHandlerDeposit() {
    this.setState({
      txDeposit: true,
      txWithdraw: false
    })
  }

  clickHandlerWithdraw() {
    this.setState({
      txDeposit: false,
      txWithdraw: true
    })
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
            let amount
            amount = this.input.value.toString()
            amount = window.web3Ava.utils.toWei(amount, 'Ether')

            if (this.state.txDeposit === true && this.state.txWithdraw === false) {
              if (bigInt(amount).value > this.props.lpBalanceAccount[this.props.n][this.props.i]) {
                alert("Not enough funds")
              } else {
                this.props.deposit(this.props.i, amount, this.props.n, this.props.v)
              }
            } else if (this.state.txDeposit === false && this.state.txWithdraw === true) {
              if (bigInt(amount).value > this.props.userSegmentInfo[this.props.n][this.props.i]) {
                alert("Withdraw tokens more than deposit LP tokens")
              } else {
                this.props.withdraw(this.props.i, amount, this.props.n, this.props.v)
              }
            }
          }


        }}>
          <div>
            <div className="input-group mb-3">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg cardbody"
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value;
                  this.changeHandler(value)
                }}
                required />
              <div className="input-group-append">
                <div className="input-group-text cardbody" style={{ color: 'silver' }}>
                  {this.props.poolSegmentInfo[this.props.n][this.props.i].platform == 'Pangolin' ? <img src={pangolin} height='30' className="" alt="" /> : <div>{this.props.poolSegmentInfo[this.props.n][this.props.i].platform == 'KyberSwap' ? <img src={kyberSwap} height='30' className="" alt="" />: <img src={joe} height='30' className="" alt="" />}</div>}
                </div>
              </div>
            </div >
            <div style={{ color: 'red' }}>{this.state.message} </div>

            <div className="rowC center">
              <ButtonGroup>
                <Button type="submit" className="btn btn-primary btn-sm" onClick={() => {
                  this.clickHandlerDeposit()
                }}>&nbsp;Deposit&nbsp;</Button>
                <Button type="text" variant="outline-primary" className="btn-sm" onClick={() => {
                  this.state.txValidAmount = true
                  this.state.txDeposit = false
                  this.state.txWithdraw = false
                  this.setState({ message: "" })
                  this.input.value = window.web3Ava.utils.fromWei(this.props.lpBalanceAccount[this.props.n][this.props.i], 'Ether')
                }}>All</Button>&nbsp;&nbsp;&nbsp;
              </ButtonGroup>
              <ButtonGroup>
                <Button type="submit" className="btn btn-primary btn-sm" onClick={(event2) => {
                  this.clickHandlerWithdraw()
                }}>Withdraw</Button>
                <Button type="text" variant="outline-primary" className="btn-sm" onClick={(event3) => {
                  this.state.txValidAmount = true
                  this.state.txDeposit = false
                  this.state.txWithdraw = false
                  this.setState({ message: "" })
                  this.input.value = window.web3Ava.utils.fromWei(this.props.userSegmentInfo[this.props.n][this.props.i], 'Ether')
                }}>All</Button>
              </ButtonGroup>
            </div>
          </div>
        </form>

        <div className="text-center" style={{ color: 'grey' }}><img src={baklava} height='20' alt="" />&nbsp;<small>Contract will automatically harvest BAVA rewards for you when deposit or withdraw token!</small></div>
      </div>

    );
  }
}

export default Deposit;
