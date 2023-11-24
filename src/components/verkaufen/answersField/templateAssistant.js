import React from 'react'
import PropTypes from 'prop-types'
import {Animated} from "react-animated-css"

const TemplateAssistant = ({ question }) => {
    return (
        <Animated animationIn="fadeIn">
            <div>
                <p>Remo</p>
                <div className="question assistant">
                    <img className="assistant" src="/images/design/assistantForQuestion-small.svg" alt=""/>
                    <span>{question}</span>
                </div>
            </div>
        </Animated>
    )
}

TemplateAssistant.propTypes = {}
TemplateAssistant.defaultProps = {}

export default TemplateAssistant