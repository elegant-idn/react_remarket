import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import axios from 'axios'

import InputForm from '../../common/itemInput'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user'

export class LoginFormForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errorForgotPassword: {
                login: '',
                error: '',
                trueMsg: ''
            },
            showInputForCode: false
        }

        this.forgotPasswordSend = this.forgotPasswordSend.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.closeLoginForm = this.closeLoginForm.bind(this)

    }
    closeLoginForm(){
        document.querySelectorAll('.simform input:not([type=submit])').forEach( item => item.value = '' )
        this.setState({ errorForgotPassword: {...this.state.errorForgotPassword, errorEmail: '', error: '', trueMsg: ''} })
        browserHistory.push('/')
    }
    handleChange(e){
        let { name } = e.target,
            { errorForgotPassword } = this.state
        errorForgotPassword[name] = null
        this.setState({ errorForgotPassword })
    }
    forgotPasswordSend(e){
        e.preventDefault()
        if(!this.state.showInputForCode){
            let url = '/api/forgot'
            let data = new FormData(document.forms.forgotPasswordForm)
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post(url, data)
                .then( response => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    if(response.data.status === 'false'){
                        if( response.data.message ){
                            let login = response.data.message
                            this.setState({ errorForgotPassword: { ...this.state.errorForgotPassword, login }})
                        }
                    }
                    else {
                        if(response.data.smsWasSent){
                            this.setState({ showInputForCode: true })
                        }
                        else{
                            document.querySelectorAll('.simform input:not([type=submit])').forEach( item => item.value = '' )
                            this.setState({ errorForgotPassword: {...this.state.errorForgotPassword, errorEmail: '', error: '' }, showInputForCode: false })
                            document.getElementById("forgotPassword").checked = false
                            browserHistory.push('/')
                            this.props.userActions.setMsgInfo(<div className="msgBlock"><p>{response.data.message}</p></div> )
                            setTimeout(() => this.props.userActions.setMsgInfo(null), 3000)
                        }
                    }
                })
                .catch( error => {
                })
        }
        else{
            let url = `/api/checkCode?code=${document.forms.forgotPasswordForm.code.value}`
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.get(url)
                .then( ({data}) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    document.getElementById("forgotPassword").checked = false
                    this.closeLoginForm()
                    browserHistory.push(data.redirectUrl)
                } )
                .catch( response => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    let  error = response.response.data.message
                    if( error ){
                        this.setState({ errorForgotPassword: {...this.state.errorForgotPassword, error } })
                    }

                })
        }

    }
    render() {
        let { login, error } = this.state.errorForgotPassword
        return (
            <div className="forgotPasswordOverlay">
                <div className="forgotPasswordBox">
                    <div className="forgotPasswordBoxWrapper">
                        <label className="close" htmlFor="forgotPassword" onClick={this.closeLoginForm}/>
                        <div className="forgotPasswordBoxContainer">
                            <div className="login-box-form">
                                <form acceptCharset="utf-8" action="#" className="simform" name="forgotPasswordForm" onSubmit={this.forgotPasswordSend}>
                                    <div className="heading">Passwort vergessen</div>
                                    <div className="sminputs">
                                        <div className="input full">
                                            <InputForm  error={login}
                                                        id="forgot-form-email"
                                                        name="login"
                                                        type="text"
                                                        label="E-Mail"
                                                        handleChange={this.handleChange}/>
                                        </div>
                                        { this.state.showInputForCode &&
                                        <div className="input full">
                                            <InputForm  error={error}
                                                        id="code"
                                                        name="error"
                                                        type="text"
                                                        label="Code"
                                                        handleChange={this.handleChange}/>
                                        </div>
                                        }
                                    </div>
                                    <button className="commit" name="commit" type="submit">
                                        Senden
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LoginFormForgotPassword.propTypes = {}
LoginFormForgotPassword.defaultProps = {}



function mapStateToProps (state) {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(LoginFormForgotPassword)