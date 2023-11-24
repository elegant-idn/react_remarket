import React, { Component } from 'react';
import HeaderTop from "../header/headerTop";
import { Link } from 'react-router';
import {connect} from "react-redux";

class NotFound extends Component {
    constructor(props) {
        super()

        this.state = {
            pageNotFound: true
        }
    }

    render(){
        return(
            <div className="not-found">
                <div className="container not-found-container">
                    <div className="not-found-container__elem">
                        <div className="not-found-main">
                            <h1 className="not-found-main-number">404</h1>
                            <h1 className="not-found-main-title">Oops. Seite nicht gefunden</h1>
                            <h5 className="not-found-main-subtitle">Diese Seite existiert leider nicht oder ist fehlerhaft</h5>
                            <div className="not-found-main-wrapper">
                                <button className="not-found-main-wrapper-btn">
                                    {this.props.prevLocation ?
                                      <Link to="/kaufen/zubehör" >Gehe zum shop</Link> :
                                      <Link to="/" >Gehe zur Homepage</Link>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row not-found-img-wrapper">
                        <img className="not-found-img" src="/images/design/Guy.svg" alt=""/>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        prevLocation: state.currentPath
    }
}

export default connect(mapStateToProps,null)(NotFound)