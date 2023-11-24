import React from "react";
import InputForm from "../../common/itemInput";

const LoginFormRegistration = ({
  registerUser,
  error,
  handleChangeRegistration,
  loginFacebook,
  loginGoogle,
  showInputCode,
}) => {
  let {
    email,
    phone,
    password,
    password_confirmation,
    code,
    socialNoEmail,
  } = error;
  return (
    <div className="login-box-tab lgm-1">
      <div className="login-box-form">
        <form
          acceptCharset="utf-8"
          action="#"
          className="simform"
          onSubmit={registerUser}
          name="registrationForm"
        >
          <div className="heading">Registrieren</div>
          <p className="errorInfo"> </p>

          <div className="sminputs">
            <div className="input full">
              <InputForm
                error={email}
                id="customer-email"
                name="email"
                type="email"
                label="Email"
                handleChange={handleChangeRegistration}
              />
            </div>
          </div>
          <div className="spacer-24" />
          <div className="sminputs">
            <div className="input string optional">
              <InputForm
                error={password}
                id="customer-pw"
                name="password"
                type="password"
                label="Passwort"
                handleChange={handleChangeRegistration}
              />
              <div className="statusBarPassword" />
            </div>

            <div className="password-criteria">
              Ihr Passwort muss aus mindestens 8 Zeichen (bis zu 32) bestehen
              und mindestens eine Zahl und einen grossen Buchstaben enthalten.
            </div>
            <div className="spacer-24" />

            <div className="input string optional">
              <InputForm
                error={password_confirmation}
                id="customer-pw-repeat"
                name="password_confirmation"
                type="password"
                label="Passwort"
                handleChange={handleChangeRegistration}
              />
              <div className="statusBarPassword" />
            </div>
          </div>
          <div className="sminputs">
            <div className="input-full">
              {showInputCode && (
                <div className="input string optional">
                  <InputForm
                    error={code}
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Code"
                    label="Code"
                    handleChange={handleChangeRegistration}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="alternative-separator">
            <div className="separator-line"></div>
            <div className="separator-text">oder Registrieren Sie sich bei Social Media</div>
            <div className="separator-line"></div>
          </div>

          <div className="social-buttons">
            {socialNoEmail && (
              <span className="errorText"> {socialNoEmail}</span>
            )}
            <button className="connect googleplus" onClick={loginGoogle}>
              <div className="connect-icon icon-google" />
              <div className="connect-context">Registrieren Sie sich bei Google</div>
            </button>
            <button className="connect facebook" onClick={loginFacebook}>
              <div className="connect-icon icon-facebook" />
              <div className="connect-context">Registrieren Sie sich bei Facebook</div>
            </button>
          </div>

          <div className="simform-actions-sidetext">
            Mit der Registrierung erkläre ich mich mit den&nbsp;
            <a href="/ueber-uns/agb" target="_blank">
              AGB
            </a>{" "}
            und{" "}
            <a href="/ueber-uns/datenschutzerklaerung" target="_blank">
              Datenschutz
            </a>{" "}
            einverstanden.
          </div>

          <button name="commit" type="submit" className="commit">
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginFormRegistration;
