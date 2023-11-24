import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import BasketVerkaufen from '../../verkaufen/basket/basketVerkaufenPage'
import HeaderMobile from '../header/headerMobile'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user'

export class BasketVerkaufenMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            titleForHead: 'Verkaufskorb',
            basketStep: 'product'
        }
        this.handleBackBtn = this.handleBackBtn.bind(this)
        this.goToCheckout = this.goToCheckout.bind(this)
        this.sendSuccess = this.sendSuccess.bind(this)
    }
    componentDidMount(){
        if($('#intercom-container').length > 0){
            $('#intercom-container .intercom-launcher-frame').removeAttr('style')
            $('#intercom-container').before('<div class="fixedBtnBasketVerkaufen"></div>')
        }
        if($('#tidio-chat').length > 0){
            $('#tidio-chat').before('<div class="fixedBtnBasketVerkaufen"></div>')
        }
        else $('body').append('<div class="fixedBtnBasketVerkaufen"></div>')
    }
    componentWillUnmount(){
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        $('body .fixedBtnBasketVerkaufen').remove()
    }
    _defineTitleHead(name){
        this.setState({ titleForHead: name })
    }

    handleBackBtn(){
        if(this.state.basketStep === 'personal') {
            $('.productWrap').show()
            $('.personalData, .basketSubmit').hide()
            this.setState({ titleForHead: 'Verkaufskorb' })
        }
        else if(this.state.basketStep === 'instructions') {
            let { isLogin } = this.props.user
            if(!isLogin){
                document.getElementById("op").checked = true
                this.props.userActions.setRedirectTo('/kundenkonto')
            }
            else{
                browserHistory.push('/kundenkonto')
            }
        }
    }
    goToCheckout(){
        this._defineTitleHead('1/2 Persönliche Angaben')
        this.setState({ basketStep: 'personal'})
        $('.productWrap').hide()
        $('.personalData, .basketSubmit').show()
    }
    sendSuccess(){
        this._defineTitleHead('2/2 Anleitung')
        this.setState({ basketStep: 'instructions'})
    }
    render() {
        let { titleForHead } = this.state
        return (
            <div className="basketVerkaufen">
                <HeaderMobile menu={titleForHead === "Verkaufskorb"}
                              back={titleForHead !== 'Verkaufskorb'}
                              handlerBack={this.handleBackBtn}
                              title={titleForHead}/>

                <BasketVerkaufen goToCheckout={this.goToCheckout}
                                 sendSuccess={this.sendSuccess}/>
            </div>
        )
    }
}

BasketVerkaufenMobile.propTypes = {}
BasketVerkaufenMobile.defaultProps = {}

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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(BasketVerkaufenMobile)
