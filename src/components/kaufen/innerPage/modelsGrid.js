import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const ModelsGrid = ({ models, basketData, wishlistData, addModelToBasket, addModelToWishlist }) => {
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

    function handleAddModelToWishlist(e, model) {
        addModelToWishlist(e, model)
    }

    function mapModels(item) {
        let images = [].concat(item.deviceImages.mainImg,item.deviceImages.realImg),
            modelName = item.model.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
            deviceName = item.deviceName.toLowerCase().replace(/ /g, '-')
        let mainImages = [].concat(item.deviceImages.mainImg)
        let realImages = [].concat(item.deviceImages.realImg)
        
        let isWish = false

        wishlistData.map((el)=>{
            if (el.shortcode === item.shortcode){
                isWish = true
            }
        })  

        return(
            <div className="custom-col-3 col-md-4 col-sm-12 col-xs-12" key={item.id}>
                <Link to={`/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`}
                      className={item.discountPrice ? 'discount' : ''} onClick={e => gtagEnhancedEcommerce(item)}>
                    <div className="item-accessory">
                        <div className="icon-row">
                            <div className={isWish ? "itemHeartView on" : "itemHeartView"} onClick={(e) => handleAddModelToWishlist(e, item)}>
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
                        </div>
                        <div>
                            <div className="images-wrap"
                                 onMouseEnter={mouseEnter}
                                 onMouseLeave={mouseOut}>
                                {
                                    mainImages.map(( item, i) =>  {
                                        let className = 'active';//images.length === i+1 ? 'active' : ''
                                        return <img src={item.src}
                                                    key={i}
                                                    className={className}/>
                                    })
                                }
                                {
                                    realImages.map(( item, i) =>  {
                                        let className = '';//images.length === i+1 ? 'active' : ''
                                        return <img src={item.src}
                                                    key={i}
                                                    className={className}/>
                                    })
                                }
                            </div>
                            <p className="modelName">
                                {item.model}
                            </p>
                        </div>
                        <div className="bottom-row">
                            <div className="price">
                                <p className="price-head">Preis</p>
                                {item.discountPrice &&
                                    <p className="price-value discount-price">{item.discountPrice} {window.currencyValue}</p>
                                }
                                <p className={item.discountPrice ? 'price-value old-price' : 'price-value'}>{item.price} {window.currencyValue}</p>
                            </div>
                            <div className="text-right">
                                {
                                    item.quantity>0
                                        ?
                                    <button className="btn addToBasket"
                                                             data-status="out"
                                            data-source="gridPage"
                                                             onClick={(e) => addModelToBasket(e,item)}/>
                                        :
                                        <span className="outStock">Nicht auf Lager</span>
                                }
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
    function gtagEnhancedEcommerce(item) {
        let brands = item.criterias.find( item => item.id === 'manufacturer').values;
        gtag('event', 'select_content', {
            "content_type": "product",
            "items": [
                {
                    "id": item.shortcode,
                    "name": item.model,
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "price": item.discountPrice || item.price,
                    "brand": brands.length ? brands[0].name : "",
                    "category": item.categoryName,
                }
            ]
        });
    }
    return (
        <div className="accessories">
            <div className="row accessory-row">
                {models.map(mapModels)}
            </div>
        </div>
    )
}

ModelsGrid.propTypes = {}
ModelsGrid.defaultProps = {}

export default ModelsGrid

const img = ['https://uploads.remarket.ch/gK5_yljXv3AuMqba1nor.jpg', 'https://uploads.remarket.ch/6blor4sgPnUSLp7BDtN0.jpg', 'https://uploads.remarket.ch/BUiWVwG9AQKvSL3f0aH7.jpg']