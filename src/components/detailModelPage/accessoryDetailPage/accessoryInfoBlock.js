import axios from "axios"
import React, { Component, Fragment } from 'react'
import Slider from "react-slick";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../../actions/basket'
import AddToBasketEffect from '../../common/addToBasketEffect'
import AddToWishlistEffect from "../../common/addToWishlistEffect"
import SuccessAddToBasket from "../../kaufen/innerPage/successAddToBasket"
import AdditionalInfoBlock from "../additionalInfoBlock"
import SoldoutInfoBlock from "../soldoutInfoBlock"
import ModelInfoBlockImage from '../modelInfoBlockImage'
import OtherProducts from "../otherProducts";
import PurchaseProducts from "../purchaseProducts";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { browserHistory } from 'react-router'

const compatibilityListCount = 10

export class AccessoryInfoBlock extends Component {
    constructor(props) {
        super(props)

        this.state = {
            blockImage: {
                currentMainImage: '',
                isOpenLightBox: false,
                currentImageLightBox: 0,
            },
            successAddToBasket: null,
            recommendProducts: null,
            productIsAddedToWishlist: false,
            bottomActive: 'buy',
            moreModel: false,
        }

        this.clickSmallImg = this.clickSmallImg.bind(this)
        this.openLightBox = this.openLightBox.bind(this)
        this.closeLightBox = this.closeLightBox.bind(this)
        this.addModelToBasket = this.addModelToBasket.bind(this)
        this.mapCriterias = this.mapCriterias.bind(this)
        this.mapColors = this.mapColors.bind(this)
        this.openSuccessAddToBasket = this.openSuccessAddToBasket.bind(this)
        this.closeSuccessAddToBasket = this.closeSuccessAddToBasket.bind(this)
        this.addModelToWishlist = this.addModelToWishlist.bind(this)
        this.clickBottomItem = this.clickBottomItem.bind(this)
        this.mapVariantCompatibility = this.mapVariantCompatibility.bind(this)
        this.mapVariantColor = this.mapVariantColor.bind(this)
        this.goVariantProduct = this.goVariantProduct.bind(this)
        this.renderColors = this.renderColors.bind(this)
        this.renderCompatibility = this.renderCompatibility.bind(this)
    }

    componentWillUnmount(){
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        $('body .fixedBtnDetail').remove()
    }
    componentDidMount(){
        if (window.isMobile) {
            if($('#intercom-container').length > 0){
                $('#intercom-container .intercom-launcher-frame').removeAttr('style')
                $('#intercom-container').before('<div class="fixedBtnDetail"></div>')
            }
            if($('#tidio-chat').length > 0){
                $('#tidio-chat').before('<div class="fixedBtnDetail"></div>')
            }
            else $('body').append('<div class="fixedBtnDetail"></div>')
        }

    }
    componentWillMount(){
        if(this.props.currentModel.length > 0){
            this.setState({ blockImage: { ...this.state.blockImage, currentMainImage: this.props.currentModel[0].deviceImages.mainImg.src } })
        }
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.currentModel !== this.props.currentModel ){
            this.setState({ blockImage: { ...this.state.blockImage, currentMainImage: nextProps.currentModel[0].deviceImages.mainImg.src } })
        }
    }
    clickSmallImg(e){
        this.setState({ blockImage: { ...this.state.blockImage, currentMainImage: e.target.getAttribute('src')} })
    }
    openLightBox(){
        $('.zoomContainer').remove()
        let position = null;
        [].concat(this.props.currentModel[0].deviceImages.mainImg, this.props.currentModel[0].deviceImages.realImg).forEach( (item, i ) => {    // find current image position, for LightBox
            if(item.src === this.state.blockImage.currentMainImage) position = i
        })
        this.setState({ blockImage: { ...this.state.blockImage, isOpenLightBox: true, currentImageLightBox: position } })
    }
    closeLightBox(){
        $('#zoom_01').elevateZoom({zoomType: "inner"})
        this.setState({ blockImage: { ...this.state.blockImage, isOpenLightBox: false } })
    }
    mapCriterias(item, i){
        if( item.id !== 'color' && item.id !== 'material' && item.values.length > 0){
            return(
                <span key={`mapCriterias-${i}`} className={`modelValues-small criteria-${item.id} col-xs-6`}>
                    <span>{item.name}:</span><br/>
                    <span>
                        {item.values.map( (itemValue, i) => <b key={`mapCriteriasValue-${i}`}>{itemValue.name}{ i < item.values.length - 1 ? ', ' : ''}</b> )}
                    </span>
                </span>
            )
        }
    }
    mapColors(itemValue, i) {
        return(
                <span key={`mapColors-${i}`} style={{display: 'flex', marginRight: '5px', marginBottom: '10px'}}>
                    {itemValue.colorCode && <span className={itemValue.colorCode.toLowerCase() == '#ffffff' ? "colorPic whiteColor" : "colorPic" }
                                                  style={{backgroundColor: itemValue.colorCode, display: 'inline-block' }}/>}
                    {itemValue.name}
                </span>
               )
    }
    openSuccessAddToBasket(item, source){
        let { successAddToBasket } = this.state;
        let promise = new Promise((resolve, reject) => {
            if(item.modelId) {
                axios.get('/api/loadRecommendProducts?modelId='+item.modelId)
                    .then( result => {
                        resolve(result.data.data.length ? result.data.data : null);
                    })
            }
            else if(source === 'gridPage' || source === 'accessoryDetailPage') {
                axios.get('/api/loadBestBuyProducts?shortcode='+item.shortcode+'&deviceName='+encodeURIComponent(item.deviceName))
                    .then( result => {
                        resolve(result.data.data.length ? result.data.data : null);
                    })
            }
            else  {
                resolve(null)
            }
        });
        promise.then(
            result => {
                if (result && successAddToBasket == null && result.length > 0) {
                    this.setState({recommendProducts: result})
                    this.setState({ successAddToBasket: <SuccessAddToBasket
                            addModelToBasket={this.addModelToBasket}
                            basketData={this.props.basketData}
                            source={source}
                            model={item}
                            recommendProducts={this.state.recommendProducts}
                            closeSuccessAddToBasket={this.closeSuccessAddToBasket}/> })
                }                
            }
        )

    }
    closeSuccessAddToBasket(e){
        if(e && e.target.classList.contains('addToBasket')){
           return false;
        }
        this.setState({ successAddToBasket: null })
    }
    addModelToBasket(e, item){

        let status = e.target.getAttribute('data-status'),
            source = e.target.getAttribute('data-source'),
            amount = e.target.querySelector('input') ?  e.target.querySelector('input').value : 1,
            { basketData } = this.props,
            { bottomActive } = this.state,
            newBasketData = null

        if (!status) {
            status = 'out'
        }

        if (!source) {
            source = 'accessoryDetailPage'
        }

        if (status === 'out-number') {
            return;
        }

        newBasketData = [ ...basketData]

        for (let i = 0; i < amount; i++) {
            newBasketData = [ ...newBasketData, item]
        }

        this.props.basketActions.changeBasketData(newBasketData)

        if( status === 'out'){
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
            if(!window.isMobile){
                this.props.basketActions.basketAddEffect(<AddToBasketEffect startPosition={ $(e.target).offset() }
                                                                            image={item.deviceImages.mainImg.src}
                                                                            basketType="kaufen"/>)
                setTimeout( () => {
                    if(source !== 'relevantProduct'){
                        this.openSuccessAddToBasket(item, source)
                    }
                    this.props.basketActions.basketAddEffect( null )
                }, 2000)
            } else {
                if (bottomActive === 'buy') {
                    $("#buyAddBasket").addClass("sendtocart")
                    setTimeout( () => {
                        $("#buyAddBasket").removeClass('sendtocart');
                    }, 1500)
                }
                if (bottomActive === 'installment') {
                    $("#installmentAddBasket").addClass("sendtocart")
                    setTimeout( () => {
                        $("#installmentAddBasket").removeClass('sendtocart');
                    }, 1500)
                }
                //browserHistory.push('/warenkorb')
            }

            $(".add-Product-To-Basket").addClass('added');
            setTimeout(() => {
                $(".add-Product-To-Basket").removeClass('added');
            }, 1800)
        }
    }

    addModelToWishlist(e, item) {
        e.stopPropagation();
        e.preventDefault();
        let {wishlistData} = this.props, newWishlistData = null
        let status = ''
        if (wishlistData.every(itemWishlist => itemWishlist.id != item.id)) {
            newWishlistData = [...wishlistData, item]
            status = 'add'
        } else {
            newWishlistData = wishlistData.filter(itemWishlist => (itemWishlist.shortcode != item.shortcode));
            status = 'remove'
        }
        this.props.basketActions.changeWishlisteData(newWishlistData)
        this.setState({productIsAddedToWishlist: !this.state.productIsAddedToWishlist})
        if (!window.isMobile && status === 'add') {
            this.props.basketActions.wishlistAddEffect(<AddToWishlistEffect startPosition={$(e.target).offset()}
                                                                        image={item.deviceImages.mainImg.src}/>)
            setTimeout(() => {
                this.props.basketActions.wishlistAddEffect(null)
            }, 2000)
        }
    }

    mapRealImg( item, i){
        let { currentModel } = this.props;
        let className = this.state.blockImage.currentMainImage === item.src
            ? "col-xs-3 modelInfoBlock-img-small active" : "col-xs-3 modelInfoBlock-img-small"
        return(
            <div className={className} key={`mapRealImg-${i}`}>
                <img src={item.src} alt={`${currentModel[0].model} - Teil ${i+2}`} onClick={this.clickSmallImg}/>
            </div>
        )
    }

    clickBottomItem (bottomActive) {
        this.setState({ bottomActive: bottomActive })
    }

    slideItem ( monthPrice, month ){
        return(
            <span key={`slideItem-${month}`} className="priceRow">
                <span className={'monthPrice'}>{ Math.round((+monthPrice) * 100) / 100} {window.currencyValue}</span>
                <span className={'monthDesc'}>x {month} Monate</span>
            </span>
        )
    }

    goVariantProduct = (productId) => {
        let { variantProducts } = this.props;
        let variantProduct = variantProducts.filter((product) => product.id === productId)
        if (variantProduct.length > 0) {
            let { categoryName, model, shortcode } = variantProduct[0]
            browserHistory.push(`/kaufen/detail/zubehoer/${categoryName.replace(/ /g, '-').toLowerCase()}/${model.replace(/\s+|\//g, '-').toLowerCase()}/${shortcode}`)
        }
    }

    mapVariantColor = (itemValue, isActive) => {
        let { currentModel, variantProducts } = this.props;
        let modelCompatibilityId = currentModel[0].criteriasValues
                && currentModel[0].criteriasValues.compatibility
                && currentModel[0].criteriasValues.compatibility.length > 0 ? currentModel[0].criteriasValues.compatibility[0].id : 0
        let variantProduct = variantProducts.filter((product) =>
            product.criteriasValues &&
            product.criteriasValues.color.length > 0 &&
            product.criteriasValues.color[0].id === itemValue.id &&
            product.criteriasValues.compatibility.map(({id}) => id).includes(modelCompatibilityId)
        )
        let className = variantProduct.length > 0 ? "variant-color enable" : "variant-color disable"
        return (
            <span
                key={`mapColors-${itemValue.id}`}
                className={className}
                onClick={() => variantProduct.length > 0 ? this.goVariantProduct(variantProduct[0].id) : null}
                style={isActive ? {color: '#00C27E'} : null}
            >
                {itemValue.colorCode && <span className={itemValue.colorCode.toLowerCase() == '#ffffff' ? "colorPic whiteColor" : "colorPic" }
                                            style={{backgroundColor: itemValue.colorCode, display: 'inline-block' }}/>}
                {itemValue.name}
            </span>
        )
    }

    mapVariantCompatibility = (itemValue, i, isActive) => {
        let { moreModel } = this.state
        let { currentModel, variantProducts} = this.props

        if (moreModel === false && i >= compatibilityListCount) {
            return null
        }

        let modelColorId = currentModel[0].criteriasValues
                && currentModel[0].criteriasValues.color
                && currentModel[0].criteriasValues.color.length > 0 ? currentModel[0].criteriasValues.color[0].id : 0

        let variantProduct = variantProducts.filter((product) =>
            product.criteriasValues &&
            product.criteriasValues.color.length > 0 &&
            product.criteriasValues.compatibility.map(({id}) => id).includes(itemValue.id) &&
            product.criteriasValues.color[0].id === modelColorId)

        if (variantProduct.length === 0) {
            variantProduct = variantProducts.filter((product) =>
                product.criteriasValues &&
                product.criteriasValues.compatibility.map(({id}) => id).includes(itemValue.id)
        )}

        const style = {
            cursor: 'pointer',
        }
        if(isActive) {
            style.color = '#00C27E';
        }
        return (
            <span
                key={`mapCompatibility-${itemValue.id}`}
                style={style}
                className="name"
                onClick={() => variantProduct.length > 0 ? this.goVariantProduct(variantProduct[0].id) : null}>
                {itemValue.name}
            </span>
        )
    }

    renderColors = (item) => {
        let { variantColorList } = this.props
        return (
            <div>                
                {variantColorList.length > 0 && variantColorList.map((itemValue) => {
                    const isActive = itemValue.id === item.values[0].id;
                    return this.mapVariantColor(itemValue, isActive && variantColorList.length > 0);
                })}
                {variantColorList.length == 0 && item.values.length > 0 && 
                    <span key={`mapColors-${item.values[0].id}`} className="name" style={{color: '#161616'}}>
                        {item.values[0].colorCode && <span className={item.values[0].colorCode.toLowerCase() == '#ffffff' ? "colorPic whiteColor" : "colorPic" }
                                                style={{backgroundColor: item.values[0].colorCode, display: 'inline-block' }}/>}
                        {item.values[0].name}
                    </span>
                }
            </div>
        )
    }

    renderCompatibility = (item) => {        
        const variantCompatibilityList = 
            this.props.variantCompatibilityList.length > 0 ? 
                this.props.variantCompatibilityList.sort(function(a, b) {
                    return a.orderBy - b.orderBy
                }) : []

        return (
            <div>
                {variantCompatibilityList.map((itemValue, i) => {
                    const isActive = item.values.map(({id}) => id).includes(itemValue.id);
                    return this.mapVariantCompatibility(itemValue, i, isActive && variantCompatibilityList.length > 0);
                })}
            </div>
        )
    }

    joinName = (value) => {
        let arrName = value.map(item => item.name);
        return arrName.join(', ');
    }

    render() {
        let { currentModel, basketData, wishlistData, capacityName, deviceStatus, variantCompatibilityList, variantColorList, variantProducts } = this.props,
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            { blockImage, successAddToBasket, bottomActive, moreModel } = this.state
        var settings = {
            dots: true,
            arrows: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 1000,
            autoplay: true,
        }
        let month3 = 0, month6 = 0, month12 = 0
        if(currentModel[0]) {
            wishlistData.map((el)=>{
                if ((el.shortcode === currentModel[0].shortcode) && !this.state.productIsAddedToWishlist){
                    this.setState({productIsAddedToWishlist: true})
                }
            })
            let sellPrice = currentModel[0].price
            if (currentModel[0].discountPrice)
                sellPrice = currentModel[0].discountPrice
            month3 = (sellPrice / 3).toFixed(2)
            month6 = (sellPrice / 6).toFixed(2)
            month12 = (sellPrice / 12).toFixed(2)
        }

        return (
            <div>
                {
                    currentModel.map( ( model, i ) => {
                        return(
                            <div className={model.discountPrice ? "modelInfoBlock discount col-xs-12" : "modelInfoBlock col-xs-12"} key={`modelInfoBlock-${i}`}>
                                {<div className="col-xs-12 modelInfo for-mobile">
                                    <p className="modelName">{model.model} {model.extendedTitle && ` (${model.extendedTitle})`}</p>
                                    <p className="shortcode">ID: {model.shortcode}</p>
                                    {/* <div className="fixedRow mobileFixedBtn">
                                        <div className="priceRow">
                                            <p className="head head-price">preis</p>
                                            {model.discountPrice &&
                                            <p className="price discount-price">{model.discountPrice} {window.currencyValue}</p>
                                            }
                                            <p className={model.discountPrice ? 'price old-price' : 'price'}>{ Math.round((+model.price) * 100) / 100} {window.currencyValue}</p>
                                        </div>
                                        <div className="addBasket">
                                            { deviceStatus.statusId == 1 &&
                                            <div
                                                data-status="out"
                                                className="btn addToBasket pulsing"
                                                onClick={(e) => this.addModelToBasket(e, model)}>
                                                <input type="number" defaultValue="1" min="1"/>
                                                Zum Warenkorb hinzufügen
                                            </div>
                                            }
                                            { deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 &&
                                            <p className="boughtDevice">Sie haben diesen Artikel am {deviceStatus.dateOfBought} erworben</p>
                                            }
                                            { !deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1  &&
                                            <p className="boughtDevice">Dieser Artikel ist leider nicht mehr verfügbar, da dieser schon verkauft wurde</p>
                                            }
                                        </div>
                                    </div> */}
                                    <div className="fixedRow mobileFixedBottom">
                                        <div className="tabs">
                                            <span className={bottomActive === 'buy' ? "tab-item active" : "tab-item"} onClick={() => this.clickBottomItem('buy')}>
                                                Sofort-Kaufen
                                            </span>
                                            <span className={bottomActive === 'installment' ? "tab-item active" : "tab-item"} onClick={() => this.clickBottomItem('installment')}>
                                                Ratenzahlung
                                            </span>
                                            <span className={bottomActive === 'rent' ? "tab-item hidden active" : "tab-item hidden"} onClick={() => this.clickBottomItem('rent')}>
                                                Mieten
                                            </span>
                                        </div>
                                        <div className="bottomContent">
                                            {bottomActive === 'buy' && (
                                                <div className="buyArea">
                                                    <div className="priceRow">
                                                        {model.discountPrice && 
                                                            <p className={'price old-price'}>{ Math.round((+model.price) * 100) / 100} {window.currencyValue}</p>
                                                        }                                                        
                                                        <p className={'price'}>
                                                            { Math.round((model.discountPrice ? +model.discountPrice : +model.price) * 100) / 100} {window.currencyValue}
                                                        </p>
                                                    </div>
                                                    <div className="addAccessoryBasket"  id="buyAddBasket">
                                                        <div className="addToBasketEffectMobile">
                                                            <img src={model.deviceImages.mainImg.src} alt=""/>
                                                        </div>
                                                        { deviceStatus.statusId == 1 ?
                                                        <div
                                                            data-status="out"
                                                            className="btn addToBasket pulsing add-to-cart-mobile add-Product-To-Basket"
                                                            onClick={(e) => this.addModelToBasket(e, model)}>
                                                                <div className="default">
                                                                    {/* <input  type="number" defaultValue="1" min="1"/> */}
                                                                    Zum Warenkorb
                                                                </div>
                                                                <div className="success">
                                                                    Zum Warenkorb
                                                                </div>
                                                                <div className="cart">
                                                                    <div>
                                                                        <div></div>
                                                                        <div></div>
                                                                    </div>
                                                                </div>
                                                                <div className="dots" />
                                                        </div> :
                                                        deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ?
                                                        <p className="boughtDevice">Sie haben diesen Artikel am {deviceStatus.dateOfBought} erworben</p> :
                                                        !deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ?
                                                        <p className="boughtDevice">Dieser Artikel ist leider nicht mehr verfügbar, da dieser schon verkauft wurde</p> : <div></div>
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            {bottomActive === 'installment' && (
                                                <div className="installmentArea">
                                                    <Fragment>
                                                        <Slider {...settings}>
                                                            {this.slideItem(month3, 3)}
                                                            {this.slideItem(month6, 6)}
                                                            {this.slideItem(month12, 12)}
                                                        </Slider>
                                                    </Fragment>
                                                    <div className="addAccessoryBasket"  id="installmentAddBasket">
                                                        <div className="addToBasketEffectMobile">
                                                            <img src={model.deviceImages.mainImg.src} alt=""/>
                                                        </div>
                                                        { deviceStatus.statusId == 1  ?
                                                        <div data-status="out"
                                                                className="btn addToBasket pulsing"
                                                                onClick={(e) => this.addModelToBasket(e, model)}>
                                                            {/* <input type="number" defaultValue="1" min="1"/> */}
                                                        </div>
                                                            :
                                                        deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ?
                                                        <p className="boughtDevice">Sie haben diesen Artikel am {deviceStatus.dateOfBought} erworben</p> :
                                                        !deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ?
                                                        <p className="boughtDevice">Dieser Artikel ist leider nicht mehr verfügbar, da dieser schon verkauft wurde</p> : <div></div>
                                                        }
                                                    </div>
                                                </div>

                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="modelValues">
                                            {
                                                model.criterias.find( item => item.id === 'color').values.length > 0 &&
                                                <span style={{display: 'flex'}}>
                                                {model.criterias.find(item => item.id === 'color').values.map(this.mapColors)}
                                                </span>
                                            }
                                            <span style={{display: 'flex', borderRight: model.criterias.find( item => item.id === 'color').values.length === 0 ? 'none' : '1px solid #e4e6e5' }}>
                                                {model.quantity>0 ? 'Auf Lager' : 'Nicht auf Lager'}
                                            </span>
                                        </span>
                                    </div>
                                </div>}
                                <div className="row">
                                    <div className="col-md-9 left-part">
                                        {/*<div className="smallImageDetail">*/}
                                        {/*    {*/}
                                        {/*        model.deviceImages.realImg.length > 0 &&*/}
                                        {/*        <div className={blockImage.currentMainImage === model.deviceImages.mainImg.src*/}
                                        {/*            ? "col-xs-3 modelInfoBlock-img-small active" : "col-xs-3 modelInfoBlock-img-small"}>*/}
                                        {/*            <img src={model.deviceImages.mainImg.src} onClick={this.clickSmallImg} alt={`${model.model} - Teil 1`}/>*/}
                                        {/*        </div>*/}
                                        {/*    }*/}
                                        {/*    { model.deviceImages.realImg.map( this.mapRealImg.bind(this) )}*/}
                                        {/*</div>*/}
                                        <div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <ModelInfoBlockImage image={model.deviceImages}
                                                                         altTitle={model.model}
                                                                         showDescription={true}
                                                                         descriptionProduct={model.description}
                                                                         blockImageState={blockImage}
                                                                         openLightBox={this.openLightBox}
                                                                         clickThumbnailLightBox={this.clickThumbnailLightBox}
                                                                         closeLightBox={this.closeLightBox}
                                                                         nextLightBox={this.nextLightBox}
                                                                         prevLightBox={this.prevLightBox}
                                                                         quickPreview={this.props.quickPreview}
                                                                         clickSmallImg={this.clickSmallImg}
                                                                         productIsAddedToWishlist={this.state.productIsAddedToWishlist}
                                                                         addModelToWishlist={(e) => this.addModelToWishlist(e, model)}/>
                                                    <div className="col-md-6 modelInfo" style={{marginTop: "0"}}>
                                                        <h1 className="modelName">{model.model}{model.extendedTitle && ` (${model.extendedTitle})`}</h1>
                                                        <p className="shortcode">ID: {model.shortcode}</p>
                                                        {/* { model.criterias.find( item => item.id === 'material').values.length > 0 &&
                                                            <div className="material">
                                                                <h5 className="title">Material</h5>
                                                                <span className="value">{model.criterias.find( item => item.id === 'material').values[0].name}</span>
                                                            </div>
                                                        } */}
                                                        <div className="modelValues">
                                                            {
                                                                model.criterias.map((item, i) => {
                                                                    if (item.values.length){
                                                                        return (
                                                                            <div className='value' key={`model-criterias-${i}`}>
                                                                                <h4>{item.name}</h4>
                                                                                <div>
                                                                                    {item.id === 'color' && item.values.length > 0 && (
                                                                                        this.renderColors(item)
                                                                                    )}
                                                                                    {item.id === 'compatibility' && item.values.length > 0 && (
                                                                                        this.renderCompatibility(item)
                                                                                    )}
                                                                                    {item.id !== 'color' && item.id !== 'compatibility' && (
                                                                                        item.values.map((value) => {
                                                                                            return (<span key={`modelValues-${value.id}`} className="name">{value.name}</span>)
                                                                                        })
                                                                                    )}
                                                                                </div>
                                                                                {item.id === 'compatibility' && variantCompatibilityList && variantCompatibilityList.length > compatibilityListCount && (
                                                                                    <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '10px'}}>
                                                                                        {moreModel === false ? (
                                                                                            <button
                                                                                                className="btn-more"
                                                                                                onClick={() => this.setState({moreModel: true})}
                                                                                            >
                                                                                                Mehr anzeigen
                                                                                                <RiArrowDownSLine className="ml-1" />
                                                                                            </button>
                                                                                        ) : (
                                                                                            <button
                                                                                                className="btn-more"
                                                                                                onClick={() => this.setState({moreModel: false})}
                                                                                            >
                                                                                                Weniger anzeigen
                                                                                                <RiArrowUpSLine className="ml-1" />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                        {/* <div className="allCriterias">
                                                            {model.criterias.map(this.mapCriterias)}
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="offer-tab purchase description-block-purchase">
                                                            <div className="item">
                                                                <div className="img">
                                                                    <img src={'/images/offer5.svg'} alt="" />
                                                                </div>
                                                                <p>Geprüfte Qualität</p>
                                                            </div>
                                                            <div className="item">
                                                                <div className="img">
                                                                    <img src={'/images/offer6.svg'} alt="" />
                                                                </div>
                                                                <p>14 Tage Online-Rückgaberecht</p>
                                                            </div>
                                                            <div className="item">
                                                                <div className="img">
                                                                    <img src={'/images/offer7.svg'} alt="" />
                                                                </div>
                                                                <p>Bequeme Ratenzahlung mit 0%-Zins möglich
                                                                </p>
                                                            </div>
                                                            <div className="item">
                                                                <div className="img">
                                                                    <img src={'/images/offer8.svg'} alt="" />
                                                                </div>
                                                                <p>Kostenloser A-Post Versand</p>
                                                            </div>
                                                        </div>
                                                        <div className="description-block">
                                                            <h5 className="description-block-title">Beschreibung</h5>
                                                            <div className="value description-value" dangerouslySetInnerHTML={{__html: model.description }}/>                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ? (
                                        <SoldoutInfoBlock className={'mobile-none'}/>
                                    ) : (
                                        <AdditionalInfoBlock model={model}
                                                         warranty={'2 Jahre '}
                                                         domain={domain}
                                                         basketData={basketData}
                                                         addModelToBasket={this.addModelToBasket}
                                                         deviceStatus={deviceStatus}
                                                         isAccessory={true}
                                        />
                                    )}
                                </div>
                                <div className="msgAddToBasket"/>
                                {false && (
                                    <div className="others-product-block">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <OtherProducts/>
                                        </div>
                                    </div>
                                </div>
                                )}
                                {false && (                         
                                    <div className="others-product-block">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <PurchaseProducts/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                }
                { successAddToBasket }
            </div>
        )
    }
}

AccessoryInfoBlock.propTypes = {}
AccessoryInfoBlock.defaultProps = {
    deviceStatus: {
        statusId: 1,
        dateOfBought: null,
        boughtCurrentUser: false
    }
}

function mapStateToProps (state) {
    return {
        basketData: state.basket.basketData,
        wishlistData: state.basket.wishlistData,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccessoryInfoBlock)
