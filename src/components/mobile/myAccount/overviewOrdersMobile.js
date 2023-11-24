import React, {Component} from 'react'
import PropTypes from 'prop-types'

import OverviewOrders from '../../myAccount/overviewOrders/overviewOrders'

class OverviewOrdersMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <OverviewOrders/>
            </div>
        )
    }
}

OverviewOrdersMobile.propTypes = {}
OverviewOrdersMobile.defaultProps = {}

export default OverviewOrdersMobile