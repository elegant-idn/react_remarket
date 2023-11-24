import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { browserHistory } from 'react-router'

import InputForm from '../../common/itemInput'
import SpinnerBox from "../../spinnerBox/spinnerBox";

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user'

export class FormNewPassword extends Component{

    constructor(props){
        super(props)
        this.state = {
            error: {
                password: '',
                password_confirmation: ''
            },
            message: ''
        }


        this.closeLogin = this.closeLogin.bind(this)
        this.newPasswordSend = this.newPasswordSend.bind(this)
        this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this)
    }

    closeLogin(){
        browserHistory.push('/')
    }

    handleChangeNewPassword(e){
        let { name, value } = e.target,
        { error } = this.state

        let regular =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
        if(regular.test(value.trim())){
            $(e.target).parents('.input.full').find('.statusBarPassword').css({ background: '#00cb94'})
        }
        else{
            $(e.target).parents('.input.full').find('.statusBarPassword').css({ background: '#ff0000'})
        }
        error[name] = null
        this.setState({ error })
    }

    newPasswordSend(e){
        e.preventDefault()
        let hash = this.props.params.hash
        let url = `/api/reset/${hash}`
        let data = new FormData(document.forms.newPasswordForm)
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post(url, data)
            .then( response => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if(response.data.status === 'true'){
                    document.querySelectorAll('.simform input:not([type=submit])').forEach( item => item.value = '' )
                    this.setState({ message: response.data.message})
                }
                else{
                    let err = response.data.message,
                        password, password_confirmation
                    if(err){
                        password = password_confirmation = err
                    }
                    this.setState({ error: {...this.state.error, password, password_confirmation } })
                }
            })
            .catch( error => {
                document.getElementById('spinner-box-load').style.display = 'none'
                let err = error.response.data.errors,
                    password, password_confirmation
                if(err){
                    err.password ? password = password_confirmation = err.password[0] : ''
                }
                this.setState({ error: {...this.state.error, password, password_confirmation } })
            })
    }
    render(){
            return (
                <div className="resetPassword">
                    <div className="container">
                        <div className="col-md-8 col-md-push-2 resetPassword-wrap">
                            {this.state.message && <p className="message">{this.state.message}</p> }
                            <div className="circle"/>
                            <p className="title">Passwort ändern</p>
                            <form acceptCharset="utf-8" action="#" className="simform" name="newPasswordForm" onSubmit={this.newPasswordSend}>
                                <div className="sminputs">
                                    <div className="input full">
                                        <InputForm  error={this.state.error.password}
                                                    id="new-password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="Neues Passwort"
                                                    label="Neues Passwort"
                                                    handleChange={this.handleChangeNewPassword}/>
                                        <div className="statusBarPassword"/>
                                    </div>
                                    <div className="input full">
                                        <InputForm  error={this.state.error.password_confirmation}
                                                    id="confirm_password"
                                                    name="password_confirmation"
                                                    type="password"
                                                    placeholder="Passwort bestätigen"
                                                    label="Passwort bestätigen"
                                                    handleChange={this.handleChangeNewPassword}/>
                                    </div>
                                </div>
                                <div className="simform-actions">
                                    <button className="btn">Senden
                                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }

FormNewPassword.propTypes = {}
FormNewPassword.defaultProps = {}

function mapStateToProps (state) {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(FormNewPassword)