import React from "react";

const DeliverySuccessLetter = ({ props }) => {
    return <ul className='person-info'>
        <div className="delivery-form-form-send">
            <img className="delivery-form-form-send__img" src="" alt=""/>
            <h1 className="delivery-form-form-send__title">Thank you!</h1>
            <p className="delivery-form-form-send__content">I'm glad I can help you estimate the repair price of your device. Send it by postage</p>
            <div className="delivery-form-form-send__details">
                <span className="delivery-form-form-send__details-name" >{props.model.title}</span>
                <span className="delivery-form-form-send__details-price">{props.totalPrice} {window.currencyValue}</span>
            </div>
            <p className="delivery-form-form-send__duration">Duration:
                <span className="delivery-form-form-send__duration-period"> 2-3 days</span>
            </p>
        </div>
    </ul>;
};

export default DeliverySuccessLetter;