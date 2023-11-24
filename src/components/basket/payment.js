import React, { useState } from 'react';
import { MuiPickersUtilsProvider , KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from "date-fns/locale/de";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import de from 'date-fns/locale/de';
registerLocale('de', de);



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

const Payment = ({ choosePayMethod, shippingMethod, domain, checkedPayByCredits, goToDelivery,
                              totalPrice, credits, userIsLogin, changeCreditsInput,
                                  handlerNextTab, handlerShowHideBlocks, onNoteToggle, dobChange, dobChange1, payMethod, payMethodError, noteShow, noteShow1, noteShow2}) => {
    let ifRequired = (Math.round(totalPrice * 100)/100) !== 0,
        creditsCurrentVal = '' + credits.currentValue,
        creditsInputWidth = ((creditsCurrentVal.split('').length+1) * 8) + 20 + 'px';

    const [startDate, setStartDate] = useState(new Date(1999,0,1));
    const [startDate1, setStartDate1] = useState(new Date(1999,0,1));
    const dateClasses = useStyles();
    const samsung = new URLSearchParams(window.location.search).get("samsung")
    const apple = new URLSearchParams(window.location.search).get("apple")

    return (
        <div>
            <div className="paymentMethod">
               <h3 className={(Math.round(totalPrice * 100)/100) === 0 ? 'title answering' : 'title'}
                    onClick={e => handlerShowHideBlocks(e)}
                    data-step="paymentMethod" id="paymentPanel">
                    <span className="num">1</span><span className="text">Zahlungsart</span>
                    <span className="arrow"><i className="fa fa-angle-up" aria-hidden="true"/></span>
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
                                            <li className={payMethod.method === 'Payrexx' && payMethod.paymethodpayrexx === 'bob-invoice'  ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Payrexx-bob-invoice" value="Payrexx" data-paymethodpayrexx="bob-invoice" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Payrexx-bob-invoice">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        Zahlung per Rechnung oder Ratenzahlung (BobFinance)
                                                        <div className={"payment-note"}>
                                                            0%-Zinsen - Bezahlen Sie die Ware bequem erst nach Erhalt der Ware per Rechnung / Einzahlungsschein in bis zu 3 Monatsraten. Der Einzahlungsschein wird nach Verifizierung des Anbieters direkt per E-Mail von BobFinance zugestellt.
                                                        </div>
                                                        {/* <div id="dob-field" className={noteShow ? "payment-note" : "payment-note disabled"}>
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
                                                        </div> */}
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/109.png" className="payment-icon" alt="BobFinance" />
                                                    </span>
                                                </label>
                                            </li>

                                            <li className={payMethod.method === 'HeidiPay' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-HeidiPay" value="HeidiPay" required={ifRequired} onChange={(e) => onNoteToggle(e)}/>
                                                <label  htmlFor="radio-HeidiPay">
                                                <div className="radio-container">
                                                    <div className="cRadioBtn">
                                                        <div className="overlay"></div>
                                                        <div className="drops xsDrop"></div>
                                                        <div className="drops mdDrop"></div>
                                                        <div className="drops lgDrop"></div>
                                                    </div>
                                                </div>
                                                <span className="payment-title">
                                                        Ratenzahlung mit <strong>0%-Zinsen</strong> bis max. 12 Monate (Debit- und Kreditkarten) - HeidiPay
                                                        <div className={"payment-note"}>
                                                            HeidiPay Description
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/HeidiPay-logo-small.png" className="payment-icon" alt="HeidiPay" />
                                                    </span>
                                                </label>
                                            </li>


                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'VIS' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-VIS" value="Datatrans" data-paymethoddatatrans="VIS" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-VIS">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        Visa
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit der Visa Debit- oder Kreditkarte zahlen Sie schnell und sicher. Ihre Bestellung wird sofort nach Verifizierung des Kartenanbieters bei uns ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                    <img src="/images/icons/payment-type/4.png" className="payment-icon" alt="Visa" />
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'ECA' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-ECA" value="Datatrans" data-paymethoddatatrans="ECA" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-ECA">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        Mastercard
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit der Mastercard Debit- oder Kreditkarte zahlen Sie schnell und sicher. Ihre Bestellung wird sofort nach Verifizierung des Kartenanbieters bei uns ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/5.png" className="payment-icon" alt="Mastercard" />
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'AMX' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-AMX" value="Datatrans" data-paymethoddatatrans="AMX" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-AMX">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                    American Express
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit der American Express Kreditkarte zahlen Sie schnell und sicher. Ihre Bestellung wird sofort nach Verifizierung des Kartenanbieters bei uns ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/7.png" className="payment-icon" alt="American Express" />
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'PFC' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-PFC" value="Datatrans" data-paymethoddatatrans="PFC" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-PFC">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                    PostFinance Card
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit der Postcard wird der Betrag direkt von Ihrem PostFinance-Konto abgebucht und die Bestellung wird sofort ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/3.png" className="payment-icon" alt="PostFinance Card" />
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'TWI' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-TWI" value="Datatrans" data-paymethoddatatrans="TWI" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-TWI">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        TWINT Wallet
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit Twint bezahlen Sie bequem direkt per Smartphone (iOS und Android) und die Bestellung wird sofort ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/17.png" className="payment-icon" alt="TWINT Wallet" />
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'DIB' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-DIB" value="Datatrans" data-paymethoddatatrans="DIB" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-DIB">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        Sofortüberweisung
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit Sofortüberweisung wird der Betrag direkt von Ihrem Bankkonto abgebucht und die Bestellung wird sofort ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/21.png" className="payment-icon" alt="Sofortüberweisung"/>
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Payrexx' && payMethod.paymethodpayrexx === 'apple-pay' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Payrexx-apple-pay" value="Payrexx" data-paymethodpayrexx="apple-pay" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Payrexx-apple-pay">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        Apple Pay
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit Apple Pay bezahlen Sie bequem direkt per Apple Device und die Bestellung wird sofort ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/107.png" className="payment-icon" alt="Apple Pay" />
                                                    </span>
                                                </label>
                                            </li>
                                            <li className={payMethod.method === 'Datatrans' && payMethod.paymethoddatatrans === 'SAM' ? 'active' : '' }>
                                                <input type="radio" name="payment_method" className="radio-check" id="radio-Datatrans-SAM" value="Datatrans" data-paymethoddatatrans="SAM" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                                                <label htmlFor="radio-Datatrans-SAM">
                                                    <div className="radio-container">
                                                        <div className="cRadioBtn">
                                                            <div className="overlay"></div>
                                                            <div className="drops xsDrop"></div>
                                                            <div className="drops mdDrop"></div>
                                                            <div className="drops lgDrop"></div>
                                                        </div>
                                                    </div>
                                                    <span className="payment-title">
                                                        Samsung Pay
                                                        <div className={"payment-note"}>
                                                            0%-Gebühren - Mit Samsung Pay bezahlen Sie bequem direkt per Samsung Smartphone / Tablet und die Bestellung wird sofort ausgelöst.
                                                        </div>
                                                    </span>
                                                    <span className="payment-img">
                                                        <img src="/images/icons/payment-type/110.png" className="payment-icon" alt="Samsung Pay" />
                                                    </span>
                                                </label>
                                            </li>

                                            {/* <li><label><input type="radio" name="payment_method" value="Vorauskasse/Überweisung" data-paymethoddatatrans="BNK" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/10.png" width="24" height="24" className="payment-icon" alt="Vorauskasse" />
                                                Banküberweisung</label>
                                                <div className="payment-note">
                                                Ware wird erst nach Zahlungseingang versendet. Die Zahlung muss innerhalb von 3 Werktagen erfolgen, ansonsten wird die Bestellung wieder storniert.
                                            </div></li>

                                            <li><label><input type="radio" name="payment_method" value="Bitcoin" onChange={(e) => onNoteToggle(e)}/>
                                                <span className="radio"/>
                                                <img src="/images/icons/payment-type/bitcoin.png" width="24" height="24" className="payment-icon" alt="Bitcoin" />
                                                BitPay (Bitcoin, Ethereum, Litecoin, Doge, Stablecoins etc.)</label></li> */}
                                        </div>
                        }
                        <li className={payMethod.method === 'PayPal' ? 'active' : '' }>
                            <input type="radio" name="payment_method" className="radio-check" id="radio-PayPal" value="PayPal" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                            <label htmlFor="radio-PayPal">
                                <div className="radio-container">
                                    <div className="cRadioBtn">
                                        <div className="overlay"></div>
                                        <div className="drops xsDrop"></div>
                                        <div className="drops mdDrop"></div>
                                        <div className="drops lgDrop"></div>
                                    </div>
                                </div>
                                <span className="payment-title">
                                    PayPal
                                    <div className={"payment-note"}>
                                        0%-Gebühren - Mit der PayPal wird der Betrag direkt von Ihrem PayPal-Konto bzw. Ihrer Kreditkarte abgebucht und die Bestellung wird sofort ausgelöst.
                                    </div>
                                </span>
                                <span className="payment-img">
                                    <img src="/images/icons/payment-type/6.png" className="payment-icon" alt="PayPal" />
                                </span>
                            </label>
                        </li>
                        <li className={payMethod.method === 'Vorauskasse/Überweisung' && payMethod.paymethoddatatrans === 'BNK' ? 'active' : '' }>
                            <input type="radio" name="payment_method" className="radio-check" id="radio-Vorauskasse-BNK" value="Vorauskasse/Überweisung" data-paymethoddatatrans="BNK" required={ifRequired} onChange={(e) => onNoteToggle(e)} />
                            <label htmlFor="radio-Vorauskasse-BNK">
                                <div className="radio-container">
                                    <div className="cRadioBtn">
                                        <div className="overlay"></div>
                                        <div className="drops xsDrop"></div>
                                        <div className="drops mdDrop"></div>
                                        <div className="drops lgDrop"></div>
                                    </div>
                                </div>
                                <span className="payment-title">
                                    Banküberweisung / Vorauskasse
                                    <div className={"payment-note"}>
                                        0%-Gebühren - Bei der Bezahlung via Banküberweisung senden wir Ihnen die Zahlungsinformationen per E-Mail zu. Ware wird erst nach Zahlungseingang versendet. Die Zahlung muss innerhalb von 3 Werktagen erfolgen, ansonsten wird die Bestellung wieder storniert.
                                    </div>
                                </span>
                                <span className="payment-img">
                                    <img src="/images/icons/payment-type/10.png" className="payment-icon" alt="Banküberweisung" />
                                </span>
                            </label>
                        </li>
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
                    <div className={'basketMobileBottom'}>
                        {payMethodError && payMethodError.status &&
                            <div className="basketError">
                                <img src="/images/design/warning.svg" alt=""/>
                                <span>
                                    {payMethodError.msg}
                                </span>
                            </div>
                        }
                        {!window.isMobile &&
                                <div className="text-right button-row">
                                    <button type="button"  className={payMethod.method ? "basketSubmit btn button-pulse" : "basketSubmit btn"} onClick={handlerNextTab}>
                                        Weiter
                                        <span><img src="images/arrow.svg" alt=""/></span>
                                    </button>
                                </div>
                        }
                        {window.isMobile &&
                                <button type="button" className={payMethod.method ? "btn toDelivery button-pulse" : "btn toDelivery"}
                                    onClick={goToDelivery}>
                                        Weiter
                                    <span><img src="images/arrow.svg" alt=""/></span>
                                </button>
                        }
                    </div>
                    {/* <div className="text-right button-row">
                        <button type="submit" className="basketSubmit btn hideBtn" onSubmit={handlerSendForm}>
                            {!window.isMobile ? 'Bestellung senden' : `${total} ${window.currencyValue} jetzt bezahlen`}
                            <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

Payment.propTypes = {}
Payment.defaultProps = {}

export default Payment
