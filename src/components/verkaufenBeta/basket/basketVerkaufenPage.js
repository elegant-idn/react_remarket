import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory} from 'react-router'
import axios from 'axios'
import _debounce from 'lodash/debounce'
import { _googleAutocomplete, _getPersonalDataFields, _setPersonalDataFields } from '../../../helpers/helpersFunction'

import PersonalData from '../../basket/personalData'
import ProductOverview from './productOverview'
import ShowResults from '../showResults'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../../actions/basket'
import * as userActions from '../../../actions/user'

export class BasketVerkaufen extends Component {
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
                asGuest: false
            },
            couponError: null,
            infoMsg: null,
            errors: {
                password: '',
                info: '',
                general: ''
            },
            showResults: null
        }

        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.changeCountry = this.changeCountry.bind(this)
        this.changeCoupon = this.changeCoupon.bind(this)
        this.changeForm = this.changeForm.bind(this)
        this.send = this.send.bind(this)
        this.handleRemoveFromBasket = this.handleRemoveFromBasket.bind(this)
        this.closeShowResults = this.closeShowResults.bind(this)
        this._gtag_report_conversion = this._gtag_report_conversion.bind(this)
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
        }
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === true){
            this.setState({errors: {...this.state.errors, info: ''}})
        }
        if( nextProps.user.data !== this.props.user.data && nextProps.user.data){
            window.localStorage.removeItem("userDataVerkaufen")
            window.localStorage.removeItem("userData")
            _setPersonalDataFields.call(this, nextProps.user.data)
        }
    }
    componentWillMount() {
        this.inputCouponCallback = _debounce(function (e) {
            let email = document.forms.basketForm.email.value,
                {shippingAddress} = this.state.inputCheckbox
            axios.get(`/api/checkCoupon?coupon=${e.target.value}&email=${email}&shippingAddress=${shippingAddress}&couponType=6`)
                .then((result) => {
                    if(this.props.basket.basketDataVerkaufen.every( item => item.productTypeId != 999 )){
                        let newBasketData = [...this.props.basket.basketDataVerkaufen, result.data]
                        this.props.basketActions.changeBasketVerkaufenData(newBasketData)
                        e.target.value = ''
                    }
                    else{
                        this.setState({couponError: 'Es ist nich möglich mehrere Gutscheine zu versenden'})
                    }
                })
                .catch(error => {
                    let {data} = error.response
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
    }
    componentDidMount(){
        if(this.props.user.isLogin && this.props.user.data && this.props.basket.basketDataVerkaufen.length > 0 ){
            _setPersonalDataFields.call(this, this.props.user.data)
        }
        else{
            let personalData = JSON.parse(window.localStorage.getItem('userDataVerkaufen'))
            if(personalData && this.props.basket.basketDataVerkaufen.length > 0) _setPersonalDataFields.call(this, personalData)
        }
        /*
        axios.get('/api/countries')
            .then(( { data }) => {
                if(window.isGoogleConnection) {
                    _googleAutocomplete.call(this, data.meta.domainId, 'userDataVerkaufen')
                }
                let countriesList = data.data.map( item => { return { value: item['name-short'], label: item['name-de']}})
                this.setState({country: {...this.state.country, countriesList} })
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
    }

    componentWillUnmount(){
        if(!this.props.user.isLogin){
            let personalData = _getPersonalDataFields()
            window.localStorage.setItem('userDataVerkaufen', JSON.stringify(personalData))
        }
    }
    _gtag_report_conversion(){
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-827036726/XGt5CJnpz3sQtqiuigM',
            'event_callback': callback
        });
        return false;
    }
    changeCountry(val, name){
        let { value } = val,
            { currentCountry } = this.state.country
        currentCountry[name] = value
        this.setState({ country: { ...this.state.country, currentCountry } })
    }
    changeCheckbox(e){
        let { inputCheckbox } = this.state,
            { name } = e.target
        inputCheckbox[name] = !inputCheckbox[name]
        this.setState({ inputCheckbox })
    }
    changeCoupon(e){
        this.setState({couponError: null})
        e.persist()
        this.inputCouponCallback(e)
    }
    handleRemoveFromBasket(productTypeId, id){
        let basketData = this.props.basket.basketDataVerkaufen,
            newBasketData = []
        if( productTypeId === 999 ) {                                                      // if item "Coupon"
            newBasketData = basketData.filter(item => item.shortcode != id)
        }
        else{
            newBasketData = basketData.filter( item => item.id != id)
        }
        this.props.basketActions.changeBasketVerkaufenData(newBasketData)

    }

    closeShowResults(currentTab){
        let { isLogin } = this.props.user,
            inputCheckbox = {...this.state.inputCheckbox}

        if(currentTab === 'instructions'){
            if(!isLogin){
                if(inputCheckbox.asGuest){
                    browserHistory.push('/')
                }
                else{
                    this.props.userActions.setRedirectTo('/kundenkonto')
                    setTimeout( () => document.getElementById("op").checked = true, 100)
                }
            }
            else{
                browserHistory.push('/kundenkonto')
            }
        }
    }
    send(e){
        e.preventDefault()
        let data = new FormData(document.forms.basketForm)
        data.append("basketData", JSON.stringify(this.props.basket.basketDataVerkaufen))

        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post('/api/basketPayout', data)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                window.localStorage.setItem('email', result.data[0].viewData.email)
                window.localStorage.setItem('order', result.data[0].viewData.basketPayoutShortcode)
                window.localStorage.setItem('template', JSON.stringify(result.data[0].viewData.templates))
                window.localStorage.setItem('PDFData', JSON.stringify(result.data[0].PDFData))
                window.localStorage.setItem('basketDataVerkaufenForSellPage', JSON.stringify(this.props.basket.basketDataVerkaufen))
                //clear basket verkaufen
                window.localStorage.removeItem('basketDataVerkaufen')
                this.props.basketActions.changeBasketVerkaufenData([])
                //browserHistory.push('/verkaufen/sell-overview')

                if(window.isMobile){
                    $('.basketWrap>div').hide()
                }

                this.setState({ showResults: <ShowResults closeShowResults={this.closeShowResults}
                                                          pdfUrl={result.data[0].PDFPath}
                                                          showInstructions={true}/>
                })
                this.props.sendSuccess && this.props.sendSuccess()

                if(window.isGoogleConnection) {
                    // this._gtag_report_conversion() //google adwords
                }
                if(window.isFBConnection) {
                    fbq('track', 'CompleteRegistration',
                        {value: result.data[0].PDFData.totalPrice, currency: window.currencyValue,}
                    )// facebook pixel
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
    changeForm(){
        let personalData = _getPersonalDataFields()
        window.localStorage.setItem('userDataVerkaufen', JSON.stringify(personalData))
        this.setState({ errors: {...this.state.errors, info:'', password: '', general: '' }})
    }
    cancelSendByEnter(e){
        if(e.key === "Enter"){
            e.preventDefault()
            return false
        }
    }

    render() {
        let { country, inputCheckbox, couponError, errors } = this.state,
            { basketDataVerkaufen } = this.props.basket
        return (
            <div className="basketWrap verkaufen sellPage">
                <div className="container">
                    <p className="successMsg">{this.state.infoMsg}</p>
                    <p className="errorInfo">{this.state.errors.general}</p>
                    { basketDataVerkaufen.length > 0 ?
                        <form action="#" name="basketForm" onChange={this.changeForm} onKeyPress={this.cancelSendByEnter.bind(this)} onSubmit={this.send}>
                            <div className="row formWrap">
                                <div className="col-md-7">
                                    <PersonalData country={ country }
                                                  cancelRedirect={this.props.userActions.cancelRedirectToMyAccount}
                                                  user={this.props.user}
                                                  error={errors}
                                                  inputCheckbox={ inputCheckbox }
                                                  changeCountry={this.changeCountry}
                                                  handlerSendSellBasket={this.send}
                                                  changeCheckbox={this.changeCheckbox}/>
                                </div>
                                <ProductOverview basketData={basketDataVerkaufen}
                                                 goToCheckoutMobile={this.props.goToCheckout}
                                                 changeCoupon = { this.changeCoupon }
                                                 couponError = { couponError }
                                                 removeFromBasket={this.handleRemoveFromBasket}/>
                            </div>

                        </form>
                        :
                        <div>
                            <h1>Verkaufskorb</h1>
                            <p className="emptyBasket">Ihr Verkaufskorb ist leer.</p>
                        </div>
                    }
                </div>
                {this.state.showResults}
            </div>
        )
    }
}

BasketVerkaufen.propTypes = {}
BasketVerkaufen.defaultProps = {}

function mapStateToProps (state) {
    return {
        basket: state.basket,
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(BasketVerkaufen)

