import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'

const DeviceModelsGrid = ({ models, openQuickView, capacityName, basketData, wishlistData, addModelToBasket, addModelToWishlist, deviceName }) => {
    const [moreIndex, setMoreIndex] = useState(-1);
    const [wish, setWish] = useState();

    let interval = null

    function mouseEnter(e) {
        let current = $(e.currentTarget)
        function changeImage(){
            if($(current).find('img.active').next().length > 0){
                $(current).find('img.active').removeClass('active').next().addClass('active')
            }
            else{
                $(current).find('img').removeClass('active').first().addClass('active')
            }
        }
        changeImage()
        interval = setInterval( () => changeImage(), 2000)
    }
    function mouseOut(e) {
        clearInterval(interval)
        $(e.currentTarget).find('img').removeClass('active').first().addClass('active')
    }

    function gtagEnhancedEcommerce(model) {
        gtag('event', 'select_content', {
            "content_type": "product",
            "items": [
                {
                    "id": model.shortcode,
                    "name": model.descriptionLong,
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "price": model.discountPrice || model.price,
                    "brand": model.deviceName,
                    "category": deviceName,
                }
            ]
        });
        let gtagData = {"category": deviceName};
        window.localStorage.setItem('gtag', JSON.stringify(gtagData))
    }

    function handleOpenDetailPage(model, deviceName, modelName, capacity, color, shortcode) {
        if (window.isGoogleConnection)
            gtagEnhancedEcommerce(model);
        window.open(`//${window.location.host}/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${shortcode}`, '_self')

    }

    function showQuickView(e, model) {
        e.stopPropagation()
        openQuickView(model);
        if (window.isGoogleConnection)
            gtagEnhancedEcommerce(model);
    }

    function showMoreInfos(e, index) {
        e.stopPropagation()
        if (index === moreIndex) {
            setMoreIndex(-1)
        } else {
            setMoreIndex(index)
        }
    }

    function handleAddModelToBasket(e, model) {
        addModelToBasket(e, model)
    }

    function handleAddModelToWishlist(e, model) {
        addModelToWishlist(e, model)
    }

    function mapCriterias(criterias){
        const dataArr = []
        criterias.forEach( item => {
            if( item.id === 2 || item.id === 4 || item.id === 5)
            {dataArr.push(    <div key={item.id} className={`device-criteria criteria-${item.id}`}>
                                    <span>{item.name}:</span>
                                    <span>
                                        {item.values.map( (item, i) => <b key={i}>{item.name}{ i < item.length - 1 ? ',' : ''}</b> )}
                                    </span>
                                </div>)}
        })
        return dataArr
    }
    

    function mapModels(model, index) {
        let modelName = model.model.split(" ").join('-').toLowerCase() || 'modelName',
        deviceName = model.deviceName.toLowerCase().replace(/ /g, '-') || 'deviceName',
        color = model.color ? model.color.toLowerCase() : 'color',
        capacity = model.capacity ? model.capacity.toLowerCase() : 'capacity'


        let mainImages = [].concat(model.deviceImages.mainImg)
        let realImages = [].concat(model.deviceImages.realImg)
        let description = ''
        if (description != '')
            description += ', '
        description += model.capacity !== '' ? model.capacity : ''
        if (description != '')
            description += ', '
        description += model.color !== '' ? model.color : ''
        if (description != '')
            description += ', '
        description += model.warranty !== '' ? 'Garantie: ' + model.warranty : ''
        description = description.length > 28 ? description.substr(0,28) + '...' : description
        let condition = model.condition.length > 24 ? model.condition.substr(0,24) + '...' : model.condition
        let placeDescription = model.placeDescription.length > 24 ? model.placeDescription.substr(0,24) + '...' : model.placeDescription

        let isWish = false

        wishlistData.map((el)=>{
            if (el.shortcode === model.shortcode){
                isWish = true
            }
        })        

        return(
            <div className="custom-col-3 col-md-4 col-sm-12 col-xs-12" key={model.id} onClick={(e) => handleOpenDetailPage(model, deviceName,modelName,capacity,color,model.shortcode)}>
                <Link className={model.discountPrice ? 'discount' : ''}>
                    <div className="item-device">
                        <div className="icon-row">
                            {window.isMobile && (
                                <div className="itemQuickView" onClick={(e) => showMoreInfos(e, index)}>
                                    <img src={`/images/design/aside_filter_category_icons/zoom-in-1.svg`} alt=""/>
                                </div>
                            )}
                            <div className={isWish ? "itemHeartView on" : "itemHeartView"} onClick={(e) => handleAddModelToWishlist(e, model)}>
                                <svg viewBox="0 0 24 24">
                                    <use href="#heart" />
                                    <use href="#heart" />
                                </svg>
                                <svg className="hide" viewBox="0 0 24 24">
                                    <defs>
                                        <path id="heart" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
                                    </defs>
                                </svg>
                            </div>
                            {/* {isWish ? (
                                <div className="itemWishHeartView" onClick={(e) => handleAddModelToWishlist(e, model)}>
                                    <img src={`/images/design/wishIcon.svg`} alt=""/>
                                </div>
                            ) : (
                                <div className="itemHeartView" onClick={(e) => handleAddModelToWishlist(e, model)} />
                            )}                             */}
                        </div>
                        <div>
                            <div className="images-wrap"
                                 onMouseEnter={mouseEnter}
                                 onMouseLeave={mouseOut}>
                                {
                                    mainImages.map(( item, i) =>  {
                                        let className = 'active';
                                        return <img src={item.src}
                                                    key={i}
                                                    className={className}/>
                                    })
                                }
                                {
                                    realImages.map(( item, i) =>  {
                                        let className = '';
                                        return <img src={item.src}
                                                    key={i}
                                                    className={className}/>
                                    })
                                }
                            </div>
                            <div className="modelTitle">
                                <p className="modelName">
                                    {model.model}
                                </p>
                                {model.colorCode && <span className="colorPic"
                                                            style={{backgroundColor: model.colorCode }}/>}
                            </div>
                        </div>
                        <div className="description-row">
                            {description}
                        </div>
                        <div className="place-row">
                            <img src={`/images/design/aside_filter_category_icons/location.svg`} alt=""/>
                            <span>{placeDescription}</span>
                        </div>
                        <div className="condition-row">
                            <img src={`/images/design/aside_filter_category_icons/mobile-button-light.svg`} alt=""/>
                            <span>{condition}</span>
                        </div>
                        <div className="bottom-row">
                            <div className="price">
                                {model.discountPrice &&
                                    <p className="price-value discount-price">{model.discountPrice} {window.currencyValue}</p>
                                }
                                <p className={model.discountPrice ? 'price-value old-price' : 'price-value'}>{model.price} {window.currencyValue}</p>
                                <p className="monthlyPrice">ab {model.discountPrice ? (model.discountPrice / 12).toFixed(2) : (model.price / 12).toFixed(2) } {window.currencyValue}/Monat</p>
                            </div>
                            <button data-id={model.id}
                                    data-status={basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                    data-source="listingPage"
                                    className={basketData.some(item => item.id === model.id) ? 'btn addToBasket in' : 'btn addToBasket out'}
                                    onClick={(e) => handleAddModelToBasket(e, model)}>
                            </button>                                
                        </div>                        
                        <div className={moreIndex !== index ? "hover-block" : "hover-block moreInfo"}>
                            {mapCriterias(model.criterias)}
                            <div  className={`device-criteria criteria`}>
                                <span>Garantie:</span>
                                <span><b>{model.warranty}</b></span>
                            </div>
                            {(model.batteryCapacity || model.batteryLoadcycle) ? (<div className={`device-criteria criteria`}>
                                <span>Batterie:</span>
                                {model.batteryCapacity ? <span><b>Kapazitat: {model.batteryCapacity == -1 ? "n.v." : `${model.batteryCapacity}%`}</b></span> : ''}
                                {model.batteryLoadcycle ? <span><b>Ladezyklen: {model.batteryLoadcycle == -1 ? "n.v." : model.batteryLoadcycle}</b></span> : ''}
                            </div>) : ''}
                        </div>
                    </div>
                </Link>
            </div>
        )
    }    
    return (
        <div className="devicelists">
            <div className="row deviceitem-row">
                {models.map(mapModels)}
            </div>
        </div>
    )
}

DeviceModelsGrid.propTypes = {}
DeviceModelsGrid.defaultProps = {}

export default DeviceModelsGrid