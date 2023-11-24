import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import CompanyPage from '../../../components/companyPage/companyPage'

class CompanyPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'firmenkunden'}/>
                <CompanyPage />
            </div>
        )
    }
}

CompanyPageMobile.propTypes = {}
CompanyPageMobile.defaultProps = {}

export default CompanyPageMobile