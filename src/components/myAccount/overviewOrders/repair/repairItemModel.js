import React from 'react'
import PropTypes from 'prop-types'

const OverviewOrdersRepairItemModel = ( { data } ) => {

    let statusBarClass = `statusBarRepair statusId-${data.status.id}`,
        statusTypeClass = `statusTypeRepair statusId-${data.status.id}`
    function mapOptions(item, i) {
        return <span key={i} className="col-sm-12">- {item.name}</span>
    }
    return(
        <div>
            <div className="item-model clearfix" >
                <div className="col-md-12">
                    <div className="col-md-2">
                        <img src={ data.image || '/images/design/iPhone_7.svg'} alt=""/>
                    </div>
                    <div className="col-md-10">
                        <div className="itemWrap clearfix">
                            <div className="col-xs-9">
                                <span className="modelName">{data.modelName}</span>
                            </div>
                            <div className="col-xs-3">
                                <div className="status">
                                    <div className={statusTypeClass}>{data.status.name}</div>
                                    <div className="status_bar">
                                        <div className={statusBarClass}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="itemWrap clearfix">
                            <div className="col-xs-9">
                                <div className="repair-options">
                                    <p className="title">Reparaturen</p>
                                    <div className="row">{data.products.map(mapOptions)}</div>

                                </div>
                            </div>
                            <div className="col-xs-3">
                                <span className="price">
                                    <span className="title">Preis</span><br/>
                                    <span>{ data.totalPrice } {window.currencyValue}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-xs-12 bottom-row">
                <div className="col-xs-12">
                    <span className="shortcode">Auftragsnummer: {data.shortcode}</span>
                    <span className="date">Auftragsdatum: {data.date}</span>
                </div>
            </div>
        </div>
    )
}

OverviewOrdersRepairItemModel.propTypes = {}
OverviewOrdersRepairItemModel.defaultProps = {}

export default OverviewOrdersRepairItemModel