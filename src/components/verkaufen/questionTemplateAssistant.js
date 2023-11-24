import React from 'react'
import PropTypes from 'prop-types'

const QuestionTemplateAssistant = ({ question, name }) => {
    let hours = ('0'+ new Date().getHours()).slice(-2),
        minutes = ('0'+ new Date().getMinutes()).slice(-2),
        time = hours + ':' + minutes
    function generateQuestion(question, name){
        let nameArr = name.trim().split(' ')
        let arrQuestion = question.slice(0, question.length - 1).split(' ')
        let newStr = arrQuestion.map( item => {
            if(nameArr.some( itemName => item.includes(itemName))){
                return '<span style="color: #00cb94">' + item + '</span>'
            }
            else return item
        })
        return newStr.join(' ') + '?'
    }
    return (
        <div>
            <div className="row assistantQuestion">
                <div className="col-sm-12 text-center">
                    {name ? <p dangerouslySetInnerHTML={{__html: generateQuestion(question,name)}}/> : <p>{question}</p>}
                </div>
            </div>
        </div>
    );
}

QuestionTemplateAssistant.propTypes = {}
QuestionTemplateAssistant.defaultProps = {}

export default QuestionTemplateAssistant