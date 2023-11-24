import React from 'react'
import { useState, useEffect } from 'react'
import {Animated} from "react-animated-css"
import {Link} from 'react-router'

const AdditionalInfoBlock = ({model, deviceStatus, basketData, addModelToBasket, domain, warranty, isAccessory, deadline, activateCountDownCoupon, deadlineIsActive, deadlineExpired, deadlineTimer, className=''}) => {
    const [month, setMonth] = useState(3);
    const [rentMonth, setRentMonth] = useState(1)
    const [positionSlide, setPositionSlide] = useState(20)
    const [positionSlideRent, setPositionSlideRent] = useState(10)
    const [monthPrice, setMonthPrice] = useState('00.00')
    const [firstLoaded, setFirstLoaded] = useState(true);

    let sellPrice = model.price
    if (model.discountPrice)
        sellPrice = model.discountPrice

    /*
    // disable this rule for swissbilling
    let showLevel = 0
    if (parseFloat(sellPrice) < 150 ) {
        showLevel = 0
    } else if (parseFloat(sellPrice) >= 150 && parseFloat(sellPrice) < 300) {
        showLevel = 1
    } else if (parseFloat(sellPrice) >= 300 && parseFloat(sellPrice) < 600) {
        showLevel = 2
    } else if (parseFloat(sellPrice) >= 600) {
        showLevel = 3
    }
    */

    let showLevel = 3

    useEffect(() => {
        setMonthPrice((sellPrice / showLevel).toFixed(2))
    }, [showLevel, sellPrice]);

    // This is for hedipay

    // if not device, use original logic
    // if (model.productTypeId !== 7 && model.productTypeId !== 4) {
    //     showLevel = 0
    // }


    function _calculateDeliveryDateShop(){
        let nowDate = new Date(),
            dayOfWeek = nowDate.getDay(),
            hour = nowDate.getHours(),
            minutes = nowDate.getMinutes(),
            deliveryDate = null,
            formatter = new Intl.DateTimeFormat("ru")
        switch (dayOfWeek){
            case 6:
                if(hour < 18 || (hour === 18 && minutes === 0)){
                    deliveryDate = formatter.format(nowDate)
                }
                else{
                    deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 2) )
                }
                break
            case 0:
                deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 1) )
                break
            default:
                if(hour < 18 || (hour === 18 && minutes <= 30)){
                    deliveryDate = formatter.format(nowDate)
                }
                else{
                    deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 1) )
                }

        }
        return deliveryDate
    }
    function _calculateDeliveryDateHome(){
        let nowDate = new Date(),
            dayOfWeek = nowDate.getDay(),
            hour = nowDate.getHours(),
            minutes = nowDate.getMinutes(),
            deliveryDate = null,
            formatter = new Intl.DateTimeFormat("ru")
        if(dayOfWeek >=1 && dayOfWeek <= 4 && hour < 15){
            deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 1) )
        }
        if(dayOfWeek >=1 && dayOfWeek <= 3){
            if(hour >= 15){
                deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 2) )
            }
        }
        if(dayOfWeek === 4 && hour >= 15){
            deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 4) )
        }
        if(dayOfWeek === 5){
            if(hour < 15) deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 3) )
            if(hour >= 15) deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 4) )
        }
        if(dayOfWeek === 6){
            deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 3) )
        }
        if(dayOfWeek === 0){
            deliveryDate = formatter.format( new Date(nowDate).setDate(nowDate.getDate() + 2) )
        }
        return deliveryDate
    }
    let shopDeliveryDate = _calculateDeliveryDateShop(),
        homeDeliveryDate = _calculateDeliveryDateHome()

    const handleChangeMonth = (month) => {
        setMonth(month)
        setMonthPrice((sellPrice / month).toFixed(2))
        if (parseFloat(showLevel) === 2){
            if(month === 3){
                setPositionSlide(20)
            } else{
                setPositionSlide(175)
            }
        }else if (parseFloat(showLevel) === 3){
            if(month === 3){
                setPositionSlide(20)
            } else if (month === 6){
                setPositionSlide(95)
            } else{
                setPositionSlide(175)
            }
        }
    }

    const handleChangeRentMonth = (month) => {
        setRentMonth(month)
        if (month == 1)
            setPositionSlideRent(10)
        else if (month == 12)
            setPositionSlideRent(60 * 3)
        else
            setPositionSlideRent(60 * month / 3)
    }

    const handleAddProductToBasket = (e, model) => {
        addModelToBasket(e, model)
        $("#addProductToBasket").addClass('added');
        setTimeout(() => {
            $("#addProductToBasket").removeClass('added');
        }, 1800)
    }

    const handleAddModelToBasket = (e, model) => {
        setFirstLoaded(false)
        addModelToBasket(e, model)
    }

    return (
        <div className={`col-md-3 additionalInfo ${className}`}>
            <div className="additionalInfoWrapper">
                {parseFloat(showLevel) <= 0 && (
                    <div>
                        <p className="head head-price">preis</p>
                        <div className="price-wrap">
                            {model.discountPrice &&
                            <p className="price discount-price">{model.discountPrice} {window.currencyValue}</p>
                            }
                            <p className={model.discountPrice ? 'price old-price' : 'price'} data-price-amount={model.price}>{ Math.round((+model.price) * 100) / 100} {window.currencyValue}</p>
                        </div>
                        {/*{model.discountPrice &&*/}
                        {/*    <div className="pig">*/}
                        {/*        <div className="col-xs-8"><img src="/images/design/pig.svg" alt=""/></div>*/}
                        {/*        <div className="col-xs-4 discount">{Math.round((model.price - model.discountPrice) * 100) / 100} {window.currencyValue}</div>*/}
                        {/*    </div>*/}
                        {/*}*/}
                    </div>
                )}
                {parseFloat(showLevel) > 0 && (
                    <div className="priceInfo">
                        <div>
                            <div className="installment-payment">
                                <h3 className="title">
                                    Ratenzahlung / per Rechnung
                                    <div className="question-sign">
                                        <img src="/images/design/bi_question-circle.svg" alt=""/>
                                        <div className="info-icon-text">Sie können den Kaufpreis in mehreren Monatsraten bezahlen ohne zusätzliche Zinskosten!</div>
                                    </div>
                                </h3>
                                <h3 className="description">
                                    bezahlen Sie bequem monatlich
                                </h3>
                            </div>
                            <div className="cost">
                                <h4>{monthPrice} CHF</h4>
                                <span>x {month} Monate</span>
                                <p>Sie können diesen Betrag ganz einfach per Einzahlungschein oder Kreditkarte bezahlen. <strong>Jetzt mit 0%-Zinszahlung!</strong></p>
                            </div>
                            <div className="per-month-tab">
                                <div className="slide-toggle" style={{transform: `translate(${positionSlide}px, 0)`}} >{month} <span>Monate</span></div>
                                {parseFloat(showLevel) >= 1 && (
                                    <div className={`month-panel`} onClick={()=>handleChangeMonth(3)}>
                                        <div className="month-desc">
                                            3
                                        </div>
                                    </div>
                                )}
                                {parseFloat(showLevel) >= 2 && (
                                    <div className={`month-panel`} onClick={()=>handleChangeMonth(6)}>

                                        <div className="month-desc">
                                            6
                                        </div>
                                    </div>
                                )}
                                {parseFloat(showLevel) >= 3 && (
                                    <div className={`month-panel`} onClick={()=>handleChangeMonth(12)}>
                                        <div className="month-desc">
                                            12
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="or-panel">
                                <div className="vector-3">
                                </div>
                                <span className="or">
                                    oder
                                </span>
                                <div className="vector-4">
                                </div>
                            </div>
                            <div className="one-time-price">
                                <h3 className="title">
                                    Sofort-Kaufen Preis
                                </h3>
                                <h3 className="description">
                                    ohne Ratenzahlung
                                </h3>
                            </div>
                        </div>
                        <div>
                            <div className="price-wrap">
                                {model.discountPrice &&
                                <p className="price discount-price">{model.discountPrice} {window.currencyValue}</p>
                                }
                                <p className={model.discountPrice ? 'price old-price' : 'price'} data-price-amount={model.price}>{ Math.round((+model.price) * 100) / 100} {window.currencyValue}</p>
                            </div>
                            {/*{model.discountPrice &&*/}
                            {/*    <div className="pig">*/}
                            {/*        <div className="col-xs-8"><img src="/images/design/pig.svg" alt=""/></div>*/}
                            {/*        <div className="col-xs-4 discount">{Math.round((model.price - model.discountPrice) * 100) / 100} {window.currencyValue}</div>*/}
                            {/*    </div>*/}
                            {/*}*/}
                        </div>
                    </div>
                )}
                { deadline && !deadlineExpired && (deviceStatus.statusId === 1 && !isAccessory ) &&
                    <div className="coupon-block">
                        { !deadlineIsActive &&
                            <React.Fragment>
                                <div className="coupon-item">
                                    <div className="hourglass">
                                        <img src="/images/design/shop/coupons/hourglass.png" alt=""/>
                                    </div>
                                    <div className="main">
                                        <span className="name">Extra</span>
                                        <span className="discount">20.00 <span>CHF</span></span>
                                        <span className="countdown">
                                            <div className="timer">
                                                <div className="mask"></div>
                                            </div>
                                            {deadline &&
                                                <Animated animationIn="bounceIn" animationInDelay={0}>
                                                    <span className="text" id='numeric-timer'>{deadlineTimer}</span>
                                                </Animated>
                                            }
                                        </span>
                                    </div>
                                    <div className="percentage">
                                        <span>%</span>
                                    </div>
                                </div>
                                <button className="btn add-coupon"
                                        data-source="quickViewPage"
                                        onClick={activateCountDownCoupon}
                                        data-status={basketData.some(item => item.shortcode === model.shortcode) ? 'in' : 'out'}
                                >
                                Jetzt aktivieren
                                </button>
                            </React.Fragment>
                        }
                        {deadlineIsActive &&
                            <div className="active-coupon-item">
                            </div>
                        }
                    </div>
                }
                {/* { (!window.isMobile && deviceStatus.statusId === 1 && isAccessory && model.quantity > 0) &&
                    <div
                        data-status="out"
                        data-source="accessoryDetailPage"
                        className="btn addToBasket pulsing"
                        onClick={(e) => addModelToBasket(e, model)}>
                        // {<input type="number" name="accessoryAmount" className="accessoryAmount" defaultValue="1" min="1"/>}
                        Zum Warenkorb hinzufügen
                    </div>
                } */}
                { (!window.isMobile && deviceStatus.statusId === 1 && isAccessory && model.quantity > 0) &&
                    <button
                        data-status="out"
                        data-source="accessoryDetailPage"
                        className="btn addToBasket pulsing add-to-cart add-Product-To-Basket"
                        onClick={(e) => handleAddProductToBasket(e, model)}>
                        <div className="default">Zum Warenkorb hinzufügen</div>
                        <div className="success">Zum Warenkorb hinzufügen</div>
                        <div className="cart">
                            <div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <div className="dots"></div>
                    </button>
                }
                {/* { (!window.isMobile && deviceStatus.statusId === 1 && !isAccessory ) &&
                    <button data-status={basketData.some(item => item.shortcode === model.shortcode) ? 'in' : 'out'}
                            data-source="quickViewPage"
                            className="btn addToBasket pulsing"
                            onClick={(e) => addModelToBasket(e, model)}>
                        {basketData.some(item => item.shortcode === model.shortcode) ? 'Vom Warenkorb entfernen' : 'Zum Warenkorb hinzufügen'}
                    </button>
                } */}
                { (!window.isMobile && deviceStatus.statusId === 1 && !isAccessory ) &&
                    <button data-status={basketData.some(item => item.shortcode === model.shortcode) ? 'in' : 'out'}
                            data-source="quickViewPage"
                            className={!basketData.some(item => item.shortcode === model.shortcode) ? 'btn addToBasket pulsing add-to-cart' : !firstLoaded ? 'btn addToBasket pulsing add-to-cart added' : 'btn addToBasket pulsing add-to-cart added noEffect'}
                            onClick={(e) => handleAddModelToBasket(e, model)}>
                            <div className="default">Zum Warenkorb hinzufügen</div>
                            <div className="success">Vom Warenkorb entfernen</div>
                            <div className="cart">
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <div className="dots"></div>
                    </button>
                }
            </div>

            <div className="additionalInfoWrapper renting">
                {parseFloat(showLevel) > 0 &&  (model.productTypeId !== 4) && (
                    <div className="priceInfo">
                        <div>
                            <div className="installment-payment">
                                <h3 className="title">
                                    Mieten
                                    <div className="question-sign">
                                        <img src="/images/design/bi_question-circle.svg" alt=""/>
                                    </div>
                                </h3>
                            </div>
                            <div className="cost">
                                <h4>69.00 CHF</h4>
                                <span>pro Monat</span>
                                <p>Mietdauer für 3 Monate, danach monatlich kündbar</p>
                                <p>Wähle deine <strong>deine Mindestmietdauer</strong></p>
                            </div>
                            <div className="per-month-tab">
                                <div className="slide-toggle" style={{transform: `translate(${positionSlideRent}px, 0)`}} >{rentMonth} <span>Monate</span></div>
                                    <div className={`month-panel`} onClick={()=>handleChangeRentMonth(1)}>
                                        <div className="month-desc">
                                            1 <span>Monate</span>
                                        </div>
                                    </div>
                                    <div className={`month-panel`} onClick={()=>handleChangeRentMonth(3)}>
                                        <div className="month-desc">
                                            3 <span>Monate</span>
                                        </div>
                                    </div>
                                    <div className={`month-panel`} onClick={()=>handleChangeRentMonth(6)}>
                                        <div className="month-desc">
                                            6 <span>Monate</span>
                                        </div>
                                    </div>
                                    <div className={`month-panel`} onClick={()=>handleChangeRentMonth(12)}>
                                        <div className="month-desc">
                                            12 <span>Monate</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="rent-details">
                            <div className="item">
                                <img src="/images/rent-icon1.svg" alt="" />
                                <p><strong>GRATIS</strong> <span>remarket Care</span></p>
                            </div>
                            <div className="item">
                                <img src="/images/rent-icon2.svg" alt="" />
                                <p>Beinhaltet <span>Kaufoption</span></p>
                            </div>
                            <div className="item">
                                <img src="/images/rent-icon3.svg" alt="" />
                                <p>Lieferug 1-3 Werktage</p>
                            </div>
                        </div>
                    </div>
                )}
                {parseFloat(showLevel) > 0 &&  (model.productTypeId !== 4) && <div
                  data-status="out"
                  data-source="accessoryDetailPage"
                  className="btn addToRent pulsing"
                >
                    JETZT MIETEN FÜR 3 MONATE
                </div>}
            </div>
            <div className="delivery-pay-blocks">
            {
                ((isAccessory && model.quantity > 0) || !isAccessory) &&
                    <div className="deliveryBlock">
                        <h3 className="title">
                            Voraussichtliche Lieferung
                            <div className="question-sign">
                                <img src="/images/design/bi_question-circle.svg" alt=""/>
                                <div className="info-icon-text">Die voraussichtlichen Lieferzeiten beziehen sich auf
                                    sofortige Zahlungsmethoden wie Kreditkarte, E-Payment (Postfinance), PayPal und kann bei
                                    der Zahlungsmethode Vorauskasse nicht angewendet werden.
                                </div>
                            </div>
                        </h3>
                        <div className="date-item">
                            <img src="/images/delivery-icon1.svg" alt="" />
                            <div>
                                <p className="date">{shopDeliveryDate}</p>
                                <p className="title"><strong>bei Abholung in der Filiale {model.placeDescription}</strong>
                                    <span className="speedy">EXPRESS</span>
                                </p>
                            </div>
                        </div>
                        <div className="date-item">
                            <img src="/images/delivery-icon2.svg" alt="" />
                            <div>
                                <p className="date delivery-date">ca. {homeDeliveryDate}</p>
                                <p className="title"><strong>bei Postversand</strong></p>
                            </div>
                        </div>
                    </div>
                }
                <span className='separator-line'></span>
                <div className="pays">
                    <ul className="pay-icons">
                        <li><img src="/images/design/visa.svg" alt=""/></li>
                        <li><img src="/images/design/mastercard.svg" alt=""/></li>
                        <li><img src="/images/design/paypal.svg" alt=""/></li>
                        { domain !== 'de' && <li><img src="/images/design/postfinance.svg" alt=""/></li>}
                        { domain !== 'de' && <li><img src="/images/design/twint.svg" alt=""/></li>}
                        { domain !== 'de' && <li><img src="/images/design/byjuno.svg" alt=""/></li>}
                        { domain !== 'ch' && <li><img src="/images/design/stripe.svg" alt=""/></li>}
                    </ul>
                    <div className="pay-services">
                        <img src="/images/design/swissbilling.png" />
                        <img src="/images/design/heidipay.svg" />
                    </div>
                </div>
            </div>

            <div className="installments-block">
                <div className="installments-block-badge">NEU</div>
                <h3>
                    Rechnung und Ratenzahlung
                    <strong>Jetzt mit 0% Zinszahlung</strong>
                </h3>
            </div>


            { deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 && deviceStatus.statusId != null &&
            <p className="boughtDevice">Sie haben diesen Artikel am {deviceStatus.dateOfBought} erworben</p>
            }
            { !deviceStatus.boughtCurrentUser && deviceStatus.statusId != 1 && deviceStatus.statusId !== null &&
            <p className="boughtDevice">Dieser Artikel ist leider nicht mehr verfügbar, da dieser schon verkauft wurde</p>
            }

        </div>
    );
}

AdditionalInfoBlock.propTypes = {}
AdditionalInfoBlock.defaultProps = {}

export default AdditionalInfoBlock