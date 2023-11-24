import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
import DeliverySuccessLetter from './deliverySuccessLetter'

import DeliveryByPost from './deliveryByPost'

class DeliveryByBicycle extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showInfo: false,
            info: {
                price: null,
                shortcode: null,
                name: null
            },
            errors: {
                zip: null
            },
            formWasSubmit: false
        }

        this.handleChangeZip = this.handleChangeZip.bind(this)
    }
    componentWillMount(){
        this.inputZipCallback = _debounce(function (e) {
            let zip = document.querySelector('.delivery-bicycle input[name="zip"]').value
            axios.get(`/api/checkShippingZip?zip=${zip}`)
                .then( result => {
                    this.setState({ info: result.data, showInfo: true })
                })
                .catch(error => {
                    let zip = error.response.data.errors.zip[0]
                    this.setState({ errors: {...this.state.errors, zip}, showInfo: false })
                })
        }, 1000);
    }

    submitForm(){
        this.setState({formWasSubmit: true})
    }

    handleChangeZip(e){
        this.setState({errors: {...this.state.errors, zip: null}, showInfo: false })
        e.persist()
        this.inputZipCallback(e)
    }
    render(){
        let { totalPrice } = this.props,
            { info, showInfo, formWasSubmit } = this.state
        return(
            <div className="delivery-bicycle">
                {!formWasSubmit && <div>
                    <div className="price">
                        <h3 className="title">price</h3>
                        <p className="value">{totalPrice} {window.currencyValue}</p>
                    </div>
                    <div className="row row-flex">
                        <div className="col-sm-6 item-column ">
                            <div>
                                <h3 className="title"><span className="num">1</span>Calculate the price</h3>
                                <div className="content">
                                    <p>Please enter your <span className="bold">zip code</span> where <br/> the device
                                        is to be collected:</p>
                                    <div className="input-row">
                                        <input type="number"
                                               name="zip"
                                               placeholder="e.g. 4132"
                                               onChange={this.handleChangeZip}/>
                                        {this.state.errors.zip && <p className="error">{this.state.errors.zip}</p>}
                                    </div>
                                    <div className={showInfo ? "info show" : "info"}>
                                        {info.name && <p>{info.name}</p>}
                                        {info.price && <p>Price: <span
                                            className="bold">{info.price} {window.currencyValue}</span> (flat rate per
                                            route)</p>}
                                        <p>You can call one of the two shipping companies at any time (at step 2. and
                                            specify your desired or desired time for collection. </p>
                                        <p>Please name <span className="bold">"Standard"</span> (shipping within 60
                                            minutes) and our customer reference: iReparation as invoice recipient. </p>
                                        <p>Please enter your address as the shipping destination.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 item-column">
                            <div className="right-part">
                                <h3 className="title"><span className="num">2</span>Enter your contact data</h3>
                                <div className="content">
                                    <div className="numPhone">
                                        <img src="/images/design/guy-banner.svg" alt=""/>
                                        <span><a href="tel:+615118043">+615118043</a></span>
                                    </div>
                                    <div className="address">
                                        <div className="item-column">
                                            <p className="category">Basel Branch</p>
                                            <p>remarket.ch GmbH</p>
                                            <p>Gerbergasse 82</p>
                                            <p>4001 Basel</p>
                                        </div>
                                        <div className="item-column">
                                            <p className="category">Opening hours</p>
                                            <p className="time">Mon - Fri <br/> 09:00 - 18:30</p>
                                            <p className="time">Sat <br/> 10:00 - 18_00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="info-block">
                                <p>You are welcome to choose one of our two Velokurierpartner for an EXPRESS delivery.
                                    We carry out most of the repairs EXPRESS on the spot, so you only have to do without
                                    your bike for about 60 minutes (+ journey from the cyclist) and use it again. </p>
                                <p className="small">Information : The collection and delivery service by Velokurier is
                                    only possible for corporate customers</p>
                            </div>
                        </div>
                    </div>
                    {showInfo && <DeliveryByPost mountedInBicycleForm={true}
                                                 totalPrice={totalPrice}
                                                 model={this.props.model}
                                                 submitForm={this.submitForm.bind(this)}
                        // selectDesiredButton={this.selectDesiredButton.bind(this)}
                                                 shippingMethod={info}/>}
                </div>
                }
                {formWasSubmit && <DeliverySuccessLetter props={this.props}/>}
            </div>
        )
    }
}

export default DeliveryByBicycle