import React, {Component} from 'react'
import PropTypes from 'prop-types'

import CancelPaymentPage from '../../common/cancelPaymentPage'
import HeaderMobile from '../header/headerMobile'

class CancelPaymentPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div className="mobilePaymentStatus">
                <HeaderMobile menu={true}
                              title={'failed'}/>
                <CancelPaymentPage />
            </div>
        );
    }
}

CancelPaymentPageMobile.propTypes = {}
CancelPaymentPageMobile.defaultProps = {}

export default CancelPaymentPageMobile