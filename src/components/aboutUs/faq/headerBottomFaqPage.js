import React from 'react'
import PropTypes from 'prop-types'

const HeaderBottomFaqPage = () => {
    return (
        <div className="faq-header-content">
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="content">
                            <h3>Faq</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="assistant">
                <img src="/images/design/Guy.svg" alt=""/>
                <div className="say">
                    <p>Guten Tag.</p>
                    <p>Wie können wir dir helfen?</p>
                </div>
            </div>
        </div>
    );
}

HeaderBottomFaqPage.propTypes = {}
HeaderBottomFaqPage.defaultProps = {}

export default HeaderBottomFaqPage