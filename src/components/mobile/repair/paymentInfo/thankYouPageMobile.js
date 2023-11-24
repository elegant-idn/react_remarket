import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ThankYouPage from '../../../repair/paymentInfo/thankYouPage'
import HeaderMobile from '../../header/headerMobile'

class ErrorPaymentPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div className="mobilePaymentStatus">
                <HeaderMobile menu={true}
                              title={'Erfolgreiche Zahlung'}/>
                <ThankYouPage />
            </div>
        );
    }
}

ErrorPaymentPageMobile.propTypes = {}
ErrorPaymentPageMobile.defaultProps = {}

export default ErrorPaymentPageMobile