import axios from "axios"
import React, { Component, Fragment } from 'react'
import Slider from "react-slick";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import AddToBasketEffect from '../common/addToBasketEffect'
import AddToWishlistEffect from "../common/addToWishlistEffect"
import AdditionalInfoBlock from "./additionalInfoBlock"
import SoldoutInfoBlock from "./soldoutInfoBlock"
import ModelInfoBlockImage from './modelInfoBlockImage'
import WarrantyLightbox from './warrantyLightbox'
import SpecificationsBlock from './specificationsBlock'
import UsefullProductItem from "./usefullProductItem"

const usefulProducts = [
    {id:1, text:'3D Tempered Glas (Panzerglas) schwarz für iPhone 12', img:'/images/usefull2.png', cost: 39, toggle: true},
    {id:2, text:'Apple Lightning auf USB-Kabel, 2 Meter, weiss, original', img:'/images/usefull1.png', cost: 29, toggle: false},
    {id:3, text:'3D Tempered Glas (Panzerglas) schwarz für iPhone 12', img:'/images/usefull2.png', cost: 39, toggle: true},
    {id:4, text:'Apple Lightning auf USB-Kabel, 2 Meter, weiss, original', img:'/images/usefull1.png', cost: 29, toggle: false},
    {id:5, text:'Apple Lightning auf USB-Kabel, 2 Meter, weiss, original', img:'/images/usefull1.png', cost: 29, toggle: false},
    {id:6, text:'Apple Lightning auf USB-Kabel, 2 Meter, weiss, original', img:'/images/usefull1.png', cost: 29, toggle: false},
]
export class ModelInfoBlock extends Component {
    constructor(props) {
        super(props)
        this.countdown = null;
        this.state = {
            blockImage: {
                currentMainImage: '',
                isOpenLightBox: false,
                currentImageLightBox: 0
            },
            showWarrantyLightbox: false,
            isRemarketingCampaign: false,
            deadline: process.env.MIX_IS_BUY_COUPON || this.props.isRemarketingCampaign,
            deadlineIsActive: false,
            deadlineExpired: false,
            deadlineTimer: '',
            activeNavItem: 'purchase',
            productIsAddedToWishlist: false,
            bottomActive: 'buy',
            firstLoaded: true,
        }

        this.clickSmallImg = this.clickSmallImg.bind(this)
        this.openLightBox = this.openLightBox.bind(this)
        this.closeLightBox = this.closeLightBox.bind(this)
        this.addModelToBasket = this.addModelToBasket.bind(this)
        this.handleAddModelToBasket = this.handleAddModelToBasket.bind(this)
        this.addUpsellingModelToBasket = this.addUpsellingModelToBasket.bind(this)
        this.toggleWarrantyLightbox = this.toggleWarrantyLightbox.bind(this)
        this.updateCountDown = this.updateCountDown.bind(this)
        this.activateCountDownCoupon = this.activateCountDownCoupon.bind(this)
        this.clickNavItem = this.clickNavItem.bind(this)
        this.clickBottomItem = this.clickBottomItem.bind(this)
        this.addModelToWishlist = this.addModelToWishlist.bind(this)
        this.slideItem = this.slideItem.bind(this)
    }

    componentWillUnmount(){
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        $('body .fixedBtnDetail').remove()
        clearInterval(this.countdown);
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
        let deadline = JSON.parse(window.localStorage.getItem('deadline'));
        if(process.env.MIX_IS_BUY_COUPON || (deadline && deadline.isRemarketingCampaign)){
            if(!document.getElementById("numeric-timer")){
                setTimeout(() => {
                    this.setState({ deadline: false })
                    this.updateCountDown()
                }, 1000)
            }
            else{
                this.setState({ deadline: false })
                this.updateCountDown()
            }

            // Update the count down every 1 min
            this.countdown = setInterval(() => {
                this.setState({ deadline: false })
                this.updateCountDown()
            }, 60000);
        } else {
            window.localStorage.removeItem("deadline");
        }
    }
    componentWillMount(){
        if(this.props.currentModel.length > 0){
            this.setState({ blockImage: { ...this.state.blockImage, currentMainImage: this.props.currentModel[0].deviceImages.mainImg.src } })
        }
        let deadline = JSON.parse(window.localStorage.getItem('deadline')),
            isRemarketingCampaign = this.props.isRemarketingCampaign;
        if(isRemarketingCampaign){
            this.setState({ deadline: true });
            if(deadline){
                this.setState({ isRemarketingCampaign: true })
                deadline.isRemarketingCampaign = true;
                window.localStorage.setItem('deadline', JSON.stringify(deadline));
            }
            else {
                var countDownDate = new Date();
                countDownDate.setHours(countDownDate.getHours() + 3);
                deadline = {countDownDate: countDownDate, isActive: 0, deadlineExpired: 0, couponShortcode: '', isRemarketingCampaign: true};
                window.localStorage.setItem('deadline', JSON.stringify(deadline));
            }
        }
        if(deadline && deadline.isActive){
            this.setState({ deadlineIsActive: true })
        }
        if(deadline && deadline.deadlineExpired){
            this.setState({ deadlineExpired: true })
        }
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.currentModel !== this.props.currentModel ){
            this.setState({ blockImage: { ...this.state.blockImage, currentMainImage: nextProps.currentModel[0].deviceImages.mainImg.src } })
        }
    }
    updateCountDown(){
        this.setState({ deadline: true })
        let deadline = JSON.parse(window.localStorage.getItem('deadline')),
            numericTimer = document.getElementById("numeric-timer");
        if(deadline && deadline.deadlineExpired){
            this.setState({ deadlineExpired: true })
            clearInterval(this.countdown);
            return;
        }
        if(deadline && deadline.isActive){
            this.setState({ deadlineIsActive: true })
        }
        if(!deadline) {
            var countDownDate = new Date();
            countDownDate.setHours(countDownDate.getHours() + 3);
            deadline = {countDownDate: countDownDate, isActive: 0, deadlineExpired: 0, couponShortcode: ''};
            window.localStorage.setItem('deadline', JSON.stringify(deadline));
        }

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = new Date(deadline.countDownDate).getTime() - now;
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="numericTimer"
        var deadlineTimer = hours + "Std. " + minutes + "Min. verbleiben"
        this.setState({ deadlineTimer: deadlineTimer });
        // if(numericTimer){
        //     numericTimer.innerHTML = hours + "Std. " + minutes + "Min. verbleiben"
        // }
        // If the count down is finished
        if (distance <= 0) {
            deadline.deadlineExpired = 1;
            window.localStorage.setItem('deadline', JSON.stringify(deadline));
            clearInterval(this.countdown);
            this.setState({ deadlineExpired: true });
        }
    }

    activateCountDownCoupon(e){
        let deadline = JSON.parse(window.localStorage.getItem('deadline'));
        if(deadline){
            deadline.isActive = 1;
            this.setState({ deadlineIsActive: true });
            window.localStorage.setItem('deadline', JSON.stringify(deadline));

            if(!deadline.couponShortcode) {
                axios.get(`/api/generateCountDownCoupon`)
                    .then( result => {
                        deadline.couponShortcode = result.data.shortcode;
                        window.localStorage.setItem('deadline', JSON.stringify(deadline));
                    })
                    .catch( error => {
                        console.log('error', error.response.data);
                    })
            }
        }

        let { currentModel } = this.props,
            { basketData } = this.props;
        if(!basketData.find( item => (item.shortcode == currentModel[0].shortcode))){
           this.addModelToBasket(e)
        }

    }
    toggleWarrantyLightbox(){
        this.setState({ showWarrantyLightbox: !this.state.showWarrantyLightbox })
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
    mapCriterias(){
        let { criterias, conditionId } = this.props.currentModel[0],
            dataArr = []
        criterias.forEach( item => {
            if (conditionId === 1) return false;
            if( item.name !== this.props.capacityName)
            {dataArr.push(    <span key={item.id} className={`modelValues-small criteria-${item.id} col-xs-4`}>
                                <span>{item.name}:</span><br/>
                                <span>
                                    {item.values.map( (item, i) => <b key={`mapCriteriasValue-${i}`}>{item.name}{ i < item.length - 1 ? ',' : ''}</b> )}
                                </span>
                                </span>)}
        })
        return dataArr
    }
    addModelToBasket(e){
        let status = e.target.getAttribute('data-status'),
            source = e.target.getAttribute('data-source'),
            { currentModel, basketData } = this.props,
            { bottomActive } = this.state,
            newBasketData = null

        if (!status) {
            status = basketData.some(item => item.shortcode === currentModel[0].shortcode) ? 'in' : 'out'
        }

        if (!source) {
            source = 'quickViewPage'
        }

        if( basketData.every( item => item.id != currentModel[0].id)){
            newBasketData = [ ...basketData, currentModel[0] ]
        }
        else{
            newBasketData = basketData.filter( item => (item.shortcode != currentModel[0].shortcode))
        }

        this.props.basketActions.changeBasketData(newBasketData)
        let gtagData  = JSON.parse(window.localStorage.getItem("gtag"));
        if( status === 'out'){
            gtag('event', 'add_to_cart', {
                "items": [
                    {
                        "id": currentModel[0].shortcode,
                        "name": currentModel[0].descriptionLong,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": currentModel[0].discountPrice || currentModel[0].price,
                        "category": gtagData.category || '',
                        "brand": currentModel[0].deviceName,
                    }
                ]
            });
            if(!window.isMobile){
                this.props.basketActions.basketAddEffect(<AddToBasketEffect startPosition={ $(e.target).offset() }
                                                                            image={currentModel[0].deviceImages.mainImg.src}
                                                                            basketType="kaufen"/>)
                setTimeout( () => {
                    if(this.props.quickPreview){
                        this.props.handleCloseQuickView()
                    }
                    this.props.openSuccessAddToBasket(currentModel[0], this.props.quickPreview? source: 'detailPage');
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
                // browserHistory.push('/warenkorb')
            }
        }
        if( status === 'in' ) {
            gtag('event', 'remove_from_cart', {
                "items": [
                    {
                        "id": currentModel[0].shortcode,
                        "name": currentModel[0].descriptionLong,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": currentModel[0].discountPrice || currentModel[0].price,
                        "category": gtagData.category || '',
                        "brand": currentModel[0].deviceName,
                    }
                ]
            });
            if(!newBasketData.length || !newBasketData.filter(item => (item.productTypeId == 7)).length) {
                var deadline = JSON.parse(window.localStorage.getItem('deadline'));
                if(deadline) {
                    deadline.isActive = 0;
                    window.localStorage.setItem('deadline', JSON.stringify(deadline));
                    newBasketData = newBasketData.filter( item => (item.shortcode != deadline.couponShortcode))
                    this.setState({ deadlineIsActive: false })
                    this.props.basketActions.changeBasketData(newBasketData)
                }
                if(process.env.MIX_IS_BUY_COUPON || (deadline && deadline.isRemarketingCampaign)){if(!document.getElementById("numeric-timer")){
                    setTimeout(() => {
                        this.setState({ deadline: false })
                        this.updateCountDown()
                    }, 1000)
                }
                else{
                    this.setState({ deadline: false })
                    this.updateCountDown()
                }
            }
        }
    }
    }
    addUpsellingModelToBasket(e, model) {
        let status = e.target.getAttribute('data-status'),
            { basketData } = this.props,
            newBasketData = null

        if (basketData.every( item => item.id != model.id)) {
            newBasketData = [ ...basketData, model ]
        } else {
            newBasketData = basketData.filter( item => (item.shortcode != model.shortcode))
        }

        this.props.basketActions.changeBasketData(newBasketData)
        let gtagData  = JSON.parse(window.localStorage.getItem("gtag"));
        if( status === 'out'){
            gtag('event', 'add_to_cart', {
                "items": [
                    {
                        "id": model.shortcode,
                        "name": model.descriptionLong,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": model.discountPrice || model.price,
                        "category": gtagData.category || '',
                        "brand": model.deviceName,
                    }
                ]
            });
            if(!window.isMobile) {
                this.props.basketActions.basketAddEffect(<AddToBasketEffect startPosition={ $(e.target).offset() }
                                                                            image={model.deviceImages.mainImg.src}
                                                                            basketType="kaufen"/>)
                setTimeout( () => {
                    this.props.basketActions.basketAddEffect( null )
                }, 2000)
            }
        }
        if( status === 'in' ) {
            gtag('event', 'remove_from_cart', {
                "items": [
                    {
                        "id": model.shortcode,
                        "name": model.descriptionLong,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": model.discountPrice || model.price,
                        "category": gtagData.category || '',
                        "brand": model.deviceName,
                    }
                ]
            });
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
        let className = this.state.blockImage.currentMainImage === item.src
            ? "col-xs-3 modelInfoBlock-img-small active" : "col-xs-3 modelInfoBlock-img-small"
        return(
            <div className={className} key={`mapRealImg-${i}`}>
                <img src={item.src} alt="" onClick={this.clickSmallImg}/>
            </div>
        )
    }

    clickNavItem(e){
        let activeNavItem = e.currentTarget.getAttribute('data-type')
        this.setState({ activeNavItem })
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

    handleAddModelToBasket (e, model) {
        this.setState({firstLoaded: false})
        this.addModelToBasket(e, model)
    }

    render() {
        var settings = {
            dots: true,
            arrows: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 1000,
            autoplay: true,
        }

        let { currentModel, basketData, wishlistData, capacityName, deviceStatus, upsellingItems } = this.props,
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            { blockImage, activeNavItem, bottomActive, month, firstLoaded } = this.state,
            notShowBatteryInfo = false;

        let month3 = 0, month6 = 0, month12 = 0
        if(currentModel[0]) {
            notShowBatteryInfo = (currentModel[0].batteryLoadcycle == 0 && currentModel[0].batteryCapacity == 0) || (currentModel[0].conditionId == 1 || currentModel[0].conditionId == 2)
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
            <div style={{marginTop: 10}}>
                {
                    currentModel.map( ( model, i ) => {
                        let conection = model.criterias.find(item => item.name == 'Verbindungsart') ? model.criterias.find(item => item.name == 'Verbindungsart').values[0].name : '',
                            prozessor = model.criterias.find(item => item.name == 'Prozessor') ? model.criterias.find(item => item.name == 'Prozessor').values[0].name : '',
                            ram = model.criterias.find(item => item.name == 'Arbeitsspeicher') ? model.criterias.find(item => item.name == 'Arbeitsspeicher').values[0].name : '';
                        return(
                            <div className={model.discountPrice ? "modelInfoBlock discount-label col-xs-12" : "modelInfoBlock col-xs-12"} key={`modelInfoBlock-${i}`}>
                                <div className="col-xs-12 modelInfo for-mobile">
                                    <p className="modelName">{model.model} {model.extendedTitle && ` (${model.extendedTitle})`}</p>
                                    <p className="shortcode">ID: {model.shortcode}</p>
                                    <div className="fixedRow mobileFixedBottom">
                                        <div className="tabs">
                                            <div className={bottomActive === 'buy' ? "tab-item active" : "tab-item"} onClick={() => this.clickBottomItem('buy')}>
                                                Sofort-Kaufen
                                            </div>
                                            <div className={bottomActive === 'installment' ? "tab-item active" : "tab-item"} onClick={() => this.clickBottomItem('installment')}>
                                                Ratenzahlung
                                            </div>
                                            <div className={bottomActive === 'rent' ? "tab-item hidden active" : "tab-item hidden"} onClick={() => this.clickBottomItem('rent')}>
                                                Mieten
                                            </div>
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
                                                    <div className="addBasket" id="buyAddBasket">
                                                        <div className="addToBasketEffectMobile">
                                                            <img src={model.deviceImages.mainImg.src} alt=""/>
                                                        </div>
                                                        { deviceStatus.statusId == 1 || deviceStatus.statusId === null ?
                                                        <button data-status={basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                                                className={!basketData.some(item => item.shortcode === model.shortcode) ? 'btn addToBasket pulsing add-to-cart-mobile' : !firstLoaded ? 'btn addToBasket pulsing add-to-cart-mobile added' : 'btn addToBasket pulsing add-to-cart-mobile added noEffect'}
                                                                onClick={(e) => this.handleAddModelToBasket(e, model)}>
                                                            <div className="default">Zum Warenkorb</div>
                                                            <div className="success">Vom Warenkorb</div>
                                                            <div className="cart">
                                                                <div>
                                                                    <div></div>
                                                                    <div></div>
                                                                </div>
                                                            </div>
                                                            <div className="dots"></div>
                                                        </button> :
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
                                                    <div className="addBasket" id="installmentAddBasket">
                                                        <div className="addToBasketEffectMobile">
                                                            <img src={model.deviceImages.mainImg.src} alt=""/>
                                                        </div>
                                                        { deviceStatus.statusId == 1 || deviceStatus.statusId === null ?
                                                        <button data-status={basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                                                className="btn addToBasket pulsing"
                                                                onClick={this.addModelToBasket} />
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
                                            <span>
                                                {model.capacity}
                                                {model.capacityImage && <img src={model.capacityImage} />}
                                            </span>
                                            <span style={{marginBottom: 4}}>
                                                {model.color}&nbsp;
                                                {model.colorCode && <span className={model.colorCode.toLowerCase() == '#ffffff' ? "colorPic whiteColor" : "colorPic"}
                                                                          style={{backgroundColor: model.colorCode }}/>}
                                            </span>
                                        </span>
                                        <span className="modelPlace">
                                            <span>
                                                <img src={`/images/design/aside_filter_category_icons/lagerort.svg`} alt="" style={{width: 16, marginRight: 11}}/>
                                                {model.placeDescription}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="row row-flex">
                                    <div className="col-md-9 left-part">
                                        {/* <div className="smallImageDetail">
                                            {
                                                model.deviceImages.realImg.length > 0 &&
                                                <div className={blockImage.currentMainImage === model.deviceImages.mainImg.src
                                                    ? "col-xs-3 modelInfoBlock-img-small active" : "col-xs-3 modelInfoBlock-img-small"}>
                                                    <img src={model.deviceImages.mainImg.src} onClick={this.clickSmallImg} alt=""/>
                                                </div>
                                            }
                                            { model.deviceImages.realImg.map( this.mapRealImg.bind(this) )}
                                        </div> */}
                                        <div>
                                            <div className="row">
                                                <div className="col-md-12 row-flex">
                                                    <ModelInfoBlockImage image={model.deviceImages}
                                                                         altTitle={model.model + ', ' + model.capacity+', ' + model.color + ', ' + model.condition + ', ' + model.placeDescription}
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

                                                    <div className="col-md-6 modelInfo">
                                                        <p className="modelName">{model.model}{model.extendedTitle && ` (${model.extendedTitle})`}</p>
                                                        <div className="modelStars">
                                                            <a href="#footer"><img src="/images/stars.svg" /></a>
                                                            <span>(1602)</span>
                                                        </div>
                                                        <span className="modelCriterias">{conection} {prozessor} {ram}</span>
                                                        <p className="shortcode">ID: {model.shortcode}</p>
                                                        <div className="modelLocationBanner">
                                                            <img src="/images/location-icon.svg" alt="location icon" />
                                                            <div className="separator-line"></div>
                                                            {model.placeDescription}
                                                        </div>
                                                        <div>
                                                            <div className="modelValues">
                                                                <div className="value">
                                                                    <h4>Farbe</h4>
                                                                    <span>
                                                                        {model.colorCode && <span className={model.colorCode == '#FFFFFF' ? "colorPic whiteColor" : "colorPic"}
                                                                                                style={{backgroundColor: model.colorCode }}/>}
                                                                        {model.color}
                                                                    </span>
                                                                </div>
                                                                <div className="value">
                                                                    <h4>Kapazität</h4>
                                                                    <span>
                                                                        {model.capacity}
                                                                        {model.capacityImage && <img src={model.capacityImage} />}
                                                                    </span>
                                                                </div>
                                                                {/* <span>
                                                                <img src={`/images/design/aside_filter_category_icons/lagerort.svg`} alt="" style={{width: 16, marginRight: 11}}/>
                                                                    {model.placeDescription}
                                                                </span> */}
                                                            </div>
                                                        </div>
                                                        {this.props.currentModel[0].criterias.length === 5 ? (
                                                            <div className="allCriterias mobile-none">
                                                                <span className="modelValues-small condition col-xs-6">
                                                                    <span>Allgemeiner Zustand:</span><br/>
                                                                    <span><b>{ model.condition }</b></span>
                                                                </span>
                                                                {this.mapCriterias.call(this)}
                                                            </div>) : ''}
                                                        <div className="main-info-boxes mobile-none">
                                                            <div className="item">
                                                                <div className="item-info-box">
                                                                    <span className="title">Zustand</span>
                                                                    <div className="item-info-img">
                                                                        <img className="detailInfoImg" src={`/images/design/zustand${model.conditionId}-detail-info.svg`} alt=""/>
                                                                    </div>
                                                                    <div className="description-wrapper">
                                                                        <span className="description">{model.condition}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="item-info-box warranty"
                                                                     onClick={this.toggleWarrantyLightbox}>
                                                                    <span className="title">
                                                                        Garantie
                                                                    </span>
                                                                    <div className="item-info-img">
                                                                        <img className="detailInfoImg" src="/images/design/warranty-detail-info.svg" alt=""/>
                                                                    </div>
                                                                    <div className="description-wrapper">
                                                                        <span className="description"><span className="green">{model.warranty}</span> Garantie</span>
                                                                    </div>
                                                                </div>
                                                                {this.state.showWarrantyLightbox && <WarrantyLightbox toggleLightbox={this.toggleWarrantyLightbox}/>}
                                                            </div>
                                                            <div className="item">
                                                                <div className="item-info-box">
                                                                    <span className="title">Kapazität</span>
                                                                    <div className="item-info-img">
                                                                        <img className="detailInfoImg" src="/images/design/capacity-detail-info.svg" alt=""/>
                                                                    </div>
                                                                    <div className="description-wrapper">
                                                                        <span className="description"><span className="green">{model.capacity.slice(0, model.capacity.indexOf('G'))}</span> GB</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            { !notShowBatteryInfo &&
                                                                <div className="item">
                                                                    <div className="item-info-box">
                                                                        <span className="title">Batterie</span>
                                                                        <div className="item-info-img">
                                                                            <img className="detailInfoImg" src="/images/design/battery-detail-info.svg" alt=""/>
                                                                        </div>
                                                                        <div className="description-wrapper">
                                                                            <span className="description">Ladezyklen: <span className="green">{model.batteryLoadcycle == -1 ? "n.v." : model.batteryLoadcycle}</span></span>
                                                                            <span className="description">Kapazitat: <span className="green">{model.batteryCapacity == -1 ? "n.v." : `${model.batteryCapacity}%`}</span></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                            { notShowBatteryInfo &&
                                                                <div className="item">
                                                                    <div className="item-info-box">
                                                                        <span className="title">Farbe</span>
                                                                        <span className={model.colorCode == '#FFFFFF' ? "color-img whiteColor" : "color-img" } style={{backgroundColor: model.colorCode}}/>
                                                                        <span className="description"><span className="green">{model.color}</span></span>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-12 details mobile-block">
                                                        <div className="allCriterias ">
                                                            <span className="modelValues-small condition col-xs-6">
                                                                <span>Allgemeiner Zustand:</span><br/>
                                                                <span><b>{ model.condition }</b></span>
                                                            </span>
                                                            {this.mapCriterias.call(this)}
                                                        </div>
                                                        {model.note && window.isMobile &&
                                                            <div className="row" style={{marginBottom: '15px'}}>
                                                                <div className="col-md-12">
                                                                    <div className="extra-info-block">
                                                                        <img src="/images/design/attention-mark.svg" alt=""/>
                                                                        <p>{model.note}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="main-info-boxes">
                                                            <div className="item">
                                                                <div className="item-info-box">
                                                                    <span className="title">Zustand</span>
                                                                    <div className="item-info-img">
                                                                        <img className="detailInfoImg" src={`/images/design/zustand${model.conditionId}-detail-info.svg`} alt=""/>
                                                                    </div>
                                                                    <div className="description-wrapper">
                                                                        <span className="description">{model.condition}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="item-info-box warranty"
                                                                     onClick={this.toggleWarrantyLightbox}>
                                                                    <span className="title">
                                                                        Garantie
                                                                    </span>
                                                                    <div className="item-info-img">
                                                                        <img className="detailInfoImg" src="/images/design/warranty-detail-info.svg" alt=""/>
                                                                    </div>
                                                                    <div className="description-wrapper">
                                                                        <span className="description"><span className="green">{model.warranty}</span> Garantie</span>
                                                                    </div>
                                                                </div>
                                                                {this.state.showWarrantyLightbox && <WarrantyLightbox toggleLightbox={this.toggleWarrantyLightbox}/>}
                                                            </div>
                                                            <div className="item">
                                                                <div className="item-info-box">
                                                                    <span className="title">Kapazität</span>
                                                                    <div className="item-info-img">
                                                                        <img className="detailInfoImg" src="/images/design/capacity-detail-info.svg" alt=""/>
                                                                    </div>
                                                                    <div className="description-wrapper">
                                                                        <span className="description"><span className="green">{model.capacity.slice(0, model.capacity.indexOf('G'))}</span> GB</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            { !notShowBatteryInfo &&
                                                                <div className="item">
                                                                    <div className="item-info-box">
                                                                        <span className="title">Batterie</span>
                                                                        <div className="item-info-img">
                                                                            <img className="detailInfoImg" src="/images/design/battery-detail-info.svg" alt=""/>
                                                                        </div>
                                                                        <div className="description-wrapper">
                                                                            <span className="description">Ladezyklen: <span className="green">{model.batteryLoadcycle == -1 ? "n.v." : model.batteryLoadcycle}</span></span>
                                                                            <span className="description">Kapazitat: <span className="green">{model.batteryCapacity == -1 ? "n.v." : `${model.batteryCapacity}%`}</span></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                            { notShowBatteryInfo &&
                                                                <div className="item">
                                                                    <div className="item-info-box">
                                                                        <span className="title">Farbe</span>
                                                                        <span className={model.colorCode == '#FFFFFF' ? "color-img whiteColor" : "color-img" } style={{backgroundColor: model.colorCode}}/>
                                                                        <span className="description"><span className="green">{model.color}</span></span>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 mobile-block">
                                                {!deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ? (
                                                    <SoldoutInfoBlock/>
                                                ) : (
                                                    <AdditionalInfoBlock model={model}
                                                            domain={domain}
                                                            basketData={basketData}
                                                            addModelToBasket={this.addModelToBasket}
                                                            deviceStatus={deviceStatus}
                                                            deadline={this.state.deadline}
                                                            activateCountDownCoupon={this.activateCountDownCoupon}
                                                            deadlineIsActive={this.state.deadlineIsActive}
                                                            deadlineExpired={this.state.deadlineExpired}
                                                            deadlineTimer={this.state.deadlineTimer}
                                                    />
                                                )}
                                                </div>
                                                {model.note && !window.isMobile &&
                                                    <div className="col-md-12 row-flex" style={{marginTop: '30px'}}>
                                                        <div className="extra-info-block">
                                                            <img src="/images/design/attention-mark.svg" alt=""/>
                                                            <p>{model.note}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {this.props.currentModel[0].criterias.length >= 6 ? (
                                                  <div className="col-md-12 criteriaTabLaptop">
                                                      <div className="allCriterias mobile-none">
                                                                    <span className="modelValues-small condition col-xs-6">
                                                                        <span>Allgemeiner Zustand:</span><br/>
                                                                        <span><b>{ model.condition }</b></span>
                                                                    </span>
                                                          {this.mapCriterias.call(this)}
                                                      </div>
                                                  </div>) : ''}
                                                <div className="col-md-12">
                                                    <ul className="offer-tab-buttons">
                                                        <li
                                                            data-type="purchase"
                                                            onClick={this.clickNavItem}
                                                            className={activeNavItem === 'purchase' ? 'active' : ''}>Kaufen</li>
                                                        <li
                                                            data-type="rent"
                                                            onClick={this.clickNavItem}
                                                            className={activeNavItem === 'rent' ? 'active' : ''}>Mieten</li>

                                                    </ul>

                                                    {activeNavItem === 'rent' && <div className="offer-tab rent">
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer1.svg'} alt="" />
                                                            </div>
                                                            <p>Keine Kaution, keine versteckten Kosten</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer2.svg'} alt="" />
                                                            </div>
                                                            <p>Schäden sind abgedeckt durch remarket.care</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer3.svg'} alt="" />
                                                            </div>
                                                            <p>Flexible Mietdauer mit Kaufoption</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer4.svg'} alt="" />
                                                            </div>
                                                            <p>Kostenloser Hin- und Rückversand</p>
                                                        </div>
                                                    </div>}
                                                    {activeNavItem === 'purchase' && <div className="offer-tab purchase" >
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer5.svg'} alt="" />
                                                            </div>
                                                            <p>Geprüfte Geräte mit Garantie</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer6.svg'} alt="" />
                                                            </div>
                                                            <p>14 Tage Rückgaberecht</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer7.svg'} alt="" />
                                                            </div>
                                                            <p>Bequeme Ratenzahlung mit 0%-Zins</p>
                                                        </div>
                                                        <div className="item">
                                                            <div className="img">
                                                                <img src={'/images/offer8.svg'} alt="" />
                                                            </div>
                                                            <p>Kostenloser A-Post Versand</p>
                                                        </div>
                                                    </div>}
                                                </div>
                                                {upsellingItems.length > 0 && (
                                                    <div className="col-md-12 ">
                                                        <div className="usefull-things-block">
                                                            <h3>Nützliche Produkte</h3>
                                                            <div className="usefull-items">
                                                                <UsefullProductItem items={upsellingItems} basketData={basketData} addModelToBasket={this.addUpsellingModelToBasket} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-md-12">
                                                    <div className="specifications">
                                                    <h3>Technische Daten</h3>
                                                    <SpecificationsBlock specifications={this.props.specifications}
                                                        additionalSpecifications={this.props.additionalSpecifications}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 ? (
                                        <SoldoutInfoBlock className={'mobile-none'}/>
                                    ) : (
                                        <AdditionalInfoBlock model={model}
                                            domain={domain}
                                            basketData={basketData}
                                            addModelToBasket={this.addModelToBasket}
                                            deviceStatus={deviceStatus}
                                            deadline={this.state.deadline}
                                            activateCountDownCoupon={this.activateCountDownCoupon}
                                            deadlineIsActive={this.state.deadlineIsActive}
                                            deadlineExpired={this.state.deadlineExpired}
                                            deadlineTimer={this.state.deadlineTimer}
                                            className={'mobile-none'}/>
                                    )}
                                </div>
                                <div className="msgAddToBasket"/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

ModelInfoBlock.propTypes = {}
ModelInfoBlock.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ModelInfoBlock)
