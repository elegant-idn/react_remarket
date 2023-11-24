import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import InfoPageRegistration from '../../../components/common/infoPageRegistration'

class InfoPageRegistrationMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'Bestätigen E-Mail'}/>
                    <InfoPageRegistration />
            </div>
        )
    }
}

InfoPageRegistrationMobile.propTypes = {}
InfoPageRegistrationMobile.defaultProps = {}

export default InfoPageRegistrationMobile