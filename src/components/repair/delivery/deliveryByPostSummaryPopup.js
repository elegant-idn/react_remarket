import React, { Component } from 'react'

class DeliveryByPostSummaryPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

        this.mapBasketData = this.mapBasketData.bind(this)
        this.sendForm = this.sendForm.bind(this)
    }
    sendForm(){
        this.props.toggleSummaryPopup()
        $('form.editFormWrap button[type="submit"]').click()
    }
    mapBasketData(item, i) {
        let { removeFromBasket } = this.props,
            selectedRepairOptions = this.props.basketData.selectedOptions,
            maxPriceInSelectedRepairOption = 0,
            maxPriceOptionShortcode = null,
            priceValue = item.priceMax
        selectedRepairOptions.forEach(itemSelectedOption => {
            if( +itemSelectedOption.priceMax > maxPriceInSelectedRepairOption) {
                maxPriceInSelectedRepairOption = +itemSelectedOption.priceMax
                maxPriceOptionShortcode = itemSelectedOption.shortcode
            }
        })
        if(maxPriceInSelectedRepairOption > 0 && maxPriceInSelectedRepairOption >= +item.priceMax){
            maxPriceOptionShortcode === item.shortcode
                ? priceValue = item.priceMax
                : priceValue = item.minPrice

        }
        return (<tr key={i}>
            <td>{ item.title }</td>
            <td><span className="count">1</span></td>
            <td><span className="price">{ Math.round((+priceValue) * 100) / 100} {window.currencyValue}</span></td>
            <td><span onClick={ () => removeFromBasket(item)}
                      className="removeFromBasket"/>
            </td>
        </tr>)
    }
    render(){
        let { basketData, toggleSummaryPopup, totalPrice, removeFromBasket } = this.props
        totalPrice = basketData.shippingMethod ? totalPrice + +basketData.shippingMethod.price : totalPrice
        return(
            <div className="summary-popup basketWrap">
                <div className="summary-popup-container">
                    <div className="content">
                        <div className="col-xs-12">
                            <div className="top text-right">
                                <img src="/images/design/simple-close-logForm.svg"
                                     onClick={toggleSummaryPopup}
                                     alt=""/>
                            </div>
                            <div className="body productWrap">
                                <h3 className="title">Bestellübersicht</h3>
                                <div >
                                    <table>
                                        <tbody>
                                        {basketData.selectedOptions.map( this.mapBasketData )}
                                        {basketData.shippingMethod &&
                                        <tr>
                                            <td>{ basketData.shippingMethod.name }</td>
                                            <td></td>
                                            <td><span className="price">{ Math.round((+basketData.shippingMethod.price ) * 100) / 100} {window.currencyValue}</span></td>
                                            <td><span onClick={ () => removeFromBasket(basketData.shippingMethod)}
                                                      className="removeFromBasket"/>
                                            </td>
                                        </tr>
                                        }
                                        </tbody>
                                    </table>
                                    {/*<p className="text-right tax">
                                    { Math.round(tax * 100) / 100} {window.currencyValue} MwSt.
                                </p>*/}
                                    <div className="total clearfix">
                                        <p className="col-xs-6 title">Total inkl. MwSt</p>
                                        <p className="col-xs-6 priceTotal">{ (Math.round(+totalPrice * 100) / 100)} {window.currencyValue}   </p>
                                    </div>
                                </div>
                                <div className="commentField">
                                    <textarea name="comment" rows="2" placeholder="Notiz / Spezielle Anmerkung"/>
                                </div>
                                <div className="buttons">
                                    <button className="btn" onClick={this.sendForm}>
                                        Jetzt bezahlen
                                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeliveryByPostSummaryPopup