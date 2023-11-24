import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import {Link} from "react-router";

class AccessoriesBlock extends Component {
    constructor(props) {
        super(props)

        this.state = {
            accessoriesData: [],
            pagination: {
                activePage: 0,
                totalItemsCount: 0,
                pageCount: 0
            },
            loadData: false
        }
        this.handlePageChange = this.handlePageChange.bind(this)
        this._loadAccessoriesData = this._loadAccessoriesData.bind(this)
        this.mapAccessories = this.mapAccessories.bind(this)
    }
    componentDidMount(){
        this._loadAccessoriesData(this.props.modelId)
    }
    handlePageChange(pageNumber){
        this.setState({ pagination: {...this.state.pagination, activePage: pageNumber.selected } })
        this._loadAccessoriesData(this.props.modelId, pageNumber.selected + 1)
    }

    gtagEnhancedEcommerce = (e, item) => {
        if(e.target.tagName === "BUTTON") {
            return;
        }
        else {
            let brands = item.criterias.find( item => item.id === 'manufacturer').values,
                brand = brands.length ? brands[0].name : "";

            gtag('event', 'select_content', {
                "content_type": "product",
                "items": [
                    {
                        "id": item.shortcode,
                        "name": item.descriptionLong || item.model || '',
                        "list_name": "Kaufen",
                        "quantity": 1,
                        "brand": brand,
                        "price": item.discountPrice || item.price,
                        "category": item.categoryName,
                    }
                ]
            });
        }
    }


    mapAccessories( item ){
        let modelName = item.model.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
            deviceName = item.deviceName.toLowerCase().replace(/ /g, '-')
        return(
            <div className="col-md-3" key={item.shortcode}>
                <Link to={`/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`}
                      onClick={(e)=>this.gtagEnhancedEcommerce(e,item)}>
                    <div className="item-accessory">
                        <div>
                            <div className="image">
                                <img src={ item.deviceImages.mainImg.src || `/images/design/Product.svg`} alt=""/>
                            </div>
                            <p className="modelName">
                                {item.model}
                            </p>
                        </div>
                        <div className="bottom-row">
                            <div className="price">
                                <p className="price-head">Preis</p>
                                {item.discountPrice &&
                                <p className="price-value">{item.discountPrice} {window.currencyValue}</p>
                                }
                                <p className={item.discountPrice ? 'price-value old-price' : 'price-value'}>{ Math.round((+item.price) * 100) / 100} {window.currencyValue}</p>
                            </div>
                            <div className="text-right">
                                <button data-status="out" className="btn addToBasket" onClick={(e) => this.props.addModelToBasket(e, item)}/>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
    _loadAccessoriesData(modelId, page = 1){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/getShopAccessories?page=${page}&modelId=${modelId}`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({
                    loadData: true,
                    accessoriesData: result.data.accessories,
                    pagination: { ...this.state.pagination,
                                     totalItemsCount: result.data.totalCount,
                                     pageCount: Math.ceil(result.data.totalCount/result.data.perPage)
                                }
                })
            })
    }
    render() {
        let { pagination, accessoriesData, loadData } = this.state
        return (
            <div className="accessories">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row accessory-row">
                                {accessoriesData.map( this.mapAccessories)}
                            </div>
                            {accessoriesData.length === 0 && loadData &&
                                <div className="text-center">
                                    <h1>Information</h1>
                                    <p>Aktuell sind von diesem Typ keine Geräte an Lager.</p>
                                </div>
                            }
                        </div>
                        <div className="col-md-12 text-center">
                            <div className="pagination-row">
                                {accessoriesData.length > 0 &&
                                    <ReactPaginate previousLabel={"<"}
                                                   nextLabel={">"}
                                                   breakLabel={<a>...</a>}
                                                   breakClassName={"break-me"}
                                                   pageCount={pagination.pageCount}
                                                   forcePage={pagination.activePage}
                                                   marginPagesDisplayed={5}
                                                   pageRangeDisplayed={5}
                                                   onPageChange={this.handlePageChange}
                                                   containerClassName={"pagination"}
                                                   subContainerClassName={"pages pagination"}
                                                   activeClassName={"active"} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AccessoriesBlock.propTypes = {}
AccessoriesBlock.defaultProps = {}
export default AccessoriesBlock