import React, {Component} from 'react'

import TemplateAssistant from './templateAssistant'
import TemplateClientAnswersList from './templateClientAnswersList'
import TemplateClientSelectedAnswer from './templateClientSelectedAnswer'
import {Animated} from "react-animated-css";
import axios from "axios";


class AnswersField extends Component {

    state = {
        showShipping: false,
        isFirstAnimate: true,
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showShipping: false});
    }

    componentDidUpdate() {
        // if current TemplateClientAnswersList == defects && user choose answers
        if($('.verkaufenPageAnswersBeta-defects').length && this.props.selectedAnswers.Defects){
            $('.answersBetaField').stop()
        }
        else {
            this._animateAnswersField()
            $('.answersBetaField').stop()
        }
        if(this.props.showQuestion.btnOpenResult){
            this.hitSee()
        }
    }

    generateKey = (key) => {
        return `${key}_${new Date().getTime() * Math.random()}`;
    }

    hitSee = () => {
        let {selectedAnswers} = this.props
        if (selectedAnswers && selectedAnswers.Model.length > 0) {
            axios.post('/api/hitSell', {modelId: selectedAnswers.Model[0].id})
                .then(result => {
                    
                })
                .catch(error => {
                    
                })
        }
        
    }
    
    _animateAnswersField = () => {
        const questionCount = $("p:contains('Remo')").length,
            delay = questionCount > 2 ? 0 : 2000
        if(this.state.isFirstAnimate && questionCount > 2) {
            this.setState({isFirstAnimate: false})
        }
        if(!this.state.isFirstAnimate) {
               const height = $('.answersBetaField').prop("scrollHeight");

            $('.answersBetaField').stop()
            $('.answersBetaField').delay(delay).animate({scrollTop: height}, 1500)
        }
    }

    mapQuestionsCriterias = () => {
        let {criteriasList, selectedAnswers, showQuestion} = this.props
        var activeCriteria = criteriasList.filter(item => item.active),
            lastActiveCriteria = activeCriteria[activeCriteria.length - 1];

        return activeCriteria.map((criteria, i) => {

                let isSelectAnswer = ((selectedAnswers.hasOwnProperty(criteria.name.toLowerCase()) && lastActiveCriteria.name !== criteria.name) || showQuestion.btnOpenResult);

                return (
                    <div key={this.generateKey(i)}>
                        <div className="row itemAnswer">
                            <TemplateAssistant question={criteria.question} key={this.generateKey(i)} delay={0}
                                               criteriaActive={criteria.active} criteriaId={criteria.id}
                                               selectedAnswers={selectedAnswers} values={criteria.values}
                                               name={criteria.name.toLowerCase()}/>
                        </div>

                        <div>
                            <div className="row pull-right itemAnswer">
                                {!isSelectAnswer &&
                                <TemplateClientAnswersList values={criteria.values}
                                                           name={criteria.name.toLowerCase()}
                                                           selectedAnswers={selectedAnswers}
                                                           typeButton={criteria.type}
                                                           userAnswers={this.props.userAnswers}
                                                           toggleInfoAboutCondition={this.props.toggleInfoAboutCondition}
                                                           changeUserAnswerMultiply={this.props.selectAnswers}
                                                           criteriaId={criteria.id}
                                                           indexOfCriteria={i + 1}
                                                           handleClick={this.props.handleClick}
                                                           key={this.generateKey}
                                                           answerDelay={this.props.answerDelay}
                                                           delay={0}
                                                           isAnswerAnim={this.props.isAnswerAnim}
                                />
                                }

                                {(isSelectAnswer) &&
                                <TemplateClientSelectedAnswer name={criteria.name.toLowerCase()}
                                                              handleClickEditAnswer={this.props.handleClickEditAnswer}
                                                              userAnswers={this.props.userAnswers}
                                                              isCriteria={true}
                                />
                                }
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                )
            }
        )
    }

    sellNow = () => {
        this.generateSellCountDownCoupon();
        this.setState({showShipping: true});
    }

    generateSellCountDownCoupon(){
        if(process.env.MIX_IS_SELL_COUPON){
            let sellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline'));
            if(sellDeadline){
                if(sellDeadline.couponShortcode === '' && !sellDeadline.sellDeadlineExpired) {
                    axios.get(`/api/generateSellCountDownCoupon`)
                        .then( result => {
                            sellDeadline.couponShortcode = result.data.shortcode;
                            window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
                        })
                        .catch( error => {
                            console.log('error', error.response.data);
                        })
                }
            }
        }

    }

    render() {
        const {showQuestion, devices, selectedAnswers, userAnswers, handleClick, handleClickEditAnswer, showAnswer, conditionQuestion, toggleInfoAboutCondition, handleShipping, addToBasketVerkaufen} = this.props,
            {showShipping} = this.state;

        return (
            <div className="col-md-12">
                <div className="answersBetaField">
                    <div className="wrapAnswersBeta">
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant
                                    question={<span>Grüezi, ich bin Remo. Gerne helfe ich Ihnen beim Verkauf</span>}/>
                            </div>
                        </div>
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant
                                    question={<span>Welchen <span style={{fontWeight: 'bold'}}>Gerätetyp</span> haben Sie?</span>}
                                    delay={2000}/>
                            </div>
                        </div>
                        {(showQuestion.device) &&
                        <div>
                            <div className="row pull-right itemAnswer">
                                <TemplateClientAnswersList values={devices}
                                                           name={'Device'}
                                                           selectedAnswers={selectedAnswers}
                                                           typeButton={3}
                                                           userAnswers={userAnswers}
                                                           handleClick={handleClick}
                                                           key={this.generateKey}
                                                           delay={4000}
                                                           answerDelay={this.props.answerDelay}
                                                           setResults={this.props.setResults}
                                />
                            </div>
                        </div>
                        }
                        {(showAnswer.device) &&
                        <div>
                            <div className="row pull-right itemAnswer">
                                <TemplateClientSelectedAnswer name={'Device'}
                                                              handleClickEditAnswer={handleClickEditAnswer}
                                                              userAnswers={userAnswers}
                                />
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        }

                        {(showQuestion.brand) &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant question={<span>Von welcher <span
                                    style={{fontWeight: 'bold'}}>Marke</span> ist Ihr <span>{userAnswers.Device[0].name}</span>?</span>}/>
                            </div>
                            {!showAnswer.brand &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientAnswersList values={devices}
                                                               name={'Brand'}
                                                               selectedAnswers={selectedAnswers}
                                                               typeButton={3}
                                                               userAnswers={userAnswers}
                                                               handleClick={handleClick}
                                                               key={this.generateKey}
                                                               answerDelay={this.props.answerDelay}/>
                                </div>
                            </div>
                            }
                            {showAnswer.brand &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientSelectedAnswer name={'Brand'}
                                                                  handleClickEditAnswer={handleClickEditAnswer}
                                                                  userAnswers={userAnswers}
                                    />
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            }
                        </div>
                        }

                        {(showQuestion.subModel) &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant question={<span>Welches <span
                                    style={{fontWeight: 'bold'}}>{this.props.userAnswers.Brand[0].name} Untermodell</span> haben Sie?</span>}/>
                            </div>
                            {!showAnswer.subModel &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientAnswersList values={devices}
                                                               name={'Submodel'}
                                                               selectedAnswers={selectedAnswers}
                                                               typeButton={3}
                                                               userAnswers={userAnswers}
                                                               handleClick={handleClick}
                                                               key={this.generateKey}
                                                               answerDelay={this.props.answerDelay}/>
                                </div>
                            </div>
                            }
                            {showAnswer.subModel &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientSelectedAnswer name={'Submodel'}
                                                                  handleClickEditAnswer={handleClickEditAnswer}
                                                                  userAnswers={userAnswers}
                                    />
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            }
                        </div>
                        }
                        {showQuestion.model &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant question={<span>Welches <span
                                    style={{fontWeight: 'bold'}}>{this.props.userAnswers.Brand && this.props.userAnswers.Brand[0].name} </span> haben Sie?</span>}/>
                            </div>
                            {!showAnswer.model &&
                            <div>
                                <div className="row pull-right itemAnswer models">
                                    <TemplateClientAnswersList values={devices}
                                                               name={'Model'}
                                                               selectedAnswers={selectedAnswers}
                                                               typeButton={3}
                                                               userAnswers={userAnswers}
                                                               handleClick={handleClick}
                                                               key={this.generateKey}
                                                               answerDelay={this.props.answerDelay}
                                                               setResults={this.props.setResults}/>
                                </div>
                            </div>
                            }
                            {showAnswer.model &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientSelectedAnswer name={'Model'}
                                                                  handleClickEditAnswer={handleClickEditAnswer}
                                                                  userAnswers={userAnswers}
                                    />
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            }
                        </div>
                        }
                        {conditionQuestion.show &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant question={<span>In welchem allgemeinen <span
                                    style={{fontWeight: 'bold'}}>Zustand</span> ist Ihr Gerät?</span>}/>
                            </div>
                            {!showAnswer.condition &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientAnswersList values={devices}
                                                               name={'Condition'}
                                                               selectedAnswers={selectedAnswers}
                                                               typeButton={3}
                                                               userAnswers={userAnswers}
                                                               handleClick={handleClick}
                                                               toggleInfoAboutCondition={toggleInfoAboutCondition}
                                                               key={this.generateKey}
                                                               answerDelay={this.props.answerDelay}/>
                                </div>
                            </div>
                            }
                            {showAnswer.condition &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientSelectedAnswer name={'Condition'}
                                                                  handleClickEditAnswer={handleClickEditAnswer}
                                                                  userAnswers={userAnswers}
                                    />
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            }
                        </div>
                        }
                        {showQuestion.damagesList &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant
                                    question={<span>Was ist bei Ihrem Gerät mangelhaft und/oder defekt?</span>}/>
                            </div>
                            {!showAnswer.damagesList &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientAnswersList values={devices}
                                                               name={'Defects'}
                                                               selectedAnswers={selectedAnswers}
                                                               typeButton={1}
                                                               userAnswers={userAnswers}
                                                               handleClick={handleClick}
                                                               indexOfCriteria={this.props.lastIndexOfCriteria}
                                                               changeUserAnswerMultiply={this.props.selectAnswers}
                                                               key={this.generateKey}
                                                               answerDelay={this.props.answerDelay}/>
                                </div>
                            </div>
                            }
                            {showAnswer.damagesList &&
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientSelectedAnswer name={'Defects'}
                                                                  handleClickEditAnswer={handleClickEditAnswer}
                                                                  userAnswers={userAnswers}
                                    />
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            }
                        </div>
                        }
                        {showQuestion.criteriasList &&

                        this.mapQuestionsCriterias()

                        }
                        {showQuestion.btnOpenResult &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant
                                    question={<span>Hier erhalten Sie Ihr <span
                                        style={{fontWeight: 'bold'}}>Angebot:</span></span>}
                                    content={1}
                                    userAnswers={userAnswers}
                                    user={this.props.user}
                                    handleSellNow={this.sellNow}
                                />
                            </div>
                        </div>
                        }
                        {(showQuestion.btnOpenResult && showShipping) &&
                        <div>
                            <div className="row itemAnswer">
                                <TemplateAssistant
                                    question={<span>Wie wollen Sie das Gerät zu uns bringen?</span>}
                                    delay={0}
                                />
                            </div>
                            <div>
                                <div className="row pull-right itemAnswer">
                                    <TemplateClientAnswersList shipping={1}
                                                               handleShipping={handleShipping}
                                                               addToBasketVerkaufen={addToBasketVerkaufen}
                                                               key={this.generateKey}
                                                               answerDelay={2000}/>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    {this.props.userAnswers.newOffer &&
                    <div className="row itemAnswer">
                        <TemplateAssistant
                            question={<span>Guten Tag {this.props.userData.gender} {this.props.userData.name}, wir haben bei Ihrem Ankauf eine Abweichung der eingesendeten Angaben gefunden und offerieren Ihnen einen neuen Preis
                                {
                                    this.props.showButton && <button className="btn"
                                                                     onClick={this.props.viewNewOffer}>Neue Angebot
                                        ansehen
                                    </button>
                                }
                                                            </span>}/>
                        {this.props.userAnswers.newOffer.length > 0 && <TemplateClientAnswersList name={'newOffer'}
                                                                                                  userAnswers={this.props.userAnswers}
                                                                                                  answerDelay={this.props.answerDelay}/>}
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