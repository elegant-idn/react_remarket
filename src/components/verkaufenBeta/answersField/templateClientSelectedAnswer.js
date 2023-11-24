import React from 'react'
import {Animated} from "react-animated-css"

const TemplateClientSelectedAnswer = ({ name, handleClickEditAnswer, userAnswers, isCriteria }) => {

    let ifMobile = window.isMobile
    const generateKey = (pre) => {
        return `${ pre }_${ new Date().getTime() }`;
    }

    const mapAnswers = (item, i) => {
        return (
                <div key={item.id} className="verkaufenPageAnswersBeta">
                    <button
                        className="btnAnswer">
                        {item.image && <img src={item.image} className="imgDevice"/>}
                        {/* {item.logoContent &&  <div className="logoContent" dangerouslySetInnerHTML={{ __html: item.logoContent}}/>} */}
                        {item.name && <span>{item.name}</span>}
                    </button>
                    <i className="fa fa-pencil edit" aria-hidden="true"/>
                </div>
        )
    }

    const mapModelAnswers = (item, i) => {
        return (
                <div key={item.id} className="verkaufenPageAnswersBeta">
                    <button className="btnAnswer">
                        {item.image && <img src={item.image} className="imgDevice"/>}
                        {item.name} {item.nameExt ? ` (${item.nameExt})` : null}
                    </button>
                    <i className="fa fa-pencil edit" aria-hidden="true"/>
                </div>
        )
    }

    function mapAnswersDamages(item, i) {
        return (
          <React.Fragment key={i}>
                {item['description-short']}{ i === userAnswers[name].length - 1  ? '' : ', '}
          </React.Fragment>

        )
    }
    function mapAnswersCriteria(item, i) {
        return (
          <React.Fragment key={i}>
              {item['name']}{ i === userAnswers[name].length - 1  ? '' : ', '}
          </React.Fragment>

        )
    }

    const colorCode =  (userAnswers[name][0] && userAnswers[name][0].colorCode) ? userAnswers[name][0].colorCode : null
    return (
                <div className="wrapAnswer">
                    <div>
                        <p className="text-right">Ich</p>
                        <div className="question client"
                             onClick={() => handleClickEditAnswer(name, userAnswers[name])}>
                            <div className="userAnswers text-center">
                                <div className="wrapUserAnswers">
                                    {
                                        (name == "Model" || name == "Condition") ?
                                            userAnswers[name].map(mapModelAnswers) :
                                            name === 'Defects' ?
                                                <div className="verkaufenPageAnswersBeta">
                                                    <button
                                                        className="btnAnswer">
                                                        <p> {userAnswers[name].map(mapAnswersDamages)}</p>
                                                    </button>
                                                    <i className="fa fa-pencil edit" aria-hidden="true"/>
                                                </div>
                                                :
                                                isCriteria ?
                                                    <div className="verkaufenPageAnswersBeta">
                                                        <button
                                                            className="btnAnswer">
                                                            <p> {userAnswers[name].map(mapAnswersCriteria)}</p>
                                                            { colorCode && <p className="colorPic" style={{backgroundColor:  colorCode }}/>}
                                                        </button>
                                                        <i className="fa fa-pencil edit" aria-hidden="true"/>
                                                    </div> :
                                                userAnswers[name].map(mapAnswers)
                                    }
                                    {userAnswers[name].length === 0 && '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default TemplateClientSelectedAnswer