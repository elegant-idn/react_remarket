import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory} from 'react-router'

import HeaderMobile from '../header/headerMobile'
import VerkaufenBeta from '../../verkaufenBeta/verkaufenBeta'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user'

export class VerkaufenBetaMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            headerTitle: "verkaufen",
            step: 'summary',
            showLastQuestion: false,
            isGuest: false,
            showEditAnswers: false,
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
            bottom: "-10px",
            right: "10px"
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
            $('.sellBetaPage-wrap').show()
            this._defineTitleHead('verkaufen')
            $('.sellBetaPage .answersBetaField .itemAnswer:last-child .question.client').click()
            $('.answersBetaField').scrollTop($('.answersBetaField')[0].scrollHeight).css({paddingTop: '30px'})
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
    handlerEditAnswers = type => e =>  {
        if(type === 'open'){
            $('#mobile .verkaufen-mobile aside').addClass('open');
            this.setState({ showEditAnswers: true})
        }
        else{
            $('#mobile .verkaufen-mobile aside').removeClass('open');
            this.setState({ showEditAnswers: false})
        }
    }
    handleClearSummaryTab() {
        this.setState({chooseTab: ''})
    }
    render() {
        return (
            <div className="verkaufen-mobile">
                <HeaderMobile title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'
                              back={false}
                              handlerBack={this.handleBackFilter}
                              menu={true}/>
                {this.state.headerTitle === 'verkaufen' && <div className={this.state.showEditAnswers ? 'open edit-answers' : 'edit-answers'}>
                    <div>
                        <img src="/images/design/simple-close-logFormBlack.svg"
                             onClick={this.handlerEditAnswers('close')}
                             className="btn-close"/>
                    </div>
                    <div className="btn-edit"
                         onClick={this.handlerEditAnswers('open')}>Ihre Angaben anzeigen
                        <img src="/images/design/edit_answers_icon.svg"/>
                    </div>
                </div>}
                <VerkaufenBeta params={this.props.params}
                               handlerBack={this.handleBackFilter}
                               handlerMobileEditAnswers={this.handlerEditAnswers}
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

VerkaufenBetaMobile.propTypes = {}
VerkaufenBetaMobile.defaultProps = {}

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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(VerkaufenBetaMobile)