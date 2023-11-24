import React from 'react'
import PropTypes from 'prop-types'

const InputForm = ({ error, id, name, placeholder, type, handleChange,label }) => {
    return (
        <span>
            <label className="string optional" htmlFor={ id }>{label} *</label>
            <input className={ error ? "errorInput string optional" : "string optional" }
                   onChange={handleChange}
                   name={ name }
                   maxlength="255"
                   id={ id  }
                   placeholder={ placeholder }
                   type={ type }
                   size="50" />
            { error &&  <span className="errorText"> { error }</span>}
        </span>

    );
}

InputForm.propTypes = {}
InputForm.defaultProps = {}

export default InputForm