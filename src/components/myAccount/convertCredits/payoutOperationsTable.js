import React from 'react'
import PropTypes from 'prop-types'

const PayoutOperationsTable = ( { data } ) => {

    function mapOperationss( item, i ) {
        let classCount = item.typeId === 0 ? 'count payout' : 'sell count',
            classStatus = item.statusId === 3 ? 'status done' : item.statusId === 2 ? 'status progress' : 'status open',
            sign = item.typeId === 0 ? '-' : '+'
        return(
            <div key={i}>
                <div className="tableRow body" >
                    <div className="num">{i+1}</div>
                    <div className="date">{ item.date }</div>
                    <div className="type">{item.type}</div>
                    <div className={classCount}>{sign}{ item.price }</div>
                    <div className={classStatus}>{ item.status }</div>
                    <div className="show"><i className="fa fa-plus" aria-hidden="true"></i></div>
                </div>
                {item.hasOwnProperty('name') && item.hasOwnProperty('iban') &&
                    <div className="userData">
                        <div className="name">
                            <p>Name</p>
                            <p>{item.name}</p>
                        </div>
                        <div className="iban">
                            <p>IBAN</p>
                            <p>{item.iban}</p>
                        </div>
                    </div>
                }
                {item.hasOwnProperty('reason') && item.hasOwnProperty('comment') &&
                <div className="userData">
                    <div className="name">
                        <p>Zahlungsgrund</p>
                        <p>{item.reason}</p>
                    </div>
                    { item.comment &&   <div className="iban">
                                            <p>Kommentar</p>
                                            <p>{item.comment}</p>
                                        </div>
                    }
                </div>
                }
            </div>
        )
    }
    return (
        <div className="wrapTable">
            <div className="table">
                <div className="tableRow head">
                    <div className="num">Nr.</div>
                    <div className="date">Datum</div>
                    <div className="type">Typ</div>
                    <div className="count">Betrag</div>
                    <div className="status">Status</div>
                    <div className="show"></div>
                </div>
                { data.map(mapOperationss) }
            </div>
        </div>
    );
}

PayoutOperationsTable.propTypes = {}
PayoutOperationsTable.defaultProps = {}

export default PayoutOperationsTable