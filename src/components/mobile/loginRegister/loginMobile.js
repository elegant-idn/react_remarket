import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import HeaderAllPages from '../../header/headerAllPages/header'
import HeaderMobile from '../header/headerMobile'

class  LoginMobile extends Component {

    componentDidMount(){
        // $('.headerAllPages .login-box-tabs li:first-child a').click()
    }

    render() {
        return (
            <div>
                <HeaderMobile back={true}
                              handlerBack={ () => browserHistory.push('/')}
                              title='login/register'/>
                <HeaderAllPages showMenu={true}/>
            </div>
        )
    }
}

LoginMobile.propTypes = {}
LoginMobile.defaultProps = {}

export default LoginMobile