import React, { Component } from 'react'
import './App.css';
import baklava from '../baklava.png'
import discord from '../discord.svg'
import twitter from '../twitter.svg'
import medium from '../medium.svg'
import git from '../github.svg'
import gitbook from '../docs.svg'

class Footer extends Component {

    render() {
        return (
            <footer id="content" className="mt-5">
                <div style={{ marginTop: '18px' }}>
                    <div className="rowS center ">
                        <img className="center" src={baklava} width="25" alt="" />&nbsp;&nbsp;
                        <div className="center" style={{ color: "black", fontSize: '16px', marginRight: "25px" }}><b>BAKLAVA.SPACE © 2022 </b></div>
                    </div>
                    <div className="center" style={{ color: "black", fontSize: '14px', marginTop: "5px" }}>Tools for defi users.</div>
                    <div className="center" style={{ color: "black", fontSize: '14px', marginTop: "5px" }}>Baklava Farms autocompound farm rewards.</div>
                    <div className="center" style={{ color: "black", fontSize: '14px', marginTop: "5px" }}>Use at your own risk.</div>

                    <div className="center" style={{ marginTop: "15px" }}>
                        <div className="rowC">
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://baklavaspace.gitbook.io/`, '_blank')
                            }}><div className="center mb-2"><img src={gitbook} width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://twitter.com/baklavaspace`, '_blank')
                            }}><div className="center mb-2"><img src={twitter} width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://medium.com/@baklavaspace`, '_blank')
                            }}><div className="center mb-2"><img src={medium} width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://github.com/baklavaspace`, '_blank')
                            }}><div className="center mb-2"><img src={git} width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '0px' }} onClick={() => {
                                window.open(`https://discord.gg/E6aYX5ukAw`, '_blank')
                            }}><div className="center mb-2"><img src={discord} width="20" height="20" align="right" alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div><br/>
            </footer>
        );
    }
}

export default Footer;