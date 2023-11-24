import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Recaptcha from 'react-recaptcha'
import axios from 'axios'
import Select from 'react-select';

const codes = [
    {value: 'Vorwahl', label: 'Vorwahl'},
    {value: '079', label: '079'},
    {value: '078', label: '078'},
    {value: '077', label: '077'},
    {value: '076', label: '076'},
    {value: '075', label: '075'},
    {value: '0049 (DE)', label: '0049 (DE)'},
    {value: '0033 (FR)', label: '0033 (FR)'},
    {value: 'Andere', label: 'Andere'},
]

class CompanyPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            phoneCodes: {
                codes: codes,
                currentCode: 'Vorwahl'
            },
            captcha: {
                errorCaptcha: false,
                isCheckedCaptcha: false
            },
            errors: {
                phoneNumber: null
            },
            successMsg: null

        }

        this.verifyCaptchaCallback = this.verifyCaptchaCallback.bind(this)
        this.changeInput = this.changeInput.bind(this)
        this.sendForm = this.sendForm.bind(this)
        this.changePhoneCode = this.changePhoneCode.bind(this)

    }
    componentDidMount(){
        $('button.registerNow').on('click', () => $("html, body").animate({ scrollTop: $('#form').offset().top }, 600))
    }
    changePhoneCode(e){
        let { value } = e
        this.setState({ phoneCodes: {...this.state.phoneCodes, currentCode: value} })
    }
    verifyCaptchaCallback(){
        this.setState({ captcha: { ...this.state.captcha, isCheckCaptcha: true, errorCaptcha: false } })
    }
    changeInput(e){
        let { name } = e.target,
            { errors} = this.state
        errors[name] = null
        this.setState({ errors })
    }
    sendForm(e){
        e.preventDefault()
        let data = new FormData(document.forms.companyForm),
            { captcha } = this.state
        if( captcha.isCheckCaptcha || !window.isGoogleConnection){
            axios.post('/api/registerCompany', data)
                .then( result => {
                    this.setState({ successMsg: result.data })
                })
                .catch( error => {
                    if(error.response.status === 404){
                        this.setState({ errors: { ...this.state.errors, phoneNumber: error.response.data } })
                    }
                })
        }
        else{
            this.setState({ captcha: { ...this.state.captcha, errorCaptcha: true } })
        }

    }
    render() {
        let { captcha, successMsg, phoneCodes } = this.state
        return (
            <main>
                <div className="companyPage">
                    <section className="top">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-5">
                                    <p className="title">Firmenkunde werden</p>
                                    <p className="title">und profitieren</p>
                                    <p className="title">- einfach und kostenlos</p>
                                    <p className="text">
                                        Registrieren Sie sich als Firmenkunde und kommen Sie in den Genuss von einem hervorragenden Service, mit dem Ihr Unternehmen noch leistungsfähiger wird.
                                    </p>
                                    <button className="btn registerNow">
                                        Jetzt registrieren
                                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                    </button>
                                    <a href="tel:+61 511 22 44" className="callToUs">oder rufen Sie uns an 061 511 22 44</a>
                                </div>
                            </div>
                        </div>
                        <img src="/images/design/companyPhone.png" className="phone"/>
                        <img className="bigTriangle" src="/images/design/company-triangle.svg" alt=""/>
                        <img className="grayTriangle" src="/images/design/company-triangle-gray.svg" alt=""/>
                    </section>
                    <section className="corporate">
                        <img src="/images/design/corporateCustomers.jpg" alt=""/>
                        <div className="wrapCorporate">
                            <div className="container">
                                <div className="row">
                                    <div className="wrap clearfix">
                                        <div className="col-sm-6 col-sm-push-6 right-side">
                                            <p className="title">Vorteile</p>
                                            <p className="caption">Firmenkunde</p>
                                            <p className="text">
                                            Als Person, die für Smartphones und Tablets in Ihrem Unternehmen verantwortlich ist, profitieren Sie von unzähligen Vorteilen bei remarket. Wir wissen, wie wichtig mobile Geräte in Ihrem täglichen Geschäft sind, und haben und darauf spezialisiert, Reparaturen, Ankäufe und Verkäufe für Firmen und der schnellst möglichen Zeit durchzuführen. Für den Fall, dass ein Schaden nicht von Ihrer Versicherung abgedeckt ist, helfen wir als zuverlässiger Partner und übernehmen alle Reparatur Services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="insurance">
                        <div className="container">
                            <div className="row">
                                <div className="wrap clearfix">
                                    <div className="col-xs-6">
                                        <p className="title">Vorteile</p>
                                        <p className="caption">Versicherungsunternehmen</p>
                                        <p className="text">Auch für Versicherungsunternehmen bieten wir attraktive Service rund um die Smartphone und Tablet Reparatur. iReparatur.ch ist Ihr kompetenter Partner für Reparaturen im Fall eines Versicherungsanspruchs, und stellt sicher, dass Ihr Schadensvolumen so klein wie möglich ist.</p>
                                    </div>
                                    <div className="image">
                                        <img src="/images/design/company-insurance.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="plans">
                        <div className="container">
                            <div className="row">
                                <div className="wrapPlans">
                                    <div className="itemPlan">
                                        <div className="content">
                                            <p className="title">Angebot</p>
                                            <p className="caption">Reparieren</p>
                                            <ul>
                                                <li><span className="circleOk"/>Zahlung per Rechnung möglich</li>
                                                <li><span className="circleOk"/>Keine Terminvereinbarung nötig</li>
                                                <li><span className="circleOk"/>Rabatte auf grössere Reparaturvolumen möglich</li>
                                            </ul>
                                        </div>
                                        <button type="button" className="btn registerNow">Anmelden
                                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                        </button>
                                    </div>
                                    <div className="itemPlan">
                                        <div className="content">
                                            <p className="title">Angebot</p>
                                            <p className="caption">Kaufen</p>
                                            <ul>
                                                <li><span className="circleOk"/>Zahlung per Rechnung möglich</li>
                                                <li><span className="circleOk"/>Mengenrabatte möglich</li>
                                            </ul>
                                        </div>
                                        <button type="button" className="btn registerNow">Anmelden
                                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                        </button>
                                    </div>
                                    <div className="itemPlan">
                                        <div className="content">
                                            <p className="title">Angebot</p>
                                            <p className="caption">Verkaufen</p>
                                            <ul>
                                                <li><span className="circleOk"/>Abholung möglich</li>
                                                <li><span className="circleOk"/>Bonus bei grösseren Verkaufsmengen</li>
                                            </ul>
                                        </div>
                                        <button type="button" className="btn registerNow">Anmelden
                                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="sponsors">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="wrapSponsors">
                                        <img src="/images/design/sponsors/dieMob.png" alt=""/>
                                        <img src="/images/design/sponsors/stam.svg" alt=""/>
                                        <img src="/images/design/sponsors/bayer.svg" alt=""/>
                                        <img src="/images/design/sponsors/lions.svg" alt=""/>
                                        <img src="/images/design/sponsors/endress.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="wrapSponsors">
                                        <img src="/images/design/sponsors/alpiq.png" className="alpiq"/>
                                        <img src="/images/design/sponsors/migros.png" alt=""/>
                                        <img src="/images/design/sponsors/wr.png" alt=""/>
                                        <img src="/images/design/sponsors/tesla.svg" alt=""/>
                                        <img src="/images/design/sponsors/bell.svg" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="form" id="form">
                        <p className="title">Registrieren Sie sich jetzt kostenlos als Firmenkunde</p>
                        <div className="wrapForm clearfix">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-10 col-sm-push-1 mainPart">
                                        <form action="#" name="companyForm" className="companyForm" onSubmit={this.sendForm}>
                                            { successMsg && <p className="successMsg">{ successMsg }</p> }
                                            <div className="companyForm">
                                                <p className="title">Ihre Kontaktdetails:</p>
                                                <div className="wrapLabel">
                                                    <label><input type="radio" name="gender" value="Herr" required/><span/>Herr</label>
                                                    <label><input type="radio" name="gender" value="Frau"/><span/>Frau</label>
                                                </div>
                                                <input type="text" name="firmenname" placeholder="Firmenname" required/>
                                                <input type="text" name="ihrVorname" placeholder="Ihr Vorname" required/>
                                                <input type="text" name="ihrNachname" placeholder="Ihr Nachname" required/>
                                                <input type="email" name="ihreEmail" placeholder="Ihre E-Mail" required/>
                                                <div className="phoneNumber">
                                                    <Select
                                                        placeholder="Auswählen..."
                                                        value={phoneCodes.currentCode}
                                                        name="phoneCod"
                                                        clearable={false}
                                                        options={phoneCodes.codes}
                                                        searchable={false}
                                                        onChange={this.changePhoneCode}/>
                                                    <input type="text" name="phoneNumber" placeholder="Ihre Handynummer" required onChange={this.changeInput}/>
                                                </div>
                                                { this.state.errors.phoneNumber && <span className="error">{ this.state.errors.phoneNumber }</span>}
                                                <Recaptcha
                                                    sitekey={window.captchaSitekey.key}
                                                    render="explicit"
                                                    hl={"de"}
                                                    verifyCallback={this.verifyCaptchaCallback}
                                                    onloadCallback={() => false}
                                                />
                                                { captcha.errorCaptcha && <p style={{color: 'red'}}>Bitte bestätigen Sie das Sie kein Roboter sind</p> }

                                            </div>
                                            <button type="submit" className="btn" >
                                                Jetzt absenden
                                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                            </button>
                                        </form>
                                        <div className="commentPart">
                                            <p className="commentText">“Unsere Kunden sind die beste Werbung”</p>
                                            <div className="userInfo">
                                                <div className="user">
                                                    <p className="name">- Rainer Megerle</p>
                                                </div>
                                            </div>
                                            <img src="/images/design/quotes.svg" alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        )
    }
}

CompanyPage.propTypes = {}
CompanyPage.defaultProps = {}

export default CompanyPage
