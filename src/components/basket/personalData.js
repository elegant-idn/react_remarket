import React, {useState, useEffect} from 'react'
import Select from 'react-select'

const PersonalData = ( { changeCountry, country, inputCheckbox, changeCheckbox, ifErrorPayment, error,
                         user, goToPayment, cancelRedirect, handlerSendSellBasket, handlerNextTab,
                         handlerShowHideBlocks, validateError, validateForm, validateCheck, isValidate } ) => {
    const [clickBtn, setClickBtn] = useState(false);
    useEffect(() => {
        validateCheck()
    }, []);
    function changePassword(e) {
        let { value } = e.target,
            regular =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
        if(regular.test(value.trim())){
            $(e.target).parents('.inputFullWidth').find('.statusBarPassword').css({ background: '#00cb94'})
        }
        else{
            $(e.target).parents('.inputFullWidth').find('.statusBarPassword').css({ background: '#ff0000'})
        }
    }
    function showLoginForm() {
        cancelRedirect(true)
        document.getElementById("op").checked = true
        $('.login-box-wrapper').css({display: 'block'})
    }

    const onClickButton = () => {
        setClickBtn(true)
        setTimeout(() => {
            setClickBtn(false)
        }, 5500)
        if (!validateForm()) {
            return
        }
        if (window.isMobile) {
            goToPayment()
        } else {
            handlerNextTab()
        }
    }

    return (
        <div className="personalData">
            <h3 className="title"
                onClick={e => handlerShowHideBlocks(e)}
                data-step="personalData"><span className="num">2</span><span className="text">Persönliche Daten</span>
                <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
            </h3>
            <div className="wrapperItemBasket">
                <div className="billingForm">
                    <div className="topPersonalData">
                        {!user.isLogin &&
                            <div className="login-buttons buy-form">
                                <div className="buttons-row">
                                    {window.isMobile &&
                                        <label>
                                            <input type="checkbox"
                                                   onChange={changeCheckbox}
                                                   name="asGuest"
                                                   className="checkbox-login-as-guest" defaultChecked/>
                                            <span className="check"/>
                                        Als Gast bestellen - hierbei wird kein Benutzeraccount erstellt</label>
                                    }
                                </div>
                                {!window.isMobile &&
                                    <label>
                                        <input type="checkbox"
                                               onChange={changeCheckbox}
                                               name="asGuest"
                                               className="checkbox-login-as-guest" defaultChecked/>
                                        <span className="check"/>
                                    Als Gast bestellen - hierbei wird kein Benutzeraccount erstellt</label>
                                }
                            </div>
                        }
                        <div className="form-subheading">
                            <img src="/images/basket-form1.svg" alt=""/>
                            <h3>Lieferadresse</h3>
                        </div>
                        <div className="wrapLabel">
                            <div>
                                <div className={validateError.gender.error ? clickBtn === true ? 'genderArea genderError purple' : 'genderArea genderError' : 'genderArea'} >
                                    <label><input type="radio" name="gender" value="Herr" onClick={() => validateForm()} required/><span/>Herr</label>
                                    <label><input type="radio" name="gender" value="Frau" onClick={() => validateForm()} required/><span/>Frau</label>
                                </div>
                                <span className="errorText">{validateError.gender.msg}</span>
                            </div>
                            <label><input type="checkbox"
                                        name="company"
                                        checked={inputCheckbox.company === true ? "true" : null}
                                        onChange={changeCheckbox}/>
                            <span className="check"/>
                            Firma</label>
                        </div>
                        { !user.isLogin &&<span className="loginForSellForm"
                                                onClick={showLoginForm}>Sie haben bereits ein Konto? Jetzt einloggen</span>}
                    </div>
                    <div className={inputCheckbox.company ? " rowInputs" : " rowInputs hide" }>
                        <div className="input-wrapper">
                            <input type="text" name="companyName" className={validateError.companyName.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Firma" onChange={() => validateForm()} required={inputCheckbox.company}/>
                            <span className='placeholder'>Firma</span>
                            <span className="errorText">{validateError.companyName.msg}</span>
                        </div>
                    </div>
                    <div className="rowInputs-wrapper">
                        <div className=" rowInputs" /*onChange={changeNameField}*/>
                            <div className="input-wrapper adjust-wrapper">
                                <input type="text" name="firstname" className={validateError.firstname.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder='Vorname' onChange={() => validateForm()} required/>
                                <span className='placeholder'>Vorname</span>                                
                                <span className="errorText">{validateError.firstname.msg}</span>
                            </div>
                            <div className="input-wrapper">
                                <input type="text" name="lastname" className={validateError.lastname.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Nachname" onChange={() => validateForm()} required/>
                                <span className='placeholder'>Nachname</span>
                                <span className="errorText">{validateError.lastname.msg}</span>
                            </div>
                        </div>
                    </div>
                    <div className="rowInputs-wrapper">
                        <div className="rowInputs">
                            <div className="input-wrapper adjust-wrapper">
                                <input type="email" name="email" className={(error.info || validateError.email.error) ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="E-Mail" onChange={() => validateForm()} required/>
                                <span className='placeholder'>E-Mail</span>
                                <span className="errorText">{error.info ? error.info : validateError.email.error ? validateError.email.msg : ''}</span>
                            </div>
                            <div className="input-wrapper">
                                <input type="tel" name="phone" className={validateError.phone.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Telefon (mobil)" minLength="10" onChange={() => validateForm()} required/>
                                <span className='placeholder'>Telefon (mobil)</span>
                                <span className="errorText">{validateError.phone.msg}</span>
                            </div>
                        </div>
                    </div>
                    <div className="rowInputs-wrapper">
                        <div className="personalDataAddress rowInputs">
                            <div className="input-wrapper input-wrapper-lg">
                                <input type="text" name="street" className={validateError.street.error ? clickBtn === true ? 'error purple' : 'error' : null} id="route" placeholder="Strasse" onChange={() => validateForm()} required/>
                                <span className='placeholder'>Strasse</span>
                                <span className="errorText">{validateError.street.msg}</span>
                            </div>
                            <div className="input-wrapper input-wrapper-sm">
                                <input type="text" name="number" className={validateError.number.error ? clickBtn === true ? 'error purple' : 'error' : null} id="street_number" placeholder="Nr." onChange={() => validateForm()} required/>
                                <span className='placeholder'>Nr.</span>
                                <span className="errorText">{validateError.number.msg}</span>
                            </div>
                        </div>
                        <div className="personalDataCity rowInputs">
                            <div className="input-wrapper input-wrapper-sm">
                                <input type="text" name="zip" className={validateError.zip.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="PLZ" id="postal_code" onChange={() => validateForm()} required/>
                                <span className='placeholder'>PLZ</span>
                                <span className="errorText">{validateError.zip.msg}</span>
                            </div>
                            <div className="input-wrapper input-wrapper-lg">
                                <input type="text" name="city" className={validateError.city.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Stadt" id="locality" onChange={() => validateForm()} required/>
                                <span className='placeholder'>Stadt</span>
                                <span className="errorText">{validateError.city.msg}</span>
                            </div>
                        </div>
                    </div>
                    <div className="select">
                        { !country.countriesList.some( item => item.value === country.currentCountry.inputCountry.toLowerCase() )
                            && <input className="requiredSelect" type="text" required/>}

                        <Select
                            placeholder="Land"
                            value={country.currentCountry.inputCountry.toLowerCase()}
                            name="inputCountry"
                            clearable={false}
                            options={country.countriesList}
                            searchable={false}
                            required={true}
                            onChange={ (val) => changeCountry(val,"inputCountry")}/>
                            <span className='placeholder'>Auswählen</span>
                    </div>

                    { !user.isLogin && !inputCheckbox.asGuest &&
                        <div className="inputFullWidth rowInputs">
                            <input type="password"
                                   name="password"
                                   placeholder="Password (min. 8 Zeichen + min. 1 Nr. )"
                                   className={error.password ? 'error' : null}
                                   onChange={changePassword}
                                   required={!ifErrorPayment}/>
                            <span className="errorText">{error.password}</span>
                            <div className="statusBarPassword"/>
                        </div>
                    }
                    <label className={"shippingAddressCheck"}>
                        <input type="checkbox" name="shippingAddress" checked={inputCheckbox.shippingAddress === true ? true : false} onChange={changeCheckbox}/>
                        <span/> Diese Lieferadresse auch als Rechnungsadresse benutzen
                    </label>
                </div>
                <div className={ inputCheckbox.shippingAddress === true ? 'hide shippingForm' : 'shippingForm'}>
                    <div className="form-subheading">
                        <img src="/images/basket-form2.svg" alt=""/>
                        <h3>Rechnungsadresse</h3>
                    </div>
                    <div className="topPersonalData">
                        <div className="wrapLabel">
                            <div>
                                <div className={validateError.customer_gender.error ? clickBtn === true ? 'genderArea genderError purple' : 'genderArea genderError' : 'genderArea'} >
                                    <label><input type="radio" name="customer_gender" value="Herr" onClick={() => validateForm()} required={!inputCheckbox.shippingAddress}/><span/>Herr</label>
                                    <label><input type="radio" name="customer_gender" value="Frau" onClick={() => validateForm()} required={!inputCheckbox.shippingAddress}/><span/>Frau</label>        
                                </div>
                                <span className="errorText">{validateError.customer_gender.msg}</span>
                            </div>                            
                            <label><input type="checkbox"
                                          name="customerCompanyName"
                                          value="1"
                                          checked={inputCheckbox.customerCompanyName === true ? "true" : null}
                                          onClick={changeCheckbox}/><span className="check"/>
                                Firma</label>
                        </div>
                    </div>

                    <div className={inputCheckbox.customerCompanyName ? "rowInputs" : "rowInputs hide" }>
                        <div className="input-wrapper">
                            <input type="text" name="customer_companyName" className={validateError.customer_companyName.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Firma" onChange={() => validateForm()} required={inputCheckbox.customerCompanyName}/>
                            <span className='placeholder'>Firma</span>
                            <span className="errorText">{validateError.customer_companyName.msg}</span>
                        </div>
                    </div>
                    <div className="rowInputs-wrapper">
                        <div className="rowInputs" /*onChange={changeNameField}*/>
                            <div className="input-wrapper adjust-wrapper">
                                <input type="text" name="customer_firstname" className={validateError.customer_firstname.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder='Vorname' onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>Vorname</span>
                                <span className="errorText">{validateError.customer_firstname.msg}</span>
                            </div>
                            <div className="input-wrapper">
                                <input type="text" name="customer_lastname" className={validateError.customer_lastname.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Nachname" onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>Nachname</span>
                                <span className="errorText">{validateError.customer_lastname.msg}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rowInputs-wrapper">
                        <div className="rowInputs">
                            <div className="input-wrapper adjust-wrapper">
                                <input type="email" name="customer_email" className={(error.info || validateError.customer_email.error) ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="E-Mail" onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>E-Mail</span>
                                <span className="errorText">{error.info ? error.info : validateError.customer_email.msg !== "" ? validateError.customer_email.msg : ""}</span>
                            </div>
                            <div className="input-wrapper">
                                <input type="tel" name="customer_phone" className={validateError.customer_phone.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Telefon (mobil)" onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>Telefon (mobil)</span>
                                <span className="errorText">{validateError.customer_phone.msg}</span>
                            </div>
                        </div>
                    </div>
                    <div className="rowInputs-wrapper">
                        <div className="personalDataAddress rowInputs">
                            <div className="input-wrapper input-wrapper-lg">
                                <input type="text" name="customer_street" id="customer_route" className={validateError.customer_street.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Strasse" onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>Strasse</span>
                                <span className="errorText">{validateError.customer_street.msg}</span>
                            </div>
                            <div className="input-wrapper input-wrapper-sm">
                                <input type="text" name="customer_number" id="customer_street_number" className={validateError.customer_number.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Nr." onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>Nr.</span>
                                <span className="errorText">{validateError.customer_number.msg}</span>
                            </div>
                        </div>
                        <div className="personalDataCity rowInputs">
                            <div className="input-wrapper input-wrapper-sm">
                                <input type="text" name="customer_zip" className={validateError.customer_zip.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="PLZ" id="customer_postal_code" onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>PLZ</span>
                                <span className="errorText">{validateError.customer_zip.msg}</span>
                            </div>
                            <div className="input-wrapper input-wrapper-lg">
                                <input type="text" name="customer_city" className={validateError.customer_city.error ? clickBtn === true ? 'error purple' : 'error' : null} placeholder="Stadt" id="customer_locality" onChange={() => validateForm()} required={!inputCheckbox.shippingAddress}/>
                                <span className='placeholder'>Stadt</span>
                                <span className="errorText">{validateError.customer_city.msg}</span>
                            </div>
                        </div>
                    </div>
                    <div className="select">
                        { !country.countriesList.some( item => item.value === country.currentCountry.customer_inputCountry.toLowerCase() )
                            && inputCheckbox.shippingAddress !== true
                            && <input className="requiredSelect" type="text" required/>}
                        <Select
                            placeholder="Auswählen..."
                            value={country.currentCountry.customer_inputCountry.toLowerCase()}
                            name="customer_inputCountry"
                            clearable={false}
                            options={country.countriesList}
                            searchable={false}
                            onChange={ (val) => changeCountry(val,"customer_inputCountry")}/>
                        <span className='placeholder'>Auswählen</span>
                    </div>
                </div>
                <div className={'basketMobileBottom'}>
                    <div className="text-right button-row">
                        {!handlerSendSellBasket &&
                            <button type="button"  className={isValidate ? "basketSubmit btn button-pulse" : "basketSubmit btn"} onClick={() => onClickButton()}>
                                Weiter
                                <span><img src="images/arrow.svg" alt=""/></span>
                            </button>
                        }
                        {handlerSendSellBasket &&
                            <button type="submit"
                                    className={isValidate ? "basketSubmit btn button-pulse" : "basketSubmit btn"}
                                    onSubmit={handlerSendSellBasket}>
                                Absenden
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </button>
                        }
                    </div>
                    {window.isMobile &&  <div className="toPaymentWrap">
                        <button className={isValidate ? "btn toPayment button-pulse" : "btn toPayment"}
                                type="button"
                                onClick={() => onClickButton()}>
                            Weiter
                            <span><img src="images/arrow.svg" alt=""/></span>
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    )
}

PersonalData.propTypes = {}
PersonalData.defaultProps = {}

export default PersonalData
