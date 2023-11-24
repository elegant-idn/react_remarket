import React from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import Impressum from '../../../components/aboutUs/impressum'

const MobileImpressum = () => {
    return (
        <div>
            <HeaderMobile menu={true}
                          title={'Impressum'}/>
            <Impressum />
        </div>
    )
}

MobileImpressum.propTypes = {}
MobileImpressum.defaultProps = {}

export default MobileImpressum