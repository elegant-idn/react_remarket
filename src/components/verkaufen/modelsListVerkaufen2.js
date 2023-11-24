import React, {Component} from 'react'
import PropTypes from 'prop-types'
import api from '../../api/index'
import axios from 'axios'

import QuestionTemplateAssistant from './questionTemplateAssistant'
import QuestionTemplateClient from './questionTemplateClient'

class ModelsListVerkaufen2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modelsList: [],
            isModelNew: null,
            criteriasList: [],
            multiplyAnswers: {},
            showPriceMsg: {}
        }


        this.handleModelClick = this.handleModelClick.bind(this)
        this.answeringToQuestion = this.answeringToQuestion.bind(this)
        this.selectAnswersInMultiplyQuestion = this.selectAnswersInMultiplyQuestion.bind(this)
        this.mapQuestions = this.mapQuestions.bind(this)
        this._generateQuestion = this._generateQuestion.bind(this)
        this._parseUrl = this._parseUrl.bind(this)

    }

    componentWillReceiveProps(nextProps){
        if( nextProps.currentDevice && nextProps.currentDevice !== this.props.currentDevice ){
            let deviceName  = nextProps.currentDevice
            deviceName = deviceName.split("-").join(' ')
            document.getElementById('spinner-box-load').style.display = 'block'
            api.getModelsVerkaufen( deviceName )
                .then( ({ data }) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({ modelsList: data.data, criteriasList: [] })
                    $(document, window).scrollTop($('#devicesList').offset().top + $('#devicesList').height() - 63)
                })

        }
    }
    componentWillMount(){
        //set userAnswers
        let deviceName  = this.props.currentDevice
        deviceName = deviceName.split("-").join(' ')
        let answerId = this._parseUrl(this.props.params),
            userAnswers = {}
        if(answerId.Model){
            api.getModelsVerkaufen( deviceName )
                .then( ({ data }) => {
                    let currentModel = data.data.filter( item => item.id === +answerId.Model[0]),
                        { showPriceMsg } = this.state
                    axios.get(`/api/criteriaList?modelId=${answerId.Model[0]}`) // get criteria list for current model
                        .then( ({ data}) => {
                            if(data.length === 0) {
                                this.props.showResults()
                                this.setState({ criteriasList: [], isModelNew: false, showPriceMsg: {} })
                            }
                            else{
                                let responseData = data
                                let capacityValue = responseData.filter( item => item.id === 3)
                                capacityValue[0].active = true
                                responseData = responseData.filter(item => item.id !== 3)
                                if(currentModel[0].newModel){
                                    responseData.unshift({
                                        id: 'checkIsNew',
                                        active: false,
                                        name: 'New Model',
                                        type: 3,
                                        values: [ { id: 1, name: 'Yes'}, { id: 2, name: 'No'} ]
                                    })
                                }
                                responseData.unshift(capacityValue[0])

                                // set userAnswers
                                userAnswers.image = currentModel.image || '/images/no_image.jpg'
                                userAnswers.Device = [{ name: this.props.currentDevice }]
                                userAnswers.Model = currentModel

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
                                this.setState({ criteriasList: responseData, isModelNew: false, showPriceMsg })
                                this.props.setUserAnswers(userAnswers)
                                if(Object.keys(userAnswers).length-3 === responseData.length) this.props.showResults()
                            }
                        })
                    this.setState({ modelsList: data.data })
                })

        }
    }
    componentDidMount(){
        let deviceName  = this.props.currentDevice
        deviceName = deviceName.split("-").join(' ')
        document.getElementById('spinner-box-load').style.display = 'block'
        api.getModelsVerkaufen( deviceName )
            .then( ({ data }) => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ modelsList: data.data })
            })
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
        axios.get(`/api/criteriaList?modelId=${model.id}`)
            .then( ({ data}) => {
                if(data.length === 0) {
                    this.props.showResults()
                    this.setState({ criteriasList: [], isModelNew: false, showPriceMsg: {} })
                }
                else{
                    let responseData = data
                    let capacityValue = responseData.filter( item => item.id === 3)
                    capacityValue[0].active = true
                    responseData = responseData.filter(item => item.id !== 3)
                    if(model.newModel){
                        responseData.unshift({
                            id: 'checkIsNew',
                            active: false,
                            name: 'New Model',
                            type: 3,
                            values: [ { id: 1, name: 'Yes'}, { id: 2, name: 'No'} ]
                        })
                    }
                    responseData.unshift(capacityValue[0])

                    this.setState({ criteriasList: responseData, isModelNew: false, showPriceMsg: {} })
                }
            })
        this.props.showResults()
        this.props.changeUserAnswerModel( type, model)
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
            this.props.userAnswers[type].forEach( answer => {
                total += +answer.valuePrice
            })
            total > 0 ? showPriceMsg[type] = { price: total } : showPriceMsg[type] = false
        }
        //end

        if( index < criteriasList.length){
            criteriasList[index].active = true
        }
        else{
            this.props.showResults()
        }

        this.setState({ criteriasList, showPriceMsg })

        if(item !== null) this.props.changeUserAnswer( type, item)
    }
    mapQuestions(){
        let { criteriasList } = this.state
        return criteriasList.map( (criteria, i ) => {
                if(criteria.active){
                    let question = this._generateQuestion(criteria.id, criteria.name)
                    if(criteriasList.length - 1 === i) question = this._generateQuestion(criteria.id, criteria.name, 'The final question. ')
                    return(
                        <div key={i} className="row">
                            <div className="col-md-10">
                                <QuestionTemplateAssistant question={question}/>
                                <QuestionTemplateClient values={criteria.values}
                                                        typeButton={criteria.type}
                                                        name={criteria.name}
                                                        indexOfCriteria={i+1}
                                                        userAnswers={this.props.userAnswers}
                                                        changeUserAnswerMultiply={this.selectAnswersInMultiplyQuestion}
                                                        handleClick={this.answeringToQuestion}/>
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

    render() {
        let deviceName = this.props.currentDevice.replace(/-/g, ' ')
        return (
            <div>
                <QuestionTemplateClient type="text"
                                        name="d"
                                        question={<span>Hello I would like to sell <span style={{ color: 'green'}}>{deviceName}</span>. Can you help me?</span>}
                                        userAnswers={this.props.userAnswers}/>
                <QuestionTemplateAssistant question={<span>Of course. Which model of <span style={{ color: 'green'}}>{deviceName}</span> you have?</span>}/>
                <QuestionTemplateClient values={this.state.modelsList}
                                        name={'Model'}
                                        typeButton={3}
                                        userAnswers={this.props.userAnswers}
                                        handleClick={this.handleModelClick}/>

                { this.mapQuestions()}
            </div>
        );
    }
}

ModelsListVerkaufen2.propTypes = {}
ModelsListVerkaufen2.defaultProps = {}

export default ModelsListVerkaufen2

