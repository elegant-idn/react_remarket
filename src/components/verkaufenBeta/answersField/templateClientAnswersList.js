import React from 'react'
import {browserHistory, Link} from 'react-router'
import {Animated} from "react-animated-css";
import SearchBar from "./searchBar";


const TemplateClientAnswersList = ({ type, typeButton, name, values, userAnswers, handleClick, handleClickEditAnswer, criteriaId,  selectedAnswers, indexOfCriteria, toggleInfoAboutCondition, changeUserAnswerMultiply, shipping, handleShipping, addToBasketVerkaufen, delay, answerDelay, isAnswerAnim, setResults }) => {
    if(!delay){
        delay=0
    }
    let ifMobile = window.isMobile

    const generateKey = (pre) => {
        return `${ pre }_${ new Date().getTime()*Math.random() }`;
    }

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
            <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                  key={generateKey(item.id)}
                  className="verkaufenPageAnswersBeta">
                    <button className="btnAnswer">
                    {item.image && <img src={item.image} className="imgDevice"/>}
                        {item.name}
                    </button><i className="fa fa-pencil edit" aria-hidden="true"/>
            </Link>
        )
    }

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
            let className = '',
                isImageActive = false;

            if(selectedAnswers[name]) {
                className = "itemValueClientQuestionBeta";
                if( selectedAnswers[name].some( elem => elem.id == item.id)){
                    className = "itemValueClientQuestionBeta activeAnswer";
                    isImageActive = true;
                }
            }
            else className = "itemValueClientQuestionBeta"
            if (name === 'Device'){
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={generateKey(item.id)}
                          className="verkaufenPageAnswersBeta">
                    <button onClick={ () => handleClick( name, item, indexOfCriteria) }
                          className={className}>
                        {item.image && <img src={item.image} className="imgDevice"/>}

                        {item.name}</button>

                    </Link>
            )
            }
            else if (name === 'Model'){
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={item.id}
                          className="verkaufenPageAnswersBeta modelAnswer" >
                    <div  onClick={ () => handleClick( name, item, indexOfCriteria) }
                          className={className}>
                        {
                            item.image &&
                                <React.Fragment>
                                    <div>
                                        <img src={item.image} className="imgDeviceModel"/>
                                    </div>

                                    <div className="wrapZoomImg">
                                        <img src={item.image} className="zoomImg"/>
                                    </div>

                                </React.Fragment>
                        }


                    {item.name}{item.nameExt ? ` (${item.nameExt})` : null}
                    </div>
                    </Link>
                )
            }
            else if (name === "Condition") {
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={generateKey(item.id)}
                          className="verkaufenPageAnswersBeta">
                        <button onClick={ typeButton == 3 ? (() => handleClick( name, item, indexOfCriteria, criteriaId)) : ( () => changeUserAnswerMultiply( name, item, typeButton))}
                                className={className}>
                            { isImageActive && <img src={item.imgActive} className="imgCondition"/>}
                            { !isImageActive && <img src={item.image} className="imgCondition"/>}
                            { item.name }

                        </button>
                    </Link>
                )
            }
            else{
                return(
                    <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                          key={generateKey(item.id)}
                          className="verkaufenPageAnswersBeta">
                        <button onClick={ typeButton == 3 ? (() => handleClick( name, item, indexOfCriteria, criteriaId)) : ( () => changeUserAnswerMultiply( name, item, typeButton))}
                              className={className}>
                            {/* {item.logoContent &&  <div className="logoContent" dangerouslySetInnerHTML={{ __html: item.logoContent}}/>} */}
                              {item.name}

                            { (criteriaId != 16 && item.image) && <img src={item.image} className="imgCriteria"/>}
                            { item.colorCode && <p className="colorPic" style={{backgroundColor: item.colorCode }}/>}
                        </button>
                    </Link>
                )
            }
        }
    }

    function mapAnswerValuesDamages(item, i){

        let className = ''
        if(selectedAnswers[name]) selectedAnswers[name].some( elem => elem.id == item.id) ? className = "itemValueClientQuestionBeta activeAnswer" : className = "itemValueClientQuestionBeta"
        else className = "itemValueClientQuestionBeta"
        return(
            <Link to={`/verkaufen/${getUrlStr(item, name, typeButton, selectedAnswers)}`}
                  key={generateKey(item.id)}
                  className="verkaufenPageAnswersBeta-defects">
                <button onClick={ () => changeUserAnswerMultiply( name, item) }
                      className={className}>
                    {item['description-short']}<br/>
                </button>
            </Link>
        )
    }

    function getDelay() {
        if(answerDelay === 0)
            return answerDelay;
        else if(isAnswerAnim && isAnswerAnim[name] === false){
            return 0;
        }
        else if (selectedAnswers && selectedAnswers[name]) {
            return 0;
        }
        else if (delay > answerDelay)
            return delay;
        else
            return answerDelay;
    }

    return (
            <div className="wrapAnswer">
                <Animated animationInDelay={getDelay()} animateOnMount={getDelay()?true:false} className={getDelay()?"":"cancelAnimation"}>
                <p className="text-right">Ich</p>
                <div className="question client">
                    <div className="userAnswers text-center">
                        {
                            shipping ?
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row text-right buttons" style={{marginRight: 23, marginLeft: -4}}>
                                            <button className="btn"
                                                    onClick={() => {handleShipping('chooseLocation'); }}
                                            >
                                                Ladenlokal besuchen
                                                <img src="/images/design/ic-bring.svg" alt=""/>
                                            </button>
                                            <button className="btn"
                                                    onClick={() => handleShipping('perPost')}
                                            >
                                                GRATIS per Post senden
                                                <img src="/images/design/ic-post.svg" alt=""/>
                                            </button>
                                            { /*
                                            <button className="btn" onClick={() => handleShipping('pickupByBicycle')}>
                                                Velokurier
                                                <img src="/images/design/ic-home.svg" alt=""/>
                                            </button>
                                            */
                                          }
                                            {/* <button className="btn" style={{backgroundColor:'#b5b7b6'}}
                                                    onClick={ (e) => handleShipping('addToBasket', e) }
                                            >
                                                Speichern
                                                <img src="/images/design/saveWhite.svg" style={{width: '21px', height: '21px'}} alt=""/>
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                                :
                                type === 'text' ?
                                    <div className="row">
                                        <div className="col-md-12">
                                            <span>{question}</span>
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
                                                        {(name === 'Device' || name === 'Model') &&
                                                            <SearchBar setResults={setResults} option={{name: name}} showButton={false}/>
                                                        }
                                                        {(name === 'Condition' || criteriaId == 2 || criteriaId == 4 || criteriaId == 5 ) &&
                                                        <p className="img-question text-right">
                                                            <img onClick={() => toggleInfoAboutCondition(criteriaId)}
                                                                 src="/images/design/question_condition.svg" alt=""/>
                                                        </p>
                                                        }
                                                        { typeButton == 1 && name !== 'Defects' &&
                                                        <Link to={`/verkaufen/${getUrlStr(null, name, typeButton, selectedAnswers)}`}>
                                                            <button className="btn defectBeta" style={{margin: "auto"}}
                                                                    onClick={ () => handleClick( name, null, indexOfCriteria, criteriaId)}>
                                                                Weiter
                                                                <span className="spanArrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                                            </button>
                                                        </Link>
                                                        }

                                                    </div>
                                            }
                                        </div>
                                        { typeButton == 1 && name === 'Defects' &&
                                        <button className="btn defectBeta"
                                                onClick={ () => { selectedAnswers[name] && selectedAnswers[name].length > 0 ? handleClick( name, null, indexOfCriteria, criteriaId) : null }}>
                                            Weiter
                                            <span className="spanArrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                        </button>
                                        }

                                    </div>
                        }
                    </div>
                </div>
            </Animated>
            </div>
    )
}

TemplateClientAnswersList.propTypes = {}
TemplateClientAnswersList.defaultProps = {}

export default TemplateClientAnswersList

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