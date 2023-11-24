import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import ConfirmRegistration from '../../../components/common/confirmRegistration'

class ConfirmRegistrationMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'Bestätigung erfolgreich'}/>
                <ConfirmRegistration />
            </div>
        )
    }
}

ConfirmRegistrationMobile.propTypes = {}
ConfirmRegistrationMobile.defaultProps = {}

export default ConfirmRegistrationMobile