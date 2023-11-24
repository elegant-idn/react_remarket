import React, {useState} from 'react';
import {Link} from "react-router";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as basketActions from '../../actions/basket';
import AddToBasketEffect from '../common/addToBasketEffect';

const WishlistPage = (props) => {
    const {wishlistData, basketData, basketActions} = props
    const [activeTab, setActiveTab] = useState('devices')
    const handleChangeTab = (e) => {
        const activeNavItem = e.currentTarget.getAttribute('data-type')
        setActiveTab(activeNavItem)
    }

    const handleRemoveModelFromWishlist = (e, item) =>{
        e.stopPropagation();
        e.preventDefault();
        const newWishlistData = wishlistData.filter(itemWishlist => (itemWishlist.shortcode != item.shortcode));
        basketActions.changeWishlisteData(newWishlistData)
    }

    const addModelToBasket = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        let newBasketData = null
        let status = ''
        if (basketData.every(itemBasket => itemBasket.id != item.id)) {
            newBasketData = [...basketData, item]
            status = 'add'
        } else {
            newBasketData = basketData.filter(itemBasket => (itemBasket.shortcode != item.shortcode));
            status = 'remove'
        }

        basketActions.changeBasketData(newBasketData)

        let brands, brand, category;
        if( item.productTypeId !== 7 ){
            brands = item.criterias.find( item => item.id === 'manufacturer').values,
            brand = brands.length ? brands[0].name : "",
            category = item.categoryName;
        }else {
            brand = item.deviceName,
            category =  '';
        }

        if (status === 'add') {
            gtag('event', 'add_to_cart', {
                "items": [
                    {
                        "id": item.shortcode,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": item.discountPrice || item.price,
                        "name": item.descriptionLong || item.model || '',
                        "brand": brand,
                        "category": category,
                    }
                ]
            });
            if (!window.isMobile) {
                basketActions.basketAddEffect(<AddToBasketEffect startPosition={$(e.target).offset()}
                                                                            image={item.deviceImages.mainImg.src}
                                                                            basketType="kaufen"/>)
                setTimeout(() => {
                    basketActions.basketAddEffect(null)
                }, 2000)
            }
        }
        if (status === 'remove') {
            gtag('event', 'remove_from_cart', {
                "items": [
                    {
                        "id": item.shortcode,
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "price": item.discountPrice || item.price,
                        "name": item.descriptionLong || item.model || '',
                        "brand": brand,
                        "category": category,
                    }
                ]
            });

        }
        basketData.map((el) => {
            return snaptr('track', 'ADD_CART',
                {
                    'shortcode': el.shortcode,
                    'name': el.name,
                });
        })
    }

    const handleOpenDeviceDetailPage = ( deviceName, modelName, capacity, color, shortcode) => {
        window.open(`//${window.location.host}/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${shortcode}`, '_self')
    }

    const handleOpenProductDetailPage = ( deviceName, modelName, shortcode) => {
        window.open(`//${window.location.host}/kaufen/detail/zubehoer/${deviceName}/${modelName}/${shortcode}`, '_self')
    }

    return (
        <div className='wishlist-page'>
            <div className="container-fluid">
                <div className="navigation-row">
                    <Link to="/"><img src="/images/design/house-icon.svg" alt="" /></Link>
                    <span>Wunschliste</span>
                </div>
                <div className="wishlist-wrapper">
                        <h1>Meine Wunschliste</h1>
                        <div className='wishlist-tabs-button'>
                            <ul className="offer-tab-buttons">
                                <li
                                    className={activeTab==='devices' ? 'active' : ''}
                                    data-type="devices"
                                    onClick={(e) => handleChangeTab(e)}
                                >Geräte</li>
                                <li
                                    className={activeTab==='products' ? 'active' : ''}
                                    data-type="products"
                                    onClick={(e) => handleChangeTab(e)}
                                >Produkte</li>
                            </ul>
                        </div>
                        <div className="items-bar">
                            <h3 className='name'>Produktname</h3>
                            <h3 className='price'>Einzelpreis</h3>
                            <h3>Verfügbarkeit</h3>
                            <div className="empty"></div>
                        </div>
                        <div className="items">
                            {activeTab === 'devices' && (
                                wishlistData.filter((item) => item.productTypeId === 7).map((el, i) => {
                                    let modelName = el.model.split(" ").join('-').toLowerCase() || 'modelName',
                                    deviceName = el.deviceName.toLowerCase().replace(/ /g, '-') || 'deviceName',
                                    color = el.color ? el.color.toLowerCase() : 'color',
                                    capacity = el.capacity ? el.capacity.toLowerCase() : 'capacity'

                                    return (
                                        <div className="item" key={`wishlist-devices-${i}`} onClick={(e) => handleOpenDeviceDetailPage(deviceName,modelName,capacity,color, el.shortcode)}>
                                            <button className='icon-cross'>
                                                <img src="/images/icon-cross.svg" alt="" onClick={(e) => handleRemoveModelFromWishlist(e, el)}/>
                                            </button>
                                            <div className="item-img">
                                                <img src={el.deviceImages ? el.deviceImages.mainImg.src : '/images/design/Product.svg'} alt=""/>
                                            </div>
                                            <div className="item-description">
                                                <p>{el.model}, {el.color}, {el.capacity}</p>
                                                <span className='price'>{el.discountPrice ? el.discountPrice : el.price} {window.currencyValue}</span>
                                                <span className="stock-status">
                                                    {el.statusId === 1 ? `Auf Lager` : `Nicht auf Lager`}
                                                </span>
                                            </div>
                                            <button className='btn addToBasket' onClick={(e) => addModelToBasket(e, el)}>ZUM WARENKORB HINZUFÜGEN</button>
                                        </div>
                                    )
                                })
                            )}
                            {activeTab === 'products' && (
                                wishlistData.filter((item) => item.productTypeId !== 7).map((el, i) => {
                                    let modelName = el.model.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
                                    deviceName = el.deviceName.toLowerCase().replace(/ /g, '-')
                                    return (
                                        <div className="item" key={`wishlist-products-${i}`} onClick={(e) => handleOpenProductDetailPage(deviceName, modelName, el.shortcode)}>
                                            <button className='icon-cross'>
                                                <img src="/images/icon-cross.svg" alt="" onClick={(e) => handleRemoveModelFromWishlist(e, el)}/>
                                            </button>
                                            <div className="item-img">
                                                <img src={el.deviceImages ? el.deviceImages.mainImg.src : '/images/design/Product.svg'} alt=""/>
                                            </div>
                                            <div className="item-description">
                                                <p>{el.model}</p>
                                                <span className='price'>{el.discountPrice ? el.discountPrice : el.price} {window.currencyValue}</span>
                                                <span className="stock-status">
                                                {el.quantity > 0 ? `Auf Lager` : `Nicht auf Lager`}
                                                </span>
                                            </div>
                                            <button className='btn addToBasket' onClick={(e) => addModelToBasket(e, el)}>ZUM WARENKORB HINZUFÜGEN</button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        wishlistData: state.basket.wishlistData,
        basketData: state.basket.basketData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishlistPage)