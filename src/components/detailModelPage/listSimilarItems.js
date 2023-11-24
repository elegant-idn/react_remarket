import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import Slider from 'react-slick'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'
import AddToBasketEffect from '../common/addToBasketEffect'



export class ListSimilarItems extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        this.mapSimilarItems = this.mapSimilarItems.bind(this)
        this.addModelToBasket = this.addModelToBasket.bind(this)
    }

    addModelToBasket(e, model){
        let status = e.target.getAttribute('data-status'),
            { basketData } = this.props,
            newBasketData = null,
            { accessoriesDetailPage } = this.props,
            productTypeId = accessoriesDetailPage ? 3 :7

        if( basketData.every( item => item.id != model.id)){
            newBasketData = [ ...basketData, model ]
        }
        else{
            newBasketData = basketData.filter( item => (item.shortcode != model.shortcode && item.productTypeId == productTypeId ))
        }

        this.props.basketActions.changeBasketData(newBasketData)

        if( status === 'out'){
            if (window.isGoogleConnection)
                this.gtagEnhancedEcommerce(model, 'add_to_cart');
            if(!window.isMobile){
                this.props.basketActions.basketAddEffect(<AddToBasketEffect startPosition={ $(e.target).offset() }
                                                                            image={model.colorImage}
                                                                            basketType="kaufen"/>)
                setTimeout( () => {
                    browserHistory.push('/warenkorb')
                    this.props.basketActions.basketAddEffect( null )
                }, 2000)
            }
            else browserHistory.push('/warenkorb')


        }
    }

    gtagEnhancedEcommerce = (item, tag) => {
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

    mapSimilarItems( model, i ){
        let url = '',
            { accessoriesDetailPage } = this.props

        if( accessoriesDetailPage ){
            let modelName = model.model.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
                deviceName = model.deviceName.toLowerCase().replace(/ /g, '-')

            url = `/kaufen/detail/zubehoer/${deviceName}/${modelName}/${model.shortcode}`
        }
        else{
            let modelName = model.model.split(" ").join('-').toLowerCase(),
                color = model.color.toLowerCase() || 'color',
                capacity = model.capacity.toLowerCase() || 'capacity',
                deviceName = model.deviceName.replace(/ /g, '-').toLowerCase()
            url = `/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${model.shortcode}`
        }

        return(
            <div className="col-md-3 col-sm-6" key={i}>
                <div className="itemModelWrap">
                    <Link to={url}
                          onClick={(e)=>this.clickOnLink(e,model)}
                          key={i}>
                        <div style={{width: '100%'}}>
                            <div className="image">
                                <img src={model.colorImage || model.deviceImages.mainImg.src} alt=""/>
                            </div>
                            <p className="modelName">
                                {model.model}{model.extendedTitle && ` (${model.extendedTitle})`}
                            </p>
                            { !accessoriesDetailPage &&
                                <div>
                                    <span className="modelValues">
                                        <span>
                                            {model.capacity}
                                            {model.capacityImage && <img src={model.capacityImage} alt="" />}
                                        </span>
                                        <span>
                                            {model.color}&nbsp;
                                            {model.colorCode && <span className="colorPic"
                                                                      style={{backgroundColor: model.colorCode }}/>}
                                        </span>
                                    </span>
                                </div>
                            }
                            { !accessoriesDetailPage && <p className="condition">Zustand: <b>{model.condition}</b></p> }
                        </div>
                        <div className="bottomRow">
                            <div className="row">
                                <div className="col-xs-6 price">
                                    <p className="price-head">Preis</p>
                                    {model.discountPrice &&
                                    <p className="price-value discount-price">{model.discountPrice} {window.currencyValue}</p>
                                    }
                                    <p className={model.discountPrice ? 'price-value old-price' : 'price-value'}>{model.price} {window.currencyValue}</p>
                                </div>
                                <div className="col-xs-6 text-right">
                                    <button data-status={this.props.basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                            className="btn addToBasket"
                                            onClick={ (e) => this.addModelToBasket(e,model)}>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
    render(){
        let { similarItems } = this.props,
            settings = {
                dots: true,
                arrows: false,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            }
        return(
            <div>
                { similarItems.length > 0 &&
                                                <div className="listSimilarItems">
                                                    <h2 className="tag">Weitere Produkte</h2>
                                                    <h2 className="head">Folgendes könnte Sie auch interessieren</h2>
                                                    <div className="row wrapItems">
                                                        {!window.isMobile
                                                            ? similarItems.map( this.mapSimilarItems )
                                                            : <Slider {...settings}>
                                                                {similarItems.map( this.mapSimilarItems )}
                                                              </Slider>
                                                        }
                                                    </div>

                                                </div>
                }
            </div>
        )
    }
}


ListSimilarItems.propTypes = {}
ListSimilarItems.defaultProps = {
    accessoriesDetailPage: false
}

function mapStateToProps (state) {
    return {
        basketData: state.basket.basketData
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSimilarItems)
