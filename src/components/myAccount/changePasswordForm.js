import React, {Component} from 'react'
import PropTypes from 'prop-types'
import  InputForm from '../common/itemInput'
import axios from 'axios'

import  {connect} from 'react-redux'

export class ChangePasswordForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errorsList: {
                oldPassword: null,
                firstPassword: null,
                secondPassword: null
            },
            msgText: null
        }

        this.changePassword = this.changePassword.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }
    handleChange(e){
        let { name, value } = e.target,
            { errorsList } = this.state
        errorsList[name] = null

        //password status bar
        let regular =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
        if(regular.test(value.trim())){
            $(e.target).parents('.input.full').find('.statusBarPassword').css({ background: '#00cb94'})
        }
        else{
            $(e.target).parents('.input.full').find('.statusBarPassword').css({ background: '#ff0000'})
        }

        this.setState({ errorsList, msgText: null })
    }
    changePassword(e){
        e.preventDefault()
        let dataForm = new FormData(document.forms.changePasswordForm)
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post('/api/changePassword', dataForm)
            .then( data => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if(data.status === 200){
                    [...document.querySelectorAll('.changePasswordForm input')].forEach( item => item.value = '')
                    this.setState({ errorsList: { ...this.state.errorsList, oldPassword: null, firstPassword: null, secondPassword: null },
                                    msgText: data.data
                    })
                }
            })
            .catch( error => {
                document.getElementById('spinner-box-load').style.display = 'none'
                let errorData = error.response.data.errors,
                    { errorsList } = this.state
                for( let key in errorData){
                    errorsList[key] = errorData[key][0]
                }
                this.setState({ errorsList })
            })
    }

    render() {
        let { errorsList, msgText } = this.state
        return (
            <div className="changePasswordForm">
                <p style={{ color: 'green'}}>{msgText}</p>
                <div className="wrapForm">
                    <div className="circle"/>
                    <h3 className="title">Passwort ändern</h3>
                    <form name="changePasswordForm" onSubmit={this.changePassword} >
                        <div className="input full">
                            <InputForm  error={errorsList.oldPassword}
                                        id="oldPassword"
                                        name="oldPassword"
                                        type="password"
                                        label="Aktuelles Passwort"
                                        handleChange={this.handleChange}/>
                        </div>
                        <div className="input new-password full">
                            <InputForm  error={errorsList.firstPassword}
                                        id="firstPassword"
                                        name="firstPassword"
                                        type="password"
                                        label="Neues Passwort"
                                        handleChange={this.handleChange}/>
                            <div className="statusBarPassword"/>
                        </div>
                        <div className="input full">
                            <InputForm  error={errorsList.secondPassword}
                                        id="secondPassword"
                                        name="secondPassword"
                                        type="password"
                                        label="Passwort wiederholen"
                                        handleChange={this.handleChange}/>
                            <div className="statusBarPassword"/>
                        </div>
                        <button type="submit" className="btn">
                            Passwort ändern
                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

ChangePasswordForm.propTypes = {}
ChangePasswordForm.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}


export default connect(mapStateToProps)(ChangePasswordForm)