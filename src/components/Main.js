import React, { Component } from 'react'
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import baklava from '../baklava.png';
import joe from '../joe.png';
import pangolin from '../pangolin.png';
import kyberSwap from '../kyber.png'
import baklava_mainBottom from '../baklava_mainBottom.png';
import discord from '../discord.svg';
import twitter from '../twitter.svg';
import medium from '../medium.svg';
import git from '../github.svg';
import gitbook from '../docs.svg';
import './App.css';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <MediaQuery minWidth={771}>
          <div className="text-center" style={{ marginTop: "120px" }}>
            <img src={baklava} width="180" height="180" className="" alt="" />
          </div>
          <div className="center text" style={{ fontSize: "45px" }}>BAKLAVA SPACE</div>
          <div className="center textMiddleBold" style={{ fontSize: "25px" }}><b>Baklava stands for "layered, rich, and sweet". </b></div>
          <div className="center textMiddle" style={{ fontSize: "18px"}}>Baklava Space is designed as a combination of automated yield farming</div>
          <div className="center textMiddle" style={{ fontSize: "18px"}}>for your LP tokens and a synthetic creation mechainsm using LP tokens.</div>
          <div className="center" style={{ marginTop: "25px" }} >
            <Link className="exLink0" style={{ marginRight: '35px' }} to={{ pathname: "https://traderjoexyz.com/#/home" }} target="_blank">
              <div className="center mb-2"><img src={joe} width="50" height="50" align="right" alt="" /></div>
            </Link>
            <Link className="exLink0" style={{ marginRight: '33px' }} to={{ pathname: "https://app.pangolin.exchange/" }} target="_blank">
              <div className="center mb-2"><img src={pangolin} width="50" height="50" align="right" alt="" /></div>
            </Link>
            <Link className="exLink0" to={{ pathname: "https://kyberswap.com/#/about/" }} target="_blank">
              <div className="center mb-2"><img src={kyberSwap} width="50" height="50" align="right" alt="" /></div>
            </Link>
          </div>
          <MediaQuery minHeight={700}>
            <img src={baklava_mainBottom} height="8%" width="100%" className="fixed-bottom" alt="" />
          </MediaQuery>
        </MediaQuery>


        <MediaQuery minWidth={301} maxWidth={770}>
          <div style={{ minWidth: "300px" }} style={{ marginTop: "120px" }}>
            <div className="center">
              <img src={baklava} width="160" height="160" className="" alt="" />
            </div>
            <div className="center text" style={{ fontSize: "45px" }}>BAKLAVA SPACE</div>
            <div className="center textMiddleBold ml-3 mr-3" style={{ fontSize: "25px" }}><b>Baklava stands for "layered, rich, and sweet". </b></div>
            <div className="center textMiddle ml-3 mr-3" style={{ fontSize: "18px"}}>Baklava Space is designed as a combination of automated yield farming for your LP tokens and a synthetic creation mechainsm using LP tokens.</div>
            <div className="center" style={{ marginTop: "25px" }} >
              <Link className="exLink0" style={{ marginRight: '35px' }} to={{ pathname: "https://traderjoexyz.com/#/home" }} target="_blank">
                <div className="center mb-2"><img src={joe} width="45" height="45" align="right" alt="" /></div>
              </Link>
              <Link className="exLink0" style={{ marginRight: '33px' }} to={{ pathname: "https://app.pangolin.exchange/" }} target="_blank">
                <div className="center mb-2"><img src={pangolin} width="45" height="45" align="right" alt="" /></div>
              </Link>
              <Link className="exLink0" to={{ pathname: "https://kyberswap.com/#/about/" }} target="_blank">
                <div className="center mb-2"><img src={kyberSwap} width="45" height="45" align="right" alt="" /></div>
              </Link>
            </div>
            <MediaQuery minHeight={701}>
              <div className="center fixed-bottom" style={{ marginBottom: "30px" }}>
                <div className="rowC">
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://baklavaspace.gitbook.io/" }} target="_blank">
                    <div className="center mb-2"><img src={gitbook} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://twitter.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={twitter} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://medium.com/@baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={medium} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://github.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={git} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '' }} to={{ pathname: "https://discord.gg/E6aYX5ukAw" }} target="_blank">
                    <div className="center mb-2"><img src={discord} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                </div>
              </div>
            </MediaQuery>
            <MediaQuery maxHeight={700}>
              <div className="center" style={{ marginBottom: "30px" , marginTop: "80px"}}>
                <div className="rowC">
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://baklavaspace.gitbook.io/" }} target="_blank">
                    <div className="center mb-2"><img src={gitbook} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://twitter.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={twitter} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://medium.com/@baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={medium} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '40px' }} to={{ pathname: "https://github.com/baklavaspace" }} target="_blank">
                    <div className="center mb-2"><img src={git} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                  <Link className="exLink0" style={{ marginRight: '' }} to={{ pathname: "https://discord.gg/E6aYX5ukAw" }} target="_blank">
                    <div className="center mb-2"><img src={discord} width="20" height="20" align="right" alt="" /></div>
                  </Link>
                </div>
              </div>
            </MediaQuery>
          </div>
        </MediaQuery>


        <MediaQuery maxWidth={300}>
          <div style={{ minWidth: "300px" }} style={{ marginTop: "100px" }}>
            <div className="text-center">
              <img src={baklava} width="140" height="140" className="" alt="" />
            </div>
            <div className="center text" style={{ fontSize: "40px" }}>BAKLAVA SPACE</div>
            <div className="center textMiddleBold ml-3 mr-3" style={{ fontSize: "20px" }}><b>Baklava stands for "layered, rich, and sweet". </b></div>
            <div className="center textMiddle ml-3 mr-3" style={{ fontSize: "16px"}}>Baklava Space is designed as a combination of automated yield farming for your LP tokens and a synthetic creation mechainsm using LP tokens.</div>
            <div className="center" style={{ marginTop: "30px" }} >
              <img src={joe} width="40" height="40" className="exLink0" style={{ marginRight: "35px" }} alt="" onClick={() => {
                window.open(`https://traderjoexyz.com/#/home`, '_blank')
              }} />
              <img src={pangolin} width="40" height="40" className="exLink0" style={{ marginRight: "33px" }} alt="" onClick={() => {
                window.open(`https://app.pangolin.exchange/`, '_blank')
              }} />
              <img src={kyberSwap} width="40" height="40" className="exLink0" alt="" onClick={() => {
                window.open(`https://kyberswap.com/#/about/`, '_blank')
              }} />
            </div>
          </div>
        </MediaQuery>
      </div>
    );
  }
}

export default Main;
