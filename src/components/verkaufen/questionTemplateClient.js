import React from 'react'
import PropTypes from 'prop-types'
import {Link, browserHistory} from 'react-router'

const QuestionTemplateClient = ({ type, typeButton, question, values, handleClick, name, indexOfCriteria, userAnswers,
                                  selectedAnswers, changeUserAnswerMultiply, criteriaId, toggleInfoAboutCondition }) => {
    let hours = ('0'+ new Date().getHours()).slice(-2),
        minutes = ('0'+ new Date().getMinutes()).slice(-2),
        time = hours + ':' + minutes

    function selectChange(e) {
        let { value } = e.target
        let current = values.filter( item => item.name == value)
        handleClick( name, current[0], indexOfCriteria)
        browserHistory.push(`/verkaufen/${getUrlStr(current[0], name, typeButton, selectedAnswers)}`)
    }
    function mapAnswerValuesAsSelect(values){
        let arrOptions = []
        values.map( (item, i ) => {
            arrOptions.push(
                <option value={item.name} key={i}>{item.name}</option>
            )
        })
        return arrOptions
    }
    function mapAnswerValuesCriterias(item, i){
        if(item.name){
            let className = ''

            if(selectedAnswers[name]) selectedAnswers[name].some( elem => elem.id == item.id) ? className = "itemValueClientQuestion activeAnswer" : className = "itemValueClientQuestion"
            else className = "itemValueClientQuestion"
            if (name === 'Device'){
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={item.id}
                          className="verkaufenPageAnswers">
                    <p onClick={ () => handleClick( name, item, indexOfCriteria) }
                          className={className}>
                    {item.image && <img src={item.image} className="imgDevice"/>}
                    {item.name}</p>
                    </Link>
                )
            }
            else if (name === 'Model'){
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={item.id}
                          className="verkaufenPageAnswers">
                    <p onClick={ () => handleClick( name, item, indexOfCriteria) }
                          className={className}>
                    {item.name}{item.nameExt ? ` (${item.nameExt})` : null}</p>
                    </Link>
                )
            }
            else{
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={item.id}
                          className="verkaufenPageAnswers">
                        <p onClick={ typeButton == 3 ? (() => handleClick( name, item, indexOfCriteria, criteriaId)) : ( () => changeUserAnswerMultiply( name, item, typeButton))}
                              className={className}>
                              {item.name}
                              { criteriaId != 16 && item.image && <img src={item.image} className="imgCriteria"/>}
                              { item.colorCode && <span className="colorPic" style={{backgroundColor: item.colorCode }}/>}
                            {/*{ typeButton == 1 && <input type="checkbox" checked={ selectedAnswers[name] && selectedAnswers[name].some( value => item.id == value.id)}/>}*/}
                        </p>
                    </Link>
                )
            }
        }
    }
    function mapAnswerValuesDamages(item, i){
        let className = ''
        if(selectedAnswers[name]) selectedAnswers[name].some( elem => elem.id == item.id) ? className = "itemValueClientQuestion activeAnswer" : className = "itemValueClientQuestion"
        else className = "itemValueClientQuestion"

        /*  <strong>Abzug: {item.price} {window.currencyValue}</strong> */


        return(
            <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                  key={i}
                  className="verkaufenPageAnswers-defects">
                <p onClick={ () => changeUserAnswerMultiply( name, item) }
                      className={className}>
                    {item['description-short']}<br/>
                </p>
            </Link>
        )
    }

    return (
        <div className="userAnswers text-center">
            {
                type === 'text' ?
                        <div className="row">
                            <div className="col-md-12">
                                <p>{question}</p>
                            </div>
                        </div>
                    :
                        <div>
                            <div className="col-md-12 mobileScrollY">
                                { name === 'Defects' ?
                                    <div className="wrapUserAnswers">{values.map( mapAnswerValuesDamages )}</div>
                                    :
                                    typeButton == 2 ?
                                        <select onChange={selectChange} value='Choose answer'>
                                            <option value="Choose answer">Choose answer</option>
                                            { mapAnswerValuesAsSelect(values) }
                                        </select>

                                :
                                <div className="wrapUserAnswers">
                                    {values.map(mapAnswerValuesCriterias)}
                                    {(name === 'Condition' || criteriaId == 2 || criteriaId == 4 || criteriaId == 5 ) &&
                                        <img className="img-question"
                                             onClick={() => toggleInfoAboutCondition(criteriaId)}
                                             src="/images/design/question_condition.svg" alt=""/>
                                    }
                                </div>
                        }
                    </div>

                    { typeButton == 1 && name !== 'Defects' &&
                        <Link to={`/verkaufen/${getUrlStr(null, name, typeButton, selectedAnswers)}`}>
                            <button className="btn"
                                    onClick={ () => handleClick( name, null, indexOfCriteria, criteriaId)}>
                                Weiter
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </button>
                        </Link>
                    }
                    { typeButton == 1 && name === 'Defects' &&   <button className="btn"
                                                   onClick={ () => { selectedAnswers[name] && selectedAnswers[name].length > 0 ?
                                                       handleClick( name, null, indexOfCriteria, criteriaId) : null }}>
                                                Weiter
                                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                            </button>
                    }

                </div>
            }
        </div>
    )
}

QuestionTemplateClient.propTypes = {}
QuestionTemplateClient.defaultProps = {}

export default QuestionTemplateClient
export function getUrlStr(item, name, type, userAnsw) {
    let str = ''
    //clone object userAnswers
    let userAnswers = { ...userAnsw}
    for (let key in userAnswers){
        if(key !== 'image'){
            userAnswers[key] = [...userAnswers[key]]
            userAnswers[key].forEach( ( item, i ) => userAnswers[key][i] = {...item})
        }
    }
    if(name === 'Device'){
        for (let key in userAnswers){
            if(key !== 'Device') delete userAnswers[key]
        }
    }
    if(name === 'Brand'){
        for (let key in userAnswers){
            if(key !== 'Device') delete userAnswers[key]
        }
    }
    if(name === 'Submodel'){
        for (let key in userAnswers){
            if(key !== 'Device' && key !== 'Brand') delete userAnswers[key]
        }
    }
    if(name === 'Model'){
        for (let key in userAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== 'Submodel') delete userAnswers[key]
        }
    }
    if(name === 'Condition'){
        for (let key in userAnswers){
            if(key !== 'Device' && key !== 'Brand' && key !== 'Model' && key !== 'Submodel') delete userAnswers[key]
        }
    }

    if( userAnswers[name]){
        if(type == 3 || type == 2){
            userAnswers[name] = []
            userAnswers[name].push(item)
        }
        else{
            if(item){
                if(userAnswers[name].some( value => value.id == item.id)){
                    userAnswers[name] = userAnswers[name].filter( value => value.id != item.id)
                }
                else userAnswers[name].push(item)
            }
        }
    }
    else{
        userAnswers[name] = []
        if(item) userAnswers[name].push(item)
    }
    //build str
    for (let key in userAnswers){
        let nameParam = ''
        switch(key){
            case 'Condition':
                nameParam = 'allgemeiner-zustand'
                break
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
            case 'Defects':
                nameParam = 'defects'
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
            else{
                str += `${nameParam.replace(/ /g, '-').toLowerCase()}-leer/`
            }
        }
    }
    return str
}