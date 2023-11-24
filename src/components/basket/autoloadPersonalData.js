import React from 'react'
import PropTypes from 'prop-types'

const AutoloadPersonalData = ({ data, choosePersonalData, formType }) => {
    let customer = formType === 'billingAddress' ? 'customer_' : ''
    return (
        <div className="autoloadPersonalData">
            {
                data.map( ( item, i ) => {
                    return( <div key={i} className="itemAutoloadPersonalData">
                                <button data-position={i} onClick={choosePersonalData}>Add</button>
                                <p>{item[formType][`${customer}gender`]} {item[formType][`${customer}lastname`]} {item[formType][`${customer}firstname`]}</p>
                                <ul>
                                    <li>Firma: {item[formType][`${customer}companyName`]}</li>
                                    <li>Tel. Gerät: {item[formType][`${customer}phone`]}</li>
                                    <li>E-Mail: {item[formType][`${customer}email`]}</li>
                                    <li>Adresse: {item[formType][`${customer}number`]}, {item[formType].street} </li>
                                    <li>PLZ + Ort: {item[formType][`${customer}inputCountry`]}-{item[formType][`${customer}zip`]}  {item[formType][`${customer}city`]}</li>
                                </ul>
                            </div>)
                })
            }
        </div>
    );
}

AutoloadPersonalData.propTypes = {}
AutoloadPersonalData.defaultProps = {}

export default AutoloadPersonalData