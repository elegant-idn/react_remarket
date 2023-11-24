import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import { MuiPickersUtilsProvider , KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from "date-fns/locale/de";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import de from 'date-fns/locale/de';
registerLocale('de', de);
import PropTypes from 'prop-types'



const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

const ShippingAndPayment = ({ choosePayMethod, chooseShippingMethod, shippingMethod, shippingMethods, domain, checkedPayByCredits,
                              goToPayment, totalPrice, credits, total, userIsLogin, changeCreditsInput,
                                  showTabs, handlerNextTab, handlerSendForm, handlerShowHideBlocks, placeDescription, changeCheckbox, onNoteToggle, dobChange, dobChange1, noteShow, noteShow1, noteShow2, isVorauskasse}) => {
    let ifRequired = (Math.round(totalPrice * 100)/100) !== 0,
        creditsCurrentVal = '' + credits.currentValue,
        creditsInputWidth = ((creditsCurrentVal.split('').length+1) * 8) + 20 + 'px';

    const [startDate, setStartDate] = useState(new Date(1999,0,1));
    const [startDate1, setStartDate1] = useState(new Date(1999,0,1));
    const dateClasses = useStyles();
    const samsung = new URLSearchParams(window.location.search).get("samsung")
    const apple = new URLSearchParams(window.location.search).get("apple")
    const swissbilling = new URLSearchParams(window.location.search).get("swissbilling")

    return (
        <div>
            <div className="shippingMethod">
                <h3 className="title"
                    onClick={e => handlerShowHideBlocks(e)}
                    data-step="shippingMethod">
                    <span className="num">2</span>
                    <span className="text">Versand</span>
                    <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
                </h3>
                <div className="wrapperItemBasket">
                    <div className="">
                        <ul>
                            {
                                shippingMethods.map( ( item, i ) => {
                                    return(
                                        <li key={ i} onClick={chooseShippingMethod}>
                                            <label data-id={item.productTypeId}
                                                   data-value={item.name}>
                                                <input type="radio"
                                                       name="shipping_method"
                                                       value={`${item.name} ${item.shortcode==="PICKAS"?placeDescription:""} (${item.price} ${window.currencyValue})`}
                                                       required
                                                       readOnly={true}
                                                       defaultChecked={shippingMethod.selected && shippingMethod.value.name === item.name}/>
                                                <span className="radio"/>
                                                <img src={`/images/icons/shipping-type/${item.shortcode}.png`} alt="" style={{paddingRight: '15px', height: '35px'}}/>
                                                <span className="wrapItemMethod">
                                                    <span className="name">{item.name} {item.shortcode === "PICKAS"?placeDescription:""}</span>
                                                    <br/>
                                                    <span className="price">{item.price} {window.currencyValue}</span>
                                                </span>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    {!showTabs.paymentMethod && !window.isMobile &&
                        <div className="text-right button-row">
                            <button type="button"  className="basketSubmit btn" onClick={handlerNextTab}>
                                Weiter
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </button>
                        </div>
                    }
                </div>
                {window.isMobile &&  <div className="toPaymentWrap">
                                                                    <button className="btn toPayment"
                                                                            type="button"
                                                                            onClick={goToPayment}>Zu den Zahlungsoptionen</button>
                                                                </div>

                }
            </div>
            <div className="paymentMethod">
               <h3 className={(Math.round(totalPrice * 100)/100) === 0 ? 'title answering' : 'title'}
                    onClick={e => handlerShowHideBlocks(e)}
                    data-step="shippingMethod">
                    <span className="num">3</span><span className="text">Zahlungsart</span>
                    <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
                </h3>
                <div className="wrapperItemBasket">
                    <ul onChange={choosePayMethod}>
                        { ( userIsLogin && credits.totalCredits > 0) &&
                            <li>
                                <label>
                                    <input type="checkbox"
                                           name="payment_method"
                                           value="payByCredits"
                                           defaultChecked={checkedPayByCredits}/>
                                    <span className="radio check"/>
                                    <img src="/images/icons/payment-type/credits.png" width="24" height="24" className="payment-icon" alt="Credits" />
                                    Credits (Total: {credits.totalCredits})
                                    <input id="creditsInput"
                                           style={{width : creditsInputWidth}}
                                           type="number"
                                           pattern="[0-9]+"
                                           onChange={!checkedPayByCredits && changeCreditsInput}
                                           value={credits.currentValue} />
                                </label>
                                { credits.errorCredits &&  <p className="errorText"> { credits.errorCredits }</p>}
                            </li>
                        }
                        { shippingMethod.value.shortcode === 'PICKAS' &&
                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="payInShop" onChange={(e) => onNoteToggle(e)}/>
                                <span className="radio"/>
                                Zahlung bei Abholung</label>
                            </li>
                        }
                        {domain === 2 &&
                                        <div>
                                            {

                                            /*<li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="DIN"/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/8.png" width="24" height="24" className="payment-icon" alt="Diners Club" />
                                                Diners Club</label></li>
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="ELV"/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/18.png" width="24" height="24" className="payment-icon" alt="Diners Club" />
                                                Lastschrift</label></li>
                                                <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="AMX"/>
                                                        <span className="radio"/>
                                                        <img src="/images/icons/payment-type/7.png" width="24" height="24" className="payment-icon" alt="American Express" />
                                                        American Express</label></li>*/}
                                            { false && (
                                                <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="INT" onChange={(e) => onNoteToggle(e)}/>
                                                    <span className="radio"/>
                                                    <img src="/images/icons/payment-type/104.png" width="24" height="24" className="payment-icon" alt="Byjuno" />
                                                    Zahlung per Rechnung (Byjuno)</label>
                                                    <div id="dob-field" className={noteShow ? "payment-note" : "payment-note disabled"}>
                                                        Bezahlen Sie die Ware bequem erst nach Erhalt der Ware per Rechnung / Einzahlungsschein. Der Einzahlungsschein wird per E-Mail oder auf Wunsch per Post von Byjuno AG zugestellt.<br/><br/>
                                                        Bitte geben Sie Ihr Geburtsdatum ein:
                                                        {/* <DatePicker
                                                        dateFormat="dd.MM.yyyy"
                                                        selected={startDate}
                                                        onChange={ (date) => { setStartDate(date); dobChange(date) } }
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        locale="de"
                                                        dropdownMode="select"
                                                        /> */}
                                                        {!window.isMobile &&
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
                                                                <KeyboardDatePicker
                                                                    value={startDate}
                                                                    invalidDateMessage="Falsches Datumsformat"
                                                                    cancelLabel="abbrechen"
                                                                    onChange={ (date) => {setStartDate(date); dobChange(date) }}
                                                                    format="dd.MM.yyyy"
                                                                    />
                                                            </MuiPickersUtilsProvider>
                                                        }
                                                        {window.isMobile &&
                                                            <form className={dateClasses.container} noValidate>
                                                            <TextField
                                                                id="birth_date"
                                                                type="date"
                                                                defaultValue="1999-01-01"
                                                                className={dateClasses.textField}
                                                                onChange={ (date) =>
                                                                    {
                                                                        setStartDate(new Date(date.target.value+'T01:00:00'));
                                                                        dobChange(new Date(date.target.value+'T01:00:00'))
                                                                    }
                                                                }
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}

                                                            />
                                                            </form>
                                                        }
                                                    </div>
                                                </li>
                                            )}
                                            { false && (
                                            <li>
                                                <label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="INT1" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/104.png" width="24" height="24" className="payment-icon" alt="Byjuno" />
                                                Zahlung per Ratenzahlung (Byjuno)</label>
                                                <div id="dob-field1" className={noteShow1 ? "payment-note" : "payment-note disabled"}>

                                                Bezahlen Sie die Ware bequem erst nach Erhalt der Ware und zahlen Sie anschliessend bequem in Monatsraten. Der Rechnungsbetrag kann in bis zu drei Monatsraten aufgeteilt werden: Die erste Rate ist innerhalb von 20 Tagen nach dem Bestelldatum, die zweite im darauffolgenden Monat und die dritte 60 Tage nach dem Bestelldatum fällig.<br />
                                                Mindestbetrag bei der ersten Teilzahlung: 10% vom Gesamtbetrag.<br />
                                                Auf den Restbeträgen werden Zinskosten und Gebühren gemäss den Allgemeinen Geschäftsbedingungen erhoben.
                                                <br/><br/>
                                                Bitte geben Sie Ihr Geburtsdatum ein:
                                                    {!window.isMobile &&
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
                                                            <KeyboardDatePicker
                                                                value={startDate1}
                                                                invalidDateMessage="Falsches Datumsformat"
                                                                cancelLabel="abbrechen"
                                                                onChange={ (date) => {setStartDate1(date); dobChange1(date) }}
                                                                format="dd.MM.yyyy"
                                                                />
                                                        </MuiPickersUtilsProvider>
                                                    }
                                                    {window.isMobile &&
                                                        <form className={dateClasses.container} noValidate>
                                                        <TextField
                                                            id="birth_date1"
                                                            type="date"
                                                            defaultValue="1999-01-01"
                                                            className={dateClasses.textField}
                                                            onChange={ (date) =>
                                                                {
                                                                    setStartDate1(new Date(date.target.value+'T01:00:00'));
                                                                    dobChange1(new Date(date.target.value+'T01:00:00'))
                                                                }
                                                            }
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}

                                                        />
                                                        </form>
                                                    }
                                                </div>
                                            </li>
                                            )}

                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="SWB" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/106.png" width="24" height="24" className="payment-icon" alt="Swissbilling" />
                                                Zahlung per Rechnung oder Ratenzahlung (Swissbilling)</label>
                                                <div id="dob-field" className={noteShow ? "payment-note" : "payment-note disabled"}>
                                                    Bezahlen Sie die Ware bequem erst nach Erhalt der Ware per Rechnung oder Ratenzahlung. Der Einzahlungsschein wird per E-Mail oder auf Wunsch per Post von swissbilling AG zugestellt.<br/><br/>
                                                    Im nächsten Schritt können auswählen, in wie vielen Raten Sie den Gesamtbetrag begleichen wollen.
                                                    Bitte geben Sie Ihr <strong>Geburtsdatum</strong> ein:
                                                    {!window.isMobile &&
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
                                                            <KeyboardDatePicker
                                                                value={startDate}
                                                                invalidDateMessage="Falsches Datumsformat"
                                                                cancelLabel="abbrechen"
                                                                onChange={ (date) => {setStartDate(date); dobChange(date) }}
                                                                format="dd.MM.yyyy"
                                                                />
                                                        </MuiPickersUtilsProvider>
                                                    }
                                                    {window.isMobile &&
                                                        <form className={dateClasses.container} noValidate>
                                                        <TextField
                                                            id="birth_date"
                                                            type="date"
                                                            defaultValue="1999-01-01"
                                                            className={dateClasses.textField}
                                                            onChange={ (date) =>
                                                                {
                                                                    setStartDate(new Date(date.target.value+'T01:00:00'));
                                                                    dobChange(new Date(date.target.value+'T01:00:00'))
                                                                }
                                                            }
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}

                                                        />
                                                        </form>
                                                    }
                                                </div>
                                            </li>

                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="VIS" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/4.png" width="24" height="24" className="payment-icon" alt="Visa" />
                                                Visa</label></li>
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="ECA" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/5.png" width="24" height="24" className="payment-icon" alt="Mastercard" />
                                                Mastercard</label></li>
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="AMX" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/7.png" width="24" height="24" className="payment-icon" alt="American Express" />
                                                American Express</label></li>
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="PFC" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/3.png" width="24" height="24" className="payment-icon" alt="PostFinance Card" />
                                                PostFinance Card</label></li>
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="TWI" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/17.png" width="24" height="24" className="payment-icon" alt="TWINT Wallet" />
                                                TWINT Wallet</label></li>
                                            {false && (
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="MFX" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/20.png" width="24" height="24" className="payment-icon" alt="Kauf auf Rechnung (Powerpay)" />
                                                Kauf auf Rechnung (Powerpay)</label>
                                                <div className={noteShow ? "payment-note" : "payment-note disabled"}>Die Monatsrechnung wird im Folgemonat von MF Finance AG / PowerPay per Post zugestellt. Bitte beachten Sie, dass pro Rechnung eine Administrationsgebühr von CHF 2.90 anfällt.</div>
                                            </li>
                                            )}
                                            {/* <li><label><input type="radio" name="payment_method" required={ifRequired}
                                                              value="Datatrans" data-paymethoddatatrans="DIB"
                                                              onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/21.png" width="24" height="24"
                                                     className="payment-icon" alt="Sofortüberweisung"/>
                                                Sofortüberweisung </label></li> */}
                                            { samsung &&
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="SAM" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/107.png" width="24" height="24" className="payment-icon" alt="Samsung Pay" />
                                                Samsung Pay</label></li>

                                            }
                                            { apple &&
                                            <li><label><input type="radio" name="payment_method" required={ifRequired} value="Datatrans" data-paymethoddatatrans="APL" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/108.png" width="24" height="24" className="payment-icon" alt="Apple Pay" />
                                                Apple Pay</label></li>

                                            }
                                            {/* <li><label><input type="radio" name="payment_method" value="Bitcoin" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/bitcoin.png" width="24" height="24" className="payment-icon" alt="Bitcoin" />
                                                BitPay (Bitcoin, Ethereum, Litecoin, Doge, Stablecoins etc.)</label></li> */}
                                        </div>
                        }
                        {domain === 3 &&
                            <div>
                                <li><label><input type="radio" name="payment_method" required={ifRequired} value="Stripe"/>
                                    <span className="radio"/>
                                    <img src="/images/icons/payment-type/4.png" width="24" height="24" className="payment-icon" alt="Visa" />
                                    Visa</label></li>
                                <li><label><input type="radio" name="payment_method" required={ifRequired} value="Stripe"/>
                                    <span className="radio"/>
                                    <img src="/images/icons/payment-type/5.png" width="24" height="24" className="payment-icon" alt="Mastercard" />
                                    Mastercard</label></li>
                                <li><label><input type="radio" name="payment_method" required={ifRequired} value="Stripe"/>
                                    <span className="radio"/>
                                    <img src="/images/icons/payment-type/7.png" width="24" height="24" className="payment-icon" alt="American Express" />
                                    American Express</label></li>
                            </div>
                        }
                        <li><label><input type="radio" name="payment_method" required={ifRequired} value="PayPal" />
                            <span className="radio"/>
                            <img src="/images/icons/payment-type/6.png" width="24" height="24" className="payment-icon" alt="PayPal" />
                            PayPal</label></li>
                            <li><label><input type="radio" name="payment_method" value="Vorauskasse/Überweisung" data-paymethoddatatrans="BNK" onChange={(e) => onNoteToggle(e)}/>
                            <span className="radio"/>
                            <img src="/images/icons/payment-type/10.png" width="24" height="24" className="payment-icon" alt="Vorauskasse" />
                            Banküberweisung</label>
                            <div className={noteShow2 ? "payment-note" : "payment-note disabled"}>
                            Ware wird erst nach Zahlungseingang versendet. Die Zahlung muss innerhalb von 3 Werktagen erfolgen, ansonsten wird die Bestellung wieder storniert.
                            </div></li>

                        {/*<li><label><input type="radio" name="payment_method" value="Bitcoin"/>
                            <span className="radio"/>
                            <img src="/images/icons/payment-type/bitcoin.png" width="24" height="24" className="payment-icon" alt="Bitcoin" />
                            Bitcoin</label></li>
                            */}
                        {/*<li><label><input type="radio" name="payment_method" value="Sofortüberweisung"/>
                            <span className="radio"/>
                            Sofortüberweisung</label></li>
                        <li><label><input type="radio" name="payment_method" value="MF Group"/>
                            <span className="radio"/>
                            <img src="/images/icons/payment-type/12.png" width="24" height="24" className="payment-icon" alt="Per Rechnung" />
                            Per Rechnung</label></li>*/}
                    </ul>
                    <span className="agree">
                                                                            <label>
                                                                                <input type="checkbox"
                                                                                       name="agree"
                                                                                       required
                                                                                       onChange={changeCheckbox}
                                                                                    />
                                                                                <span className="checkbox"/>
                                                                            </label>
                                                                            <span>Ich habe die <a
                                                                                href="/ueber-uns/agb" target="_blank">AGB</a> und die <a
                                                                                href="/ueber-uns/datenschutzerklaerung"
                                                                                target="_blank">Datenschutzerklärung</a> gelesen und akzeptiere diese</span><br /><br />

                                                                        </span>
                    <div className="text-right button-row">
                        <button type="submit" className="basketSubmit btn hideBtn" onSubmit={handlerSendForm}>
                            {!window.isMobile ? 'Bestellung senden' : `${total} ${window.currencyValue} jetzt bezahlen`}
                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ShippingAndPayment.propTypes = {}
ShippingAndPayment.defaultProps = {}

export default ShippingAndPayment
