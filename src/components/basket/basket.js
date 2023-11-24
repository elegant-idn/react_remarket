import axios from 'axios'
import _debounce from 'lodash/debounce'
import React, { Fragment, PureComponent } from 'react'
import { FullStoryAPI } from 'react-fullstory'
import ipify from 'react-native-ipify'
import { connect } from 'react-redux'
import {browserHistory, Link} from 'react-router'
import { withUserAgent } from "react-useragent"
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import * as userActions from '../../actions/user'
import { ACCESSORIES_ID } from '../../constants/accessories'
import { pushKlavioIdentify, _getPersonalDataFields, _googleAutocomplete, _setPersonalDataFields } from '../../helpers/helpersFunction'
import ListSimilarItems from '../detailModelPage/listSimilarItems'
import AutoloadPersonalData from './autoloadPersonalData'
import PersonalData from './personalData'
import ProductOverview from './productOverview'
import Shipping from './shipping'
import Payment from './payment'

const defaultValidateError = {
    gender: {
        error: false,
        msg: ""
    },
    companyName: {
        error: false,
        msg: ""
    },
    firstname: {
        error: false,
        msg: ""
    },
    lastname: {
        error: false,
        msg: ""
    },
    email: {
        error: false,
        msg: ""
    },
    phone: {
        error: false,
        msg: ""
    },    
    street: {
        error: false,
        msg: ""
    },
    number: {
        error: false,
        msg: ""
    },
    zip: {
        error: false,
        msg: ""
    },
    city: {
        error: false,
        msg: ""
    },
    customer_gender: {
        error: false,
        msg: ""
    },
    customer_companyName: {
        error: false,
        msg: ""
    },
    customer_firstname: {
        error: false,
        msg: ""
    },
    customer_lastname: {
        error: false,
        msg: ""
    },
    customer_email: {
        error: false,
        msg: ""
    },
    customer_phone: {
        error: false,
        msg: ""
    },    
    customer_street: {
        error: false,
        msg: ""
    },
    customer_number: {
        error: false,
        msg: ""
    },
    customer_zip: {
        error: false,
        msg: ""
    },
    customer_city: {
        error: false,
        msg: ""
    },
    company: {
        error: false,
        msg: ""
    }
}

export class Basket extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            choiceShipping: false,
            isRemarketingCampaign: false,
            deadline: process.env.MIX_IS_BUY_COUPON || this.props.location.query.coupon,
            isVorauskasse: this.props.location.query.vorauskasse,
            deadlineIsActive: false,
            deadlineExpired: false,
            credits: {
                totalCredits: 0,
                currentValue: null,
                errorCredits: ''
            },
            checkedPayByCredits: false,
            subject: 0,
            tax: 0,
            taxOnlyForVat: 0,
            taxValue: null,
            total: 0,
            shippingMethods: [],
            country: {
                countriesList: [],
                currentCountry:{
                    inputCountry: "CH",
                    customer_inputCountry: "CH"
                }
            },
            domain: null,
            inputCheckbox: {
                shippingAddress: true,
                company: false,
                customerCompanyName: false,
                asGuest: true,
                agree: false
            },
            couponError: null,
            payMethod: {
                method: null,
                paymethoddatatrans: null,
                paymethodpayrexx: null,
            },
            autoloadPersonalData: {
                element: null,
                data: null
            },
            payForm: null,
            errorPay: null,
            errorNoProducts: null,
            errors: {
                password: '',
                info: '',
                general: ''
            },
            similarItems: [],
            showTabs: {
                paymentMethod: true,
                personalData: false,
                shippingMethod: false
            },
            noteShow: false,
            noteShow1: false,
            noteShow2: false,
            infoRatings:{
                total: 0,
                average: 0,
                statistics: [
                    {stars: 5, count: 0},
                    {stars: 4, count: 0},
                    {stars: 3, count: 0},
                    {stars: 2, count: 0},
                    {stars: 1, count: 0},
                ]
            },
            rateData: [],
            uniqueSessionId: 'REMARKET_SCRIPT_ISSUE',
            userIP: '127.0.0.1',
            userCountryCode3: "CHE",
            userDOB: '',
            userDOB1: '',
  	        insuranceChAmount: 0,
            dataTransSign: '180103170812117471',
            dataTransMerchantId: '3000012768',
            dataTransSignSandbox: '160613112229164683',
            dataTransMerchantIdSandbox: '1100006526',
            payMethodError: {
                status: false,
                msg: ''
            },
            validateError: defaultValidateError,
            isValidate: false
        }
        this.sendForm = this.sendForm.bind(this)
        this._getPrice = this._getPrice.bind(this)
        this._showHideBlocks = this._showHideBlocks.bind(this)
        this._goToDelivery = this._goToDelivery.bind(this)
        this.handleRemoveFromBasket = this.handleRemoveFromBasket.bind(this)
        this.addCreditsToBasket = this.addCreditsToBasket.bind(this)
        this.addInsuranceToBasket = this.addInsuranceToBasket.bind(this)
        this.addInsuranceToBasketCh = this.addInsuranceToBasketCh.bind(this)
        this.chooseShippingMethod = this.chooseShippingMethod.bind(this)
        this.choosePayMethod = this.choosePayMethod.bind(this)
        this.choosePersonalData = this.choosePersonalData.bind(this)
        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.changeCountry = this.changeCountry.bind(this)
        this.changeCoupon = this.changeCoupon.bind(this)
        this.triggerChangeCoupon = this.triggerChangeCoupon.bind(this)
        this.changeNameField = this.changeNameField.bind(this)
        this.changeCreditsInput = this.changeCreditsInput.bind(this)
        this.nextTab = this.nextTab.bind(this)
        this.goToPaymentMobile = this.goToPaymentMobile.bind(this)
        this._gtag_report_conversion = this._gtag_report_conversion.bind(this)
        this.updateCountDown = this.updateCountDown.bind(this)
        this.activateCountDownCoupon = this.activateCountDownCoupon.bind(this)
        this.onNoteToggle = this.onNoteToggle.bind(this)
        this.dobChange = this.dobChange.bind(this)
        this.dobChange1 = this.dobChange1.bind(this)
        this.insuranceChAmountChange = this.insuranceChAmountChange.bind(this)
        this.goTab = this.goTab.bind(this)
        this.validateForm = this.validateForm.bind(this)
        this.validateCheck = this.validateCheck.bind(this)        
        this.validateEmail = this.validateEmail.bind(this)
        this.validatePhoneNumber = this.validatePhoneNumber.bind(this)
        this.validateNumeric = this.validateNumeric.bind(this)        
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            let inputs = document.querySelectorAll('.personalData input')
            inputs.forEach( item => {
                item.value = ""
                item.checked = false
            })
            let { inputCheckbox } = this.state
            inputCheckbox.company = false
            this.setState({ inputCheckbox })

            //delete credits from basket
            let newBasketData = this.props.basketData.filter( item => item.productTypeId != 100 && item.productTypeId != 999)
            this.props.basketActions.changeBasketData(newBasketData)
        }
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === true){
            axios.get(`/api/getTotalCredits`)
                .then(({ data }) => {
                    this.setState({ credits:{ ...this.state.credits, totalCredits: data.credits } }, () => {
                        this._getPrice(this.props.basketData, this.state.taxValue)
                    })
                })
                .catch( error => {
                })
            this.setState({errors: {...this.state.errors, info: ''}})
        }
        if( nextProps.user.data !== this.props.user.data && nextProps.user.data){
            window.localStorage.removeItem("userDataVerkaufen")
            window.localStorage.removeItem("userData")
            _setPersonalDataFields.call(this, nextProps.user.data)
        }
        if(this.props.basketData.length !== nextProps.basketData.length) {
            this._getPrice(nextProps.basketData, this.state.taxValue)
            if(window.isGoogleConnection) {
                this._gtag_snippet(nextProps.basketData)
            }
        }
    }
    componentDidUpdate(prevProps){
        let prevBasket = prevProps.basketData.filter( item => item.productTypeId != 11),
            currentBasket = this.props.basketData.filter( item => item.productTypeId != 11)
        if(document.forms.basketForm && prevBasket.length === 0 && currentBasket.length === 1){
            //!window.isMobile && this._showHideBlocks()
            if(this.props.user.isLogin && this.props.user.data){
                _setPersonalDataFields.call(this, this.props.user.data)
            }
            else{
                let personalData = JSON.parse(window.localStorage.getItem('userData'))
                if(personalData) _setPersonalDataFields.call(this, personalData)
            }
            this.setState({ showTabs: {...this.state.showTabs,
                    paymentMethod: true,
                    personalData: false,
                    shippingMethod: false,
                }
            })
        }
    }
    componentWillMount(){
        if(window.localStorage.getItem('paymentFailedTryAgain')){
            this.setState({ showTabs: {...this.state.showTabs,
                    paymentMethod: true,
                    personalData: false,
                    shippingMethod: false,
                }
            })
        }

        this.inputCouponCallback = _debounce(function (e)
        {
              var couponType = 7;
              if(e.target.value.toUpperCase() == 'CASE43') { couponType = 3; }
              else if(e.target.value.toUpperCase() == 'TEMP43') { couponType = 10; }

              let email = document.forms.basketForm.email.value,
              {shippingAddress} = this.state.inputCheckbox
              axios.get(`/api/checkCoupon?coupon=${e.target.value.toUpperCase()}&email=${email}&shippingAddress=${shippingAddress}&couponType=${couponType}`)
                .then((data) => {
                    if(couponType == 3 || couponType == 10)
                    {
                      var foundProductID = 99999;
                      var cheapestPrice = 99999;

                      for (var i = 0; i < this.props.basketData.length; i++)
        		          {
                        if(this.props.basketData[i].productTypeId == couponType)
                        {
                          if(this.props.basketData[i].price < cheapestPrice)
                          {
                            cheapestPrice = this.props.basketData[i].price;
                            foundProductID = i;
                          }
                        }
                      }

                      if(foundProductID != 99999)
                      {
                        data.data.price = this.props.basketData[foundProductID].price;
                      }
                    }
                    else
                    {
                      if(!this.props.basketData.some(item => item.productTypeId == 7)){
                          throw new Error('Dieses Gutscheincode ist leider nicht für diese Produktkategorie gültig');
                      }
                      if(this.state.subject < data.data.minSellpriceValue){
                         throw new Error('Dieser Gutschein ist erst ab einem Gerätebestelltwert von ' + data.data.minSellpriceValue + ' CHF möglich');
                      }
                      if(data.data.newDeviceValid == '0' && this.props.basketData.some(item => item.productTypeId == 7)
                      && (this.props.basketData.some(item => item.conditionId == 1) || this.props.basketData.some(item => item.conditionId == 2))) {
                          throw new Error('Dieser Gutschein ist nur für gebrauchte Geräte gültig');
                      }
                    }
                    if(!this.props.basketData.some( item => item.productTypeId == 999 )) {
                        let newBasketData = [...this.props.basketData, data.data]
                        this.props.basketActions.changeBasketData(newBasketData)
                        this._getPrice(newBasketData, this.state.taxValue)
                        e.target.value = ''
                    }
                    else
                    {
                        throw new Error('Gutschein wurde bereits benutzt oder es wurde schon ein Gutschein angewendet');
                    }
                })
                .catch(error => {
                    let data = error.response ? error.response.data : error.message
                    this.setState({couponError: data})
                })
        }, 1000);

        this.inputNameCallback = _debounce(function (e) {
            let formType = e.target.name.indexOf('customer') < 0 ? 'shippingAddress' : 'billingAddress'
            axios.get(`/api/autoloadAgileData?search=${e.target.value}&fieldName=${e.target.name}`)
                .then(({data}) => {
                    if (data.length > 0) {
                        this.setState({
                            autoloadPersonalData: {
                                ...this.state.autoloadPersonalData,
                                element: < AutoloadPersonalData data={data}
                                                                formType={formType}
                                                                choosePersonalData={this.choosePersonalData}/>,
                                data
                            }
                        })
                    }
                    else {
                        this.setState({
                            autoloadPersonalData: {
                                ...this.state.autoloadPersonalData,
                                element: null,
                                data
                            }
                        })
                    }

                })
                .catch(error => {

                })
        }, 500); //autoload user data
        this.getShippingMethods("Normal")
        //if user login get credits
        if(this.props.user.isLogin){
            axios.get(`/api/getTotalCredits`)
                .then(({ data }) => {
                    this.setState({ credits:{ ...this.state.credits, totalCredits: data.credits } }, () => {
                        this._getPrice(this.props.basketData, this.state.taxValue)
                    })
                })
                .catch( error => {
                })
        }

        //connect datatrans lib
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://pay.datatrans.com/upp/payment/js/datatrans-2.0.0.js";
            // js.src = "https://pay.sandbox.datatrans.com/upp/payment/js/datatrans-1.0.2.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'datatrans'));

        /*
        var uniqueSessionId = '';
        if(window.localStorage.hasOwnProperty("unique_session_id")) {
          uniqueSessionId = window.localStorage.getItem("unique_session_id");
        }
        else {
          uniqueSessionId = Math.floor((Math.random()*100000000) + 100000000).toString();
          window.localStorage.setItem('unique_session_id', uniqueSessionId);
        }
        this.setState({ uniqueSessionId: uniqueSessionId })

        var script = document.createElement('script');
        script.src = "https://h.online-metrix.net/fp/tags.js?org_id=lq866c5i&session_id="+uniqueSessionId+"&pageid=PAGEID";
        document.getElementsByTagName('head')[0].appendChild(script);

        document.getElementById('unique_session_id').innerHTML = '<iframe style="width: 100px; height: 100px; border: 0; position: absolute; top: -5000px;" src="https://h.online-metrix.net/tags?org_id=ORG_ID&session_id='+uniqueSessionId+'&pageid=PAGEID"></iframe>';
        */

        ipify().then(ip => {
        	this.setState({ userIP: ip });
        });

        //connect Bitcoin
        /*(function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://bitpay.com/bitpay.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'bitcoin'));*/

        var isRemarketingCampaign = this.props.location.query.coupon;
        var deadline = JSON.parse(window.localStorage.getItem('deadline'));
        if(process.env.MIX_IS_BUY_COUPON || isRemarketingCampaign || (deadline && deadline.isRemarketingCampaign)){
            this.setState({deadline: true})
            if(deadline && isRemarketingCampaign){
                this.setState({ isRemarketingCampaign: true })
                deadline.isRemarketingCampaign = true;
                window.localStorage.setItem('deadline', JSON.stringify(deadline));
            }
            else if (!deadline && isRemarketingCampaign) {
                var countDownDate = new Date();
                countDownDate.setHours(countDownDate.getHours() + 3);
                deadline = {countDownDate: countDownDate, isActive: 0, deadlineExpired: 0, couponShortcode: '', isRemarketingCampaign: true};
                window.localStorage.setItem('deadline', JSON.stringify(deadline));
            }
            if(deadline && deadline.isActive){
                this.setState({ deadlineIsActive: true })
            }
            if(deadline && deadline.deadlineExpired){
                this.setState({ deadlineExpired: true })
            }
            if(deadline && deadline.couponShortcode && deadline.isActive) {
                if(!this.props.basketData.find(item=>item.shortcode == deadline.couponShortcode)){
                    let otherCoupon = this.props.basketData.find(item=>item.productTypeId == 999);
                    if(otherCoupon){
                        this.handleRemoveFromBasket(999, otherCoupon.shortcode);
                    }
                    this.setState({couponError: null})
                    this.inputCouponCallback({'target': {'value': deadline.couponShortcode}})
                }
            }
        }
        else if(!(deadline && deadline.isRemarketingCampaign)) {
            let basketData = this.props.basketData,
                newBasketData = basketData.filter( (item) => !(item.productTypeId == 999 && item.note == "Limitierter Gutschein"));
            this.props.basketActions.changeBasketData(newBasketData)
            this._getPrice(newBasketData, this.state.taxValue)
        }
    }
    loadStripe(onload){
        if(! window.StripeCheckout) {
            const script = document.createElement('script');
            script.onload = function () {
                onload();
            };
            script.src = 'https://checkout.stripe.com/checkout.js';
            document.head.appendChild(script);
        } else {
            onload();
        }
    }
    componentDidMount(){
        let basketShortcode = window.localStorage.getItem('basketShortcode');
        let { inputCheckbox } = this.state
        if(basketShortcode){
            window.localStorage.removeItem('basketShortcode')
            // axios.get(`/api/basket/failed?basketShortcode=${basketShortcode}`)
            //     .then( result => {
            //         window.localStorage.removeItem('basketShortcode')
            //     })
            //     .catch( error => {
            //     });
        }
        if(this.props.user.isLogin && this.props.basketData.length > 0 && this.props.user.data){
            _setPersonalDataFields.call(this, this.props.user.data)
        }
        else{
            let personalData = JSON.parse(window.localStorage.getItem('userData'))
            if(typeof personalData != 'undefined' && personalData && Object.keys(personalData).length !== 0 && this.props.basketData.length > 0)  {
                _setPersonalDataFields.call(this, personalData)
                inputCheckbox.company = personalData.shippingAddress.company
                inputCheckbox.customerCompanyName = personalData.billingAddress.customerCompanyName
                inputCheckbox.shippingAddress = personalData.usingShippingAddress
                this.setState({ inputCheckbox })
            }

        }
        /*
        axios.get('/api/countries')
            .then(( { data }) => {
                let countriesList = data.data.map( item => { return { value: item['name-short'], label: item['name-de']}})
                this.setState({country: {...this.state.country, countriesList}, domain: data.meta.domainId})
                if(window.isGoogleConnection) {
                    _googleAutocomplete.call(this, data.meta.domainId, 'userData')
                }
            })
        */
        
        let remarketDomainId = 2
        let countriesList = [
            {value: 'ch', label: 'Schweiz'},
            {value: 'li', label: 'Liechtenstein'},
        ]
        this.setState({country: {...this.state.country, countriesList}, domain: remarketDomainId})
        if(window.isGoogleConnection) {
            _googleAutocomplete.call(this, remarketDomainId, 'userData')
        }
        axios.post(`/api/similarItems`, {basketData: this.props.basketData})
            .then( data => {
                this.setState({similarItems: data.data})
            })
            .catch( () => false )

        this._getPrice(this.props.basketData, this.state.taxValue)
        if(window.isGoogleConnection) {
            this._gtag_snippet(this.props.basketData)
        }
        if(window.localStorage.getItem('paymentFailedTryAgain')){
            let customerShortcode = window.localStorage.getItem('customerShortcode')
            window.localStorage.removeItem('paymentFailedTryAgain')
            window.localStorage.removeItem('customerShortcode')
            if(!window.isMobile ){
                $('.paymentMethod h3.title').click()
                $('.shippingMethod h3.title, .personalData h3.title').addClass('answering')
                $(".basketSubmit.hideBtn").show()
                this.setState({
                                ifErrorPayment: true,
                                customerShortcode
                })
            }
            else{
                $('.productWrap, .personalData').hide()
                $('#accordion, .shippingMethod .wrapperItemBasket').show()
                this.goToPaymentMobile(true)
                this.setState({ ifErrorPayment: true, customerShortcode })
            }
        }

        let deadline = JSON.parse(window.localStorage.getItem('deadline'));

        if (process.env.MIX_IS_BUY_COUPON || (deadline && deadline.isRemarketingCampaign)) {
            if (!document.getElementById("numeric-timer")) {
                setTimeout(() => {
                    this.setState({deadline: false})
                    this.updateCountDown()
                }, 1000)
            } else {
                this.setState({deadline: false})
                this.updateCountDown()
            }
            // Update the count down every 1 min
            this.countdown = setInterval(() => {
                this.setState({deadline: false})
                this.updateCountDown()
            }, 60000);
        } else {
            window.localStorage.removeItem("deadline")
        }
        if(window.localStorage.hasOwnProperty("coupon"))
        {
            axios.get(`/api/checkCoupon?coupon=${window.localStorage.getItem("coupon")}&couponType=7`)
              .then((data) => {
                  if(!this.props.basketData.some( item => item.productTypeId == 999 )) {
                      let newBasketData = [...this.props.basketData, data.data]
                      this.props.basketActions.changeBasketData(newBasketData)
                      this._getPrice(newBasketData, this.state.taxValue)
                  }
              })
              .catch(error => {})
        }
        this._loadRatingData();

        var diffX = 0;
        var startX = 0;
        var lastChange = 0;
        var topButtonsCarousel = document.getElementById("topButtonsCarousel");
        if(typeof topButtonsCarousel !== 'undefined' && topButtonsCarousel != null){
            topButtonsCarousel.addEventListener('touchstart', function(e){
              startX = e.changedTouches[0].pageX;
            });
            topButtonsCarousel.addEventListener('touchmove', function(e){
              diffX = lastChange + (e.changedTouches[0].pageX - startX);
              if(diffX > 0) { diffX = 0; }
              else if(diffX < -750) { diffX = -750; }
              topButtonsCarousel.style.transform = "translate("+diffX+"px,0px)";
            });
            topButtonsCarousel.addEventListener('touchend', function(e){
              lastChange = diffX;
            });
        }
        this.props.basketData.forEach( item => {            
            if(item.productTypeId == 500 && typeof item.shortcode !== 'undefined' && (item.shortcode === 'IDK3VU' || item.shortcode === '8JXTVN')){
                this.setState({ insuranceChAmount: item.price})
            }
        })
    }
    componentWillUnmount(){
        if(!this.props.user.isLogin){
            let personalData = _getPersonalDataFields()
            window.localStorage.setItem('userData', JSON.stringify(personalData))
        }
        document.getElementById('datatrans').remove()
        if(this.stripeHandler) this.stripeHandler.close()
        clearInterval(this.countdown);
    }
    _loadRatingData = () => {
        axios.get(`/api/getRatings?page=1&&sort=highest`)
            .then( result => {
                this.setState({
                    infoRatings: result.data.info,
                    rateData: result.data.items }
                    )
            })
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

        if(numericTimer){
            numericTimer.innerHTML = hours + "Std. " + minutes + "Min. verbleiben"
        }

        // If the count down is finished
        if (distance < 0) {
            deadline.deadlineExpired = 1;
            window.localStorage.setItem('deadline', JSON.stringify(deadline));
            clearInterval(this.countdown);
            this.setState({ deadlineExpired: true });
        }
    }
    activateCountDownCoupon(){
        let deadline = JSON.parse(window.localStorage.getItem('deadline'));
        if(deadline){
            deadline.isActive = 1;
            this.setState({ deadlineIsActive: true })
            window.localStorage.setItem('deadline', JSON.stringify(deadline));
            if(!deadline.couponShortcode) {
                axios.get(`/api/generateCountDownCoupon`)
                    .then( result => {
                        deadline.couponShortcode = result.data.shortcode;
                        window.localStorage.setItem('deadline', JSON.stringify(deadline));
                        if(!this.props.basketData.find(item=>item.shortcode == deadline.couponShortcode)){
                            let otherCoupon = this.props.basketData.find(item=>item.productTypeId == 999);
                            if(otherCoupon){
                                this.handleRemoveFromBasket(999, otherCoupon.shortcode);
                            }
                            this.setState({couponError: null})
                            this.inputCouponCallback({'target': {'value': deadline.couponShortcode}})
                        }
                    })
                    .catch( error => {
                        console.log('error', error.response.data);
                    })
            }
            else {
                if(!this.props.basketData.find(item=>item.shortcode == deadline.couponShortcode)){
                    let otherCoupon = this.props.basketData.find(item=>item.productTypeId == 999);
                    if(otherCoupon){
                        this.handleRemoveFromBasket(999, otherCoupon.shortcode);
                    }
                    this.setState({couponError: null})
                    this.inputCouponCallback({'target': {'value': deadline.couponShortcode}})
                }
            }
        }
    }
    _gtag_report_conversion(value, url){
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-827036726/Mt4fCLj803sQtqiuigM',
            'value': value,
            'currency': 'CHF',
            'transaction_id': '',
            'event_callback': callback
        });
        return false;
    }
    _gtag_snippet(basketData){
        let prodIds = [],
            totalValue = 0

        basketData.forEach( item => {
            if(item.productTypeId == 7){
                prodIds.push(item.shortcode)
                totalValue += +item.discountPrice || +item.price
            }
        })
        gtag('event', 'page_view', {
            'send_to': 'AW-827036726',
            'ecomm_prodid': prodIds,
            'ecomm_pagetype': 'cart',
            'ecomm_totalvalue': totalValue,
            'ecomm_category': 'Electronics'
        })
    }
    _showHideBlocks(e){
        let step = e.currentTarget.getAttribute('data-step'),
            showTabs = { ...this.state.showTabs }
        //    hide personalData section only after fill all required fields
        if(showTabs[step] || showTabs.personalData || showTabs.shippingMethod) {
            if($(e.currentTarget).parent().find('.wrapperItemBasket').css('display') === 'none'){
                $('.wrapperItemBasket').each( function () {
                    $(this).hide('slow')
                    // $(this).parent().css({ paddingBottom: '28px' })
                    $(this).parent().find('.title i.fa').removeClass('fa-angle-up').addClass('fa-angle-down')
                })
                $(e.currentTarget).parent().find('.wrapperItemBasket').toggle('slow')
                $(e.currentTarget).parent().css({ paddingBottom: '44px' })

                $(e.currentTarget).parent().find('.title i.fa').removeClass('fa-angle-down').addClass('fa-angle-up')
            }
            showTabs.personalData = !!(step === 'personalData')
            showTabs.shippingMethod = !!(step === 'shippingMethod')
            showTabs.paymentMethod = !!(step === 'paymentMethod')
            this.setState({ showTabs })
        }

    }
    _getPrice(data, taxValue){
        let subject = 0,
            total, tax,
            creditsCount = 0,
            taxOnlyForVat = 0,
            totalOnlyForVat = 0,
            currentValue = this.state.credits.currentValue,
            basketHasCreditItem = data.some( item => item.productTypeId == 100)
        data.forEach( item => {
            if (item.productTypeId != 500) {
                if(item.productTypeId == 100 || item.productTypeId == 999) creditsCount += +item.price
                else {
                    subject += item.discountPrice ? +item.discountPrice : +item.price
                    if(item.euVatApplicable) totalOnlyForVat += item.price
                }
            }
        })
        total = (subject) - creditsCount
        tax = (total/(1 + (taxValue/100))) * (taxValue/100)
        taxOnlyForVat = (totalOnlyForVat/(1 + (taxValue/100))) * (taxValue/100)
        if(!this.state.credits.currentValue || !basketHasCreditItem) {
            currentValue = this.state.credits.totalCredits > total ? total : this.state.credits.totalCredits
        }
        if(basketHasCreditItem){
            data.forEach( item => {
                if(item.productTypeId == 100) currentValue = item.price
            })
        }
        this.setState({ subject, total, tax, taxOnlyForVat,
                        checkedPayByCredits: basketHasCreditItem,
                        credits: {...this.state.credits, currentValue}
        })
    }
    _goToDelivery(){
        let { total,payMethod } = this.state        
        if([...document.querySelectorAll('.paymentMethod input[type="radio"][required]')].some( item => item.checked)){
            this.setState({ payMethodError: {
                status: false,
                msg: ''
            } })
            if (payMethod.method === 'Payrexx' && (parseFloat(total) < 50 || parseFloat(total) > 999)) {
                this.setState({ payMethodError: {
                    status: true,
                    msg: 'Die Zahlung per Rechnung mit Bobfinance ist ab 50.00 CHF und bis maximal 1000.00 CHF möglich'
                }})
            } else {
                this.props.goToDelivery()
            }            
        } else {
            this.setState({ payMethodError: {
                status: true,
                msg: 'Bitte Zahlungsart auswählen'
            } })
        }
    }
    goToPaymentMobile(fromError){        
        this.props.goToPayment(fromError)
        this.setState({ showTabs: {...this.state.showTabs, personalData: false, shippingMethod: false, paymentMethod: true } })
    }
    goTab(e, tabName){
        let { total, payMethod } = this.state
        this.setState({ payMethodError: {
            status: false,
            msg: ''
        }})
        this.setState({ validateError: defaultValidateError})

        if (this.props.basketStep === tabName)
            return
        e.preventDefault()
        if (tabName == 'paymentMethod') {
            this.props.goToMethod()
        } else if (tabName == 'personalData') {
            this._goToDelivery()
        } else if (tabName == 'shippingMethod') {
            if([...document.querySelectorAll('.paymentMethod input[type="radio"][required]')].some( item => item.checked)){
                this.setState({ payMethodError: {
                    status: false,
                    msg: ''
                }})
                if (payMethod.method === 'Payrexx' && (parseFloat(total) < 50 || parseFloat(total) > 999)) {
                    this.setState({ payMethodError: {
                        status: true,
                        msg: 'Die Zahlung per Rechnung mit Bobfinance ist ab 50.00 CHF und bis maximal 1000.00 CHF möglich'
                    }})
                } else {
                    if (this.props.basketStep === 'paymentMethod') {
                        if (!this.validateForm()) {
                            this.setState({ payMethodError: {
                                status: true,
                                msg: 'Bitte Personalien ausfüllen'
                            }})            
                        } else {
                            this.goToPaymentMobile(false)
                        }
                    } else {
                        if (!this.validateForm()) {
                            return
                        }
                        this.goToPaymentMobile(false)
                    }                 
                }
            } else {
                this.setState({ payMethodError: {
                    status: true,
                    msg: 'Bitte Zahlungsart auswählen'
                } })
            }
        }
    }
    nextTab(){
        let { total, payMethod } = this.state
        this.props.basketData.map((el)=>{
            return snaptr('track', 'START_CHECKOUT',
                {
                    'shortcode or name': el.shortcode || el.name,
                })
        });

        if(window.isFBConnection) {
                fbq('track', 'InitiateCheckout',
                    { value: this.state.total, currency: window.currencyValue, }
                )// facebook pixel
        }
        let { showTabs } = this.state

        let coupon = this.props.basketData.find(item => item.productTypeId == 999),
            data = this.props.basketData.filter( item => ![11,100,999,500,501].includes(item.productTypeId)),
            items = data.map((item) => {
                let brands, brand, category;
                if (item.categoryName) {
                    brands = item.criterias.find(item => item.id === 'manufacturer').values,
                    brand = brands.length ? brands[0].name : "",
                    category = item.categoryName
                }
                else {
                    brand = item.deviceName,
                    category =  '';
                }
                return {
                    "id": item.shortcode,
                    "name": item.descriptionLong || item.model || '',
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "brand": brand,
                    "category": category,
                    "price": item.discountPrice || item.price,
                }
            });

        if( showTabs.paymentMethod){
            if([...document.querySelectorAll('.paymentMethod input[type="radio"][required]')].some( item => item.checked)){
                this.setState({ payMethodError: {
                    status: false,
                    msg: ''
                } })
                if (payMethod.method === 'Payrexx' && (parseFloat(total) < 50 || parseFloat(total) > 999)) {
                    this.setState({ payMethodError: {
                        status: true,
                        msg: 'Die Zahlung per Rechnung mit Bobfinance ist ab 50.00 CHF und bis maximal 1000.00 CHF möglich'
                    }})
                } else {
                    showTabs.personalData = true
                    showTabs.shippingMethod = false
                    showTabs.paymentMethod = false
                    this.setState({ showTabs })
                    $('.personalData h3.title').click()
                    $('.paymentMethod h3.title').addClass('answering')                        
                } 
            } else {
                this.setState({ payMethodError: {
                    status: true,
                    msg: 'Bitte Zahlungsart auswählen'
                } })
            }
        } else if( showTabs.personalData){
            let itemNames = [];
            let klavioItems = data.map((item) => {
                let url='';
                if(ACCESSORIES_ID.includes(item.productTypeId)){        // if item 'accessories' 3 = cases / 4 = accessories / 5 = software / 9 = spare parts / 10 = temperd glass
                let modelName = item.model ? item.model.split(" ").join('-').toLowerCase().replace(/\//g, '--') : 'model',
                    deviceName = item.deviceName ? item.deviceName.toLowerCase().replace(/ /g, '-') : 'device';
                    url = `/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`
                }
                else {
                    let modelName = item.model.replace(/ /g, '-').toLowerCase(),
                        color = item.color? item.color.toLowerCase() : 'color',
                        capacity = item.capacity? item.capacity.toLowerCase() : 'capacity',
                        deviceName = item.deviceName.replace(/ /g, '-').toLowerCase();
                    url = `/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${item.shortcode}`
                }
                let brands, brand, category;
                if (item.categoryName) {
                    brands = item.criterias.find(item => item.id === 'manufacturer').values;
                    brand = brands.length ? brands[0].name : "";
                    category = item.categoryName;
                }
                else {
                    brand = item.deviceName;
                    category =  '';
                }
                itemNames.push(item.descriptionLong || item.model);
                return {
                    "ProductID": item.shortcode,
                    "ProductName": item.descriptionLong || item.model || '',
                    "Quantity": 1,
                    "ProductBrand": brand,
                    "ProductURL": url,
                    "ImageURL": item.deviceImages ? item.deviceImages.mainImg.src : '',
                    "ProductCategories": [category],
                    "ItemPrice": item.discountPrice || item.price,
                }
            });
            pushKlavioIdentify();
            _learnq.push(["track", "Started Checkout", {
                "$event_id": this.props.total+Date.now(),
                "$value": this.props.total,
                "ItemNames": itemNames,
                "CheckoutURL": window.location.href,
                "Items": [ klavioItems ]
            }]);

            if(document.querySelector('input[name="shippingAddress"]').checked){
                if( [...document.querySelectorAll('.personalData input:not([type="radio"])[required]')].every( item => item.value.trim() !== '')
                    && [...document.querySelectorAll('.personalData .billingForm input[type="radio"][required]')].some( item => item.checked)
                    && $('input[name="inputCountry"]').length > 0
                ){
                    showTabs.personalData = false
                    showTabs.shippingMethod = true
                    showTabs.paymentMethod = false
                    this.setState({ showTabs })
                    $('.shippingMethod h3.title').click()
                    $('.personalData h3.title').addClass('answering');
                    $(".basketSubmit.hideBtn").show()
                    gtag('event', 'begin_checkout', {
                        "items": items,
                        "coupon": coupon ? coupon.shortcоde : "",
                    });
                    gtag('event', 'set_checkout_option', {
                        "checkout_step": 1,
                        "checkout_option": "personal data",
                    });
                }
                else $(".basketSubmit").click()
            }
            else{
                if( [...document.querySelectorAll('.personalData input:not([type="radio"])[required]')].every( item => item.value.trim() !== '')
                    && [...document.querySelectorAll('.personalData .shippingForm input[type="radio"][required]')].some( item => item.checked)
                    && [...document.querySelectorAll('.personalData .billingForm input[type="radio"][required]')].some( item => item.checked)
                ){
                    showTabs.personalData = false
                    showTabs.shippingMethod = true
                    showTabs.paymentMethod = false
                    this.setState({ showTabs })
                    $('.shippingMethod h3.title').click()
                    $('.personalData h3.title').addClass('answering')
                    $(".basketSubmit.hideBtn").show()

                    gtag('event', 'begin_checkout', {
                        "items": items,
                        "coupon": coupon ? coupon.shortcоde : "",
                    });
                    gtag('event', 'set_checkout_option', {
                        "checkout_step": 1,
                        "checkout_option": "personal data",
                    });

                }
                else $(".basketSubmit").click()
            }
        }
        else if( showTabs.shippingMethod){
            if([...document.querySelectorAll('.shippingMethod input[type="radio"][required]')].some( item => item.checked)){
                showTabs.personalData = false
                showTabs.shippingMethod = false
                showTabs.paymentMethod = true
                this.setState({ showTabs })
                if(this.state.total !== 0) $('.paymentMethod h3.title').click()
                $('.shippingMethod h3.title').addClass('answering')

                gtag('event', 'set_checkout_option', {
                    "checkout_step": 2,
                    "checkout_option": "shipping method",
                    "value": [...document.querySelectorAll('.shippingMethod input[type="radio"][required]')].find( item => item.checked).value
                });
            }
            else $(".basketSubmit").click()

        }
        this.setState({ showTabs })
    }
    changeCoupon(e){
        this.setState({couponError: null})
        e.persist()
        this.inputCouponCallback(e)
    }
    getShippingMethods(paymentType){
        axios.get('/api/shippingMethods')
        .then((data) => {
            let defaultMethod = null,
                { basketData } = this.props,
                newBasketData = [],
                showPickasShippingMethod = true,
                shippingMethods = data.data.shippingMethods.filter(item => item != pickasShippingMethod)
            const pickasShippingMethod = shippingMethods.find( item => item.shortcode === 'PICKAS' ) //'get in location' shipping method
            if(basketData.find(item => ACCESSORIES_ID.includes(item.productTypeId))) { // if in basket isset accessories - don't show 'get in location' shipping method
                showPickasShippingMethod = false;
            }

            const deviceBasketItems = basketData.filter(item => (item.productTypeId == 7))

            if(deviceBasketItems.length > 1) { //  if in basket  more than one devise-model and they are from different locations - don't show 'get in location' shipping method
                const { placeId } = deviceBasketItems[0];
                if(!deviceBasketItems.every( item => item.placeId == placeId)) {
                    showPickasShippingMethod = false;
                }
            }

            if(!showPickasShippingMethod) {
                shippingMethods = shippingMethods.filter(item => item != pickasShippingMethod )
            }

            if (paymentType === "SWB" && deviceBasketItems.length > 0) {
                shippingMethods = shippingMethods.filter(item => item.shortcode === 'PRIRMP' )
                shippingMethods.forEach( item => {
                    if(item.shortcode === 'PRIRMP') defaultMethod = item
                })
            } else {
                shippingMethods = shippingMethods.filter(item => item.shortcode !== 'PRIRMP' )
                shippingMethods.forEach( item => {
                    if(item.shortcode === 'GRVERS') defaultMethod = item
                })
            }
            if(defaultMethod){
                newBasketData = basketData.filter( item => item.productTypeId != 11)
                newBasketData.push(defaultMethod)
                this._getPrice(newBasketData, data.data.tax)
            }
            else this._getPrice(basketData, data.data.tax)

            this.setState({shippingMethods: shippingMethods,
                           taxValue: data.data.tax
            }, () => {
                if(defaultMethod) {
                    this.props.basketActions.changeBasketData(newBasketData)
                    this.props.basketActions.changeShippingMethod({ selected: true, value: defaultMethod })
                }
            })
        })
    }
    triggerChangeCoupon(){
        if ($('#input_coupon').val() == "") {
            this.setState({couponError: 'Bitte Gutscheincode eingeben'})
            return;
        }
        this.setState({couponError: null})
        this.inputCouponCallback({'target': {'value': $('#input_coupon').val()}})
    }
    snapPixelStatistic = (result) => {
        let uniqueBasketData = [];
        this.props.basketData.forEach(item => {
            if(uniqueBasketData.some(el => el.shortcode === item.shortcode)) { return false }
            else {
                let count = this.props.basketData.reduce((s, item2) => { return s += (item2.shortcode === item.shortcode) ? 1 : 0 }, 0);
                item.count = count;
                uniqueBasketData =[...uniqueBasketData, item];
            }

        });

        let excludeValues = [11,100,500,501,900,999];
        uniqueBasketData.forEach((item,i)=>{
            excludeValues.forEach((el)=>{
                if (+item.productTypeId === +el){
                   uniqueBasketData.splice(i,1)
                }
            })
        });
        let item_ids = uniqueBasketData.map((el)=>{
            return el.shortcode
        });
        return snaptr('track', 'PURCHASE', {
            'currency':window.currencyValue,
            'price':result.data.totalPrice,
            'transaction_id': result.data.basketShortcode,
            'item_ids': item_ids,
            'number_items': item_ids.length
        });
    };
    changeCreditsInput(e){
        this.setState({ credits: {...this.state.credits, errorCredits: null, currentValue: e.target.value } })
    }
    sendForm(e){
        let personalData = _getPersonalDataFields();
        let {shippingMethods, dataTransSign, dataTransMerchantId, dataTransSignSandbox, dataTransMerchantIdSandbox} = this.state;
        let {shippingMethod} = this.props;
        // let realDataTransSign = dataTransSignSandbox;
        // let realDataTransMerchantId = dataTransMerchantIdSandbox;
        let realDataTransSign = dataTransSign;
        let realDataTransMerchantId = dataTransMerchantId;

        e.preventDefault();

        window.localStorage.removeItem('bankPaymentData')

        if (shippingMethods.length > 0 && shippingMethod.selected === false){
            this.setState({ choiceShipping: true })
            return
        }

        if (this.state.inputCheckbox.agree && personalData){
            if(this.state.payMethod.method === 'Datatrans' && this.state.payMethod.paymethoddatatrans == 'SWB' && this.state.userDOB == ''){
                document.getElementById("dob-field").scrollIntoView(false);
                document.getElementById("dob-field").style.color = "red";
                document.getElementById("dob-field").style.fontSize = "14px";
                $("#paymentPanel").click()
                return
            }

            let { shippingAddress } = this.state.inputCheckbox,
                productTypeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 20, 996],
                data = new FormData(document.forms.basketForm)
            data.append("basketData", JSON.stringify(this.props.basketData))
            data.append("addressType", shippingAddress === true ? 'custom' : 'billing')
            data.append("totalPrice", this.state.total)
            data.append("clientIp", this.state.userIP)
            data.append("userAgent", JSON.stringify(this.props.ua))
            data.append("payMethod", JSON.stringify(this.state.payMethod))

            this.state.ifErrorPayment && data.append("errorPayment", true)
            this.state.ifErrorPayment && data.append("customerShortcode", this.state.customerShortcode)

            let fullStoryUserId = personalData.billingAddress.customer_email
            let fullStoryData = {
                displayName: personalData.billingAddress.customer_firstname + ' ' + personalData.billingAddress.customer_lastname,
                email: personalData.billingAddress.customer_email,
            }
            FullStoryAPI('identify', fullStoryUserId, fullStoryData)
            if(this.props.basketData.some( item => productTypeIds.some( id => item.productTypeId == id) )
            ){
                document.getElementById('spinner-box-load').style.display = 'block'
                gtag('event', 'set_checkout_option', {
                    "checkout_step": 3,
                    "checkout_option": "payment method",
                    "value": this.state.payMethod.method
                });
                axios.post('/api/basket/add', data)
                    .then( result => {
                        if(result.status === 200){
                            this.snapPixelStatistic(result);
                            window.localStorage.setItem('customerShortcode', result.data.customerShortcode)
                            window.localStorage.setItem('asGuest', JSON.stringify(this.state.inputCheckbox.asGuest))
                            document.getElementById('spinner-box-load').style.display = 'none'
                            window.localStorage.setItem('userData', JSON.stringify(personalData))
                            window.localStorage.setItem('basketShortcode', result.data.basketShortcode)
                            window.localStorage.setItem('snaptrUserEmail', personalData.billingAddress.customer_email)
                            let totalPrice = result.data.totalPrice
                            if(window.isGoogleConnection) {
                                this._gtag_report_conversion(totalPrice) //google adwords
                            }
                            if(Math.round(totalPrice) === 0){
                                document.getElementById('spinner-box-load').style.display = 'block'
                                axios.get(`/api/successPaymentByCredits?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&paymentPrice=${result.data.paymentPrice}`)
                                    .then( result => {
                                        document.getElementById('spinner-box-load').style.display = 'none'
                                        if(result.status === 200) browserHistory.push('/danke')
                                    })
                            }
                            else{
                                let customer_gender = '';
                                if(personalData && personalData.billingAddress.customer_gender == 'Frau'){
                                    customer_gender = 'female';
                                }
                                else if(personalData && personalData.billingAddress.customer_gender == 'Herr'){
                                    customer_gender = 'male';
                                }
                                if(this.state.payMethod.method === 'Datatrans'){
                                    realDataTransSign = result.data.hmac !== '' ? result.data.hmac : realDataTransSign
                                    let transactionId = result.data.transactionId
                                    if(this.state.payMethod.paymethoddatatrans == 'INT'){
                                      if(this.state.userDOB == ''){
                                        document.getElementById("dob-field").scrollIntoView(false);
                                        document.getElementById("dob-field").style.color = "red";
                                        document.getElementById("dob-field").style.fontSize = "14px";
                                      }
                                      else {
                                        this.setState({payForm: <form id="paymentForm"
                                                                      data-merchant-id={realDataTransMerchantId}
                                                                      data-amount={Math.round(totalPrice*100)}
                                                                      data-currency="CHF"
                                                                      data-paymentmethod={ this.state.payMethod.paymethoddatatrans }
                                                                      data-refno={result.data.basketShortcode}
                                                                      data-refno2={result.data.basketOrderInfoId}
                                                                      data-upp-customer-gender={ customer_gender }
                                                                      data-upp-customer-first-name={ personalData.billingAddress.customer_firstname }
                                                                      data-upp-customer-last-name={ personalData.billingAddress.customer_lastname }
                                                                      data-upp-customer-street={ personalData.billingAddress.customer_street }
                                                                      data-upp-customer-street2={ personalData.billingAddress.customer_number }
                                                                      data-upp-customer-city={ personalData.billingAddress.customer_city }
                                                                      data-upp-customer-zip-code={ personalData.billingAddress.customer_zip }
                                                                      data-upp-customer-language="de"
                                                                      data-upp-customer-phone={personalData.billingAddress.customer_phone}
                                                                      data-upp-customer-email={personalData.billingAddress.customer_email}

                                                                      data-language="de"
                                                                      data-upp-customer-country={ this.state.userCountryCode3 }
                                                                      data-upp-customer-id={ result.data.basketShortcode }
                                                                      data-upp-customer-type="P"
                                                                      data-upp-customer-birth-date={ this.state.userDOB }
                                                                      data-pmethod={ this.state.payMethod.paymethoddatatrans }
                                                                      data-sub_pmethod="BYJUNO-INVOICE"
                                                                      data-upp-customer-details="yes"
                                                                      data-upp-customer-name={ personalData.billingAddress.customer_firstname+' '+personalData.billingAddress.customer_lastname }
                                                                      data-intrum-device-fingerprint-id={ this.state.uniqueSessionId }
                                                                      data-intrum-delivery-method="POST"
                                                                      data-upp-shipping-details="no"
                                                                      data-upp-customer-ip-address={ this.state.userIP }
                                                                      data-intrum-risk-owner="IJ"
                                                                      data-intrum-repayment-type="4"
                                                                      data-upp-customer-cell-phone={ personalData.billingAddress.customer_phone }
                                                                      data-sign={realDataTransSign}>
                                            </form>
                                        })
                                        console.log("Datatrans.startPayment started");
                                        Datatrans.startPayment({'form': '#paymentForm',
                                            transactionId: transactionId,
                                            'opened': function() {console.log('payment-form opened');},
                                            'loaded': function() {console.log('payment-form loaded');},
                                            /*'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${result.data.totalPrice}&paymentMethod=${this.state.payMethod.paymethoddatatrans}`)
                                                    this.setState({ payForm: null })
                                            },*/
                                            'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                                    //this.setState({ payForm: null })
                                            },
                                            'error': function() {console.log('error');}
                                        })
                                      }
                                    }
                                    else if(this.state.payMethod.paymethoddatatrans == 'INT1'){
                                        if(this.state.userDOB1 == ''){
                                          document.getElementById("dob-field1").scrollIntoView(false);
                                          document.getElementById("dob-field1").style.color = "red";
                                          document.getElementById("dob-field1").style.fontSize = "14px";
                                        }
                                        else {
                                          this.setState({payForm: <form id="paymentForm"
                                                                        data-merchant-id={realDataTransMerchantId}
                                                                        data-amount={Math.round(totalPrice*100)}
                                                                        data-currency="CHF"
                                                                        data-paymentmethod='INT'
                                                                        data-refno={result.data.basketShortcode}
                                                                        data-refno2={result.data.basketOrderInfoId}
                                                                        data-upp-customer-gender={ customer_gender }
                                                                        data-upp-customer-first-name={ personalData.billingAddress.customer_firstname }
                                                                        data-upp-customer-last-name={ personalData.billingAddress.customer_lastname }
                                                                        data-upp-customer-street={ personalData.billingAddress.customer_street }
                                                                        data-upp-customer-street2={ personalData.billingAddress.customer_number }
                                                                        data-upp-customer-city={ personalData.billingAddress.customer_city }
                                                                        data-upp-customer-zip-code={ personalData.billingAddress.customer_zip }
                                                                        data-upp-customer-language="de"
                                                                        data-upp-customer-phone={personalData.billingAddress.customer_phone}
                                                                        data-upp-customer-email={personalData.billingAddress.customer_email}

                                                                        data-language="de"
                                                                        data-upp-customer-country={ this.state.userCountryCode3 }
                                                                        data-upp-customer-id={ result.data.basketShortcode }
                                                                        data-upp-customer-type="P"
                                                                        data-upp-customer-birth-date={ this.state.userDOB1 }
                                                                        data-pmethod='INT'
                                                                        data-sub_pmethod="BYJUNO-INVOICE"
                                                                        data-upp-customer-details="yes"
                                                                        data-upp-customer-name={ personalData.billingAddress.customer_firstname+' '+personalData.billingAddress.customer_lastname }
                                                                        data-intrum-device-fingerprint-id={ this.state.uniqueSessionId }
                                                                        data-intrum-delivery-method="POST"
                                                                        data-upp-shipping-details="no"
                                                                        data-upp-customer-ip-address={ this.state.userIP }
                                                                        data-intrum-risk-owner="IJ"
                                                                        data-intrum-repayment-type="4"
                                                                        data-upp-customer-cell-phone={ personalData.billingAddress.customer_phone }
                                                                        data-sign={realDataTransSign}>
                                              </form>
                                          })
                                          console.log("Datatrans.startPayment started");
                                          Datatrans.startPayment({'form': '#paymentForm',
                                              transactionId: transactionId,
                                              'opened': function() {console.log('payment-form opened');},
                                              'loaded': function() {console.log('payment-form loaded');},
                                              'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                                      //this.setState({ payForm: null })
                                              },
                                              'error': function() {console.log('error');}
                                          })
                                        }
                                    } if(this.state.payMethod.paymethoddatatrans == 'SWB') {
                                        if(this.state.userDOB == ''){
                                          document.getElementById("dob-field").scrollIntoView(false);
                                          document.getElementById("dob-field").style.color = "red";
                                          document.getElementById("dob-field").style.fontSize = "14px";
                                        }
                                        else {
                                            let totalTaxAmount = result.data.taxTotalAmount;
                                            let articleItems = result.data.articleItems;
                                            let swbParams = {
                                                "merchantId":realDataTransMerchantId,
                                                "sign":realDataTransSign,
                                                "uppShippingDetails":"no",
                                                "refno":`${result.data.basketShortcode}`,
                                                "language":"de",
                                                "hiddenMode":"yes",
                                                "reqtype":"CAA",
                                                "currency":"CHF",
                                                "theme":"DT2015",
                                                "taxAmount":`${Math.round(totalTaxAmount*100)}`,
                                                "amount":`${Math.round(totalPrice*100)}`,
                                                "uppMsgType":"web",
                                                "uppCustomerDetails":"yes",
                                                "uppCustomerId": `${result.data.basketShortcode}`,
                                                "uppCustomerTitle": "",
                                                "uppCustomerName": `${personalData.billingAddress.customer_firstname} ${personalData.billingAddress.customer_lastname}`,
                                                "uppCustomerFirstName":`${personalData.billingAddress.customer_firstname}`,
                                                "uppCustomerLastName":`${personalData.billingAddress.customer_lastname}`,
                                                "uppCustomerType": "P",
                                                "uppCustomerStreet":`${personalData.billingAddress.customer_street + ' ' + personalData.billingAddress.customer_number}`,
                                                "uppCustomerStreet2":"",
                                                "uppCustomerCity":`${personalData.billingAddress.customer_city}`,
                                                "uppCustomerCountry":`${this.state.userCountryCode3}`,
                                                "uppCustomerZipCode":`${personalData.billingAddress.customer_zip}`,
                                                "uppCustomerState": "",
                                                "uppCustomerPhone":`${personalData.billingAddress.customer_phone}`,
                                                "uppCustomerFax": "",
                                                "uppCustomerEmail":`${personalData.billingAddress.customer_email}`,
                                                "uppCustomerGender": `${customer_gender}`,
                                                "uppCustomerBirthDate":`${this.state.userDOB}`,
                                                "uppCustomerLanguage":"de",
                                                "uppCustomerOccurence": "EXISTING",
                                                "uppCustomerSubscription": "",
                                                "uppCustomerIpAddress": `${this.state.userIP}`,
                                            };

                                            articleItems.forEach( (articleItem, i ) => {
                                                swbParams = {
                                                    ...swbParams,
                                                    ["uppArticle_" + (i+1) + "_Id"]:`${articleItem.article_id}`,
                                                    ["uppArticle_" + (i+1) + "_Name"]:`${articleItem.article_desc}`,
                                                    ["uppArticle_" + (i+1) + "_Description"]:`${articleItem.article_desc}`,
                                                    ["uppArticle_" + (i+1) + "_Type"]:"goods",
                                                    ["uppArticle_" + (i+1) + "_Quantity"]:`${articleItem.count}`,
                                                    ["uppArticle_" + (i+1) + "_PriceGross"]:`${Math.round(articleItem.price*100)}`,
                                                    ["uppArticle_" + (i+1) + "_Price"]:`${Math.round(articleItem.price*100)}`,
                                                    ["uppArticle_" + (i+1) + "_Tax"]:"7.7",
                                                    ["uppArticle_" + (i+1) + "_PriceWithoutVAT"]:`${Math.round(articleItem.priceWithoutVat*100)}`,
                                                    ["uppArticle_" + (i+1) + "_TaxAmount"]:`${Math.round(articleItem.taxAmount*100)}`,
                                                }
                                            })
                                          this.setState({payForm: <form id="paymentForm"
                                                data-merchant-id={realDataTransMerchantId}
                                                data-amount={Math.round(totalPrice*100)}
                                                data-currency="CHF"
                                                data-refno={result.data.basketShortcode}
                                                data-refno2={result.data.basketOrderInfoId}
                                                data-sign={realDataTransSign}
                                                data-paymentmethod="SWB"
                                                data-upp-web-response-method="POST"
                                              >
                                              </form>
                                          })
                                          console.log("Datatrans.startPayment started");
                                          Datatrans.startPayment({'form': '#paymentForm',
                                                transactionId: transactionId,
                                                'params':swbParams,
                                                'opened': function() {console.log('payment-form opened');},
                                                'loaded': function() {console.log('payment-form loaded');},
                                                'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                              },
                                              'error': function() {console.log('error');}
                                          })
                                        }
                                    }
                                    else if(this.state.payMethod.paymethoddatatrans == 'SAM'){
                                        this.setState({payForm: <form id="paymentForm"
                                                data-merchant-id={realDataTransMerchantId}
                                                data-amount={Math.round(totalPrice*100)}
                                                data-currency="CHF"
                                                data-paymentmethod="SAM"
                                                data-refno={result.data.basketShortcode}
                                                data-refno2={result.data.basketOrderInfoId}
                                                data-upp-customer-gender={ customer_gender }
                                                data-upp-customer-first-name={ personalData.billingAddress.customer_firstname }
                                                data-upp-customer-last-name={ personalData.billingAddress.customer_lastname }
                                                data-upp-customer-street={ personalData.billingAddress.customer_street+', '+ personalData.billingAddress.customer_number}
                                                data-upp-customer-city={ personalData.billingAddress.customer_city }
                                                data-upp-customer-zip-code={ personalData.billingAddress.customer_zip }
                                                data-upp-customer-language="de"
                                                data-upp-customer-phone={personalData.billingAddress.customer_phone}
                                                data-upp-customer-email={personalData.billingAddress.customer_email}                                                
                                                data-sign={realDataTransSign}>
                                            </form>
                                        })
                                        Datatrans.startPayment({'form': '#paymentForm',
                                            transactionId: transactionId,                                            
                                            'opened': function() {console.log('payment-form opened');},
                                            'loaded': function() {console.log('payment-form loaded');},
                                            'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                                    //this.setState({ payForm: null })
                                            },
                                            'error': function() {console.log('error');}
                                        })
                                    }
                                    else if(this.state.payMethod.paymethoddatatrans == 'APL'){
                                        this.setState({payForm: <form id="paymentForm"
                                                data-merchant-id={realDataTransMerchantId}
                                                data-amount={Math.round(totalPrice*100)}
                                                data-currency="CHF"
                                                data-paymentmethod="APL"
                                                data-refno={result.data.basketShortcode}
                                                data-refno2={result.data.basketOrderInfoId}
                                                data-upp-customer-gender={ customer_gender }
                                                data-upp-customer-first-name={ personalData.billingAddress.customer_firstname }
                                                data-upp-customer-last-name={ personalData.billingAddress.customer_lastname }
                                                data-upp-customer-street={ personalData.billingAddress.customer_street+', '+ personalData.billingAddress.customer_number}
                                                data-upp-customer-city={ personalData.billingAddress.customer_city }
                                                data-upp-customer-zip-code={ personalData.billingAddress.customer_zip }
                                                data-upp-customer-language="de"
                                                data-upp-customer-phone={personalData.billingAddress.customer_phone}
                                                data-upp-customer-email={personalData.billingAddress.customer_email}                                                
                                                data-sign={realDataTransSign}>
                                            </form>
                                        })
                                        Datatrans.startPayment({'form': '#paymentForm',
                                            transactionId: transactionId,                                            
                                            'opened': function() {console.log('payment-form opened');},
                                            'loaded': function() {console.log('payment-form loaded');},
                                            'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                                    //this.setState({ payForm: null })
                                            },
                                            'error': function() {console.log('error');}
                                        })
                                    }
                                    else{
                                      this.setState({payForm: <form id="paymentForm"
                                                                    data-merchant-id={realDataTransMerchantId}
                                                                    data-amount={Math.round(totalPrice*100)}
                                                                    data-currency="CHF"
                                                                    data-paymentmethod={ this.state.payMethod.paymethoddatatrans }
                                                                    data-refno={result.data.basketShortcode}
                                                                    data-refno2={result.data.basketOrderInfoId}
                                                                    data-upp-customer-gender={ customer_gender }
                                                                    data-upp-customer-first-name={ personalData.billingAddress.customer_firstname }
                                                                    data-upp-customer-last-name={ personalData.billingAddress.customer_lastname }
                                                                    data-upp-customer-street={ personalData.billingAddress.customer_street+', '+ personalData.billingAddress.customer_number}
                                                                    data-upp-customer-city={ personalData.billingAddress.customer_city }
                                                                    data-upp-customer-zip-code={ personalData.billingAddress.customer_zip }
                                                                    data-upp-customer-language="de"
                                                                    data-upp-customer-phone={personalData.billingAddress.customer_phone}
                                                                    data-upp-customer-email={personalData.billingAddress.customer_email}
                                                                    data-sign={realDataTransSign}>
                                          </form>
                                      })
                                      console.log("Datatrans.startPayment started");
                                      Datatrans.startPayment({'form': '#paymentForm',
                                          transactionId: transactionId,
                                          'opened': function() {console.log('payment-form opened');},
                                          'loaded': function() {console.log('payment-form loaded');},
                                          /*'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${result.data.totalPrice}&paymentMethod=${this.state.payMethod.paymethoddatatrans}`)
                                                  this.setState({ payForm: null })
                                          },*/
                                          'closed': function() {axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                                  //this.setState({ payForm: null })
                                          },
                                          'error': function() {console.log('error');}
                                      })
                                    }
                                }
                                else if(this.state.payMethod.method === 'Bitcoin'){
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.get(`/api/bitpayPayment?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}`)
                                        .then( result => {
                                            window.open(result.data.url, '_self')
                                        })
                                }
                                else if(this.state.payMethod.method === 'Stripe'){
                                    this.loadStripe(() => {
                                        let ifPay = false
                                        this.stripeHandler = window.StripeCheckout.configure({
                                            key: window.stripeKey.key,
                                            image: '/images/logo.png',
                                            locale: 'auto',
                                            currency: 'EUR',
                                            token: (token) => {
                                                if(token.id){
                                                    document.getElementById('spinner-box-load').style.display = 'block'
                                                    axios.get(`/api/stripePayment?tokenId=${token.id}&basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&email=${token.email}`)
                                                        .then( result =>{
                                                            document.getElementById('spinner-box-load').style.display = 'none'
                                                            if(result.status === 200) browserHistory.push('/danke')
                                                        })
                                                        .catch( error => {
                                                            document.getElementById('spinner-box-load').style.display = 'none'
                                                            if(error.response.status === 404)  {
                                                                axios.get(`/api/errorOrder?basketOrderInfoId=${result.data.basketOrderInfoId}&payment_type_id=20`)
                                                                browserHistory.push('/error-payment')
                                                            }
                                                        })
                                                    ifPay = true
                                                }

                                            },
                                            closed: () => {
                                                if(!ifPay){
                                                    //axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${result.data.totalPrice}&paymentMethod=${this.state.payMethod.paymethoddatatrans}`)
                                                    axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}&totalPrice=${totalPrice}`)
                                                }
                                            }
                                        })
                                        if(document.querySelector('.stripe-button-el')) document.querySelector('.stripe-button-el').style.display = 'none'
                                        this.stripeHandler.open({
                                            amount: totalPrice*100,
                                            name: 'Remarket',
                                            allowRememberMe: false
                                        })
                                    })
                                }
                                else if(this.state.payMethod.method === 'Vorauskasse/Überweisung'){
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    window.localStorage.setItem('isVorauskasse', true)
                                    axios.get(`/api/bankPayment?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}`)
                                        .then( result => {
                                            document.getElementById('spinner-box-load').style.display = 'none'
                                            window.localStorage.setItem('bankPaymentData', JSON.stringify(result.data))
                                            if(result.status === 200) browserHistory.push('/danke')
                                        })
                                        .catch( error => {
                                            window.localStorage.removeItem('isVorauskasse')
                                            if(error.response.status === 404) {
                                                axios.get(`/api/errorOrder?basketOrderInfoId=${result.data.basketOrderInfoId}&payment_type_id=19`)
                                                browserHistory.push('/error-payment')
                                            }
                                        })
                                }
                                else if(this.state.payMethod.method === 'PayPal'){
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.get(`/api/paypalPayment?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}`)
                                        .then( result => {
                                            window.open(result.data.link, '_self')
                                        })
                                }
                                else if(this.state.payMethod.method === 'Payrexx'){
                                  document.getElementById('spinner-box-load').style.display = 'block'
                                  axios.get(`/api/payrexxPayment?paymethodpayrexx=${this.state.payMethod.paymethodpayrexx}&basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}`)
                                    .then( result => {
                                      window.open(result.data.link, '_self')
                                    })
                                }
                                else if(this.state.payMethod.method === 'payInShop'){
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.get(`/api/paymentByCash?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}`)
                                        .then( result => {
                                            document.getElementById('spinner-box-load').style.display = 'none'
                                            if(result.status === 200) browserHistory.push('/danke')
                                        })
                                        .catch( error => {
                                            if(error.response.status === 404) {
                                                axios.get(`/api/errorOrder?basketOrderInfoId=${result.data.basketOrderInfoId}&payment_type_id=21`)
                                                browserHistory.push('/error-payment')
                                            }
                                        })
                                }
                                else if(this.state.payMethod.method === 'payByCredits'){
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.post('/api/paymentByCredits', { basketShortcode: result.data.basketShortcode, basketOrderInfoId: result.data.basketOrderInfoId})
                                        .then( result => {
                                            document.getElementById('spinner-box-load').style.display = 'none'
                                            if(result.status === 200) browserHistory.push('/danke')
                                        })
                                        .catch( error => {
                                            document.getElementById('spinner-box-load').style.display = 'none'
                                            if(error.response.status === 404) browserHistory.push('/error-payment')
                                        })
                                }
                                else if(this.state.payMethod.method === 'HeidiPay'){
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.get(`/api/heidipayPayment?basketShortcode=${result.data.basketShortcode}&basketOrderInfoId=${result.data.basketOrderInfoId}`)
                                         .then( result => {
                                             if(typeof result.data.link === 'string') {
                                                 window.open(result.data.link, '_self')
                                             } else {
                                                 console.log(result)
                                                 //throw new Error('Zahlungsfehler');
                                             }
                                         })
                                         .catch( error => {
                                             if(error.status !== 200) {
                                                 document.getElementById('spinner-box-load').style.display = 'none'
                                                 axios.get(`/api/errorOrder?basketOrderInfoId=${result.data.basketOrderInfoId}&payment_type_id=108`)
                                                 browserHistory.push('/error-payment')
                                             }
                                         });
                                }
                            }
                        }
                    })
                    .catch( error => {
                        let err = error.response.data.errors,
                            info, password, credits, general
                        if(err){
                            err.email ? info = err.email : ''
                            err.password ? password = err.password : ''
                            err.general ? general = err.general : ''
                            err.credits ? credits = err.credits : ''
                            if(info || password){
                                $('.personalData h3.title').click().removeClass('answering')
                                $(window).scrollTop(0)
                            }
                        }
                        this.setState({ errors: {...this.state.errors, info, password, general },
                            credits: {...this.state.credits, errorCredits: credits}
                        })
                        document.getElementById('spinner-box-load').style.display = 'none'
                    })
            }
            else this.setState({ errorNoProducts: 'Es muss mindestens ein Produkt dem Warenkorb hinzugefügt werden'})
        }
    }
    changeCountry(val, name){
        let { value } = val,
            { currentCountry } = this.state.country
        currentCountry[name] = value
        this.setState({ country: { ...this.state.country, currentCountry } })
        if(val.value == 'li'){
          this.setState({ userCountryCode3: "LIE" })
        }
        else if(val.value == 'de'){
          this.setState({ userCountryCode3: "DEU" })
        }
        else{
          this.setState({ userCountryCode3: "CHE" })
        }
    }
    changeCheckbox(e){
        let { inputCheckbox } = this.state,
            { name } = e.target
        inputCheckbox[name] = !inputCheckbox[name]
        this.setState({ inputCheckbox })
    }
    addInsuranceToBasket(e, deviceShortcode){
        if(e.target.checked){
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.get(`/api/getInsuranceInfo?deviceShortcode=${deviceShortcode}`)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    result.data.productTypeId = 501
                    result.data.deviceShortcode = deviceShortcode
                    let newBasketData = [...this.props.basketData, result.data]
                    this.props.basketActions.changeBasketData(newBasketData)
                    this._getPrice(newBasketData, this.state.taxValue)
                })
                .catch( error => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({errors: {...this.state.errors, general: 'Kann Versicherungszertifikat nicht erstellen'}})
                })
        }
        else{
            this.handleRemoveFromBasket(501, deviceShortcode)
        }
    }
    addInsuranceToBasketCh(e){
        if (this.state.insuranceChAmount !== 0) {
            let productShortcode = ''
            if (this.state.insuranceChAmount === 60) {
                productShortcode = 'IDK3VU'
            } else if (this.state.insuranceChAmount === 120) {
                productShortcode = '8JXTVN'
            }
            if (productShortcode !== '') {
                if(e.target.checked){
                    document.getElementById('spinner-box-load').style.display = 'block'
                    axios.get(`/api/getInsuranceInfoCh?productShortcode=${productShortcode}`)
                        .then( result => {
                            document.getElementById('spinner-box-load').style.display = 'none'
                            result.data.productTypeId = 500
                            result.data.shortcode = productShortcode
                            result.data.price = this.state.insuranceChAmount
                            let newBasketData = [...this.props.basketData, result.data]
                            this.props.basketActions.changeBasketData(newBasketData)
                            this._getPrice(newBasketData, this.state.taxValue)
                        })
                        .catch( error => {
                            document.getElementById('spinner-box-load').style.display = 'none'
                            this.setState({errors: {...this.state.errors, general: 'Kann Versicherungszertifikat nicht erstellen'}})
                        })
                } else {
                    this.handleRemoveFromBasket(500, productShortcode)
                    this.setState({ insuranceChAmount: 0})
                }
            }
        }
    }
    addCreditsToBasket(){
        let { currentValue } = this.state.credits,
            data = {
                credits: currentValue,
                basketData: this.props.basketData
            }
        axios.post(`/api/validateCredits`, data)
            .then(({ data }) => {
                let itemBasket = {
                    productTypeId: 100,
                    price: currentValue
                }
                let newBasketData = [...this.props.basketData, itemBasket]
                this.props.basketActions.changeBasketData(newBasketData)
                this._getPrice(newBasketData, this.state.taxValue)
                this.setState({ checkedPayByCredits: true })
            })
            .catch( error => {
                let errorCredits = error.response.data
                this.setState({ credits: { ...this.state.credits, errorCredits } })
            })
    }
    choosePayMethod(e){
        if(e.target.value == 'Payrexx' 
            || e.target.value == 'payByCredits'
            || e.target.value == 'payInShop'
            || e.target.value == 'PayPal'
            || e.target.value == 'Vorauskasse/Überweisung'
            || e.target.value == 'Stripe'
            || e.target.value == 'Bitcoin'
            || e.target.value == 'HeidiPay'
            || e.target.value == 'Datatrans'){
            if(e.target.value === 'payByCredits'){
                if(e.target.checked) {
                    this.addCreditsToBasket()
                }
                else this.handleRemoveFromBasket(100)
            }
            else if(e.target.id != 'creditsInput'){
                let method = e.target.value,
                    paymethoddatatrans = e.target.getAttribute('data-paymethoddatatrans'),
                    paymethodpayrexx = e.target.getAttribute('data-paymethodpayrexx')
                this.setState({ payMethod: { ...this.state.payMethod, method, paymethoddatatrans, paymethodpayrexx } })
                $('.paymentMethod h3.title').addClass('answering')
            }
        }
    }
    chooseShippingMethod(e){
        let value = e.currentTarget.firstChild.getAttribute("data-value"),
            { basketData } = this.props        
        let data = this.state.shippingMethods.filter( item => item.name === value)
        let newBasketData = basketData.filter( item => item.productTypeId != 11)
        newBasketData.push(data[0])
        this.props.basketActions.changeBasketData(newBasketData)
        this.props.basketActions.changeShippingMethod({ selected: true, value: data[0] })
        this._getPrice(newBasketData, this.state.taxValue)
        this.setState({choiceShipping: false})
    }
    choosePersonalData(e){
        let position = e.target.getAttribute('data-position'),
            data = this.state.autoloadPersonalData.data[position]
        _setPersonalDataFields.call(this, data)
        window.localStorage.setItem('userData', JSON.stringify(data))
    }
    handleRemoveFromBasket(productTypeId, id){
        let basketData = this.props.basketData,
            newBasketData = [],
            deadline = JSON.parse(window.localStorage.getItem('deadline'));
        if(productTypeId == 11){                                                            // if item 'Shipping Method'
            newBasketData = basketData.filter( item => item.productTypeId != '11')
            this.props.basketActions.changeShippingMethod({ selected: false, value: {} })
        } else if( productTypeId == 10 ||  productTypeId == 3) {
            let pItem = basketData.filter( item => item.shortcode == id)
            if (pItem && pItem.length > 0) {
                if (window.isGoogleConnection)
                    this.gtagEnhancedEcommerce(pItem[0]);
                newBasketData = basketData.filter( item => item.shortcode != id)
                if (productTypeId == 10)
                    newBasketData = newBasketData.filter( item => !(item.shortcode == 'TEMP43' && item.price == pItem[0].price))
                if (productTypeId == 3)
                    newBasketData = newBasketData.filter( item => !(item.shortcode == 'CASE43' && item.price == pItem[0].price))
            }

        } else if( productTypeId == 999 ) {
            // if item "Coupon"
            if(deadline && deadline.couponShortcode == id) {
                deadline.isActive = 0;
                this.setState({ deadlineIsActive: false })
                window.localStorage.setItem('deadline', JSON.stringify(deadline));
                setTimeout(() => {
                    this.setState({ deadline: false })
                    this.updateCountDown()
                }, 1000)
            }
            newBasketData = basketData.filter(item => item.shortcode != id)
        }

        else if(productTypeId == 100){
            newBasketData = basketData.filter( item => item.productTypeId != productTypeId)
            this.setState({ checkedPayByCredits: false })
        }
        else if(productTypeId == 501){// for germany
            newBasketData = basketData.filter( item => item.deviceShortcode != id)
        }
        else if(productTypeId == 500){
            newBasketData = basketData.filter( item => item.shortcode != id)
        }
        else if(ACCESSORIES_ID.includes(productTypeId)){
            let item = basketData.filter( item => item.shortcode == id)
            if (window.isGoogleConnection)
                this.gtagEnhancedEcommerce(item[0]);
            newBasketData = basketData.filter( item => item.shortcode != id)
        }
        else{
            let item = basketData.filter( item => item.shortcode == id)
            if (window.isGoogleConnection)
                this.gtagEnhancedEcommerce(item[0]);
            newBasketData = basketData.filter( item => item.shortcode != id)
        }
        if(!newBasketData.some( item => item.productTypeId == 7 ) && newBasketData.some( item => item.productTypeId == 999 )) {
            newBasketData = newBasketData.filter(item => item.productTypeId != 999)
        }
        if(!newBasketData.some( item => item.productTypeId == 7 )){
            if(deadline){
                deadline?deadline.isActive = 0:'';
                window.localStorage.setItem('deadline', JSON.stringify(deadline));
                this.setState({ deadlineIsActive: false })
            }
        }
        this.props.basketActions.changeBasketData(newBasketData)
        this._getPrice(newBasketData, this.state.taxValue)
    }

    gtagEnhancedEcommerce = (item) => {

        let brands, brand, category;
        if(item.categoryName){
            brands = item.criterias.find( item => item.id === 'manufacturer').values,
            brand = brands.length ? brands[0].name : "",
            category = item.categoryName;
        }
        else {
            brand = item.deviceName,
            category = '';
        }
        gtag('event', 'remove_from_cart', {
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
    }
    handleUpdateBasketData = (count, id) => {
        if(count === '') {
            return;
        }
        let basketData = this.props.basketData,
            newBasketData = [];
        let alreadyAdd = false;
        basketData.forEach( (item) => {
            if(item.shortcode != id) {
                newBasketData = [...newBasketData, item]
            } else {
                if (!alreadyAdd) {
                    for ( let i = 1; i <= count; ++i ) {
                        item.count = 1
                        newBasketData = [...newBasketData, item]
                    }
                    alreadyAdd = true
                }                
            }
        });
        this.props.basketActions.changeBasketData(newBasketData)
        this._getPrice(newBasketData, this.state.taxValue)
    }

    changeNameField(e){
        e.persist()
        this.inputNameCallback(e)
    }
    changeForm(){
        let personalData = _getPersonalDataFields()
        window.localStorage.setItem('userData', JSON.stringify(personalData))
        this.setState({ errorSendForm: null,
                        errors: {...this.state.errors, info:'', password: '', general: ''}
        })
    }
    cancelSendByEnter(e){
        if(e.key === "Enter"){
            e.preventDefault()
            return false
        }
    }
    onNoteToggle(e){
        this.setState({ payMethodError: {
            status: false,
            msg: ''
        }})
        this.setState({noteShow: e.currentTarget.getAttribute('data-paymethoddatatrans') === "INT" ? true : false});
        this.setState({noteShow1: e.currentTarget.getAttribute('data-paymethoddatatrans') === "INT1" ? true : false});
        this.setState({noteShow: e.currentTarget.getAttribute('data-paymethoddatatrans') === "SWB" ? true : false});
        this.setState({noteShow2: e.currentTarget.getAttribute('data-paymethoddatatrans') === "BNK" ? true : false});
        if (e.currentTarget.getAttribute('data-paymethoddatatrans') === "SWB") {
            this.getShippingMethods("SWB");
        } else {
            this.getShippingMethods("Normal");
        }
    }
    dobChange(date){
        if (date) {
            var dob = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
            this.setState({ userDOB: dob });
        } else {
            this.setState({ userDOB: '' });
        }
    }
    dobChange1(date){
        if (date) {
            var dob = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
            this.setState({ userDOB1: dob });
        } else {
            this.setState({ userDOB1: '' });
        }
    }
    insuranceChAmountChange(e){
        e.persist()
        if (e.target.dataset.insuranceamount === '60') {
            this.setState({ insuranceChAmount: (this.state.insuranceChAmount === 0 || this.state.insuranceChAmount === 120) ? 60 : 0 })
        } else if (e.target.dataset.insuranceamount === '120') {
            this.setState({ insuranceChAmount: (this.state.insuranceChAmount === 0 || this.state.insuranceChAmount === 60) ? 120 : 0 })
        }
    }

    validateForm() {
        let { inputCheckbox } = this.state
        let personalData = _getPersonalDataFields();
        var validateObj = {};
        let validate = true;
        for (const [key, value] of Object.entries(personalData.shippingAddress)) {
            if (inputCheckbox.company === false && key === 'companyName') {
                validateObj[key] = {
                    error: false,
                    msg: ''
                }
                continue
            }
            if (value === "") {
                validate = false
                validateObj[key] = {
                    error: true,
                    msg: ''
                }
            } else {
                if (key === "email" && !this.validateEmail(value)) {
                    validate = false
                    validateObj[key] = {
                        error: true,
                        msg: 'Falsches Format'
                    }
                } else if (key === "phone" && !this.validatePhoneNumber(value)) {
                    validate = false
                    validateObj[key] = {
                        error: true,
                        msg: 'Falsches Format (mind. 10, max. 15 Zahlen)'
                    }
                } else if ((key === "number" || key === "zip") && !this.validateNumeric(value)) {
                    validate = false
                    validateObj[key] = {
                        error: true,
                        msg: 'Falsches Format'
                    }
                } else {
                    validateObj[key] = {
                        error: false,
                        msg: ''
                    }
                }
            }
        }

        if (inputCheckbox.shippingAddress === false) {
            for (const [key, value] of Object.entries(personalData.billingAddress)) {
                if (inputCheckbox.customerCompanyName === false && key === 'customer_companyName') {                    
                    validateObj[key] = {
                        error: false,
                        msg: ''
                    }
                    continue
                }
                if (value === "") {
                    validate = false
                    validateObj[key] = {
                        error: true,
                        msg: ''
                    }
                } else {
                    if (key === "customer_email" && !this.validateEmail(value)) {
                        validate = false
                        validateObj[key] = {
                            error: true,
                            msg: 'Falsches Format'
                        }
                    } else if (key === "customer_phone" && !this.validatePhoneNumber(value)) {
                        validate = false
                        validateObj[key] = {
                            error: true,
                            msg: 'Falsches Format (mind. 10, max. 15 Zahlen)'
                        }
                    } else if ((key === "customer_number" || key === "customer_zip") && !this.validateNumeric(value)) {
                        validate = false
                        validateObj[key] = {
                            error: true,
                            msg: 'Falsches Format'
                        }
                    } else {
                        validateObj[key] = {
                            error: false,
                            msg: ''
                        }
                    }
                }
            }
        }
        this.setState({ validateError: {...this.state.validateError, ...validateObj}})
        this.setState({ isValidate: validate })
        return validate
    }

    validateCheck() {
        let { inputCheckbox } = this.state
        let personalData = _getPersonalDataFields();
        let validate = true;
        for (const [key, value] of Object.entries(personalData.shippingAddress)) {
            if (inputCheckbox.company === false && key === 'companyName') {
                continue
            }
            if (value === "") {
                validate = false
            } else {
                if (key === "email" && !this.validateEmail(value)) {
                    validate = false
                } else if (key === "phone" && !this.validatePhoneNumber(value)) {
                    validate = false
                } else if ((key === "number" || key === "zip") && !this.validateNumeric(value)) {
                    validate = false
                }
            }
        }

        if (inputCheckbox.shippingAddress === false) {
            for (const [key, value] of Object.entries(personalData.billingAddress)) {
                if (inputCheckbox.customerCompanyName === false && key === 'customer_companyName') {                                        
                    continue
                }
                if (value === "") {
                    validate = false
                } else {
                    if (key === "customer_email" && !this.validateEmail(value)) {
                        validate = false
                    } else if (key === "customer_phone" && !this.validatePhoneNumber(value)) {
                        validate = false
                    } else if ((key === "customer_number" || key === "customer_zip") && !this.validateNumeric(value)) {
                        validate = false
                    }
                }
            }
        }
        this.setState({ isValidate: validate })
    }

    validateEmail(email){
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    validatePhoneNumber(phone) {
        return phone.match(
            /^[\+]?[(]?[0-9]{4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,8}$/im
        );
    }

    validateNumeric(number){
        if (typeof number != "string") return false
        return !isNaN(number) && 
               !isNaN(parseFloat(number))
    }

    render() {
        let { subject, tax, total, country, inputCheckbox, couponError, shippingMethods, autoloadPersonalData, errors,
              credits, domain, errorNoProducts, showTabs, checkedPayByCredits, taxValue, taxOnlyForVat, noteShow, noteShow1, noteShow2, isVorauskasse, infoRatings, rateData} = this.state,
            { basketData, user } = this.props
        return (
            <div className="basketWrap">
                <div className="container">
                    {window.isMobile ?  <div className="process-bar">
                        <div className={'process-bar-title'}>
                            {this.props.basketStep !== 'paymentMethod' &&
                                <img src={'/images/design/mobile/back-btn-arrow.svg'}
                                 onClick={this.props.handlerBack}
                                 alt="" />
                            }
                            <h3>Kaufübersicht</h3>
                        </div>
                        <div className="process-items">
                            <div className={`process-item ${this.props.basketStep === 'paymentMethod' ? 'step-active' : 'step-done'}`} onClick={(e) => this.goTab(e, 'paymentMethod')} >
                                <div className="round"></div>
                                <span>Zahlungsart</span>
                            </div>
                            <div className="separator"></div>
                            <div className={`process-item ${this.props.basketStep === 'personalData' ? 'step-active' : (this.props.basketStep === 'shippingMethod' ? 'step-done' : 'step-disable')}`} onClick={(e) => this.goTab(e, 'personalData')}>
                                <div className="round"></div>
                                <span>Persönliche Daten</span>
                            </div>
                            <div className="separator"></div>
                            <div className={`process-item ${this.props.basketStep === 'shippingMethod' ? 'step-active' : 'step-disable'}`} onClick={(e) => this.goTab(e, 'shippingMethod')}>
                                <div className="round"></div>
                                <span>Versand</span>
                            </div>
                        </div>
                    </div> : ''}
                    {this.state.errorPay && <p className="errorPay">Zahlungsfehler: {this.state.errorPay}</p> }
                    {/* { errorNoProducts && <p className="errorInfo">{ errorNoProducts } </p> }
                    { errors.general  && <p className="errorInfo">{ errors.general } </p> } */}
                    { basketData.filter(item => item.productTypeId != 11).length > 0 ?
                        <Fragment>
                            {/*<div className="row topButtonsWrap" id="topButtonsCarousel">*/}
                            {/*    <div className="col-md-3 topButtonsSecondWrap">*/}
                            {/*        <button className="topButtons">*/}
                            {/*            <span><img src='images/design/money-time.svg' alt=""/></span>*/}
                            {/*            <span>*/}
                            {/*                Auf Rechnung und in Raten bezahlen*/}
                            {/*            </span>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*    <div className="col-md-3 topButtonsSecondWrap">*/}
                            {/*        <button className="topButtons">*/}
                            {/*            <span><img src='images/design/award-74.svg' alt=""/></span>*/}
                            {/*            <span>*/}
                            {/*                14 Tage Zufriedenheitsgarantie*/}
                            {/*            </span>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*    <div className="col-md-3 topButtonsSecondWrap">*/}
                            {/*        <button className="topButtons">*/}
                            {/*            <span><img src='images/design/umbrella-13.svg' alt=""/></span>*/}
                            {/*            <span>*/}
                            {/*                1 Jahr Garantie auf Occassion<br/>*/}
                            {/*                2 Jahre auf Neugeräte*/}
                            {/*            </span>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*    <div className="col-md-3 topButtonsSecondWrap">*/}
                            {/*        <button className="topButtons">*/}
                            {/*            <span><img src='images/design/delivery-fast.svg' alt=""/></span>*/}
                            {/*            <span>*/}
                            {/*                Schnelle Lieferung*/}
                            {/*            </span>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <form action="#" name="basketForm" onChange={this.changeForm.bind(this)} onSubmit={this.sendForm} onKeyPress={this.cancelSendByEnter.bind(this)}>
                                <div className="row formWrap">
                                    <div className="col-md-7" id="accordion">
                                        <Payment
                                                isVorauskasse={isVorauskasse}
                                                credits={credits}
                                                total={total}
                                                userIsLogin={user.isLogin}
                                                totalPrice={total}
                                                domain={domain}
                                                shippingMethods={shippingMethods}
                                                choosePayMethod={this.choosePayMethod}
                                                checkedPayByCredits={checkedPayByCredits}
                                                changeCreditsInput={this.changeCreditsInput}
                                                showTabs={showTabs}
                                                handlerNextTab={this.nextTab}
                                                handlerShowHideBlocks={this._showHideBlocks}
                                                handlerSendForm={this.sendForm}
                                                shippingMethod={ this.props.shippingMethod }
                                                placeDescription={basketData[0].placeDescription}
                                                goToDelivery={this._goToDelivery}
                                                changeCheckbox={this.changeCheckbox}
                                                onNoteToggle={this.onNoteToggle}
                                                dobChange={this.dobChange}
                                                dobChange1={this.dobChange1}
                                                payMethod={this.state.payMethod}
                                                payMethodError={this.state.payMethodError}
                                                noteShow={noteShow}
                                                noteShow1={noteShow1}
                                                noteShow2={noteShow2}
                                        />
                                        <PersonalData country={ country }
                                                      cancelRedirect={this.props.userActions.cancelRedirectToMyAccount}
                                                      ifErrorPayment={this.state.ifErrorPayment}
                                                      user={user}
                                                      error={errors}
                                                      inputCheckbox={ inputCheckbox }
                                                      changeCountry={this.changeCountry}
                                                      showTabs={showTabs}
                                                      handlerNextTab={this.nextTab}
                                                      handlerShowHideBlocks={this._showHideBlocks}
                                                      handlerSendForm={this.sendForm}
                                                      total={total}
                                                      goToPayment={this.goToPaymentMobile}
                                                      changeCheckbox={this.changeCheckbox}
                                                      validateError={this.state.validateError}
                                                      validateForm={this.validateForm}
                                                      validateCheck={this.validateCheck}
                                                      isValidate={this.state.isValidate}
                                                      />
                                        <Shipping chooseShippingMethod={this.chooseShippingMethod}
                                                            choiceShipping={this.state.choiceShipping}
                                                            isVorauskasse={isVorauskasse}
                                                            credits={credits}
                                                            total={total}
                                                            userIsLogin={user.isLogin}
                                                            totalPrice={total}
                                                            domain={domain}
                                                            shippingMethods={shippingMethods}
                                                            checkedPayByCredits={checkedPayByCredits}
                                                            changeCreditsInput={this.changeCreditsInput}
                                                            showTabs={showTabs}
                                                            handlerNextTab={this.nextTab}
                                                            handlerShowHideBlocks={this._showHideBlocks}
                                                            handlerSendForm={this.sendForm}
                                                            shippingMethod={ this.props.shippingMethod }
                                                            placeDescription={basketData[0].placeDescription}
                                                            changeCheckbox={this.changeCheckbox}
                                                            onNoteToggle={this.onNoteToggle}
                                                            inputCheckbox={ inputCheckbox }
                                                            error={errors}
                                                            errorNoProducts={errorNoProducts}
                                        />
                                        {/*{!showTabs.paymentMethod && <button type="button"  className="basketSubmit btn" onClick={this.nextTab}>
                                                                    Weiter
                                                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                                                </button>}*/}
                                        {/*<button type="submit" className="basketSubmit btn hideBtn" onSubmit={this.sendForm}>
                                        {!window.isMobile ? 'Bestellung senden' : `${total} ${window.currencyValue} jetzt bezahlen`}
                                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                    </button>*/}
                                        <div className="offer-tab basket-offer-tab">
                                            <div className="item">
                                                <div className="img">
                                                    <img src={'/images/offer9.svg'} alt="" />
                                                </div>
                                                <p>Auf Rechnung in</p>
                                                <p>Raten bezahlen</p>
                                            </div>
                                            <div className="item">
                                                <div className="img">
                                                    <img src={'/images/offer2.svg'} alt="" />
                                                </div>
                                                <p>1 Jahr Garantie auf Occassionen</p>
                                                <p>2 Jahre auf Neugeräte</p>
                                            </div>
                                            <div className="item">
                                                <div className="img">
                                                    <img src={'/images/offer10.svg'} alt="" />
                                                </div>
                                                <p>14 Tage</p>
                                                <p>Zufriedenheitsgarantie</p>
                                            </div>
                                            <div className="item">
                                                <div className="img">
                                                    <img src={'/images/offer4.svg'} alt="" />
                                                </div>
                                                <p>Schnelle</p>
                                                <p>Lieferung</p>
                                            </div>
                                        </div>
                                    </div>
                                    <ProductOverview basketData={basketData}
                                                     addCreditsToBasket={this.addCreditsToBasket}
                                                     addInsuranceToBasket={this.addInsuranceToBasket}
                                                     addInsuranceToBasketCh={this.addInsuranceToBasketCh}
                                                     credits={credits}
                                                     changeCreditsInput={this.changeCreditsInput}
                                                     removeFromBasket={ this.handleRemoveFromBasket }
                                                     changeCoupon = { this.changeCoupon }
                                                     triggerChangeCoupon = { this.triggerChangeCoupon }
                                                     couponError = { couponError }
                                                     user={user}
                                                     subject={subject}
                                                     tax={tax}
                                                     taxValue={taxValue}
                                                     taxOnlyForVat={taxOnlyForVat}
                                                     total={total}
                                                     goToCheckoutMobile={this.props.goToCheckout}
                                                     updateBasketData = {this.handleUpdateBasketData}
                                                     deadline={this.state.deadline}
                                                     activateCountDownCoupon={this.activateCountDownCoupon}
                                                     deadlineIsActive={this.state.deadlineIsActive}
                                                     deadlineExpired={this.state.deadlineExpired}
                                                     infoRatings={infoRatings}
                                                     rateData={rateData}
                                                     insuranceChAmountChange={this.insuranceChAmountChange}
                                                     insuranceChAmount={this.state.insuranceChAmount}
                                    />
                                </div>
                            </form>
                        </Fragment>
                        :
                        <div>
                            <h1>Warenkorb</h1>
                            <p className="emptyBasket">Ihr Warenkorb ist noch leer.</p>
                        </div>

                    }
                    {this.state.payForm}
                    {autoloadPersonalData.element}
                </div>
                {!window.isMobile &&
                    <div className="similar">
                        <div className="container">
                            <ListSimilarItems similarItems={this.state.similarItems}/>
                            <div className="cb"/>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

Basket.propTypes = {}
Basket.defaultProps = {}

function mapStateToProps(state) {
    return {
        basketData: state.basket.basketData,
        shippingMethod: state.basket.shippingMethod,
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(withUserAgent(Basket))
