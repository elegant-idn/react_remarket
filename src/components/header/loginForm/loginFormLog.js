import React from "react";
import PropTypes from "prop-types";
import InputForm from "../../common/itemInput";

const LoginFormLog = ({
  error,
  handleChangeLogin,
  loginUser,
  loginFacebook,
  loginGoogle,
  closeLoginForm,
  resendActivationEmail,
}) => {
  let {
    login,
    password,
    infoMsg,
    socialNoEmail,
    resendActivationLink,
    successResend,
  } = error;

  function clickForgotPassword() {
    document.getElementById("op").checked = false;
    closeLoginForm();
  }
  return (
    <div className="login-box-tab lgm-2">
      <div className="login-box-form">
        <form
          acceptCharset="utf-8"
          action="#"
          className="simform"
          name="loginForm"
          onSubmit={loginUser}
        >
          <div className="heading">Einloggen</div>

          <p className="errorInfo">{infoMsg}</p>
          <div className="sminputs">
            <div className="input full">
              <InputForm
                error={login}
                resendActivationLink={resendActivationLink}
                successResend={successResend}
                resendActivationEmail={resendActivationEmail}
                id="customer-email-login"
                name="login"
                type="text"
                label="Email"
                handleChange={handleChangeLogin}
              />
            </div>
          </div>
          <div className="spacer-24" />
          <div className="sminputs">
            <div className="input full">
              <InputForm
                error={password}
                id="customer-pw-login"
                name="password"
                type="password"
                label="Passwort"
                handleChange={handleChangeLogin}
              />
            </div>
          </div>
          <div className="forgot-password">
            <label htmlFor="forgotPassword" onClick={clickForgotPassword}>
              Passwort vergessen?
            </label>
          </div>

          <div className="alternative-separator">
            <div className="separator-line"></div>
            <div className="separator-text">oder Melden Sie sich mit Social Media an</div>
            <div className="separator-line"></div>
          </div>

          <div className="social-buttons">
            {socialNoEmail && (
              <span className="errorText"> {socialNoEmail}</span>
            )}
            <button className="connect googleplus" onClick={loginGoogle}>
              <div className="connect-icon icon-google" />
              <div className="connect-context">Einloggen Sie sich mit Google an</div>
            </button>
            <button className="connect facebook" onClick={loginFacebook}>
              <div className="connect-icon icon-facebook" />
              <div className="connect-context">Mit Facebook einloggen</div>
            </button>
          </div>

          <button name="commit" type="submit" className="commit">
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginFormLog;
