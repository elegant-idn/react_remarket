import React, { useState } from 'react';
import Slider from "react-slick";
import { BulletList  } from 'react-content-loader'
import AddToBasketEffect from "../common/addToBasketEffect"
import AddToWishlistEffect from "../common/addToWishlistEffect"
import LightboxImage from '../common/lightboxImg';
import { Link } from 'react-router'

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
        style={{ ...style}}
        onClick={onClick}
        >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.19298 1.10152L8.9008 8.22652C9.10588 8.44331 9.20839 8.72152 9.20839 8.99995C9.20839 9.27825 9.10583 9.55636 8.9008 9.77339L2.19298 16.8984C1.76548 17.3484 1.05345 17.3671 0.602516 16.9406C0.148391 16.5128 0.132359 15.7978 0.55857 15.3496L6.57732 8.99808L0.55857 2.64652C0.132359 2.19839 0.148297 1.48823 0.602516 1.05745C1.05345 0.631359 1.76548 0.650109 2.19298 1.10152Z" fill="#161616"/>
            </svg>

        </div>
    );
}

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
        style={{ ...style}}
        onClick={onClick}
        >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.19298 1.10152L8.9008 8.22652C9.10588 8.44331 9.20839 8.72152 9.20839 8.99995C9.20839 9.27825 9.10583 9.55636 8.9008 9.77339L2.19298 16.8984C1.76548 17.3484 1.05345 17.3671 0.602516 16.9406C0.148391 16.5128 0.132359 15.7978 0.55857 15.3496L6.57732 8.99808L0.55857 2.64652C0.132359 2.19839 0.148297 1.48823 0.602516 1.05745C1.05345 0.631359 1.76548 0.650109 2.19298 1.10152Z" fill="#161616"/>
            </svg>
        </div>
    );
}

const PurchaseProducts = ({recommendProducts, basketActions, basketData, wishlistData}) => {
    const [blockImage, setBlockImage] = useState({
        currentMainImage: '',
        isOpenLightBox: false,
        currentImageLightBox: 0,
        image: null
    });

    const closeLightBox = () => {
        $('#zoom_01').elevateZoom({zoomType: "inner"})
        setBlockImage ({ 
            ...blockImage,
            isOpenLightBox: false
        })
    }

    const openLightBox = (item) => {
        if (item.deviceImages.mainImg.src === '/images/design/Product.svg') return
        $('.zoomContainer').remove()
        let position = null;
        [].concat(item.deviceImages.mainImg, item.deviceImages.realImg).forEach( (item1, i ) => {    // find current image position, for LightBox
            if(item1.src === blockImage.currentMainImage) position = i
        })
        setBlockImage ({ 
            currentMainImage: item.deviceImages.mainImg.src,
            isOpenLightBox: true,
            currentImageLightBox: position,
            image: item.deviceImages
        })
    }

    const addToBasket = (e,item) => {
        e.stopPropagation()
        e.preventDefault()
        let status;
        let newBasketData = []
        if (basketData.every(itemBasket => itemBasket.id != item.id)) {
            newBasketData = [...basketData, item]
            status = 'out'
        } else {
            newBasketData = basketData.filter(itemBasket => (itemBasket.shortcode != item.shortcode));
            status = 'in'
        }
        basketActions.changeBasketData(newBasketData)
        if (status === 'out') {
            if (!window.isMobile) {
                const img = item.deviceImages ? item.deviceImages.mainImg.src : '/images/design/Product.svg',
                    start = $(e.target).offset();
                    basketActions.basketAddEffect(<AddToBasketEffect startPosition={start}
                                                                                image={img}
                                                                                basketType="kaufen"/>)
                setTimeout(() => {
                    basketActions.basketAddEffect(null)
                }, 2000)
            }
        }        
    }

    const addModelToWishlist = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        let newWishlistData = null
        let status = ''
        if (wishlistData.every(itemWishlist => itemWishlist.id != item.id)) {
            newWishlistData = [...wishlistData, item]
            status = 'add'
        } else {
            newWishlistData = wishlistData.filter(itemWishlist => (itemWishlist.shortcode != item.shortcode));
            status = 'remove'
        }
        basketActions.changeWishlisteData(newWishlistData)
        if (!window.isMobile && status === 'add') {
            const img = item.deviceImages ? item.deviceImages.mainImg.src : '/images/design/Product.svg'
            basketActions.wishlistAddEffect(<AddToWishlistEffect startPosition={$(e.target).offset()} image={img}/>)
            setTimeout(() => {
                basketActions.wishlistAddEffect(null)
            }, 2000)
        }
    }

    const mapRecommendProducts = (item, i) => {
        const max_model_len = 50
        const itemWrap = {paddingLeft: "8px", paddingRight: "8px"};
        const title = item.model.length > max_model_len ? item.model.substr(0,max_model_len) + '...' : item.model
        const mainImg = item.deviceImages.mainImg.src

        let productIsAddedToWishlist = false
        wishlistData.map((el)=>{
            if (el.shortcode === item.shortcode){
                productIsAddedToWishlist = true
            }
        })

        let modelName = item.model.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
        deviceName = item.deviceName.toLowerCase().replace(/ /g, '-')
        return (
            <div key={`map-recommend-items`+i}>                
                    <div style={itemWrap}>
                        <Link to={`/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`}>
                            <div className='item'>
                                <div className="img">
                                    <img src={mainImg} alt="" />
                                    <i className="modelInfoBlock-img-small-searchBtn"
                                        onClick={() => openLightBox(item)}
                                        aria-hidden="true">
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M27.8527 26.5212L20.1089 18.7493C21.8011 16.7076 22.6417 14.0926 22.4562 11.4473C22.2707 8.80207 21.0733 6.32994 19.1128 4.54439C17.1523 2.75885 14.5793 1.79714 11.9283 1.85901C9.27729 1.92089 6.75198 3.0016 4.87691 4.87667C3.00184 6.75173 1.92113 9.27704 1.85926 11.9281C1.79738 14.5791 2.75909 17.1521 4.54464 19.1126C6.33018 21.0731 8.80232 22.2704 11.4476 22.4559C14.0928 22.6414 16.7079 21.8008 18.7496 20.1087L26.4933 27.8524C26.6698 28.029 26.9093 28.1281 27.1589 28.1281C27.4086 28.1281 27.648 28.029 27.8246 27.8524C28.0011 27.6759 28.1003 27.4365 28.1003 27.1868C28.1003 26.9372 28.0011 26.6977 27.8246 26.5212H27.8527ZM3.74955 12.1868C3.74955 10.518 4.2444 8.88672 5.17153 7.49919C6.09865 6.11165 7.41641 5.03019 8.95816 4.39158C10.4999 3.75296 12.1964 3.58587 13.8331 3.91143C15.4698 4.237 16.9733 5.04059 18.1533 6.2206C19.3333 7.4006 20.1369 8.90402 20.4624 10.5407C20.788 12.1774 20.6209 13.8739 19.9823 15.4157C19.3437 16.9575 18.2622 18.2752 16.8747 19.2023C15.4871 20.1295 13.8558 20.6243 12.1871 20.6243C9.94929 20.6243 7.80318 19.7354 6.22084 18.153C4.6385 16.5707 3.74955 14.4246 3.74955 12.1868Z"
                                        fill="#BED3CB"/>
                                        <path
                                        d="M15.9375 11.25H13.125V8.4375C13.125 8.18886 13.0262 7.9504 12.8504 7.77459C12.6746 7.59877 12.4361 7.5 12.1875 7.5C11.9389 7.5 11.7004 7.59877 11.5246 7.77459C11.3488 7.9504 11.25 8.18886 11.25 8.4375V11.25H8.4375C8.18886 11.25 7.9504 11.3488 7.77459 11.5246C7.59877 11.7004 7.5 11.9389 7.5 12.1875C7.5 12.4361 7.59877 12.6746 7.77459 12.8504C7.9504 13.0262 8.18886 13.125 8.4375 13.125H11.25V15.9375C11.25 16.1861 11.3488 16.4246 11.5246 16.6004C11.7004 16.7762 11.9389 16.875 12.1875 16.875C12.4361 16.875 12.6746 16.7762 12.8504 16.6004C13.0262 16.4246 13.125 16.1861 13.125 15.9375V13.125H15.9375C16.1861 13.125 16.4246 13.0262 16.6004 12.8504C16.7762 12.6746 16.875 12.4361 16.875 12.1875C16.875 11.9389 16.7762 11.7004 16.6004 11.5246C16.4246 11.3488 16.1861 11.25 15.9375 11.25Z"
                                        fill="#BED3CB"/>
                                    </svg>
                                    </i>
                                    <i className={productIsAddedToWishlist ? 'modelInfoBlock-img-small-wishBtn on' : 'modelInfoBlock-img-small-wishBtn'}
                                            onClick={(e) => addModelToWishlist(e, item)}>
                                        <svg viewBox="0 0 24 24">
                                            <use href={`#heart`} />
                                            <use href={`#heart`} />
                                        </svg>
                                        <svg className="hide" viewBox="0 0 24 24">
                                            <defs>
                                                <path id={`#heart`} d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
                                            </defs>
                                        </svg>
                                    </i>
                                </div>
                                <div className="heading">
                                    <h4>{title}</h4>
                                </div>
                                
                                <div className="cost-block purchase-product-cost">
                                    <div className="cost">
                                        <div className='price-wrap'>
                                            <p className={'price-value'}>{item.price} {window.currencyValue}</p>
                                        </div>
                                    </div>
                                    <button className='add-cart' onClick={ (e) => addToBasket(e, item)} >
                                        <img src="/images/otherProdCart.svg" alt="" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>                
            </div>
        )
    }

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows:false,
        swipeToSlide: true,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                slidesToShow: 4,
                infinite: true,
                }
            },
            {
                breakpoint: 1280,
                settings: {
                slidesToShow: 3,
                infinite: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                slidesToShow: 2,
                infinite: true,
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 1,
                infinite: true,
                }
            },
        ]
      };
    
    return(
        <div className='col-xs-12 other-product purchase-products'>
            <h3>Artikel, die zusammen gekauft werden</h3>
            <Slider {...settings}>
                {recommendProducts.map( mapRecommendProducts )}
            </Slider>
            {blockImage.isOpenLightBox &&
                <LightboxImage 
                    src={blockImage.currentMainImage}
                    showFirstImage={false}
                    showRealImageText={true}
                    close={closeLightBox}
                    array={[].concat(blockImage.image.mainImg,blockImage.image.realImg)} 
                />
            }
        </div>
    )
}

export const EmptyPurchaseProducts = () => {
    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows:false,
        swipeToSlide: true,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                slidesToShow: 4,
                infinite: true,
                }
            },
            {
                breakpoint: 1280,
                settings: {
                slidesToShow: 3,
                infinite: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                slidesToShow: 2,
                infinite: true,
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 1,
                infinite: true,
                }
            },
        ]
      };

    const itemWrap = {paddingLeft: "8px", paddingRight: "8px"};
    return(
        <div className='col-xs-12 other-product purchase-products'>
            <h3>Artikel, die zusammen gekauft werden</h3>
            <Slider {...settings}>
                <div>
                    <div style={itemWrap}>
                        <div className='item'>
                            <BulletList  />
                        </div>
                    </div>
                </div>
                <div>
                    <div style={itemWrap}>
                        <div className='item'>
                            <BulletList  />
                        </div>
                    </div>
                </div>
                <div>
                    <div style={itemWrap}>
                        <div className='item'>
                            <BulletList  />
                        </div>
                    </div>
                </div>
                <div>
                    <div style={itemWrap}>
                        <div className='item'>
                            <BulletList  />
                        </div>
                    </div>
                </div>
                <div>
                    <div style={itemWrap}>
                        <div className='item'>
                            <BulletList  />
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    )
}
export default PurchaseProducts