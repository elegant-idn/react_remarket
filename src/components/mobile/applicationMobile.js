import React, { Component } from 'react'
import { Helmet } from "react-helmet"

import SpinnerBox from "../spinnerBox/spinnerBox"
import HeaderMainPage from "../header/headerMainPage"
import CookieBanner from "../common/cookieBanner"
import { META } from  '../../constants/meta'
import { browserHistory } from 'react-router'

export class ApplicationMobile extends Component {
    constructor(props) {
        super(props);
        const {reactRedirect} = document.body.dataset;
        if (reactRedirect) {
            browserHistory.push(reactRedirect);
            return;
        }
    }
    componentDidMount(){
    }
    render() {
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]

        return (
            <div id="mobile">
                <Helmet
                    title={window.domainName.name === 'remarket.ch' ? META.title_ch : META.title_de}
                    meta={[
                        {"name": "description", "content": window.domainName.name === 'remarket.ch' ? META.description_ch : META.description_de}
                    ]}
                />
                { this.props.children }
                <SpinnerBox id="spinner-box-load"/>
                <div className="hiddenHeader">
                    <HeaderMainPage/>
                </div>
                { domain === 'de' && <CookieBanner/>}
            </div>
        );
    }
}

export default ApplicationMobile