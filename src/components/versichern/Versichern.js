import React from 'react'

import Select from 'react-select'
import axios from 'axios';

import HeaderMainPage from '../header/headerMainPage'
import HeaderMobile from '../mobile/header/headerMobile'
import Footer from '../Footer/footer'

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



export class Versichern extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errorAgree: false,
            isCheckboxAgree: true,

            isShowCompanyField: false,
            isButtonDisabled: true,

            selectedOptionLanguages: null,
            selectedOptionNationality: null,
            selectedOptionDays: null,
            selectedOptionMounth: null,
            selectedOptionYear: null,
            selectedOptionCounry: null,

            inputErrors: {
                gender: null,
                firstname: null,
                lastname: null,
                zip: null,
                address: null,
                phone: null,
                email: null,
                streetnumber: null,
                birthday: null,
                insuranceProductId: null,
                language: null,
                nationality: null,
                birthday: null,
                country: null
            },

            showFirstMobileToolTip: false,
            showSecondMobileToolTip: false,
            showFirstTabletToolTip: false,
            showSecondTabletToolTip: false,
            isFormApproved: false,
            hideForm: false,
            message: null,
            isSendFormSuccessfully: false,
            countries: [{}]
        }
        this.sendForm = this.sendForm.bind(this)
    }
    componentDidMount(){
        let insuranceProductIdButton = document.getElementById('insuranceProductId1');
        insuranceProductIdButton.checked = true;
        this.getCountryList();
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
                formData[field] = document.querySelector('input[name="agree"]:checked').value;
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
                axios.post('/api/createCustomerToInsuranceProduct', formData)
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

    getCountryList = () => {
        document.getElementById('spinner-box-load').style.display = 'block';
        axios.get('api/countriesCare')
        .then( ({data}) => {
            document.getElementById('spinner-box-load').style.display = 'none'
            let countriesData = data.data;
            let activeRes = countriesData.filter( item => item['active-de'] !== 0).sort(function (a, b) {
                return a['active-de'] - b['active-de'];
            })
            activeRes.push({'name-short': '', 'name-de': '' },)
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

    toggleToolTip = () => {
        if(screen.width <= 479){
            this.setState({showFirstMobileToolTip: !this.state.showFirstMobileToolTip})
        }
    }
    toggleToolTipTwo = () => {
        if(screen.width <= 479){
            this.setState({showSecondMobileToolTip: !this.state.showSecondMobileToolTip})
        }
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

    createYearFunction = (startYear) => {
        let currentYear = new Date().getFullYear(), years = [];
        startYear = currentYear - 100;
        while ( startYear <= currentYear  ) {
            years.push({value: currentYear--, label: currentYear + 1});
        }
        return years;
    }

    render(){
        const { selectedOptionLanguages, selectedOptionNationality, selectedOptionDays, selectedOptionMounth, selectedOptionYear, inputErrors, errorAgree, countries, selectedOptionCounry, isSendFormSuccessfully } = this.state;
        const years = this.createYearFunction();
        return (
            <div className="versichernMainContainer">
                <HeaderMainPage />
                <HeaderMobile menu={true} title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <div className="versichernPage">
                    <div className="container">
                        <div className="versichernPageMarkup">
                        <div className="versichernInfo col-sm-5">
                            <h1 className="versichernMainText text-md-left">Handyversicherung - Jetzt schnell und einfach versichern</h1>

                            <h3 className="versichernTitle">Was ist versichert?</h3>
                            <div className="versichernTitleItem">
                                <div className="versichernItemText">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Schutz beim Displayschaden
                                </div>

                                <div className="versichernItemText">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Schutz bei Totalschaden / Wasserschaden
                                </div>

                                <div className="versichernItemText">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Schutzhülle ist ebenfalls versichert
                                </div>
                            </div>

                            <h3 className="versichernTitle">Vorteile</h3>
                            <div className="versichernTitleItem">
                                <div className="versichernItemText">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Nur 50.- CHF Selbstbehalt bei Schadensereignis
                                </div>

                                <div className="versichernItemText">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Neuwert versichert: Falls das Handy nach einem Totalschaden ersetzt werden muss, wird Ihnen der aktuelle Neuwert zurückerstattet
                                </div>

                                <div className="versichernItemText mt-2">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Weltweite Deckung: Ob zuhause oder auf Reisen, Ihr Handy ist rundum geschützt
                                </div>

                                <div className="versichernItemText mt-2">
                                    <img className="versichernImage" src="/images/n-check.svg" alt="remarket.care"/>
                                    Bezahle bequem per Rechnung innerhalb von 30 Tagen
                                </div>
                            </div>
                        </div>

                        <div className={`${this.state.hideForm ? 'hideForm' : ''}`}>
                        <div className={`versichernForm col-sm-7`}>
                        <form action="#" name="versichernForm" onSubmit={this.sendForm}>
                                    <div className="wrapLabel">
                                        <label>
                                            <input type="radio" ref="gender" name="gender" value="Frau" required/><span className="versichernCheckbox"/>Frau
                                            {inputErrors.gender && <p className="inpuErrorsGender">{inputErrors.gender}</p>}
                                        </label>
                                        <label>
                                            <input type="radio" ref="gender" name="gender" value="Herr" required/><span className="versichernCheckbox"/>Herr
                                        </label>
                                    </div>

                                    <div className="rowInputs">
                                        <div>
                                            <input type="text" ref="firstname" name="firstname" placeholder="Vorname" required/>
                                            {inputErrors.firstname && <p className="inpuErrors">{inputErrors.firstname}</p>}
                                        </div>

                                        <div>
                                            <input type="text" ref="lastname" name="lastname" placeholder="Nachname" required/>
                                            {inputErrors.lastname && <p className="inpuErrors">{inputErrors.lastname}</p>}
                                        </div>
                                    </div>

                                    <div className="rowInputs">
                                        <div>
                                            <input type="text" ref="address" name="address" placeholder="Strasse" required/>
                                            {inputErrors.address && <p className="inpuErrors">{inputErrors.address}</p>}
                                        </div>

                                        <div>
                                            <input type="text" ref="streetnumber" name="streetnumber" placeholder="Nr." required/>
                                            {inputErrors.streetnumber && <p className="inpuErrors">{inputErrors.streetnumber}</p>}
                                        </div>
                                    </div>

                                    <div className="rowInputs">
                                        <div>
                                            <input type="number" ref="zip" name="zip" placeholder="PLZ" required/>
                                            {inputErrors.zip && <p className="inpuErrors">{inputErrors.zip}</p>}
                                        </div>

                                        <div>
                                            <input type="text" ref="city" name="city" placeholder="Ort" required/>
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
                                                    options={countries}
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
                                            <input type="number" ref="phone" name="phone" placeholder="Telefon" required/>
                                            {inputErrors.phone && <p className="inpuErrors">{inputErrors.phone}</p>}
                                        </div>

                                        <div>
                                            <input type="email" ref="email" name="email" placeholder="E-Mail" required/>
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
                                                            name="agree"
                                                            value='1'
                                                            id="insuranceProductId1"
                                                            />
                                                    <span className="check"/>
                                                </label>
                                                <div  onClick={ this.toggleToolTip }  id="tooltip" data-description="Bei der Einzelversicherung ist nur Ihr eigenes Gerät versichert">
                                                <div className={ this.state.showFirstMobileToolTip ? "mobileToolTip-1" : "" } >{ this.state.showFirstMobileToolTip ? 'Bei der Einzelversicherung ist nur Ihr eigenes Gerät versichert' : ''}</div>
                                                    <div className={ this.state.showFirstMobileToolTip ? "arrow-down-1" : "" }></div>
                                                    <h6 className="versichernMiniFormTitle">Einzelversicherung</h6>
                                                    <p className="versichernMiniFormText">60.- pro Kalenderjahr</p>
                                                </div>
                                            </div>
                                            <div className="versichernMiniForm">
                                                <label>
                                                    <input type="radio"
                                                            ref="insuranceProductId"
                                                            name="agree"
                                                            value='2'
                                                            />
                                                    <span className="check"/>
                                                </label>
                                                <div className="d-flex flex-column" id="tooltip2" onClick={ this.toggleToolTipTwo } data-description="Fur alle Personen imgleichen Haushalt">
                                                <div className={ this.state.showSecondMobileToolTip ? "mobileToolTip-2" : "" } >{ this.state.showSecondMobileToolTip ? 'Bei der Familienversicherung sind alle Geräte von allen Personen im gleiche Haushalt versichert' : ''}</div>
                                                <div className={ this.state.showSecondMobileToolTip ? "arrow-down-2" : "" }></div>
                                                    <h6 className="versichernMiniFormTitle">Familienversicherung</h6>
                                                    <p className="versichernMiniFormText">120.- pro Kalenderjahr</p>
                                                </div>
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
                                        </label>
                                        <p className={errorAgree ? 'errorText' : 'versichernAgreeText'}>Ich erkläre mich einverstanden, dass meine Daten elektronisch gespeichert und hausintern an die Basler Versicherung AG weitergeleitet werden. Der Versicherungsvertrag beginnt ab sofort und ist für 5 Jahre abgeschlossen. Die Handyversicherung kann jährlich gekündet werden. Ich akzeptieren die aktuellen <a href="https://www.baloise.ch/dam/baloise-ch/privatkunden/documents/de/vertragsbedingungen/140_1261_d.pdf" target="_blank">Vertragsbedingungen</a> der Basler Versicherung.</p>
                                    </div>
                                    {isSendFormSuccessfully ?
                                    <div>
                                        <p className="successfullyText">Ihre Nachricht wurde erfolgreich versendet <img src="/images/n-check.svg" width="30" /></p>
                                        <h4 className="detailInformationtext">Sie erhalten in den nächsten Tagen die Vertragsdokumente von der Basler Versicherung per Post zugestellt und können die Versicherung bequem innerhalb von 30 Tagen einzahlen.</h4>
                                    </div>
                                    :
                                    ''
                                    }

                                    <div className="text-left">
                                        <button className="versichernBtn" type="submit">Jetzt versichern</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default (Versichern)