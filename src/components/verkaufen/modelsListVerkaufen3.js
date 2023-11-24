import React, {Component} from 'react'
import PropTypes from 'prop-types'
import api from '../../api/index'
import axios from 'axios'

import QuestionTemplateAssistant from './questionTemplateAssistant'
import QuestionTemplateClient from './questionTemplateClient'

class ModelsListVerkaufen3 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modelsList: [],
            conditionQuestion: {
                show: false,
                data: []
            },
            criteriasList: [],
            damagesList: {
                show: false,
                data: []
            },
            multiplyAnswers: {},
            showPriceMsg: {}
        }


        this.handleModelClick = this.handleModelClick.bind(this)
        this.handleConditionClick = this.handleConditionClick.bind(this)
        this.answeringToQuestion = this.answeringToQuestion.bind(this)
        this.selectAnswersInMultiplyQuestion = this.selectAnswersInMultiplyQuestion.bind(this)
        this.mapQuestionsCriterias = this.mapQuestionsCriterias.bind(this)
        this.mapQuestionsDamages = this.mapQuestionsDamages.bind(this)
        this._generateQuestion = this._generateQuestion.bind(this)
        this._parseUrl = this._parseUrl.bind(this)
        this._setUserAnswersObject = this._setUserAnswersObject.bind(this)

    }

    componentWillReceiveProps(nextProps){
        if( nextProps.currentDevice && nextProps.currentDevice !== this.props.currentDevice ){
            let deviceName  = nextProps.currentDevice
            deviceName = deviceName.split("-").join(' ')
            document.getElementById('spinner-box-load').style.display = 'block'
            api.getModelsVerkaufen( deviceName )
                .then( ({ data }) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({ modelsList: data.data,
                                    criteriasList: [],
                                    damagesList: { ...this.state.damagesList, show: false},
                                    conditionQuestion: { ...this.state.conditionQuestion, show: false}
                    })
                    $(document, window).scrollTop($('#devicesList').offset().top + $('#devicesList').height() - 63)
                })

        }
    }

    componentDidMount(){
        this._setUserAnswersObject()
        let deviceName  = this.props.currentDevice
        deviceName = deviceName.split("-").join(' ')
        document.getElementById('spinner-box-load').style.display = 'block'
        api.getModelsVerkaufen( deviceName )
            .then( ({ data }) => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ modelsList: data.data })
            })
    }
    _setUserAnswersObject(){
        //set userAnswers
        const COUNT_DEFAULT_ANSWERS = 4,
              COUNT_DEFAULT_ANSWERS_DEFECT = 5
        let deviceName  = this.props.currentDevice
        deviceName = deviceName.split("-").join(' ')
        let answerId = this._parseUrl(this.props.params),
            userAnswers = {}
        if(answerId.Model){
            api.getModelsVerkaufen( deviceName )
                .then( ({ data }) => {
                    let currentModel = data.data.filter( item => item.id === +answerId.Model[0]),
                        { showPriceMsg } = this.state
                    // set userAnswers
                    userAnswers.image = currentModel[0].image || '/images/no_image.jpg'
                    userAnswers.Device = [{ name: this.props.currentDevice }]
                    userAnswers.Model = currentModel
                    if(answerId.Condition){

                        //set userAnswers Condition
                        currentModel[0].conditions.map( itemCondition => {
                            if( itemCondition.id == answerId.Condition[0]) userAnswers.Condition = [itemCondition]
                        })

                        if(answerId.Condition[0] == 3){
                            document.getElementById('spinner-box-load').style.display = 'block'
                            axios.get(`/api/modelDamagesList?modelId=${answerId.Model[0]}`)
                                .then( resultDamage => {
                                    let resultDamageList = resultDamage.data

                                    axios.get(`/api/criteriaList?modelId=${answerId.Model[0]}&conditionId=${answerId.Condition[0]}`)
                                        .then( resultCriterias => {
                                            let resultCriteriasList = resultCriterias.data.modelCriterias
                                            document.getElementById('spinner-box-load').style.display = 'none'

                                            //set userAnswers Defects
                                            if(answerId.Defects){
                                                userAnswers.Defects = []
                                                let totalPrice = 0
                                                resultDamageList.forEach( itemDamage => {
                                                    if( answerId.Defects.some( answerId => answerId == itemDamage.id)){
                                                        userAnswers.Defects.push(itemDamage)
                                                        totalPrice += +itemDamage.price
                                                    }
                                                })
                                                totalPrice > 0 ? showPriceMsg.Defects = {price: totalPrice} : showPriceMsg['Defects'] = false
                                            }

                                            //set userAnswers criterias
                                            for (let key in answerId){
                                                resultCriteriasList.forEach( itemResponse => {
                                                    if(itemResponse.name === key){
                                                        itemResponse.active = true
                                                        userAnswers[key] = []
                                                        let totalPrice = 0
                                                        itemResponse.values.forEach( itemResponseValue => {
                                                            if( answerId[key].some( item => item == itemResponseValue.id)){
                                                                userAnswers[key].push(itemResponseValue)
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
                                            this.setState({ damagesList,
                                                            criteriasList: resultCriteriasList,
                                                            showPriceMsg
                                            })
                                            this.props.setUserAnswers(userAnswers)
                                            this.props.changeModelPriceByCondition(resultCriterias.data.price)
                                            if(Object.keys(userAnswers).length - COUNT_DEFAULT_ANSWERS_DEFECT === resultCriteriasList.length) this.props.showResults()
                                        })
                                })

                        }
                        else{
                            document.getElementById('spinner-box-load').style.display = 'block'
                            axios.get(`/api/criteriaList?modelId=${answerId.Model[0]}&conditionId=${answerId.Condition[0]}`)
                                .then( result => {
                                    document.getElementById('spinner-box-load').style.display = 'none'
                                    let responseData = result.data.modelCriterias
                                    //set userAnswers criterias
                                    for (let key in answerId){
                                        responseData.forEach( itemResponse => {
                                            if(itemResponse.name === key){
                                                itemResponse.active = true
                                                userAnswers[key] = []
                                                let totalPrice = 0
                                                itemResponse.values.forEach( itemResponseValue => {
                                                    if( answerId[key].some( item => item == itemResponseValue.id)){
                                                        userAnswers[key].push(itemResponseValue)
                                                        totalPrice += +itemResponseValue.valuePrice
                                                    }
                                                })
                                                totalPrice > 0 ? showPriceMsg[key] = {price: totalPrice} : showPriceMsg[key] = false
                                            }
                                        })
                                    }
                                    this.setState({ criteriasList: responseData, showPriceMsg })
                                    this.props.setUserAnswers(userAnswers)
                                    this.props.changeModelPriceByCondition(result.data.price)
                                    if(Object.keys(userAnswers).length - COUNT_DEFAULT_ANSWERS === responseData.length) this.props.showResults()
                                })
                        }
                    }

                    this.setState({ modelsList: data.data,
                                    conditionQuestion: {
                                        ...this.state.conditionQuestion,
                                        show: true,
                                        data: currentModel[0].conditions
                                    }
                    })
                    this.props.setUserAnswers(userAnswers)
                })

        }
    }
    _parseUrl(params){
        let userAnswersId = {}
        for(let key in params){
            if( key !== "device" && params[key] ){
                let name = params[key].slice(0, params[key].indexOf('=') ).replace(/-/g, ' '),
                    paramsArr = []
                paramsArr = params[key].slice(params[key].indexOf('=')+1).split(',')
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
    handleModelClick( type, model){
        this.props.changeUserAnswerModel( type, model)
        this.setState({ conditionQuestion: {
                                                ...this.state.conditionQuestion,
                                                show: true,
                                                data: model.conditions
                                           },
                        damagesList: {
                                            ...this.state.damagesList,
                                            show: false,
                                            data: []
                                        },
                        criteriasList: [],
                        showPriceMsg: {}
        })
    }
    handleConditionClick(name, item){
        let modelId = this.props.userAnswers.Model[0].id,
            conditionId = item.id
        if(conditionId === 3){
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.get(`/api/modelDamagesList?modelId=${modelId}`)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    if(result.data.length > 0){
                        this.setState({ damagesList: {
                                                        ...this.state.damagesList,
                                                        show: true,
                                                        data: result.data
                                                    },
                                        showPriceMsg: {}
                        })
                    }
                })
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.get(`/api/criteriaList?modelId=${modelId}&conditionId=${conditionId}`)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({ criteriasList: result.data.modelCriterias })
                    this.props.changeModelPriceByCondition(result.data.price)
                })
        }
        else{
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.get(`/api/criteriaList?modelId=${modelId}&conditionId=${conditionId}`)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    let responseData = result.data.modelCriterias
                    responseData[0].active = true
                    this.setState({ criteriasList: responseData,
                                    damagesList: {
                                                        ...this.state.damagesList,
                                                        show: false,
                                                        data: []
                                                    },
                                    showPriceMsg: {}
                    })
                    this.props.changeModelPriceByCondition(result.data.price)
                })
        }
        this.props.changeUserAnswerCondition( name, item )
    }
    selectAnswersInMultiplyQuestion(name, item){
        this.props.changeUserAnswerMultiply( name, item )
    }
    answeringToQuestion( type, item, index ){
        let { criteriasList, showPriceMsg } = this.state

        //show additional price for criterias
        if( item!==null){
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

        }
        //end
        if(index === 0){
            let { criteriasList } = this.state
            if(criteriasList.length > 0){
                criteriasList[0].active = true
                this.setState({ criteriasList })
            }
            else this.props.showResults()

        }
        else if( index < criteriasList.length){
            criteriasList[index].active = true
        }
        else{
            this.props.showResults()
        }

        this.setState({ criteriasList, showPriceMsg })

        if(item !== null) this.props.changeUserAnswer( type, item)
    }
    mapQuestionsCriterias(){
        let { criteriasList } = this.state
        return criteriasList.map( (criteria, i ) => {
                if(criteria.active){
                    let question = this._generateQuestion(criteria.id, criteria.name)
                    if(criteriasList.length - 1 === i) question = this._generateQuestion(criteria.id, criteria.name, 'The final question. ')
                    return(
                        <div key={i} className="row">
                            <div className="col-md-10">
                                <div>
                                    <div className="col-sm-3">
                                        <img src="/images/design/assistantForQuestion.png" alt=""/>
                                    </div>
                                    <div className="col-sm-9">
                                        <QuestionTemplateAssistant question={criteria.question}/>
                                        <QuestionTemplateClient values={criteria.values}
                                                                typeButton={criteria.type}
                                                                name={criteria.name}
                                                                indexOfCriteria={i+1}
                                                                userAnswers={this.props.userAnswers}
                                                                changeUserAnswerMultiply={this.selectAnswersInMultiplyQuestion}
                                                                handleClick={this.answeringToQuestion}/>
                                    </div>
                                </div>

                            </div>

                            <div className="col-md-2">
                                { this.state.showPriceMsg[criteria.name] &&
                                <div className="infoPriceMsg">
                                    <p>Price progress</p>
                                    <spna>+{ this.state.showPriceMsg[criteria.name].price } CHF</spna>
                                </div>
                                }
                            </div>
                        </div>
                    )
                }
            }
        )
    }
    mapQuestionsDamages(){
        let { data } = this.state.damagesList
            return(
                <div className="row">
                    <div className="col-md-10">
                        <div>
                            <div className="col-sm-3">
                                <img src="/images/design/assistantForQuestion.png" alt=""/>
                            </div>
                            <div className="col-sm-9">
                                <QuestionTemplateAssistant question='Damages List'/>
                                <QuestionTemplateClient values={data}
                                                        typeButton={1}
                                                        name='Defects'
                                                        userAnswers={this.props.userAnswers}
                                                        indexOfCriteria={0}
                                                        changeUserAnswerMultiply={this.selectAnswersInMultiplyQuestion}
                                                        handleClick={this.answeringToQuestion}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        { this.state.showPriceMsg['Defects'] &&
                        <div className="infoPriceMsg" style={{ background: 'red' }}>
                            <p>Price progress</p>
                            <spna> - { this.state.showPriceMsg['Defects'].price } CHF</spna>
                        </div>
                        }
                    </div>
                </div>
            )
    }

    render() {
        let deviceName = this.props.currentDevice.replace(/-/g, ' ')
        return (
            <div>
                {/*<QuestionTemplateClient type="text"
                                        name="d"
                                        question={<span>Hello I would like to sell <span style={{ color: 'green'}}>{deviceName}</span>. Can you help me?</span>}
                                        userAnswers={this.props.userAnswers}/>*/}
                <div>
                    <div className="col-sm-3">
                        <img src="/images/design/assistantForQuestion.png" alt=""/>
                    </div>
                    <div className="col-sm-9">
                        <QuestionTemplateAssistant question={<span>Which model of <span style={{ color: 'green'}}>{deviceName}</span> you have?</span>}/>
                        <QuestionTemplateClient values={this.state.modelsList}
                                                name={'Model'}
                                                typeButton={3}
                                                userAnswers={this.props.userAnswers}
                                                handleClick={this.handleModelClick}/>
                    </div>
                </div>
                { this.state.conditionQuestion.show &&
                                                        <div>
                                                            <div className="col-sm-3">
                                                                <img src="/images/design/assistantForQuestion.png" alt=""/>
                                                            </div>
                                                            <div className="col-sm-9">
                                                                <QuestionTemplateAssistant question={<span>In which general condition is the device?</span>}/>
                                                                <QuestionTemplateClient values={this.state.conditionQuestion.data}
                                                                                        name={'Condition'}
                                                                                        typeButton={3}
                                                                                        userAnswers={this.props.userAnswers}
                                                                                        handleClick={this.handleConditionClick}/>
                                                            </div>
                                                        </div>

                }
                { this.state.damagesList.show && this.mapQuestionsDamages()}
                { this.mapQuestionsCriterias()}
            </div>
        );
    }
}

ModelsListVerkaufen3.propTypes = {}
ModelsListVerkaufen3.defaultProps = {}

export default ModelsListVerkaufen3