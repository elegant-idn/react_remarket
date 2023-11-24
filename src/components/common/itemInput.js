import React, { useState } from "react";
import PropTypes from "prop-types";

const InputForm = ({
  error,
  label,
  id,
  name,
  type,
  handleChange,
  successResend,
  resendActivationLink,
  resendActivationEmail,
}) => {
  const [state, setState] = useState({ showPassword: false });
  return (
    <div className="form__group">
      <input
        className={error ? "errorInput string optional form__field" : "string optional form__field"}
        onChange={handleChange}
        name={name}
        maxLength="255"
        id={id}
        placeholder=" "
        type={
          type !== "password" ? type : state.showPassword ? "text" : "password"
        }
        size="50"
      />
      {type === "password" && (
        <i
          className={state.showPassword ? "eye eye-opened" : "eye eye-closed"}
          onClick={() =>
            setState({ ...state, showPassword: !state.showPassword })
          }
        ></i>
      )}
      <label className="string optional form__label" htmlFor={id}>
        {label}
      </label>

      {error && (
        <span className="errorText">
          {" "}
          {error}.
          {resendActivationLink && (
            <span
              onClick={resendActivationEmail}
              className="resendActivationLink"
            >
              {resendActivationLink}
            </span>
          )}
        </span>
      )}
      {successResend && !error && (
        <span className="success">{successResend}</span>
      )}
    </div>
  );
};

InputForm.propTypes = {};
InputForm.defaultProps = {};

export default InputForm;
