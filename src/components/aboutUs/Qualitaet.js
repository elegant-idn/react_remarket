import React, { Component } from 'react'
import HeaderMobile from '../mobile/header/headerMobile';
import Footer from '../Footer/footer';
import PropTypes from 'prop-types'

class Qualitaet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'repair'
        };
        this.selectTab = this.selectTab.bind(this)
    }

    selectTab(e){
        this.setState({ activeTab:e.currentTarget.getAttribute('data-target')})
    }

    render() {
        return (
            <div className='qualitaet'>
                <HeaderMobile menu={true} title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <div className="container">
                    <h1 className='qualitaet-title'>Qualität</h1>
                    <p className='qualitaet-content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div className="qualitaet-look">
                    <div className="container">
                        <p className="qualitaet-look__subtitle">Auswählen</p>
                        <ul className="qualitaet-look__checkbox">
                            <li className={this.state.activeTab === 'sell' ? "qualitaet-look__checkitem qualitaet-look__checkitem_checked" : "qualitaet-look__checkitem"} onClick={(e)=>this.selectTab(e)} data-target="sell">
                                <img src={this.state.activeTab === 'sell' ? "/images/design/sell-icon.svg" : "/images/design/sell-grey-icon.svg"} alt="I want to sell"/>
                                <span>I want to sell</span>
                            </li>
                            <li className={this.state.activeTab === 'buy' ? "qualitaet-look__checkitem qualitaet-look__checkitem_checked" : "qualitaet-look__checkitem"} onClick={(e)=>this.selectTab(e)} data-target="buy">
                                <img src={this.state.activeTab === 'buy' ? "/images/design/bag-green-icon.svg" : "/images/design/bag-icon.svg"} alt="I want to buy"/>
                                <span>I want to buy</span>
                            </li>
                            <li className={this.state.activeTab === 'repair' ? "qualitaet-look__checkitem qualitaet-look__checkitem_checked" : "qualitaet-look__checkitem"} onClick={(e)=>this.selectTab(e)} data-target="repair">
                                <img src={this.state.activeTab === 'repair' ?"/images/design/REPAIR.svg" : "/images/design/REPAIR-gray.svg"} alt="I want to repair"/>
                                <span>I want to repair</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="qualitaet-wrapper">
                    {this.state.activeTab === 'repair' && <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div className=" qualitaet-wrapper__item">
                                    <img src="/images/design/qualitaet/fair-prices.svg" alt=""/>
                                    <h3>Calculating price online</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <div className=" qualitaet-wrapper__item">
                                    <img src="/images/design/qualitaet/free-shipping.svg" alt=""/>
                                    <h3>Free shipping label to send package to us</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div className=" qualitaet-wrapper__item">
                                    <img src="/images/design/qualitaet/easy-process.svg" alt=""/>
                                    <h3>Easy process</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <div className=" qualitaet-wrapper__item">
                                    <img src="/images/design/qualitaet/keep-data.svg" alt=""/>
                                    <h3>Keep data on the phone</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div className=" qualitaet-wrapper__item">
                                    <img src="/images/design/qualitaet/mobile-touch.svg" alt=""/>
                                    <h3>Fair prices</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {this.state.activeTab === 'buy' && <div className="container">
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/experience.svg" alt=""/>
                                <h3>8 years expierience</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/waranty.svg" alt=""/>
                                <h3>Warranty</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/policy.svg" alt=""/>
                                <h3>30 days return policy</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/delivery-time.svg" alt=""/>
                                <h3>Fast delivery</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/device.svg" alt=""/>
                                <h3>Tested devices</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/leaf-80.svg" alt=""/>
                                <h3>Sustainability</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/chat-46.svg" alt=""/>
                                <h3>Customer service with online chat</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                    </div>}
                    {this.state.activeTab === 'sell' && <div className="container">
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/fair-prices.svg" alt=""/>
                                <h3>Calculating price online</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/free-shipping.svg" alt=""/>
                                <h3>Free shipping label to send package to us</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/easy-process.svg" alt=""/>
                                <h3>Easy process</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/fast-pay.svg" alt=""/>
                                <h3>Fast payment</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/mobile-touch.svg" alt=""/>
                                <h3>Fair prices</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className=" qualitaet-wrapper__item">
                                <img src="/images/design/qualitaet/secure-data.svg" alt=""/>
                                <h3>100% secure data reset</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                        </div>
                    </div>}
                </div>
                <Footer/>
            </div>
        )
    }
}
Qualitaet.propTypes = {}
Qualitaet.defaultProps = {}
export default Qualitaet