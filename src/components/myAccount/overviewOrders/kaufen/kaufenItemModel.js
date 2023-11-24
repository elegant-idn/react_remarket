import React from 'react'
import PropTypes from 'prop-types'

const OverviewOrdersKaufenItemModel = ( { data } ) => {
    function mapDevices( item, i ){
        let statusBarClass = `statusBarKaufen statusId-${item.statusId}`,
            statusTypeClass = `statusTypeKaufen statusId-${item.statusId}`
        return(
            <div key={i} className="item-model clearfix" >
                <div className="col-md-12">
                    <div className="col-md-2">
                        <img src={ item.image} alt=""/>
                    </div>
                    <div className="col-md-10">
                        <div className="itemWrap clearfix">
                            <div className="col-xs-9">
                                <span className="modelName">{item.model}{item.extendedTitle && ` (${item.extendedTitle})`}</span>
                                <span className="modelValues">
                                    <span>{item.capacity}</span>
                                    <span>
                                        {item.color}&nbsp;
                                        {item.colorCode && <span className="colorPic"
                                                                 style={{backgroundColor: item.colorCode}}/>}
                                    </span>
                                </span>
                            </div>
                            <div className="col-xs-3">
                                <div className="status">
                                    <div className={statusTypeClass}>{item.status}</div>
                                    { (item.statusId !== 10 && item.statusId !== 5 ) &&
                                    <div className="status_bar">
                                        <div className={statusBarClass}/>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="itemWrap clearfix">
                            <div className="col-xs-9">
                            <span className="modelValues-small">
                            <span>Garantie:</span><br/>
                            <span><b>{ item.warranty }</b></span>
                        </span>
                                <span className="modelValues-small">
                            <span>Allgemeiner Zustand:</span><br/>
                            <span> <b>{ item.condition }</b></span>
                        </span>
                            </div>
                            <div className="col-xs-3">
                                <span className="price">
                                    <span className="title">Preis</span><br/>
                                    <span>{ item.price } {window.currencyValue}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <span className="shortcode">ID: {item.shortcode} /&nbsp;</span>
                    <span className="date">Kaufdatum: {item.date}</span>
                </div>
                {item.insuranceLink &&  <div className="col-md-12">
                                            <a href={item.insuranceLink}
                                               target="_blank"
                                               className="insuranceLink">Download Garantiezertifikat</a>
                                        </div>
                }
            </div>
        )
    }
    return (
        <div>
            {data.map(mapDevices)}
        </div>
    );
}

OverviewOrdersKaufenItemModel.propTypes = {}
OverviewOrdersKaufenItemModel.defaultProps = {}

export default OverviewOrdersKaufenItemModel