import React from 'react'
import PropTypes from 'prop-types'

const RepairItemModelMobile = ( { data } ) => {
    let statusBarClass = `statusBarRepair statusId-${data.status.id}`,
        statusTypeClass = `statusTypeRepair statusId-${data.status.id}`

    function mapOptions(item, i) {
        return <span key={i} className="col-xs-12">- {item.name}</span>
    }
    return (
        <div>
            <div className="item-model clearfix" >
                <div className="col-md-12 clearfix">
                    <div className="wrapLine clearfix">
                        <div className="col-xs-6 image">
                            <img src={ data.image || '/images/design/iPhone_7.svg' } alt=""/>
                        </div>
                        <div className="col-xs-6">
                            <div className="itemWrap clearfix">
                                <span className="modelName">{data.modelName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="itemWrap text-center clearfix">
                        <div className="repair-options">
                            <p className="title">Reparaturen</p>
                            <div className="row">{data.products.map(mapOptions)}</div>

                        </div>
                    </div>
                    <div className="wrapLine clearfix" style={{marginBottom: '15px'}}>
                        <div className="col-xs-6">
                            <div className="itemWrap clearfix">
                            <span className="price">
                                <span className="title">Preis</span><br/>
                                <span>{ data.totalPrice } {window.currencyValue}</span>
                            </span>
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="itemWrap clearfix">
                                <div className="status">
                                    <div className={statusTypeClass}>{data.status.name}</div>
                                    <div className="status_bar">
                                        <div className={statusBarClass}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xs-12">
                <div className="col-xs-12">
                    <span className="shortcode">Auftragsnummer: {data.shortcode}</span>
                    <p className="date">Auftragsdatum: {data.date}</p>
                </div>
            </div>
        </div>

    );
}

RepairItemModelMobile.propTypes = {}
RepairItemModelMobile.defaultProps = {}

export default RepairItemModelMobile