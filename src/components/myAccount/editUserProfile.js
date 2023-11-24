import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Select from 'react-select'
import { _googleAutocomplete } from '../../helpers/helpersFunction'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginSuccess } from '../../actions/user'

export class EditUserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inputCheckbox: {
                shippingAddress: true,
                shippingCompany: false,
                customerCompany: false,
                systemCompany: false
            },
            country: {
                countriesList: [],
                currentCountry:{
                    inputCountry: "CH",
                    customer_inputCountry: "CH",
                    system_inputCountry: "CH"
                }
            },
            isChanged: {
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
            successMsg: null
        }

        this._setFormFields = this._setFormFields.bind(this)
        this._showHideBlocks = this._showHideBlocks.bind(this)
        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.changeCountry = this.changeCountry.bind(this)
        this.sendForm = this.sendForm.bind(this)
        this.clearForm = this.clearForm.bind(this)
        this.autocomleteFieldsShippingBilling = this.autocomleteFieldsShippingBilling.bind(this)
        this.changeShippingBillingForm = this.changeShippingBillingForm.bind(this)


    }

    componentWillReceiveProps( nextProps ){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            browserHistory.push('/')
        }
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

        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/accountData`)
            .then( ( result ) => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this._setFormFields(result.data)
            })
        window.isMobile && this._showHideBlocks()
    }
    _showHideBlocks(){
        $('h3.title .toggle-forMobile').on('click', function () {
            if($(this).parents('.itemForm').find('.itemFormWrap').css('display') === 'none'){
                $('.itemFormWrap').each( function () {
                    $(this).hide('slow')
                    $(this).parent().find('.title i.fa').removeClass('fa-minus').addClass('fa-plus')
                })
                $(this).parents('.itemForm').find('.itemFormWrap').toggle('slow')
                $(this).parents('.itemForm').find('.title i.fa').removeClass('fa-plus').addClass('fa-minus')
            }
        })
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
    changeCheckbox(e){
        let { inputCheckbox } = this.state,
            { name } = e.target
        if(e.target.getAttribute('data-show')){
            e.target.getAttribute('data-show') === 'true' ? inputCheckbox.shippingAddress = false : inputCheckbox.shippingAddress = true
        }
        else inputCheckbox[name] = !inputCheckbox[name]

        this.setState({ inputCheckbox })
    }
    changeCountry(val, name){
        let { value } = val,
            { currentCountry } = this.state.country,
            currentName = ''
        switch (name){
            case 'Sprache':
                currentName = 'system_inputCountry'
                break
            case 'LieferLand':
                currentName = 'inputCountry'
                break
            case 'RechnungLand':
                currentName = 'customer_inputCountry'
                break
        }
        currentCountry[currentName] = value
        this.setState({ country: { ...this.state.country, currentCountry } })
    }
    sendForm(e){
        e.preventDefault()
        let data = new FormData(document.forms.editUserProfileForm)
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post('/api/updateAccount', data)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ successMsg: result.data })
                axios.get(`/api/customerAgileData`)
                    .then((data) => {
                        if (data.status === 200) {
                            this.props.loginSuccess(data.data)
                        }
                    })
            })
    }
    cancelSendByEnter(e){
        if(e.key === "Enter"){
            e.preventDefault()
            return false
        }
    }
    clearForm(e){
        e.preventDefault()
        let editUserProfileForm = [ ...document.querySelectorAll('.editUserProfileForm input:not([type=radio])')],
            radioInputs = [ ...document.querySelectorAll('.editUserProfileForm input[type=radio]')]

        editUserProfileForm.forEach( item => {
            item.value = ''
        })
        radioInputs.forEach( item => {
            item.name !== 'shippingAddress' ? item.checked = false : null
        })
        this.setState({ inputCheckbox: { ...this.state.inputCheckbox, shippingCompany: false, customerCompany: false, systemCompany: false}})

    }
    autocomleteFieldsShippingBilling(e){
        let form = document.forms.editUserProfileForm,
            { name, value } = e.target,
            { isChanged, inputCheckbox } = this.state
        switch(name){
            case 'Geschlecht':
                if(!isChanged.LieferAnrede) form.LieferAnrede.value = value
                if(!isChanged.RechnungAnrede) form.RechnungAnrede.value = value
                break
            case 'systemCompany':
                if(!isChanged.customerCompany){
                    inputCheckbox.customerCompany = e.target.checked
                }
                if(!isChanged.shippingCompany){
                    inputCheckbox.shippingCompany = e.target.checked
                }
                this.setState({ inputCheckbox })
                break
            case 'first_name':
                if(!isChanged.LieferVorname) form.LieferVorname.value = value
                if(!isChanged.RechnungVorname) form.RechnungVorname.value = value
                break
            case 'last_name':
                if(!isChanged.LieferNachname) form.LieferNachname.value = value
                if(!isChanged.RechnungNachname) form.RechnungNachname.value = value
                break
            case 'company':
                if(!isChanged.LieferFirmenname) form.LieferFirmenname.value = value
                if(!isChanged.RechnungFirmenname) form.RechnungFirmenname.value = value
                break
            case 'TelefonAlternativErreichbar':
                if(!isChanged.LieferTelefon) form.LieferTelefon.value = value
                if(!isChanged.RechnungTelefon) form.RechnungTelefon.value = value
                break
        }
    }
    changeShippingBillingForm(e){
        let { name } = e.target,
            { isChanged } = this.state
        isChanged[name] = true
        this.setState({ isChanged })
    }
    render() {
        let { inputCheckbox, country } = this.state
        return (
            <div>
                <div className="row">
                    <div className="editFormWrap clearfix">
                        <p className="successUpd">{ this.state.successMsg }</p>

                        <form name="editUserProfileForm"
                              className="editUserProfileForm"
                              onSubmit={this.sendForm}
                              onKeyPress={this.cancelSendByEnter.bind(this)}>
                            <div className="col-md-12 topRow">
                                <span className="title">Profil bearbeiten</span>
                                <div className="buttons">
                                    <button type="submit" className="basketSubmit btn">Daten aktualisieren</button>
                                </div>
                            </div>
                            <div className="wrapItemForm">
                                <div className="col-md-4">
                                    <div className="itemForm">
                                        <h3 className="title">Allgemeine Information
                                            <i className="fa fa-minus toggle-forMobile"/>
                                        </h3>
                                        <div className="itemFormWrap">
                                            <div className="image">
                                                {this.props.user.data && this.props.user.data.systemAddress && this.props.user.data.systemAddress.first_name
                                                && this.props.user.data.systemAddress.last_name
                                                && (this.props.user.data.systemAddress.first_name.slice(0,1).toUpperCase() + this.props.user.data.systemAddress.last_name.slice(0,1).toUpperCase())}
                                            </div>
                                            <div className="topPersonalData">
                                                <label><input type="radio"
                                                              name="Geschlecht"
                                                              value="Herr"
                                                              onChange={this.autocomleteFieldsShippingBilling}
                                                              required/><span/>Herr</label>
                                                <label><input type="radio"
                                                              name="Geschlecht"
                                                              value="Frau"
                                                              onChange={this.autocomleteFieldsShippingBilling}/><span/>Frau</label>
                                            </div>

                                            <div className="personalDataInputHalf">
                                                <input type="text" name="first_name" placeholder="Vorname" onChange={this.autocomleteFieldsShippingBilling} required/>
                                                <input type="text" name="last_name" placeholder="Nachname" onChange={this.autocomleteFieldsShippingBilling} required/>
                                            </div>
                                            <div className="inputFullWidth">
                                                <input type="email" name="email" placeholder="E-Mail" required/>
                                            </div>
                                            <div className="inputFullWidth">
                                                <input type="text" name="phone" placeholder="Telefon (mobil)" required/>
                                            </div>
                                            <div className="inputFullWidth">
                                                <input type="text" name="IBAN" placeholder="IBAN" minLength="21" maxLength="34" />
                                            </div>
                                            {/* <div className="inputFullWidth">
                                                <input type="text"
                                                       name="TelefonAlternativErreichbar"
                                                       placeholder="Telefon vom Gerät"
                                                       onChange={this.autocomleteFieldsShippingBilling}
                                                       required/>
                                            </div> */}
                                            { !country.countriesList.some( item => item.value === country.currentCountry.system_inputCountry.toLowerCase() ) && <input className="requiredSelect" type="text" required/>}
                                            <Select
                                                placeholder="Auswählen..."
                                                value={country.currentCountry.system_inputCountry.toLowerCase()}
                                                name="Sprache"
                                                clearable={false}
                                                options={country.countriesList}
                                                searchable={false}
                                                onChange={ (val) => this.changeCountry(val,"Sprache")}/>

                                            <label onChange={this.autocomleteFieldsShippingBilling}
                                                   className="labelCompany">
                                                <input type="checkbox"
                                                       value={inputCheckbox.systemCompany}
                                                       name="systemCompany"
                                                       checked={inputCheckbox.systemCompany}
                                                       onChange={this.changeCheckbox}/>
                                                <span className="check"/>
                                                <span className="text">Firma</span></label>
                                            <div className={inputCheckbox.systemCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                                <input type="text"
                                                       name="company"
                                                       placeholder="Firma"
                                                       onChange={this.autocomleteFieldsShippingBilling}
                                                       required={inputCheckbox.systemCompany}/>
                                            </div>
                                            <div className={inputCheckbox.systemCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                                <input type="text"
                                                       name="vat"
                                                       placeholder="MwSt.-Nr."/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="itemForm">
                                        <h3 className="title">Rechnungsadresse
                                            <i className="fa fa-plus toggle-forMobile"/>
                                        </h3>
                                        <div className="itemFormWrap">
                                            <div className="topPersonalData">
                                                <label><input type="radio"
                                                              name="RechnungAnrede"
                                                              value="Herr"
                                                              onChange={this.changeShippingBillingForm}
                                                              required/><span/>Herr</label>
                                                <label><input type="radio"
                                                              name="RechnungAnrede"
                                                              value="Frau"
                                                              onChange={this.changeShippingBillingForm}
                                                              required/><span/>Frau</label>

                                            </div>

                                            <div className="personalDataInputHalf" /*onChange={changeNameField}*/>
                                                <input type="text"
                                                       name="RechnungVorname"
                                                       placeholder="Vorname"
                                                       onChange={this.changeShippingBillingForm}
                                                       required/>
                                                <input type="text"
                                                       name="RechnungNachname"
                                                       placeholder="Nachname"
                                                       onChange={this.changeShippingBillingForm}
                                                       required/>
                                            </div>
                                            <div className="inputFullWidth street">
                                                <input type="text" name="RechnungStrasse" id="customer_route" placeholder="Adresse" required/>
                                            </div>
                                            <div className="personalDataInputHalf">
                                                <input type="text" name="RechnungHausnummer" id="customer_street_number" placeholder="Nr." required/>
                                            </div>
                                            <div className="personalDataInputHalf">
                                                <input type="text" name="RechnungPLZ" placeholder="PLZ" id="customer_postal_code" required/>
                                                <input type="text" name="RechnungStadt" placeholder="Stadt" id="customer_locality" required/>
                                            </div>
                                            { !country.countriesList.some( item => item.value === country.currentCountry.customer_inputCountry.toLowerCase() )
                                            && <input className="requiredSelect" type="text" required/>}
                                            <Select
                                                placeholder="Auswählen..."
                                                value={country.currentCountry.customer_inputCountry.toLowerCase()}
                                                name="RechnungLand"
                                                clearable={false}
                                                options={country.countriesList}
                                                searchable={false}
                                                onChange={ (val) => this.changeCountry(val,"RechnungLand")}/>

                                            <div className="inputFullWidth">
                                                <input type="text" name="RechnungTelefon" placeholder="Telefon" onChange={this.changeShippingBillingForm} required/>
                                            </div>
                                            <label onChange={this.changeShippingBillingForm}
                                                   className="labelCompany">
                                                <input    type="checkbox"
                                                          name="customerCompany"
                                                          value={inputCheckbox.customerCompany}
                                                          checked={inputCheckbox.customerCompany}
                                                          onClick={this.changeCheckbox}/>
                                                <span className="check"/><span className="text">Firma</span></label>
                                            <div className={inputCheckbox.customerCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                                <input type="text"
                                                       name="RechnungFirmenname"
                                                       placeholder="Firma"
                                                       onChange={this.changeShippingBillingForm}

                                                       required={inputCheckbox.customerCompany}/>
                                            </div>
                                            <div className="topPersonalData showBillingForm">
                                                <div>
                                                    <label><input type="radio"
                                                                  value='billing'
                                                                  name="shippingAddress"
                                                                  data-show="false"
                                                                  checked={inputCheckbox.shippingAddress}
                                                                  onChange={this.changeCheckbox}/><span/>Lieferadresse = Rechnungsadresse</label>
                                                </div>
                                                <div>
                                                    <label><input type="radio"
                                                                  value="custom"
                                                                  name="shippingAddress"
                                                                  data-show="true"
                                                                  checked={!inputCheckbox.shippingAddress}
                                                                  onChange={this.changeCheckbox}/><span/>Lieferadresse erstellen</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={ inputCheckbox.shippingAddress === true ? 'hide col-md-4' : "col-md-4"}>
                                    <div className="itemForm">
                                        <h3 className="title">Versandadresse
                                            <i className="fa fa-plus toggle-forMobile"/>
                                        </h3>
                                        <div className="itemFormWrap">
                                            <div className="topPersonalData">
                                                <label><input type="radio"
                                                              name="LieferAnrede"
                                                              value="Herr"
                                                              onChange={this.changeShippingBillingForm}
                                                              required={!inputCheckbox.shippingAddress}/><span/>Herr</label>
                                                <label><input type="radio"
                                                              name="LieferAnrede"
                                                              onChange={this.changeShippingBillingForm}
                                                              value="Frau"
                                                              required={!inputCheckbox.shippingAddress}/><span/>Frau</label>
                                            </div>

                                            <div className="personalDataInputHalf">
                                                <input type="text"
                                                       name="LieferVorname"
                                                       placeholder="Vorname"
                                                       onChange={this.changeShippingBillingForm}
                                                       required={!inputCheckbox.shippingAddress}/>
                                                <input type="text"
                                                       name="LieferNachname"
                                                       placeholder="Nachname"
                                                       onChange={this.changeShippingBillingForm}
                                                       required={!inputCheckbox.shippingAddress}/>
                                            </div>
                                            <div className="inputFullWidth street">
                                                <input type="text" name="LieferStrasse" id="route" placeholder="Strasse" required={!inputCheckbox.shippingAddress}/>
                                            </div>
                                            <div className="personalDataInputHalf">
                                                <input type="text" name="LieferHausnummer" id="street_number" placeholder="Nr." required={!inputCheckbox.shippingAddress}/>
                                            </div>
                                            <div className="personalDataInputHalf">
                                                <input type="text" name="LieferPLZ" placeholder="PLZ" id="postal_code" required={!inputCheckbox.shippingAddress}/>
                                                <input type="text" name="LieferStadt" placeholder="Stadt" id="locality" required={!inputCheckbox.shippingAddress}/>
                                            </div>
                                            { !country.countriesList.some( item => item.value === country.currentCountry.inputCountry.toLowerCase() )
                                            && inputCheckbox.shippingAddress !== true
                                            && <input className="requiredSelect" type="text" required/>}
                                            <Select
                                                placeholder="Auswählen..."
                                                value={country.currentCountry.inputCountry.toLowerCase()}
                                                name="LieferLand"
                                                clearable={false}
                                                options={country.countriesList}
                                                searchable={false}
                                                onChange={ (val) => this.changeCountry(val,"LieferLand")}/>

                                            <div className="inputFullWidth phone">
                                                <input type="text" name="LieferTelefon" placeholder="Telefon" onChange={this.changeShippingBillingForm} required={!inputCheckbox.shippingAddress}/>
                                            </div>
                                            <label onChange={this.changeShippingBillingForm} className="labelCompany">
                                                <input  type="checkbox"
                                                        value={inputCheckbox.shippingCompany}
                                                        name="shippingCompany"
                                                        checked={inputCheckbox.shippingCompany}
                                                        onChange={this.changeCheckbox}/>
                                                <span className="check"/><span className="text">Firma</span></label>
                                            <div className={inputCheckbox.shippingCompany ? "inputFullWidth" : "inputFullWidth hide" }>
                                                <input type="text"
                                                       name="LieferFirmenname"
                                                       placeholder="Firma"
                                                       onChange={this.changeShippingBillingForm}
                                                       required={inputCheckbox.shippingCompany}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

EditUserProfile.propTypes = {}
EditUserProfile.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        loginSuccess: bindActionCreators(loginSuccess, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserProfile)