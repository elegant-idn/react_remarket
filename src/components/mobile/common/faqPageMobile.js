import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import FaqPageComponent from '../../aboutUs/faq/faqPageComponent'
import Footer from '../../Footer/footer'

class FaqPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div className="faq-page-mobile">
                <HeaderMobile menu={true}
                              title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <div className="header">
                    <h2>Faq</h2>
                    <p>Guten Tag.</p>
                    <p>Wie können wir dir helfen?</p>
                </div>
                <FaqPageComponent />
                <Footer/>
            </div>
        )
    }
}

FaqPageMobile.propTypes = {}
FaqPageMobile.defaultProps = {}

export default FaqPageMobile