import React, { Component } from 'react'
import Recaptcha from 'react-recaptcha'
import InputRange from 'react-input-range'
import ModalThankYou from '../../ratingPage/modalThankYou'
import ModalIfBadRatingMobile from './modalIfBadRatingMobile'

import { cookieApi } from '../../../api/apiCookie'

class WriteRatingModalMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAnonymous: false,
            starTitle: '',
            captcha: {
                isCheckCaptcha: false,
                errorCaptcha: false
            },
            errorStars: false,
            starsCount: 0,
            userData: {
                firstname: '',
                lastname: '',
                email: ''
            },
            ratingText: '',
            errorMaxLength: false,
            writeRatingToday: false,
            showModalWriteRating: false,
            showModalIfBadRating: false,
        }

        this.publishRating = this.publishRating.bind(this)
        this.changeAnonymous = this.changeAnonymous.bind(this)
        this.changeStarsInput = this.changeStarsInput.bind(this)
        this.verifyCaptchaCallback = this.verifyCaptchaCallback.bind(this)
        this.handleChangeUserData = this.handleChangeUserData.bind(this)
        this.changeRatingText = this.changeRatingText.bind(this)
        this.publishIsBadRating = this.publishIsBadRating.bind(this)
        this.writeRating = this.writeRating.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.closeModalIfBadRating = this.closeModalIfBadRating.bind(this)
        this.showThankYou = this.showThankYou.bind(this)
        this._checkIsLogin = this._checkIsLogin.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.showModalWriteRating !== this.props.showModalWriteRating && nextProps.showModalWriteRating === true) {
            this.writeRating()
        }
    }
    _checkIsLogin() {
        if (this.props.user.isLogin && this.props.user.data) {
            this.setState({
                userData: {
                    ...this.state.userData,
                    firstname: this.props.user.data.systemAddress.first_name,
                    lastname: this.props.user.data.systemAddress.last_name,
                    email: this.props.user.data.systemAddress.email
                }
            })
        }
    }
    changeRatingText(e) {
        if (e.target.value.length > 500) {
            this.setState({ errorMaxLength: true })
        }
        else this.setState({ ratingText: e.target.value, errorMaxLength: false })
    }
    handleChangeUserData(e) {
        let { value, name } = e.target,
            { userData } = this.state
        userData[name] = value
        this.setState({ userData })
    }
    verifyCaptchaCallback(res) {
        this.setState({ captcha: { ...this.state.captcha, isCheckCaptcha: true, errorCaptcha: false } })
    }
    changeStarsInput(value) {
        let values = ['Ungenügend', 'Befriedigend', 'Gut', 'Sehr gut', 'Ausgezeichnet']
        if (value > 0) {
            document.querySelector('#star-' + value).checked = true
            this.setState({ starTitle: values[value - 1], errorStars: false, starsCount: value })
        }
        else {
            [...document.querySelectorAll('input[name="stars"]')].forEach(item => item.checked = false)
            this.setState({ starTitle: '', errorStars: false, starsCount: value })
        }

    }
    closeModal(data) {
        if (data) {
            this.setState({
                formData: data,
                captcha: {
                    isCheckCaptcha: false,
                    errorCaptcha: false
                },
                isAnonymous: false,
                starTitle: '',
                ratingText: '',
                errorMaxLength: false,
                errorStars: false,
                starsCount: 0,
                userData: {
                    firstname: '',
                    lastname: '',
                    email: ''
                },
                showModalWriteRating: false,
                showModalIfBadRating: true
            },
                () => $('#modalBadRating').modal())
        }
        else {
            this.setState({
                captcha: {
                    isCheckCaptcha: false,
                    errorCaptcha: false
                },
                userData: {
                    firstname: '',
                    lastname: '',
                    email: ''
                },
                showModalWriteRating: false,
                isAnonymous: false,
                starTitle: '',
                ratingText: '',
                starsCount: 0,
                errorMaxLength: false,
                errorStars: false,
            })
        }

        if (this.props.closeShowModalWriteRating) this.props.closeShowModalWriteRating()
    }
    showThankYou() {
        let selector = window.isMobile ? '.thankYou' : '.thankYou .wrap'
        $('.thankYou').css({ display: 'block' })
        setTimeout(() => $(selector).css({ opacity: '1' }), 500)

        setTimeout(() => {
            $(selector).css({ opacity: '0' })
            setTimeout(() => $('.thankYou').css({ display: 'none' }), 2500)
        }, 5000)
    }
    changeAnonymous(e) {
        let { checked } = e.target
        this.setState({ isAnonymous: checked })
    }
    publishRating(e) {
        e.preventDefault()
        let isStarsChecked = document.querySelector('input[name="stars"]:checked'),
            { captcha } = this.state
        if (isStarsChecked && captcha.isCheckCaptcha) {
            let data = new FormData(document.forms.formWriteRating)
            data.append('anonym', this.state.isAnonymous ? 1 : 0)
            if (isStarsChecked.value > 3) {
                document.getElementById('spinner-box-load').style.display = 'block'
                axios.post('/api/addRating', data)
                    .then(result => {
                        document.getElementById('spinner-box-load').style.display = 'none'
                        if (result.status === 200) {
                            $('#modalWriteRating').modal('toggle')
                            this.closeModal()
                            this.showThankYou()
                            cookieApi.setCookie('writeRating', 'true', { path: '/', expires: window.expireTimeWriteRating })
                        }
                    })
            }
            else {
                $('#modalWriteRating').modal('toggle')
                this.closeModal(data)
            }

        }
        else {
            if (!isStarsChecked) this.setState({ errorStars: 'Bitte Sterne auswählen' })
            if (!window.isGoogleConnection) {
                this.setState({ captcha: { ...this.state.captcha, isCheckCaptcha: true } })
            }
            else if (!captcha.isCheckCaptcha) this.setState({ captcha: { ...this.state.captcha, errorCaptcha: true } })
        }

    }
    writeRating() {
        if (!cookieApi.getCookie('writeRating')) {
            this._checkIsLogin()
            this.setState({ showModalWriteRating: true }, () => $('#modalWriteRating').modal())
        }
        else {
            this.setState({ writeRatingToday: true })
            setTimeout(() => this.setState({ writeRatingToday: false }), 3000)
        }
    }
    closeModalIfBadRating() {
        this.setState({ formData: null, showModalIfBadRating: false })
    }
    publishIsBadRating(e) {
        e.preventDefault()
        let { formData } = this.state,
            feedback = {
                type: document.forms.formIfBadRating.feedbackStatus.value,
                message: document.forms.formIfBadRating.feedbackText.value
            }
        formData.append('feedback', JSON.stringify(feedback))

        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post('/api/addRating', formData)
            .then(result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if (result.status === 200) {
                    $('#modalBadRating').modal('toggle')
                    this.closeModalIfBadRating()
                    this.showThankYou()
                    cookieApi.setCookie('writeRating', 'true', { path: '/', expires: window.expireTimeWriteRating })
                }
            })
    }
    render() {
        let { isAnonymous, starTitle, captcha, errorStars, userData, ratingText, errorMaxLength,
            showModalIfBadRating, showModalWriteRating } = this.state
        return (
            <div>
                {showModalIfBadRating && <ModalIfBadRatingMobile closeModal={this.closeModalIfBadRating}
                    publishIfBadRating={this.publishIsBadRating} />
                }
                <ModalThankYou />
                {showModalWriteRating &&
                    <div className="modal"
                        id="modalWriteRating"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="modalWriteRating">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button onClick={() => this.closeModal(false)} type="button" className="close"
                                        data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form name="formWriteRating" onSubmit={this.publishRating}>
                                        <div className="wrapForm">
                                            <div className="stars">
                                                <span>{starTitle}</span>
                                                <div className="wrapStars">
                                                    <input type="radio" value='5' id="star-5" name="stars" />
                                                    <span />
                                                    <input type="radio" value='4' id="star-4" name="stars" />
                                                    <span />
                                                    <input type="radio" value='3' id="star-3" name="stars" />
                                                    <span />
                                                    <input type="radio" value='2' id="star-2" name="stars" />
                                                    <span />
                                                    <input type="radio" value='1' id="star-1" name="stars" />
                                                    <span />
                                                </div>
                                                {errorStars && <p className="errorText">{errorStars}</p>}
                                                <h3>Neue Bewertung</h3>
                                                <InputRange
                                                    maxValue={5}
                                                    minValue={0}
                                                    value={this.state.starsCount}
                                                    onChange={this.changeStarsInput} />
                                            </div>

                                            <div className="commentField">
                                                {errorMaxLength && <p className="error">Der Bewertungstext darf maximal aus 500 Zeichen bestehen</p>}
                                                <textarea name="message"
                                                    value={ratingText}
                                                    onChange={this.changeRatingText}
                                                    required />
                                            </div>
                                            {!isAnonymous && <div className="userInfo">
                                                <input type="text"
                                                    value={userData.firstname}
                                                    onChange={this.handleChangeUserData}
                                                    required
                                                    name="firstname"
                                                    placeholder="Vorname" />
                                                <input type="text"
                                                    value={userData.lastname}
                                                    onChange={this.handleChangeUserData}
                                                    required
                                                    name="lastname"
                                                    placeholder="Nachname" />
                                                <input type="email"
                                                    value={userData.email}
                                                    onChange={this.handleChangeUserData}
                                                    required
                                                    name="email"
                                                    placeholder="E-Mail" />
                                            </div>
                                            }
                                            <Recaptcha
                                                sitekey={window.captchaSitekey.key}
                                                render="explicit"
                                                hl={"de"}
                                                verifyCallback={this.verifyCaptchaCallback}
                                                onloadCallback={() => false}
                                            />
                                            {captcha.errorCaptcha && <p style={{ color: 'red' }}>Bitte bestätigen Sie, dass Sie kein Roboter sind.</p>}
                                            <div>
                                                <label >
                                                    Anonym veröffentlichen
                                                    <input onChange={this.changeAnonymous} type="checkbox" name="anonymous" />
                                                    <span className="slider" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="buttons">
                                            <button onClick={() => this.closeModal(false)}
                                                type="button"
                                                className="btn closeBtn"
                                                data-dismiss="modal"
                                                aria-label="Close">
                                                Abbrechen
                                            </button>
                                            <button className="btn" onSubmit={this.publishRating}>Veröffentlichen</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

WriteRatingModalMobile.propTypes = {}
WriteRatingModalMobile.defaultProps = {}

export default WriteRatingModalMobile
