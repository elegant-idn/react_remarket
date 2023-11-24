import React, { Component } from 'react'
import axios from 'axios'

class Banner extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputField: '',
      errorInputData: '',
      showInput: true,
      showOkMessage: false
    }

    this.send = this.send.bind(this)
    this.changeInput = this.changeInput.bind(this)
    this.handleNoEmail = this.handleNoEmail.bind(this)
    this._validateInput = this._validateInput.bind(this)
    this._gtag_report_conversion = this._gtag_report_conversion.bind(this)
  }
  _validateInput(value) {
    let error = "",
      domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
      phonenoCh = /^\(?([0-9]{4})\)?[ ]?([0-9]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{2})\)?[ ]?([0-9]{2})$/,
      phoneno2Ch = /^\+([0-9]{2})\)?[ ]?([0-9]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{2})\)?[ ]?([0-9]{2})$/,
      phoneno3Ch = /^\(?([0-9]{3})\)?[ ]?([0-9]{3})\)?[ ]?([0-9]{2})[ ]?([0-9]{2})$/,
      phonenoDe = /^\(?([0-9]{4})\)?[ ]?([0-9]{3})\)?[ ]?([0-9]{2})[ ]?([0-9]{2})$/,
      phoneno2De = /^\(?([0-9]{5})\)?[ ]?([0-9]{3})\)?[ ]?([0-9]{2})[ ]?([0-9]{2})$/

    if (value === "") {
      error = "Sie haben keine Telefonnummer bzw. E-Mail eingegeben."
    }
    else if (isNaN(+value.replace(/ /g, ''))) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return (true)
      }
      else {
        error = "Telefonnummer bzw. E-Mail enthält unzulässige Zeichen"
        document.forms.coupon.email.value = ""
      }
    }
    else if ((domain === 'ch' && !phonenoCh.test(value) && !phoneno2Ch.test(value) && !phoneno3Ch.test(value))
      || (domain === 'de' && !phonenoDe.test(value) && !phoneno2De.test(value))) {
      document.forms.coupon.email.value = ""
      error = domain === 'ch'
        ? "Die Telefonnummer muss aus mindestens 10 Zeichen bestehen, z.B. 079 123 45 67"
        : "Die Telefonnummer muss aus mindestens 11 Zeichen bestehen, z.B. 0150 123 45 67"
    }
    if (error) {
      this.setState({ errorInputData: error })
      return false
    }
    else return true
  }
  handleNoEmail(e) {
    e.preventDefault()
    this.setState({ showOkMessage: false, showInput: true })
  }
  changeInput() {
    this.setState({ errorInputData: '' })
  }
  _gtag_report_conversion(url) {
    var callback = function () {
      if (typeof (url) != 'undefined') {
        window.location = url;
      }
    }
    gtag('event', 'conversion', {
      'send_to': 'AW-827036726/3tyqCJ_ayXsQtqiuigM',
      'event_callback': callback
    })
    return false;
  }
  send(e) {
    e.preventDefault();
    let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1];

    let inputValue = document.forms.coupon.email.value,
      inputAntiSpam = document.forms.coupon.email2.value
    document.forms.coupon.email.value = ''
    if (this._validateInput(inputValue) && !inputAntiSpam) {
      document.getElementById('spinner-box-load').style.display = 'block'
      axios.get(`/api/generateCoupons?phoneOrEmail=${inputValue.replace(/\+/g, '%2B')}`)
        .then(result => {
          document.getElementById('spinner-box-load').style.display = 'none'
          if (window.isGoogleConnection) {
            this._gtag_report_conversion()
          }
          this.setState({ showInput: false, showOkMessage: true })
          if (window.isFBConnection) {
            if (domain === 'ch') {
              fbq('track', 'Lead',
                { value: 1 }
              )// facebook pixel
            }
          }
        })
    }
    else document.forms.coupon.email.value = ''

  }
  render() {
    let couponDate = new Date(new Date().getTime() + 1209600000).toJSON().slice(0, 10).split('-').reverse().join('.')
    return (
      <React.Fragment>
        <div className="row banner">
          <div className="guy"><img src="/images/design/Guy.svg" alt="" /></div>

          <div className="price">
            <span className="price-amount">
              20 CHF
            </span>
            <span className="price-title">
              Gutschein
            </span>
          </div>

          <div className="visible-md visible-lg visible-xl col-sm-2 col-md-2" />
          
          <div className="col-sm-6 col-md-5 text-left">
            <div className="flex-column">
              <h3>Wir feiern unser 10 jähriges <span>Jubiläum</span> - Feiern Sie mit!</h3>
              <p>Gültig auf alle Ankäufe ab 50.- {window.currencyValue} bzw. Geräte ab 99.- {window.currencyValue} mit diesem Gutschein, gültig bis {couponDate}. Dieser Gutschein ist nicht mit anderen Aktionen / Rabatten kumulierbar.</p>
            </div>
          </div>

          {this.state.showInput && <div className="col-sm-3 col-md-4 text-right">
            <div className="flex-column">
              <span className="error">{this.state.errorInputData}</span>
              <form className="form" name="coupon" onSubmit={this.send}>
                <label style={{ display: 'inline', float: 'none', lineHeight: 'inherit' }}>
                  <input type="text"
                    name="email"
                    id="couponEmail"
                    onChange={this.changeInput}
                    placeholder="E-Mail oder Mobilnummer" />

                  <button aria-label="Submit" type="submit"></button>
                  <input type="text" name="email2" style={{ display: 'none' }} />
                  <p className='info-text'>Wir geben Ihre Daten niemals an Dritte weiter.</p>
                </label>
              </form>
            </div>
          </div>
          }
          {this.state.showOkMessage && <div className="col-sm-4 col-md-5 text-right" style={{margin: '0 20px'}}>
            <p>Vielen Dank! Sie erhalten den Gutschein innerhalb von 15 Minuten per E-Mail bzw. SMS zugesendet.&nbsp;
              <a href="#"
                className="noEmail"
                onClick={this.handleNoEmail}>Gutschein nicht erhalten</a>?
            </p>
          </div>
          }
        </div>
        <p className="couponDescr-mobile">Auf alle Ankäufe ab 99.- {window.currencyValue} mit diesem Gutschein, gültig bis {couponDate}. Dieser Gutschein ist nicht mit anderen Aktionen / Rabatten kumulierbar.</p>
      </React.Fragment>
    )
  }
}

Banner.propTypes = {}
Banner.defaultProps = {}

export default Banner