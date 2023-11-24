import React from 'react'
import PropTypes from 'prop-types'

const CreditsTable = ( { data } ) => {
    function mapCredits( item, i ) {
        return(
            <tr className={item.type} key={i}>
                <td>{i+1}</td>
                <td>{ item.operation/100 }</td>
                <td>{ item.initialAmount/100 }</td>
                <td>{ item.resultAmount/100 }</td>
                <td>{ item.date }</td>
            </tr>
        )
    }
    return (
        <div className="col-md-7">
            <h4>Credits Übersicht</h4>
            <table className="convertCredits">
                <thead>
                <tr>
                    <td>#</td>
                    <td>Credit</td>
                    <td>Ursprünglicher Wert</td>
                    <td>Berechneter Wert</td>
                    <td>Datum</td>
                </tr>
                </thead>
                <tbody>
                    { data.map(mapCredits)}
                </tbody>
            </table>
        </div>
    );
}

CreditsTable.propTypes = {}
CreditsTable.defaultProps = {}

export default CreditsTable