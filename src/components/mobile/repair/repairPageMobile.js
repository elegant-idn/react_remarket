import React, { Component } from 'react'

import HeaderMobile from '../header/headerMobile'
import RepairPage from '../../../components/repair/repairPage'
import Footer from '../../Footer/footer'

class RepairPageMobile extends Component {
    state = {}
    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'repair'}/>
                <RepairPage children={this.props.children}/>
                <Footer/>
            </div>
        )
    }
}

export default RepairPageMobile