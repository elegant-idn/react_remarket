import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const ItemModelSearchResult = ({ data, addModelToBasket, status, openQuickView }) => {
    let modelName = data.model.split(" ").join('-').toLowerCase(),
        color = data.color.toLowerCase() || 'color',
        capacity = data.capacity.toLowerCase() || "capacity",
        deviceName = data.deviceName.replace(/ /g, '-').toLowerCase()
    function gtagEnhancedEcommerce(item) {
        gtag('event', 'select_content', {
            "content_type": "product",
            "items": [
                {
                    "id": item.shortcode,
                    "name": item.descriptionLong || item.model || '',
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "brand": item.deviceName,
                    "price": item.discountPrice || item.price,
                }
            ]
        });
        let gtagData = {"category":''};
        window.localStorage.setItem('gtag', JSON.stringify(gtagData))
    }
    return (
        <div className={data.discountPrice ? "itemModelSearch discount" : "itemModelSearch"}>
            <div className="modelInfo">
                <div className="image">
                    <img src={data.deviceImages.mainImg.src} alt=""/>
                </div>
                <div className="info">
                    {data.discountPrice && <span className="discount-mark">aktion</span>}
                    <Link className="name"
                          to={`/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${data.shortcode}`}
                          onClick={e => gtagEnhancedEcommerce(data)}>
                        {data.model}, ID: {data.shortcode}
                    </Link>
                    <p className="criteria">{data.color}, {data.capacity}</p>
                    {window.isMobile &&
                        <span className="priceMobile">
                            {data.discountPrice &&
                                <span className="value discount-price">{data.discountPrice} {window.currencyValue}</span>
                            }
                            <span className={data.discountPrice ? 'value old-price' : 'value'}>{ data.price } {window.currencyValue}</span>
                        </span>
                    }
                    {/* {window.isMobile && <button className="quickView" onClick={() => openQuickView(data)}>Schnellvorschau</button>} */}
                </div>
            </div>
            <div className="modelInfoRight">
                {/* {!window.isMobile && <button className="quickView" onClick={() => openQuickView(data)}>Schnellvorschau</button>} */}
                <div className="price">
                    <span className="title">Preis</span>
                    {data.discountPrice &&
                        <span className="value discount-price">{data.discountPrice} {window.currencyValue}</span>
                    }
                    <span className={data.discountPrice ? 'value old-price' : 'value'}>{ data.price } {window.currencyValue}</span>
                </div>
                <button className="addToBasket"
                        data-status={status}
                        onClick={(e) => addModelToBasket(e, data)}/>
            </div>
        </div>
    )
}

ItemModelSearchResult.propTypes = {}
ItemModelSearchResult.defaultProps = {}

export default ItemModelSearchResult