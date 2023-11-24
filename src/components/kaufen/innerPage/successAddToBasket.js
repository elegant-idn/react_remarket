import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'
import Slider from 'react-slick'

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

class SuccessAddToBasket extends Component {

    constructor(props) {
        super(props)
        this.mapRelevantProducts = this.mapRelevantProducts.bind(this)
    }

    handleGoToCart=()=> {
        browserHistory.push('/warenkorb')
    }
    handleGoBack=()=>{
        let {source} = this.props;
        if(source == 'listingPage' || source == 'quickViewPage' ||  source == 'gridPage' ){
            this.props.closeSuccessAddToBasket()
        }
        else if(source == 'detailPage' || source == 'accessoryDetailPage') {
            this.props.closeSuccessAddToBasket()
            browserHistory.goBack();
        }
    }

    addToBasket = (e,item) => {
        e.preventDefault()
        this.props.addModelToBasket(e,item);
        if (window.isGoogleConnection)
            this.gtagEnhancedEcommerce(e, item, 'add_to_cart');

    }

    gtagEnhancedEcommerce = (e, item, tag) => {
        if(tag == 'select_content' && e.target.tagName === "BUTTON"){
            return;
        }
        let brands = item.criterias.find( item => item.id === 'manufacturer').values,
            brand = brands.length ? brands[0].name : "",
            items =  [
                {
                    "id": item.shortcode,
                    "name": item.descriptionLong || item.model || '',
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "brand": brand,
                    "price": item.discountPrice || item.price,
                    "category": item.categoryName,
                }
            ];

        if(tag == 'select_content') {
            gtag('event', tag, {
                "content_type": "product",
                "items": items
            });

            let gtagData = {"category": item.categoryName};
            window.localStorage.setItem('gtag', JSON.stringify(gtagData))
        }
        else {
            gtag('event', tag, {
                "items": items
            });
        }
    }

    clickOnLink = (e, item) => {
        if(e.target.tagName === "BUTTON") {
            e.preventDefault()
        }
        else {
            if (window.isGoogleConnection)
                this.gtagEnhancedEcommerce(item, 'select_content');
        }
    }

    mapRelevantProducts( model, i ){
        let url = '', modelName = model.modelName ? model.modelName.split(" ").join('-').toLowerCase().replace(/\//g, '--') : model.model.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
            deviceName = model.deviceName.toLowerCase().replace(/ /g, '-')
        url = `/kaufen/detail/zubehoer/${deviceName}/${modelName}/${model.shortcode}`
        const itemWrap = {paddingLeft: "8px", paddingRight: "8px"};

        return(
            <div key={`MapRelevantProducts-`+i}>
                <div style={itemWrap}>
                    <Link to={url}
                        onClick={(e)=>this.clickOnLink(e,model)}
                        key={`MapRelevantProductsLink-`+i}
                        style={{textDecoration: 'none'}}
                        className="relevant-link"
                        >
                        <div className='item'>
                            <div className="img">
                                <img src={model.colorImage || model.deviceImages.mainImg.src} alt="" />
                                <img className="searchBtn" src='/images/search-icon.svg'/>
                                <img className="wishBtn" src='/images/wish-icon.svg'/>
                            </div>
                            <div className="heading">
                                <h4>
                                    {model.model}{model.extendedTitle && ` (${model.extendedTitle})`}
                                </h4>                                
                            </div>
                            <div className="cost-block">
                                <div className="cost">
                                    {model.discountPrice &&
                                        <p className="price-value discount-price">{model.discountPrice} {window.currencyValue}</p>
                                    }
                                    <p className={model.discountPrice ? 'price-value old-price' : 'price-value'}>{model.price} {window.currencyValue}</p>
                                </div>
                                <button
                                    className='add-cart'
                                    data-source="relevantProduct"
                                    data-status='out'
                                    onClick={ (e) => this.addToBasket(e, model)} />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    render() {
        let {model, recommendProducts } = this.props,
            settings = {
                infinite: false,
                speed: 500,
                slidesToShow: window.isMobile ? 1 : 3,
                slidesToScroll: 1,
                arrows:false,
                swipeToSlide: true,
                arrows: true,
                nextArrow: <SampleNextArrow />,
                prevArrow: <SamplePrevArrow />
            }        
        return (
            <div className={window.isMobile ? "light-box for-mobile" : "light-box"}>
                <div className={`successAddToBasket-wrap ${recommendProducts ? 'm-2' : 'm-20'}`}>
                    {!window.isMobile &&
                        <div className="successAddToBasket-wrap-btnClose" onClick={this.props.closeSuccessAddToBasket}>
                            <img src={"/images/design/circle_close.svg"} />
                        </div>
                    }                    
                    <div className="mainPart">
                        <div className="row title">
                            <div className="img">
                                <img src="/images/design/c-check_new.svg" alt=""/>
                            </div>
                            <div className="desc">
                                <p className="success">
                                    Erfolgreich in den Warenkorb hinzugefügt
                                </p>
                                <p className="model">
                                    {model.model}{model.capacity? ', '+model.capacity:''}{model.color? ', '+model.color:'' }
                                </p>
                            </div>
                        </div>
                        <div className="row buttons">
                            <button className="btn detail" onClick={ this.handleGoToCart }><img src="/images/design/cart_new.svg" alt=""/> Zum Warenkorb</button>
                            <button className="btn detail second" onClick={ this.handleGoBack }><img src="/images/design/basket-simple-add_new.svg" alt=""/> Weiter einkaufen</button>
                        </div>
                    </div>
                    <div className="cb"/>
                </div>
                {
                    recommendProducts.length > 0 &&
                        <div className="relevantProduct">
                            <h3>Passendes Zubehör</h3>
                            <Slider {...settings}>
                                {recommendProducts.map( this.mapRelevantProducts )}
                            </Slider>                                
                        </div>
                }
            </div>
        );
    }

}

SuccessAddToBasket.propTypes = {}
SuccessAddToBasket.defaultProps = {}

export default SuccessAddToBasket
