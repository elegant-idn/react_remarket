import axios from 'axios'
import React, { Component } from 'react'
import { Helmet } from "react-helmet"
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { bindActionCreators } from "redux"
import * as currentPath from "../../../actions/currentPath"
import api from '../../../api/index'
import { pushKlavioIdentify } from '../../../helpers/helpersFunction'
import ListSimilarItems from '../listSimilarItems'
import ModelInfoBlock from './accessoryInfoBlock'


class AccessoryDetailPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            model: [],
            similarItems: [],
            deviceStatus: {
                statusId: 1,
                dateOfBought: null,
                boughtCurrentUser: false
            },
            seoAccessoriesData: null,
            compatibilityList: [],
            colorList: [],
            variantProducts: [],             
        }

        this.clickNavItem = this.clickNavItem.bind(this)
        this.mapAccessories = this.mapAccessories.bind(this)
        this._getModelData = this._getModelData.bind(this)
    }

    componentWillReceiveProps(nextProps){
        if( nextProps.params.currentModelId !== this.props.params.currentModelId){
            let { currentModelId, device: deviceName } = nextProps.params
            deviceName = deviceName.split("-").join(' ')
            let objForRequest = {
                deviceName,
                shortcode: currentModelId
            }
            this._getModelData(objForRequest);
        }
    }

    componentDidMount(){
        let { currentModelId, device: deviceName } = this.props.params
        deviceName = deviceName.split("-").join(' ')
        let objForRequest = {
            deviceName,
            shortcode: currentModelId
        }
        this._getModelData(objForRequest);
    }

    _getModelData(objForRequest){
        document.getElementById('spinner-box-load').style.display = 'block'
        api.getModels(`/api/getShopCategoryProducts`, objForRequest)
            .then( ( { data } ) => {
                let responseData = data
                this.setState({
                    model: responseData.data,
                    capacityName: responseData.meta.capacityName,
                    seoAccessoriesData: {
                        ...this.state.seoAccessoriesData,
                        meta_description: data.meta.meta_description,
                        title: data.meta.title,
                    },
                });
                let brands = responseData.data[0].criterias.find( item => item.id === 'manufacturer').values;
                gtag('event', 'view_item', {
                    "items": [
                        {
                            "id": responseData.data[0].shortcode,
                            "name": responseData.data[0].model,
                            "list_name": "Kaufen",
                            "quantity": 1,
                            "category": responseData.data[0].categoryName,
                            "price":   responseData.data[0].discountPrice || responseData.data[0].price,
                            "brand": brands.length ? brands[0].name : ""
                        }
                    ]
                });
                pushKlavioIdentify();
                var klavioItem = {
                    "ProductName": responseData.data[0].model,
                    "ProductID": responseData.data[0].shortcode,
                    "Categories": [responseData.data[0].categoryName],
                    "ImageURL": responseData.data[0].deviceImages.mainImg.src,
                    "URL": window.location.href,
                    "Brand": brands.length ? brands[0].name : "",
                    "Price": responseData.data[0].discountPrice || responseData.data[0].price,
                    "CompareAtPrice": responseData.data[0].price
                };

                _learnq.push(["track", "Viewed Product", klavioItem]);

                _learnq.push(["trackViewedItem", {
                    "Title": klavioItem.ProductName,
                    "ItemId": klavioItem.ProductID,
                    "Categories": klavioItem.Categories,
                    "ImageUrl": klavioItem.ImageURL,
                    "Url": klavioItem.URL,
                    "Metadata": {
                        "Brand": klavioItem.Brand,
                        "Price": klavioItem.Price,
                        "CompareAtPrice": klavioItem.CompareAtPrice
                    }
                }]);
            })
            .catch( error => {
                this.setState({ seoAccessoriesData: null })
                if (error && error.response.data.errors.shortcode[0]) {
                    this.props.currentPath.setLocation(window.location.pathname);
                    browserHistory.push('/404') }
            });

        axios.post(`/api/getShopCategoryProducts`, {...objForRequest, similarProducts: true })
            .then( ( {data} ) => {
                this.setState({ similarItems: data.data })
            })
            .catch( error => {})

        axios.post(`/api/getShopCategoryCriteriasVariantList`, objForRequest)
            .then(({ data }) => {
                const compatibilities = data.meta.filter((el) => el.id === 'compatibility')
                this.setState({ compatibilityList: compatibilities.length ? compatibilities[0].values : [] })
                const colors = data.meta.filter((el) => el.id === 'color')
                this.setState({ colorList: colors.length ? colors[0].values : [] })
                this.setState({ variantProducts: data.data.length ? data.data : [] })
            })
            .catch(error => {})            

    }
    clickNavItem(e){
        let activeNavItem = e.currentTarget.getAttribute('data-type')
        this.setState({ activeNavItem })
    }
    mapAccessories( item, i){
        return(
            <li key={`mapAccessories-${i}`}><i className="fa fa-check-circle-o" aria-hidden="true"/>{item}</li>
        )
    }

    render() {
        let { model, similarItems, deviceStatus,  seoAccessoriesData, compatibilityList, colorList, variantProducts} = this.state,
            { device: deviceName } = this.props.params,
            loader = document.getElementById('spinner-box-load')
        if(loader && model[0]) loader.style.display = 'none'
        let brands = "", modified_time = "", mainImg = "", seoCategories = "";
        let schemaData = {}
        if (model[0]) {
            brands = model[0].criterias.find( item => item.id === 'manufacturer').values;
            modified_time = new Date(model[0].modified * 1000);
            modified_time = modified_time.toISOString();   
            mainImg = model[0].deviceImages.mainImg.src;   
            let compatibleModels = model[0].criterias.find( item => item.id === 'compatibility').values;
            seoCategories = model[0].categoryName;
            if (compatibleModels.length > 0) {
                seoCategories = seoCategories + " " + compatibleModels.map( (itemValue, i) => itemValue.name).join(" ");
            }            

            // add schema
            let product = model[0]
            let brand = brands.length ? brands[0].name : ""
            let offers = {}
            if (product.discountPrice === false) {
                offers = {
                    "@type": "Offer",
                    "url": window.location.href,
                    "priceCurrency": "CHF",
                    "price": product.price,
                }
            } else {
                offers = {
                    "@type": "AggregateOffer",
                    "url": window.location.href,
                    "priceCurrency": "CHF",
                    "lowPrice": product.discountPrice,
                    "highPrice": product.price,
                }
            }
            
            let stockProduct = {}
            if (parseInt(product.quantity) > 0) {
                stockProduct = {
                    "availability": "https://schema.org/InStock",
                }
            } else {
                stockProduct = {
                    "availability": "https://schema.org/OutOfStock",
                }
            }
            
            schemaData = {
                "@context": "http://schema.org/",
                "@type": "Product",
                "name": `${product.categoryName}`,
                "image": product.deviceImages.mainImg.src,
                "description": product.descriptionShop === "" ? product.descriptionShopSeo : product.descriptionShop,
                "brand": brand,
                "sku": product.shortcode,
                "offers": offers,
                "itemCondition": "https://schema.org/NewCondition",
            }
            schemaData = {
                ...schemaData,
                ...stockProduct
            }
        }        
        let structuredSchemaDataJSON = JSON.stringify(schemaData)

        return (
            <div>
                {
                    this.state.seoAccessoriesData && model[0] &&
                    <Helmet
                        title={seoAccessoriesData.title}
                        meta={[
                            {"name": "description", "content": seoAccessoriesData.meta_description},
                            {"name": "robots", "content": "index, follow"},
                            {"property": "og:locale", "content": "de_DE"},
                            {"property": "og:type", "content": "product"},
                            {"property": "og:title", "content": model[0].model},
                            {"property": "og:description", "content": model[0].descriptionShop !== "" ? model[0].descriptionShop : model[0].description + ". Auf Rechnung oder Ratenzahlung bestellen. A-Post Versand kostenlos."}  ,
                            {"property": "og:category", "content": seoCategories},
                            {"property": "og:brand", "content": brands.length ? brands[0].name : ""},
                            {"property": "og:url", "content": window.location.href},
                            {"property": "article:modified_time", "content": modified_time},
                            {"property": "og:image", "content": mainImg},
                            {"itemprop": "image", "content": mainImg},
                        ]}
                    />
                }
                <Helmet>
                    <script type="application/ld+json">{structuredSchemaDataJSON}</script>
                </Helmet>
                {model[0] &&
                    <div className="detailPage">
                        <div className="infoBlock">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="navigation-row col-xs-12">
                                        <Link to="/"><img src="/images/design/house-icon.svg" alt="" /></Link>
                                        <Link to="/">Startseite</Link>
                                        <Link to="/kaufen/zubehör">Shop</Link>
                                        <Link to={`/kaufen/zubehör/${model[0].deviceName.replace( / /g, '-')}/filter`}>{model[0].categoryName}</Link>
                                        <span>{model[0] && model[0].model}</span>
                                    </div>
                                    <ModelInfoBlock currentModel={model}
                                                    deviceStatus={deviceStatus}
                                                    capacityName={''}
                                                    variantCompatibilityList={compatibilityList}
                                                    variantColorList={colorList}
                                                    variantProducts={variantProducts} />
                                </div>
                                <div className="cb"/>
                            </div>
                        </div>

                        <div className="similar">
                            <div className="container">
                                <ListSimilarItems similarItems={similarItems}
                                                  accessoriesDetailPage={true}
                                                  deviceName={deviceName}/>
                                <div className="cb"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

AccessoryDetailPage.propTypes = {}
AccessoryDetailPage.defaultProps = {}

function mapStateToProps (state) {
    return {
        devices: state.shop.devices,
        loc: state.currentPath
    }
}

function mapDispatchToProps(dispatch) {
    return {
        currentPath: bindActionCreators(currentPath, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AccessoryDetailPage)

