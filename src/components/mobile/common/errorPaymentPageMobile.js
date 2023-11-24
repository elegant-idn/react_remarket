import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ErrorPaymentPage from '../../common/errorPaymentPage'
import HeaderMobile from '../header/headerMobile'

class ErrorPaymentPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div className="mobilePaymentStatus">
                <HeaderMobile menu={true}
                              title={'failed'}/>
                <ErrorPaymentPage />
            </div>
        );
    }
}

ErrorPaymentPageMobile.propTypes = {}
ErrorPaymentPageMobile.defaultProps = {}

export default ErrorPaymentPageMobile