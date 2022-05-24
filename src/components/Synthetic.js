import React, { Component } from 'react'
import './App.css';
import Footer from './Footer'

class Airdrop extends Component {

    render() {
        return (
            <div id="content" className="mt-5">
                <label className="textWhite center mb-5" style={{ fontSize: '40px', color: 'black' }}><big><b>Mint your synthetic asset</b></big></label>
                <div className="center " style={{ marginTop: "25px" }}>
                    <img src="https://whitelist.mirror.finance/images/AAPL.png" width="50" height="50" alt="" />&nbsp;&nbsp;
                    <img src="https://whitelist.mirror.finance/images/TSLA.png" width="50" height="50" alt="" />&nbsp;&nbsp;
                    <img src="https://whitelist.mirror.finance/images/FB.png" width="50" height="50" alt="" />&nbsp;&nbsp;
                    <img src="https://whitelist.mirror.finance/images/GOOGL.png" width="50" height="50" alt="" />&nbsp;&nbsp;
                    <img src="https://whitelist.mirror.finance/images/ABNB.png" width="50" height="50" alt="" />&nbsp;&nbsp;
                </div>
                <div className="center comingSoon" style={{ color: '#ffae00', fontSize: '40px', marginTop: "80px", opacity: "0" }}><b><big>Coming Soon!</big></b></div>
                <div className='center fixed-bottom'><Footer /></div>                
            </div>
        );
    }
}

export default Airdrop;