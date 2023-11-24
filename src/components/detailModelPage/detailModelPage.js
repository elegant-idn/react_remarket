import axios from 'axios'
import React, { Component } from 'react'
import { Helmet } from "react-helmet"
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { bindActionCreators } from "redux"
import * as basketActions from "../../actions/basket"
import api from '../../api/index'
import { pushKlavioIdentify, discountCode } from '../../helpers/helpersFunction'
import AddToBasketEffect from "../common/addToBasketEffect"
import SuccessAddToBasket from "../kaufen/innerPage/successAddToBasket"
import ListSimilarItems from './listSimilarItems'
import ModelInfoBlock from './modelInfoBlock'
import OtherProducts from './otherProducts'
import PurchaseProducts from './purchaseProducts'
import { EmptyPurchaseProducts } from './purchaseProducts'

class DetailModelPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            model: [],
            similarItems: [],
            upsellingItems: [],
            specifications: [],
            additionalSpecifications: {},
            capacityName: null,
            deviceStatus: {
                statusId: null,
                dateOfBought: null,
                boughtCurrentUser: false
            },
            activeNavItem: 'technical',
            successAddToBasket: null,
            recommendProducts: null,
        }

        this.clickNavItem = this.clickNavItem.bind(this)
        this.mapAccessories = this.mapAccessories.bind(this)
        this._increaseCounter = this._increaseCounter.bind(this)
        this.openSuccessAddToBasket = this.openSuccessAddToBasket.bind(this)
        this._recommendProducts = this._recommendProducts.bind(this)        
        this.closeSuccessAddToBasket = this.closeSuccessAddToBasket.bind(this)
        this.addModelToBasket = this.addModelToBasket.bind(this)
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.params.currentModelId !== this.props.params.currentModelId){
            let { currentModelId, device: deviceName } = nextProps.params
            deviceName = deviceName.split("-").join(' ')
            let objForRequest = {
                deviceName,
                inventoryId: currentModelId
            }
            this._getModelData(objForRequest, currentModelId);
        }
    }
    componentDidMount(){
        let { currentModelId, device: deviceName } = this.props.params
        deviceName = deviceName.split("-").join(' ')
        let objForRequest = {
                                deviceName,
                                inventoryId: currentModelId
                            }
        this._getModelData(objForRequest, currentModelId);
        this._increaseCounter(currentModelId);
    }
    _increaseCounter(currentModelId) {
        axios.post(`/api/increaseCounter`, {deviceId: currentModelId})
        .then( ( {data} ) => {
        }).catch( error => {});
    }
    _gtag_snippet(model){
        gtag('event', 'page_view', {
            'send_to': 'AW-827036726',
            'ecomm_prodid': model.shortcode,
            'ecomm_pagetype': 'product',
            'ecomm_totalvalue': +model.discountPrice || +model.price,
            'ecomm_category': 'Electronics'
        })
    }
    _recommendProducts(modelId){
        let { successAddToBasket } = this.state;        
        let promise = new Promise((resolve, reject) => {
            if(modelId) {
                axios.get('/api/loadRecommendProducts?modelId='+modelId)
                    .then( result => {
                        resolve(result.data.data.length ? result.data.data : null);
                    })
            }
            else {
                resolve(null)
            }
        });
        promise.then(
            result => {
                if (result && successAddToBasket == null && result.length > 0) {
                    this.setState({recommendProducts: result})
                }                
            }
        )
    }
    _getModelData(objForRequest, currentModelId){
        document.getElementById('spinner-box-load').style.display = 'block'
        api.getModels(`/api/models`, objForRequest)
            .then( ( { data } ) => {
                let responseData = data
                if(window.isGoogleConnection) {
                    this._gtag_snippet(responseData.data[0])
                }
                this.setState({ model: responseData.data, capacityName: responseData.meta.capacityName });
                let model =  responseData.data,
                    gtagData  = JSON.parse(window.localStorage.getItem("gtag"));

                gtag('event', 'view_item', {
                    "items": [
                        {
                            "id": model[0].shortcode,
                            "name": model[0].descriptionLong,
                            "list_name": "Kaufen",
                            "quantity": 1,
                            "price":  model[0].discountPrice ||  model[0].price,
                            "brand": model[0].deviceName,
                            "category": gtagData.category || '',
                        }
                    ]
                });
                pushKlavioIdentify();
                var klavioItem = {
                    "ProductName": model[0].descriptionLong,
                    "ProductID": model[0].shortcode,
                    "Categories": [gtagData.category] || [''],
                    "ImageURL": model[0].deviceImages.mainImg.src,
                    "URL": window.location.href,
                    "Brand": model[0].deviceName,
                    "Price": model[0].discountPrice ||  model[0].price,
                    "CompareAtPrice": model[0].price
                };

                _learnq.push(["track", "Viewed Product", klavioItem]);

                _learnq.push(["trackViewedItem", {
                    "Title": klavioItem.ProductName,
                    "ItemId": klavioItem.ProductID,
                    "Categories": klavioItem.Categories,
                    "ImageUrl": klavioItem.ImageURL,
                    "Url": klavioItem.URL,
                    "Metadata": {
                        "Brand": klavioItem.Brand,
                        "Price": klavioItem.Price,
                        "CompareAtPrice": klavioItem.CompareAtPrice
                    }
                }]);

                this._recommendProducts(model[0].modelId)
            })
            .catch( error => {})
        axios.get(`/api/getSpecifications?deviceId=${currentModelId}`)
            .then( ( {data} ) => {
                this.setState({ specifications: data.specifications, additionalSpecifications: data.additionalSpecifications })
            })
            .catch( error => {})
        axios.post(`/api/similarItems`, {deviceId: currentModelId})
            .then( ( {data} ) => {
                this.setState({ similarItems: data })
            })
            .catch( error => {})
        axios.get(`/api/checkSoldDevice?deviceShortcode=${currentModelId}`)
            .then( ( {data} ) => {
                this.setState({ deviceStatus: {...this.state.deviceStatus, statusId: data.status, dateOfBought: data.date,
                                               boughtCurrentUser: data.boughtCurrentUser } })
            })
            .catch( error => {})
        axios.get(`/api/getUpsellingProducts?deviceShortcode=${currentModelId}`)
            .then( ( {data} ) => {
                this.setState({ upsellingItems: data.data })
            })
            .catch( error => {})
    }
    clickNavItem(e){
        let activeNavItem = e.currentTarget.getAttribute('data-type')
        this.setState({ activeNavItem })
    }
    mapAccessories( item, i){
        return(
            <li key={i}><i className="fa fa-check-circle-o" aria-hidden="true"/>{item}</li>
        )
    }
    getUrlForNavigation(){
        let deviceName = this.state.model[0].deviceName,
            currentDevices = null

        function findCurrentDevice(current, nextDevice){
            if(nextDevice.submodels){
                let equalDevice = nextDevice.submodels.filter( item => item.name == deviceName )
                if(equalDevice.length > 0) {
                    currentDevices = [...current, equalDevice[0].name ]
                    return true
                }
                else{
                    nextDevice.submodels.forEach( item => {
                        if(item.submodels) {
                            findCurrentDevice([...current, item.name], item)
                        }
                    })
                    return false
                }
            }
        }
        this.props.devices.forEach( item => findCurrentDevice([item.name], item))
        let strUrl = ''
        if(currentDevices) strUrl = currentDevices.join('/').toLowerCase().replace(/ /g, '-') + '/filter'
        return `/kaufen/${strUrl}`
    }
    openSuccessAddToBasket(item, source) {
        this.setState({ successAddToBasket: <SuccessAddToBasket
            addModelToBasket={this.addModelToBasket}
            basketData={this.props.basketData}
            source={source}
            model={item}
            recommendProducts={this.state.recommendProducts}
            closeSuccessAddToBasket={this.closeSuccessAddToBasket}/> })

    }
    closeSuccessAddToBasket(){
        this.setState({ successAddToBasket: null })
    }

    addModelToBasket (e, item) {
        e.stopPropagation()
        e.preventDefault()
        let status = e.target.getAttribute('data-status'),
            {basketData} = this.props,
            newBasketData = null;
        if (item.categoryName) {
            newBasketData = [...basketData, item]
        } else if (basketData.every(itemBasket => itemBasket.id != item.id)) {
            newBasketData = [...basketData, item]
        } else {
            newBasketData = basketData.filter(itemBasket => (itemBasket.shortcode != item.shortcode));
        }
        this.props.basketActions.changeBasketData(newBasketData)

        if (status === 'out') {
            let brands = item.criterias.find( item => item.id === 'manufacturer').values,
                brand = brands.length ? brands[0].name : "",
                category = item.categoryName;
            gtag('event', 'add_to_cart', {
                "items": [
                    {
                        "id": item.shortcode,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": item.discountPrice || item.price,
                        "name": item.descriptionLong || item.model || '',
                        "brand": brand,
                        "category": category,
                    }
                ]
            });
            if (!window.isMobile) {
                const img = item.deviceImages ? item.deviceImages.mainImg.src : '/images/design/Product.svg',
                    start = $(e.target).offset();
                    this.props.basketActions.basketAddEffect(<AddToBasketEffect startPosition={start}
                                                                                image={img}
                                                                                basketType="kaufen"/>)
                setTimeout(() => {
                    this.props.basketActions.basketAddEffect(null)
                }, 2000)
            } else {
                browserHistory.push('/warenkorb')
            }
        }

    }

    render() {
        let { model, similarItems, specifications, additionalSpecifications,
              capacityName, deviceStatus, activeNavItem,  successAddToBasket, upsellingItems, recommendProducts } = this.state,
            { device: deviceName } = this.props.params,
            locationQuery = this.props.location.query,
            urlNavigation = model[0] && this.getUrlForNavigation() || '',
            loader = document.getElementById('spinner-box-load'),
            title = model[0] ?  `${model[0].descriptionLong},  ${model[0].capacity}, ${model[0].condition}` : '',
            descriptionPrice =  model[0] && model[0].discountPrice ?  model[0].discountPrice : model[0] ?  model[0].price : '',
            description = model[0] ?  `${model[0].descriptionLong},  ${model[0].capacity} günstig kaufen in ${model[0].placeDescription} für ${descriptionPrice} im Zustand ${model[0].condition} inkl. ${model[0].warranty} Garantie.` : '';
        const webshopDiscountData = JSON.parse(window.localStorage.getItem('webshopDiscountData'))
        if(loader && model[0]) loader.style.display = 'none';

        let schemaData = {}
        if (model[0]) {
            // add schema
            let device = model[0]

            let titleSchema = ''

            let condition = device.conditionId === 1 || device.conditionId === 2 ? '' : 'gebraucht, ';
            titleSchema = device.model + ', ' + condition + device.capacity + ', ' + device.color;

            let stockDevice = {}
            if (device.statusId === 1) {
                stockDevice = {
                    "availability": "https://schema.org/InStock"
                }
            } else {
                stockDevice = {
                    "availability": "https://schema.org/OutOfStock"
                }
            }

            let conditionDevice = {}
            if (device.conditionId === 1 || device.conditionId === 2) {
                conditionDevice = {
                    "itemCondition": "https://schema.org/NewCondition"
                }
            } else if (device.conditionId === 3 || device.conditionId === 4 || device.conditionId === 5){
                conditionDevice = {
                    "itemCondition": "https://schema.org/UsedCondition"
                }
            }


            let offers = {}
            if (device.discountPrice === false) {
                offers = {
                    "@type": "Offer",
                    "url": window.location.href,
                    "priceCurrency": "CHF",
                    "price": device.price,
                }
            } else {
                offers = {
                    "@type": "AggregateOffer",
                    "url": window.location.href,
                    "priceCurrency": "CHF",
                    "lowPrice": device.discountPrice,
                    "highPrice": device.price,
                }
            }

            schemaData = {
                "@context": "http://schema.org/",
                "@type": "Product",
                "name": titleSchema,
                "image": device.deviceImages.mainImg.src,
                "description": device.descriptionSeo,
                "brand": device.deviceName,
                "sku": device.shortcode,
                "offers": offers,
            }

            schemaData = {
                ...schemaData,
                ...stockDevice,
                ...conditionDevice
            }
        }
        let structuredSchemaDataJSON = JSON.stringify(schemaData)

        return (
            <div className='detail-page'>
                {model[0] &&
                <Helmet
                    title={title}
                    meta={[
                        {"name": "description", "content": description},
                        {"property": "og:title", "content": title},
                        {"property": "og:image", "content": model[0].deviceImages.mainImg.src},
                    ]}
                />
                }
                <Helmet>
                    <script type="application/ld+json">{structuredSchemaDataJSON}</script>
                </Helmet>
                {model[0] &&
                    <div className="detailPage">
                        <div className="infoBlock">
                            <div className="container-fluid">
                                <div className="row">
                                    {!window.isMobile &&
                                        <div className="col-xs-12">
                                            <div className="navigation-row">
                                                <Link to="/"><img src="/images/design/house-icon.svg" alt="" /></Link>
                                                <Link to={urlNavigation}>Liste</Link>
                                                <span>{model[0] && model[0].model}</span>
                                            </div>
                                        </div>
                                    }
                                    {!window.isMobile && webshopDiscountData.desktop_detail_active == 1 && 
                                        <div className="notification-device-detail">
                                            <div className="subtract">
                                                <img src="/images/design/subtract.svg"/>
                                            </div>
                                            <div className="content">
                                                <p dangerouslySetInnerHTML={{__html: discountCode(webshopDiscountData.desktop_detail_text, 'discount-code') }}></p>
                                            </div>                                            
                                        </div>
                                    }
                                    {window.isMobile && webshopDiscountData.mobile_detail_active == 1 && 
                                        <div className="notification-device-detail">
                                            <div className="subtract">
                                                <img src="/images/design/subtract.svg"/>
                                            </div>
                                            <div className="content">
                                                <p dangerouslySetInnerHTML={{__html: discountCode(webshopDiscountData.mobile_detail_text, 'discount-code') }}></p>
                                            </div>                                            
                                        </div>
                                    }
                                    <ModelInfoBlock currentModel={model}
                                                    openSuccessAddToBasket={this.openSuccessAddToBasket}
                                                    deviceStatus={deviceStatus}
                                                    capacityName={capacityName}
                                                    isRemarketingCampaign={locationQuery?locationQuery.coupon:0}
                                                    specifications={specifications}
                                                    additionalSpecifications={additionalSpecifications}
                                                    upsellingItems={upsellingItems}
                                    />
                                </div>
                                <div className="cb"/>
                            </div>
                        </div>
                        {similarItems.length > 0 && (
                            <div className="others-product-block">
                                <div className="container-fluid">
                                    <div className="row">
                                        <OtherProducts 
                                            similarItems={similarItems}
                                            basketActions={this.props.basketActions}
                                            basketData={this.props.basketData}
                                            wishlistData={this.props.wishlistData}
                                            />
                                    </div>
                                </div>
                            </div>
                        )}
                        {!recommendProducts && (
                            <div className="others-product-block">
                                <div className="container-fluid">
                                    <div className="row">
                                        <EmptyPurchaseProducts/>                                    
                                    </div>
                                </div>
                            </div>
                        )}
                        {recommendProducts && recommendProducts.length > 0 && (
                            <div className="others-product-block">
                                <div className="container-fluid">
                                    <div className="row">
                                        <PurchaseProducts 
                                            recommendProducts={recommendProducts}
                                            basketActions={this.props.basketActions}
                                            basketData={this.props.basketData}
                                            wishlistData={this.props.wishlistData} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {false && (
                            <div className="similar">
                                <div className="container">
                                    <ListSimilarItems similarItems={similarItems} deviceName={deviceName}/>
                                    <div className="cb"/>
                                </div>
                            </div>
                        )}                        
                        { successAddToBasket }
                    </div>
                }
            </div>
        );
    }
}

DetailModelPage.propTypes = {}
DetailModelPage.defaultProps = {}

function mapStateToProps (state) {
    return {
        devices: state.shop.devices,
        basketData: state.basket.basketData,
        wishlistData: state.basket.wishlistData,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailModelPage)

