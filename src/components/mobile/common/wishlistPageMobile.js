import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import Footer from '../../Footer/footer'
import WishlistPage from "../../wishlist/WishlistPage";

class WishlistPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>

                <WishlistPage/>
                <Footer/>
            </div>
        )
    }
}

WishlistPageMobile.propTypes = {}
WishlistPageMobile.defaultProps = {}

export default WishlistPageMobile