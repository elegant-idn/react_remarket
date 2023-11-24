import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import JobsComponent from '../../aboutUs/jobs/jobsComponent'
import Footer from '../../Footer/footer'

class JobsPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div className="jobs-page-mobile">
                <HeaderMobile menu={true}
                              title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <div className="header">
                    <h2>Jobs</h2>
                    <p>Du hast Interesse an der neusten Technik und möchtest in einem motivierten und wachsenden Team mitarbeiten?</p>
                    <p>Dann bietet Ihnen remarket.ch genau die richtige Herausforderung.</p>
                </div>
                <JobsComponent />
                <Footer/>
            </div>
        )
    }
}

JobsPageMobile.propTypes = {}
JobsPageMobile.defaultProps = {}

export default JobsPageMobile