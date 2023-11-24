import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory} from 'react-router'

import HeaderMobile from '../header/headerMobile'
import Verkaufen from '../../verkaufen/verkaufen'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user'

export class VerkaufenMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            headerTitle: "verkaufen",
            step: 'summary',
            showLastQuestion: false,
            isGuest: false,
            chooseTab: ''
        }

        this._defineTitleHead = this._defineTitleHead.bind(this)
        this.handleClearSummaryTab = this.handleClearSummaryTab.bind(this)
        this._setStep = this._setStep.bind(this)
        this._setIsGuest = this._setIsGuest.bind(this)
        this._setShowLastQuestion = this._setShowLastQuestion.bind(this)
        this.handleBackFilter = this.handleBackFilter.bind(this)
    }
    componentDidMount(){
        if(this.state.headerTitle === 'verkaufen'){
            if($('#intercom-container').length > 0){
                $('#intercom-container .intercom-launcher-frame').removeAttr('style')
                $('#intercom-container').before('<div class="verkaufenQuestion"></div>')
            }
            if($('#tidio-chat').length > 0){
                $('#tidio-chat').before('<div class="verkaufenQuestion"></div>')
            }
            else $('body').append('<div class="verkaufenQuestion"></div>')
        }
    }
    componentWillUnmount(){
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px!important",
            right: "10px!important"
        })
        $('body .verkaufenQuestion').remove()
    }
    _defineTitleHead(name){
        this.setState({ headerTitle: name })
    }
    _setStep(name){
        this.setState({ step: name })
    }
    _setShowLastQuestion(value){
        this.setState({ showLastQuestion: value })
    }
    _setIsGuest(isGuest){
        this.setState({ isGuest })
    }
    handleBackFilter(){
        let isChooseLocationTab = document.getElementById("chooseLocationTab")
        let isChooseForm = document.getElementById("form")
        let isBringToShop = document.getElementById("bringToShop")
        let { step } = this.state
        if(step === 'instructions') {
            let { isLogin } = this.props.user
            if(!isLogin){
                if(this.state.isGuest){
                    browserHistory.push('/')
                }
                else {
                    document.getElementById("op").checked = true
                    this.props.userActions.setRedirectTo('/kundenkonto')
                }
            }
            else{
                browserHistory.push('/kundenkonto')
            }
        }
        else if(step === 'summary' && !isChooseLocationTab && !isBringToShop){
            if($('#intercom-container').length > 0){
                $('#intercom-container .intercom-launcher-frame').removeAttr('style')
                $('#intercom-container').before('<div class="verkaufenQuestion"></div>')
            }
            if($('#tidio-chat').length > 0){
                $('#tidio-chat').before('<div class="verkaufenQuestion"></div>')
            }
            else $('body').append('<div class="verkaufenQuestion"></div>')

            this.setState({ showLastQuestion: true })
            $('.sellPage-wrap').show()
            this._defineTitleHead('verkaufen')
            $('.sellPage .answersField .itemAnswer:last-child .question.client').click()
            $('.answersField').scrollTop($('.answersField')[0].scrollHeight).css({paddingTop: '30px'})
        }
        else {
            if(isChooseLocationTab || isChooseForm || isBringToShop){
                this.setState({ chooseTab: 'generalInfo' })
            }
            $('.nav-pills a[href="#summary"]').tab('show')
            this._defineTitleHead('<span class="count">1/3</span> Zusammenfassung')
            this._setStep('summary')
            $('.buttonsForMobile .sendForm').css({display: 'none'})
            $('.buttonsForMobile .summary').css({display: 'block'})
            $('.fixedBtnVerkaufenResult').addClass('summary')
        }
    }
    handleClearSummaryTab() {
        this.setState({chooseTab: ''})
    }
    render() {
        return (
            <div>
                <HeaderMobile title={this.state.headerTitle}
                              back={this.state.headerTitle !== 'verkaufen'}
                              handlerBack={this.handleBackFilter}
                              menu={this.state.headerTitle === 'verkaufen'}/>
                <Verkaufen params={this.props.params}
                           handlerBack={this.handleBackFilter}
                           setStep={this._setStep}
                           setShowLastQuestion={this._setShowLastQuestion}
                           setIsGuest={this._setIsGuest}
                           showLastQuestion={this.state.showLastQuestion}
                           chooseSummaryTab={this.state.chooseTab}
                           handleClearSummaryTab={this.handleClearSummaryTab}
                           setTitle={this._defineTitleHead}/>
            </div>
        );
    }
}

VerkaufenMobile.propTypes = {}
VerkaufenMobile.defaultProps = {}

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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(VerkaufenMobile)