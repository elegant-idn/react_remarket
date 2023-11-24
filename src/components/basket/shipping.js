import React, {useEffect, useState} from 'react';

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import de from 'date-fns/locale/de';
registerLocale('de', de);

const Shipping = ({ choiceShipping, chooseShippingMethod, shippingMethod, shippingMethods, total, handlerSendForm, handlerShowHideBlocks, placeDescription, changeCheckbox, inputCheckbox, error, errorNoProducts}) => {
    const order = (e) => {        
        if (inputCheckbox.agree === true) {
            e.preventDefault();
            let button = $(".order");
            if(!button.hasClass('animate')) {
                button.addClass('animate');
                handlerSendForm(e);
            }
        }
    }
    return (
        <div>
            <div className="shippingMethod">
                <h3 className="title"
                    onClick={e => handlerShowHideBlocks(e)}
                    data-step="shippingMethod">
                    <span className="num">3</span>
                    <span className="text">Versand</span>
                    <span className="arrow"><i className="fa fa-angle-down" aria-hidden="true"/></span>
                </h3>
                <div className="wrapperItemBasket">
                    <div className="">
                        <ul>
                            {
                                shippingMethods.map( ( item, i ) => {
                                    return(
                                        <li key={`shippingMethod-${i}`} onClick={chooseShippingMethod} className={shippingMethod.selected && shippingMethod.value.name === item.name ? 'active' : '' }>
                                            <input type="radio" 
                                                data-id={item.id}
                                                data-value={item.name}
                                                name="shipping_method"
                                                className="radio-check"
                                                id={`radio-shippingMethod-${item.id}`}
                                                value={`${item.name} ${item.shortcode==="PICKAS"?placeDescription:""} (${item.price} ${window.currencyValue})`} 
                                                required
                                                readOnly={true}
                                                checked={shippingMethod.selected && shippingMethod.value.name === item.name} />
                                            <label htmlFor={`radio-shippingMethod-${item.id}`}>
                                                <div className="radio-container">
                                                    <div className="cRadioBtn">
                                                        <div className="overlay"></div>
                                                        <div className="drops xsDrop"></div>
                                                        <div className="drops mdDrop"></div>
                                                        <div className="drops lgDrop"></div>
                                                    </div>
                                                </div>
                                                <span className="shipping-title">
                                                    {item.name} {item.shortcode === "PICKAS"?placeDescription:""}
                                                    <div className={"shipping-note"}>
                                                        shipping-description
                                                    </div>
                                                    <div className={"shipping-price"}>
                                                        {item.price} {window.currencyValue}
                                                    </div>
                                                </span>
                                                <span className="shipping-img">
                                                    <img src={`/images/icons/shipping-type/${item.shortcode}.png`} alt="" />
                                                </span>
                                            </label>
                                        </li>
                                        // <li key={i} onClick={chooseShippingMethod} className={shippingMethod.selected && shippingMethod.value.name === item.name ? 'active' : '' }>
                                        //     <label data-id={item.productTypeId}
                                        //            data-value={item.name}>
                                        //         <input type="radio"
                                        //                name="shipping_method"
                                        //                value={`${item.name} ${item.shortcode==="PICKAS"?placeDescription:""} (${item.price} ${window.currencyValue})`}
                                        //                required
                                        //                readOnly={true}
                                        //                checked={shippingMethod.selected && shippingMethod.value.name === item.name}/>
                                        //         <span className="radio" />                                                
                                        //         <span className="wrapItemMethod">
                                        //             <span className="name">{item.name} {item.shortcode === "PICKAS"?placeDescription:""}</span>
                                        //             <br/>
                                        //             <span className="price">{item.price} {window.currencyValue}</span>
                                        //         </span>
                                        //         <span className="shipping-img">
                                        //             <img src={`/images/icons/shipping-type/${item.shortcode}.png`} alt="" />
                                        //         </span>                                                
                                        //     </label>
                                        // </li>

                                        
                                    )
                                })
                            }
                            {
                                choiceShipping && (
                                <li>
                                    <span className="choiceShipping">
                                        {`Es muss eine Versandmethode angegeben werden`}
                                    </span>                                
                                </li>
                                )
                            }
                            
                        </ul>
                    </div>
                    <span className="agree">
                        <label>
                            <input type="checkbox"
                                    name="agree"
                                    required
                                    onChange={changeCheckbox}
                                />
                            <span className={!inputCheckbox.agree && shippingMethod.selected ? "checkbox button-pulse" : "checkbox"}/>
                            <span className="description">Ich habe die <a href="/ueber-uns/agb" target="_blank">AGB</a> und die <a
                                href="/ueber-uns/datenschutzerklaerung"
                                target="_blank">Datenschutzerklärung</a> gelesen und akzeptiere diese</span>
                        </label>                        
                    </span>
                    <div className={'basketMobileBottom'}>
                        {errorNoProducts && 
                            <div className="basketError">
                                <img src="/images/design/warning.svg" alt=""/>
                                <span>
                                    {errorNoProducts}
                                </span>
                            </div>
                        }
                        {error && error.general !== '' && 
                            <div className="basketError">
                                <img src="/images/design/warning.svg" alt=""/>
                                <span>
                                    {error.general}
                                </span>
                            </div>
                        }
                        {!window.isMobile && (
                                <div className={inputCheckbox.agree ? "text-left button-row button-pulse" : "text-left button-row"} style={{display: 'inline-block', borderRadius: '3px'}}>
                                    <button className="order" onClick={(e) => order(e)}>
                                        <span className="default">
                                            Bestellung senden
                                            <div className='arrow-image'>
                                                <img src="images/arrow.svg" alt=""/>
                                            </div>                                
                                        </span>
                                        <span className="success">Bestellung aufgegeben
                                            <svg viewBox="0 0 12 10">
                                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                            </svg>
                                        </span>
                                        <div className="box"></div>
                                        <div className="truck">
                                            <div className="back"></div>
                                            <div className="front">
                                                <div className="window"></div>
                                            </div>
                                            <div className="light top"></div>
                                            <div className="light bottom"></div>
                                        </div>
                                        <div className="lines"></div>
                                    </button>
                                </div>
                        )}
                        {window.isMobile &&
                            <div className={inputCheckbox.agree ? "toPaymentWrap button-pulse" : "toPaymentWrap"}>
                                {/* <button className="btn toPayment"
                                        type="button"
                                        onClick={handlerSendForm}>
                                    Jetzt bestellen
                                    <span><img src="images/arrow.svg" alt=""/></span>
                                </button>
                                <br/> */}
                                <button className="order" onClick={(e) => order(e)}>
                                    <span className="default">
                                        Jetzt bestellen
                                        <div className='arrow-image'>
                                            <img src="images/arrow.svg" alt=""/>
                                        </div>                                
                                    </span>
                                    <span className="success">Bestellung aufgegeben
                                        <svg viewBox="0 0 12 10">
                                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                        </svg>
                                    </span>
                                    <div className="box"></div>
                                    <div className="truck">
                                        <div className="back"></div>
                                        <div className="front">
                                            <div className="window"></div>
                                        </div>
                                        <div className="light top"></div>
                                        <div className="light bottom"></div>
                                    </div>
                                    <div className="lines"></div>
                                </button>
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

Shipping.propTypes = {}
Shipping.defaultProps = {}

export default Shipping
