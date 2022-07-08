import React, { Component } from 'react'
import './App.css';

class Footer extends Component {

    render() {
        return (
            <footer id="content" className="mt-5">
                <div style={{ marginTop: '200px', marginBottom: '10px' }}>
                    <div className="rowS center ">
                        <img className="center" src="/images/baklava.png" width="25" alt="" />&nbsp;&nbsp;
                        <div className="center" style={{ color: "black", fontSize: '16px', marginRight: "25px" }}><b>BAKLAVA.SPACE © 2022 </b></div>
                    </div>
                    <div className="center" style={{ color: "black", fontSize: '14px', marginTop: "5px" }}>Tools for defi users.</div>
                    <div className="center" style={{ color: "black", fontSize: '14px', marginTop: "5px" }}>Baklava Farms autocompound farm rewards.</div>
                    <div className="center" style={{ color: "black", fontSize: '14px', marginTop: "5px" }}>Use at your own risk.</div>

                    <div className="center" style={{ marginTop: "15px" }}>
                        <div className="rowC">
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://baklavaspace.gitbook.io/`, '_blank')
                            }}><div className="center mb-2"><img src="/images/docs.svg" width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://twitter.com/baklavaspace`, '_blank')
                            }}><div className="center mb-2"><img src="/images/twitter.svg" width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://medium.com/@baklavaspace`, '_blank')
                            }}><div className="center mb-2"><img src="/images/medium.svg" width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '40px' }} onClick={() => {
                                window.open(`https://github.com/baklavaspace`, '_blank')
                            }}><div className="center mb-2"><img src="/images/github.svg" width="20" height="20" align="right" alt="" /></div>
                            </div>
                            <div className="exLink0" style={{ marginRight: '0px' }} onClick={() => {
                                window.open(`https://discord.gg/E6aYX5ukAw`, '_blank')
                            }}><div className="center mb-2"><img src="/images/discord.svg" width="20" height="20" align="right" alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div><br/>
            </footer>
        );
    }
}

export default Footer;