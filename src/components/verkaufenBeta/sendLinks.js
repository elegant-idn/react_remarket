import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'

class SendLinks extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userData: {
                number: ''
            },
            successMsg: ''
        }

        this.clickCheckbox = this.clickCheckbox.bind(this)
        this._setDataFields = this._setDataFields.bind(this)
        this.changePhoneNumber = this.changePhoneNumber.bind(this)
        this.sendForm = this.sendForm.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user.data !== this.props.user.data && nextProps.user.data) {
            this._setDataFields(nextProps.user.data)
        }
        if (nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false) {
            [...document.querySelectorAll('input[name="email"], input[name="number"]')].forEach(item => item.value = "")
        }
    }

    componentDidMount() {
        [...document.querySelectorAll('.textarea')].forEach(item => item.setAttribute('contentEditable', true))
        if (this.props.user.isLogin && this.props.user.data) {
            this._setDataFields(this.props.user.data)
        }
    }

    changePhoneNumber(e) {
        this.setState({userData: {...this.state.userData, number: e}})
    }

    _setDataFields(data) {
        let email = data.systemAddress.email,
            phone = data.systemAddress.phone,
            emailForm = document.forms['linkByEmail-' + this.props.id]

        if (phone.indexOf('0041') === 0) phone = '+' + phone.slice(2)
        if (emailForm.emailFrom) emailForm.emailFrom.value = email
        this.setState({userData: {...this.state.userData, number: phone}})
    }

    sendForm(e) {
        e.preventDefault()
        let data, type, text = null,
            {name} = e.target,
            leftPosition = 0

        if (name.includes('linkByEmail')) {
            data = new FormData(document.forms['linkByEmail-' + this.props.id])
            type = 'email'
            text = $('.textarea.email').html()
            leftPosition = $(e.target).closest('.itemBtn').position().left

        } else {
            data = new FormData(document.forms['linkBySms-' + this.props.id])
            type = 'phone'
            text = document.querySelector('.textarea.phone').innerText
            leftPosition = $(e.target).closest('.itemBtn').position().left
        }
        data.append('type', type)
        data.append('message', text)
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post('/api/shareLink', data)
            .then(result => {
                document.getElementById('spinner-box-load').style.display = 'none';
                [...document.querySelectorAll('input[name="linkBtn"]')].forEach(item => item.checked = false);
                [...document.querySelectorAll('.itemBtn label')].forEach(item => item.classList.remove('active'))
                if (name.includes('linkByEmail')) {
                    this.setState({successMsg: 'Die E-Mail wurde erfolgreich versendet'})

                    $('.successMessage').css({left: leftPosition + 'px'}).fadeIn()
                    setTimeout(() => $('.successMessage').fadeOut(), 2000)
                } else {
                    this.setState({successMsg: 'Die SMS wurde erfolgreich versendet'})
                    $('.successMessage').css({left: leftPosition + 'px'}).fadeIn()
                    setTimeout(() => $('.successMessage').fadeOut(), 2000)
                }
            })
    }

    sendCouponForm = (e) => {
        
        e.preventDefault()

        let data, type, text, form = null,
            {name} = e.target;

        if (name.includes('linkByEmail')) {
            data = new FormData( document.querySelector(`form[id='linkByEmail-${this.props.id}']`))
            type = 'email'
            text = document.querySelector('.couponEmail').innerHTML
        }
        else {
            data = new FormData(document.querySelector(`form[id='linkBySms-${this.props.id}']`))
            type = 'phone'
            text = document.querySelector('.couponSMS').innerText
        }
        data.append('type', type)
        data.append('message', text)
        if(type == 'email'){
            form =  document.querySelector(`form[name='linkByEmail-${this.props.id}']`);
        }
        else {
            form =  document.querySelector(`form[name='linkBySms-${this.props.id}']`);
        }
        document.getElementById('spinner-box-load').style.display = 'block';
        axios.post('/api/shareLink', data)
            .then(result => {
                document.getElementById('spinner-box-load').style.display = 'none';
                form.parentNode.classList.remove('active');
                if (name.includes('linkByEmail')) {
                    this.setState({successMsg: 'Die E-Mail wurde erfolgreich versendet'})
                    $('.successLinkMessage').fadeIn()
                    // setTimeout(() => $('.successMessage').fadeOut(), 2000)
                } else {
                    this.setState({successMsg: 'Die SMS wurde erfolgreich versendet'})
                    $('.successLinkMessage').fadeIn()
                    // setTimeout(() => $('.successMessage').fadeOut(), 2000)
                }
            })

    }

    clickCheckbox(e) {
        [...document.querySelectorAll('.itemBtn label')].forEach(item => item.classList.remove('active'))
        if (!e.target.checked) e.target.checked = false
        else {
            [...document.querySelectorAll('input[name="linkBtn"]')].forEach(item => item.checked = false)
            e.target.checked = true
            e.target.parentNode.querySelector('label').classList.add('active')
        }
        if (e.target.id.includes('clipboard')) {
            let copyText = document.querySelector('.hiddenInputWithLink')
            copyText.select()
            document.execCommand('copy')
            e.target.checked = false
            e.target.parentNode.querySelector('label').classList.remove('active')
            this.setState({successMsg: 'Der Link wurde erfolgreich in die Zwischenablage kopiert'})
            if (!window.isMobile) {
                $('.successMessage').css({left: '-20px'}).fadeIn()
            } else {
                $('.successMessage').fadeIn()
            }
            setTimeout(() => $('.successMessage').fadeOut(), 2000)
        }
    }

    clickButton = (type) => {
        let form = '';
        if(type === 'email'){
            form = document.querySelector(`form[name='linkByEmail-${this.props.id}']`);
        }
        else {
            form = document.querySelector(`form[name='linkBySms-${this.props.id}']`);

        }
        let formClassName = form.parentNode.className;
        let isActive = formClassName.search('active');
        if(isActive == -1) {
            form.parentNode.classList.add('active');
        }
        else {
            form.parentNode.classList.remove('active');
        }

    }

    render() {
        let link = window.location.href,
            country = window.domainName.name === 'remarket.ch' ? 'ch' : 'de',
            {id, isAssistantQuestion, isSellDeadline} = this.props;
        return (
            <React.Fragment>
                {
                    isSellDeadline ?
                        <div className="row countdownLinks">
                            <div className="successLinkMessage">
                                <img src="/images/design/ok-links.svg"/>
                                <span
                                className="copy">{this.state.successMsg}</span>
                            </div>
                            <div className="col-md-6 text-center">
                                <button className="btn white" onClick={()=>this.clickButton('email')}>Angebot jetzt per E-Mail sichern</button>
                                <div className="form">
                                            <form id={`linkByEmail-${id}`} name={`linkByEmail-${id}`} onSubmit={this.sendCouponForm}>
                                        <input type="email" name="email" required placeholder="Ihre E-Mail"/>
                                        <div className="textarea couponEmail">
                                            Hallo,<br/>
                                            gerne senden wir Ihnen unser Angebot mit dem +20.00 CHF Gutschein, Link: <br/>
                                            <a contentEditable={false} href={link+'?shortcode='+this.props.sellCouponShortcode}>{link+'?shortcode='+this.props.sellCouponShortcode}</a>
                                        </div>
                                        <button className="btn" onSubmit={this.sendCouponForm}>Senden</button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6 text-center">
                                <button className="btn" onClick={()=>this.clickButton('sms')}>Angebot jetzt per SMS sichern</button>
                                <div className="form">
                                    <form id={`linkBySms-${id}`} name={`linkBySms-${id}`} onSubmit={this.sendCouponForm}>
                                        <span className="inputTitle">Empfänger Mobiltelefonnummer</span>
                                        <ReactTelephoneInput
                                            inputProps={{name: "phoneTo", required: true}}
                                            pattern="(\+?\d){11,}"
                                            defaultCountry={country}
                                            autoFormat={false}
                                            placeholder="Mobiltelefonnummer Ihres Freundes"
                                            flagsImagePath='/images/design/flags.png'/>
                                        <div className="textarea couponSMS">
                                            Hallo,<br/>
                                            gerne senden wir Ihnen unser Angebot mit dem +20.00 CHF Gutschein, Link: <br/>
                                            <a contentEditable={false} href={link+'?shortcode='+this.props.sellCouponShortcode}>{link+'?shortcode='+this.props.sellCouponShortcode}</a>
                                        </div>
                                        <button className="btn" onSubmit={this.sendCouponForm}>Senden</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="sendLinksWrap">
                            <div className="successMessage">
                                <img src="/images/design/ok-links.svg"/> <span
                                className="copy">{this.state.successMsg}</span>
                            </div>
                            <span className="title">Link teilen</span>
                            { isAssistantQuestion ? '' : <br /> }                            
                            <span className="wrapLinks">
                                <span className="itemBtn">
                                    <label htmlFor={`email-${id}`}>
                                        {isAssistantQuestion ?
                                            <img src="/images/design/mail-links-white.svg" alt=""/> :
                                            <img src="/images/design/mail-links-black.svg"  className="mail-links-img" alt=""/>
                                        }
                                    </label>
                                    <input type="checkbox" id={`email-${id}`} name="linkBtn" onChange={this.clickCheckbox}/>
                                    <div className="form">
                                        <form name={`linkByEmail-${id}`} onSubmit={this.sendForm}>
                                            <p className="header">Link mit Freunden teilen<span>via E-mail</span></p>
                                            <input type="email" name="emailFrom" required placeholder="Ihre E-Mail"/>
                                            <input type="email" name="emailTo" required placeholder="E-Mail Ihres Freundes"/>
                                            <div className="textarea email">
                                                Hallo,<br/>
                                                hier der Link von remarket um dein Gerät zu verkaufen:<br/>
                                                <a contentEditable={false} href={link}>{link}</a>
                                            </div>
                                            <button className="btn" onSubmit={this.sendForm}>Senden</button>
                                        </form>
                                    </div>
                                </span>
                                <span className="itemBtn">
                                    <label htmlFor={`sms-${id}`}>
                                        {isAssistantQuestion ?
                                            <img src="/images/design/sms-link-white.svg" alt=""/> :
                                            <img src="/images/design/sms-link-black.svg" className="sms-links-img" alt=""/>
                                        }
                                    </label>
                                    <input type="checkbox" id={`sms-${id}`} name="linkBtn" onChange={this.clickCheckbox}/>
                                    <div className="form">
                                        <form name={`linkBySms-${id}`} onSubmit={this.sendForm}>
                                            <p className="header">Link mit Freunden teilen<span>via SMS</span></p>
                                            <span className="inputTitle">Absender Mobiltelefonnummer</span>
                                            <ReactTelephoneInput
                                                inputProps={{name: "phoneFrom", required: true}}
                                                pattern="(\+?\d){11,}"
                                                value={this.state.userData.number}
                                                onChange={this.changePhoneNumber}
                                                defaultCountry={country}
                                                autoFormat={false}
                                                placeholder="Ihre Mobiltelefonnummer"
                                                flagsImagePath='/images/design/flags.png'/>
                                            <span className="inputTitle">Empfänger Mobiltelefonnummer</span>
                                            <ReactTelephoneInput
                                                inputProps={{name: "phoneTo", required: true}}
                                                pattern="(\+?\d){11,}"
                                                defaultCountry={country}
                                                autoFormat={false}
                                                placeholder="Mobiltelefonnummer"
                                                flagsImagePath='/images/design/flags.png'/>
                                            <div className="textarea phone">
                                                Hallo,<br/>
                                                hier der Link von remarket um dein Gerät zu verkaufen <br/>
                                                <a contentEditable={false} href={link}>{link}</a>
                                            </div>
                                            <button className="btn" onSubmit={() => this.sendForm}>Senden</button>
                                        </form>
                                    </div>
                                </span>
                                <span className="itemBtn">
                                    <label htmlFor={`clipboard-${id}`}>
                                    {isAssistantQuestion ?
                                        <img src="/images/design/copy-to-clipboard-white.svg" alt=""/> :
                                        <img src="/images/design/copy-to-clipboard-black.svg" className="copy-to-clipboard-img" alt=""/>
                                    }
                                    </label>
                                    <input id={`clipboard-${id}`} type="checkbox" name="linkBtn" onChange={this.clickCheckbox}/>
                                    <div className="form copyForm">
                                        <textarea
                                            defaultValue={link}
                                            className="hiddenInputWithLink"/>
                                        <img src="/images/design/ok-links.svg"/> <span
                                        className="copy">Link wurde in Zwischenablage kopiert</span>
                                    </div>
                                </span>
                            </span>
                        </div>
                }
            </React.Fragment>
        )
    }
}

SendLinks.propTypes = {}
SendLinks.defaultProps = {}

export default SendLinks