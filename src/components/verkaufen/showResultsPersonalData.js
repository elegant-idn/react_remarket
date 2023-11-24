import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { calculatePrice } from "./basket/productOverview"
import axios from "axios/index"
import {_googleAutocomplete} from "../../helpers/helpersFunction";

class ShowResultsPersonalData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeNavItem: 'now',
            showLoginForm: false,
            desiredPayoutTypeValue: null
        }

        this.loginUser = this.loginUser.bind(this)
        this.clickNavItem = this.clickNavItem.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.showLoginForm = this.showLoginForm.bind(this)
        this.showSocialRegisterForm = this.showSocialRegisterForm.bind(this)
        this.changeDesiredPayoutType = this.changeDesiredPayoutType.bind(this)
        this.handlerBlurInputUIDNumber = this.handlerBlurInputUIDNumber.bind(this)
        this.calculateTotalPrice = this.calculateTotalPrice.bind(this)
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
        let totalPrice = this.props.price,
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


    render() {
        let { changeCountry, country, inputCheckbox, changeCheckbox, ifErrorPayment, error,
                user, goToDelivery, price, uidNumberField, handlerChangeInput } = this.props,
            { activeNavItem, desiredPayoutTypeValue } = this.state,
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            classUidNumberRow = inputCheckbox.company
                ? uidNumberField ? "rowInputs uid-number-wrap show-input" : "rowInputs uid-number-wrap"
                : "rowInputs uid-number-wrap hide",
            totalPrice = this.calculateTotalPrice().totalPrice,
            basketPrice = this.calculateTotalPrice().basketPrice

        return (
            <div className="personalData">
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
                    <div className="">
                        {!window.isMobile &&
                        <button type="button"
                            className="btn"
                            onClick={this.showLoginForm}>
                            Einloggen
                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                        </button>
                        }
                        {window.isMobile &&
                        <div className="topPersonalData">
                            <label>
                                <input type="checkbox"
                                       onChange={changeCheckbox}
                                       name="asGuest"
                                       className="checkbox-login-as-guest"/>
                                <span className="check"/>
                                Als Gast registrieren - hierbei wird kein Benutzeraccount erstellt</label>
                        </div>
                        }
                        <h3>Registration - Ihre Angaben:</h3>
                        {/*
                          <div className="social">
                            <div className="social-btn facebook"
                                 onClick={() => this.showSocialRegisterForm('facebook')}>
                                <div className="logo">
                                    <img src="/images/design/logo-fb-simple.svg" alt=""/>
                                </div>
                                <div className="text">facebook</div>
                            </div>
                            <div className="social-btn google"
                                 onClick={(e) => this.showSocialRegisterForm('googleplus')}>
                                <div className="logo">
                                    <img src="/images/design/logo-google-plus.svg" alt=""/>
                                </div>
                                <div className="text">google+</div>
                            </div>
                        </div>
                        */}
                    </div>
                    {!window.isMobile &&
                    <div className="topPersonalData">
                        <label><input type="checkbox"
                                      onChange={changeCheckbox}
                                      name="asGuest"
                                      className="checkbox-login-as-guest"/>
                            <span className="check"/>
                            Als Gast registrieren - hierbei wird kein Benutzeraccount erstellt</label>
                    </div>
                    }
                </div>
                }
                <div className="wrapperItemBasket">
                    <div className="billingForm">
                        <div className="row">
                            <div className="col-md-6">
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
                                    <input type="text" name="companyName" placeholder="Firma" required={inputCheckbox.company}/>
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
                                    <input type="text"
                                           onBlur={this.handlerBlurInputUIDNumber}
                                           name="companyUidNumber"
                                           value={uidNumberField}
                                           onChange={handlerChangeInput}
                                           placeholder={uidNumberText[domain].text}
                                           required={inputCheckbox.company}/>
                                </div>
                                <div className=" rowInputs" /*onChange={changeNameField}*/>
                                    <input type="text" name="firstname" placeholder="Vorname" required/>
                                    <input type="text" name="lastname" placeholder="Nachname" required/>
                                </div>
                                <div className="personalDataAddress rowInputs">
                                    <input type="text" name="street" id="route" placeholder="Strasse" required/>
                                    <input type="text" name="number" id="street_number" placeholder="Nr." required/>
                                </div>
                                <div className="personalDataCity rowInputs">
                                    <input type="text" name="zip" placeholder="PLZ" id="postal_code" required/>
                                    <input type="text" name="city" placeholder="Stadt" id="locality" required/>
                                </div>
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
                                <div className=" rowInputs">
                                    <div className="wrapInput">
                                        <input type="email" name="email" className={error.info ? 'error' : null} placeholder="E-Mail" required/>
                                        <span className="errorText">{error.info}</span>
                                    </div>

                                    <input type="tel" name="phone" placeholder="Telefon (mobil)" required/>
                                </div>
                                { !user.isLogin && !inputCheckbox.asGuest &&
                                <div className="inputFullWidth rowInputs password">
                                    <input type="password"
                                           name="password"
                                           placeholder="Passwort (min. 8 Zeichen + min. 1 Nr. )"
                                           className={error.password ? 'error' : null}
                                           onChange={this.changePassword}
                                           required={!ifErrorPayment}/>
                                    <span className="errorText">{error.password}</span>
                                    <div className="statusBarPassword"/>
                                </div>
                                }
                                <label className="shippingAddressCheck"><input type="checkbox"
                                                                               name="shippingAddress"
                                                                               value={inputCheckbox.shippingAddress}
                                                                               defaultChecked={inputCheckbox.shippingAddress}
                                                                               onChange={changeCheckbox}/><span/> Diese Adresse auch für Rücksendungen benutzen</label>
                            </div>
                            <div className="col-md-6">
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
                                    <div className="tab-content">
                                        <div className="item-method">
                                            <div className="wrap-label">
                                                <label className="custom-radio-check">
                                                    <input onChange={this.changeDesiredPayoutType}
                                                           onLoad={this.changeDesiredPayoutType}
                                                           type="radio"
                                                           name="desiredPayoutType"
                                                           value="2" checked="checked" required/>
                                                    <span/>
                                                    <img src="/images/design/sell-payment-bank-icon.svg" alt=""/>
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
                                            <div className="item-column">
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
                            <input type="text" name="customer_companyName" placeholder="Firma" required={inputCheckbox.customerCompanyName}/>
                        </div>

                        <div className="rowInputs" /*onChange={changeNameField}*/>
                            <input type="text" name="customer_firstname" placeholder="Vorname" required={!inputCheckbox.shippingAddress}/>
                            <input type="text" name="customer_lastname" placeholder="Nachname" required={!inputCheckbox.shippingAddress}/>
                        </div>
                        <div className="personalDataAddress rowInputs">
                            <input type="text" name="customer_street" id="customer_route" placeholder="Strasse" required={!inputCheckbox.shippingAddress}/>
                            <input type="text" name="customer_number" id="customer_street_number" placeholder="Nr." required={!inputCheckbox.shippingAddress}/>
                        </div>
                        <div className="personalDataCity rowInputs">
                            <input type="text" name="customer_zip" placeholder="PLZ" id="customer_postal_code" required={!inputCheckbox.shippingAddress}/>
                            <input type="text" name="customer_city" placeholder="Stadt" id="customer_locality" required={!inputCheckbox.shippingAddress}/>
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

                        <div className="rowInputs">
                            {/*<input type="email" name="customer_email" placeholder="E-Mail"/>*/}
                            <input className="inputFullWidth" type="tel" name="customer_phone" placeholder="Telefon (mobil)" required={!inputCheckbox.shippingAddress}/>
                        </div>
                    </div>
                </div>
                {window.isMobile && <button type="button" className="btn toDelivery"
                                            onClick={goToDelivery}>Zu den Lieferoptionen</button>

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
    }
}
