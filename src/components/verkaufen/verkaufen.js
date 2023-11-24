import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import MobileDetect from 'mobile-detect'

import ModelsListVerkaufen4 from './modelsListVerkaufen4'
import ShowResults from './showResults'
import AddToBasketEffect from '../common/addToBasketEffect'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import * as shopActions from '../../actions/shop'
import * as userActions from '../../actions/user'

export class Verkaufen extends Component {
    constructor(props){
        super(props)
        this.state = {
            userAnswers: {},
            showResults: null,
            startAnalytics: true
        }

        this.changeUserAnswer = this.changeUserAnswer.bind(this)
        this.changeUserAnswerModel = this.changeUserAnswerModel.bind(this)
        this.changeUserAnswerDevice = this.changeUserAnswerDevice.bind(this)
        this.changeUserAnswerCondition = this.changeUserAnswerCondition.bind(this)
        this.showResults = this.showResults.bind(this)
        this.closeShowResults = this.closeShowResults.bind(this)
        this.setUserAnswers = this.setUserAnswers.bind(this)
        this.addToBasketVerkaufen = this.addToBasketVerkaufen.bind(this)
        this.changeComment = this.changeComment.bind(this)
        this.changeModelPriceByCondition = this.changeModelPriceByCondition.bind(this)
        this.changeUserAnswerFromSearchBar = this.changeUserAnswerFromSearchBar.bind(this)
        this.deleteUserAnswer = this.deleteUserAnswer.bind(this)
    }

    componentWillReceiveProps( nextProps ){
        if( nextProps.params && Object.keys(nextProps.params).length <= 0 || !nextProps.params.device){
            this.setState({ userAnswers: {}, showResults: null })
            this.props.setShowLastQuestion && this.props.setShowLastQuestion(false)
        }
        //mobile back btn press
        if( nextProps.showLastQuestion !== this.props.showLastQuestion && nextProps.showLastQuestion){
            this.setState({ showResults: null })
        }
        if(nextProps.chooseSummaryTab == "generalInfo"){
            this.showResults('', "generalInfo")
        }
    }

    componentDidMount(){
        this.props.shopAction.loadDevices('/api/devicesForPurchase', 'verkaufen')
        //check if Safari
        let md = new MobileDetect(window.navigator.userAgent)
        if (md.mobile() === 'iPhone' && md.userAgent() === 'Safari'){
            $('#mobile').addClass('safariVerkaufen')
        }
    }
    componentWillUnmount(){
        $('#mobile').removeClass('safariVerkaufen');
        $('#tidio-chat #tidio-chat-iframe').show();
    }
    _gtag_report_conversion(url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-827036726/DfEBCP7o03sQtqiuigM',
            'event_callback': callback
        });
        return false;
    }
    changeModelPriceByCondition(price){
        let { userAnswers } = this.state
        userAnswers.Model[0].price = price
        this.setState({ userAnswers })
    }
    deleteUserAnswer(name){
        let userAnswers = { ...this.state.userAnswers }
        delete userAnswers[name]
        this.setState({ userAnswers })
    }
    changeUserAnswer( type, value, criteriaId, nameOfDisplayCriteria ){
        let { userAnswers } = this.state

        if(type === 'Defects'){
            if(value.some(item => item.id == 8 || item.id == 10 || item.id == 11)){
                delete userAnswers[nameOfDisplayCriteria]
            }
        }

        if(type === "Brand"){
            let userAnswers = {}
            userAnswers.Device = this.state.userAnswers.Device
            userAnswers[type] = [ ...value]
            this.setState({ userAnswers })
        }
        else if(type === "Submodel"){
            let userAnswers = {}
            userAnswers.Device = this.state.userAnswers.Device
            userAnswers.Brand = this.state.userAnswers.Brand
            userAnswers[type] = [ ...value]
            this.setState({ userAnswers })
        }
        else if(criteriaId && criteriaId == 16 ){
            userAnswers.image = value[0].image
            userAnswers[type] = [ ...value]
            let newUserAnswers = {...userAnswers}
            this.setState({ userAnswers: newUserAnswers })

        }
        else{
            userAnswers[type] = [ ...value]
            let newUserAnswers = {...userAnswers}
            this.setState({ userAnswers: newUserAnswers })
        }


    }
    changeUserAnswerModel( type, value ){
        let userAnswers = {}
        userAnswers.image = value[0].image
        userAnswers.Device = this.state.userAnswers.Device
        userAnswers.Brand = this.state.userAnswers.Brand
        this.state.userAnswers.Submodel ? userAnswers.Submodel = this.state.userAnswers.Submodel : false
        userAnswers[type] = value

        this.setState({ userAnswers, showResults: null })
    }
    changeUserAnswerDevice(type, value){
        let userAnswers = {}
        userAnswers[type] = value

        this.setState({ userAnswers, showResults: null })
    }
    changeUserAnswerFromSearchBar(data){
        let userAnswers = {}
        userAnswers.Device = [data.brand[0]]
        if(data.brand[0].submodels[0].submodels){
            userAnswers.Brand = [data.brand[0].submodels[0]]
            userAnswers.Submodel = [data.brand[0].submodels[0].submodels[0]]
            userAnswers.Model = [data.device]
            userAnswers.image = data.device.image
        }
        else{
            userAnswers.Brand = [data.brand[0].submodels[0]]
            userAnswers.Model = [data.device]
            userAnswers.image = data.device.image
        }
        this.setState({ userAnswers, showResults: null })
    }
    changeUserAnswerCondition( type, value ){
        let userAnswers = {}
        userAnswers.image = this.state.userAnswers.image
        userAnswers.Device = this.state.userAnswers.Device
        userAnswers.Brand = this.state.userAnswers.Brand
        this.state.userAnswers.Submodel ? userAnswers.Submodel = this.state.userAnswers.Submodel : false
        userAnswers.Model = this.state.userAnswers.Model
        userAnswers[type] = value

        this.setState({ userAnswers, showResults: null })
    }

    showResults(isReopenPopup, chooseSummaryTab){
        if(window.isMobile) $('.sellPage-wrap').hide()
        let showResults = <ShowResults addToBasketVerkaufen={this.addToBasketVerkaufen}
                                       closeShowResults={this.closeShowResults}
                                       changeComment={this.changeComment}
                                       setTitle={this.props.setTitle}
                                       setStep={this.props.setStep}
                                       setIsGuest={this.props.setIsGuest}
                                       isReopenPopup={isReopenPopup}
                                       chooseSummaryTab={chooseSummaryTab?chooseSummaryTab:''}
                                       handleClearSummaryTab={this.props.handleClearSummaryTab}
                                       handlerBack={this.props.handlerBack}
                                       userAnswers={this.state.userAnswers}/>
        this.setState({ showResults })
        this.props.setShowLastQuestion && this.props.setShowLastQuestion(false)
        { (this.state.startAnalytics && window.isGoogleConnection) && this._gtag_report_conversion() } // google adwords
        { (this.state.startAnalytics && window.isFBConnection) && fbq('track', 'Lead') } //facebook pixel
    }
    closeShowResults(currentTab, isGuest){
        let { isLogin } = this.props.user
        if(currentTab === 'instructions'){
            if(!isLogin){
                if(isGuest){
                    browserHistory.push('/')
                }
                else{
                    this.props.userAction.setRedirectTo('/kundenkonto')
                    setTimeout( () => document.getElementById("op").checked = true, 100)
                }
            }
            else{
                browserHistory.push('/kundenkonto')
            }
        }
            else this.setState({ showResults: null, startAnalytics: false })
    }
    setUserAnswers(userAnswers){
        this.setState({ userAnswers })
    }
    addToBasketVerkaufen(e, data, startAgain){
        let newData = [],
            redirectUrl = startAgain ? '/verkaufen' : '/verkaufen/warenkorb'

        if(data.some( item => item.productTypeId == 999)){
            let oldBasketData = this.props.basket.basketDataVerkaufen.filter( item => item.productTypeId != 999)
            newData = oldBasketData.concat(data)
        }
        else{
            newData = this.props.basket.basketDataVerkaufen.concat(data)
        }

        this.props.basketAction.changeBasketVerkaufenData(newData)

        if(!window.isMobile){
            let image = ''
            data.forEach( item => item.productTypeId != 999 ? image = item.image : false)
            this.props.basketAction.basketAddEffect(<AddToBasketEffect startPosition={ $(e.target).offset() }
                                                                       image={image}
                                                                       basketType="kaufen"/>)
            setTimeout( () => {
                $("#myModalResult").modal('hide')
                browserHistory.push(redirectUrl)
                this.props.basketAction.basketAddEffect( null )
            }, 2000)
        }
        else browserHistory.push(redirectUrl)
    }
    changeComment(e){
        let { value } = e.target,
            { userAnswers } = this.state
        userAnswers.comment = value
        let showResults = <ShowResults addToBasketVerkaufen={this.addToBasketVerkaufen}
                                       changeComment={this.changeComment}
                                       userAnswers={userAnswers}/>
        this.setState({ userAnswers, showResults })
    }
    render() {
        let {device} = this.props.params,
            { userAnswers } = this.state
        window.isMobile ? $('#tidio-chat #tidio-chat-iframe').hide() : $('#tidio-chat #tidio-chat-iframe').show()
        return (
            <div className="sellPage">
                <div className="sellPage-wrap">
                    <ModelsListVerkaufen4 currentDevice={device}
                                          showLastQuestion={this.props.showLastQuestion}
                                          params={this.props.params}
                                          userAnswers={userAnswers}
                                          showResults={this.showResults}
                                          setUserAnswers={this.setUserAnswers}
                                          changeUserAnswer={this.changeUserAnswer}
                                          deleteUserAnswer={this.deleteUserAnswer}
                                          changeUserAnswerMultiply={this.changeUserAnswerMultiply}
                                          changeUserAnswerCondition={this.changeUserAnswerCondition}
                                          changeModelPriceByCondition={this.changeModelPriceByCondition}
                                          changeUserAnswerDevice={this.changeUserAnswerDevice}
                                          changeUserAnswerFromSearchBar={this.changeUserAnswerFromSearchBar}
                                          changeUserAnswerModel={this.changeUserAnswerModel}/>
                </div>
                { this.state.showResults }
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        devices: state.shop.devicesSell,
        basket: state.basket,
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketAction: bindActionCreators(basketActions, dispatch),
        shopAction: bindActionCreators(shopActions, dispatch),
        userAction: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Verkaufen)