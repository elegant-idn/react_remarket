import axios from "axios/index"
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from "react-router"
import Select from 'react-select'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../../actions/basket'
import { _googleAutocomplete } from '../../../helpers/helpersFunction'
import BankPaymentModal from '../../basket/bankPaymentModal'
import DeliveryByPostSummaryPopup from './deliveryByPostSummaryPopup'
import DeliverySuccessLetter from "./deliverySuccessLetter"



export class DeliveryByPost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            formData: new FormDataValue,
            isChanged: {
                LieferLand: false,
                RechnungLand: false,
                LieferAnrede: false,
                RechnungAnrede: false,
                customerCompany: false,
                shippingCompany: false,
                LieferVorname: false,
                LieferNachname: false,
                RechnungNachname: false,
                RechnungVorname: false,
                LieferFirmenname: false,
                RechnungFirmenname: false,
                LieferTelefon: false,
                RechnungTelefon: false
            },
            country: {
                countriesList: []
            },
            inputCheckbox: {
                shippingAddress: true,
                shippingCompany: false,
                customerCompany: false,
                systemCompany: false
            },
            payMethod: {
                method: null,
                payMethodDatatrans: null
            },
            payForm: null,
            shippingMethods: [],
            showSummaryPopup: false,
            errors: {},
            formSend: false
        }

        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.changeCountry = this.changeCountry.bind(this)
        this.sendForm = this.sendForm.bind(this)
        this.choosePayMethod = this.choosePayMethod.bind(this)
        this._checkShowSpecialPayMethod = this._checkShowSpecialPayMethod.bind(this)
        this.toggleSummaryPopup = this.toggleSummaryPopup.bind(this)
        this.removeFromBasket = this.removeFromBasket.bind(this)
        this._setPersonalDataForm = this._setPersonalDataForm.bind(this)
        this._getShippingMethod = this._getShippingMethod.bind(this)
        this.handlerChangeInput = this.handlerChangeInput.bind(this)
        this.changeShippingMethod = this.changeShippingMethod.bind(this)
        this._addDatatrans = this._addDatatrans.bind(this)
        this._loadStripe = this._loadStripe.bind(this)
    }
    componentDidUpdate(){
        if(!window.isMobile){
            /*find height item-column*/
            let maxHeight = 0
            $('.item-form-column').each( function(){
                if($('div', this).height() > maxHeight) maxHeight = $('div', this).height()
            }).height(maxHeight)
            /*end*/
        }
    }
    componentDidMount(){
        let { basketDataRepair, model } = this.props,
            basket = {...basketDataRepair, modelId: model.id }
        window.localStorage.setItem('basketDataRepair', JSON.stringify(basket))
        /*
        axios.get('/api/countries')
            .then(({data}) => {
                if(window.isGoogleConnection) {
                    _googleAutocomplete.call(this, data.meta.domainId)
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
            _googleAutocomplete.call(this, remarketDomainId)
        }

        this._getShippingMethod()
        this._addDatatrans()

        if(this.props.user.isLogin){
            axios.get(`/api/accountData`)
                .then( ( result ) => this._setPersonalDataForm(result.data) )
        }
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === true){
            axios.get(`/api/accountData`)
                .then( ( result ) => this._setPersonalDataForm(result.data) )
        }
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false) {
            this.setState({ formData: new FormDataValue,
                            inputCheckbox: {...this.state.inputCheckbox,
                                                shippingCompany:false,
                                                customerCompany: false,
                                                systemCompany: false}
            })
        }
    }
    componentWillUnmount(){
        this.props.basketActions.changeShippingMethodRepair(null)

        document.getElementById('datatrans').remove()
        if(this.stripeHandler) this.stripeHandler.close()
    }

    _loadStripe(onload) {
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

    _addDatatrans(){
        //connect datatrans lib
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://pay.datatrans.com/upp/payment/js/datatrans-1.0.2.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'datatrans'));
    }
    changeShippingMethod(e,item){
        this.setState({ errors: {...this.state.errors, [e.target.name]: ''} })
        this.props.basketActions.changeShippingMethodRepair(item)
    }
    _getShippingMethod(){
        axios.get('/api/repairShippingMethods')
            .then( result => {
                if(this.props.shippingMethod){
                    let pickasMethod = result.data.filter( item => item.shortcode === 'PICKAS')[0]
                    this.setState({shippingMethods: [this.props.shippingMethod, pickasMethod]})
                    this.props.basketActions.changeShippingMethodRepair(this.props.shippingMethod)
                }
                else {
                    this.setState({ shippingMethods: result.data })
                }
            })
    }
    _setPersonalDataForm(data){
        let formData = { ...this.state.formData},
            inputCheckbox = { ...this.state.inputCheckbox }

        for(let key in data) {
            if (formData.hasOwnProperty(key)) formData[key] = data[key]
            if (key === 'company') inputCheckbox.systemCompany = !!data[key]
            if (key === 'LieferFirmenname') inputCheckbox.shippingCompany = !!data[key]
            if (key === 'RechnungFirmenname') inputCheckbox.customerCompany = !!data[key]
        }
        this.setState({ formData, inputCheckbox })
    }
    handlerChangeInput(e){
        let { name, value } = e.target,
            form = {...this.state.formData},
            inputCheckbox = {...this.state.inputCheckbox}

        this.autocomleteFieldsShippingBilling(e, form, inputCheckbox)
        this.changeShippingBillingForm(e)

        this.setState({ errors: {...this.state.errors, [name]: null },
                        formData: { ...form, [name]: value},
                        inputCheckbox
        })
    }
    changeCheckbox(e){
        let inputCheckbox = {...this.state.inputCheckbox},
            { name } = e.target

        if(e.target.getAttribute('data-show')){
            e.target.getAttribute('data-show') === 'true'
                ? inputCheckbox.shippingAddress = false
                : inputCheckbox.shippingAddress = true
        }
        else {
            this.autocomleteFieldsShippingBilling(e, {}, inputCheckbox)
            this.changeShippingBillingForm(e)

            inputCheckbox[name] = !inputCheckbox[name]
        }

        this.setState({ inputCheckbox })
    }
    changeCountry(country, name){
        let e = {
                target: {
                    name,
                    value: country.value
                }
            },
            form = {...this.state.formData},
            inputCheckbox = {...this.state.inputCheckbox}

        this.autocomleteFieldsShippingBilling(e, form, inputCheckbox)
        this.changeShippingBillingForm(e)

        this.setState({ formData: { ...form, [name]: country.value },
                        errors: {...this.state.errors, [name]: '' }
        })
    }
    changeShippingBillingForm(e){
        let { name } = e.target,
            isChanged = {...this.state.isChanged }
         if(isChanged.hasOwnProperty(name)){
             isChanged[name] = true
             this.setState({ isChanged })
         }
    }
    autocomleteFieldsShippingBilling(e, form, inputCheckbox){
        let { name, value } = e.target,
            { isChanged } = this.state

        switch(name){
            case 'Geschlecht':
                if(!isChanged.LieferAnrede) form.LieferAnrede = value
                if(!isChanged.RechnungAnrede) form.RechnungAnrede = value
                break
            case 'Sprache':
                if(!isChanged.LieferLand) form.LieferLand = value
                if(!isChanged.RechnungLand) form.RechnungLand = value
                break
            case 'systemCompany':
                if(!isChanged.customerCompany){
                    inputCheckbox.customerCompany = e.target.checked
                }
                if(!isChanged.shippingCompany){
                    inputCheckbox.shippingCompany = e.target.checked
                }
                break
            case 'first_name':
                if(!isChanged.LieferVorname) form.LieferVorname = value
                if(!isChanged.RechnungVorname) form.RechnungVorname = value
                break
            case 'last_name':
                if(!isChanged.LieferNachname) form.LieferNachname = value
                if(!isChanged.RechnungNachname) form.RechnungNachname = value
                break
            case 'company':
                if(!isChanged.LieferFirmenname) form.LieferFirmenname = value
                if(!isChanged.RechnungFirmenname) form.RechnungFirmenname = value
                break
            case 'phone':
                if(!isChanged.LieferTelefon) form.LieferTelefon = value
                if(!isChanged.RechnungTelefon) form.RechnungTelefon = value
                break
        }
    }
    removeFromBasket(item){
        if(item.productTypeId == 11){
            this.props.basketActions.changeShippingMethodRepair(null)
        }
        else{
            let selectedRepairOptions = [ ...this.props.basketDataRepair.selectedOptions ],
                newSelectedOptions = selectedRepairOptions.filter( itemSelected => itemSelected.shortcode !== item.shortcode)
            this.props.basketActions.changeBasketDataRepair(newSelectedOptions)
        }

    }
    toggleSummaryPopup(){
        !this.state.showSummaryPopup ? $('.delivery-form').css({zIndex: '1000001'}) : $('.delivery-form').css({zIndex: 'auto'})
        this.setState({ showSummaryPopup: !this.state.showSummaryPopup })
    }
    _checkShowSpecialPayMethod(){
        let { inputCheckbox, formData } = this.state
        if(inputCheckbox.shippingAddress){
            return (inputCheckbox.systemCompany && formData.company
               && inputCheckbox.customerCompany && formData.RechnungFirmenname )
        }
        else{
            return (inputCheckbox.systemCompany && formData.company
                    && inputCheckbox.shippingCompany && formData.LieferFirmenname
                    && inputCheckbox.customerCompany && formData.RechnungFirmenname )
        }
    }





    sendForm(e){
        e.preventDefault()

        let { basketDataRepair, model } = this.props,
            inputCheckbox = {...this.state.inputCheckbox},
            data = { ...this.state.formData,
                     repairs: basketDataRepair.selectedOptions.map( item => item.shortcode),
                     shippingMethodShortcode: basketDataRepair.shippingMethod.shortcode,
                     shippingAddress: this.state.inputCheckbox.shippingAddress ? 'billing' : 'custom',
                     shippingCompany: inputCheckbox.shippingCompany,
                     customerCompany: inputCheckbox.customerCompany,
                     systemCompany: inputCheckbox.systemCompany,
                     modelId: model.id
            }



        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post('/api/bookingWithShipping', data)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if(result.status === 200){
                    this.setState({ formSend : true });
                    this.props.submitForm();

                    let basket = {...basketDataRepair, modelId: model.id }
                    window.localStorage.setItem('basketDataRepair', JSON.stringify(basket))

                    if(this.state.payMethod.method === 'Datatrans'){
                        this.setState({payForm: <form id="paymentForm"
                                                      data-merchant-id="3000012768"
                                                      data-amount={Math.round(result.data.totalPrice*100)}
                                                      data-currency="CHF"
                                                      data-paymentmethod={ this.state.payMethod.payMethodDatatrans }
                                                      data-refno={result.data.basketShortcode}
                                                      data-sign="180103170812117471">
                            </form>
                        })
                        Datatrans.startPayment({'form': '#paymentForm',
                                                'closed': () => {
                                                    axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&
                                                                    totalPrice=${result.data.totalPrice}&paymentMethod=${this.state.payMethod.payMethodDatatrans}`)
                                                    this.setState({ payForm: null })
                                                }
                        })
                    }
                    else if(this.state.payMethod.method === 'Stripe'){
                        this._loadStripe(() => {
                            let ifPay = false
                            this.stripeHandler = window.StripeCheckout.configure({
                                key: window.stripeKey.key,
                                image: '/images/logo.png',
                                locale: 'auto',
                                currency: 'EUR',
                                token: (token) => {
                                    if(token.id){
                                        document.getElementById('spinner-box-load').style.display = 'block'
                                        axios.get(`/api/stripePayment?tokenId=${token.id}&basketShortcode=${result.data.basketShortcode}&
                                                        email=${token.email}`)
                                            .then( result =>{
                                                document.getElementById('spinner-box-load').style.display = 'none'
                                                // if(result.status === 200) browserHistory.push('/reparieren/danke')
                                            })
                                            .catch( error => {
                                                document.getElementById('spinner-box-load').style.display = 'none'
                                                if(error.response.status === 404) browserHistory.push('/reparieren/error-payment')
                                            })
                                        ifPay = true
                                    }

                                },
                                closed: () => {
                                    if(!ifPay){
                                        axios.get(`/api/closePaymentWindow?basketShortcode=${result.data.basketShortcode}&
                                                       totalPrice=${result.data.totalPrice}&paymentMethod=${this.state.payMethod.payMethodDatatrans}`)
                                    }
                                }
                            })
                            if(document.querySelector('.stripe-button-el')) document.querySelector('.stripe-button-el').style.display = 'none'
                            this.stripeHandler.open({
                                amount: result.data.totalPrice*100,
                                name: 'Remarket',
                                allowRememberMe: false
                            })
                        })
                    }
                    else if(this.state.payMethod.method === 'Vorauskasse/Überweisung'){
                        document.getElementById('spinner-box-load').style.display = 'block'
                        axios.get(`/api/bankPayment?basketShortcode=${result.data.basketShortcode}`)
                            .then( result => {
                                document.getElementById('spinner-box-load').style.display = 'none'
                                this.setState({bankPaymentModal: <BankPaymentModal data={result.data} fromRepair={true}/>})
                                // $('#BankPaymentModal').modal('show')
                            })
                            .catch( error => {
                                if(error.response.status === 404) browserHistory.push('/reparieren/error-payment')
                            })
                    }
                    else if(this.state.payMethod.method === 'PayPal'){
                        document.getElementById('spinner-box-load').style.display = 'block'
                        axios.get(`/api/paypalPayment?basketShortcode=${result.data.basketShortcode}`)
                            .then( result => {
                                window.open(result.data.link, '_self')
                            })
                    }
                    else if(this.state.payMethod.method === 'PerRechnung'){
                        document.getElementById('spinner-box-load').style.display = 'block'
                        axios.get(`/api/paymentByInvoice?basketShortcode=${result.data.basketShortcode}`)
                            .then( result => {
                                document.getElementById('spinner-box-load').style.display = 'none'
                                // if(result.status === 200) browserHistory.push('/reparieren/danke')
                            })
                            .catch( error => {
                                if(error.response.status === 404) browserHistory.push('/reparieren/error-payment')
                            })
                    }
                    else if(this.state.payMethod.method === 'payInShop'){
                        document.getElementById('spinner-box-load').style.display = 'block'
                        axios.get(`/api/paymentByCash?basketShortcode=${result.data.basketShortcode}`)
                            .then( result => {
                                document.getElementById('spinner-box-load').style.display = 'none'
                                // if(result.status === 200) browserHistory.push('/reparieren/danke')
                            })
                            .catch( error => {
                                if(error.response.status === 404) browserHistory.push('/reparieren/error-payment')
                            })
                    }
                }
            })
            .catch( error => {
                document.getElementById('spinner-box-load').style.display = 'none'
                let errorsResponse = error.response.data.errors,
                    errors = {}

                for( let key in errorsResponse){
                    errors[key] = errorsResponse[key][0]
                }
                this.setState({ errors })
            })
    }
    sendByBicycle(){

    }
    choosePayMethod(e){
        let method = e.target.value,
            payMethodDatatrans = e.target.getAttribute('data-paymethoddatatrans')
        this.setState({ payMethod: { ...this.state.payMethod, method, payMethodDatatrans } })
    }

    cancelSendByEnter(e){
        if(e.key === "Enter"){
            e.preventDefault()
            return false
        }
    }

    render() {
        let { country, inputCheckbox, formData, shippingMethods, showSummaryPopup, errors, formSend } = this.state,
            { shippingMethod } = this.props.basketDataRepair,
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            ifRequired = (Math.round(this.props.totalPrice * 100)/100) !== 0,
            showSpecialPayMethod = this._checkShowSpecialPayMethod(),
            columnClassName = inputCheckbox.shippingAddress
                                ? "col-md-4 col-sm-6 item-form-column "
                                : "col-md-3 col-sm-6 item-form-column"

        return (
            <div className="delivery-post">
                {!formSend && <div>
                { !this.props.mountedInBicycleForm &&
                    <div className="price">
                        <h3 className="title">Preis</h3>
                        <p className="value">{this.props.totalPrice} {domain === 'ch' ? 'CHF' : 'EUR'}</p>
                    </div>
                }
                <div className="row">
                    <form name="deliveryByPostForm"
                          className="editFormWrap"
                          onKeyPress={this.cancelSendByEnter.bind(this)}
                          onSubmit={this.sendForm}>
                        <div className={columnClassName}>
                            <div className="user-data personal">
                                <h3 className="title"><span className="num">1</span>Persönliche Angaben</h3>
                                <div className="topPersonalData">
                                    <label><input type="radio"
                                                  name="Geschlecht"
                                                  checked={formData.Geschlecht == 'Herr'}
                                                  onChange={this.handlerChangeInput}
                                                  value="Herr"
                                                  required/><span/>Herr</label>
                                    <label><input type="radio"
                                                  name="Geschlecht"
                                                  checked={formData.Geschlecht == 'Frau'}
                                                  onChange={this.handlerChangeInput}
                                                  value="Frau"/><span/>Frau</label>
                                    {errors.Geschlecht && <p className="info error">{errors.Geschlecht}</p>}
                                </div>
                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.first_name}
                                               onChange={this.handlerChangeInput}
                                               name="first_name" placeholder="Vorname" required/>
                                        {errors.first_name && <p className="info error">{errors.first_name}</p>}
                                    </div>
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.last_name}
                                               onChange={this.handlerChangeInput}
                                               name="last_name" placeholder="Nachname" required/>
                                        {errors.last_name && <p className="info error">{errors.last_name}</p>}
                                    </div>
                                </div>
                                <div className="inputFullWidth">
                                    <div className="input-row">
                                        <input type="email"
                                               value={formData.email}
                                               onChange={this.handlerChangeInput}
                                               name="email" placeholder="E-Mail" required/>
                                        {errors.email && <p className="info error">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="inputFullWidth">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.phone}
                                               onChange={this.handlerChangeInput}
                                               name="phone" placeholder="Telefon (mobil)" required/>
                                        {errors.phone && <p className="info error">{errors.phone}</p>}
                                    </div>

                                </div>

                                { !country.countriesList.some( item => item.value === formData.Sprache.toLowerCase() )
                                    && <input className="requiredSelect" type="text" required/>
                                }
                                <div className="input-row">
                                    <Select
                                        placeholder="Auswählen..."
                                        value={formData.Sprache.toLowerCase()}
                                        name="Sprache"
                                        clearable={false}
                                        options={country.countriesList}
                                        searchable={false}
                                        onChange={ (val) => this.changeCountry(val,"Sprache")}/>
                                    {errors.Sprache && <p className="info error">{errors.Sprache}</p>}
                                </div>

                                <label className="labelCompany">
                                    <input type="checkbox"
                                           value={inputCheckbox.systemCompany}
                                           name="systemCompany"
                                           checked={inputCheckbox.systemCompany}
                                           onChange={this.changeCheckbox}/>
                                    <span className="check"/>
                                    <span className="text">Firma</span></label>
                                <div className={inputCheckbox.systemCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.company}
                                           onChange={this.handlerChangeInput}
                                           name="company"
                                           placeholder="Firma"
                                           required={inputCheckbox.systemCompany}/>
                                        {errors.company && <p className="info error">{errors.company}</p>}
                                    </div>
                                </div>
                                <div className={inputCheckbox.systemCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.vat}
                                           onChange={this.handlerChangeInput}
                                           name="vat"
                                           placeholder="Company number"
                                           required={inputCheckbox.systemCompany}/>
                                        {errors.vat && <p className="info error">{errors.vat}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={columnClassName}>
                            <div className="user-data billing">
                                <h3 className="title"><span className="num">2</span>Rechnungs-<br/>adresse</h3>
                                <div className="topPersonalData">
                                    <label><input type="radio"
                                                  checked={formData.RechnungAnrede == 'Herr'}
                                                  onChange={this.handlerChangeInput}
                                                  name="RechnungAnrede"
                                                  required
                                                  value="Herr"/><span/>Herr</label>
                                    <label><input type="radio"
                                                  checked={formData.RechnungAnrede == 'Frau'}
                                                  onChange={this.handlerChangeInput}
                                                  name="RechnungAnrede"
                                                  required
                                                  value="Frau"/><span/>Frau</label>
                                    {errors.RechnungAnrede && <p className="info error">{errors.RechnungAnrede}</p>}
                                </div>

                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungVorname}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungVorname"
                                           placeholder="Vorname"
                                           required/>
                                        {errors.RechnungVorname && <p className="info error">{errors.RechnungVorname}</p>}
                                    </div>
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungNachname}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungNachname"
                                           placeholder="Nachname"
                                           required/>
                                        {errors.RechnungNachname && <p className="info error">{errors.RechnungNachname}</p>}
                                    </div>
                                </div>
                                <div className="inputFullWidth street">
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungStrasse}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungStrasse" id="customer_route" placeholder="Adresse" required/>
                                        {errors.RechnungStrasse && <p className="info error">{errors.RechnungStrasse}</p>}
                                    </div>
                                </div>
                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungHausnummer}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungHausnummer" id="customer_street_number" placeholder="Nr." required/>
                                        {errors.RechnungHausnummer && <p className="info error">{errors.RechnungHausnummer}</p>}
                                    </div>
                                </div>
                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungPLZ}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungPLZ" placeholder="PLZ" id="customer_postal_code" required/>
                                        {errors.RechnungPLZ && <p className="info error">{errors.RechnungPLZ}</p>}
                                    </div>
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungStadt}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungStadt" placeholder="Stadt" id="customer_locality" required/>
                                        {errors.RechnungStadt && <p className="info error">{errors.RechnungStadt}</p>}
                                    </div>
                                </div>
                                { !country.countriesList.some( item => item.value === formData.RechnungLand.toLowerCase() )
                                && <input className="requiredSelect" type="text" required/>}
                                <div className="input-row">
                                    <Select
                                        placeholder="Auswählen..."
                                        value={formData.RechnungLand.toLowerCase()}
                                        name="RechnungLand"
                                        clearable={false}
                                        options={country.countriesList}
                                        searchable={false}
                                        onChange={ (val) => this.changeCountry(val,"RechnungLand")}/>
                                    {errors.RechnungLand && <p className="info error">{errors.RechnungLand}</p>}
                                </div>

                                <div className="inputFullWidth">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.RechnungTelefon}
                                               onChange={this.handlerChangeInput}
                                               name="RechnungTelefon" placeholder="Telefon" required/>
                                        {errors.RechnungTelefon && <p className="info error">{errors.RechnungTelefon}</p>}
                                    </div>
                                </div>
                                <label className="labelCompany">
                                    <input    type="checkbox"
                                              name="customerCompany"
                                              value={inputCheckbox.customerCompany}
                                              checked={inputCheckbox.customerCompany}
                                              onClick={this.changeCheckbox}/>
                                    <span className="check"/><span className="text">Firma</span></label>
                                <div className={inputCheckbox.customerCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                    <div className="input-row">
                                        <input type="text"
                                           value={formData.RechnungFirmenname}
                                           onChange={this.handlerChangeInput}
                                           name="RechnungFirmenname"
                                           placeholder="Firma"
                                           required={inputCheckbox.customerCompany}/>
                                        {errors.RechnungFirmenname && <p className="info error">{errors.RechnungFirmenname}</p>}
                                    </div>
                                </div>
                                <div className="topPersonalData showBillingForm">
                                    <div>
                                        <label style={{width: '100%'}}><input type="radio"
                                                                              value='billing'
                                                                              name="shippingAddress"
                                                                              data-show="false"
                                                                              checked={inputCheckbox.shippingAddress}
                                                                              onChange={this.changeCheckbox}/><span/>Lieferadresse = Rechnungsadresse</label>
                                    </div>
                                    <div>
                                        <label style={{width: '100%'}}><input type="radio"
                                                                              value="custom"
                                                                              name="shippingAddress"
                                                                              data-show="true"
                                                                              checked={!inputCheckbox.shippingAddress}
                                                                              onChange={this.changeCheckbox}/><span/>Lieferadresse erstellen</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={ inputCheckbox.shippingAddress === true ? 'hide col-md-3 col-sm-6 item-form-column' : "col-sm-6 col-md-3 item-form-column"}>
                            <div className="user-data shipping">
                                <h3 className="title"><span className="num">3</span>Liefer-<br />adresse</h3>
                                <div className="topPersonalData">
                                    <label><input type="radio"
                                                  checked={formData.LieferAnrede == 'Herr'}
                                                  onChange={this.handlerChangeInput}
                                                  name="LieferAnrede"
                                                  value="Herr"
                                                  required={!inputCheckbox.shippingAddress}/><span/>Herr</label>
                                    <label><input type="radio"
                                                  checked={formData.LieferAnrede == 'Frau'}
                                                  onChange={this.handlerChangeInput}
                                                  name="LieferAnrede"
                                                  value="Frau"
                                                  required={!inputCheckbox.shippingAddress}/><span/>Frau</label>
                                    {errors.LieferAnrede && <p className="info error">{errors.LieferAnrede}</p>}
                                </div>

                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferVorname}
                                               onChange={this.handlerChangeInput}
                                               name="LieferVorname"
                                               placeholder="Vorname"
                                               required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferVorname && <p className="info error">{errors.LieferVorname}</p>}
                                    </div>
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferNachname}
                                               onChange={this.handlerChangeInput}
                                               name="LieferNachname"
                                               placeholder="Nachname"
                                               required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferNachname && <p className="info error">{errors.LieferNachname}</p>}
                                    </div>
                                </div>
                                <div className="inputFullWidth street">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferStrasse}
                                               onChange={this.handlerChangeInput}
                                               name="LieferStrasse" id="route" placeholder="Strasse" required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferStrasse && <p className="info error">{errors.LieferStrasse}</p>}
                                    </div>
                                </div>
                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferHausnummer}
                                               onChange={this.handlerChangeInput}
                                               name="LieferHausnummer" id="street_number" placeholder="Nr." required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferHausnummer && <p className="info error">{errors.LieferHausnummer}</p>}
                                    </div>
                                </div>
                                <div className="personalDataInputHalf">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferPLZ}
                                               onChange={this.handlerChangeInput}
                                               name="LieferPLZ" placeholder="PLZ" id="postal_code" required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferPLZ && <p className="info error">{errors.LieferPLZ}</p>}
                                    </div>
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferStadt}
                                               onChange={this.handlerChangeInput}
                                               name="LieferStadt" placeholder="Stadt" id="locality" required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferStadt && <p className="info error">{errors.LieferStadt}</p>}
                                    </div>
                                </div>
                                { !country.countriesList.some( item => item.value === formData.LieferLand.toLowerCase() )
                                && inputCheckbox.shippingAddress !== true
                                && <input className="requiredSelect" type="text" required/>}
                                <div className="input-row">
                                    <Select
                                        placeholder="Auswählen..."
                                        value={formData.LieferLand.toLowerCase()}
                                        name="LieferLand"
                                        clearable={false}
                                        options={country.countriesList}
                                        searchable={false}
                                        onChange={ (val) => this.changeCountry(val,"LieferLand")}/>
                                    {errors.LieferLand && <p className="info error">{errors.LieferLand}</p>}
                                </div>

                                <div className="inputFullWidth phone">
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferTelefon}
                                               onChange={this.handlerChangeInput}
                                               name="LieferTelefon" placeholder="Telefon" required={!inputCheckbox.shippingAddress}/>
                                        {errors.LieferTelefon && <p className="info error">{errors.LieferTelefon}</p>}
                                    </div>
                                </div>
                                <label className="labelCompany">
                                    <input  type="checkbox"
                                            value={inputCheckbox.shippingCompany}
                                            name="shippingCompany"
                                            checked={inputCheckbox.shippingCompany}
                                            onChange={this.changeCheckbox}/>
                                    <span className="check"/><span className="text">Firma</span></label>
                                <div className={inputCheckbox.shippingCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.LieferFirmenname}
                                               onChange={this.handlerChangeInput}
                                               name="LieferFirmenname"
                                               placeholder="Firma"
                                               required={inputCheckbox.shippingCompany}/>
                                        {errors.LieferFirmenname && <p className="info error">{errors.LieferFirmenname}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={columnClassName}>
                            <div>
                                <div className="shipping-method">
                                    <h4 className="title">Versandmethode:</h4>
                                    <div className="topPersonalData">
                                        {shippingMethods.map( (item, i) => {
                                            return(
                                                <label key={i}>
                                                    <input type="radio"
                                                           required
                                                           onChange={ (e) => this.changeShippingMethod(e,item)}
                                                           checked={shippingMethod && item.shortcode === shippingMethod.shortcode}
                                                           value={item.shortcode}
                                                           name="shippingMethodShortcode"/>
                                                    <span/>{item.name}</label>
                                            )
                                        })}
                                    </div>
                                    {errors.shippingMethodShortcode && <p className="info error">{errors.shippingMethodShortcode}</p>}
                                </div>
                                <div className="payment-method">
                                    <h3 className="title"><span className="num">4</span>Zahlungsmethode</h3>
                                    <span className="view-summary" onClick={this.toggleSummaryPopup}>Zusammenfassung anzeigen</span>
                                    <div className="topPersonalData">
                                        <ul onChange={this.choosePayMethod}>
                                            { shippingMethod && shippingMethod.shortcode === 'PICKAS' &&
                                                <li><label><input type="radio" name="payment_method" required={ifRequired} value="payInShop"/>
                                                    <span className="radio"/>
                                                    Zahlung bei Abholung</label>
                                                </li>
                                            }
                                            {domain === 'ch' &&
                                                <div>
                                                    <li>
                                                        <label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="VIS"/>
                                                            <span className="radio"/>
                                                            <img src="/images/icons/payment-type/4.png" width="24" height="24" className="payment-icon" alt="Visa" />
                                                            Visa</label>
                                                    </li>
                                                    <li>
                                                        <label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="ECA"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/5.png" width="24" height="24" className="payment-icon" alt="Mastercard" />
                                                        Mastercard</label>
                                                    </li>
                                                    <li>
                                                        <label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="PFC"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/3.png" width="24" height="24" className="payment-icon" alt="PostFinance Card" />
                                                        PostFinance Card</label>
                                                    </li>
                                                    <li>
                                                        <label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="TWI"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/17.png" width="24" height="24" className="payment-icon" alt="Diners Club" />
                                                        TWINT Wallet </label>
                                                    </li>
                                                </div>
                                            }
                                            {domain === 'de' &&
                                                <div>
                                                    <li><label><input type="radio" name="payment_method" required={ifRequired} value="Stripe"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/4.png" width="24" height="24" className="payment-icon" alt="Visa" />
                                                        Visa</label></li>
                                                    <li><label><input type="radio" name="payment_method" required={ifRequired} value="Stripe"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/5.png" width="24" height="24" className="payment-icon" alt="Mastercard" />
                                                        Mastercard</label></li>
                                                    <li><label><input type="radio" name="payment_method" required={ifRequired} value="Stripe"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/7.png" width="24" height="24" className="payment-icon" alt="American Express" />
                                                        American Express</label></li>
                                                </div>
                                            }
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="PayPal"/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/6.png" width="24" height="24" className="payment-icon" alt="PayPal" />
                                                PayPal</label></li>
                                            <li><label><input type="radio" name="payment_method" value="Vorauskasse/Überweisung"/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/10.png" width="24" height="24" className="payment-icon" alt="Vorauskasse" />
                                                Vorauskasse</label></li>
                                            { showSpecialPayMethod &&
                                                <li><label><input type="radio" name="payment_method" value="PerRechnung"/>
                                                    <span className="radio"/>
                                                    <img src="/images/icons/payment-type/" width="24" height="24" className="payment-icon" alt="Per Rechnung" />
                                                    Per Rechnung</label></li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <button type="submit" className="btn" onSubmit={this.sendForm} onClick={this.props.selectDesiredButton}>
                                   Weiter
                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {this.state.bankPaymentModal}
                { this.state.payForm }
                {showSummaryPopup && <DeliveryByPostSummaryPopup basketData={this.props.basketDataRepair}
                                                                 sendForm={this.sendForm}
                                                                 removeFromBasket={this.removeFromBasket}
                                                                 totalPrice={this.props.totalPrice}
                                                                 toggleSummaryPopup={this.toggleSummaryPopup}/>}
                </div>}
                {formSend &&
                <div>
                        <DeliverySuccessLetter props={this.props}/>
                        <p className="delivery-form-form-send-text">
                            you can spontaneously forward your {(this.props.model.title).split(' ')[1]} during our opening hours for the repair and wait directly onthe rapaired {(this.props.model.title).split(' ')[1]}!
                        </p>
                    </div>}

            </div>
        )
    }
}
DeliveryByPost.propTypes = {}
DeliveryByPost.defaultProps = {
    mountedInBicycleForm: false
}

function mapStateToProps (state) {
    return {
        user: state.user,
        basketDataRepair: state.basket.basketDataRepair
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryByPost)

function FormDataValue() {
    this.Geschlecht = '',
    this.first_name = '',
    this.last_name = '',
    this.email = '',
    this.phone = '',
    this.Sprache = 'ch',
    this.company = '',
    this.vat = '',
    this.RechnungAnrede = '',
    this.RechnungVorname = '',
    this.RechnungNachname = '',
    this.RechnungStrasse = '',
    this.RechnungHausnummer = '',
    this.RechnungPLZ = '',
    this.RechnungStadt = '',
    this.RechnungLand = 'ch',
    this.RechnungTelefon = '',
    this.RechnungFirmenname = '',
    this.LieferAnrede = '',
    this.LieferVorname = '',
    this.LieferNachname = '',
    this.LieferStrasse = '',
    this.LieferHausnummer = '',
    this.LieferPLZ = '',
    this.LieferStadt = '',
    this.LieferLand = 'ch',
    this.LieferTelefon = '',
    this.LieferFirmenname = ''
}