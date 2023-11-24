import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Animated} from "react-animated-css"

const TemplateClient = ({ name, userAnswers, handleClickEditAnswer, criteriaId }) => {
    let ifMobile = window.isMobile
    function mapAnswersModel(item, i) {
        return(
            <div key={i}
                 className="question client"
                 onClick={() => handleClickEditAnswer(name, userAnswers[name])}>
                <span>{item.name} {item.nameExt ? ` (${item.nameExt})` : null}</span>
                <span className="edit" ><i className="fa fa-pencil" aria-hidden="true"/></span>
            </div>
        )
    }

    function mapAnswersDamages(item, i) {
        return (
            <span key={i}>
                {item['description-short']}{ i === userAnswers[name].length - 1  ? '' : ', '}
            </span>
        )
    }
    function mapAnswers(item, i){
        return (
            <span key={i}>
                {item.name}
                { criteriaId != 16 && name !== 'Device' && item.image && <img src={item.image} />}
                { item.colorCode && <span className="colorPic" style={{backgroundColor: item.colorCode }}/>}
                { i === userAnswers[name].length - 1  ? '' : ', '}
            </span>
        )
    }
    return (
        <Animated animationIn="fadeIn">
            <div className="wrapAnswer">
                <div>
                    <p>Ihre Angabe</p>
                    { name === 'Model' ?
                        userAnswers[name].map(mapAnswersModel)
                        :
                        name === 'Defects' ?
                            <div className="question client"
                                 onClick={() => handleClickEditAnswer(name, userAnswers[name])}>
                                <span>{ userAnswers[name].map( mapAnswersDamages ) }</span>
                                <span className="edit" >
                                    <i className="fa fa-pencil" aria-hidden="true"/>
                                </span>
                            </div>

                            :
                            <div className="question client"
                                 onClick={ handleClickEditAnswer && (() => handleClickEditAnswer(name, userAnswers[name]))}>
                                <span>
                                    { userAnswers[name].map( mapAnswers ) }
                                    { userAnswers[name].length === 0 && '-'}
                                </span>
                                {handleClickEditAnswer &&   <span className="edit">
                                                                <i className="fa fa-pencil"
                                                                   aria-hidden="true"/>
                                                            </span>
                                }
                            </div>
                    }
                </div>
            </div>
        </Animated>

    )
}

TemplateClient.propTypes = {}
TemplateClient.defaultProps = {}

export default TemplateClient