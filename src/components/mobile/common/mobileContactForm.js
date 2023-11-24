import React from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import ContactForm from '../../../components/aboutUs/contactForm'

const MobileContactForm = () => {
    return (
        <div>
            <HeaderMobile menu={true}
                          title={'Kontakt'}/>
            <ContactForm />
        </div>
    )
}

MobileContactForm.propTypes = {}
MobileContactForm.defaultProps = {}

export default MobileContactForm