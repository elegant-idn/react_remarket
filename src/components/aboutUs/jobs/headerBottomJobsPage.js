import React from 'react'
import PropTypes from 'prop-types'

const HeaderBottomJobsPage = () => {
    return (
        <div className="jobs-header-content">
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="content">
                            <h3>Jobs</h3>
                            <p>Du hast Interesse an der neusten Technik und möchtest in einem motivierten und wachsenden Team mitarbeiten?</p>
                            <p>remarket.ch bietet dir hier die richtige Herausforderung.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="assistant">
                <img src="/images/design/Guy.svg" alt=""/>
                <div className="say">
                    <p>Wir suchen DICH!</p>
                </div>
            </div>
        </div>
    );
}

HeaderBottomJobsPage.propTypes = {}
HeaderBottomJobsPage.defaultProps = {}

export default HeaderBottomJobsPage