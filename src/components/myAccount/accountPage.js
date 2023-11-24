import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link, IndexLink } from 'react-router'
import { browserHistory } from 'react-router'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../actions/user'

export class AccountPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.logOut = this.logOut.bind(this)
    }
    componentWillReceiveProps( nextProps ){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            browserHistory.push('/')
        }
    }
    logOut(){
        if (FB.getAccessToken() != null) {
            FB.logout(function(response) {
                FB.Auth.setAuthResponse(null, 'unknown');
            });
        }
        if (window.gapiAuth2)
            window.gapiAuth2.disconnect()
        window.localStorage.removeItem("token")
        delete window.axios.defaults.headers.common['Authorization-Token']
        this.props.userActions.logOut()
    }
    render() {
        return (
            <div className="container content myAccount">
                <div className="row wrap-myAccount">
                    <div className="col-sm-3">
                        <div className="sidebar">
                            <div className="nav">
                                <IndexLink to="/kundenkonto" activeClassName="active"> <img src="/images/design/overview_myAccount.svg" alt=""/>Bestellübersicht</IndexLink>
                                <Link to="/kundenkonto/profile" activeClassName="active"><img src="/images/design/profile_myAccount.svg" alt=""/>Profil bearbeiten</Link>
                                <Link to="/kundenkonto/passwort-aendern/" activeClassName="active" ><img src="/images/design/key_myAccount.svg" alt=""/>Passwort ändern</Link>
                            </div>
                            <span onClick={this.logOut} className="logout"><img src="/images/design/log-out_myAccount.svg" alt=""/>Ausloggen</span>
                        </div>
                    </div>
                    <div className="col-sm-9 mainContent">
                        { this.props.children }
                    </div>
                </div>

            </div>
        );
    }
}

AccountPage.propTypes = {}
AccountPage.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(AccountPage)