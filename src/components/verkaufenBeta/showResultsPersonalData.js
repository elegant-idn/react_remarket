import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { calculatePrice } from "./basket/productOverview"
import axios from "axios/index"
import { Animated } from "react-animated-css"
import {_googleAutocomplete} from "../../helpers/helpersFunction";

class ShowResultsPersonalData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeNavItem: 'now',
            showLoginForm: false,
            desiredPayoutTypeValue: null,
            inputCoupon: false,
        }

        this.loginUser = this.loginUser.bind(this)
        this.clickNavItem = this.clickNavItem.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.showLoginForm = this.showLoginForm.bind(this)
        this.showSocialRegisterForm = this.showSocialRegisterForm.bind(this)
        this.changeDesiredPayoutType = this.changeDesiredPayoutType.bind(this)
        this.handlerBlurInputUIDNumber = this.handlerBlurInputUIDNumber.bind(this)
        this.calculateTotalPrice = this.calculateTotalPrice.bind(this)
        this.renderCustomerData = this.renderCustomerData.bind(this)
        this.renderOther = this.renderOther.bind(this)        

    }

    componentDidMount(){
        /*
        axios.get('/api/countries')
            .then(({ data }) => {
                if(window.isGoogleConnection) {
                    _googleAutocomplete.call(this, data.meta.domainId)
                }
                let countriesList = data.data.map( item => { return { value: item['name-short'], label: item['name-de']}})
                this.setState({country: {...this.state.country, countriesList }})
            })
        */
        let remarketDomainId = 2
        let countriesList = [
            {value: 'ch', label: 'Schweiz'},
            {value: 'li', label: 'Liechtenstein'},
        ]
        this.setState({country: {...this.state.country, countriesList}})
        if(window.isGoogleConnection) {
            _googleAutocomplete.call(this, remarketDomainId)
        }
    }
    _setFormFields(data){

        let form = document.forms.editUserProfileForm,
            { country, inputCheckbox } = this.state
        for ( let key in data ){
            switch (key){
                case 'company':
                    if(data[key]){
                        inputCheckbox.systemCompany = true
                        form[key].value = data[key]
                    }
                    else{
                        inputCheckbox.systemCompany = false
                        form[key].value = data[key]
                    }
                    break
                case 'LieferFirmenname':
                    if(data[key]){
                        inputCheckbox.shippingCompany = true
                        form[key].value = data[key]
                    }
                    else{
                        inputCheckbox.shippingCompany = false
                        form[key].value = data[key]
                    }
                    break
                case 'RechnungFirmenname':
                    if(data[key]){
                        inputCheckbox.customerCompany = true
                        form[key].value = data[key]
                    }
                    else{
                        inputCheckbox.customerCompany = false
                        form[key].value = data[key]
                    }
                    break
                case 'Sprache':
                    if (form[key]) form[key].value = data[key]
                    country.currentCountry.system_inputCountry = data[key]
                    break
                case 'LieferLand':
                    if(form[key]) form[key].value = data[key]
                    country.currentCountry.inputCountry = data[key]
                    break
                case 'RechnungLand':
                    if (form[key]) form[key].value = data[key]
                    country.currentCountry.customer_inputCountry = data[key]
                    break
                default:
                    if (form[key]) form[key].value = data[key]
            }
        }
        this.setState({ inputCheckbox, country })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.inputCheckbox.asGuest){
            this.setState({ activeNavItem: 'now', desiredPayoutTypeValue: null })
        }
    }

    changeDesiredPayoutType(e){
        let {value} = e.target
        this.setState({ desiredPayoutTypeValue: value })
    }
    clickNavItem(e){
        if(!this.props.inputCheckbox.asGuest){
            let activeNavItem = e.currentTarget.getAttribute('data-type')
            this.setState({ activeNavItem, desiredPayoutTypeValue: null })
        }
    }
    handlerBlurInputUIDNumber(e){
        if(!e.target.value) $('.uid-number-wrap').removeClass('show-input')
    }
    changePassword(e){
        let { value } = e.target,
            regular =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
        if(regular.test(value.trim())){
            $(e.target).parents('.inputFullWidth').find('.statusBarPassword').css({ background: '#00cb94'})
        }
        else{
            $(e.target).parents('.inputFullWidth').find('.statusBarPassword').css({ background: '#ff0000'})
        }
    }
    showLoginForm() {
        this.props.cancelRedirect(true)
        document.getElementById("op").checked = true
        $('.login-box-wrapper').css({display: 'block'})
    }    
    
    showSocialRegisterForm(type){
        this.props.cancelRedirect(true);
        if (type === 'facebook') {
            FB.login( response => {
                let token = response.authResponse.accessToken;
                let body = {
                    token,
                    provider: type
                }
                axios.post('/api/socialAuth', body)
                    .then( (result) => {
                        window.localStorage.setItem( "token", result.data.token )
                        window.axios.defaults.headers.common['Authorization-Token'] = result.data.token
                        this._loadPersonalData(result.data.token)
                    })
                    .catch( error => {
                        if(error.response.status === 404 ){
                            document.getElementById("op").checked = true
                            this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: error.response.data },
                                errorRegistration: {...this.state.errorRegistration, socialNoEmail: error.response.data }
                            })
                        }
                    })

            }, { scope: 'email' })
        }

        else {
            window.gapiAuth2.signIn()
                .then( data => {
                    let token = data.Zi.access_token
                    let body = {
                        token,
                        provider: 'google'
                    }
                    axios.post('/api/socialAuth', body)
                        .then( (result) => {
                            window.localStorage.setItem( "token", result.data.token )
                            window.axios.defaults.headers.common['Authorization-Token'] = result.data.token
                            this._loadPersonalData(result.data.token)
                        })
                        .catch( error => {
                            if(error.response.status === 404 ){
                            }
                        })
                })
        }
    }
    calculateTotalPrice(){
        let totalPrice = this.props.price.price,
            basketPrice = 0
        this.props.basketDataVerkaufen.forEach( item => {
            if( item.productTypeId == 999 ){
                totalPrice += +item.price
                basketPrice += +item.price
            }
            else {
                totalPrice += calculatePrice(item).price
                basketPrice += calculatePrice(item).price
            }
        })

        return { totalPrice, basketPrice}
    }
    loginFacebook(e){
        e.preventDefault()
        document.getElementById("op").checked = false
        this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: '' },
            errorRegistration: {...this.state.errorRegistration, socialNoEmail: '' }
        })
        FB.login( response => {
            let token = response.authResponse.accessToken;
            let body = {
                token,
                provider: 'facebook'
            }
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post('/api/socialAuth', body)
                .then( (result) => {
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
    }
    loginGoogle(e){
        e.preventDefault()
        this.setState({ errorLogin: {...this.state.errorLogin, socialNoEmail: '' },
            errorRegistration: {...this.state.errorRegistration, socialNoEmail: '' }
        })
        document.getElementById("op").checked = false
        window.gapiAuth2.signIn()
            .then( data => {
                let token = data.Zi.access_token
                let body = {
                    token,
                    provider: 'google'
                }
                document.getElementById('spinner-box-load').style.display = 'block'
                axios.post('/api/socialAuth', body)
                    .then( (result) => {
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
    }
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
    }


    loginUser(e){
        let url = '/api/login'
        let data = new FormData(document.forms.loginFormMobile)
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
    }
    activePlaceHolder(e) {
        if (!$(e.currentTarget).hasClass('focused')) {
            $(e.currentTarget).addClass('focused')
            $('#coupon_input').focus()
        }
    }
    deactivePlaceHolder(e) {
        if($('#coupon_input').val() == "")
            $('#coupon_placeholder').removeClass('focused')
    }
    renderCustomerData = () => {
        let { changeCountry, country, inputCheckbox, changeCheckbox, ifErrorPayment, error,
            user, goToDelivery, uidNumberField, handlerChangeInput } = this.props,
        domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
        classUidNumberRow = inputCheckbox.company
            ? uidNumberField ? "rowInputs uid-number-wrap show-input" : "rowInputs uid-number-wrap"
            : "rowInputs uid-number-wrap hide"
        return (
            <div className="customer-data">
                <h3 className="title"><span className="num">1</span><span className="text">Persönliche Daten</span>
                    <span className="arrow"><i className="fa fa-angle-up" aria-hidden="true"/></span>
                </h3>
                {(this.state.showLoginForm && window.isMobile) &&
                    <form name="loginFormMobile">
                        <p>
                            <input type="text" placeholder="password"/>
                        </p>
                        <p>
                            <input type="text" placeholder="e-mail"/>
                        </p>
                        <button type="button"
                                className="btn right"
                                onClick={this.showLoginForm}>
                            Einloggen
                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                        </button>
                    </form>}
                {!user.isLogin &&
                <div className="login-buttons sell-form">
                    <h3>Ihre Angaben:</h3>                        
                    <div className="topPersonalData as-guest">
                        <label><input type="checkbox"
                                    onChange={changeCheckbox}
                                    name="asGuest"
                                    className="checkbox-login-as-guest"/>
                            <span className="check"/>
                            Als Gast verkaufen - hierbei wird kein Benutzeraccount erstellt</label>
                    </div>
                </div>
                }
                <div className="wrapperItemBasket" style={{display: 'block'}}>
                    <div className="billingForm">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="topPersonalData">
                                    <div className="wrapLabel">
                                        <label><input type="radio" name="gender" value="Herr" required/><span/>Herr</label>
                                        <label><input type="radio" name="gender" value="Frau" required/><span/>Frau</label>
                                        <label><input type="checkbox"
                                                    name="company"
                                                    checked={inputCheckbox.company}
                                                    onChange={changeCheckbox}/>
                                            <span className="check"/>
                                            Firma</label>
                                    </div>
                                </div>
                                <div className={inputCheckbox.company ? " rowInputs" : " rowInputs hide" }>
                                    <div className="input-wrapper">
                                        <input type="text" name="companyName" placeholder="Firma" required={inputCheckbox.company}/>
                                        <span className='placeholder'>Firma</span>
                                    </div>
                                </div>
                                <div className={classUidNumberRow}>
                                    <div className="text">
                                            <span onClick={() => $('.uid-number-wrap').addClass('show-input').find('input').focus()}>
                                                +{uidNumberText[domain].text}</span>
                                        <div className="question-sign">
                                            <img src="/images/design/question_condition.svg" alt=""/>
                                            <div className="info-icon-text">{uidNumberText[domain].tooltip}</div>
                                        </div>
                                    </div>                                    
                                    <div className="input-wrapper">
                                        <input type="text"
                                            onBlur={this.handlerBlurInputUIDNumber}
                                            name="companyUidNumber"
                                            value={uidNumberField}
                                            onChange={handlerChangeInput}
                                            placeholder={uidNumberText[domain].text}
                                            required={inputCheckbox.company}/>
                                        <span className='placeholder'>{uidNumberText[domain].text}</span>
                                    </div>
                                </div>
                                <div className="rowInputs-wrapper">
                                    <div className=" rowInputs">
                                        <div className="input-wrapper adjust-wrapper">
                                            <input type="text" name="firstname" placeholder='Vorname' required/>
                                            <span className='placeholder'>Vorname</span>                                
                                        </div>
                                        <div className="input-wrapper">
                                            <input type="text" name="lastname" placeholder="Nachname" required/>
                                            <span className='placeholder'>Nachname</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rowInputs-wrapper">
                                    <div className="rowInputs">
                                        <div className="input-wrapper adjust-wrapper">
                                            <input type="email" name="email" className={(error.info) ? 'error' : null} placeholder="E-Mail" required/>
                                            <span className='placeholder'>E-Mail</span>
                                            <span className="errorText">{error.info}</span>
                                        </div>
                                        <div className="input-wrapper">
                                            <input type="tel" name="phone" placeholder="Telefon (mobil)" minLength="10" required/>
                                            <span className='placeholder'>Telefon (mobil)</span>
                                        </div>
                                    </div>
                                </div>
                                {window.isDesktop ? (
                                    <div className="rowInputs-wrapper">
                                        <div className="personalDataAddress rowInputs">
                                            <div className="input-wrapper input-wrapper-lg">
                                                <input type="text" name="street" id="route" placeholder="Strasse"  required/>
                                                <span className='placeholder'>Strasse</span>
                                            </div>
                                            <div className="input-wrapper input-wrapper-sm">
                                                <input type="text" name="number" id="street_number" placeholder="Nr." required/>
                                                <span className='placeholder'>Nr.</span>
                                            </div>
                                        </div>
                                        <div className="personalDataCity rowInputs">
                                            <div className="input-wrapper input-wrapper-sm">
                                                <input type="text" name="zip" placeholder="PLZ" id="postal_code" required/>
                                                <span className='placeholder'>PLZ</span>
                                            </div>
                                            <div className="input-wrapper input-wrapper-lg">
                                                <input type="text" name="city" placeholder="Stadt" id="locality" required/>
                                                <span className='placeholder'>Stadt</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="rowInputs-wrapper">
                                            <div className="rowInputs">
                                                <div className="input-wrapper">
                                                    <input type="text" name="street" id="route" placeholder="Strasse"  required/>
                                                    <span className='placeholder'>Strasse</span>
                                                </div>
                                                <div className="input-wrapper input-wrapper-sm d-none">
                                                    <input type="text" name="number" id="street_number" placeholder="Nr." />
                                                    <span className='placeholder'>Nr.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rowInputs-wrapper">
                                            <div className="rowInputs">   
                                                <div className="input-wrapper input-wrapper-sm d-none">
                                                    <input type="text" name="zip" placeholder="PLZ" id="postal_code"/>
                                                    <span className='placeholder'>PLZ</span>
                                                </div>
                                                <div className="input-wrapper">
                                                    <input type="text" name="city" placeholder="Stadt" id="locality" required/>
                                                    <span className='placeholder'>Stadt</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}                                
                                <div className="select">
                                    { !country.countriesList.some( item => item.value === country.currentCountry.inputCountry.toLowerCase() )
                                    && <input className="requiredSelect" type="text" required/>}
                                    <Select
                                        placeholder="Auswählen..."
                                        value={country.currentCountry.inputCountry.toLowerCase()}
                                        name="inputCountry"
                                        clearable={false}
                                        options={country.countriesList}
                                        searchable={false}
                                        required={true}
                                        onChange={ (val) => changeCountry(val,"inputCountry")}/>
                                </div>

                                { !user.isLogin && !inputCheckbox.asGuest &&
                                <div className="inputFullWidth rowInputs password">
                                    <div className="input-wrapper">
                                        <input type="password"
                                            name="password"
                                            placeholder="Passwort (min. 8 Zeichen + min. 1 Nr.)"
                                            className={error.password ? 'error' : null}
                                            onChange={this.changePassword}
                                            required={!ifErrorPayment}/>
                                            <span className='placeholder'>Passwort (min. 8 Zeichen + min. 1 Nr.)</span>
                                        <span className="errorText">{error.password}</span>
                                    </div>
                                    <div className="statusBarPassword"/>
                                </div>
                                }
                                <label className="shippingAddressCheck"><input type="checkbox"
                                                                            name="shippingAddress"
                                                                            value={inputCheckbox.shippingAddress}
                                                                            defaultChecked={inputCheckbox.shippingAddress}
                                                                            onChange={changeCheckbox}/><span/> Diese Adresse auch für Rücksendungen benutzen</label>
                            </div>                            
                        </div>
                    </div>
                    <div className={ inputCheckbox.shippingAddress === true ? 'hide shippingForm' : 'shippingForm'}>
                        <div className="topPersonalData">
                            <div className="wrapLabel">
                                <label><input type="radio" name="customer_gender" value="Herr" required={!inputCheckbox.shippingAddress}/><span/>Herr</label>
                                <label><input type="radio" name="customer_gender" value="Frau" required={!inputCheckbox.shippingAddress}/><span/>Frau</label>
                                <label><input type="checkbox"
                                            name="customerCompanyName"
                                            value={true}
                                            defaultChecked={inputCheckbox.customerCompanyName}
                                            onClick={changeCheckbox}/><span className="check"/>
                                    Firma</label>
                            </div>
                        </div>
                        <div className={inputCheckbox.customerCompanyName ? "rowInputs" : "rowInputs hide" }>                                
                            <div className="input-wrapper">
                                <input type="text" name="customer_companyName" placeholder="Firma" required={inputCheckbox.customerCompanyName}/>
                                <span className='placeholder'>Firma</span>                                    
                            </div>
                        </div>
                        <div className="rowInputs-wrapper">
                            <div className="rowInputs">
                                <div className="input-wrapper adjust-wrapper">
                                    <input type="text" name="customer_firstname" placeholder='Vorname' required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Vorname</span>
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" name="customer_lastname" placeholder="Nachname" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Nachname</span>
                                </div>
                            </div>
                        </div>
                        <div className="rowInputs-wrapper">
                            <div className="personalDataAddress rowInputs">
                                <div className="input-wrapper input-wrapper-lg">
                                    <input type="text" name="customer_street" id="customer_route" placeholder="Strasse" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Strasse</span>
                                </div>
                                <div className="input-wrapper input-wrapper-sm">
                                    <input type="text" name="customer_number" id="customer_street_number" placeholder="Nr." required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Nr.</span>
                                </div>
                            </div>
                            <div className="personalDataCity rowInputs">
                                <div className="input-wrapper input-wrapper-sm">
                                    <input type="text" name="customer_zip" placeholder="PLZ" id="customer_postal_code" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>PLZ</span>
                                </div>
                                <div className="input-wrapper input-wrapper-lg">
                                    <input type="text" name="customer_city" placeholder="Stadt" id="customer_locality" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Stadt</span>
                                </div>
                            </div>
                        </div>
                        <div className="select">
                            { !country.countriesList.some( item => item.value === country.currentCountry.customer_inputCountry.toLowerCase() )
                            && inputCheckbox.shippingAddress !== true
                            && <input className="requiredSelect" type="text" required/>}
                            <Select
                                placeholder="Auswählen..."
                                value={country.currentCountry.customer_inputCountry.toLowerCase()}
                                name="customer_inputCountry"
                                clearable={false}
                                options={country.countriesList}
                                searchable={false}
                                onChange={ (val) => changeCountry(val,"customer_inputCountry")}/>
                        </div>
                        <div className="rowInputs-wrapper">
                            <div className="rowInputs">
                                {/*<input type="email" name="customer_email" placeholder="E-Mail"/>*/}
                                {/* <div className="input-wrapper adjust-wrapper">
                                    <input type="tel" name="customer_phone" placeholder="Telefon (mobil)" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Telefon (mobil)</span>
                                </div> */}

                                <div className="input-wrapper adjust-wrapper">
                                    <input type="email" name="customer_email" placeholder="E-Mail" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>E-Mail</span>
                                    <span className="errorText">{error.info}</span>
                                </div>
                                <div className="input-wrapper">
                                    <input type="tel" name="customer_phone" placeholder="Telefon (mobil)" minLength="10" required={!inputCheckbox.shippingAddress}/>
                                    <span className='placeholder'>Telefon (mobil)</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {window.isMobile && <button type="button" className="btn toDelivery"
                                            onClick={goToDelivery}>Zu den Lieferoptionen</button>

                }
            </div> 
        )
    }
    renderOther = () => {
        let { price, userAnswers, storageSellDeadline, showAddCoupon, coupon, changeCoupon, inputCoupon, setInputCoupon } = this.props,
        { activeNavItem } = this.state,
        totalPrice = this.calculateTotalPrice().totalPrice,
        basketPrice = this.calculateTotalPrice().basketPrice
        return (
            <div className="other-data">
                <div className="price-info">
                    <div className="image">
                        <img src={userAnswers.image} alt=""/>
                    </div>
                    {
                        storageSellDeadline && storageSellDeadline.isActive && !storageSellDeadline.sellDeadlineExpired && price.couponPrice
                            ?
                            <div className="price">
                                <p className="title">Ihr Preis</p>
                                <p className='oldPrice value'>
                                    {price.price} {window.currencyValue}
                                </p>
                                <Animated animationIn="bounceIn" animationInDelay={1000}>
                                    <div>
                                        <p className='value'>
                                            {price.couponPrice} {window.currencyValue}
                                        </p>
                                        <p className="couponInfo"><span
                                            className="circleOk"/>Gutschein {storageSellDeadline.couponShortcode} wurde
                                            eingelöst</p>
                                    </div>
                                </Animated>
                            </div>
                            :
                            <div className="price">
                                <p className="title">Ihr Preis</p>
                                <div className='price-area'>
                                    <p className={price.oldPrice > 0 ? 'oldPrice value' : 'value'}>
                                        {price.oldPrice > 0 ? price.oldPrice : price.price} {window.currencyValue}
                                    </p>
                                    {price.oldPrice > 0 && !userAnswers.Model[0].discountPrice > 0 &&
                                    <Animated animationIn="bounceIn" animationInDelay={1000}>
                                        <div>
                                            <p className='value'>
                                                {price.price} {window.currencyValue}
                                            </p>
                                            {/* {coupon.isCoupon && <p className="couponInfo"><span
                                                className="circleOk"/>Gutschein {coupon.couponShortcode} wurde
                                                eingelöst</p>} */}
                                        </div>
                                    </Animated>                                    
                                    }
                                </div>
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
                                    {!inputCoupon && 
                                        <div className='couponField-checkbox'>
                                            <input type="checkbox" id="coupon" onClick={() => setInputCoupon(true)}/>
                                            <label htmlFor="coupon">+ Gutscheincode hinzufügen</label>
                                        </div>                                            
                                    }
                                    {inputCoupon && 
                                        <div className='couponField-input'>
                                            <input type="text"
                                                id="coupon_input"
                                                className={coupon.couponError ? 'errorInput' : ''}
                                                name="coupon"
                                                onBlur={this.deactivePlaceHolder}
                                                onChange={changeCoupon}/>
                                            <span id="coupon_placeholder" className='placeholder' onClick={this.activePlaceHolder}>Gutschein einlösen</span>
                                            <img onClick={() => setInputCoupon(false)} className='coupon-remove' src="/images/design/small-remove-1.svg" alt=""/>
                                            {coupon.couponError &&
                                                <span className="errorText">{coupon.couponError}</span>}
                                        </div>
                                    }
                                </div>
                                }
                            </div>
                    }
                </div>
                <div className="devider" />
                <div className="payment-request">
                    <h3 className="title">Ihr Auszahlungswunsch</h3>
                    <div className="tabs-nav">
                        <div className={activeNavItem === 'later' ? "item-tab active" : "item-tab"}
                                onClick={this.clickNavItem}
                                data-type="later">Zahlungsdaten später angeben</div>
                        <div className={activeNavItem === 'now' ? "item-tab active" : "item-tab"}
                                onClick={this.clickNavItem}
                                data-type="now">Zahlungsdaten jetzt angeben</div>
                    </div>
                    { activeNavItem === 'now' &&
                    <div className="tab-nav-content">
                        <div className="item-method">
                            <div className="wrap-label">
                                <label className="custom-radio-check">
                                    <input onChange={this.changeDesiredPayoutType}
                                            onLoad={this.changeDesiredPayoutType}
                                            type="radio"
                                            name="desiredPayoutType"
                                            value="2" checked="checked" required/>
                                    <span className='mark' />
                                    <img src="/images/design/sell-payment-bank-icon-black.svg" alt=""/>
                                    <div>
                                        Banküberweisung
                                        { basketPrice > 0 && <div className="basketPrice"><strong>+ {basketPrice} {window.currencyValue}</strong> - Es sind mehrere Geräte im Verkaufskorb</div>}
                                    </div>                                        
                                </label>
                                <span className="price">{totalPrice} {window.currencyValue}</span>                                  
                            </div>
                            <div className="inputRow">
                                <input type="text" name="iban" placeholder="Ihre IBAN-Nummer" required/>
                                <div className="image-icon">
                                    <img src="/images/design/qmark-grey.svg" alt=""/>
                                    <span className="info-icon-text">Hier können Sie Ihre IBAN-Nummer (Bankkontonummer) angeben, damit wir Ihnen den Betrag auf dieses Konto auszahlen können. Die IBAN-Nummer steht oft auch auf Ihrer EC-Karte.</span>
                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <div className="item-column marker">
                                <span className="check-icon"/>
                                <div className="image-wrap">
                                    <img src="/images/design/sell-payment-express.svg" alt=""/>
                                </div>
                            </div>
                            <div className="item-column big">
                                <p className="title">Immer inklusive und kostenfrei</p>
                                <p className="descr">Sie erhalten Ihr Geld Express: Auszahlung am gleichen Tag bei Anlieferung vor 14 Uhr. Dauer der Auszahlung auf Ihr Bankkonto im Normalfall 1-2 Werktage.</p>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {window.isDesktop ? 
                    <div className="personalData">
                        {this.renderCustomerData()}
                        {this.renderOther()}
                    </div>
                    :
                    <div className="personalData">
                        {this.renderOther()}
                        {this.renderCustomerData()}
                    </div>
                }
            </div>
        )
    }
}

ShowResultsPersonalData.propTypes = {}
ShowResultsPersonalData.defaultProps = {}
export default ShowResultsPersonalData

const uidNumberText = {
    de: {
        text: 'USt-ID angeben',
        tooltip: 'Bei Angabe der MwSt.-Nr. wird diese als Vorsteuerabzug beim Ankauf angewendet'
    },
    ch: {
        text: 'MwSt.-Nr. angeben',
        tooltip: 'Bei Angabe der USt-ID-Nr. wird diese als Vorsteuerabzug beim Ankauf angewendet'
    },
    loc: {
        text: 'MwSt.-Nr. angeben',
        tooltip: 'Bei Angabe der USt-ID-Nr. wird diese als Vorsteuerabzug beim Ankauf angewendet'
    }
}
