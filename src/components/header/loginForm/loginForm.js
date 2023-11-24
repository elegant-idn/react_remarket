import React from "react";
import LoginFormLog from "./loginFormLog";
import LoginFormRegistration from "./loginFormRegistration";

const LoginForm = ({
  registerUser,
  loginUser,
  errorRegistration,
  errorLogin,
  handleChangeRegistration,
  resendActivationEmail,
  handleChangeLogin,
  closeLoginForm,
  loginFacebook,
  loginGoogle,
  showInputCode,
}) => {
  document.onkeyup = function(e) {
    if (e.keyCode == 27) {
      if (($("#modalAGBReg").data("bs.modal") || {}).isShown) {
        $("#modalAGBReg").modal("hide");
      } else {
        document.getElementById("op").checked = false;
      }
    }
  };
  return (
    <div className="login-overlay login-overlay-outer">
      <div className="login-box">
        <div className="login-box-wrapper">
          <label className="close" htmlFor="op" onClick={closeLoginForm} />
          <div className="login-box-container">
            <div className="login-box-tab-wrapper">
              <LoginFormRegistration
                registerUser={registerUser}
                error={errorRegistration}
                handleChangeRegistration={handleChangeRegistration}
                loginFacebook={loginFacebook}
                loginGoogle={loginGoogle}
                showInputCode={showInputCode}
              />
              <LoginFormLog
                error={errorLogin}
                handleChangeLogin={handleChangeLogin}
                resendActivationEmail={resendActivationEmail}
                loginUser={loginUser}
                loginFacebook={loginFacebook}
                loginGoogle={loginGoogle}
                closeLoginForm={closeLoginForm}
              />
            </div>
            <ul className="login-box-tabs">
              <li className="tab" data-tabtar="lgm-2">
                <span className="text">Sie haben bereits ein Konto?</span>
                <a href="#" className="link">
                  Einloggen
                </a>
              </li>
              <li className="tab" data-tabtar="lgm-1">
                <span className="text">Sie haben kein Konto?</span>
                <a href="#" className="link">
                  Registrieren
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
