import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link, IndexLink } from 'react-router'
import { browserHistory } from 'react-router'

import HeaderMobile from '../header/headerMobile'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user'

export class MyAccountMobiile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            titleForHead: 'Bestellübersicht',
            backFromPayout: false
        }

        this.handleBackFilter = this.handleBackFilter.bind(this)
        this.logOut = this.logOut.bind(this)
        this.setTitleForHead = this.setTitleForHead.bind(this)
        this.clickPayoutBtn = this.clickPayoutBtn.bind(this)

    }

    componentWillReceiveProps( nextProps ){

        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            browserHistory.push('/')
        }
        if( nextProps.location.pathname !== this.props.location.pathname){
            this.setTitleForHead(nextProps.location.pathname)
        }
    }

    componentDidMount(){
        if($('#intercom-container').length > 0){
            $('#intercom-container .intercom-launcher-frame').removeAttr('style')
            $('#intercom-container').before('<div class="myAccountMobile"></div>')
        }
        if($('#tidio-chat').length > 0){
            $('#tidio-chat').before('<div class="myAccountMobile"></div>')
        }
        else $('body').append('<div class="myAccountMobile"></div>')
        this.setTitleForHead(this.props.location.pathname)
    }
    setTitleForHead(path){
        if(path.includes('passwort-aendern')) this.setState({ titleForHead: 'Passwort ändern'})
        else if(path.includes('profile')) this.setState({ titleForHead: 'Profil bearbeiten'})
        else if(path.includes('auszahlung')) this.setState({ titleForHead: 'Auszahlung'})
        else this.setState({ titleForHead: 'Bestellübersicht'})
    }
    clickPayoutBtn(){
        $('.tableCredits').hide()
        $('.formCredits').show()
        this.setState({ backFromPayout: true })
    }
    handleBackFilter(){
        if(this.state.backFromPayout){
            $('.tableCredits').show()
            $('.formCredits').hide()
            this.setState({ backFromPayout: false })
        }
        else browserHistory.push('/')
    }
    logOut(e){
        e.preventDefault()
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
        let { titleForHead } = this.state
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                clickPayoutBtn: this.clickPayoutBtn
            })
        )
        return (
            <div className="myAccount-mobile">
                <HeaderMobile menu={false}
                              back={true}
                              handlerBack={this.handleBackFilter}
                              title={titleForHead}/>
                <div className="container myAccount">
                    <div className="wrap-myAccount">
                        <div className="mainContent">
                            { childrenWithProps }
                        </div>
                    </div>
                </div>
                <div className="bottomNavigate">
                    <div className="nav">
                        <IndexLink to="/kundenkonto" activeClassName="active">
                            <img src="/images/design/overview_myAccount.svg" alt=""/>
                            <img src="/images/design/overview_myAccount_active.svg" alt=""/>
                            Übersicht</IndexLink>
                        <Link to="/kundenkonto/profile" activeClassName="active">
                            <img src="/images/design/profile_myAccount.svg" alt=""/>
                            <img src="/images/design/profile_myAccount_active.svg" alt=""/>
                            Mein Profil</Link>
                        <Link to="/kundenkonto/passwort-aendern/" activeClassName="active" >
                            <img src="/images/design/key_myAccount.svg" alt=""/>
                            <img src="/images/design/key_myAccount_active.svg" alt=""/>
                            Passwort</Link>
                        <a href="#" onClick={this.logOut} className="logout">
                            <img src="/images/design/log-out_myAccount.svg" alt=""/>
                            <img src="/images/design/log-out_myAccount.svg" alt=""/>
                            Ausloggen</a>
                    </div>
                </div>
            </div>

        )
    }
}

MyAccountMobiile.propTypes = {}
MyAccountMobiile.defaultProps = {}

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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(MyAccountMobiile)