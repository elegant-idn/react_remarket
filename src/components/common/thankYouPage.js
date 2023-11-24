
import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import Select from 'react-select'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import * as userActions from '../../actions/user'
import { cookieApi } from '../../api/apiCookie'
import { ACCESSORIES_ID } from "../../constants/accessories"
import ListSimilarItems from '../detailModelPage/listSimilarItems'
import BankPaymentModal from '../basket/bankPaymentModal'

const languages = [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'Englisch' },
    { value: 'fr', label: 'Französisch' },
    { value: 'it', label: 'Italienisch' }
];
const nationality = [
    { value: 'ch', label: 'Schweiz' },
    { value: 'de', label: 'Deutschland' },
    { value: 'li', label: 'Liechtenstein' },
    { value: 'at', label: 'Österreich' },
    { value: 'be', label: 'Belgien' },
    { value: 'it', label: 'Italien' },
    { value: 'ag', label: 'Antigua und Barbuda' },
    { value: 'ai', label: 'Anguilla' },
    { value: 'bb', label: 'Barbados' },
    { value: 'bm', label: 'Bermuda' },
    { value: 'bs', label: 'Bahamas' },
    { value: 'ca', label: 'Kanada' },
    { value: 'dm', label: 'Dominica' },
    { value: 'do', label: 'Dominikanische Republik' },
    { value: 'gd', label: 'Grenada' },
    { value: 'gu', label: 'Guam' },
    { value: 'ha', label: 'Hawaii' },
    { value: 'jm', label: 'Jamaika' },
    { value: 'kn', label: 'St. Kitts und Nevis' },
    { value: 'ky', label: 'Kaimaninseln' },
    { value: 'lc', label: 'St. Lucia' },
    { value: 'ms', label: 'Montserrat' },
    { value: 'pr', label: 'Puerto Rico' },
    { value: 'tc', label: 'Turks- und Caicosinseln' },
    { value: 'tt', label: 'Trinidad und Tobago' },
    { value: 'us', label: 'Vereinigte Staaten von Amerika' },
    { value: 'vc', label: 'St. Vincent und die Grenadinen' },
    { value: 'vi', label: 'Amerikanische Jungferninseln' },
    { value: 'ab', label: 'Abchasien' },
    { value: 'kz', label: 'Kasachstan' },
    { value: 'ru', label: 'Russische Föderation' },
    { value: 'eg', label: 'Ägypten' },
    { value: 'za', label: 'Südafrika' },
    { value: 'gr', label: 'Griechenland' },
    { value: 'nl', label: 'Niederlande' },
    { value: 'fr', label: 'Frankreich' },
    { value: 'es', label: 'Spanien' },
    { value: 'hu', label: 'Ungarn' },
    { value: 'ro', label: 'Rumänien' },
    { value: 'gb', label: 'Großbritannien' },
    { value: 'uk', label: 'Vereinigtes Königreich von Grossbritannien und Nordirland' },
    { value: 'gg', label: 'Guernsey' },
    { value: 'je', label: 'Jersey' },
    { value: 'im', label: 'Isle of Man' },
    { value: 'dk', label: 'Dänemark' },
    { value: 'se', label: 'Schweden' },
    { value: 'bv', label: 'Bouvetinsel' },
    { value: 'no', label: 'Norwegen' },
    { value: 'sj', label: 'Svalbard und Jan Mayen' },
    { value: 'pl', label: 'Polen' },
    { value: 'pe', label: 'Peru' },
    { value: 'mx', label: 'Mexiko' },
    { value: 'cu', label: 'Kuba' },
    { value: 'ar', label: 'Argentinien' },
    { value: 'br', label: 'Brasilien' },
    { value: 'cl', label: 'Chile' },
    { value: 'co', label: 'Kolumbien' },
    { value: 've', label: 'Venezuela' },
    { value: 'my', label: 'Malaysia' },
    { value: 'au', label: 'Australien' },
    { value: 'cc', label: 'Kokosinseln' },
    { value: 'cx', label: 'Weihnachtsinsel' },
    { value: 'id', label: 'Indonesien' },
    { value: 'ph', label: 'Philippinen' },
    { value: 'nz', label: 'Neuseeland' },
    { value: 'sg', label: 'Singapur' },
    { value: 'th', label: 'Thailand' },
    { value: 'aq', label: 'Antarktis' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'Korea, Republik' },
    { value: 'vn', label: 'Vietnam' },
    { value: 'cn', label: 'China, Volksrepublik' },
    { value: 'ncy', label: 'Nordzypern' },
    { value: 'tr', label: 'Türkei' },
    { value: 'in', label: 'Indien' },
    { value: 'pk', label: 'Pakistan' },
    { value: 'af', label: 'Afghanistan' },
    { value: 'lk', label: 'Sri Lanka' },
    { value: 'mm', label: 'Myanmar' },
    { value: 'ir', label: 'Iran, Islamische Republik' },
    { value: 'eh', label: 'Westsahara' },
    { value: 'ma', label: 'Marokko' },
    { value: 'dz', label: 'Algerien' },
    { value: 'tn', label: 'Tunesien' },
    { value: 'ly', label: 'Libysch-Arabische Dschamahirija' },
    { value: 'gm', label: 'Gambia' },
    { value: 'sn', label: 'Senegal' },
    { value: 'mr', label: 'Mauretanien' },
    { value: 'ml', label: 'Mali' },
    { value: 'gn', label: 'Guinea' },
    { value: 'ci', label: 'Côte d‘Ivoire, Republik' },
    { value: 'bf', label: 'Burkina Faso' },
    { value: 'ne', label: 'Niger' },
    { value: 'tg', label: 'Togo' },
    { value: 'bj', label: 'Benin' },
    { value: 'mu', label: 'Mauritius' },
    { value: 'lr', label: 'Liberia' },
    { value: 'sl', label: 'Sierra Leone' },
    { value: 'gh', label: 'Ghana' },
    { value: 'ng', label: 'Nigeria' },
    { value: 'td', label: 'Tschad' },
    { value: 'cf', label: 'Zentralafrikanische Republik' },
    { value: 'cm', label: 'Kamerun' },
    { value: 'cv', label: 'Kap Verde' },
    { value: 'st', label: 'Sao Tome und Principe' },
    { value: 'gq', label: 'Äquatorialguinea' },
    { value: 'ga', label: 'Gabun' },
    { value: 'cg', label: 'Kongo, Republik' },
    { value: 'zr', label: 'Kongo, Demokratische Republik' },
    { value: 'ao', label: 'Angola' },
    { value: 'gw', label: 'Guinea-Bissau' },
    { value: 'io', label: 'Britisches Territorium im Indischen Ozean' },
    { value: 'ac', label: 'Ascension' },
    { value: 'sc', label: 'Seychellen' },
    { value: 'sd', label: 'Sudan' },
    { value: 'rw', label: 'Ruanda' },
    { value: 'et', label: 'Äthiopien' },
    { value: 'so', label: 'Somalia' },
    { value: 'dj', label: 'Dschibuti' },
    { value: 'ke', label: 'Kenia' },
    { value: 'tz', label: 'Tansania, Vereinigte Republik' },
    { value: 'ug', label: 'Uganda' },
    { value: 'bi', label: 'Burundi' },
    { value: 'mz', label: 'Mosambik' },
    { value: 'zm', label: 'Sambia' },
    { value: 'mg', label: 'Madagaskar' },
    { value: 're', label: 'Réunion' },
    { value: 'tf', label: 'Französische Süd- und Antarktisgebiete' },
    { value: 'yt', label: 'Mayotte' },
    { value: 'zw', label: 'Simbabwe' },
    { value: 'na', label: 'Namibia' },
    { value: 'mw', label: 'Malawi' },
    { value: 'ls', label: 'Lesotho' },
    { value: 'bw', label: 'Botswana' },
    { value: 'sz', label: 'Swasiland' },
    { value: 'km', label: 'Komoren' },
    { value: 'sh', label: 'St. Helena' },
    { value: 'er', label: 'Eritrea' },
    { value: 'aw', label: 'Aruba' },
    { value: 'fo', label: 'Färöer' },
    { value: 'gl', label: 'Grönland' },
    { value: 'gi', label: 'Gibraltar' },
    { value: 'pt', label: 'Portugal' },
    { value: 'lu', label: 'Luxemburg' },
    { value: 'ie', label: 'Irland' },
    { value: 'is', label: 'Island' },
    { value: 'al', label: 'Albanien' },
    { value: 'mt', label: 'Malta' },
    { value: 'cy', label: 'Zypern' },
    { value: 'fi', label: 'Finnland' },
    { value: 'bg', label: 'Bulgarien' },
    { value: 'lt', label: 'Litauen' },
    { value: 'lv', label: 'Lettland' },
    { value: 'ee', label: 'Estland' },
    { value: 'md', label: 'Moldawien' },
    { value: 'am', label: 'Armenien' },
    { value: 'by', label: 'Weissrussland' },
    { value: 'ad', label: 'Andorra' },
    { value: 'mc', label: 'Monaco' },
    { value: 'sm', label: 'San Marino' },
    { value: 'va', label: 'Vatikanstadt' },
    { value: 'ua', label: 'Ukraine' },
    { value: 'rs', label: 'Serbien' },
    { value: 'ko', label: 'Kosovo, Republik' },
    { value: 'me', label: 'Montenegro' },
    { value: 'hr', label: '>Kroatien' },
    { value: 'si', label: 'Slowenien' },
    { value: 'ba', label: 'Bosnien und Herzegowina' },
    { value: 'mk', label: 'Mazedonien' },
    { value: 'cz', label: 'Tschechische Republik' },
    { value: 'sk', label: 'Slowakei' },
    { value: 'fk', label: 'Falklandinseln' },
    { value: 'bz', label: 'Belize' },
    { value: 'gt', label: 'Guatemala' },
    { value: 'sv', label: 'El Salvador' },
    { value: 'hn', label: 'Honduras' },
    { value: 'ni', label: 'Nicaragua' },
    { value: 'cr', label: 'Costa Rica' },
    { value: 'pa', label: 'Panama' },
    { value: 'pm', label: 'St. Pierre und Miquelon' },
    { value: 'ht', label: 'Haiti' },
    { value: 'gp', label: 'Guadeloupe' },
    { value: 'bo', label: 'Bolivien' },
    { value: 'gy', label: 'Guyana' },
    { value: 'ec', label: 'Ecuador' },
    { value: 'gf', label: 'Französisch-Guayana' },
    { value: 'py', label: 'Paraguay' },
    { value: 'mq', label: 'Martinique' },
    { value: 'sr', label: 'Suriname' },
    { value: 'uy', label: 'Uruguay' },
    { value: 'an', label: 'Niederländische Antillen' },
    { value: 'pn', label: 'Pitcairninseln' },
    { value: 'tl', label: 'Timor-Leste' },
    { value: 'hm', label: 'Heard- und McDonald-Inseln' },
    { value: 'bn', label: 'Brunei Darussalam' },
    { value: 'nr', label: 'Nauru' },
    { value: 'pg', label: 'Papua-Neuguinea' },
    { value: 'to', label: 'Tonga' },
    { value: 'sb', label: 'Salomonen' },
    { value: 'vu', label: 'Vanuatu' },
    { value: 'fj', label: 'Fidschi' },
    { value: 'pw', label: 'Palau' },
    { value: 'wf', label: 'Wallis und Futuna' },
    { value: 'ck', label: 'Cookinseln' },
    { value: 'nu', label: 'Niue' },
    { value: 'as', label: 'Amerikanisch-Samoa' },
    { value: 'ws', label: 'Samoa' },
    { value: 'ki', label: 'Kiribati' },
    { value: 'nc', label: 'Neukaledonien' },
    { value: 'tv', label: 'Tuvalu' },
    { value: 'pf', label: 'Französisch-Polynesien' },
    { value: 'tk', label: 'Tokelau' },
    { value: 'fm', label: 'Mikronesien' },
    { value: 'mh', label: 'Marshallinseln' },
    { value: 'kp', label: 'Korea, Demokratische Volksrepublik' },
    { value: 'hk', label: 'Hongkong' },
    { value: 'mo', label: 'Macao' },
    { value: 'kh', label: 'Kambodscha' },
    { value: 'la', label: 'Laos, Demokratische Volksrepublik' },
    { value: 'bd', label: 'Bangladesch' },
    { value: 'tw', label: 'Taiwan' },
    { value: 'mv', label: 'Malediven' },
    { value: 'lb', label: 'Libanon' },
    { value: 'jo', label: 'Jordanien' },
    { value: 'sy', label: 'Syrien, Arabische Republik' },
    { value: 'iq', label: 'Irak' },
    { value: 'kw', label: 'Kuwait' },
    { value: 'sa', label: 'Saudi-Arabien' },
    { value: 'ye', label: 'Jemen' },
    { value: 'om', label: 'Oman' },
    { value: 'ps', label: 'Palästinensische Autonomiegebiete' },
    { value: 'ae', label: 'Vereinigte Arabische Emirate' },
    { value: 'il', label: '>Israel' },
    { value: 'bh', label: 'Bahrain' },
    { value: 'qa', label: '>Katar' },
    { value: 'bt', label: '>Bhutan' },
    { value: 'mn', label: '>Mongolei' },
    { value: 'np', label: '>Nepal' },
    { value: 'tj', label: 'Tadschikistan' },
    { value: 'tm', label: 'Turkmenistan' },
    { value: 'az', label: 'Aserbaidschan' },
    { value: 'ge', label: 'Georgien' },
    { value: 'kg', label: 'Kirgisistan' },
    { value: 'uz', label: 'sbekistan' },
    { value: 'mp', label: 'Nördliche Marianen' },
    { value: 'um', label: 'Amerikanisch-Ozeanien' },
    { value: 'vg', label: 'Britische Jungferninseln' },
    { value: 'nf', label: 'Norfolkinsel' },
    { value: 'ax', label: 'Aland' },
    { value: 'gs', label: 'Südgeorgien und die Südlichen Sandwichinseln' }


];

const days = [
    { value: '01', label: '1'},
    { value: '02', label: '2'},
    { value: '03', label: '3'},
    { value: '04', label: '4'},
    { value: '05', label: '5'},
    { value: '06', label: '6'},
    { value: '07', label: '7'},
    { value: '08', label: '8'},
    { value: '09', label: '9'},
    { value: '10', label: '10'},
    { value: '11', label: '11'},
    { value: '12', label: '12'},
    { value: '13', label: '13'},
    { value: '14', label: '14'},
    { value: '15', label: '15'},
    { value: '16', label: '16'},
    { value: '17', label: '17'},
    { value: '18', label: '18'},
    { value: '19', label: '19'},
    { value: '20', label: '20'},
    { value: '21', label: '21'},
    { value: '22', label: '22'},
    { value: '23', label: '23'},
    { value: '24', label: '24'},
    { value: '25', label: '25'},
    { value: '26', label: '26'},
    { value: '27', label: '27'},
    { value: '28', label: '28'},
    { value: '29', label: '29'},
    { value: '30', label: '30'},
    { value: '31', label: '31'},
];

const mounth = [
    { value: '01', label: 'Januar' },,
    { value: '02', label: 'Februar' },,
    { value: '03', label: 'März' },,
    { value: '04', label: 'April' },,
    { value: '05', label: 'Mai' },,
    { value: '06', label: 'Juni' },,
    { value: '07', label: 'Juli' },,
    { value: '08', label: 'August' },,
    { value: '09', label: 'September' },,
    { value: '10', label: 'Oktober' },,
    { value: '11', label: 'November' },,
    { value: '12', label: 'Dezember' },
];

const country = [
    {value: 'ch', label: 'Schweiz'},
    {value: 'li', label: 'Liechtenstein'}
]

export class ThankYouPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            basketDataForSimilarItems: [],
            similarItems: [],
            bitpayMessage: false,
            totalPrice: 0,
            asGuest: false,

            errorAgree: false,
            isCheckboxAgree: true,
            selectedOptionLanguages: null,
            selectedOptionNationality: null,
            selectedOptionDays: null,
            selectedOptionMounth: null,
            selectedOptionYear: null,
            selectedOptionCounry: null,

            customer_gender: '',
            customer_firstname: '',
            customer_lastname: '',
            customer_street: '',
            customer_number: '',
            customer_city: '',
            customer_zip: '',
            customer_email: '',
            customer_phone: '',
            insuranceShortCode: '',
            email: '',

            errorAgree: false,
            isCheckboxAgree: true,

            isShowCompanyField: false,
            isButtonDisabled: true,

            inputErrors: {
                gender: null,
                firstname: null,
                lastname: null,
                zip: null,
                address: null,
                phone: null,
                email: null,
                streetnumber: null,
                insuranceProductId: null,
                language: null,
                nationality: null,
                birthday: null,
                country: null
            },

            isFormApproved: false,
            hideForm: false,
            message: null,
            isSendFormSuccessfully: false,
            countries: [{}],
            bankPaymentModal: null,
        }

        this.mapBasketItems = this.mapBasketItems.bind(this)
        this.mapBasketItemsDevices = this.mapBasketItemsDevices.bind(this)
        this.checkIsLogin = this.checkIsLogin.bind(this)
        this._getPrice = this._getPrice.bind(this)

        this.sendForm = this.sendForm.bind(this)
    }

    componentDidMount(){
        let basketDataForSimilarItems = JSON.parse(window.localStorage.getItem('basketData')),
            basketShortcode = window.localStorage.getItem('basketShortcode'),
            customerShortcode = window.localStorage.getItem('customerShortcode'),
            totalPrice = basketDataForSimilarItems ? this._getPrice(basketDataForSimilarItems) : 0,
            asGuest = JSON.parse(window.localStorage.getItem('asGuest')),
            personalData = JSON.parse(window.localStorage.getItem('userData')),
            bankPaymentData = JSON.parse(window.localStorage.getItem('bankPaymentData'));
        this._klavio_purchase(basketDataForSimilarItems, basketShortcode, totalPrice);

        if (personalData) {
            this.setState({ customer_gender:  personalData.billingAddress.customer_gender})
            this.setState({ customer_firstname:  personalData.billingAddress.customer_firstname})
            this.setState({ customer_lastname:  personalData.billingAddress.customer_lastname})
            this.setState({ customer_street:  personalData.billingAddress.customer_street})
            this.setState({ customer_number:  personalData.billingAddress.customer_number})
            this.setState({ customer_city:  personalData.billingAddress.customer_city})
            this.setState({ customer_zip:  personalData.billingAddress.customer_zip})
            this.setState({ customer_email:  personalData.billingAddress.customer_email})
            this.setState({ customer_phone:  personalData.billingAddress.customer_phone})
            this.setState({ email:  personalData.shippingAddress.email})
            if (personalData.billingAddress.customer_inputCountry != '') {
                if (personalData.billingAddress.customer_inputCountry == 'ch')
                    this.setState({ selectedOptionCounry:  {value: 'ch', label: 'Schweiz'}})
                if (personalData.billingAddress.customer_inputCountry == 'li')
                    this.setState({ selectedOptionCounry:  {value: 'li', label: 'Liechtenstein'}})
            }
        }

        if (basketDataForSimilarItems) {
            basketDataForSimilarItems.forEach( item => {
                if(item.productTypeId == 500 && typeof item.shortcode !== 'undefined' && (item.shortcode === 'IDK3VU' || item.shortcode === '8JXTVN')){
                    this.setState({ insuranceShortCode: item.shortcode})
                }
            })
        }

        this.props.basketActions.changeBasketData([])
        this.props.basketActions.changeShippingMethod({selected: false, value: {}})
        if(window.isFBConnection && basketShortcode) {
            fbq('track', 'Purchase', {
                value: totalPrice,
                currency: window.currencyValue,
                contents: [
                    {id: basketShortcode}
                ],
            }) //facebook pixel
        }
        if(window.isGoogleConnection) {
            this._gtag_snippet(basketDataForSimilarItems)
            this._gtag_purchase(basketDataForSimilarItems, basketShortcode, totalPrice);
            this._gtag_report_conversion(basketShortcode, totalPrice);
            this._gtag_report_customer(customerShortcode, basketShortcode);
            if(!JSON.parse(window.localStorage.getItem('isVorauskasse'))){
                this._gapi_load_surveyoptin(basketShortcode);
            }
        }
        window.localStorage.removeItem('isVorauskasse')
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem('basketData')
        window.localStorage.removeItem('shippingMethod')
        window.localStorage.removeItem('basketShortcode')
        window.localStorage.removeItem('customerShortcode')
        window.localStorage.removeItem('asGuest')

        this.setState({ basketDataForSimilarItems, basketShortcode, totalPrice, asGuest })
        axios.post(`/api/similarItems`, {basketData: basketDataForSimilarItems })
            .then( data => {
                this.setState({similarItems: data.data})
            })

        // if bitpay success
        let bitpayMessage = cookieApi.getCookie('bitpayMessage')
        cookieApi.deleteCookie('bitpayMessage')
        if (bitpayMessage) {
            this.setState({bitpayMessage: true})
        }

        if (bankPaymentData) {
            this.setState({bankPaymentModal: <BankPaymentModal data={bankPaymentData} />})
        }
    }

    _gapi_load_surveyoptin(basketShortcode){
        var loggedUserData = JSON.parse(window.localStorage.getItem("loggedUserData"));
        var userData = JSON.parse(window.localStorage.getItem("userData"));
        let user = {};
        if (loggedUserData && loggedUserData.shippingAddress) {
            user.email = loggedUserData.shippingAddress.email;
            user.country = loggedUserData.shippingAddress.inputCountry;

        } else if (userData && userData.shippingAddress) {
            user.email = userData.shippingAddress.email;
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
                        "order_id": basketShortcode,
                        "email": user.email,
                        "delivery_country": user.country,
                        "estimated_delivery_date": estimated_delivery_date,

                        // OPTIONAL FIELDS
                        // "products": [{"gtin":"GTIN1"}, {"gtin":"GTIN2"}]
                    });
            });
        }
    }

    _gtag_report_conversion(basketShortcode, totalPrice, url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        }
        gtag('event', 'conversion', {
            'send_to': 'AW-782352579/S4A_CJqys5cBEMOBh_UC',
            'transaction_id': basketShortcode,
            'value': totalPrice,
            'currency': window.currencyValue,
            'event_callback': callback
        })
        return false;
    }
    _gtag_report_customer(customerShortcode, basketShortcode) {        
        var userData = JSON.parse(window.localStorage.getItem("userData"));
        if (window.dataLayer)
            window.dataLayer.push({
                'customershortcode': customerShortcode ? customerShortcode : '', 
                'basketshortcode': basketShortcode ? basketShortcode : '',
                'email': userData.shippingAddress.email ? userData.shippingAddress.email : '',
                'phone': userData.shippingAddress.phone ? userData.shippingAddress.phone : '',
                'address': {
                    'street': userData.shippingAddress.street ? userData.shippingAddress.street + ',' + userData.shippingAddress.number : '',
                    'city': userData.shippingAddress.city ? userData.shippingAddress.city : '',
                    'state': userData.shippingAddress.inputCountry ? userData.shippingAddress.inputCountry.toUpperCase() : '',
                    'zip': userData.shippingAddress.zip ? userData.shippingAddress.zip : ''
                }
            })
    }    
    _gtag_purchase(basketData, shortcodeBasket, totalPrice){
        let shippingCost = basketData.find( item => item.productTypeId == 11),
            data = basketData.filter( item => ![11,100,999,500,501].includes(item.productTypeId)),
            items = data.map((item) => {
                let  brands, brand, category;
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
                    "brand": brand,
                    "quantity": 1,
                    "category": category,
                    "price": item.discountPrice || item.price,
                }
            });
        var userData = JSON.parse(window.localStorage.getItem("userData"));
        gtag('event', 'purchase', {
            "transaction_id": shortcodeBasket,
            "value": totalPrice,
            "currency": window.currencyValue,
            "shipping": shippingCost ? shippingCost.price : '',
            'email': userData.shippingAddress.email ? userData.shippingAddress.email : '',
            'phone': userData.shippingAddress.phone ? userData.shippingAddress.phone : '',
            'address': {
                'street': userData.shippingAddress.street ? userData.shippingAddress.street + ',' + userData.shippingAddress.number : '',
                'city': userData.shippingAddress.city ? userData.shippingAddress.city : '',
                'state': userData.shippingAddress.inputCountry ? userData.shippingAddress.inputCountry.toUpperCase() : '',
                'zip': userData.shippingAddress.zip ? userData.shippingAddress.zip : ''
            },
            "items": items
        });
    }

    _klavio_purchase(basketData, shortcodeBasket, totalPrice) {
        var loggedUserData = JSON.parse(window.localStorage.getItem("loggedUserData"));
        var userData = JSON.parse(window.localStorage.getItem("userData"));

        let user = {};
        if (loggedUserData && loggedUserData.systemAddress) {
            user.email = loggedUserData.systemAddress.email;
            user.first_name = loggedUserData.systemAddress.first_name;
            user.last_name = loggedUserData.systemAddress.last_name;
            user.phone = loggedUserData.systemAddress.phone;
            user.billingAddress = loggedUserData.billingAddress;
            user.shippingAddress = loggedUserData.shippingAddress;

        } else if (userData && userData.billingAddress) {
            user.email = userData.billingAddress.customer_email;
            user.first_name = userData.billingAddress.customer_firstname;
            user.last_name = userData.billingAddress.customer_lastname;
            user.phone = userData.billingAddress.customer_phone;
            user.billingAddress = userData.billingAddress;
            user.shippingAddress = userData.shippingAddress;
        } else {
            return;
        }

        let itemNames = [],
            itemCategories = [],
            itemBrands = [],
            coupon = basketData.find(item => [999].includes(item.productTypeId)) || {};

        let klavioItems = basketData.filter(item => ![11, 100, 999, 500].includes(item.productTypeId)).map((item) => {
            let url = '';
            if (ACCESSORIES_ID.includes(item.productTypeId)) {        // if item 'accessories' 3 = cases / 4 = accessories / 5 = software / 9 = spare parts / 10 = temperd glass
                let modelName = item.model ? item.model.split(" ").join('-').toLowerCase().replace(/\//g, '--') : 'model',
                    deviceName = item.deviceName ? item.deviceName.toLowerCase().replace(/ /g, '-') : 'device';
                url = `/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`
            } else {
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
            } else {
                brand = item.deviceName;
                category = '';
            }
            itemNames.push(item.descriptionLong || item.model);

            if (category !== '') {
                itemCategories.push(category);
            }
            if (brand !== '') {
                itemBrands.push(brand);
            }
            return {
                "ProductID": item.shortcode,
                "ProductName": item.descriptionLong || item.model || '',
                "Quantity": 1,
                "ProductURL": url,
                "ImageURL": item.deviceImages.mainImg.src,
                "Categories": [category],
                "ItemPrice": item.discountPrice || item.price,
                "Brand": brand
            }
        });

        var data = JSON.stringify({
            "token": window.klavioPublicAPIKey,
            "event": "Placed Order",
            "customer_properties": {
                "$email": user.email,
                "$first_name": user.first_name,
                "$last_name": user.last_name,
                "$phone_number": user.phone,
                "$city": user.city,
                "$zip": user.zip,
                "$region": user.region,
                "$country": user.country
            },
            "properties": {
                "$event_id": shortcodeBasket + '1',
                "$value": totalPrice,
                "Categories": itemCategories,
                "ItemNames": itemNames,
                "Brands": itemBrands,
                "Discount Code": coupon.shortcode || '',
                "Discount Value": coupon.price || '',
                "Items": klavioItems,
                "billing_address": {
                    "first_name": user.billingAddress.customer_firstname,
                    "last_name": user.billingAddress.customer_lastname,
                    "company": user.billingAddress.customer_companyName,
                    "address1": `${user.billingAddress.customer_street} ${user.billingAddress.customer_number}`,
                    "city": user.billingAddress.customer_city,
                    "country_code": user.billingAddress.customer_inputCountry,
                    "zip": user.billingAddress.customer_zip,
                    "phone": user.billingAddress.customer_phone
                },
                "shipping_address": {
                    "first_name": user.shippingAddress.firstname,
                    "last_name": user.shippingAddress.lastname,
                    "company": user.shippingAddress.companyName,
                    "address1": `${user.shippingAddress.street} ${user.shippingAddress.number}`,
                    "city": user.shippingAddress.city,
                    "country_code": user.shippingAddress.inputCountry,
                    "zip": user.shippingAddress.zip,
                    "phone": user.shippingAddress.phone
                }
            },
            "time": Math.floor(Date.now() / 1000)

        });
        data = btoa(unescape(encodeURIComponent(data)));
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/sendKlavioPlacedOrder?data=${data}`)
            .then(result => {
                document.getElementById('spinner-box-load').style.display = 'none'
            })
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
            'ecomm_pagetype': 'purchase',
            'ecomm_totalvalue': totalValue,
            'ecomm_category': 'Electronics'
        })
    }
    _getPrice(data){
        let subject = 0,
            total,
            creditsCount = 0
        data.forEach( item => {
            if (item.productTypeId != 500) {
                if(item.productTypeId == 100 || item.productTypeId == 999) creditsCount += +item.price
                else subject += item.discountPrice ? +item.discountPrice : +item.price
            }
        })
        total = (subject) - creditsCount
        return total
    }
    mapBasketItemsDevices(item, i){
        let productTypeIds = [1, 2, 3, 4, 5 , 6, 7, 8, 10, 12, 20, 996]
        if( productTypeIds.some( id =>  id == item.productTypeId)){
            return (
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>{item.model} ({item.shortcode})</p>
                        <p>{item.color}, {item.capacity}</p>
                    </div>
                    <div className="price">
                        <p className={item.discountPrice ? 'old-price' : ''}>{ item.price } {window.currencyValue}</p>
                        {item.discountPrice &&
                            <p className="discount-price">{item.discountPrice} {window.currencyValue}</p>
                        }
                    </div>
                </div>
            )
        }
    }
    mapBasketItems(item, i){
        if(item.productTypeId == 11){
            return(
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>{item.name}</p>
                    </div>
                    <div className="price">
                        <p>{item.price} {window.currencyValue}</p>
                    </div>
                </div>
            )
        }
        else if( item.productTypeId == 999){
            return(
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>{ item.note } ({item.shortcode})</p>
                    </div>
                    <div className="price">
                        <p>-{ Math.round((+item.price) * 100) / 100} {window.currencyValue}</p>
                    </div>
                </div>
            )
        }
        else if( item.productTypeId == 100){
            return(
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>Credits</p>
                    </div>
                    <div className="price">
                        <p>-{ Math.round((+item.price) * 100) / 100} {window.currencyValue}</p>
                    </div>
                </div>
            )
        }
        else if( item.productTypeId == 501){// for germany
            return(
                <div key={i} className="itemModel">
                    <div className="model">
                        <p>{ item.title }</p>
                    </div>
                    <div className="price">
                        <p>{ item.price} {item.currency}</p>
                    </div>
                </div>
            )
        }
    }
    checkIsLogin(e){
        e.preventDefault()
        let { isLogin } = this.props.user
        if(!isLogin){
            if(this.state.asGuest){
                browserHistory.push('/')
            }
            else{
                this.props.userActions.setRedirectTo('/kundenkonto')
                browserHistory.push('/kundenkonto')
            }
        }
        else browserHistory.push('/kundenkonto')
    }

    getCountryList = () => {
        document.getElementById('spinner-box-load').style.display = 'block';
        axios.get('api/countriesCare')
        .then( ({data}) => {
            document.getElementById('spinner-box-load').style.display = 'none'
            let countriesData = data.data;
            let activeRes = countriesData.filter( item => item['active-de'] !== 0).sort(function (a, b) {
                return a['active-de'] - b['active-de'];
            })
            activeRes.push({'name-short': '', 'name-de': '' })
            let allRes = activeRes.concat(countriesData.filter( item => item['active-de'] === 0).sort(function (a, b) {
                return a['id'] - b['id'];
            }))

            let countries = allRes.map( item => {return {value: item['name-short'], label: item['name-de']}})
            this.setState({countries})
        })
        .catch( (errorCountry) => {

        })
    }

    changeCheckbox = () => {
        const { isFormApproved, errorAgree } = this.state;
        this.setState({ isFormApproved: !isFormApproved })
        if(errorAgree){
            this.setState({errorAgree: !errorAgree})
        }
    }

    toggleShowCompany = () => {
        this.setState({isShowCompanyField: !this.state.isShowCompanyField})
    }

    handleChangeLanguages = selectedOptionLanguages  => {
        this.setState({selectedOptionLanguages})
    }

    handleChangeNationality = selectedOptionNationality => {
        this.setState({selectedOptionNationality})
    }

    handleChangeDays = selectedOptionDays => {
        this.setState({selectedOptionDays})
    }

    handleChangeMounth = selectedOptionMounth => {
        this.setState({selectedOptionMounth})
    }

    handleChangeYear = selectedOptionYear => {
        this.setState({selectedOptionYear})
    }

    handleChangeCountry = selectedOptionCounry => {
        this.setState({selectedOptionCounry})
    }

    handleChangeGender = (e) => {
        this.setState({customer_gender: document.querySelector('input[name="gender"]:checked').value})
    }

    handleChangeFirstname = (e) => {
        this.setState({customer_firstname: e.target.value})
    }

    handleChangeLastname = (e) => {
        this.setState({customer_lastname: e.target.value})
    }

    handleChangeStreet = (e) => {
        this.setState({customer_street: e.target.value})
    }

    handleChangeNumber = (e) => {
        this.setState({customer_number: e.target.value})
    }

    handleChangeCity = (e) => {
        this.setState({customer_city: e.target.value})
    }

    handleChangeZip = (e) => {
        this.setState({customer_zip: e.target.value})
    }

    handleChangeEmail = (e) => {
        this.setState({customer_email: e.target.value})
    }

    handleChangePhone = (e) => {
        this.setState({customer_phone: e.target.value})
    }

    createYearFunction = (startYear) => {
        let currentYear = new Date().getFullYear(), years = [];
        startYear = currentYear - 100;
        while ( startYear <= currentYear  ) {
            years.push({value: currentYear--, label: currentYear + 1});
        }
        return years;
    }

    handleChangeInsuranceGender = (e) => {
        if (document.querySelector('input[name="insuranceShortCode"]:checked').value === '1')
            this.setState({insuranceShortCode: 'IDK3VU'})
        if (document.querySelector('input[name="insuranceShortCode"]:checked').value === '2')
            this.setState({insuranceShortCode: '8JXTVN'})
    }

    sendForm(e) {
        e.preventDefault();

        const formData = {};
        let { message, inputErrors, isFormApproved, isSendFormSuccessfully, hideForm } = this.state;
        let year, day, mounth = '';
        for (const field in this.refs) {
            if(field === 'gender'){
                formData[field] = document.querySelector('input[name="gender"]:checked').value;
            }
            else if(field === 'isCompany'){
                formData[field] = document.getElementById('company').checked ? true : false;
            }
            else if(field === 'insuranceProductId'){
                formData[field] = document.querySelector('input[name="insuranceShortCode"]:checked').value;
            }
            else if(field === 'language' && this.refs[field].props.value){
                formData[field] = this.refs[field].props.value.value;
            }
            else if(field === 'nationality' && this.refs[field].props.value){
                formData[field] = this.refs[field].props.value.value;
            }
            else if(field === 'country' && this.refs[field].props.value){
                formData[field] = this.refs[field].props.value.value;
            }
            else if(field === 'birthdayDay' && this.refs[field].props.value){
                day = this.refs[field].props.value.value;
            }
            else if(field === 'birthdayMounth' && this.refs[field].props.value){
                mounth = this.refs[field].props.value.value;
            }
            else if(field === 'birthdayYear' && this.refs[field].props.value){
                year = this.refs[field].props.value.value;
            }
            else {
                formData[field] = this.refs[field].value;
            }
        }
        formData['birthday'] = year + '-' +  mounth + '-' + day;
        if(isFormApproved){
            this.setState({ isFormApproved: { ...this.state.isFormApproved, errorAgree: false } })
            document.getElementById('spinner-box-load').style.display = 'block';
                axios.post('/api/createCustomerToInsuranceProductCh', formData)
                    .then( result => {
                        document.getElementById('spinner-box-load').style.display = 'none';
                        this.setState({ message: result.data})
                        this.setState({isSendFormSuccessfully : !isSendFormSuccessfully})

                        setTimeout(() => {
                            if(screen.width < 479){
                                window.scrollTo({top: 0, behavior: "smooth"})
                            }
                            this.setState({hideForm: !hideForm})
                        }, 7000)
                    })
                    .catch( (error) => {
                        document.getElementById('spinner-box-load').style.display = 'none';
                        const err = error.response.data.errors;
                        let gender, firstname, lastname, address, streetnumber, zip, city, phone, email, language, nationality, birthday, insuranceProductId, country;
                        if (err) {
                            err.gender ? gender = err.gender[0] : '';
                            err.firstname ? firstname = err.firstname[0] : '';
                            err.lastname ? lastname = err.lastname[0] : '';
                            err.address ? address = err.address[0] : '';
                            err.streetnumber ? streetnumber = err.streetnumber[0] : '';
                            err.zip ? zip = err.zip[0] : '';
                            err.city ? city = err.city[0] : '';
                            err.country ? country = err.country[0] : '';
                            err.phone ? phone = err.phone[0] : '';
                            err.email ? email = err.email[0] : '';
                            err.language ? language = err.language[0] : '';
                            err.nationality ? nationality = err.nationality[0] : '';
                            err.birthday ? birthday = err.birthday[0] : '';
                            err.insuranceProductId ? insuranceProductId = err.insuranceProductId[0] : '';
                        }
                        this.setState({ inputErrors: { ...inputErrors, gender, firstname, lastname, address, streetnumber, zip, city, phone, email, language, nationality, birthday, insuranceProductId, country } });
                    })
            }
            else{
                this.setState({ isFormApproved: false, errorAgree: true})
            }

    }

    render() {
        let {
            customer_gender,
            customer_firstname,
            customer_lastname,
            customer_street,
            customer_number,
            customer_city,
            customer_zip,
            customer_email,
            customer_phone,
            selectedOptionLanguages,
            selectedOptionNationality,
            selectedOptionCounry,
            selectedOptionDays,
            selectedOptionMounth,
            selectedOptionYear,
            basketDataForSimilarItems,
            totalPrice,
            bitpayMessage,
            inputErrors,
            errorAgree,
            isSendFormSuccessfully,
            email } = this.state
        const years = this.createYearFunction();
        return (
            <div className="paymentPage">
                <div className="container">
                    <div className="col-md-8 col-md-push-2" >
                        <div className="wrapWindow text-center">
                            <div className="circle ok"/>
                            <p className="bigText">Herzlichen Glückwunsch</p>
                            {!bitpayMessage && <p className="smallText" style={{marginBottom: '0px', paddingBottom: '0px'}}>Vielen Dank für Ihre Bestellung, wir werden diese umgehend bearbeiten.</p>}
                            {bitpayMessage && <p className="smallText" style={{marginBottom: '0px', paddingBottom: '0px'}}>Vielen Dank für Ihre Bestellung, wir warten aktuell noch auf die finale Bestätigung des Zahlungseinganges</p>}
                            <p className="smallText" style={{marginTop: '0px'}}>
                                Sie erhalten in wenigen Minuten eine Bestellbestätigung per E-Mail auf <span id='customer-email'>{email}</span>
                            </p>
                            <h3>Bestellübersicht</h3>
                            <div className="wrapBasketItems first">
                                { basketDataForSimilarItems.map( this.mapBasketItemsDevices )}
                            </div>
                            <div className="wrapBasketItems">
                                { basketDataForSimilarItems.map( this.mapBasketItems )}
                            </div>
                            <div className="total">
                                <p className="col-xs-6 title">Total inkl. MwSt</p>
                                <p className="col-xs-6 priceTotal">{ (Math.round(totalPrice * 100) / 100)} {window.currencyValue}</p>
                            </div>
                            <Link to={'/kundenkonto'} className="btn" onClick={this.checkIsLogin}>
                                Im Detail ansehen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </Link>
                        </div>
                        {this.state.insuranceShortCode !== '' &&
                        <div className="insuranceHelp" >
                            <div className="insuranceHelpHeader">
                                <div className="logos">
                                    <img src="/images/logo/remarket-care.jpg" alt=""/>
                                </div>
                                <div className="insuranceHelpTitle">
                                    Handyversicherung
                                    <br />
                                    Jetzt schnell und einfach versichern
                                </div>
                                <div className="insuranceHelpDesc">
                                    <span>Scrolle runter</span> um mehr über die Versicherung zu erfahren
                                </div>
                            </div>
                            <div className="insuranceHelpScroll">
                                <div className="insuranceHelpScrollLink">
                                    <div className="insuranceHelpScrollButton">
                                        <img src="/images/mouse.svg" alt=""/>
                                    </div>
                                </div>
                            </div>
                            {!window.isMobile &&
                            <div className="insuranceHelpBody">
                                <div className="insuranceHelpBodyTitle">
                                    <div className="insuranceHelpLeft">
                                        Was ist versichert?
                                    </div>
                                    <div className="insuranceHelpRight">
                                        Vorteile
                                    </div>
                                </div>
                                <div className="insuranceHelpItem">
                                    <div className="insuranceHelpLeft">
                                        <img src="/images/n-check.svg" />
                                        <p>Schutz beim Displayschaden</p>
                                    </div>
                                    <div className="insuranceHelpRight">
                                        <img src="/images/n-check.svg" />
                                        <p>Nur 50.- CHF Selbstbehalt bei Schadensereignis</p>
                                    </div>
                                </div>
                                <div className="insuranceHelpItem">
                                    <div className="insuranceHelpLeft">
                                        <img src="/images/n-check.svg" />
                                        <p>Schutz bei Totalschaden /Wasserschaden</p>
                                    </div>
                                    <div className="insuranceHelpRight">
                                        <img src="/images/n-check.svg" />
                                        <p>Neuwert versichert: Falls das Handy nach einem Totalschaden ersetzt werden muss, wird Ihnen der Neuwert zurückerstattet</p>
                                    </div>
                                </div>
                                <div className="insuranceHelpItem">
                                    <div className="insuranceHelpLeft">
                                        <img src="/images/n-check.svg" />
                                        <p>Schutzhülle ist ebenfalls versichert</p>
                                    </div>
                                    <div className="insuranceHelpRight">
                                        <img src="/images/n-check.svg" />
                                        <p>Weltweite Deckung: Ob zu Hause oder auf Reisen, Ihr Handy ist rundum geschützt</p>
                                    </div>
                                </div>
                            </div>
                            }

                            {window.isMobile &&
                            <div>
                                <div className="insuranceHelpBody">
                                    <div className="insuranceHelpBodyTitle">
                                        <div className="insuranceHelpLeft">
                                            Was ist versichert?
                                        </div>
                                    </div>
                                    <div className="insuranceHelpItem">
                                        <div className="insuranceHelpLeft">
                                            <img src="/images/n-check.svg" />
                                            <p>Schutz beim Displayschaden</p>
                                        </div>
                                    </div>
                                    <div className="insuranceHelpItem">
                                        <div className="insuranceHelpLeft">
                                            <img src="/images/n-check.svg" />
                                            <p>Schutz bei Totalschaden / Wasserschaden</p>
                                        </div>
                                    </div>
                                    <div className="insuranceHelpItem">
                                        <div className="insuranceHelpLeft">
                                            <img src="/images/n-check.svg" />
                                            <p>Schutzhülle ist ebenfalls versichert</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="insuranceHelpBody">
                                    <div className="insuranceHelpBodyTitle">
                                        <div className="insuranceHelpLeft">
                                            Vorteile
                                        </div>
                                    </div>
                                    <div className="insuranceHelpItem">
                                        <div className="insuranceHelpLeft">
                                            <img src="/images/n-check.svg" />
                                            <p>Nur 50.- CHF Selbstbehalt bei Schadensereignis</p>
                                        </div>
                                    </div>
                                    <div className="insuranceHelpItem">
                                        <div className="insuranceHelpLeft">
                                            <img src="/images/n-check.svg" />
                                            <p>Neuwert versichert: Falls das Handy nach einem Totalschaden ersetzt werden muss, wird Ihnen der Neuwert zurückerstattet</p>
                                        </div>
                                    </div>
                                    <div className="insuranceHelpItem">
                                        <div className="insuranceHelpLeft">
                                            <img src="/images/n-check.svg" />
                                            <p>Weltweite Deckung: Ob zu Hause oder auf Reisen, Ihr Handy ist rundum geschützt</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }

                            <div className="insuranceHelpBottom">
                                <div className="insuranceHelpTitle">
                                    Überzeugt?
                                </div>
                                <div className="insuranceHelpDesc">
                                    <span>Scrolle runter</span> um das Formular fertig auszufüllen.
                                </div>
                            </div>
                        </div>
                        }
                        {this.state.insuranceShortCode !== '' &&
                        <div className="versichernForm" >
                            <div className="formHeader">
                                <div className="formTitle">
                                    Bitte Versicherungsinformationen vervollständigen
                                </div>
                                <div className="formDesc">
                                    Falls Sie die Informationen nicht vervollständigen, kann leider keine Versicherung aktiviert werden
                                </div>
                            </div>
                            <div className="formBody">
                                <form action="#" name="versichernForm" onSubmit={this.sendForm}>
                                    <div className="wrapLabel">
                                        <label>
                                            <input type="radio" ref="gender" name="gender" value="Herr" required checked={customer_gender === 'Herr' ? true : false} onChange={this.handleChangeGender} /><span className="versichernCheckbox"/>Herr
                                            {inputErrors.gender && <p className="inpuErrorsGender">{inputErrors.gender}</p>}
                                        </label>
                                        <label>
                                            <input type="radio" ref="gender" name="gender" value="Frau" required checked={customer_gender === 'Frau' ? true : false} onChange={this.handleChangeGender} /><span className="versichernCheckbox"/>Frau
                                        </label>
                                    </div>
                                    <div className="rowInputs">
                                        <div>
                                            <input type="text" ref="firstname" name="firstname" placeholder="Vorname" required value={customer_firstname} onChange={this.handleChangeFirstname} />
                                            {inputErrors.firstname && <p className="inpuErrors">{inputErrors.firstname}</p>}
                                        </div>

                                        <div>
                                            <input type="text" ref="lastname" name="lastname" placeholder="Nachname" required value={customer_lastname} onChange={this.handleChangeLastname} />
                                            {inputErrors.lastname && <p className="inpuErrors">{inputErrors.lastname}</p>}
                                        </div>
                                    </div>

                                    <div className="rowInputs">
                                        <div>
                                            <input type="text" ref="address" name="address" placeholder="Strasse" required value={customer_street} onChange={this.handleChangeStreet} />
                                            {inputErrors.address && <p className="inpuErrors">{inputErrors.address}</p>}
                                        </div>

                                        <div>
                                            <input type="text" ref="streetnumber" name="streetnumber" placeholder="Nr." required value={customer_number} onChange={this.handleChangeNumber} />
                                            {inputErrors.streetnumber && <p className="inpuErrors">{inputErrors.streetnumber}</p>}
                                        </div>
                                    </div>

                                    <div className="rowInputs">
                                        <div>
                                            <input type="text" ref="zip" name="zip" placeholder="PLZ" required value={customer_zip} onChange={this.handleChangeZip} />
                                            {inputErrors.zip && <p className="inpuErrors">{inputErrors.zip}</p>}
                                        </div>

                                        <div>
                                            <input type="text" ref="city" name="city" placeholder="Ort" required value={customer_city} onChange={this.handleChangeCity} />
                                            {inputErrors.city && <p className="inpuErrors">{inputErrors.city}</p>}
                                        </div>
                                    </div>

                                    <div className="versichernSelect">
                                        <div>
                                            <div className="select selectCountry">
                                                <Select
                                                    placeholder="Land"
                                                    name="country"
                                                    ref="country"
                                                    options={country}
                                                    value={selectedOptionCounry}
                                                    onChange={this.handleChangeCountry}
                                                    clearable={false}
                                                    searchable={false}
                                                    required={true}
                                                />
                                                {inputErrors && inputErrors.country && <p className="inpuErrors">{inputErrors.country}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rowInputs">
                                        <div>
                                            <input type="number" ref="phone" name="phone" placeholder="Telefon" required value={customer_phone} onChange={this.handleChangePhone} />
                                            {inputErrors.phone && <p className="inpuErrors">{inputErrors.phone}</p>}
                                        </div>

                                        <div>
                                            <input type="email" ref="email" name="email" placeholder="E-Mail" required value={customer_email} onChange={this.handleChangeEmail} />
                                            {inputErrors.email && <p className="inpuErrors">{inputErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="versichernSelect">
                                        <div className="select">
                                            <Select
                                                placeholder="Sprache"
                                                name="language"
                                                ref="language"
                                                value={selectedOptionLanguages}
                                                onChange={this.handleChangeLanguages}
                                                options={languages}
                                                clearable={false}
                                                searchable={false}
                                                required={true}
                                            />
                                            {inputErrors.language && <p className="inpuErrors">{inputErrors.language}</p>}
                                        </div>
                                        <div className="select">
                                            <Select
                                                placeholder="Nationalität"
                                                name="nationality"
                                                ref="nationality"
                                                value={selectedOptionNationality}
                                                // value={{ label: 'Schweiz', value: 'ch' }}
                                                onChange={this.handleChangeNationality}
                                                options={nationality}
                                                clearable={false}
                                                searchable={false}
                                                required={true}
                                            />
                                            {inputErrors.nationality && <p className="inpuErrors">{inputErrors.nationality}</p>}
                                        </div>
                                    </div>

                                    <div className="versichernGeburtstagInputs">
                                        <h6 className="versichernGeburtstag">Geburtstag</h6>
                                        <div className="versichernGeburtstagSelect">

                                            <div className="select" id="birthdayDay">
                                                <Select
                                                    placeholder="Tag"
                                                    name="birthday"
                                                    ref="birthdayDay"
                                                    value={selectedOptionDays}
                                                    onChange={this.handleChangeDays}
                                                    options={days}
                                                    clearable={false}
                                                    searchable={false}
                                                    required={true}
                                                />
                                            </div>

                                            <div className="select" id="birthdayMounth">
                                                <Select
                                                    placeholder="Monat"
                                                    name="birthday"
                                                    ref="birthdayMounth"
                                                    value={selectedOptionMounth}
                                                    onChange={this.handleChangeMounth}
                                                    options={mounth}
                                                    clearable={false}
                                                    searchable={false}
                                                    required={true}
                                                />
                                            </div>

                                            <div className="select" id="birthdayYear">
                                                <Select
                                                    placeholder="Jahr"
                                                    name="birthday"
                                                    ref="birthdayYear"
                                                    value={selectedOptionYear}
                                                    onChange={this.handleChangeYear}
                                                    options={years}
                                                    clearable={false}
                                                    searchable={false}
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                        {inputErrors.birthday && <p className="inpuErrors">{inputErrors.birthday}</p>}
                                    </div>

                                    <div>
                                        <div className="versichernInputs">
                                            <div className="versichernMiniForm"  >
                                                <label>
                                                    <input type="radio"
                                                            ref="insuranceProductId"
                                                            name="insuranceShortCode"
                                                            value='1'
                                                            id="insuranceProductId1"
                                                            checked={this.state.insuranceShortCode === 'IDK3VU' ? true : false}
                                                            onChange={this.handleChangeInsuranceGender}
                                                            />
                                                    <span className="check"/>
                                                    <div  onClick={ this.toggleToolTip }>
                                                        <h6 className="versichernMiniFormTitle">Einzelversicherung</h6>
                                                        <p className="versichernMiniFormText">60.- pro Jahr</p>
                                                    </div>
                                                </label>
                                                {/* <div className="tooltip1">Bei der Einzelversicherung ist nur Ihr eigenes Gerät versichert</div> */}
                                            </div>
                                            <div className="versichernMiniForm">
                                                <label>
                                                    <input type="radio"
                                                            ref="insuranceProductId"
                                                            name="insuranceShortCode"
                                                            value='2'
                                                            checked={this.state.insuranceShortCode === '8JXTVN' ? true : false}
                                                            onChange={this.handleChangeInsuranceGender}
                                                            />
                                                    <span className="check"/>
                                                    <div onClick={ this.toggleToolTipTwo }>
                                                        <h6 className="versichernMiniFormTitle">Familienversicherung</h6>
                                                        <p className="versichernMiniFormText">120.- pro Jahr</p>
                                                    </div>
                                                </label>
                                                {/* <div className="tooltip2">Hier sind alle Geräte von allen Personen im gleiche Haushalt versichert</div> */}
                                            </div>
                                        </div>
                                        {inputErrors.insuranceProductId && <p className="inpuErrors">{inputErrors.insuranceProductId}</p>}
                                    </div>

                                    <div className="versichernAgree">
                                        <label>
                                            <input type="checkbox"
                                                    name="agree"
                                                    onChange={this.changeCheckbox}
                                                    />
                                            <span className="check"/>
                                            <p className={errorAgree ? 'errorText' : 'versichernAgreeText'}>
                                                Ich erkläre mich einverstanden, dass meine Daten elektronisch gespeichert und hausintern an die Basler Versicherung gesendet werden.
                                            </p>
                                        </label>
                                    </div>
                                    {isSendFormSuccessfully ?
                                    <div>
                                        <p className="successfullyText">Der Versicherungsantrag wurde erfolgreich versendet <img src="/images/n-check.svg" width="30" /></p>
                                        <h4 className="detailInformationtext">Sie erhalten in den nächsten Tagen die Vertragsdokumente von der Basler Versicherung per Post zugestellt und können die Versicherung bequem innerhalb von 30 Tagen per Einzahlungsschein/Rechnung bezahlen.</h4>
                                    </div>
                                    :
                                    ''
                                    }

                                    <div className="text-center">
                                        <button className="versichernBtn" type="submit">Jetzt versichern</button>
                                    </div>
                                </form>
                            </div>
                        </div>}
                    </div>
                </div>
                {this.state.bankPaymentModal}
                {!window.isMobile &&
                                        <div className="similar">
                                            <div className="container">
                                                <ListSimilarItems similarItems={this.state.similarItems}/>
                                                <div className="cb"/>
                                            </div>
                                        </div>
                }
            </div>
        );
    }
}

ThankYouPage.propTypes = {}
ThankYouPage.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(ThankYouPage)