import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Recaptcha from 'react-recaptcha'
import axios from 'axios'

import  {connect} from 'react-redux'
import {showMap} from '../../helpers/helpersFunction'



export class ContactForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inputCheckbox: {
                company: false,
                agree: false,
                errorAgree: false
            },
            captcha: {
                isCheckCaptcha: false,
                errorCaptcha: false
            },
            infoMsg: null
        }

        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.sendForm = this.sendForm.bind(this)
        this.verifyCaptchaCallback = this.verifyCaptchaCallback.bind(this)
        this._setPersonalDataFields = this._setPersonalDataFields.bind(this)
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            let inputs = document.querySelectorAll('.contactForm input')
            inputs.forEach( item => {
                item.value = ""
                item.checked = false
            })
            this.setState({ inputCheckbox: { ...this.state.inputCheckbox, company: false } })
        }
        if( nextProps.user.data !== this.props.user.data && nextProps.user.data){
            this._setPersonalDataFields(nextProps.user.data.shippingAddress)
        }

    }
    componentDidMount(){
        if(this.props.user.data){
            this._setPersonalDataFields(this.props.user.data.shippingAddress)
        }
        this.encryptedEmail()
    }

    encryptedEmail(){
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
        if(domain === 'de'){
            document.getElementById("email-rot-13").innerHTML="<n uers=\"znvygb:vasb@erznexrg.qr\" >vasb@erznexrg.qr</n>".replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
        }
        else{
            document.getElementById("email-rot-13").innerHTML="<n uers=\"znvygb:vasb@erznexrg.pu\" >vasb@erznexrg.pu</n>".replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
        }
    }

    showMapHandler(plId) {
        showMap (plId);
    }

    _setPersonalDataFields(data){
        let contactForm = document.forms.contactForm,
            { inputCheckbox } = this.state
        for(let key in data){
            if (key === 'companyName' ) {
                if( data[key]){
                    inputCheckbox.company = true
                    contactForm[key].value = data[key]
                }
                else{
                    inputCheckbox.company = false
                    contactForm[key].value = data[key]
                }
            }
            else if (contactForm[key]) contactForm[key].value = data[key]
        }
        this.setState({ inputCheckbox })
    }
    verifyCaptchaCallback(res){
        this.setState({ captcha: { ...this.state.captcha, isCheckCaptcha: true, errorCaptcha: false } })
    }
    changeCheckbox(e){
        let { inputCheckbox } = this.state
        inputCheckbox[e.target.name] = !inputCheckbox[e.target.name]
        this.setState({ inputCheckbox })
    }
    sendForm(e){
        e.preventDefault()
        let data = new FormData(document.forms.contactForm),
            { captcha } = this.state,
            { inputCheckbox } = this.state
        if (inputCheckbox.agree) {
            this.setState({ inputCheckbox: { ...this.state.inputCheckbox, errorAgree: false } })
            if(captcha.isCheckCaptcha || !window.isGoogleConnection){
                document.getElementById('spinner-box-load').style.display = 'block'
                axios.post('/api/contactUs', data)
                    .then( result => {
                        document.getElementById('spinner-box-load').style.display = 'none'
                        document.querySelectorAll('input[name=subject], textarea').forEach( item => item.value = "" )
                        this.setState({ infoMsg: result.data })
                    })
                    .catch( error => {
                        document.getElementById('spinner-box-load').style.display = 'none'
                    })
            }
            else{
                this.setState({ captcha: { ...this.state.captcha, errorCaptcha: true } })
            }
        }
        else {
            this.setState({ inputCheckbox: { ...this.state.inputCheckbox, errorAgree: true } })
        }

    }
    render() {
        let { inputCheckbox, captcha } = this.state,
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
        return (

            <div className="contactPage">
                <div className="modal fade bs-example-modal-lg"
                     id="modalMap"
                     tabIndex="-1"
                     data-keyboard="false"
                     role="dialog"
                     aria-labelledby="myLargeModalLabeAgb">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <button type="button" className="closeModal"
                                onClick={ () => $('#modalMap').modal('hide') }
                                data-dismiss="modal"
                                aria-label="Close"/>
                        <div className="modal-content">
                            <div className="mapContainer"/>
                        </div>
                    </div>
                </div>


                <div className="container mb">
                    {
                        domain === 'ch' &&
                        <div className="col-sm-6 col-lg-8">
                            <div className="col-sm-12">
                                <div className="itemInfoBlock">
                                    <h3 className="title">E-Mail</h3>
                                    <p className="email">
                                        <span id="email-rot-13"/>
                                        </p>
                                </div>
                                <div className="itemInfoBlock">
                                    <h3 className="title">Social</h3>
                                    <div className="imgSocial">
                                        <a href="https://www.facebook.com/remarketch-Kaufen-und-Verkaufen-per-Knopfdruck-157822264839941/"
                                           target="_blank"><img src="/images/design/icons-facebook.svg" alt=""/></a>
                                        <a href="https://tiktok.com/@remarket.ch" target="_blank"><img
                                            src="/images/design/icons-tiktok.svg" alt=""/></a>
                                        <a href="https://www.instagram.com/remarket.ch/" target="_blank"><img
                                            src="/images/design/icon-instagram.svg" alt=""/></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <h3 className="placeDescription"><img alt='' src={`/images/design/contact/flag-of-canton-of-basel.svg`} />Filiale Barfüsserplatz, Basel</h3>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Adresse</h3>
                                    <p className="adress">Gerbergasse 82</p>
                                    <p className="adress">CH-4001 Basel</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Telefon</h3>
                                    <p className="phone">
                                        <a href='tel:+41615112244'>061 511 22 44</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-12 bord">
                                <div className="itemInfoBlock">
                                <h3 className="title">Öffnungszeiten</h3>
                                    <p className="adress">Mo-Fr: 09:00 - 18:30 Uhr</p>
                                    <p className="adress">Sa: 10:00 - 18:00 Uhr</p>
                                </div>
                                <button className="btn" onClick={()=>this.showMapHandler(1)}>
                                    Karte anzeigen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                                <hr/>
                            </div>
                            <div className="col-sm-12">
                                <h3 className="placeDescription"><img alt='' src={`/images/design/contact/flag-of-canton-of-basel.svg`} />Filiale St. Jakob-Park, Basel</h3>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Adresse</h3>
                                    <p className="adress">St. Jakobs-Strasse 397 (im 2. UG)</p>
                                    <p className="adress">CH-4052 Basel</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Telefon</h3>
                                    <p className="phone">
                                        <a href='tel:+41613116020'>061 311 60 20</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-12 bord">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Öffnungszeiten</h3>
                                    <p className="adress">Mo-Fr: 09:00 - 19:00 Uhr</p>
                                    <p className="adress">Sa: 09:00 - 18:00 Uhr</p>
                                </div>
                                <button className="btn" onClick={()=>this.showMapHandler(5)}>
                                    Karte anzeigen
                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                                <hr/>
                            </div>
                            <div className="col-sm-12">
                                <h3 className="placeDescription"><img alt='' src={`/images/design/contact/bern-logo.svg`} />Filiale Shoppyland, Bern</h3>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Adresse</h3>
                                    <p className="adress">Industriestrasse 10 (im UG)</p>
                                    <p className="adress">CH-3321 Schönbühl</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Telefon</h3>
                                    <p className="phone">
                                        <a href='tel:+41318520901'>031 852 09 01</a>
                                    </p>
                                </div>
                            </div>

                            <div className="col-sm-12 bord">
                                <div className="itemInfoBlock">
                                <h3 className="title">Öffnungszeiten</h3>
                                    <p className="adress">Mo-Do: 09:00 - 20:00 Uhr</p>
                                    <p className="adress">Fr: 09:00 - 21:00 Uhr</p>
                                    <p className="adress">Sa: 08:00 - 17:00 Uhr</p>
                                </div>
                                <button className="btn" onClick={()=>this.showMapHandler(5)}>
                                    Karte anzeigen
                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                                <hr/>
                            </div>
                            <div className="col-sm-12">
                                <h3 className="placeDescription"><img alt='' src={`/images/design/contact/emblem-7.svg`} />Filiale Gäupark, Solothurn</h3>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Adresse</h3>
                                    <p className="adress">Hausimollstrasse 14 (im 1OG)</p>
                                    <p className="adress">CH-4622 Egerkingen</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Telefon</h3>
                                    <p className="phone">
                                        <a href='tel:+41625112270'>062 511 22 70</a>
                                    </p>
                                </div>
                            </div>

                            <div className="col-sm-12 bord">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Öffnungszeiten</h3>
                                    <p className="adress">Mo-Mi: 09:00 - 18:30 Uhr</p>
                                    <p className="adress">Do: 09:00 - 21:00 Uhr</p>
                                    <p className="adress">Fr: 09:00 - 18:30 Uhr</p>
                                    <p className="adress">Sa: 08:00 - 18:00 Uhr</p>
                                </div>
                                <button className="btn" onClick={()=>this.showMapHandler(7)}>
                                    Karte anzeigen
                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                            </div>



                        </div>
                    }
                    {
                        domain !== 'ch' &&
                        <div className="col-sm-8">
                            <div className="col-sm-12">
                                <div className="itemInfoBlock">
                                    <h3 className="title">E-Mail</h3>
                                    <p className="email">
                                        <span id="email-rot-13"/>
                                    </p>
                                </div>
                                <div className="itemInfoBlock">
                                    <h3 className="title">Social</h3>
                                    <div className="imgSocial">
                                        <a href="https://www.facebook.com/iReparatur.ch.remarket.ch"
                                           target="_blank"><img src="/images/design/icons-facebook.svg" alt=""/></a>
                                        <a href="https://twitter.com/remarket_ch" target="_blank"><img
                                            src="/images/design/icons-twitter.svg" alt=""/></a>
                                        <a href="https://www.instagram.com/remarket.ch/" target="_blank"><img
                                            src="/images/design/icon-instagram.svg" alt=""/></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Adresse</h3>
                                    <p className="adress">Berner Weg 23</p>
                                    <p className="adress">D-79539 Lörrach</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Telefon</h3>
                                    <p className="phone">
                                        <a href='tel:+49762191656504'>07621 916 56 50</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-12 bord">
                                <div className="itemInfoBlock">
                                    <h3 className="title">Öffnungszeiten</h3>
                                    <p className="adress">Mo-Fr: 09:00 - 17:00 Uhr</p>
                                </div>
                                <button className="btn" onClick={()=>this.showMapHandler(4)}>
                                    Karte anzeigen
                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                                <hr/>
                            </div>
                        </div>
                    }

                    <div className="col-sm-6 col-lg-4">
                        <div className="contactForm">
                            {this.state.infoMsg && <p className="successMsg">{ this.state.infoMsg }</p>}
                            <h3 className="title">Telefon</h3>
                            <h2>Kontaktformular</h2>
                            <form action="#" name="contactForm" onSubmit={this.sendForm}>
                                <div className="wrapLabel">
                                    <label><input type="radio" name="gender" value="Herr" required/><span/>Herr</label>
                                    <label><input type="radio" name="gender" value="Frau"/><span/>Frau</label>
                                    <label><input type="checkbox"
                                                  name="company"
                                                  checked={inputCheckbox.company}
                                                  onChange={this.changeCheckbox}/>
                                        <span className="check"/>
                                        Firma</label>
                                </div>
                                <div className={inputCheckbox.company ? "" : "hide" }>
                                    <input type="text" name="companyName" placeholder="Firma" required={inputCheckbox.company}/>
                                </div>
                                <input type="text" name="firstname" placeholder="Vorname" required/>
                                <input type="text" name="lastname" placeholder="Nachname" required/>
                                <input type="number" name="phone" placeholder="Telefon" required/>
                                <input type="email" name="email" placeholder="E-Mail" required/>
                                <input type="text" name="subject" placeholder="Betreff" required/>
                                <textarea name="message" rows="10" placeholder="Nachricht" required />
                                <div className="wrapLabel">
                                    <label>
                                        <input type="checkbox"
                                               name="agree"
                                               checked={inputCheckbox.agree}
                                               onChange={this.changeCheckbox}/>
                                        <span className="check"/>
                                        <div className="col-sm-10">
                                            {inputCheckbox.errorAgree &&
                                                <a href="/ueber-uns/datenschutzerklaerung/" target="_blank" style={{color: 'red'}}> Bitte lesen und akzeptieren Sie die Datenschutzerklärung.</a>
                                            }
                                            {!inputCheckbox.errorAgree &&
                                                <a href="/ueber-uns/datenschutzerklaerung/" target="_blank" style={{color: '#02ca95'}}> Bitte lesen und akzeptieren Sie die Datenschutzerklärung.</a>
                                            }
                                        </div>
                                    </label>
                                </div>
                                <Recaptcha
                                    sitekey={window.captchaSitekey.key}
                                    render="explicit"
                                    hl={"de"}
                                    verifyCallback={this.verifyCaptchaCallback}
                                    onloadCallback={() => false}
                                />
                                { captcha.errorCaptcha && <p style={{color: 'red'}}>Bitte bestätigen Sie, dass Sie kein Roboter sind.</p> }

                                <div className="text-right">
                                    <button className="btn" type="submit">
                                        Senden
                                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                    </button>
                                </div>
                            </form>
                            <div className="cb"/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

ContactForm.propTypes = {}
ContactForm.defaultProps = {}


function mapStateToProps (state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ContactForm)
