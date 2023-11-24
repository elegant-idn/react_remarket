import React from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import Datenschutzerklaerung from '../../../components/aboutUs/datenschutzerklaerung'

const MobileDatenschutzerklaerung = () => {
    return (
        <div>
            <HeaderMobile menu={true}
                          title={'Datenschutzerklärung'}/>
            <Datenschutzerklaerung />
        </div>
    )
}

MobileDatenschutzerklaerung.propTypes = {}
MobileDatenschutzerklaerung.defaultProps = {}

export default MobileDatenschutzerklaerung