import React, { Component } from 'react'
// import litepaper from '../Litepaper_Protocol.pdf'
// import litepaper_turkish from '../Litepaper_Protocol(turkish).pdf'
import Button from '@material-ui/core/Button';
import './App.css';

class LitePaper extends Component {

    constructor(props) {
        super(props)
        this.state = {
            turkish: false,
            english: false
        }
        this.clickLanguage = this.clickLanguage.bind(this)
    }

    clickLanguage(language, boolean) {
        // this.setState({
        //     farmV2_2Open[pair]: boolean
        // })
        let ntg = 0
        if (language == "turkish") {
            this.state.turkish = boolean
            this.state.english = false
        } else {
            this.state.english = boolean
            this.state.turkish = false
        }
        this.setState({ ntg })  //do ntg, just to push react setstate
    }

    render() {
        return (
            <div id="content">
                <span className="center mb-3">
                    {this.state.turkish ? <div>
                        <Button variant="text" size="small" color="inherit" onClick={async () => {
                            await this.clickLanguage("english", true)
                        }}>English</Button>
                        <Button variant="outlined" size="small" color="inherit" onClick={async () => {
                            await this.clickLanguage("turkish", true)
                        }}>Turkish</Button></div> :
                        <div>
                            <Button variant="outlined" size="small" color="inherit" onClick={async () => {
                                await this.clickLanguage("english", true)
                            }}>English</Button>
                            <Button variant="text" size="small" color="inherit" onClick={async () => {
                                await this.clickLanguage("turkish", true)
                            }}>Turkish</Button></div>}
                </span>
                <div className="center textMiddle">
                    {/* {this.state.turkish ? <object data={litepaper_turkish} type="application/pdf" width="1000px" height="950px"></object> : <object data={litepaper} type="application/pdf" width="1000px" height="950px"></object>} */}
                    {this.state.turkish ? <object data="/images/Litepaper_Protocol(turkish).pdf" type="application/pdf" width="1000px" height="950px"></object> : <object data="/images/Litepaper_Protocol.pdf" type="application/pdf" width="1000px" height="950px"></object>}
                </div>
            </div>

        );
    }
}

export default LitePaper;
