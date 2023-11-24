import React, { Component } from 'react';
import { Link } from 'react-router';
import HeaderMobile from '../header/headerMobile';

class NotFoundMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render(){

        return(
            <div className="not-found-mobile">
                <HeaderMobile menu={true}
                              title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <div className="not-found-mobile__main">
                    <h1 className="not-found-mobile__main-number">404</h1>
                    <h1 className="not-found-mobile__main-title">Oops. Seite nicht gefunden</h1>
                    <h5 className="not-found-mobile__main-subtitle">Diese Seite existiert leider nicht oder ist fehlerhaft</h5>
                    <div className="not-found-mobile__main-wrapper">
                        <button className="not-found-mobile__main-wrapper-btn">
                            <Link to="/" >Gehe zur Homepage</Link>
                        </button>
                    </div>
                </div>
                <div className="not-found-mobile__footer">
                    <img src="/images/design/Guy.svg" alt=""/>
                </div>
            </div>
        )
    }
}

export default NotFoundMobile;
