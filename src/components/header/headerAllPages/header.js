import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import * as placesActions from '../../../actions/places';
import * as shopActions from "../../../actions/shop";
import * as userActions from '../../../actions/user';
import { headerController, LoginModalController } from '../../../helpers/helpersFunction';
import AGB from '../../aboutUs/agb';
import CouponFromAds from '../../mainPage/couponFromAds';
import LoginForm from "../loginForm/loginForm";
import LoginFormForgotPassword from "../loginForm/loginFormForgotPassword";



export class HeaderAllPages extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorRegistration: {
                email: '',
                phone: '',
                password: '',
                password_confirmation: '',
                code: '',
                socialNoEmail: ''
            },
            errorLogin: {
                infoMsg: '',
                login: '',
                password: '',
                socialNoEmail: '',
                resendActivationLink: '',
                successResend: ''
            },
            showInputCode: false,
            selectedOption: null,
            spinner: null,
            showCouponFromAds: false
        };

        this.loginFacebook = this.loginFacebook.bind(this);
        this.loginGoogle = this.loginGoogle.bind(this);
        this.initFb = this.initFb.bind(this);
        this.initGoogle = this.initGoogle.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.resendActivationEmail = this.resendActivationEmail.bind(this);
        this.handleChangeRegistration = this.handleChangeRegistration.bind(this);
        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.closeLoginForm = this.closeLoginForm.bind(this);
        this.logOut = this.logOut.bind(this);
        this.mapSubcategories = this.mapSubcategories.bind(this);
        this.mapAccessories = this.mapAccessories.bind(this);

        this.toggleCouponFromAds = this.toggleCouponFromAds.bind(this);
    }

    componentDidMount(){
        if(window.isFBConnection){
            this.initFb()
        }
        if(window.isGoogleConnection){
            this.initGoogle()
        }

        this.checkAdsSource()

        LoginModalController.initialize()
        headerController.initialize()

        if(this.props.user.redirectTo){
            document.getElementById("op").checked = true
        }
    };
    componentWillReceiveProps( nextProps ){
        if( nextProps.user.redirectTo !== this.props.user.redirectTo && !this.props.user.redirectTo ){
            document.getElementById("op").checked = true
        }
    };

    _loadPersonalData(token){
        if(token){
            axios.get(`/api/customerAgileData`)
                .then((data) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    document.getElementById("op").checked = false
                    if (data.status === 200) {
                        let redirectUrl = this.props.user.redirectTo,
                            cancelRedirectTo = this.props.user.cancelRedirectToMyAccount
                        this.closeLoginForm()
                        this.props.userActions.loginSuccess(data.data)
                        if(redirectUrl){
                            browserHistory.push(redirectUrl)
                        }
                        else if(!cancelRedirectTo) browserHistory.push('/kundenkonto')
                    }
                })
                .catch(error => {
                })
        }
    };
    checkAdsSource()
    {
        let search_params = new URL(document.URL).searchParams;

        if(search_params.has('coupon') && !window.localStorage.hasOwnProperty("coupon"))
        {
        	 let coupon = search_params.get('coupon')

           axios.get(`/api/checkAdsCoupon?coupon=${coupon}`)
               .then((data) => {
                  if(data.data.status == "ok")
                  {
                      this.toggleCouponFromAds();
                      document.getElementById('coupon_text').innerHTML = coupon;
                      window.localStorage.setItem('coupon', coupon);
                  }
               })
               .catch(error => {})
        }
    };
    toggleCouponFromAds(){
        this.setState({ showCouponFromAds: !this.state.showCouponFromAds })
    };
    resendActivationEmail(){
        let email = $('#customer-email-login').val()
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/resendActivationLink?login=${email}`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ errorLogin: {...this.state.errorLogin,
                    successResend: result.data,
                    login: '',
                    resendActivationLink: '' }
                })
            })
            .catch( error => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({errorLogin: {...this.state.errorLogin, login: error.response.data.errors.login[0] } })
            })
    };
    loginFacebook(e){
        e.preventDefault()
        document.getElementById("op").checked = false
        this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: '' },
                        errorRegistration: {...this.state.errorRegistration, socialNoEmail: '' }
        })
        FB.login( response => {
            let token = response.authResponse.accessToken
            let body = {
                token,
                provider: 'facebook'
            }
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post('/api/socialAuth', body)
                .then( (result) => {
                    this.setState({ spinner: null })
                    window.localStorage.setItem( "token", result.data.token )
                    window.axios.defaults.headers.common['Authorization-Token'] = result.data.token
                    this._loadPersonalData(result.data.token)
                })
                .catch( error => {
                    if(error.response.status === 404 ){
                        document.getElementById('spinner-box-load').style.display = 'none'
                        document.getElementById("op").checked = true
                        this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: error.response.data },
                                        errorRegistration: {...this.state.errorRegistration, socialNoEmail: error.response.data }
                        })
                    }
                })

        }, { scope: 'email' })
    };
    initFb(){
        window.fbAsyncInit = function() {
            FB.init({
                appId      : window.oauthIds.facebookId,
                xfbml      : true,
                version    : 'v2.9'
            });
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };
    initGoogle(){
        window.gapiAuth2 = null
        if (typeof gapi !== 'undefined') {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: window.oauthIds.googleId
                })
                    .then( ( data ) => {
                        window.gapiAuth2 = data
                    })
            });    
        }
    };
    loginGoogle(e){
        e.preventDefault()
        document.getElementById("op").checked = false
        this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: '' },
                        errorRegistration: {...this.state.errorRegistration, socialNoEmail: '' }
        })
        window.gapiAuth2.signIn()
            .then( data => {
                document.getElementById('spinner-box-load').style.display = 'block'
                let token = data.Zi.access_token
                let body = {
                    token,
                    provider: 'google'
                }
                axios.post('/api/socialAuth', body)
                    .then( (result) => {
                        this.setState({ spinner: null })
                        window.localStorage.setItem( "token", result.data.token )
                        window.axios.defaults.headers.common['Authorization-Token'] = result.data.token
                        this._loadPersonalData(result.data.token)
                    })
                    .catch( error => {
                        if(error.response.status === 404 ){
                            document.getElementById('spinner-box-load').style.display = 'none'
                            document.getElementById("op").checked = true
                            this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: error.response.data },
                                            errorRegistration: {...this.state.errorRegistration, socialNoEmail: error.response.data }
                            })
                        }
                    })
            })
    };
    closeLoginForm(){
        [...document.querySelectorAll('.simform input:not([type=submit])')].forEach( item => item.value = '' )
        this.setState({ errorRegistration: { email: '',phone: '',password: '',password_confirmation: '', socialNoEmail: ''},
                        errorLogin: { infoMsg: '',login: '',password: '', socialNoEmail: '', resendActivationLink: '', successResend: ''},
                        showInputCode: false,
                        spinner: null
        })
        this.props.userActions.setRedirectTo(false)
        this.props.userActions.cancelRedirectToMyAccount(false)
        $('.login-box-wrapper').css({display: 'none'})
    };
    handleChangeRegistration(e){
        let { name, value } = e.target,
            { errorRegistration } = this.state
        //password status bar
        if(name === 'password' || name === 'password_confirmation' ){
            let regular =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
            if(regular.test(value.trim())){
                $(e.target).parents('.input').find('.statusBarPassword').css({ background: '#00cb94'})
            }
            else{
                $(e.target).parents('.input').find('.statusBarPassword').css({ background: '#ff0000'})
            }
        }

        errorRegistration[name] = null
        this.setState({ errorRegistration })
    };
    handleChangeLogin(e){
        let { name } = e.target,
            { errorLogin } = this.state
        errorLogin.infoMsg=''
        errorLogin[name] = null
        if(name == 'login') {
            errorLogin.successResend = null
            errorLogin.resendActivationLink = null
        }
        this.setState({ errorLogin })
    };
    registerUser(e){
        e.preventDefault()
        if(!this.state.showInputCode){
            let url = '/api/register'
            let data = new FormData(document.forms.registrationForm)
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post(url, data)
                .then( result =>{
                    document.getElementById('spinner-box-load').style.display = 'none'
                    if(result.data.status === 'false'){
                        if(result.data.errorType === 'phone'){
                            let phone = result.data.message
                            this.setState({ errorRegistration: {...this.state.errorRegistration, email: '', phone, password: '',password_confirmation: '', code: '' }, spinner: null })
                        }
                        if(result.data.errorType === 'email'){
                            let email = result.data.message
                            this.setState({ errorRegistration: {...this.state.errorRegistration, email, phone: '', password: '',password_confirmation: '', code: '' }, spinner: null })
                        }
                    }
                    else if(result.data.smsWasSent) {
                        this.setState({ showInputCode: true, spinner: null })
                    }
                    else {
                        document.getElementById("op").checked = false
                        this.closeLoginForm()
                        browserHistory.push('/confirm-email')
                    }
                })
                .catch( ( error ) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    let err = error.response.data.errors,
                        email, phone, password, password_confirmation
                    if(err){
                        err.email ? email = err.email[0] : ''
                        err.phone ? phone = err.phone[0] : ''
                        err.password ? password = password_confirmation = err.password[0] : ''
                    }
                    this.setState({ errorRegistration: {...this.state.errorRegistration, email, phone, password, password_confirmation }, spinner: null })
                })
        }
        else{
            let url = '/api/confirm/phone'
            let data = new FormData(document.forms.registrationForm)
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post(url, data)
                .then( response => {
                    window.localStorage.setItem( "token", response.data.token )
                    window.axios.defaults.headers.common['Authorization-Token'] = response.data.token
                    this._loadPersonalData(response.data.token)
                } )
                .catch( error => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    if(error.response.status === 404){
                        let err = error.response.data,
                            code
                        if(err){
                            code = err
                        }
                        this.setState({ errorRegistration: {...this.state.errorRegistration, code }, spinner: null })
                    }
                    else{
                        let err = error.response.data.message,
                            code
                        if(err){
                            code = err
                        }
                        this.setState({ errorRegistration: {...this.state.errorRegistration, code }, spinner: null })
                    }


                })
        }
    };
    globalClick = e =>{

        if (e.target.id == 'kaufenMenu')
        {
            // $('.wrap-sub-category').css({ opacity: '1' });
            // $('.wrap-sub-category').css({ visibility: 'visible' });
            // $('.sub-category').css({ transform: 'none' });
        }
        else
        {
            // $('.wrap-sub-category').css({ opacity: '0' });
            // $('.wrap-sub-category').css({ visibility: 'hidden' });
        }

        if (e.target.tagName.toLowerCase() === 'a')
        {
            this.props.shopActions.definedCounerForSearchInput(' ');
        }
    };
    loginUser(e){
        e.preventDefault()
        let url = '/api/login'
        let data = new FormData(document.forms.loginForm)
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post(url, data)
            .then( result =>{
                if(result.data.status === 'false'){
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
                document.getElementById('spinner-box-load').style.display = 'none'
                let err = error.response.data.errors,
                    login, password
                if(err){
                    err.login ? login = err.login[0] : ''
                    err.password ? password = err.password[0] : ''
                }
                this.setState({ errorLogin: {...this.state.errorLogin, login, password }, spinner: null })
            })
    };
    logOut(){
        if (window.gapiAuth2)
            window.gapiAuth2.disconnect()
        window.localStorage.removeItem("token")
        delete window.axios.defaults.headers.common['Authorization-Token']
        this.props.userActions.logOut()
    };
    mapSubcategories(device, i){
        if(device.name === "Zubehör") return '';
        let currentDeviceName = this.props.params.deviceCategory1 && this.props.params.deviceCategory1.replace(/-/g, ' ')
        let className = '',
            deviceCategories = [device.name.replace( / /g, '-').toLowerCase()],
            computerIds = [8, 15, 23, 24]

        if(device.submodels && computerIds.every( item => item != device.id)) mapSubmodels(device.submodels)
        let strUrl = deviceCategories.join('/') + '/filter'

        device.name.toLowerCase() === currentDeviceName
            ? className = 'current item-sub-menu'
            : className = 'item-sub-menu'

        function mapSubmodels(submodels){
            deviceCategories.push(submodels[0].name.replace( / /g, '-').toLowerCase())
            if(submodels[0].submodels) mapSubmodels(submodels[0].submodels)
        }

        return  <Link to={`/kaufen/${strUrl}`}
                      className={ className }
                      key={device.id}>
            <span className="image"><img className="menuButton" src={ `/images/design/${device.id}device.svg` } /></span>
            <span className="image"><img className="menuButton" src={ `/images/design/${device.id}activeDevice.svg` } /></span>
            <span className="name">{device.name}</span>
        </Link>
    };
    mapAccessories(item, i){
            let { params } = this.props,
                index = 2,
                className = '',
                strPrevUrl = '';
            /*get prev url*/
            for(let key in params){
                let paramKeyIndex = key.slice(14)
                if(key.includes('deviceCategory') && params[key] && +paramKeyIndex < index) strPrevUrl += params[key] + '/'
            }
            /*add current name*/
            strPrevUrl += item.name.toLowerCase().replace(/ /g, '-') + '/'
            /*add submodels url*/
            function mapSubmodels(submodels){
                strPrevUrl += submodels[0].name.replace( / /g, '-').toLowerCase() + '/'
                if(submodels[0].submodels) mapSubmodels(submodels[0].submodels)
            }
            if(item.submodels) mapSubmodels(item.submodels)

            if( params['deviceCategory' + index]
                && params['deviceCategory' + index].replace( /-/g, ' ') === item.name.toLowerCase()) className = 'current item-sub-menu'
            else
                className = 'item-sub-menu'
                return  <Link to={`/kaufen/zubehör/${strPrevUrl}filter`}
                              className={ className }
                              key={item.id}>
                    {item.images && <span className="image"><img src={item.images[0]} className="deviceIcon" alt=""/></span>}
                    {item.images && <span className="image"><img src={item.images[0]} className="deviceIcon" alt=""/></span>}
                    <span className="name">{item.name}</span>
                </Link>
    };
    handleChangePlace = (selectedOption) => {
        this.setState({ selectedOption });
        const { data } = JSON.parse(window.localStorage.getItem("locationData"))
        data.forEach((item) =>{
            if (item.id === selectedOption.id) {
                item.active =  true
            }
            else {
                item.active = false
            }
        })
        const{ setLocation } = this.props.placesActions
        setLocation(selectedOption);
        window.localStorage.setItem("locationData", JSON.stringify({data}))


    };
    optionRenderer = (item) => {
        return (
            <div className={`img-item item-${item.id}`}>
                <img alt='' src={`/images/${item.id}.svg`} />
                <div>
                    <strong>
                        {item.descriptionBranch}
                    </strong><br/>
                    {item.address}, {item.zip} {item.city}
                </div>
            </div>
        )
    };
    valueSelected = (item) => {
        return (
            <div className='valueSelected'>
                <span><img alt='' src={`/images/${item.id}.svg`} style={{marginRight: '5px'}}/></span>
                <div>
                    <strong>
                        {item.descriptionBranch}
                    </strong>
                    <p style={{margin : '0px', padding: '0px'}}>
                        {item.address}, {item.zip} {item.city}
                    </p>
                    <span/>
                </div>
            </div>
        )
    };

    render(){
        let { spinner, errorRegistration, errorLogin, showInputCode, selectedOption } = this.state,
            { devices } = this.props.shop,
            { pathname } = this.props.location,
            zubenhor = devices.find(item => (item.name === "Zubehör")),
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1];
        const  data  = JSON.parse(window.localStorage.getItem("locationData"));

        const active = {};
        if(data){
            active.place = data.data.find(item => item.active === true);
            if( active.place == null ) {
                active.place = data.data[0];
            }
        }

        let path = pathname.split('/')[1],
            ///40px - corona notice
        height = $('.headerAllPages').height()+40,
        style = {
            position: 'fixed',
            top: 0,
            zIndex: 9999,
            background: '#fff',
            width: '100%'
        };
        return (
            <header onClick={this.globalClick} style={ path === 'verkaufen' ? {height: height + 'px'} : null }>
                {/* <div className="fake-header" /> */}
                <div className="headerAllPages scrolling-header"
                     style={ path === 'verkaufen' ? {...style} : null }  >
                    <div className="container-fluid" style={{width: '95%'}}>
                        <div className="row">
                            <div className="col-sm-5">
                                <div className="header-logo">
                                    <Link to="/">
                                        <span className={domain === 'ch' ? "header-image" : "header-image-de"}></span>
                                    </Link>
                                    <div className="select-input-place">
                                        {data &&
                                        <Select
                                            value={selectedOption?selectedOption:active.place}
                                            onChange={this.handleChangePlace}
                                            options={data.data}
                                            classNamePrefix="Select-input-place"
                                            optionRenderer={this.optionRenderer.bind(this)}
                                            valueRenderer={this.valueSelected.bind(this)}
                                            isSearchable={false}
                                        />
                                        }
                                    </div>
                                    <a  href={active.place?'tel:'+active.place.phoneFull:''} className="place-mobile">
                                        <img src="/images/design/phone.svg" alt=""/>
                                        <span>{active.place?active.place.phone:''}</span>
                                    </a>
                                    <div className="place-open">
                                        <span><img src="/images/design/time-clock.svg" alt=""/></span>
                                        <span className="place-open-menu">Öffnungszeiten</span>
                                        {active.place?
                                            <ul>
                                            <span className='place-open-title'>
                                                {active.place.address}<br/>
                                                {active.place.zip} {active.place.city}
                                            </span>
                                                <li>
                                                    <span>Mo :</span>
                                                    <span>{active.place.openingHours.mon}</span>
                                                </li>
                                                <li>
                                                    <span>Di :</span>
                                                    <span>{active.place.openingHours.tue}</span>
                                                </li>
                                                <li>
                                                    <span>Mi :</span>
                                                    <span>{active.place.openingHours.wed}</span>
                                                </li>
                                                <li>
                                                    <span>Do :</span>
                                                    <span>{active.place.openingHours.thu}</span>
                                                </li>
                                                <li>
                                                    <span>Fr :</span>
                                                    <span>{active.place.openingHours.fri}</span>
                                                </li>
                                                <li>
                                                    <span>Sa :</span>
                                                    <span>{active.place.openingHours.sat? active.place.openingHours.sat: 'geschlossen'}</span>
                                                </li>
                                                <li>
                                                    <span>So :</span>
                                                    <span>{active.place.openingHours.sun? active.place.openingHours.sun: 'geschlossen'}</span>
                                                </li>
                                            </ul>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                { <nav>
                                    <ul id="header-menu_big" className="header-menu">
                                        <li>

                                            <Link to="/" activeClassName="active" >
                                                { pathname.split('/')[1] === ' ' ? <span><img alt="Home" src="/images/design/home-green.svg"/></span> : <span><img alt="Home" src="/images/design/home.svg"/></span>}
                                                Startseite</Link>
                                        </li>
                                        <li>
                                            <Link to="/verkaufen" activeClassName="active" >
                                                { pathname.split('/')[1] === 'verkaufen' ? <span><img src="/images/design/sell-icon-green.svg"/></span> : <span><img src="/images/design/sell-icon-gray.svg"/></span>}
                                                Verkaufen</Link>
                                        </li>
                                        <li>
                                            <Link to="/kaufen" activeClassName="active" id="kaufenMenu">
                                                { pathname.split('/')[1] === 'kaufen' ?  <span><img src="/images/design/buy-green.svg"/></span> :  <span><img src="/images/design/buy.svg"/></span>}
                                                Kaufen</Link>
                                                {!window.isMobile &&
                                                <div className="wrap-sub-category">
                                                    <div className="sub-category">
                                                        <div className="title">
                                                            <span>Geräte</span>
                                                            <div className="line"/>
                                                        </div>
                                                        <div className="devices">
                                                            {devices.map(this.mapSubcategories)}
                                                        </div>
                                                        <div className="title">
                                                            <span>Zubehör</span>
                                                            <div className="line"/>
                                                        </div>
                                                        <div className="devices">
                                                            {zubenhor ? zubenhor.submodels.map(this.mapAccessories): ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                }
                                        </li>
                                        <li>
                                            <a href="https://www.ireparatur.ch/" target="_blank">
                                                <span><img src="/images/design/settings-gray.svg"/></span>
                                                Reparieren</a>
                                        </li>
                                        <li>
                                            <Link to="/kontakt" activeClassName="active">
                                                { pathname.split('/')[1] === 'kontakt' ? <span><img src="/images/design/contact-green2.svg"/></span> : <span><img src="/images/design/contact-gray2.svg"/></span>}
                                                Kontakt</Link>
                                        </li>
                                    </ul>
                                </nav>}
                            </div>
                            <div className="col-sm-2">
                                <div className="row fr">
                                    <input type="checkbox" id="op" className="op"/>
                                    <LoginForm registerUser={this.registerUser}
                                               showInputCode={showInputCode}
                                               loginUser={this.loginUser}
                                               errorRegistration={errorRegistration}
                                               errorLogin={errorLogin}
                                               resendActivationEmail={this.resendActivationEmail}
                                               handleChangeRegistration={this.handleChangeRegistration}
                                               handleChangeLogin={this.handleChangeLogin}
                                               closeLoginForm={this.closeLoginForm}
                                               loginFacebook={this.loginFacebook}
                                               showMenu={true}
                                               loginGoogle={this.loginGoogle}/>
                                    <input type="checkbox" id="forgotPassword"/>
                                    <LoginFormForgotPassword />
                                    { !this.props.user.isLogin ?
                                        <span className="lower">
                                            <label className="login" onClick={()=>$('.login-box-wrapper').css({display: 'block'})} htmlFor="op">Einloggen</label>
                                        </span>
                                        :
                                        <span className="userButtons lower">
                                            <span className="image">
                                                {this.props.user.data && this.props.user.data.systemAddress.first_name
                                                && this.props.user.data.systemAddress.first_name.slice(0,1).toUpperCase()}
                                             </span>
                                            <span className="userHello">
                                                {domain === 'de' ? 'Hallo' : 'Grüezi'}
                                                {this.props.user.data && this.props.user.data.systemAddress.first_name ? ', ' : ''}
                                                <span className="user-name">
                                                    {this.props.user.data && this.props.user.data.systemAddress.first_name}!
                                                </span>
                                                <div className="userLinks">
                                                    <Link to="/kundenkonto">Mein Konto</Link>
                                                    <span onClick={this.logOut}>Ausloggen</span>
                                                </div>
                                            </span>


                                        </span>

                                    }
                                    <span className="basketButtons">
                                        <span className="basket">
                                            <img src="/images/design/cart-icon-green.svg" alt=""/>
                                            { this.props.basket.countVerkaufen + this.props.basket.count > 0 &&
                                            <span className="count cart-total-kaufen">
                                                        {this.props.basket.countVerkaufen + this.props.basket.count}
                                                    </span>
                                            }
                                        </span>
                                        <div className="basketLinks">
                                            <Link to="/warenkorb" className={this.props.basket.count > 0 ? 'full' : ''} >
                                                Warenkorb{ this.props.basket.count > 0 && <span>({this.props.basket.count})</span>}
                                            </Link>
                                            <Link to="/verkaufen/warenkorb" className={this.props.basket.countVerkaufen > 0 ? 'full' : ''} >
                                                Verkaufskorb{ this.props.basket.countVerkaufen > 0 && <span> ({this.props.basket.countVerkaufen})</span>}
                                            </Link>
                                        </div>
                                    </span>

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                { this.props.showMenu && <nav>
                                    <ul id="header-menu_small" className="header-menu">
                                        <li>

                                            <Link to="/" activeClassName="active" >
                                                { pathname.split('/')[1] === ' ' ? <img alt="Home" src="/images/design/home-green.svg"/> : <img alt="Home" src="/images/design/home.svg"/>}
                                                Startseite</Link>
                                        </li>
                                        <li>
                                            <Link to="/verkaufen" activeClassName="active" >
                                                { pathname.split('/')[1] === 'verkaufen' ? <img src="/images/design/sell-icon-green.svg"/> : <img src="/images/design/sell-icon-gray.svg"/>}
                                                Verkaufen</Link>
                                        </li>
                                        <li>
                                            <Link to="/kaufen" activeClassName="active" id="kaufenMenu">
                                                { pathname.split('/')[1] === 'kaufen' ? <img src="/images/design/buy-green.svg"/> : <img src="/images/design/buy.svg"/>}
                                                Kaufen</Link>
                                            {!window.isMobile &&
                                            <div className="wrap-sub-category">
                                                <div className="sub-category">
                                                    <div className="title">
                                                        <span>Geräte</span>
                                                        <div className="line"/>
                                                    </div>
                                                    <div className="devices">
                                                        {devices.map(this.mapSubcategories)}
                                                    </div>
                                                    <div className="title">
                                                        <span>Zubehör</span>
                                                        <div className="line"/>
                                                    </div>
                                                    <div className="devices">
                                                        {zubenhor ? zubenhor.submodels.map(this.mapAccessories): ''}
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                        </li>
                                        <li>
                                            <a href="https://www.ireparatur.ch/" target="_blank">
                                                <img src="/images/design/settings-gray.svg"/>
                                                Reparieren</a>
                                        </li>
                                        <li>
                                            <Link to="/kontakt" activeClassName="active">
                                                { pathname.split('/')[1] === 'kontakt' ? <img src="/images/design/contact-green2.svg"/> : <img src="/images/design/contact-gray2.svg"/>}
                                                Kontakt</Link>
                                        </li>
                                    </ul>
                                </nav>}
                                { !this.props.showMenu && <p className="searchResultsTitle">{this.props.searchResults.total} Suchresultate für <span>{this.props.searchResults.searchValue}</span></p> }
                            </div>
                        </div>
                    </div>
                    {spinner}
                    {this.props.msgInfo}
                </div>

                {/* <div className="modal fade bs-example-modal-lg"
                     id="modalAGBReg"
                     tabIndex="-1"
                     data-keyboard="false"
                     role="dialog"
                     aria-labelledby="myLargeModalLabeAgb">
                    <div className="modal-dialog modal-lg" role="document">
                        <button type="button" className="closeModal"
                                onClick={ () => $('#modalAGBReg').modal('hide') }
                                data-dismiss="modal"
                                aria-label="Close"/>
                        <div className="modal-content">
                            <AGB/>
                        </div>
                    </div>
                </div> */}

              {this.state.showCouponFromAds && <CouponFromAds toggleLightbox={this.toggleCouponFromAds}/>}

            </header>
        )
    }

}

function mapStateToProps (state) {
    return {
        user: state.user,
        msgInfo: state.user.msgInfo,
        searchResults: state.shop.searchResults,
        basket: state.basket,
        shop: state.shop,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        shopActions: bindActionCreators(shopActions, dispatch),
        placesActions: bindActionCreators(placesActions, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(HeaderAllPages))
