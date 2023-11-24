import React, {Component} from 'react'
import PropTypes from 'prop-types'

import TemplateAssistant from './templateAssistant'
import TemplateClient from './templateClient'
import SearchBar from "./searchBar";

class AnswersField extends Component {
    constructor(props) {
        super(props)

        this.state = {
            animate: false
        }

        this.mapQuestionsCriterias = this.mapQuestionsCriterias.bind(this)
        this.mapQuestionsDamages = this.mapQuestionsDamages.bind(this)
        this._animateAnswersField = this._animateAnswersField.bind(this)
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.userAnswers !== this.props.userAnswers ) {
            this.setState({animate: true})
        }
        else this.setState({animate: false})
    }
    componentDidUpdate(){
        if(Object.keys(this.props.userAnswers).length > 0 && this.state.animate && !this.props.showLastQuestion) this._animateAnswersField()
    }
    _animateAnswersField(){
        $('.answersField').stop()

        let bottomPadding = $('.answersField').hasClass('withSearch') ? 80 : 30,
            answerFieldHeight = $('.answersField').outerHeight() - bottomPadding,
            sumHeight = 0,
            higherAnswer = 0
        $('.answersField .itemAnswer').each(function () {
            sumHeight += $(this).outerHeight() + 15
            if($(this).outerHeight() > higherAnswer) higherAnswer = $(this).outerHeight() + 15
        })
        if(sumHeight - higherAnswer*2 > answerFieldHeight){
            setTimeout( () => $('.answersField').css({ paddingTop: '30px'}), 1501)
        }
        else $('.answersField').css({paddingTop: answerFieldHeight - higherAnswer + 'px'})

        $('.answersField').animate({scrollTop: $('.answersField').prop("scrollHeight")}, 1500);
        $('.itemAnswer').first().css({ transform: 'translateY(0)'})
    }
    mapQuestionsCriterias(){
        let { criteriasList } = this.props
        return criteriasList.map( (criteria, i ) => {
                if(criteria.activeAnswersField && this.props.userAnswers[criteria.name.toLowerCase()] ){
                    return(
                        <div key={i} className="row itemAnswer">
                            <TemplateAssistant question={criteria.question}/>
                            <TemplateClient name={criteria.name.toLowerCase()}
                                            criteriaId={criteria.id}
                                            handleClickEditAnswer={this.props.handleClickEditAnswer}
                                            userAnswers={this.props.userAnswers}/>
                        </div>
                    )
                }
            }
        )
    }
    mapQuestionsDamages(){
        return(
            <div className="row itemAnswer">
                <TemplateAssistant question={'Was ist bei Ihrem Gerät mangelhaft und/oder defekt?'}/>
                <TemplateClient name={"Defects"}
                                handleClickEditAnswer={this.props.handleClickEditAnswer}
                                userAnswers={this.props.userAnswers}/>
            </div>
        )
    }
    render() {
        return (
            <div className="col-md-12">
                <div className="answersField">
                    { Object.keys(this.props.userAnswers).length <= 0 &&
                    <div className="image">
                        <img src="/images/design/no-result-answersField.svg" alt=""/>
                        <p>Keine Angaben bis jetzt</p>
                    </div>
                    }
                    {this.props.showSearchBar && <SearchBar showButton={true} setResults={this.props.setResults}/>}
                    <div>
                        { this.props.userAnswers.Device &&
                        <div className="row itemAnswer">
                            <TemplateAssistant question={<span>Welchen Gerätetyp haben Sie?</span>}/>
                            <TemplateClient name={'Device'}
                                            handleClickEditAnswer={this.props.handleClickEditAnswer}
                                            userAnswers={this.props.userAnswers}/>
                        </div>
                        }
                        { this.props.userAnswers.Brand &&
                        <div className="row itemAnswer">
                            <TemplateAssistant question={<span>Von welcher Marke ist Ihr {this.props.userAnswers.Device[0].name}?</span>}/>
                            <TemplateClient name={'Brand'}
                                            handleClickEditAnswer={this.props.handleClickEditAnswer}
                                            userAnswers={this.props.userAnswers}/>
                        </div>
                        }
                        { this.props.userAnswers.Submodel &&
                        <div className="row itemAnswer">
                            <TemplateAssistant question={<span>Welches {this.props.userAnswers.Brand[0].name} Untermodell haben Sie?</span>}/>
                            <TemplateClient name={'Submodel'}
                                            handleClickEditAnswer={this.props.handleClickEditAnswer}
                                            userAnswers={this.props.userAnswers}/>
                        </div>
                        }
                        { this.props.userAnswers.Model &&
                        <div className="row itemAnswer">
                            <TemplateAssistant question={<span>Welches {this.props.userAnswers.Brand[0].name} Modell haben Sie?</span>}/>
                            <TemplateClient name={'Model'}
                                            handleClickEditAnswer={this.props.handleClickEditAnswer}
                                            userAnswers={this.props.userAnswers}/>
                        </div>
                        }
                        { this.props.userAnswers.Condition &&
                        <div className="row itemAnswer">
                            <TemplateAssistant question={<span>In welchem allgemeinen Zustand ist Ihr Gerät?</span>}/>
                            <TemplateClient name={'Condition'}
                                            handleClickEditAnswer={this.props.handleClickEditAnswer}
                                            userAnswers={this.props.userAnswers}/>
                        </div>
                        }
                        { this.props.userAnswers.Defects && this.mapQuestionsDamages()}
                        { this.mapQuestionsCriterias()}
                    </div>

                    { this.props.userAnswers.newOffer &&
                            <div className="row itemAnswer">
                                <TemplateAssistant question={<span>Guten Tag {this.props.userData.gender} {this.props.userData.name}, wir haben bei Ihrem Ankauf eine Abweichung der eingesendeten Angaben gefunden und offerieren Ihnen einen neuen Preis
                                                                    {
                                                                        this.props.showButton && <button className="btn"
                                                                                                         onClick={this.props.viewNewOffer}>Neue Angebot ansehen
                                                                                                 </button>
                                                                    }
                                                            </span>}/>
                                {this.props.userAnswers.newOffer.length > 0 && <TemplateClient name={'newOffer'}
                                                                                               userAnswers={this.props.userAnswers}/>}
                            </div>
                    }
                </div>
            </div>
        );
    }
}

AnswersField.propTypes = {}
AnswersField.defaultProps = {}

export default AnswersField