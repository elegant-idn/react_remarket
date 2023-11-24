import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import FormNewPassword from '../../../components/header/loginForm/formNewPassword'

class FormNewPasswordMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'Passwort ändern'}/>
                <FormNewPassword params={this.props.params}/>
            </div>
        )
    }
}

FormNewPasswordMobile.propTypes = {}
FormNewPasswordMobile.defaultProps = {}

export default FormNewPasswordMobile