import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'
import axios from 'axios'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../../actions/basket'
import * as userActions from '../../../actions/user'

export class ThankYouPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            basketData: [],
            totalPrice: 0,
            repairList: [],
            selectedOptions: []
        }

        this.mapBasketItems = this.mapBasketItems.bind(this)
        this.mapBasketItemsDevices = this.mapBasketItemsDevices.bind(this)
        this.checkIsLogin = this.checkIsLogin.bind(this)
        this._getPrice = this._getPrice.bind(this)
    }

    componentDidMount(){
        let basketData = JSON.parse(window.localStorage.getItem('basketDataRepair')),
            totalPrice = 0,
            selectedOptions = []

        document.getElementById('spinner-box-load').style.display = 'block'
        if(basketData){
            axios.get(`/api/getModelRepairList?modelId=${basketData.modelId}`)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    totalPrice = this._getPrice(basketData.selectedOptions, result.data.repairList, basketData.shippingMethod)
                    selectedOptions = [...basketData.selectedOptions]
                    if(basketData.shippingMethod) basketData.selectedOptions.push(basketData.shippingMethod)
                    basketData = basketData.selectedOptions

                    this.setState({ basketData, selectedOptions, totalPrice, repairList: result.data.repairList})
                })
        }
        else {
            document.getElementById('spinner-box-load').style.display = 'none'
        }


        window.localStorage.removeItem('basketDataRepair')

        this.props.basketActions.changeBasketDataRepair([])
        this.props.basketActions.changeShippingMethodRepair(null)
    }

    _getPrice(selectedRepairOptions, repairList, shippingMethod){
        let maxPriceSelectedOptions = 0,
            totalPrice = 0

        selectedRepairOptions.forEach( itemSelectedOption => {
            if( +itemSelectedOption.priceMax >= maxPriceSelectedOptions) {
                maxPriceSelectedOptions = +itemSelectedOption.priceMax
            }
        })
        repairList.forEach( itemRepair => {
            if(selectedRepairOptions.some(itemSelected => itemRepair.shortcode === itemSelected.shortcode)){
                if(+itemRepair.priceMax == maxPriceSelectedOptions){
                    totalPrice += +itemRepair.priceMax
                    maxPriceSelectedOptions = null
                }
                else{
                    totalPrice += +itemRepair.minPrice
                }
            }
        })
        if(shippingMethod) totalPrice += +shippingMethod.price
        return totalPrice
    }
    mapBasketItemsDevices(item, i){
        if (item.productTypeId !== 11) {
            let selectedRepairOptions = this.state.selectedOptions,
                maxPriceInSelectedRepairOption = 0,
                priceValue = item.priceMax

            selectedRepairOptions.forEach(itemSelectedOption => {
                if( +itemSelectedOption.priceMax > maxPriceInSelectedRepairOption) {
                    maxPriceInSelectedRepairOption = +itemSelectedOption.priceMax
                }
            })
            if(selectedRepairOptions.length > 0){
                if(maxPriceInSelectedRepairOption > +item.priceMax){
                    priceValue = item.minPrice
                }
                else if(maxPriceInSelectedRepairOption == +item.priceMax){
                    let firstSelected = this.state.repairList.find( element => {
                        return ( +element.priceMax == maxPriceInSelectedRepairOption
                            && selectedRepairOptions.some( itemSelected => itemSelected.shortcode == element.shortcode)
                        )
                    })
                    firstSelected.shortcode == item.shortcode ? priceValue = item.priceMax : priceValue = item.minPrice
                }
            }


            return (
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>{item.title} ({item.shortcode})</p>
                    </div>
                    <div className="price">
                        <p>{ priceValue } {window.currencyValue}</p>
                    </div>
                </div>
            )
        }
    }
    mapBasketItems(item, i) {
        if (item.productTypeId == 11) {
            return (
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>{item.name}</p>
                    </div>
                    <div className="price">
                        <p>{item.price} {window.currencyValue}</p>
                    </div>
                </div>
            )
        }
    }

    checkIsLogin(e){
        let { isLogin } = this.props.user
        if(!isLogin){
            e.preventDefault()
            this.props.userActions.setRedirectTo('/kundenkonto')
        }
    }
    render() {
        let { basketData, totalPrice } = this.state
        return (
            <div className="paymentPage">
                <div className="container">
                    <div className="col-md-8 col-md-push-2" >
                        <div className="wrapWindow text-center">
                            <div className="circle ok"/>
                            <p className="bigText">Herzlichen Glückwunsch</p>
                            <p className="smallText">Vielen Dank für Ihre Bestellung, wir werden diese umgehend bearbeiten.</p>
                            <h3>Bestellübersicht</h3>
                            <div className="wrapBasketItems first">
                                { basketData.map( this.mapBasketItemsDevices )}
                            </div>
                            <div className="wrapBasketItems">
                                { basketData.map( this.mapBasketItems )}
                            </div>
                            <div className="total">
                                <p className="col-xs-6 title">Total inkl. MwSt</p>
                                <p className="col-xs-6 priceTotal">{ (Math.round(totalPrice * 100) / 100)} {window.currencyValue}</p>
                            </div>
                            <Link to={'/kundenkonto'} className="btn" onClick={this.checkIsLogin}>
                                Im Detail ansehen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ThankYouPage.propTypes = {}
ThankYouPage.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(ThankYouPage)