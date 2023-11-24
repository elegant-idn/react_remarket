import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import TrackingInfo from '../../../components/myAccount/trackingInfo'

class TrackingInfoMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'Tracking-Informationen'}/>
                <TrackingInfo params={this.props.params}/>
            </div>
        )
    }
}

TrackingInfoMobile.propTypes = {}
TrackingInfoMobile.defaultProps = {}

export default TrackingInfoMobile