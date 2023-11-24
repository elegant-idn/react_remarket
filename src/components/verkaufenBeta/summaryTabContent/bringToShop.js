import React, { Component } from 'react'
import SendLinks from "../sendLinks";
import {connect} from "react-redux";
import {Animated} from "react-animated-css"

class BringToShop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sellDeadline: 0,
            couponShortcode: ''
        }
        this.renderContent = this.renderContent.bind(this)
        this.renderOther = this.renderOther.bind(this)        
        // this._initMap = this._initMap.bind(this)
    }
    componentDidMount(){
        if(window.isGoogleConnection) {
            // this._initMap(this.props.place)
        }
        this.encryptedEmail();
        this.checkIfsellDeadlineExpired();
    }

    componentWillReceiveProps(nextProps) {
        if(window.isGoogleConnection) {
            // this._initMap(nextProps.place)
        }
        this.checkIfsellDeadlineExpired();
    }
    checkIfsellDeadlineExpired(){
        let sellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline'));
        if( sellDeadline && !sellDeadline.isUnlimited && !sellDeadline.sellDeadlineExpired )
        {
            this.setState({sellDeadline: 1, couponShortcode: sellDeadline.couponShortcode })
        }
        else {
            this.setState({sellDeadline: 0,  couponShortcode: ''})
        }
    }

    encryptedEmail(){
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
        if(domain === 'de'){
            document.getElementById("email-rot-13").innerHTML="<n uers=\"znvygb:vasb@erznexrg.qr\" >vasb@erznexrg.qr</n>".replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
        }
        else{
            document.getElementById("email-rot-13").innerHTML="<n uers=\"znvygb:vasb@erznexrg.pu\" >vasb@erznexrg.pu</n>".replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
        }
    }

    chooseLocation = () => {
        $('#myModalResult').modal('hide')
        $('#modalChooseLocation').modal('show')
    }
    renderContent = () => {
        const {
            place,
            changeSummaryTabContent,
            handleClickMobileBtn,
            setCurrentTabFrom,
            setStep,
            saveAndBackToSellProcess,
            addToBasket} = this.props;
        const {sellDeadline} = this.state;
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            linkUrlBtnMap = place.id == 1 ?
                'https://goo.gl/maps/rryoP8YWRQ72':
                place.id == 5 ?
                    'https://goo.gl/maps/6hMDDXpzFun' :
                    place.id == 6 ?
                        'https://goo.gl/maps/YX34fVYT5UE2' :
                        ''
        return (
            <div className="content">
                <h1 className="bring-title">
                    Inhre Angaben
                </h1>
                <div className="bring-info-item">
                    <div className="bring-info-item-title">
                        <div className='mark-img'>
                            <img src="/images/design/sell/address.svg" alt=""/>
                        </div>
                        <span>Adress</span>
                    </div>
                    <div className="bring-info-item-content">
                        <p>{ domain === 'ch' ? 'remarket.ch' : 'remarket.de'} - {place.descriptionBranch}</p>
                        <p>{place.address}</p>
                        <p>{place.zip} {place.city}</p>
                        <a className="open-map" target="_blank" href={linkUrlBtnMap}>
                            <img src="/images/design/sell/focus.svg" /><span>Show on the map</span>
                        </a>
                    </div>
                </div>
                <div className="bring-info-item">
                    <div className="bring-info-item-title">
                        <div className='mark-img'>
                            <img src="/images/design/sell/email.svg" alt=""/>
                        </div>
                        <span>E-mail</span>
                    </div>
                    <div className="bring-info-item-content">
                        <p id="email-rot-13"/>
                    </div>
                </div>
                <div className="bring-info-item">
                    <div className="bring-info-item-title">
                        <div className='mark-img'>
                            <img src="/images/design/sell/diagnos.svg" alt=""/>
                        </div>
                        <span>Diagnosezeiten</span>
                    </div>
                    <div className="bring-info-item-content">
                        <div className="same-size"><p className='p1'>Smartphone:</p><p className='p2'>ca. 30-60 Minuten</p></div>
                        <div className="same-size"><p className='p1'>Computer:</p><p className='p2'>1 Tag</p></div>
                        <div className="same-size"><p className='p1'>Tablet:</p><p className='p2'>ca. 30-60 Minuten</p></div>
                    </div>
                </div>
                <div className="bring-info-item">
                    <div className="bring-info-item-title">
                        <div className='mark-img'>
                            <img src="/images/design/sell/ausza.svg" alt=""/>
                        </div>
                        <span>Auszahlungsmöglichkeiten</span>
                    </div>
                    <div className="bring-info-item-content">
                        <p>Barzahlung:  Sofortige Express-Auszahlung möglich (ohne Abzug)</p>
                        <p>Banküberweisung: 1-2 Tage</p> 
                    </div>
                </div>
                <div className="bring-info-item">
                    <div className="bring-info-item-title">
                        <div className='mark-img'>
                            <img src="/images/design/sell/workingtime.svg" alt=""/>
                        </div>
                        <span>Öffnungszeiten</span>
                    </div>
                    <div className="bring-info-item-content">
                        <div className="same-size-2"><p className='p1'>Mo:</p><p className='p2'>{place.openingHours.mon}</p></div>
                        <div className="same-size-2"><p className='p1'>Di:</p><p className='p2'>{place.openingHours.tue}</p></div>
                        <div className="same-size-2"><p className='p1'>Mi:</p><p className='p2'>{place.openingHours.wed}</p></div>
                        <div className="same-size-2"><p className='p1'>Do:</p><p className='p2'>{place.openingHours.thu}</p></div>
                        <div className="same-size-2"><p className='p1'>Fr:</p><p className='p2'>{place.openingHours.fri}</p></div>
                        <div className="same-size-2"><p className='p1'>Sa:</p><p className='p2'>{place.openingHours.sat}</p></div>
                    </div>
                </div>
                <div className="bring-info-item">
                    <div className="bring-info-item-title">
                        <div className='mark-img'>
                            <img src="/images/design/sell/telefon.svg" alt=""/>
                        </div>
                        <span>Telefon</span>
                    </div>
                    <div className="bring-info-item-content">
                        <a href={place.phone}>{place.phone}</a>                            
                    </div>
                </div>
                {/* {
                    ignore sendlinks for now
                } */}
                {false && sellDeadline ? <SendLinks user={this.props.user} id="bring-to-shop" isSellDeadline={true} sellCouponShortcode={this.state.couponShortcode}/>
                        : null
                }
                <div className="bring-info-button">
                    <button className="btn"
                            onClick={() => changeSummaryTabContent('chooseLocation')}>
                        Übersicht Filialen
                    </button>
                    <button className="btn sumary"
                            data-name="summary"
                            onClick={(e) => {
                                setCurrentTabFrom()
                                setStep && handleClickMobileBtn(e);
                            }}>
                        Gratis per Post einsenden
                    </button>
                </div>
                {/* <div className="bring-info-other">
                    <span className="link" onClick={(e) => saveAndBackToSellProcess(e)}>
                        <i className="fa fa-plus" aria-hidden="true"/>
                        Weiteres Gerät verkaufen
                    </span>
                    <span className="link" onClick={(e) => addToBasket(e)}>
                        <img src="/images/design/sell/save.svg" alt=""/>
                        Ich will später weitermachen, jetzt speichern!
                    </span>
                </div> */}
            </div>
        )
    }
    renderOther = () => {
        const {
            userAnswers,
            storageSellDeadline,
            price,
            coupon
            } = this.props;
        return (
            <div className="other-data">
                <div className="price-info">
                    <div className="image">
                        <img src={userAnswers.image} alt=""/>
                    </div>
                    {
                        storageSellDeadline && storageSellDeadline.isActive && !storageSellDeadline.sellDeadlineExpired && price.couponPrice
                            ?
                            <div className="price">
                                <p className="title">Ihr Preis</p>
                                <p className='oldPrice value'>
                                    {price.price} {window.currencyValue}
                                </p>
                                <Animated animationIn="bounceIn" animationInDelay={1000}>
                                    <div>
                                        <p className='value'>
                                            {price.couponPrice} {window.currencyValue}
                                        </p>
                                        <p className="couponInfo"><span
                                            className="circleOk"/>Gutschein {storageSellDeadline.couponShortcode} wurde
                                            eingelöst</p>
                                    </div>
                                </Animated>
                            </div>
                            :
                            <div className="price">
                                <p className="title">Ihr Preis</p>
                                <div className='price-area'>
                                    <p className={price.oldPrice > 0 ? 'oldPrice value' : 'value'}>
                                        {price.oldPrice > 0 ? price.oldPrice : price.price} {window.currencyValue}
                                    </p>
                                    {price.oldPrice > 0 && !userAnswers.Model[0].discountPrice > 0 &&
                                    <Animated animationIn="bounceIn" animationInDelay={1000}>
                                        <div>
                                            <p className='value'>
                                                {price.price} {window.currencyValue}
                                            </p>
                                        </div>
                                    </Animated>                                    
                                    }
                                </div>
                                {userAnswers.Model[0].discountPrice > 0 &&
                                <div>
                                    <p className='value'>
                                        {price.price} {window.currencyValue}
                                    </p>
                                    {coupon.isCoupon && <p className="couponInfo"><span
                                        className="circleOk"/>Gutschein {coupon.couponShortcode} wurde
                                        eingelöst</p>}
                                </div>
                                }
                            </div>
                    }
                </div>
                <div className='information-block'>
                    <div className='information-img'>
                        <img src="/images/design/sell/information.svg" alt=""/>
                    </div>
                    <div className='information-text'>
                        <p>
                            Gerne können Sie bei uns im Ladenlokal das Gerät verkaufen oder kostenlos uns per Post zusenden.
                        </p>
                        <div className='devider' />
                        <p>
                            Bitte bringen Sie uns Ihre Geräte aufgeladen vorbei (sofern möglich) um die Diagnosezeit gering zu halten.
                        </p>
                    </div>
                </div>
            </div>
        )
    }
    render() {        
        return (
                <div>
                    {window.isDesktop ? 
                        <div className="bring-to-shop-new" id="bringToShop">
                            {this.renderContent()}
                            {this.renderOther()}
                        </div>
                        :
                        <div className="bring-to-shop-new" id="bringToShop">
                            {this.renderOther()}
                            {this.renderContent()}
                        </div>
                    }
                </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, null)(BringToShop)
