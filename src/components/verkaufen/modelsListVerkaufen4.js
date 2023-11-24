import React, {Component} from 'react'
import PropTypes from 'prop-types'
import api from '../../api/index'
import axios from 'axios'
import {browserHistory} from 'react-router'
import {Animated} from "react-animated-css"

import QuestionTemplateAssistant from './questionTemplateAssistant'
import QuestionTemplateClient from './questionTemplateClient'
import { getUrlStr } from './questionTemplateClient'
import AnswersField from './answersField/answersField'
import AsideVerkaufenPage from './asideVerkaufenPage'
import DetailedInfoCondition from './detailedInfoCondition'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import * as shopActions from '../../actions/shop'

export class ModelsListVerkaufen4 extends Component {
    constructor(props) {
        super(props)

        this.state = {
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
        }


        this.handleModelClick = this.handleModelClick.bind(this)
        this.handleBrandClick = this.handleBrandClick.bind(this)
        this.handleSubModelClick = this.handleSubModelClick.bind(this)
        this.handleDeviceClick = this.handleDeviceClick.bind(this)
        this.handleConditionClick = this.handleConditionClick.bind(this)
        this.handleClickEditAnswer = this.handleClickEditAnswer.bind(this)
        this.answeringToQuestion = this.answeringToQuestion.bind(this)
        this.selectAnswers = this.selectAnswers.bind(this)
        this.mapQuestionsCriterias = this.mapQuestionsCriterias.bind(this)
        this.mapQuestionsDamages = this.mapQuestionsDamages.bind(this)
        this.setResultsFromSearchBar = this.setResultsFromSearchBar.bind(this)
        this._generateQuestion = this._generateQuestion.bind(this)
        this._parseUrl = this._parseUrl.bind(this)
        this._setUserAnswersObject = this._setUserAnswersObject.bind(this)
        this.toggleInfoAboutCondition = this.toggleInfoAboutCondition.bind(this)
    }

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

            $('.answersField').css({paddingTop: '0'})
            document.querySelector('.answersField').classList.add('withSearch')

        }
    }

    componentDidMount(){
        document.querySelector('.answersField').classList.add('withSearch')
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

        /* fadein fadeout question box*/
        let update = false
        for( let key in this.state.showQuestion){
            let nowIndexActive = this.state.criteriasList.findIndex( item => item.active)
            let prevIndexActive = prevState.criteriasList.findIndex( item => item.active)
            if((this.state.showQuestion.criteriasList && nowIndexActive !== prevIndexActive )
                || this.state.showQuestion[key] != prevState.showQuestion[key]
                || this.state.showQuestion.device === true) update = true
        }
        if(update){
            setTimeout( () => $('.questionWrap:not(.visible)').css({ visibility: 'hidden' }), 500)

            if(this.state.conditionQuestion.show){
                setTimeout( () => $('.itemQuestion.condition').closest('.questionWrap').css({ visibility: 'visible' }), 505)
            }
            else{
                for( let key in this.state.showQuestion){

                    if(this.state.showQuestion[key]){
                        if(key === 'criteriasList'){
                            let currentCriteria = this.state.criteriasList.filter( criteria => criteria.active )
                            let selector = `.itemQuestion.${currentCriteria[0].name.toLowerCase().replace(/ /g, '')}`
                            setTimeout( () => $(selector).closest('.questionWrap').css({ visibility: 'visible' }), 505)
                        }
                        else{
                            let selector = `.itemQuestion.${key}`
                            setTimeout( () => $(selector).closest('.questionWrap').css({ visibility: 'visible' }), 505)
                        }

                    }
                }
            }
        }

        /*end fade in */

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
                    showQuestion = {...this.state.showQuestion}
                const COUNT_DEFAULT_ANSWERS = answerId.Submodel ? 6 : 5,
                      COUNT_DEFAULT_ANSWERS_DEFECT = answerId.Submodel ? 7 : 6
                userAnswers.Device = currentDevice
                selectedAnswers.Device = currentDevice
                showQuestion = { ...showQuestion, device: false, brand: true }
                if(answerId.Brand){
                    deviceId = answerId.Brand[0]
                    userAnswers.Brand = currentDevice[0].submodels.filter( item => item.id === +answerId.Brand[0])
                    selectedAnswers.Brand = currentDevice[0].submodels.filter( item => item.id === +answerId.Brand[0])

                    if(userAnswers.Brand[0].submodels) showQuestion = { ...showQuestion, brand: false, subModel: true }
                    else showQuestion = { ...showQuestion, brand: false, model: true }
                    //set submodels list
                    currentSubmodel = currentDevice[0].submodels.filter( item => item.id === +answerId.Brand[0])
                    if(currentSubmodel[0].submodels) this.setState({ subModels: currentSubmodel[0].submodels })
                }
                if(answerId.Submodel){
                    deviceId = answerId.Submodel[0]
                    showQuestion = { ...showQuestion, subModel: false, model: true }

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
                                show: true,
                                data: currentModel[0].conditions
                            }
                            showQuestion.model = false
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
                                    show: false,
                                    data: currentModel[0].conditions
                                }
                                if(answerId.Condition[0] == 3){
                                    let hideDisplayCriteriaQuestion = answerId.Defects && answerId.Defects.some( item => item == 8 || item == 10 || item ==11)

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
                                                        showQuestion.damagesList = false
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
                                                        this.props.showResults()
                                                        showQuestion.btnOpenResult = true
                                                        this.setState({ answerOnAllQuestion: true })
                                                    }
                                                    else if(answerId.Defects || resultDamageList.length === 0){
                                                        let index = Object.keys(userAnswers).length - countDefaultAnswers
                                                        resultCriteriasList[index].active = true
                                                        showQuestion.criteriasList = true
                                                    }
                                                    this.setState({ damagesList,
                                                                    criteriasList: resultCriteriasList,
                                                                    showPriceMsg,
                                                        loadPrevAnswers: false
                                                    })
                                                    !userAnswers.image ? userAnswers.image = '' : false
                                                    this.props.setUserAnswers(userAnswers)
                                                    this.props.changeModelPriceByCondition(resultCriterias.data.price)
                                                    this.setState({ showQuestion })
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
                                                this.props.showResults()
                                                showQuestion.btnOpenResult = true
                                                this.setState({ answerOnAllQuestion: true })
                                            }
                                            else{
                                                let index = Object.keys(userAnswers).length - COUNT_DEFAULT_ANSWERS
                                                responseData[index].active = true
                                                showQuestion.criteriasList = true
                                            }
                                            this.setState({ criteriasList: responseData, showPriceMsg, showQuestion })
                                            !userAnswers.image ? userAnswers.image = '' : false
                                            this.props.setUserAnswers(userAnswers)
                                            this.props.changeModelPriceByCondition(result.data.price)
                                        })
                                }
                            }
                        }

                        this.setState({ modelsList: data.data, conditionQuestion, showQuestion })
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
    _generateQuestion(id, name, ifLastQuestion){
        switch(id){
            case 3:
                return <span>{ifLastQuestion}How many {name} your model have?</span>
                break
            case 'checkIsNew':
                return <span>{ifLastQuestion}Is you device complety new(sealed in package)?</span>
                break
            default:
                return <span>{ifLastQuestion}What {name} your model have?</span>
        }
    }
    handleClickEditAnswer(type, values){
        let { conditionQuestion, answerOnAllQuestion, lastIndexOfCriteria, showSearchBar } = this.state,
            showQuestion = { ...this.state.showQuestion },
            criteriasList = [...this.state.criteriasList]
        criteriasList = criteriasList.map( item => ({...item}))
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
                break
            case 'Submodel' :
                showQuestion.device = false
                showQuestion.brand = false
                showQuestion.model = false
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = true
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                showSearchBar = true
                break
            case 'Model' :
                showQuestion.device = false
                showQuestion.brand = false
                showQuestion.model = true
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = false
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                showSearchBar = true
                break
            case 'Condition' :
                showQuestion.device = false
                showQuestion.brand = false
                showQuestion.model = false
                showQuestion.damagesList = false
                showQuestion.criteriasList = false
                showQuestion.subModel = false
                conditionQuestion.show = true
                showQuestion.btnOpenResult = false
                answerOnAllQuestion = false
                break
            case 'Defects':
                showQuestion.device = false
                showQuestion.brand = false
                showQuestion.model = false
                showQuestion.damagesList = true
                showQuestion.criteriasList = false
                showQuestion.subModel = false
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false
                break
            default:
                showQuestion.device = false
                showQuestion.brand = false
                showQuestion.model = false
                showQuestion.damagesList = false
                showQuestion.criteriasList = true
                showQuestion.subModel = false
                conditionQuestion.show = false
                showQuestion.btnOpenResult = false

                criteriasList.forEach( (item, i ) => {
                    if(values.length === 0){
                        if(item.name.toLowerCase() == type) item.active = true
                        else item.active = false
                    }
                    else{
                        if(values.every( value => item.values.some( itemValue => itemValue.id == value.id))){
                            item.active = true
                        }
                        else item.active = false
                    }
                })
                break
        }
        if(showSearchBar) document.querySelector('.answersField').classList.add('withSearch')
        this.setState({ showQuestion, conditionQuestion, criteriasList, answerOnAllQuestion, lastIndexOfCriteria, showSearchBar })
    }
    handleDeviceClick( type, item ){
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion }

        if(!selectedAnswers[type]) selectedAnswers[type] = [item]
        else selectedAnswers[type] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device') delete selectedAnswers[key]
        }
        //end clear

        if(selectedAnswers[type][0].submodels.length > 0){
            this.props.changeUserAnswerDevice( type, selectedAnswers[type])
            showQuestion.device = false
            showQuestion.brand = true
            this.setState({ brandSubModels: selectedAnswers[type][0].submodels,
                            lastIndexOfCriteria: 0,
                            showQuestion,
                            selectedAnswers })
        }
    }
    setResultsFromSearchBar(data){
        let showQuestion = { ...this.state.showQuestion },
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

        for( let key in showQuestion){
            showQuestion[key] = false
        }

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
                        selectedAnswers,
                        answerOnAllQuestion: false,
                        lastIndexOfCriteria: 0,
                        showSearchBar: false
        })
        document.querySelector('.answersField').classList.remove('withSearch')
        browserHistory.push(`/verkaufen/${getUrlStrSearch(selectedAnswers)}` )
        this.props.changeUserAnswerFromSearchBar(data)
    }
    handleBrandClick(type, item){
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion }

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
                    showQuestion.brand = false
                    showQuestion.model = true
                    this.setState({ showQuestion, selectedAnswers, lastIndexOfCriteria: 0 })
                })

        }
        else{
            this.props.changeUserAnswer( type, selectedAnswers[type])
            showQuestion.brand = false
            showQuestion.subModel = true
            this.setState({ subModels: selectedAnswers[type][0].submodels, showQuestion, selectedAnswers, lastIndexOfCriteria: 0 })
        }
    }
    handleSubModelClick(type, item){
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion }
        if(!selectedAnswers[type]) selectedAnswers[type] = [item]
        else selectedAnswers[type] = [item]

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
                showQuestion.subModel = false
                this.setState({ showQuestion, selectedAnswers, lastIndexOfCriteria: 0 })
            })
    }
    handleModelClick( type, item ){
        let { selectedAnswers } = this.state,
            showQuestion = { ...this.state.showQuestion }
        if(!selectedAnswers[type]) selectedAnswers[type] = [item]
        else selectedAnswers[type] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== 'Submodel' && key !== type) delete selectedAnswers[key]
        }
        //end clear

        this.props.changeUserAnswerModel( type, selectedAnswers[type] )
        showQuestion.model = false
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
                        selectedAnswers,
                        showSearchBar: false,
                        lastIndexOfCriteria: 0
        })
        document.querySelector('.answersField').classList.remove('withSearch')
    }
    handleConditionClick(name, item){
        let modelId = this.props.userAnswers.Model[0].id,
            { selectedAnswers } = this.state
        if(!selectedAnswers[name]) selectedAnswers[name] = [item]
        else selectedAnswers[name] = [item]

        //clear selectedAnswers object when edit answer
        for (let key in selectedAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== 'Submodel' && key !== 'Model' && key !== name) delete selectedAnswers[key]
        }
        //end clear

        let conditionId = selectedAnswers[name][0].id
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
                                                        data: result.data
                                                    },
                                        showPriceMsg: {},
                                        selectedAnswers,
                                        showQuestion: { ...this.state.showQuestion, damagesList: true},
                                        conditionQuestion: { ...this.state.conditionQuestion, show: false},
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
                                                    showQuestion: { ...this.state.showQuestion, criteriasList: true},
                                                    conditionQuestion: { ...this.state.conditionQuestion, show: false},
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
                                        showQuestion: { ...this.state.showQuestion, criteriasList: true},
                                        conditionQuestion: { ...this.state.conditionQuestion, show: false},
                                        lastIndexOfCriteria: 0
                                    })
                        this.props.changeModelPriceByCondition(result.data.price)
                    }
                })
        }

        this.props.changeUserAnswerCondition( name, selectedAnswers[name] )
    }
    selectAnswers(name, item, typeButton){
        let { selectedAnswers } = this.state
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
        this.setState({ selectedAnswers })
    }
    answeringToQuestion( type, item, index, criteriaId ){
        let { showPriceMsg, damagesList, selectedAnswers, lastIndexOfCriteria, answerOnAllQuestion } = this.state,
            showQuestion = { ...this.state.showQuestion},
            criteriasList = [...this.state.criteriasList]
        criteriasList = criteriasList.map( item => ({...item}))
        let nextIndex = index < lastIndexOfCriteria ? lastIndexOfCriteria : index,
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
            showQuestion.damagesList = false
            showQuestion.criteriasList = true
        }
        //end if

        //show additional price for criterias
        /*if( item!==null){
            item.valuePrice > 0 ? showPriceMsg[type] = {price: item.valuePrice} : showPriceMsg[type] = false

        }
        else{
            let total = 0
            if(type === 'Defects'){
                this.props.userAnswers[type].forEach( answer => {
                    total += +answer.price
                })
                total > 0 ? showPriceMsg[type] = { price: total } : showPriceMsg[type] = false
            }
            else{
                this.props.userAnswers[type].forEach( answer => {
                    total += +answer.valuePrice
                })
                total > 0 ? showPriceMsg[type] = { price: total } : showPriceMsg[type] = false
            }

        }*/
        //end
        if(answerOnAllQuestion){
            showQuestion.criteriasList = false
            showQuestion.btnOpenResult = true
        }
        else{
            if(nextIndex === 0){
                if(criteriasList.length > 0){
                    criteriasList[0].active = true
                    this.setState({ criteriasList })
                }
                else {
                    this.props.showResults()
                    showQuestion.btnOpenResult = true
                }

            }
            else if( nextIndex < criteriasList.length){
                criteriasList.forEach( item => item.active = false )
                criteriasList[nextIndex - 1].activeAnswersField = true
                criteriasList[nextIndex].active = true
            }
            else{
                criteriasList[nextIndex - 1].activeAnswersField = true
                showQuestion.criteriasList = false
                showQuestion.btnOpenResult = true
                this.props.showResults()
                nextIndex = 0
                this.setState({answerOnAllQuestion: true})
            }
        }

        if(item !== null) {
            if(!selectedAnswers[type]) selectedAnswers[type] = [item]
            else selectedAnswers[type] = [item]

            this.props.changeUserAnswer( type, selectedAnswers[type], criteriaId)
        }
        else {
            if(!selectedAnswers[type]) selectedAnswers[type] = []
            this.props.changeUserAnswer( type, selectedAnswers[type], criteriaId, nameOfDisplayCriteria)
        }

        this.setState({ showQuestion, criteriasList, showPriceMsg, damagesList,
                        selectedAnswers, lastIndexOfCriteria: nextIndex, answerOnAllQuestion })
    }
    mapQuestionsCriterias(){
        let { criteriasList, selectedAnswers } = this.state
        return criteriasList.map( (criteria, i ) => {
                let questionClass = criteria.active && this.state.showQuestion.criteriasList
                        ?`${criteria.name.toLowerCase().replace(/ /g, '')} itemQuestion active`
                        : `${criteria.name.toLowerCase().replace(/ /g, '')} itemQuestion`
                return(
                        <div key={i} className="questionWrap">
                            <div className="wrapCriterias">
                                <div className="assistantPhoto">
                                    <img src="/images/design/assistantForQuestion.svg" alt=""/>
                                </div>
                                <div className={questionClass}>
                                    <Animated animationIn="fadeIn"
                                              animationInDelay={507}
                                              animationOut="fadeOut"
                                              isVisible={criteria.active && this.state.showQuestion.criteriasList}>
                                        <QuestionTemplateAssistant question={criteria.question}
                                                                   name={criteria.name}/>
                                        <QuestionTemplateClient values={criteria.values}
                                                                typeButton={criteria.type}
                                                                toggleInfoAboutCondition={this.toggleInfoAboutCondition}
                                                                name={criteria.name.toLowerCase()}
                                                                criteriaId={criteria.id}
                                                                indexOfCriteria={i+1}
                                                                userAnswers={this.props.userAnswers}
                                                                selectedAnswers={selectedAnswers}
                                                                changeUserAnswerMultiply={this.selectAnswers}
                                                                handleClick={this.answeringToQuestion}/>
                                    </Animated>
                                </div>
                            </div>
                            {/*<div className="col-md-10">


                                    </div>*/}

                            {/*<div className="col-md-2">
                                        { this.state.showPriceMsg[criteria.name] &&
                                        <div className="infoPriceMsg">
                                            <p>Price progress</p>
                                            <spna>+{ this.state.showPriceMsg[criteria.name].price } {window.currencyValue}</spna>
                                        </div>
                                        }
                                    </div>*/}
                        </div>
                )
            }
        )
    }
    mapQuestionsDamages(){
        let { data } = this.state.damagesList,
            { selectedAnswers} = this.state,
            className = this.state.showQuestion.damagesList ? 'itemQuestion damagesList active' : 'itemQuestion damagesList'
        return(
            <div className="questionWrap">
                <div className="wrapCriterias">
                    <div className="assistantPhoto">
                        <img src="/images/design/assistantForQuestion.svg" alt=""/>
                    </div>
                    <div className={className} >
                        <Animated animationIn="fadeIn"
                                  animationInDelay={507}
                                  animationOut="fadeOut"
                                  isVisible={this.state.showQuestion.damagesList}>
                            <QuestionTemplateAssistant question='Was ist bei Ihrem Gerät mangelhaft und/oder defekt?'/>
                            <QuestionTemplateClient values={data}
                                                    typeButton={1}
                                                    name='Defects'
                                                    userAnswers={this.props.userAnswers}
                                                    selectedAnswers={selectedAnswers}
                                                    indexOfCriteria={this.state.lastIndexOfCriteria}
                                                    changeUserAnswerMultiply={this.selectAnswers}
                                                    handleClick={this.answeringToQuestion}/>
                        </Animated>
                    </div>
                </div>
                {/*<div className="col-md-10">

                </div>*/}
                {/*<div className="col-md-2">
                    { this.state.showPriceMsg['Defects'] &&
                    <div className="infoPriceMsg" style={{ background: 'red' }}>
                        <p>Price progress</p>
                        <spna> - { this.state.showPriceMsg['Defects'].price } {window.currencyValue}</spna>
                    </div>
                    }
                </div>*/}
            </div>
        )
    }
    toggleInfoAboutCondition(criteriaId = null){
        this.setState({ showInfoAboutCondition: {...this.state.showInfoAboutCondition,
                                                    criteriaId,
                                                    show: !this.state.showInfoAboutCondition.show} })
    }
    render() {
        let { conditionQuestion, showQuestion, selectedAnswers, criteriasList, showSearchBar } = this.state

        return (
            <div>
                <div className="part-left">
                    <AnswersField userAnswers={ this.props.userAnswers}
                                  setResults={this.setResultsFromSearchBar}
                                  showSearchBar={showSearchBar}
                                  handleClickEditAnswer={this.handleClickEditAnswer}
                                  showLastQuestion={this.props.showLastQuestion}
                                  showQuestion={showQuestion}
                                  criteriasList={this.state.criteriasList}
                                  conditionQuestion={conditionQuestion}/>
                    <div className="questionWrap visible" style={{ visibility: 'visible', zIndex: -1}}>
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                    </div>
                    <div className="questionWrap" style={{ visibility: 'visible'}}>
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                        <div className={ showQuestion.device ? "itemQuestion device active" : "itemQuestion device"}>
                            <Animated animationIn="fadeIn" animationInDelay={507} animationOut="fadeOut" isVisible={showQuestion.device}>
                                <QuestionTemplateAssistant question={<span>Welchen <span style={{ color: '#00cb94'}}> Gerätetyp</span> haben Sie?</span>}/>
                                <QuestionTemplateClient values={this.props.devices}
                                                        name={'Device'}
                                                        typeButton={3}
                                                        userAnswers={this.props.userAnswers}
                                                        selectedAnswers={selectedAnswers}
                                                        changeUserAnswerMultiply={this.selectAnswers}
                                                        handleClick={this.handleDeviceClick}/>
                            </Animated>

                        </div>
                    </div>
                    <div className="questionWrap">
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                        <div className={showQuestion.brand ? "itemQuestion brand active" : "itemQuestion brand"}>
                            <Animated animationIn="fadeIn" animationInDelay={507} isVisible={showQuestion.brand}>
                                <QuestionTemplateAssistant question={<span>Von welcher <span style={{ color: '#00cb94'}}> Marke</span> ist Ihr <span>{this.props.userAnswers.Device && this.props.userAnswers.Device[0].name}</span>
                                    ?</span>}/>
                                <QuestionTemplateClient values={this.state.brandSubModels}
                                                        name={'Brand'}
                                                        typeButton={3}
                                                        userAnswers={this.props.userAnswers}
                                                        selectedAnswers={selectedAnswers}
                                                        changeUserAnswerMultiply={this.selectAnswers}
                                                        handleClick={this.handleBrandClick}/>
                            </Animated>
                        </div>
                    </div>
                    <div className="questionWrap">
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                        <div className={showQuestion.subModel ? "itemQuestion subModel active" : "itemQuestion subModel"}>
                            <Animated animationIn="fadeIn" animationInDelay={507} isVisible={showQuestion.subModel}>
                                <QuestionTemplateAssistant question={<span>Welches <span style={{ color: '#00cb94'}}>Modell</span> haben Sie?</span>}/>
                                <QuestionTemplateClient values={this.state.subModels}
                                                        name={'Submodel'}
                                                        typeButton={3}
                                                        userAnswers={this.props.userAnswers}
                                                        selectedAnswers={selectedAnswers}
                                                        changeUserAnswerMultiply={this.selectAnswers}
                                                        handleClick={this.handleSubModelClick}/>
                            </Animated>
                        </div>
                    </div>
                    <div className="questionWrap">
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                        <div className={showQuestion.model ? "itemQuestion model active" : "itemQuestion model"}>
                            <Animated animationIn="fadeIn" animationInDelay={507} isVisible={showQuestion.model}>
                                <QuestionTemplateAssistant question={<span>Welches <span style={{ color: '#00cb94'}}>{this.props.userAnswers.Brand && this.props.userAnswers.Brand[0].name}</span> haben Sie?</span>}/>
                                <QuestionTemplateClient values={this.state.modelsList}
                                                        name={'Model'}
                                                        typeButton={3}
                                                        selectedAnswers={selectedAnswers}
                                                        userAnswers={this.props.userAnswers}
                                                        changeUserAnswerMultiply={this.selectAnswers}
                                                        handleClick={this.handleModelClick}/>
                            </Animated>
                        </div>
                    </div>
                    <div className="questionWrap">
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                        <div className={showQuestion.condition ? "itemQuestion condition active" : "itemQuestion condition"}>
                            <Animated animationIn="fadeIn" animationInDelay={507} isVisible={conditionQuestion.show}>
                                <QuestionTemplateAssistant question={<span>In welchem allgemeinen <span style={{ color: '#00cb94'}}>Zustand</span> ist Ihr Gerät?</span>}/>
                                <QuestionTemplateClient values={this.state.conditionQuestion.data}
                                                        name={'Condition'}
                                                        typeButton={3}
                                                        selectedAnswers={selectedAnswers}
                                                        userAnswers={this.props.userAnswers}
                                                        changeUserAnswerMultiply={this.selectAnswers}
                                                        toggleInfoAboutCondition={this.toggleInfoAboutCondition}
                                                        handleClick={this.handleConditionClick}/>
                            </Animated>
                        </div>
                    </div>
                    { this.mapQuestionsDamages()}
                    { this.mapQuestionsCriterias()}
                    <div className="questionWrap">
                        <div className="assistantPhoto">
                            <img src="/images/design/assistantForQuestion.svg" alt=""/>
                        </div>
                        <div className={showQuestion.btnOpenResult ? "itemQuestion btnOpenResult active" : "itemQuestion btnOpenResult"}>
                            <Animated animationIn="fadeIn" animationInDelay={507} isVisible={showQuestion.btnOpenResult}>
                                <QuestionTemplateAssistant question={<span>Vielen Dank für Ihre Angaben, hier Ihr <span style={{ color: '#00cb94'}}>Angebot:</span></span>}/>
                                <div className="userAnswers text-center">
                                    <button className="btn"
                                            onClick={ () => this.props.showResults(true)}>
                                        Angebot anzeigen<span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                    </button>
                                </div>
                            </Animated>
                        </div>
                    </div>
                </div>
                {!window.isMobile && <AsideVerkaufenPage userAnswers={this.props.userAnswers}
                                                         criteriasList={criteriasList}
                                                         handleClickEditAnswer={this.handleClickEditAnswer}/>
                }
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

ModelsListVerkaufen4.propTypes = {}
ModelsListVerkaufen4.defaultProps = {}

function mapStateToProps (state) {
    return {
        devices: state.shop.devicesSell,
        basket: state.basket
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketAction: bindActionCreators(basketActions, dispatch),
        shopAction: bindActionCreators(shopActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsListVerkaufen4)
 function getUrlStrSearch(answers){
    let str = ''
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