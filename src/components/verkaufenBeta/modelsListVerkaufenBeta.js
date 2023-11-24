import React, {Component} from 'react'

import api from '../../api/index'
import axios from 'axios'
import {browserHistory} from 'react-router'
import {Animated} from "react-animated-css"

import { getUrlStr } from '../verkaufen/questionTemplateClient'
import AnswersField from './answersField/answersField'
import AsideVerkaufenBetaPage from './asideVerkaufenBetaPage'
import DetailedInfoCondition from './detailedInfoCondition'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import * as shopActions from '../../actions/shop'

export class ModelsListVerkaufenBeta extends Component {
    _answerDelay = 1000;
    state = {
        isAnswerAnim: [],
        modelsList: [],
        brandSubModels: [],
        subModels: [],
        conditionQuestion: {
            show: false,
            data: []
        },
        criteriasList: [],
        damagesList: {
            show: false,
            data: []
        },
        showQuestion:{
            device: true,
            brand: false,
            model: false,
            damagesList: false,
            criteriasList: false,
            subModel: false,
            btnOpenResult: false
        },
        showAnswer:{
            device: false,
            brand: false,
            model: false,
            damagesList: false,
            criteriasList: false,
            condition:false,
            subModel: false,
            btnOpenResult: false
        },
        multiplyAnswers: {},
        showPriceMsg: {},
        selectedAnswers: {},
        lastIndexOfCriteria: 0,
        answerOnAllQuestion: false,
        showSearchBar: true,
        showInfoAboutCondition: {
            show: false,
            criteriaId: null
        }

    };

    componentWillReceiveProps(nextProps){
        if( nextProps.params && Object.keys(nextProps.params).length <= 0 || !nextProps.params.device ) {
            $('.questionWrap:not(.visible)').css({ visibility: 'hidden' })
            this.setState({
                            modelsList: [],
                            subModels: [],
                            brandSubModels: [],
                            criteriasList: [],
                            damagesList: {...this.state.damagesList, data: [], show: false},
                            showQuestion: {...this.state.showQuestion, device: true, brand: false, model: false,
                                            damagesList: false, criteriasList: false, subModel: false, btnOpenResult: false},
                            selectedAnswers: {},
                            conditionQuestion: {...this.state.conditionQuestion, show: false, data: []},
                            lastIndexOfCriteria: 0,
                            answerOnAllQuestion: false,
                            showSearchBar: true
            })

            $('.answersBetaField').css({paddingTop: '0'})
            document.querySelector('.answersBetaField').classList.add('withSearch')

        }
    }

    componentDidMount(){
        document.querySelector('.answersBetaField').classList.add('withSearch')
        if(this.props.currentDevice) this._setUserAnswersObject()
    }
    componentDidUpdate(prevProps, prevState){
        let startHeight = 0,
            height = 0,
            itemQuestionDiv = document.querySelector('.itemQuestion.active div.assistantQuestion'),
            itemQuestionAnswers = document.querySelector('.itemQuestion.active .userAnswers')
        if( itemQuestionAnswers && itemQuestionDiv) startHeight = itemQuestionDiv.scrollHeight + itemQuestionAnswers.scrollHeight
        if(!window.isMobile) height = window.innerHeight - $('.answersField').outerHeight() - $('header').outerHeight()
        else height = window.innerHeight - $('.answersField').outerHeight() - $('.header-mobile').outerHeight() - 45
        !window.isMobile && $('.questionWrap').css({ 'height': height + 'px'})
        if(startHeight > height){
            let newHeight = !window.isMobile ? height : height + 45
            $('.itemQuestion').css({   'height': newHeight +'px',
                                       'justify-content':'baseline',
                                       'overflow-y':'scroll'
                                   })
        }
        else{
            $('.itemQuestion').css({ 'overflow-y':'hidden' })
        }

        //check if one answer in values, autoselect answer
        let { criteriasList, selectedAnswers, lastIndexOfCriteria } = this.state
        criteriasList.forEach( (criteria, i ) => {
            if(i === lastIndexOfCriteria && criteria.active && criteria.values.length === 1 && !selectedAnswers[criteria.name.toLowerCase()]){
                this.answeringToQuestion( criteria.name.toLowerCase(), criteria.values[0], i + 1, criteria.id)
                browserHistory.push(`/verkaufen/${getUrlStr(criteria.values[0], criteria.name, criteria.type, selectedAnswers)}`)
            }
        })


    }

    _setUserAnswersObject(){
        //set userAnswers
        document.getElementById('spinner-box-load').style.display = 'block'
        let deviceId  = this.props.currentDevice.slice(this.props.currentDevice.lastIndexOf('-')+1)
        api.loadDevices('/api/devicesForPurchase')
            .then( result => {
                let currentDevice = result.data.data.filter( item => item.id == deviceId),
                    currentSubmodel = [],
                    conditionQuestion = { show: false, data: [] }
                let answerId = this._parseUrl(this.props.params),
                    userAnswers = {},
                    selectedAnswers = {},
                    showQuestion = {...this.state.showQuestion},
                    showAnswer = { ...this.state.showAnswer },
                    showSearchBar = { ...this.state.showSearchBar }
                const COUNT_DEFAULT_ANSWERS = answerId.Submodel ? 6 : 5,
                      COUNT_DEFAULT_ANSWERS_DEFECT = answerId.Submodel ? 7 : 6
                userAnswers.Device = currentDevice
                selectedAnswers.Device = currentDevice
                showQuestion = { ...showQuestion, device: false, brand: true }
                showAnswer = { ...showAnswer, device: true, brand: false }
                if(answerId.Brand){
                    deviceId = answerId.Brand[0]
                    userAnswers.Brand = currentDevice[0].submodels.filter( item => item.id === +answerId.Brand[0])
                    selectedAnswers.Brand = currentDevice[0].submodels.filter( item => item.id === +answerId.Brand[0])

                    if(userAnswers.Brand[0].submodels) showQuestion = { ...showQuestion, device: false, brand: true, subModel: true }
                    else showQuestion = { ...showQuestion, device: false, brand: true, model: true }
                    if(userAnswers.Brand[0].submodels) showAnswer = { ...showAnswer, device: true, brand: true, subModel: false }
                    else showAnswer = { ...showAnswer, device: true, brand: true, model: false }

                    //set submodels list
                    currentSubmodel = currentDevice[0].submodels.filter( item => item.id === +answerId.Brand[0])
                    if(currentSubmodel[0].submodels) this.setState({ subModels: currentSubmodel[0].submodels })
                }
                if(answerId.Submodel){
                    deviceId = answerId.Submodel[0]
                    showQuestion = { ...showQuestion, brand: true, subModel: true, model: true }
                    showAnswer = { ...showAnswer, brand: true, subModel: true, model: false }
                    userAnswers.Submodel = currentSubmodel[0].submodels.filter( item => item.id === +answerId.Submodel[0])
                    selectedAnswers.Submodel = currentSubmodel[0].submodels.filter( item => item.id === +answerId.Submodel[0])

                }
                document.getElementById('spinner-box-load').style.display = 'block'
                api.getModelsVerkaufen( deviceId )
                    .then( ({ data }) => {
                        setTimeout( () => document.getElementById('spinner-box-load').style.display = 'none', 2000)
                        if(answerId.Model){
                            let currentModel = data.data.filter( item => item.id === +answerId.Model[0]),
                                { showPriceMsg } = this.state
                            conditionQuestion = {
                                // show: true,
                                show: false,
                                data: currentModel[0].conditions
                            }
                            showQuestion.model = true
                            conditionQuestion.show = true
                            showAnswer.model = true
                            showSearchBar = false
                            // set userAnswers and selectedAnswers
                            userAnswers.image = currentModel[0].image
                            selectedAnswers.image = currentModel[0].image
                            userAnswers.Model = currentModel
                            selectedAnswers.Model = currentModel
                            if(answerId.Condition){

                                //set userAnswers Condition
                                currentModel[0].conditions.map( itemCondition => {
                                    if( itemCondition.id == answerId.Condition[0]) {
                                        userAnswers.Condition = [itemCondition]
                                        selectedAnswers.Condition = [itemCondition]
                                    }
                                })
                                conditionQuestion = {
                                    show: true,
                                    // show: false,
                                    data: currentModel[0].conditions
                                }
                                showAnswer.condition = true

                                if(answerId.Condition[0] == 3){
                                    let hideDisplayCriteriaQuestion = answerId.Defects && answerId.Defects.some( item => item == 8 || item == 10 || item ==11)

                                    if(answerId.Defects) {
                                        showAnswer.damagesList = true
                                    }
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.get(`/api/modelDamagesList?modelId=${answerId.Model[0]}`)
                                        .then( resultDamage => {
                                            let resultDamageList = resultDamage.data,
                                                countDefaultAnswers = resultDamageList.length > 0 ? COUNT_DEFAULT_ANSWERS_DEFECT : COUNT_DEFAULT_ANSWERS
                                            axios.get(`/api/criteriaList?modelId=${answerId.Model[0]}&conditionId=${answerId.Condition[0]}`)
                                                .then( resultCriterias => {
                                                    if(resultCriterias.data.discountPrice > 0) userAnswers.Model[0].discountPrice = resultCriterias.data.discountPrice
                                                    let showQuestion = {... showQuestion}
                                                    let resultCriteriasList = null

                                                    if(hideDisplayCriteriaQuestion){
                                                        let criteriaDisplay = resultCriterias.data.modelCriterias.filter( item => item.id == 2 )[0]
                                                        resultCriteriasList = resultCriterias.data.modelCriterias.filter( item => item.id != 2 )
                                                        this.setState({ tmpCriteriaDisplay: criteriaDisplay })
                                                    }
                                                    else resultCriteriasList = resultCriterias.data.modelCriterias

                                                    setTimeout( () => document.getElementById('spinner-box-load').style.display = 'none', 2000)
                                                    showQuestion.damagesList = resultDamageList.length > 0

                                                    //set userAnswers Defects
                                                    if(answerId.Defects){

                                                        userAnswers.Defects = []
                                                        selectedAnswers.Defects = []
                                                        let totalPrice = 0
                                                        resultDamageList.forEach( itemDamage => {
                                                            if( answerId.Defects.some( answerId => answerId == itemDamage.id)){
                                                                userAnswers.Defects.push(itemDamage)
                                                                selectedAnswers.Defects.push(itemDamage)
                                                                totalPrice += +itemDamage.price
                                                            }
                                                        })
                                                        totalPrice > 0 ? showPriceMsg.Defects = {price: totalPrice} : showPriceMsg['Defects'] = false
                                                    }

                                                    //set userAnswers criterias
                                                    for (let key in answerId){
                                                        resultCriteriasList.forEach( itemResponse => {
                                                            if(itemResponse.name.toLowerCase() === key){
                                                                itemResponse.activeAnswersField = true
                                                                userAnswers[key] = []
                                                                selectedAnswers[key] = []
                                                                let totalPrice = 0
                                                                itemResponse.values.forEach( itemResponseValue => {
                                                                    if( answerId[key].some( item => item == itemResponseValue.id)){
                                                                        if(itemResponse.id == 16){
                                                                            userAnswers.image = itemResponseValue.image
                                                                            selectedAnswers.image = itemResponseValue.image
                                                                        }
                                                                        userAnswers[key].push(itemResponseValue)
                                                                        selectedAnswers[key].push(itemResponseValue)
                                                                        totalPrice += +itemResponseValue.valuePrice
                                                                    }
                                                                })
                                                                totalPrice > 0 ? showPriceMsg[key] = {price: totalPrice} : showPriceMsg[key] = false
                                                            }
                                                        })
                                                    }

                                                    let damagesList = {
                                                        show: resultDamageList.length > 0,
                                                        data: resultDamageList.length >0 ? resultDamageList : []
                                                    }

                                                    if(Object.keys(userAnswers).length - countDefaultAnswers === resultCriteriasList.length) {
                                                        document.getElementById('spinner-box-load').style.display = 'none'
                                                        // this.props.showResults()
                                                        showQuestion.btnOpenResult = true
                                                        resultCriteriasList.forEach((item,i) => {
                                                            resultCriteriasList[i].active = true
                                                        })
                                                        this.setState({ answerOnAllQuestion: true, criteriasList: resultCriteriasList, })
                                                    }
                                                    else if(answerId.Defects || resultDamageList.length === 0){
                                                        let index = Object.keys(userAnswers).length - countDefaultAnswers
                                                        resultCriteriasList.forEach((item,i) => {
                                                            if(index>=i){
                                                                resultCriteriasList[i].active = true
                                                            }
                                                            else resultCriteriasList[i].active = false
                                                        })
                                                        // resultCriteriasList[index].active = true
                                                        showQuestion.criteriasList = true
                                                    }
                                                    this.setState({ damagesList,
                                                                    criteriasList: resultCriteriasList,
                                                                    showPriceMsg,
                                                        loadPrevAnswers: false
                                                    })
                                                    !userAnswers.image ? userAnswers.image = '' : false
                                                    this.props.setUserAnswers(userAnswers)
                                                    showQuestion.device = false
                                                    showQuestion.brand = true
                                                    showQuestion.model = true
                                                    showQuestion.damagesList = true
                                                    showQuestion.criteriasList = true
                                                    showQuestion.subModel = userAnswers.Submodel? true : false
                                                    conditionQuestion.show = true
                                                    showSearchBar = false
                                                    showAnswer.device = true
                                                    showAnswer.brand = true
                                                    showAnswer.subModel  = userAnswers.Submodel? true : false
                                                    showAnswer.model  = true
                                                    showAnswer.condition = true
                                                    showAnswer.criteriasList = true
                                                    // showAnswer.damagesList = false
                                                    this.props.changeModelPriceByCondition(resultCriterias.data.price)
                                                    this.setState({ showQuestion, showAnswer, showSearchBar })
                                                })
                                        })

                                }
                                else{
                                    document.getElementById('spinner-box-load').style.display = 'block'
                                    axios.get(`/api/criteriaList?modelId=${answerId.Model[0]}&conditionId=${answerId.Condition[0]}`)
                                        .then( result => {
                                            if(result.data.discountPrice > 0) userAnswers.Model[0].discountPrice = result.data.discountPrice
                                            setTimeout( () => document.getElementById('spinner-box-load').style.display = 'none', 2000)
                                            let responseData = result.data.modelCriterias
                                            let showQuestion = {... showQuestion}
                                            let showAnswer = {... showAnswer}
                                            let { damagesList }= this.state
                                            //set userAnswers criterias
                                            for (let key in answerId){
                                                responseData.forEach( itemResponse => {
                                                    if(itemResponse.name.toLowerCase() === key){
                                                        itemResponse.activeAnswersField = true
                                                        userAnswers[key] = []
                                                        selectedAnswers[key] = []
                                                        let totalPrice = 0
                                                        itemResponse.values.forEach( itemResponseValue => {
                                                            if( answerId[key].some( item => item == itemResponseValue.id)){
                                                                if(itemResponse.id == 16){
                                                                    userAnswers.image = itemResponseValue.image
                                                                    selectedAnswers.image = itemResponseValue.image
                                                                }
                                                                userAnswers[key].push(itemResponseValue)
                                                                selectedAnswers[key].push(itemResponseValue)
                                                                totalPrice += +itemResponseValue.valuePrice
                                                            }
                                                        })
                                                        totalPrice > 0 ? showPriceMsg[key] = {price: totalPrice} : showPriceMsg[key] = false
                                                    }
                                                })
                                            }

                                            if(Object.keys(userAnswers).length - COUNT_DEFAULT_ANSWERS === responseData.length) {
                                                document.getElementById('spinner-box-load').style.display = 'none'
                                                // this.props.showResults()
                                                showQuestion.device = false
                                                showQuestion.brand = true
                                                showQuestion.model = true
                                                showQuestion.subModel = userAnswers.Submodel? true : false
                                                conditionQuestion.show = true
                                                showSearchBar = false
                                                showQuestion.criteriasList = true
                                                showAnswer.criteriasList = true
                                                showAnswer.device = true
                                                showAnswer.brand = true
                                                showAnswer.subModel  = userAnswers.Submodel? true : false
                                                showAnswer.model  = true
                                                showAnswer.condition = true
                                                showAnswer.criteriasList = true
                                                showQuestion.damagesList = damagesList.show ? true : false
                                                showQuestion.btnOpenResult = true
                                                responseData.forEach((item,i) => {
                                                    responseData[i].active = true
                                                })
                                                this.setState({ answerOnAllQuestion: true, criteriasList: responseData, showPriceMsg, showQuestion, showAnswer, showSearchBar, conditionQuestion })
                                            }
                                            else{
                                                let index = Object.keys(userAnswers).length - COUNT_DEFAULT_ANSWERS

                                                responseData.forEach((item,i) => {
                                                    if(index>=i){
                                                        responseData[i].active = true
                                                    }
                                                    else responseData[i].active = false
                                                })

                                                showQuestion.device = false
                                                showQuestion.brand = true
                                                showQuestion.model = true
                                                showQuestion.subModel = userAnswers.Submodel? true : false
                                                conditionQuestion.show = true
                                                showSearchBar = false
                                                showQuestion.criteriasList = true
                                                showAnswer.criteriasList = true
                                                showAnswer.device = true
                                                showAnswer.brand = true
                                                showAnswer.subModel  = userAnswers.Submodel? true : false
                                                showAnswer.model  = true
                                                showAnswer.condition = true
                                                showAnswer.criteriasList = true
                                                showQuestion.damagesList = damagesList.show ? true : false
                                            }
                                            this.setState({ criteriasList: responseData, showPriceMsg, showQuestion, showAnswer, showSearchBar })
                                            !userAnswers.image ? userAnswers.image = '' : false
                                            userAnswers.Model[0].price = result.data.price
                                            this.setState({ userAnswers })

                                        })
                                }
                            }
                        }

                        this.setState({ modelsList: data.data, conditionQuestion, showQuestion, showAnswer, showSearchBar })
                    })
                this.props.setUserAnswers(userAnswers)
                this.setState({ selectedAnswers,
                                brandSubModels: currentDevice[0].submodels
                })
            })
    }
    _parseUrl(params){
        let userAnswersId = {}
        for(let key in params){
            if( key !== "device" && params[key] ){
                let name = '',
                    paramsArr = []
                switch(key){
                    case 'model':
                        name = 'Model'
                        break
                    case 'brand':
                        name = 'Brand'
                        break
                    case 'submodel':
                        name = 'Submodel'
                        break
                    case 'condition':
                        name = 'Condition'
                        break
                    case 'defects':
                        name = 'Defects'
                        break
                    default:
                        name = params[key].slice(0, params[key].lastIndexOf('-')).split('-').join(' ')
                }
                paramsArr = params[key].slice(params[key].lastIndexOf('-')+1).split(',')
                userAnswersId[name] = paramsArr
            }
        }
        return userAnswersId
    }
    handleClickEditAnswer = (type, values) => {
        this._answerDelay=0;
        let { conditionQuestion, answerOnAllQuestion, lastIndexOfCriteria, showSearchBar, damagesList
            } = this.state,
            userAnswers = this.props.userAnswers,
            showQuestion = { ...this.state.showQuestion },
            showAnswer = { ...this.state.showAnswer },
            criteriasList = [...this.state.criteriasList]
        criteriasList = criteriasList.map( item => ({...item}))
        if(this.props.handlerMobileEditAnswers) this.props.handlerMobileEditAnswers('close')();
        switch(type){
            case 'Device' :
                showQuestion.device = true
                showQuestion.brand = false
                showQuestion.model = false
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = false
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                showSearchBar = true
                showAnswer.device = false
                showAnswer.brand = false
                showAnswer.subModel  = false
                showAnswer.model = false
                showAnswer.condition = false
                showAnswer.criteriasList = false
                showAnswer.damagesList = false
                break
            case 'Brand' :
                showQuestion.device = false
                showQuestion.brand = true
                showQuestion.model = false
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = false
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                showSearchBar = true
                showAnswer.device = true
                showAnswer.brand = false
                showAnswer.subModel  = false
                showAnswer.model = false
                showAnswer.condition = false
                showAnswer.criteriasList = false
                showAnswer.damagesList = false
                break
            case 'Submodel' :
                showQuestion.device = false
                showQuestion.brand = true
                showQuestion.model = false
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = true
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                showSearchBar = true
                showAnswer.device = true
                showAnswer.brand = true
                showAnswer.subModel  = false
                showAnswer.model = false
                showAnswer.condition = false
                showAnswer.criteriasList = false
                showAnswer.damagesList = false
                break
            case 'Model' :
                showQuestion.device = false
                showQuestion.brand = true
                showQuestion.model = true
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = userAnswers.Submodel ? true : false
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                showSearchBar = true
                showAnswer.device = true
                showAnswer.brand = true
                showAnswer.subModel  = userAnswers.Submodel? true : false
                showAnswer.model = false
                showAnswer.condition = false
                showAnswer.criteriasList = false
                showAnswer.damagesList = false
                break
            case 'Condition' :
                showQuestion.device = false
                showQuestion.brand = true
                showQuestion.model = true
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = userAnswers.Submodel? true : false
                conditionQuestion.show = true
                showSearchBar = false
                showAnswer.device = true
                showAnswer.brand = true
                showAnswer.subModel  =  userAnswers.Submodel? true : false
                showAnswer.model  = true
                showAnswer.condition = false
                showAnswer.criteriasList = false
                showAnswer.damagesList = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                break
            case 'Defects':
                showQuestion.device = false
                showQuestion.brand = true
                showQuestion.model = true
                showQuestion.damagesList = true
                showQuestion.criteriasList = false
                showQuestion.subModel = userAnswers.Submodel? true : false
                conditionQuestion.show = true
                showSearchBar = false
                showQuestion.btnOpenResult = false
                showAnswer.device = true
                showAnswer.brand = true
                showAnswer.subModel  = userAnswers.Submodel? true : false
                showAnswer.model  = true
                showAnswer.condition = true
                showAnswer.criteriasList = true
                showAnswer.damagesList = false
                break
            default:
                showQuestion.device = false
                showQuestion.brand = true
                showQuestion.model = true
                showQuestion.damagesList = damagesList.show ? true : false
                showQuestion.criteriasList = true
                showQuestion.subModel = userAnswers.Submodel? true : false
                conditionQuestion.show = true
                showSearchBar = false
                showAnswer.device = true
                showAnswer.brand = true
                showAnswer.subModel  = userAnswers.Submodel? true : false
                showAnswer.model  = true
                showAnswer.condition = true
                showAnswer.criteriasList = true
                showAnswer.damagesList = true
                showQuestion.btnOpenResult = false


                let isCriteriasListItemActive = true;
                criteriasList.forEach( (item, i ) => {
                    if(values.length === 0){
                        if(item.name.toLowerCase() == type) item.active = true
                        else item.active = false
                    }
                    else{
                        if(isCriteriasListItemActive) {
                        item.active = true
                        }
                        else item.active = false
                        if(values.every( value => item.values.some( itemValue => itemValue.id == value.id))){
                            isCriteriasListItemActive = false
                        }
                    }
                })
                break
        }
        if(showSearchBar) document.querySelector('.answersBetaField').classList.add('withSearch')
        this.setState({ showQuestion, conditionQuestion, criteriasList, answerOnAllQuestion, lastIndexOfCriteria, showSearchBar, showAnswer })
    }
    handleDeviceClick = ( type, item ) => {
        this._answerDelay=1000;
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion },
            showAnswer = { ...this.state.showAnswer }

        selectedAnswers[type] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device') delete selectedAnswers[key]
        }
        //end clear

        if(selectedAnswers[type][0].submodels.length > 0){
            this.props.changeUserAnswerDevice( type, selectedAnswers[type])
            showQuestion.device = false
            showQuestion.brand = true
            showAnswer.device = true
            this.setState({ brandSubModels: selectedAnswers[type][0].submodels,
                            lastIndexOfCriteria: 0,
                            showQuestion,
                            showAnswer,
                            selectedAnswers })
        }
    }
    handleBrandClick = (type, item) => {
        this._answerDelay=1000;
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion },
            showAnswer = { ...this.state.showAnswer }

        if(!selectedAnswers[type]) selectedAnswers[type] = [item]
        else selectedAnswers[type] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device' && key !== type) delete selectedAnswers[key]
        }
        //end clear

        if( !selectedAnswers[type][0].submodels){
            this.props.changeUserAnswer( type, selectedAnswers[type])
            api.getModelsVerkaufen( selectedAnswers[type][0].id )
                .then( ({ data }) => {
                    this.setState({ modelsList: data.data })
                    showQuestion.model = true
                    showAnswer.device = true
                    showAnswer.brand = true
                    showAnswer.subModel = true
                    this.setState({ showQuestion, showAnswer, selectedAnswers, lastIndexOfCriteria: 0 })
                })
        }
        else{
            this.props.changeUserAnswer( type, selectedAnswers[type])
            showQuestion.subModel = true
            showAnswer.device = true
            showAnswer.brand = true
            this.setState({ subModels: selectedAnswers[type][0].submodels, showQuestion, showAnswer, selectedAnswers, lastIndexOfCriteria: 0 })
        }
    }
    handleSubModelClick = (type, item) => {
        this._answerDelay=1000;
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion },
            showAnswer = { ...this.state.showAnswer }

        selectedAnswers[type] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== type) delete selectedAnswers[key]
        }
        //end clear

        this.props.changeUserAnswer( type, selectedAnswers[type])
        api.getModelsVerkaufen( selectedAnswers[type][0].id )
            .then( ({ data }) => {
                this.setState({ modelsList: data.data })
                showQuestion.model = true
                showAnswer.device = true
                showAnswer.brand = true
                showAnswer.subModel = true
                this.setState({ showQuestion, showAnswer, selectedAnswers, lastIndexOfCriteria: 0 })
            })
    }
    handleModelClick = ( type, item ) =>{
        this._answerDelay=1000;
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion },
            showAnswer = { ...this.state.showAnswer }

        selectedAnswers[type] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== 'Submodel' && key !== type) delete selectedAnswers[key]
        }
        //end clear

        this.props.changeUserAnswerModel( type, selectedAnswers[type] )
        showAnswer.model = true
        this.setState({ conditionQuestion: {
                                                ...this.state.conditionQuestion,
                                                show: true,
                                                data: selectedAnswers[type][0].conditions
                                            },
                        damagesList: {
                                        ...this.state.damagesList,
                                        show: false,
                                        data: []
                                    },
                        criteriasList: [],
                        showPriceMsg: {},
                        showQuestion,
                        showAnswer,
                        selectedAnswers,
                        showSearchBar: false,
                        lastIndexOfCriteria: 0
        })
        document.querySelector('.answersBetaField').classList.remove('withSearch')
    }
    handleConditionClick = (name, item) => {
        this._answerDelay=1000;
        let modelId = this.props.userAnswers.Model[0].id,
            { selectedAnswers, isAnswerAnim } = this.state,
            showQuestion = { ...this.state.showQuestion },
            conditionQuestion = { ...this.state.conditionQuestion },
            showAnswer = { ...this.state.showAnswer }

        selectedAnswers[name] = [item]
        isAnswerAnim[name] = false
        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== 'Submodel' && key !== 'Model' && key !== name) delete selectedAnswers[key]
        }
        //end clear

        let conditionId = selectedAnswers[name][0].id

        showAnswer.condition = true
        conditionQuestion.show = true
        if(conditionId == 3){
            axios.get(`/api/modelDamagesList?modelId=${modelId}`)
                .then( result => {
                    if(result.data.length > 0){
                        axios.get(`/api/criteriaList?modelId=${modelId}&conditionId=${conditionId}`)
                            .then( result => {
                                this.setState({ criteriasList: result.data.modelCriterias })
                                this.props.changeModelPriceByCondition(result.data.price)
                            })
                        this.setState({ damagesList: {
                                        ...this.state.damagesList,
                                        show: true,
                                        data: result.data },
                                        showPriceMsg: {},
                                        selectedAnswers,
                                        isAnswerAnim,
                                        showQuestion: { ...this.state.showQuestion, damagesList: true},
                                        conditionQuestion,
                                        showAnswer,
                                        lastIndexOfCriteria: 0
                        })

                    }
                    else{
                        axios.get(`/api/criteriaList?modelId=${modelId}&conditionId=${conditionId}`)
                            .then( result => {
                                if(result.data.modelCriterias.length > 0){
                                    if(result.data.discountPrice > 0) this.props.userAnswers.Model[0].discountPrice = result.data.discountPrice
                                    let responseData = result.data.modelCriterias
                                    responseData[0].active = true
                                    this.setState({ criteriasList: responseData,
                                                    damagesList: {
                                                        ...this.state.damagesList,
                                                        show: false
                                                    },
                                                    showPriceMsg: {},
                                                    selectedAnswers,
                                                    isAnswerAnim,
                                                    showQuestion: { ...this.state.showQuestion, criteriasList: true},
                                                    conditionQuestion,
                                                    showAnswer,
                                                    lastIndexOfCriteria: 0
                                                })
                                    this.props.changeModelPriceByCondition(result.data.price)
                                }
                            })
                    }
                })

        }
        else{
            axios.get(`/api/criteriaList?modelId=${modelId}&conditionId=${conditionId}`)
                .then( result => {
                    if(result.data.modelCriterias.length > 0){
                        if(result.data.discountPrice > 0) this.props.userAnswers.Model[0].discountPrice = result.data.discountPrice
                        let responseData = result.data.modelCriterias
                        responseData[0].active = true
                        this.setState({ criteriasList: responseData,
                                        damagesList: {
                                            ...this.state.damagesList,
                                            show: false,
                                            data: []
                                        },
                                        showPriceMsg: {},
                                        selectedAnswers,
                                        isAnswerAnim,
                                        showQuestion: { ...this.state.showQuestion, criteriasList: true},
                                        showAnswer,
                                        lastIndexOfCriteria: 0
                                    })
                        this.props.changeModelPriceByCondition(result.data.price)
                    }
                })
        }

        this.props.changeUserAnswerCondition( name, selectedAnswers[name] )
    }
    setResultsFromSearchBar = (data) => {
        this._answerDelay=1000;

        let showQuestion = { ...this.state.showQuestion },
            userAnswers = this.props.userAnswers,
            showAnswer = { ...this.state.showAnswer },
            selectedAnswers = {}

        selectedAnswers.Device = [data.brand[0]]
        if(data.brand[0].submodels[0].submodels){
            selectedAnswers.Brand = [data.brand[0].submodels[0]]
            selectedAnswers.Submodel = [data.brand[0].submodels[0].submodels[0]]
            selectedAnswers.Model = [data.device]

            //set models list
            let brandSubModels = this.props.devices.filter( item => item.id == data.brand[0].id)[0].submodels,
                subModels = brandSubModels.filter( item => item.id === data.brand[0].submodels[0].id)[0].submodels
            api.getModelsVerkaufen( data.brand[0].submodels[0].submodels[0].id )
                .then( ({ data }) => {
                    this.setState({ brandSubModels, subModels, modelsList: data.data })
                })
        }
        else{
            selectedAnswers.Brand = [data.brand[0].submodels[0]]
            selectedAnswers.Model = [data.device]

            //set models list
            let brandSubModels = this.props.devices.filter( item => item.id == data.brand[0].id)[0].submodels
            api.getModelsVerkaufen( data.brand[0].submodels[0].id )
                .then( ({ data }) => {
                    this.setState({ brandSubModels, modelsList: data.data })
                })
        }

            userAnswers.Device = [data.brand[0]]
            if(data.brand[0].submodels[0].submodels){
                userAnswers.Brand = [data.brand[0].submodels[0]]
                userAnswers.Submodel = [data.brand[0].submodels[0].submodels[0]]
                userAnswers.Model = [data.device]

                //set models list
                let brandSubModels = this.props.devices.filter( item => item.id == data.brand[0].id)[0].submodels,
                    subModels = brandSubModels.filter( item => item.id === data.brand[0].submodels[0].id)[0].submodels
                api.getModelsVerkaufen( data.brand[0].submodels[0].submodels[0].id )
                    .then( ({ data }) => {
                        this.setState({ brandSubModels, subModels, modelsList: data.data })
                    })
            }
            else{
                userAnswers.Brand = [data.brand[0].submodels[0]]
                userAnswers.Model = [data.device]
                delete userAnswers.Submodel
                //set models list
                let brandSubModels = this.props.devices.filter( item => item.id == data.brand[0].id)[0].submodels
                api.getModelsVerkaufen( data.brand[0].submodels[0].id )
                    .then( ({ data }) => {
                        this.setState({ brandSubModels, modelsList: data.data })
                    })
            }

        for( let key in showQuestion){
            if(key == 'brand' || (key == 'subModel' && userAnswers.Submodel) || key == 'model') {
                showQuestion[key] = true
            }
            else {
                showQuestion[key] = false
            }
        }
        showAnswer.device = true
        showAnswer.brand = true
        showAnswer.subModel  = userAnswers.Submodel? true : false
        showAnswer.model  = true
        this.setState({ conditionQuestion: {
                ...this.state.conditionQuestion,
                show: true,
                data: data.device.conditions
            },
            damagesList: {
                ...this.state.damagesList,
                show: false,
                data: []
            },
            criteriasList: [],
            showPriceMsg: {},
            showQuestion,
            showAnswer,
            selectedAnswers,
            answerOnAllQuestion: false,
            lastIndexOfCriteria: 0,
            showSearchBar: false
        })
        document.querySelector('.answersBetaField').classList.remove('withSearch')
        browserHistory.push(`/verkaufen/${getUrlStrSearch(selectedAnswers)}` )
        this.props.changeUserAnswerFromSearchBar(data)
    }

    selectAnswers = (name, item, typeButton) => {
        this._answerDelay=0;
        let { selectedAnswers, isAnswerAnim } = this.state
        if(!selectedAnswers[name]) selectedAnswers[name] = []
        if(typeButton != 3){
            if(selectedAnswers[name].some( answer => answer.id == item.id)){
                selectedAnswers[name] = selectedAnswers[name].filter( answer => item.id != answer.id)
            }
            else selectedAnswers[name].push(item)
        }
        else{
            selectedAnswers[name] = []
            selectedAnswers[name].push(item)
        }
        isAnswerAnim[name] = false;
        this.setState({ selectedAnswers, isAnswerAnim })
    }
    answeringToQuestion = ( type, item, index, criteriaId ) => {
        this._answerDelay=1000;
        let { damagesList, selectedAnswers, lastIndexOfCriteria, answerOnAllQuestion, isAnswerAnim } = this.state,
            showQuestion = { ...this.state.showQuestion},
            showAnswer = {...this.state.showAnswer},
            criteriasList = [...this.state.criteriasList]
        criteriasList = criteriasList.map( item => ({...item}))
        let nextIndex =  index ? index : 0,
            nameOfDisplayCriteria = null
        //if answer on Damages question
        if(type === 'Defects'){
            if(selectedAnswers.Defects && selectedAnswers.Defects.some(item => item.id == 8 || item.id == 10 || item.id == 11)){
                let criteriaDisplay = criteriasList.filter(item => item.id == 2)[0]
                if(criteriaDisplay){
                    this.setState({ tmpCriteriaDisplay: criteriaDisplay })
                    nameOfDisplayCriteria = criteriaDisplay.name.toLowerCase()
                    delete selectedAnswers[nameOfDisplayCriteria]
                    criteriasList = criteriasList.filter(item => item.id != 2)
                    if(nextIndex > 1) --nextIndex
                }
            }
            else if(this.state.tmpCriteriaDisplay){
                criteriasList.push(this.state.tmpCriteriaDisplay)
                if(answerOnAllQuestion){
                    answerOnAllQuestion = false
                    nextIndex = criteriasList.length - 1
                }
            }
            showAnswer.damagesList = true
            showQuestion.criteriasList = true
        }
        //end if
        if(answerOnAllQuestion){
            showQuestion.btnOpenResult = true
        }
        else{
            if(nextIndex === 0){
                if(criteriasList.length > 0){

                    criteriasList.forEach((item, i ) => {
                        item.active = true
                        if(i){
                            item.active = false
                        }
                    })

                    this.setState({ criteriasList })
                }

                else {
                    // this.props.showResults()
                    showQuestion.btnOpenResult = true
                }
            }
            else if( nextIndex < criteriasList.length){
                criteriasList.forEach((item, i ) => {
                    if(i < index ){
                        item.active = true
                    }
                    else {
                        item.active = false
                    }
                })
                criteriasList[nextIndex - 1].activeAnswersField = true
                criteriasList[nextIndex].active = true
                this.setState({criteriasList})
            }

            else{
                criteriasList[nextIndex - 1].activeAnswersField = true
                // showQuestion.criteriasList = false
                showQuestion.btnOpenResult = true
                // this.props.showResults()
                nextIndex = 0
                this.setState({answerOnAllQuestion: true})
            }
        }

        if(item !== null) {
            selectedAnswers[type] = [item]
            this.props.changeUserAnswer( type, selectedAnswers[type], criteriaId)
        }
        else {
            if(!selectedAnswers[type]) selectedAnswers[type] = []
            this.props.changeUserAnswer( type, selectedAnswers[type], criteriaId, nameOfDisplayCriteria)
        }
        isAnswerAnim[type] = false;
        this.setState({ showQuestion, showAnswer, criteriasList, damagesList,
                        selectedAnswers, lastIndexOfCriteria: nextIndex, answerOnAllQuestion, isAnswerAnim })
    }
    toggleInfoAboutCondition = (criteriaId = null) => {
        this._answerDelay=0;
        this.setState({ showInfoAboutCondition: {...this.state.showInfoAboutCondition,
                                                    criteriaId,
                                                    show: !this.state.showInfoAboutCondition.show} })
    }

    render() {
        let { conditionQuestion, showQuestion, selectedAnswers, criteriasList, showSearchBar, brandSubModels, showAnswer, subModels, modelsList, isAnswerAnim } = this.state;
        let { devices, showLastQuestion, userAnswers } = this.props
        let handleClick
        if(showQuestion.brand && !showQuestion.subModel && !showQuestion.model  && !conditionQuestion.show && !showQuestion.criteriasList && !showQuestion.damagesList) {
            devices = brandSubModels;
            handleClick = this.handleBrandClick
        }
        else if(showQuestion.subModel && !showQuestion.model && !conditionQuestion.show && !showQuestion.criteriasList && !showQuestion.damagesList){
            devices = subModels;
            handleClick = this.handleSubModelClick
        }
        else if (showQuestion.model && !conditionQuestion.show && !showQuestion.criteriasList && !showQuestion.damagesList){
            devices = modelsList;
            handleClick = this.handleModelClick
        }
        else if (conditionQuestion.show && !showQuestion.criteriasList && !showQuestion.damagesList) {
            devices = this.state.conditionQuestion.data
            handleClick = this.handleConditionClick
        }
        else if (showQuestion.criteriasList || showQuestion.damagesList) {
            devices = this.state.damagesList.data
            handleClick = this.answeringToQuestion
        }
        else {
            devices = devices;
            handleClick = this.handleDeviceClick
        }
        return (
            <div>
                <div className="part-left">
                        <AnswersField devices={ devices }
                                      setResults={this.setResultsFromSearchBar}
                                      showSearchBar={showSearchBar}
                                      handleClickEditAnswer={this.handleClickEditAnswer}
                                      showQuestion={showQuestion}
                                      criteriasList={criteriasList}
                                      conditionQuestion={conditionQuestion}
                                      userAnswers={ userAnswers }
                                      selectedAnswers={ selectedAnswers }
                                      toggleInfoAboutCondition = {this.toggleInfoAboutCondition}
                                      handleClick={ handleClick }
                                      showAnswer = {showAnswer}
                                      selectAnswers = {this.selectAnswers}
                                      lastIndexOfCriteria = {this.props.lastIndexOfCriteria}
                                      user = {this.props.user}
                                      handleShipping = {this.props.handleShipping}
                                      addToBasketVerkaufen={this.props.addToBasketVerkaufen}
                                      answerDelay={this._answerDelay}
                                      isAnswerAnim = {isAnswerAnim}
                        />
                </div>
                <AsideVerkaufenBetaPage userAnswers={this.props.userAnswers}
                                        criteriasList={criteriasList}
                                        handleClickEditAnswer={this.handleClickEditAnswer}/>
                {this.state.showInfoAboutCondition.show &&
                    <DetailedInfoCondition deviceType={this.props.userAnswers.Device[0].id}
                                           brandType={this.props.userAnswers.Brand[0].id}
                                           criteriaId={this.state.showInfoAboutCondition.criteriaId}
                                           toggleInfoAboutCondition={this.toggleInfoAboutCondition}/>
                }
            </div>
        );
    }
}

ModelsListVerkaufenBeta.propTypes = {}
ModelsListVerkaufenBeta.defaultProps = {}

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
        shopAction: bindActionCreators(shopActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListVerkaufenBeta)
function getUrlStrSearch(answers){
    let str = '';
     //clone object userAnswers
     let userAnswers = { ...answers}
     for (let key in userAnswers){
         if(key !== 'image'){
             userAnswers[key] = [...userAnswers[key]]
             userAnswers[key].forEach( ( item, i ) => userAnswers[key][i] = {...item})
         }
     }
     for (let key in userAnswers){
         let nameParam = ''
         switch(key){
             case 'Model':
                 nameParam = userAnswers[key][0].name
                 break
             case 'Device':
                 nameParam = userAnswers[key][0].name
                 break
             case 'Brand':
                 nameParam = userAnswers[key][0].name
                 break
             case 'Submodel':
                 nameParam = 'sub-' + userAnswers[key][0].name
                 break
             default:
                 nameParam = key
         }
         if(key !== 'image' ){
             if(userAnswers[key].length > 0){
                 userAnswers[key].forEach( (item, i) => {
                     if(i === 0){
                         if(userAnswers[key].length === 1) {
                             str += `${nameParam.replace(/ /g, '-').toLowerCase()}-${item.id}/`
                         }
                         else str += `${nameParam.replace(/ /g, '-').toLowerCase()}-${item.id}`
                     }
                     else if( i === userAnswers[key].length -1) {
                         str += `,${item.id}/`
                     }
                     else str += `,${item.id}`
                 })
             }
         }
     }
     return str
 }