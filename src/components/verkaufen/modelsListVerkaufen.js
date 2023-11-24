import React, {Component} from 'react'
import PropTypes from 'prop-types'
import api from '../../api/index'


class ModelsListVerkaufen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modelsList: [],
            userAnswers: { model: {}},
            showQuestionList: {
                capacity: false,
                checkIsNew: false,
                condition: false,
                ZustandDisplay: false,
                result: false
            }
        }

        this.mapModelsList = this.mapModelsList.bind(this)
        this.chooseModel = this.chooseModel.bind(this)
        this.chooseCapacity = this.chooseCapacity.bind(this)
        this.chooseIsNew = this.chooseIsNew.bind(this)
        this.chooseCondition = this.chooseCondition.bind(this)
        this.chooseZustandDisplay = this.chooseZustandDisplay.bind(this)
        this.mapListOfValuesResult = this.mapListOfValuesResult.bind(this)

    }

    componentWillReceiveProps(nextProps){
        if( nextProps.params.device && nextProps.params.device !== this.props.params.device ){
            let deviceName  = nextProps.params.device
            deviceName = deviceName.split("-").join(' ')
            document.getElementById('spinner-box-load').style.display = 'block'
            api.getModelsVerkaufen( deviceName )
                .then( ({ data }) => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({ modelsList: data.data })
                    $(document, window).scrollTop($('#devicesList').offset().top + $('#devicesList').height() - 63)
                })

        }
    }
    componentDidMount(){
        let deviceName  = this.props.params.device
        deviceName = deviceName.split("-").join(' ')
        document.getElementById('spinner-box-load').style.display = 'block'
        api.getModelsVerkaufen( deviceName )
            .then( ({ data }) => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ modelsList: data.data })
                $(document, window).scrollTop(66666666)
            })
    }

    chooseModel(e){
        let { showQuestionList, userAnswers} = this.state
        userAnswers.model.name = e.currentTarget.getAttribute('data-modelName')
        userAnswers.model.image = e.currentTarget.getAttribute('data-modelImg')
        showQuestionList.capacity = true
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        this.setState({ showQuestionList, userAnswers })
    }
    chooseCapacity(e){
        let { showQuestionList, userAnswers} = this.state
        userAnswers.Capacity = e.target.value
        showQuestionList.checkIsNew = true
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        this.setState({ showQuestionList, userAnswers })
    }
    chooseIsNew(e){
        let { showQuestionList, userAnswers} = this.state,
            { value} = e.target
        if(value === "Yes"){
            showQuestionList.ZustandDisplay = true
            showQuestionList.condition = false
            delete userAnswers.Condition
        }
        else{
            showQuestionList.condition = true
        }

        userAnswers.isNew = value
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        this.setState({ showQuestionList, userAnswers })
    }
    chooseCondition(e){
        let { showQuestionList, userAnswers} = this.state
        userAnswers.Condition = e.target.value
        showQuestionList.ZustandDisplay = true
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        this.setState({ showQuestionList, userAnswers })
    }
    chooseZustandDisplay(e){
        let { showQuestionList, userAnswers} = this.state
        userAnswers.ZustandDisplay = e.target.value
        showQuestionList.result = true
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        this.setState({ showQuestionList, userAnswers })
    }


    mapListOfValuesResult(){
        let { userAnswers} = this.state,
            arrayOfLi = []
        for(let key in userAnswers){

            if(key !== 'model' && key !== 'isNew' ){
                arrayOfLi.push(<li key={key}>{key}: {userAnswers[key]}</li>)
            }
        }
        return arrayOfLi
    }
    mapModelsList( model, i ){
        return(
            <div  className="row"
                  onClick={this.chooseModel}
                  data-modelName={model.name}
                  data-modelImg={model.image || '/images/model/iphone.png' }
                  key={i}>
                <span className="image"><img src={ model.image || '/images/model/iphone.png' } /></span>
                <span className="title">{ model.name }</span>
            </div>
        )
    }

    render() {
        let { showQuestionList, userAnswers } = this.state
        return (
            <div>
                <h2>Modell auswählen</h2>
                <div className="model" id="modelList">
                    { this.state.modelsList.map( this.mapModelsList) }
                    <div className="cb"></div>
                </div>
                <div className="line"></div>
                { showQuestionList.capacity &&
                                                <div className="questionWrap capacity">
                                                    <h4>How many capacity does the device have ?</h4>
                                                    {capacity.map( (item, i ) => {
                                                            return(
                                                                <label htmlFor={'capacity'+item} key={i} onChange={this.chooseCapacity}>
                                                                    <input id={'capacity'+item} type="radio" name="capacity" value={item}/>{item}
                                                                </label>
                                                            )
                                                        })
                                                    }
                                                </div>
                }
                {
                    showQuestionList.checkIsNew &&
                                                    <div className="questionWrap checkIsNew">
                                                        <h4>Is your device complety new?</h4>
                                                        <div>
                                                            <label htmlFor={'isNewYes'} onChange={this.chooseIsNew}>
                                                                <input id={'isNewYes'} type="radio" name="isNew" value='Yes'/>Yes
                                                            </label>
                                                            <label htmlFor={'isNewNo'} onChange={this.chooseIsNew}>
                                                            <input id={'isNewNo'} type="radio" name="isNew" value='No'/>No
                                                        </label>
                                                        </div>
                                                    </div>
                }
                {
                    showQuestionList.condition &&
                                                    <div className="questionWrap condition">
                                                        <h4>Choose condition</h4>
                                                        {condition.map( (item, i ) => {
                                                            return(
                                                                <label htmlFor={'condition'+item} key={i} onChange={this.chooseCondition}>
                                                                    <input id={'condition'+item} type="radio" name="condition" value={item}/>{item}
                                                                </label>
                                                            )
                                                        })
                                                        }
                                                    </div>
                }

                { showQuestionList.ZustandDisplay &&
                                                        <div className="questionWrap ZustandDisplay">
                                                            <h4>Choose Zustand Display</h4>
                                                            {ZustandDisplay.map( (item, i ) => {
                                                                return(
                                                                    <label htmlFor={'ZustandDisplay'+item} key={i} onChange={this.chooseZustandDisplay}>
                                                                        <input id={'ZustandDisplay'+item} type="radio" name="ZustandDisplay" value={item}/>{item}
                                                                    </label>
                                                                )
                                                            })
                                                            }
                                                        </div>
                }
                { showQuestionList.result &&
                                                <div className="questionWrap">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <p>{userAnswers.model.name}</p>
                                                            <img src={userAnswers.model.image} alt=""/>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <p>Your price</p>
                                                            <p>123 CHF</p>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <ol>
                                                                {this.mapListOfValuesResult()}
                                                            </ol>
                                                        </div>
                                                    </div>
                                                    <div className="row text-center ">
                                                        <button>SELL NOW</button>
                                                    </div>
                                                </div>
                }
            </div>
        )
    }
}

ModelsListVerkaufen.propTypes = {}
ModelsListVerkaufen.defaultProps = {}

export default ModelsListVerkaufen

const capacity = [ '16GB', '8GB', '32GB']
const condition = [ 'Neu in OVP', 'Neu mit Folie', 'Leichte Gebrauchsspuren', 'Starke Gebrauchsspuren']
const ZustandDisplay =  [ 'Sichtbare Gebrauchsspuren', 'Keine Gebrauchsspuren', 'Spürbare Gebrauchsspuren']
