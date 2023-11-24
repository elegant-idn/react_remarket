import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import PageDownloadCoupon from './../../aboutUs/PageDownloadCoupon'

class PageDownloadCouponMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'Gutschein'}/>
                <div className="downloadCoupon">
                    <PageDownloadCoupon params={this.props.params} />
                </div>
            </div>
        )
    }
}

PageDownloadCouponMobile.propTypes = {}
PageDownloadCouponMobile.defaultProps = {}

export default PageDownloadCouponMobile
