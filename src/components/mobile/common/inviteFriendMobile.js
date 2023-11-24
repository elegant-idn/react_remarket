import React, { Component } from 'react'

import HeaderMobile from '../header/headerMobile'
import InviteFriend from '../../../components/inviteFriend/inviteFriend'

class InviteFriendMobile extends Component {
    state = {}
    render() {
        return (
            <div>
                <HeaderMobile menu={true}
                              title={'weiterempfehlen'}/>
                <InviteFriend />
            </div>
        )
    }
}

export default InviteFriendMobile