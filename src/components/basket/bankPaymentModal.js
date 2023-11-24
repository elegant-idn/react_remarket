import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

const BankPaymentModal = ( { data, fromRepair} ) => {
    // let url = fromRepair ? '/reparieren/danke' : '/danke'
    useEffect(() => {
        $('#BankPaymentModal').modal('show')    
    }, []);

    const closeModal = () =>{
        window.localStorage.removeItem('bankPaymentData')
        $('#BankPaymentModal').modal('hide')
    }

    return (
            <div className="modal fade"
                    id="BankPaymentModal"
                    tabIndex="-1"
                    role="dialog"
                    data-backdrop="static"
                    aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button"
                                    onClick={closeModal}
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel">
                                Bitte überweisen Sie das Geld auf das folgende Konto:
                            </h4>
                        </div>
                        <div className="modal-body">
                            <ul>
                                <li>Kontoinhaber Firmenname: {data.companyName}</li>
                                <li>Kontoinhaber Adresse: Gerbergasse 82, CH-4001 Basel</li>
                                <li>Bankname: {data.bankName}</li>
                                <li>IBAN: {data.bankIban}</li>
                                <li>BIC/SWIFT: {data.bankSwift}</li>
                                <li>Clearing: {data.bankClearing}</li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    onClick={closeModal}
                                    className="btn"
                                    data-dismiss="modal">Schliessen</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

BankPaymentModal.propTypes = {}
BankPaymentModal.defaultProps = {
    fromRepair: false
}

export default BankPaymentModal