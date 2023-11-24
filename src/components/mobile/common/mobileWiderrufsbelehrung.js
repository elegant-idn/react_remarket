import React from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import Widerrufsbelehrung from '../../../components/aboutUs/widerrufsbelehrung'

const MobileWiderrufsbelehrung = () => {
    return (
        <div>
            <HeaderMobile menu={true}
                          title={'Widerrufsbelehrung'}/>
            <div className="mobileAGB">
                <Widerrufsbelehrung />
            </div>
        </div>
    )
}

MobileWiderrufsbelehrung.propTypes = {}
MobileWiderrufsbelehrung.defaultProps = {}

export default MobileWiderrufsbelehrung