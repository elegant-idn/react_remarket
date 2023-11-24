import axios from 'axios'
import _debounce from 'lodash/debounce'
import React, { Component } from 'react'
import { Animated } from "react-animated-css"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import * as userActions from '../../actions/user'
import { _googleAutocomplete } from '../../helpers/helpersFunction'
import SendLinkMobile from './sendLinkMobile'
import SendLinks from './sendLinks'
import ShowResultsPersonalData from './showResultsPersonalData'
import BringToShop from './summaryTabContent/bringToShop'
import PickupByBicycle from './summaryTabContent/pickupByBicycle'
import PickupByPackage from "./summaryTabContent/pickupByPackage"



export class ShowResults extends Component {
    timer = null
    constructor(props) {
        super(props)
        this.state = {
            country: {
                countriesList: [],
                currentCountry:{
                    inputCountry: "CH",
                    customer_inputCountry: "CH"
                }
            },
            inputCheckbox: {
                shippingAddress: true,
                company: false,
                customerCompanyName: false,
                agree: false,
                asGuest: false,
            },
            coupon: {
                couponError: null,
                couponPrice: null,
                couponShortcode: null,
                isCoupon: false
            },
            errors: {
                password: '',
                info: '',
                general: ''
            },
            currentTab: '',
            pdfUrl: '',
            showOldPrice: false,
            summaryTabContent: 'generalInfo',
            uidNumberField: '',
            place: {},
            defineTypeElem: 0,
            sellDeadline: process.env.MIX_IS_SELL_COUPON?true:false,
            sellDeadlineExpired: false,
            isUnlimited: false,
        }

        this._calculatePrice = this._calculatePrice.bind(this)
        this._mapCriterias = this._mapCriterias.bind(this)
        this._setPersonalDataFields = this._setPersonalDataFields.bind(this)
        this._getPersonalDataFields = this._getPersonalDataFields.bind(this)
        this.changeCountry = this.changeCountry.bind(this)
        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.changeForm = this.changeForm.bind(this)
        this.handleClickMobileBtn = this.handleClickMobileBtn.bind(this)
        this.send = this.send.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.changeCoupon = this.changeCoupon.bind(this)
        this.addToBasket = this.addToBasket.bind(this)
        this.saveAndBackToSellProcess = this.saveAndBackToSellProcess.bind(this)
        this.changeSummaryTabContent = this.changeSummaryTabContent.bind(this)
        this._gtag_report_conversion = this._gtag_report_conversion.bind(this)
        this.handlerChangeInput = this.handlerChangeInput.bind(this)
    }
    componentWillMount() {
        this.inputCouponCallback = _debounce(function (e) {
            let email = document.forms.basketForm.email.value,
                {shippingAddress} = this.state.inputCheckbox
            axios.get(`/api/checkCoupon?coupon=${e.target.value}&email=${email}&shippingAddress=${shippingAddress}&couponType=6`)
                .then((data) => {
                    if (!this.state.coupon.isCoupon) {
                        e.target.value = ''
                        document.getElementById('coupon').checked = false
                        this.setState({
                            coupon: {
                                ...this.state.coupon,
                                isCoupon: true,
                                data: data.data,
                                couponShortcode: data.data.shortcode,
                                showOldPrice: false,
                                couponPrice: +data.data.price
                            }
                        })
                    }
                    else {
                        this.setState({ coupon: {...this.state.coupon, couponError: 'Guteschein wurde bereits benutzt'}})
                    }
                })
                .catch(error => {
                    let {data} = error.response
                    this.setState({ coupon: {...this.state.coupon, couponError: data}})
                })
        }, 1000);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.chooseSummaryTab == 'generalInfo') {
            this.changeSummaryTabContent('generalInfo')
        }
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            let inputs = document.querySelectorAll('.personalData input')
            inputs.forEach( item => {
                item.value = ""
                item.checked = false
            })
            let { inputCheckbox } = this.state
            inputCheckbox.company = false
            this.setState({ inputCheckbox })
        }
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === true){
            this.setState({errors: {...this.state.errors, info: ''}})
        }
        if( nextProps.user.data !== this.props.user.data && nextProps.user.data){
            window.localStorage.removeItem("userDataVerkaufen")
            window.localStorage.removeItem("userData")
            this._setPersonalDataFields(nextProps.user.data)
        }
    }

    componentWillUnmount() {
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        $('body .fixedBtnVerkaufenResult').remove()
        document.querySelector('body').removeEventListener("keyup", this.handleKeyPress, {passive: true})
        clearTimeout(this.timer);
        clearInterval(this.countdown);
    }

    componentDidMount() {
        if (!window.isMobile) {
            $("#myModalResult").modal()
        }
        else {
            $('body .verkaufenQuestion').remove()
            this.props.setTitle && this.props.setTitle('<span class="count">1/3</span> Zusammenfassung')
            if ($('#intercom-container').length > 0) {
                $('#intercom-container .intercom-launcher-frame').removeAttr('style')
                $('#intercom-container').before('<div class="fixedBtnVerkaufenResult summary"></div>')
            }
            if($('#tidio-chat').length > 0){
                $('#tidio-chat').before('<div class="fixedBtnVerkaufenResult summary"></div>')
            }
            else $('body').append('<div class="fixedBtnVerkaufenResult summary"></div>')
        }

        $('.nav-pills a').on('click', e => e.preventDefault())
        if(this.props.user.isLogin && this.props.user.data ){
            this._setPersonalDataFields(this.props.user.data)
        }
        else{
            let personalData = JSON.parse(window.localStorage.getItem('userDataVerkaufen'))
            if(personalData ) this._setPersonalDataFields(personalData)
        }
        /*
        axios.get('/api/countries')
            .then(({data}) => {
                if(window.isGoogleConnection) {
                    _googleAutocomplete.call(this, data.meta.domainId, 'userDataVerkaufen')
                }
                let countriesList = data.data.map(item => {
                    return {value: item['name-short'], label: item['name-de']}
                })
                this.setState({country: {...this.state.country, countriesList}})
            })
        */
        let remarketDomainId = 2
        let countriesList = [
            {value: 'ch', label: 'Schweiz'},
            {value: 'li', label: 'Liechtenstein'},
        ]
        this.setState({country: {...this.state.country, countriesList}})
        if(window.isGoogleConnection) {
            _googleAutocomplete.call(this, remarketDomainId, 'userDataVerkaufen')
        }

        document.querySelector('body').addEventListener("keyup", this.handleKeyPress)
        if(this.props.showInstructions) {
            $('.nav-pills a[href="#instructions"]').tab('show')
            this.setState({ pdfUrl: this.props.pdfUrl, currentTab: 'instructions' })
        }
        this.timer = setTimeout( () => this.setState({ showOldPrice: true }), 1500 )

        if(this.props.shippingType == 'perPost') {
            $('.nav-pills a[href="#form"]').tab('show')
            this.props.setTitle && this.props.setTitle('<span class="count">2/3</span> Persönliche Angaben')
            this.props.setStep && this.props.setStep('form')
            $('.buttonsForMobile .sendForm').css({display: 'block'})
            $('.buttonsForMobile .summary').css({display: 'none'})
            $('.fixedBtnVerkaufenResult').removeClass('summary')
        }
        else if(this.props.shippingType && window.isMobile){
            this.changeSummaryTabContent(this.props.shippingType);
            $('body .verkaufenQuestion').remove()
            this.props.setTitle && this.props.setTitle('<span class="count">1/3</span> Zusammenfassung')
            if($('#intercom-container').length > 0){
                $('#intercom-container .intercom-launcher-frame').removeAttr('style')
                $('#intercom-container').before('<div class="fixedBtnVerkaufenResult summary"></div>')
            }
            if($('#tidio-chat').length > 0){
                $('#tidio-chat').before('<div class="fixedBtnVerkaufenResult summary"></div>')
            }
            else $('body').append('<div class="fixedBtnVerkaufenResult summary"></div>')
        }
        else if (this.props.shippingType ) {
            this.changeSummaryTabContent(this.props.shippingType);
        }
    }

    updateCountDown(){
        this.setState({ sellDeadline: true })
        let sellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline')),
            numericTimer = document.getElementById("timer-countdown");
        if(!sellDeadline || (sellDeadline && sellDeadline.sellDeadlineExpired)){
            this.setState({ sellDeadlineExpired: true })
            clearInterval(this.countdown);
            return;
        }

        if(sellDeadline && sellDeadline.isUnlimited){
            this.setState({isUnlimited: true});
        }

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = new Date(sellDeadline.countDownDate).getTime() - now;
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="numericTimer"

        if(numericTimer){
            numericTimer.innerHTML = hours + "Std. " + minutes + "Min."
        }

        // If the count down is finished or sellDeadline.isUnlimited
        if (!sellDeadline.isUnlimited && distance < 0) {
            sellDeadline.sellDeadlineExpired = 1;
            window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
            clearInterval(this.countdown);
            this.setState({ sellDeadlineExpired: true });
        }
    }

    _gapi_load_surveyoptin(){
        var email = window.localStorage.getItem("email");
        var order = window.localStorage.getItem("order");
        var loggedUserData = JSON.parse(window.localStorage.getItem("loggedUserData"));
        var userData = JSON.parse(window.localStorage.getItem("userDataVerkaufen"));
        let user = {};
        if (loggedUserData && loggedUserData.shippingAddress) {
            user.country = loggedUserData.shippingAddress.inputCountry;

        } else if (userData && userData.shippingAddress) {
            user.country = userData.shippingAddress.inputCountry;

        } else {
            return;
        }
        const now = new Date();
        let deliveryDuration = 2;
        if([5, 6, 0].includes(now.getDay())){
            deliveryDuration = 3;
        }
        let estimated_delivery_date = new Date(now.setDate(now.getDate()+deliveryDuration)).toISOString().substring(0,10);
        if (typeof window.gapi !== 'undefined') {
            window.gapi.load('surveyoptin', function() {
                window.gapi.surveyoptin.render(
                    {
                        // REQUIRED FIELDS
                        "merchant_id": 120090380,
                        "order_id": order,
                        "email": email,
                        "delivery_country": user.country,
                        "estimated_delivery_date": estimated_delivery_date,
    
                        // OPTIONAL FIELDS
                        // "products": [{"gtin":"GTIN1"}, {"gtin":"GTIN2"}]
                    });
            });    
        }
    }
    _gtag_report_conversion(url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-827036726/CBjWCIaAqscBELaorooD', 'value': this._calculatePrice().price, 'currency': 'CHF',
            'event_callback': callback
        });
        return false;
    }

    handlerChangeInput(e) {
        this.setState({uidNumberField: e.target.value})
    }

    handleKeyPress(e) {
        if (e.key === "Escape") {
            if (($("#modalAGBReg").data('bs.modal') || {}).isShown) {
                $('#modalAGBReg').modal('hide')
            }
            else{
                $('#myModalResult').modal('hide')
                this.props.closeShowResults(this.state.currentTab, this.state.inputCheckbox.asGuest)
            }
        }
    }

    _setPersonalDataFields(data) {
        let shippingAddressForm = document.forms.basketForm,
            { country, inputCheckbox, uidNumberField } = this.state
        if(shippingAddressForm){
            for(let key in data.billingAddress){
                if(key === 'customer_inputCountry'){
                    country.currentCountry.customer_inputCountry = data.billingAddress[key]
                }
                else if (key === 'customer_companyName') {
                    if(data.billingAddress[key]){
                        inputCheckbox.customerCompanyName = true
                        shippingAddressForm[key].value = data.billingAddress[key]
                    }
                    else{
                        inputCheckbox.customerCompanyName = false
                        shippingAddressForm[key].value = data.billingAddress[key]
                    }
                }
                else if (shippingAddressForm[key]) shippingAddressForm[key].value = data.billingAddress[key]

            }
            for(let key in data.shippingAddress){
                if(key === 'inputCountry' ){
                    country.currentCountry.inputCountry = data.shippingAddress[key]
                }
                else if (key === 'companyName' ) {
                    if( data.shippingAddress[key]){
                        inputCheckbox.company = true
                        shippingAddressForm[key].value = data.shippingAddress[key]
                    }
                    else{
                        inputCheckbox.company = false
                        shippingAddressForm[key].value = data.shippingAddress[key]
                    }
                }
                else if( key === 'vat'){
                    uidNumberField = data.shippingAddress[key]
                }
                else if (shippingAddressForm[key]) shippingAddressForm[key].value = data.shippingAddress[key]
            }
        }
        this.setState({ country, inputCheckbox, uidNumberField,
                        autoloadPersonalData: {...this.state.autoloadPersonalData, element: null, data: null}
        })
    }

    _getPersonalDataFields() {
        let form = document.forms.basketForm,
            data = {}
        if(form){
            data.shippingAddress = {
                city: form.city.value,
                companyName: form.companyName.value,
                vat: form.companyUidNumber.value,
                email: form.email.value,
                firstname: form.firstname.value,
                gender: form.gender.value,
                inputCountry: form.inputCountry && form.inputCountry.value,
                lastname: form.lastname.value,
                number: form.number.value,
                phone: form.phone.value,
                street: form.street.value,
                zip: form.zip.value
            }
            data.billingAddress = {
                customer_city: form.city.value,
                customer_companyName: form.companyName.value,
                customer_email: form.email.value,
                customer_firstname: form.firstname.value,
                customer_gender: form.gender.value,
                customer_inputCountry: form.customer_inputCountry && form.customer_inputCountry.value,
                customer_lastname: form.lastname.value,
                customer_number: form.number.value,
                customer_phone: form.phone.value,
                customer_street: form.street.value,
                customer_zip: form.zip.value
            }
        }
        return data
    }

    changeCountry(val, name) {
        let {value} = val,
            {currentCountry} = this.state.country
        currentCountry[name] = value
        this.setState({ country: { ...this.state.country, currentCountry } })
    }

    changeCoupon(e) {
        this.setState({coupon: {...this.state.coupon, couponError: null}})
        e.persist()
        this.inputCouponCallback(e)
    }

    addToBasket(e) {
        let {userAnswers} = this.props,
            data = []
        if(this.state.coupon.isCoupon) data = [userAnswers, this.state.coupon.data]
        else data.push(userAnswers)
        this.props.addToBasketVerkaufen( e, data )
    }

    saveAndBackToSellProcess(e) {
        this.props.addToBasketVerkaufen(e, [this.props.userAnswers], true)
        this.props.handlerBack && this.props.handlerBack()
    }

    changeCheckbox(e){
        let { inputCheckbox } = this.state,
            { name } = e.target
        inputCheckbox[name] = !inputCheckbox[name]
        this.setState({ inputCheckbox })
    }

    changeForm() {
        let personalData = this._getPersonalDataFields()
        window.localStorage.setItem('userDataVerkaufen', JSON.stringify(personalData))
        this.setState({ errors: {...this.state.errors, info:'', password: '', general: '' }})
    }

    cancelSendByEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault()
            return false
        }
    }

    send(e) {
        e.preventDefault();
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1];
        let sellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline'))
        let checkPrice = this._calculatePrice().price > 99;
        if(this.state.inputCheckbox.agree){
            let data = new FormData(document.forms.basketForm),
                basketData = [ ...this.props.basket.basketDataVerkaufen, this.props.userAnswers]

            if(this.state.coupon.isCoupon) basketData.push(this.state.coupon.data)
            if(sellDeadline && !sellDeadline.sellDeadlineExpired && sellDeadline.isActive && checkPrice){
                let coupon = {
                    couponProductTypeId: 6,
                    note: "Limitierter Gutschein",
                    price: "20.00",
                    productTypeId: 999,
                    shortcode: sellDeadline.couponShortcode
                }
                basketData = basketData.filter(item => item.productTypeId !== 999);
                basketData.push(coupon)
            }
            data.append("basketData", JSON.stringify(basketData))
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post('/api/basketPayout', data)
                .then( result => {
                    window.localStorage.setItem('email', result.data[0].viewData.email)
                    window.localStorage.setItem('order', result.data[0].viewData.basketPayoutShortcode)
                    window.localStorage.setItem('template', JSON.stringify(result.data[0].viewData.templates))
                    window.localStorage.setItem('PDFData', JSON.stringify(result.data[0].PDFData))
                    window.localStorage.setItem('basketDataVerkaufenForSellPage', JSON.stringify(this.props.basket.basketDataVerkaufen))

                    window.localStorage.removeItem('basketDataVerkaufen')
                    this.props.basketActions.changeBasketVerkaufenData([])

                    document.getElementById('spinner-box-load').style.display = 'none'
                    $('.nav-pills a[href="#instructions"]').tab('show')
                    if(window.isGoogleConnection) {
                        this._gtag_report_conversion_by_postal();
                        this._gapi_load_surveyoptin();

                    }
                    if(window.isMobile){
                        $('.buttonsForMobile .sendForm').css({display: 'none'})
                        $('.buttonsForMobile .estimatePrice').css({display: 'block'})
                        this.props.setTitle && this.props.setTitle('<span class="count">3/3</span> Anleitung')
                        this.props.setStep && this.props.setStep('instructions')
                        this.props.setIsGuest && this.props.setIsGuest(this.state.inputCheckbox.asGuest)
                    }

                    this.setState({ pdfUrl: result.data[0].PDFPath, currentTab: 'instructions' })
                    if(window.isGoogleConnection) {
                        // this._gtag_report_conversion() //google adwords
                        }
                    if(window.isFBConnection) {
                        fbq('track', 'CompleteRegistration',
                            {value: result.data[0].PDFData.totalPrice, currency: window.currencyValue,}
                        )// facebook pixel

                        if (domain === 'ch') {
                            fbq('track', 'Purchase',
                                {value: result.data[0].PDFData.totalPrice, currency: 'CHF',}
                            )// facebook pixel
                        }
                    }
                })
                .catch( error => {
                    let err = error.response.data.errors,
                        info, password, general
                    if(err){
                        err.email ? info = err.email : ''
                        err.password ? password = err.password : ''
                        err.general ? general = err.general : ''
                    }
                    this.setState({ errors: {...this.state.errors, info, password, general } })
                    document.getElementById('spinner-box-load').style.display = 'none'
                })
        }
    }

    handleClickMobileBtn(e) {
        let name = e.target.getAttribute('data-name')
        if(name === 'summary'){
            $('.nav-pills a[href="#form"]').tab('show')
            this.props.setTitle && this.props.setTitle('<span class="count">2/3</span> Persönliche Angaben')
            this.props.setStep && this.props.setStep('form')
            $('.buttonsForMobile .sendForm').css({display: 'block'})
            $('.buttonsForMobile .summary').css({display: 'none'})
            $('.fixedBtnVerkaufenResult').removeClass('summary')
        }
        else if(name === 'form') $("#form button[type='submit']").click()
    }

    _calculatePrice() {
        let { userAnswers } = this.props,
            minPrice = +userAnswers.Model[0].minPrice,
            total = 0,
            oldPrice = 0,
            couponPrice
        for( let key in userAnswers){
            if( key === 'Defects'){
                userAnswers[key].forEach( item => total += +item.price)
            }
            else if( key !== 'Brand' && key !== 'Submodel' && key !== 'image' && key !== 'Device' && key !== 'Condition' && key !== 'comment'){
                if(key === 'Model'){
                    userAnswers[key].forEach( item => {
                        total += +item.price
                    })
                }
                else{
                    userAnswers[key].forEach( item => {
                        let modelPrice = +userAnswers.Model[0].price,
                            itemPrice = +item.valuePrice.replace(/,/g, ".").replace(/[^0-9.]/g, ""),
                            newPrice = 0,
                            isPersantage = item.valuePrice.includes('%'),
                            isNegative = item.valuePrice.includes('-')
                        if( isPersantage ){
                            newPrice = Math.ceil((modelPrice * (itemPrice/100))/5)*5
                            if(isNegative){
                                total -= newPrice
                            }
                            else{
                                total += newPrice
                            }
                        }
                        else{
                            if(isNegative){
                                total -= itemPrice
                            }
                            else{
                                total += itemPrice
                            }
                        }

                    })
                }
            }
        }
        if(total < minPrice) total = minPrice
        oldPrice = total
        if(this.state.coupon.isCoupon) total += +this.state.coupon.couponPrice
        if(userAnswers.Model[0].discountPrice > 0) total += +userAnswers.Model[0].discountPrice
        if(oldPrice === total) oldPrice = 0
        oldPrice = (Math.round(oldPrice/5))*5
        total = (Math.round(total/5))*5
        const sellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline'));
        if(sellDeadline && sellDeadline.isActive && !sellDeadline.sellDeadlineExpired && total > 99){
            couponPrice = total+20;
        }
        return { price: total || 0, oldPrice: oldPrice || 0, couponPrice: couponPrice}
    }

    _mapCriterias() {
        let { userAnswers } = this.props,
            elementsArray = []
        for( let answer in userAnswers){
            let titleName = '',
                className = !window.isMobile ? "col-xs-4 itemAnswer" : "col-xs-6 itemAnswer"
            switch (answer){
                case 'Brand':
                    titleName = 'Marke'
                    break
                case 'Submodel':
                    titleName = 'Untermodell'
                    break
                case 'Model':
                    titleName = 'Modell'
                    break
                case 'Condition':
                    titleName = 'Allgemeiner Zustand'
                    break
                case 'Defects':
                    titleName = 'Liste der Defekte'
                    break
                default:
                    titleName = answer
            }
            if( answer !== 'image' && answer !== 'Device' && answer !== 'Defects' && answer !== 'comment'){
                elementsArray.push(
                    <div className={className} key={answer}>
                        <p className="title">{titleName}</p>
                        <ul>
                            {userAnswers[answer].map( (item, i) => {
                                return ( <li key={i}>
                                            {item.name} {item.nameExt ? ` (${item.nameExt})` : null}
                                            {!item.hasOwnProperty('colorCode') && answer !== 'Model' && item.image && <img src={item.image} />}
                                            { item.colorCode && <span className="colorPic" style={{backgroundColor: item.colorCode }}/>}
                                        </li>)}
                                )
                            }
                            {userAnswers[answer].length === 0 && <li>-</li>}
                        </ul>
                    </div>
                )
            }
            if( answer === 'Defects' ){
                elementsArray.push(
                    <div className={className} key={answer}>
                        <p className="title">{titleName}</p>
                        <p>{userAnswers[answer].map( (item, i) =>
                            <span key={i}>{item['description-short']}{i < userAnswers[answer].length - 1 ? ', ' : null}</span>)}
                        </p>
                    </div>
                )
            }
        }
        //wrap in row class
        let groupSize = !window.isMobile ? 3 : 2
        let rows = elementsArray.reduce((r, element, index) => {
            index % groupSize === 0 && r.push([])
            r[r.length - 1].push(element)
            return r;
        }, []).map(function(rowContent ,i) {
            return <div className="row" key={i}>{rowContent}</div>
        })
        return rows
    }

    _gtag_report_conversion_by_postal = (url) => {
        var callback = function () {
            if (typeof (url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', { 'send_to': 'AW-827036726/CBjWCIaAqscBELaorooD', 'value': this._calculatePrice().price, 'currency': 'CHF', 'event_callback': callback });
        return false;
    };

    _gtag_report_conversion_Basel_Barfusserplatz = (url) => {
        var callback = function () {
            if (typeof (url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {'send_to': 'AW-827036726/CGLSCOnA1pYBELaorooD', 'event_callback': callback});

        return false;
    }
    _gtag_report_conversion_Basel_St_Jakob = (url) => {
        var callback = function () {
            if (typeof (url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {'send_to': 'AW-827036726/VWneCM2d4pYBELaorooD', 'event_callback': callback});

        return false;
    }
    _gtag_report_conversion_Bern_Shoppyland = (url) => {
        var callback = function () {
            if (typeof (url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {'send_to': 'AW-827036726/UHMXCOu_1pYBELaorooD', 'event_callback': callback});

        return false;
    }
    changeSummaryTabContent(value, place) {
        if(process.env.MIX_IS_SELL_COUPON){
            setTimeout(() => {
                this.setState({ sellDeadline: false })
                this.updateCountDown()
            }, 1000)

            // Update the count down every 1 min
            this.countdown = setInterval(() => {
                this.setState({ sellDeadline: false })
                this.updateCountDown()
            }, 60000);

        }

        if(value == 'generalInfo' && window.isMobile) {
            this.props.handleClearSummaryTab();
        }
        if(value == 'bringToShop' && window.isGoogleConnection){
            if(place.id===1){
                this._gtag_report_conversion_Basel_Barfusserplatz();
            }
            else if(place.id===5){
                this._gtag_report_conversion_Basel_St_Jakob();
            }
            else if(place.id===6){
                this._gtag_report_conversion_Bern_Shoppyland();
            }
        }
        this.setState({
            summaryTabContent: value,
            place
        })

    }
    showLoginForm() {

        this.setState({
            showLoginForm: true,
            defineTypeElem: this.state.defineTypeElem + 1
        })

    }
    _loadPersonalData(token){
        if(token){
            axios.get(`/api/customerAgileData`)
                .then((data) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    if (data.status === 200) {
                        this.props.userActions.loginSuccess(data.data)
                    }
                })
                .catch(error => {
                })
        }
    }

    loginFormMobile(e){
        e.preventDefault();
        let url = '/api/login'
        let data = new FormData(document.forms.loginFormMobile)
        document.getElementById('spinner-box-load').style.display = 'block';
        axios.post(url, data)
            .then( result =>{
                if(result.statusText !== "OK"){
                    document.getElementById('spinner-box-load').style.display = 'none'
                    let { errorLogin } = this.state
                    errorLogin[result.data.field] = result.data.message
                    if(result.data.resendActivationLink) errorLogin.resendActivationLink = result.data.resendActivationLink
                    this.setState({ errorLogin })
                }
                else {
                    window.localStorage.setItem( "token", result.data.token )
                    window.axios.defaults.headers.common['Authorization-Token'] = result.data.token
                    this._loadPersonalData(result.data.token)
                }

            })
            .catch( ( error ) => {

                document.getElementById('spinner-box-load').style.display = 'none';
                let err = error.response.data.errors,
                    login, password
                if(err){
                    err.login ? login = err.login[0] : ''
                    err.password ? password = err.password[0] : ''
                }

                this.setState({ errorLogin: {...this.state.errorLogin, login, password }, spinner: null })
            })
    }

    render() {

        $('#tidio-chat #tidio-chat-iframe').show()
        let {userAnswers, changeComment, closeShowResults, user} = this.props,
            {country, inputCheckbox, errors, currentTab, coupon, summaryTabContent, uidNumberField, place, defineTypeElem, showLoginForm, sellDeadlineExpired,  sellDeadline, isUnlimited} = this.state,
            price = 0,
            showAddCoupon = this.props.basket.basketDataVerkaufen.every(item => item.productTypeId != 999),
            places = JSON.parse(window.localStorage.getItem("locationData")),
            storageSellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline'));

        if (!this.props.showInstructions) price = this._calculatePrice()

        return (
            <div className="resultSellPage">
                <div id="myModalResult" className="modal fade bs-example-modal-lg" data-backdrop="static" role="dialog"
                     aria-labelledby="myLargeModalLabel">
                    <div className="modal-dialog modal-lg modal-sell-result" role="document">

                        <button type="button" className="closeModal"
                                onClick={() => closeShowResults(currentTab, inputCheckbox.asGuest)}
                                data-dismiss="modal"
                                aria-label="Close"/>
                        <div className="modal-content">
                            <div className="tabs">
                                <ul className="nav nav-pills nav-justified" role="tablist">
                                    <li role="presentation" className="active">
                                        <a href="#summary" aria-controls="home" role="tab">
                                            <span className="num">1</span>Zusammenfassung</a></li>
                                    <li role="presentation">
                                        <a href="#form" aria-controls="profile" role="tab">
                                            <span className="num">2</span>Persönliche Angaben</a>
                                    </li>
                                    <li role="presentation">
                                        <a href="#instructions" aria-controls="messages" role="tab">
                                            <span className="num">3</span>Anleitung</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    {userAnswers && <div role="tabpanel" className="tab-pane active" id="summary">
                                        <div className="clearfix">
                                            {summaryTabContent !== 'chooseLocation' &&
                                            <div
                                                className="col-sm-4 clearfix topMobile">

                                                {(summaryTabContent === 'bringToShop' && !window.isMobile) &&
                                                <div className="bring-to-shop__backButton"
                                                     onClick={() => this.changeSummaryTabContent('generalInfo')}>
                                                    <div className="bring-to-shop__backButton-btn">
                                                        <img src="/images/icons/arrow-back.svg" alt="ZURÜCK"/>
                                                    </div>
                                                    <span>ZURÜCK</span>
                                                </div>
                                                }
                                                <div className="information-block">
                                                    <h3 className="title">Information</h3>
                                                    <p>Gerne können Sie bei uns im Ladenlokal das Gerät verkaufen oder
                                                        kostenlos uns per Post zusenden.</p>
                                                </div>
                                                <div className="image col-xs-12  text-center">
                                                    <img src={userAnswers.image} alt=""/>
                                                </div>
                                                <div className="clearfix"/>
                                                <Animated animationIn="zoomIn" animationInDelay={3}>
                                                    <div className="price col-xs-12 animated zoomIn">
                                                        <p className="title text-center">Ihr Preis
                                                            {price.couponPrice && <span> | <span className='old-price'> {price.price} {window.currencyValue}</span>
                                            </span>}
                                                        </p>
                                                        {
                                                            price.couponPrice &&
                                                            <React.Fragment>
                                                                <p className="value text-center">
                                                                    {price.couponPrice} {window.currencyValue}
                                                                </p>
                                                                {
                                                                    sellDeadline && !isUnlimited && !sellDeadlineExpired &&
                                                                    <div className="coupon">
                                                                    <p>Angebot gilt nur für kurze Zeit!</p>
                                                                        <div className="countdown">
                                                                            <img
                                                                                src="/images/design/shop/coupons/group.svg"
                                                                                alt=""/>
                                                                            <span id='timer-countdown'></span>
                                                                        </div>

                                                                    </div>
                                                                }
                                                            </React.Fragment>
                                                        }
                                                        {
                                                            !price.couponPrice &&
                                                            <React.Fragment>
                                                                <p className={price.oldPrice > 0 && this.state.showOldPrice ? 'oldPrice value' : 'value'}>
                                                                    {price.oldPrice > 0 ? price.oldPrice : price.price} {window.currencyValue}
                                                                </p>
                                                                {price.oldPrice > 0 && this.state.showOldPrice &&
                                                                <Animated animationIn="bounceIn"
                                                                          animationInDelay={1000}>
                                                                    <div>
                                                                        <p className='value'>
                                                                            {price.price} {window.currencyValue}
                                                                        </p>
                                                                        {coupon.isCoupon && price.couponPrice &&
                                                                        <p className="couponInfo"><span
                                                                            className="circleOk"/>Gutschein {coupon.couponShortcode} wurde
                                                                            eingelöst</p>}
                                                                    </div>
                                                                </Animated>
                                                                }
                                                            </React.Fragment>
                                                        }

                                                    </div>
                                                </Animated>
                                                <div className="tabSummary">
                                                        {(!window.isMobile && summaryTabContent !== 'chooseLocation') && <SendLinks user={user} id="summary"/>}
                                                </div>
                                            </div>
                                            }
                                            <div className={summaryTabContent !== 'chooseLocation' ? "col-sm-8" : "col-md-12"}>
                                                <div className="row">
                                                    {summaryTabContent === 'generalInfo' &&
                                                    <div>
                                                        <div className="wrapAnswers clearfix">
                                                            {this._mapCriterias()}
                                                        </div>
                                                        <div className="comment">
                                                        <textarea style={{width: '100%'}}
                                                                  name="comment" rows="2"
                                                                  placeholder="Kommentar zu diesem Gerät hinzufügen (optional)"
                                                                  onChange={changeComment}/>
                                                        </div>
                                                    </div>
                                                    }
                                                    {summaryTabContent === 'chooseLocation' &&
                                                    <div className="chooseLocation" id="chooseLocationTab">
                                                        {!window.isMobile &&
                                                        <div className="backButton"
                                                             onClick={() => this.changeSummaryTabContent('generalInfo')}>
                                                            <img src="/images/icons/arrow-back.svg" alt=""/>
                                                        </div>
                                                        }
                                                        {!window.isMobile &&
                                                        <div className="back"><span>Zurück</span></div>
                                                        }
                                                        <div className="col-md-12">
                                                            <p className="title text-center">Ladenlokal besuchen</p>
                                                            <p className="description text-center">Wählen Sie die
                                                                Filiale aus, welche Sie besuchen wollen, um weitere
                                                                Informationen zu erhalten.</p>
                                                            <div className="locations">
                                                                {
                                                                    places.data.map((item, i) => {
                                                                        return (
                                                                            <button key={i}
                                                                                    className="btn bigText text-center"
                                                                                    onClick={(e) => {
                                                                                        this.changeSummaryTabContent('bringToShop', item)
                                                                                    }}>
                                                                                <img alt=""
                                                                                     src={`/images/${item.id}.svg`}
                                                                                     style={{marginRight: 17}}/>
                                                                                <div className="location-title">
                                                                                    Filiale {item.descriptionBranch}
                                                                                </div>
                                                                            </button>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }
                                                    {summaryTabContent === 'bringToShop' && <BringToShop place={place} sellDeadlineExpired={sellDeadlineExpired}/>}
                                                    {summaryTabContent === 'pickupByBicycle' && <PickupByBicycle/>}
                                                    {summaryTabContent === 'pickupByPackage' && <PickupByPackage/>}
                                                </div>
                                                {summaryTabContent !== 'chooseLocation' &&
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row buttons">
                                                        <span className="link"
                                                              onClick={this.saveAndBackToSellProcess}>
                                                            <i className="fa fa-plus" aria-hidden="true"/>
                                                            Weiteres Gerät verkaufen
                                                        </span>
                                                            <span className="link"
                                                                  onClick={this.addToBasket}>
                                                            <img src="/images/design/save.svg" alt=""/>
                                                            Ich will später weitermachen, jetzt <strong>speichern</strong>!
                                                        </span>
                                                        </div>
                                                        <div className="row text-right buttons">
                                                            {/* <button className="btn" onClick={() => this.changeSummaryTabContent('pickupByPackage')}>
                                                            Abholen lassen(paket)
                                                            <img src="/images/design/ic-home.svg" alt=""/>
                                                        </button>
                                                        <button className="btn" onClick={() => this.changeSummaryTabContent('pickupByBicycle')}>
                                                            Abholen lassen(fahrrad)
                                                            <img src="/images/design/ic-home.svg" alt=""/>
                                                        </button> */}
                                                            {/*<button className="btn" onClick={() => this.changeSummaryTabContent('bringToShop')}>*/}
                                                            <button className="btn"
                                                                    onClick={() => this.changeSummaryTabContent('chooseLocation')}>
                                                                Ladenlokal besuchen
                                                                <img src="/images/design/ic-bring.svg" alt=""/>
                                                            </button>
                                                            <button className="btn"
                                                                    data-name="summary"
                                                                    onClick={(e) => {
                                                                        $('.nav-pills a[href="#form"]').tab('show');
                                                                        this.props.setStep && this.handleClickMobileBtn(e);
                                                                    }}>
                                                                Gratis per Post einsenden
                                                                <img src="/images/design/ic-post.svg" alt=""/>
                                                            </button>
                                                        </div>
                                                        {window.isMobile && <SendLinkMobile/>}
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                        </div>
                                    </div>}
                                    {userAnswers && <div role="tabpanel" className="tab-pane" id="form">
                                        <div className="clearfix">
                                            {window.isMobile && <SendLinkMobile/>}
                                            <div className="col-sm-4 clearfix topMobile">
                                                <div className="image col-xs-12 text-center">
                                                    <img src={userAnswers.image} alt=""/>
                                                </div>
                                                {
                                                    storageSellDeadline && storageSellDeadline.isActive && !storageSellDeadline.sellDeadlineExpired && price.couponPrice
                                                        ?
                                                        <div className="price col-xs-12">
                                                            <p className="title text-center">Ihr Preis</p>
                                                            <p className='oldPrice value text-center'>
                                                                {price.price} {window.currencyValue}
                                                            </p>

                                                            <Animated animationIn="bounceIn" animationInDelay={1000}>
                                                                <div>
                                                                    <p className='value text-center'>
                                                                        {price.couponPrice} {window.currencyValue}
                                                                    </p>
                                                                    <p className="couponInfo"><span
                                                                        className="circleOk"/>Gutschein {storageSellDeadline.couponShortcode} wurde
                                                                        eingelöst</p>
                                                                </div>
                                                            </Animated>
                                                        </div>
                                                        :
                                                        <div className="price col-xs-12">
                                                            <p className="title">Ihr Preis</p>
                                                            <p className={price.oldPrice > 0 ? 'oldPrice value' : 'value'}>
                                                                {price.oldPrice > 0 ? price.oldPrice : price.price} {window.currencyValue}
                                                            </p>
                                                            {price.oldPrice > 0 && !userAnswers.Model[0].discountPrice > 0 &&
                                                            <Animated animationIn="bounceIn" animationInDelay={1000}>
                                                                <div>
                                                                    <p className='value'>
                                                                        {price.price} {window.currencyValue}
                                                                    </p>
                                                                    {coupon.isCoupon && <p className="couponInfo"><span
                                                                        className="circleOk"/>Gutschein {coupon.couponShortcode} wurde
                                                                        eingelöst</p>}
                                                                </div>
                                                            </Animated>
                                                            }
                                                            {userAnswers.Model[0].discountPrice > 0 &&
                                                            <div>
                                                                <p className='value'>
                                                                    {price.price} {window.currencyValue}
                                                                </p>
                                                                {coupon.isCoupon && <p className="couponInfo"><span
                                                                    className="circleOk"/>Gutschein {coupon.couponShortcode} wurde
                                                                    eingelöst</p>}
                                                            </div>
                                                            }

                                                            {showAddCoupon &&
                                                            <div className="couponField">
                                                                <input type="checkbox" id="coupon"/>
                                                                <label htmlFor="coupon">+ Gutscheincode hinzufügen</label>
                                                                <input type="text"
                                                                       className={coupon.couponError ? 'errorInput' : ''}
                                                                       name="coupon"
                                                                       placeholder="Gutschein einlösen"
                                                                       onChange={this.changeCoupon}/>
                                                                {coupon.couponError &&
                                                                <span className="errorText">{coupon.couponError}</span>}
                                                            </div>
                                                            }
                                                        </div>
                                                }

                                                {!window.isMobile && <SendLinks user={user} id="form"/>}
                                            </div>
                                            <div className="col-sm-8">
                                                {errors.general && <p className="errorInfo">{errors.general}</p>}

                                                {(!user.isLogin && window.isMobile) && <form name="loginFormMobile" className="loginFormMobile" onSubmit={this.loginFormMobile}>
                                                    {showLoginForm && <div>
                                                        <input type='email' name="login" required placeholder="E-Mail"/><br/>
                                                        <input type="text" name="password" required placeholder="Passwort"/>
                                                    </div>}
                                                    {defineTypeElem > 0 ?
                                                        <button type="submit"
                                                                className="btn"
                                                                onSubmit={this.loginFormMobile}>
                                                            Einloggen
                                                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                                        </button> : <span className="btn" onClick={this.showLoginForm.bind(this)}>
                                                            Einloggen
                                                            <span>
                                                                <i className="fa fa-long-arrow-right" aria-hidden="true"/>
                                                            </span>
                                                        </span>
                                                    }
                                                </form>}
                                                <form action="#" name="basketForm" onChange={this.changeForm}
                                                      onKeyPress={this.cancelSendByEnter.bind(this)}
                                                      onSubmit={this.send}>
                                                    <div className="basketWrap">
                                                        <ShowResultsPersonalData country={country}
                                                                                 basketDataVerkaufen={this.props.basket.basketDataVerkaufen}
                                                                                 uidNumberField={uidNumberField}
                                                                                 handlerChangeInput={this.handlerChangeInput}
                                                                                 price={price.price}
                                                                                 cancelRedirect={this.props.userActions.cancelRedirectToMyAccount}
                                                                                 user={this.props.user}
                                                                                 error={errors}
                                                                                 inputCheckbox={inputCheckbox}
                                                                                 changeCountry={this.changeCountry}
                                                                                 changeCheckbox={this.changeCheckbox}/>
                                                    </div>
                                                    <span className="agree">
                                                                            <label>
                                                                                <input type="checkbox"
                                                                                       name="agree"
                                                                                       required
                                                                                       onChange={this.changeCheckbox}/>
                                                                                <span className="checkbox"/>
                                                                            </label>
                                                                            <span>Ich habe die <a
                                                                                href="/ueber-uns/agb" target="_blank">AGB</a> und die <a
                                                                                href="/ueber-uns/datenschutzerklaerung"
                                                                                target="_blank">Datenschutzerklärung</a> gelesen und akzeptiere diese</span>

                                                                        </span>
                                                    <div className="text-right buttons">
                                                        <button type='submit'
                                                                className="btn pulsing"
                                                                onSubmit={this.send}>
                                                            Abschliessen<span><i className="fa fa-long-arrow-right"
                                                                                 aria-hidden="true"/></span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    <div role="tabpanel" className="tab-pane howItWorks" id="instructions">
                                        <div className="clearfix periods">
                                            <div className="col-sm-4 text-center itemPeriod">
                                                <div className="image">
                                                    <div className="num"><img src="/images/design/1.svg" alt="ds"/>
                                                    </div>
                                                    <img src="/images/design/estimate-icon.svg" alt=""/>
                                                </div>
                                                <h4>Gerät zurücksetzen</h4>
                                                <p>Löschen Sie alle Daten auf Ihrem Gerät indem Sie es auf die
                                                    Werkseinstellungen zurücksetzen</p>
                                            </div>
                                            <div className="col-sm-4 text-center itemPeriod">
                                                <div className="image">
                                                    <div className="num"><img src="/images/design/2.svg" alt=""/></div>
                                                    <img src="/images/design/send-icon.svg" alt=""/>
                                                </div>
                                                <h4>Gerät einsenden</h4>
                                                <p>Senden Sie Ihr Gerät <strong>kostenlos</strong> mit dem
                                                    vorfrankierten Versandlabel per Post zu.</p>
                                            </div>
                                            <div className="col-sm-4 text-center itemPeriod">
                                                <div className="image">
                                                    <div className="num"><img src="/images/design/3.svg" alt=""/></div>
                                                    <img src="/images/design/get-icon.svg" alt=""/>
                                                </div>
                                                <h4>Zahlung erhalten</h4>
                                                <p>Nach Prüfung Ihres Gerätes wird der
                                                    Betrag <strong>Express</strong> ausbezahlt.</p>
                                            </div>
                                        </div>
                                        <div className="row text-center">
                                            <a href={`//${window.location.host}/${this.state.pdfUrl}`}
                                               target="_blank"
                                               className="estimatePrice btn"> Herunterladen und ausdrucken
                                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttonsForMobile">
                    {/*<button className="btn summary"
                            data-name="summary"
                            onClick={ this.handleClickMobileBtn}>
                        Weiter</button>*/}
                    <button type='button'
                            data-name="form"
                            className="btn sendForm"
                            onClick={this.handleClickMobileBtn}>
                        Abschliessen
                    </button>
                    <a href={`//${window.location.host}/${this.state.pdfUrl}`}
                       target="_blank"
                       className="estimatePrice btn"> Herunterladen und ausdrucken</a>
                </div>
            </div>
        )
    }
}


ShowResults.propTypes = {}
ShowResults.defaultProps = {}

function mapStateToProps (state) {
    return {
        basket: state.basket,
        user: state.user,
        places: state.places.currentLocation,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(ShowResults)
