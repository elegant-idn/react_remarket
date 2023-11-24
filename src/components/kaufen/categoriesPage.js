import React, { Component } from 'react';
import { Link } from 'react-router'
import _debounce from 'lodash/debounce'
import {Animated} from "react-animated-css"
import Shuffle from 'shufflejs'

import SubcategoriesComponent from './subCategoriesComponent'

import  {connect} from 'react-redux'
import * as shopActions from "../../actions/shop";
import {bindActionCreators} from "redux";

export class CategoriesPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            categoryName: this.props.params.deviceCategory1 || 'Welches Gerät möchten Sie kaufen?',
            searchData: [],
            searchValue: '' || this.props.helperCounter,
            totalSearchItems: 0,
            currentSearchPage: 1,
            perPage: 0,
            showInfoNoData: false,
            showSearchResult: false,
        }

        this.handleChangeSearchField = this.handleChangeSearchField.bind(this)
        this.mapCategoriesData = this.mapCategoriesData.bind(this)
        this.mapSearchData = this.mapSearchData.bind(this)
        this.handleClickLoadMoreSearchResults = this.handleClickLoadMoreSearchResults.bind(this)
        this._getSearchResults = this._getSearchResults.bind(this)
        this.setSearchData = this.setSearchData.bind(this)
        this.debouncedLoadSearchResults = _debounce(this._getSearchResults, 1000)
    }

    componentWillMount(){
        if(this.props.helperCounter){
            return this.debouncedLoadSearchResults(this.props.helperCounter,1)
        }
    }

    handleOnScroll = () => {
        let {searchValue, totalSearchItems, searchData} = this.state;
        if (searchValue) {
            if (searchData.length === totalSearchItems) return false;
            else {
                if (
                    window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - window.innerHeight/1.5.toFixed()
                ) {
                    this.handleClickLoadMoreSearchResults()
                }
            }
        }
    };

    componentDidMount(){
        window.addEventListener('scroll', this.handleOnScroll, {passive: true});
        if(this.props.devices.length === 0) document.getElementById('spinner-box-load').style.display = 'block';
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.devices !== this.props.devices && nextProps.devices.length >= 0){
            document.getElementById('spinner-box-load').style.display = 'none'
        }

        if(nextProps.params !== this.props.params){
            this.setState({ showSearchResult: false,
                            searchValue: '',
                            searchData: [],
                            currentSearchPage: 1,
                            showInfoNoData: false,
                            showSearchInfo: false,
                            categoryName: nextProps.params.deviceCategory1 || 'Kategorien'})
        }
    }
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleOnScroll);
        this.debouncedLoadSearchResults.cancel();
    }
    _getSearchResults(value, page, clickLoadMore){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/searchShopAccessories?search=${value}&page=${page}`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none';
                if(clickLoadMore){
                    this.setState({
                        searchData: this.state.searchData.concat(result.data.accessories),
                        totalSearchItems: result.data.totalCount,
                        perPage: result.data.perPage
                    })
                }
                else{
                    this.setState({
                        searchData: result.data.accessories,
                        totalSearchItems: result.data.totalCount,
                        perPage: result.data.perPage,
                        currentSearchPage: 1,
                        showSearchResult: true,
                        showInfoNoData: result.data.accessories.length === 0,
                    })
                }

            })
    }
    setSearchData(searchData){
        this.setState({ searchData })
    }

    handleChangeSearchField(e){
        let { value } = e.target
        if(value) {
            this.setState({ searchValue: value})
            this.debouncedLoadSearchResults(value, 1)
        }
        else {
            this.debouncedLoadSearchResults.cancel()
            this.setState({ searchValue: value,
                showSearchResult: false,
                searchData: [],
                currentSearchPage: 1,
                showInfoNoData: false,
                showSearchInfo: false })
        }
    }

    mapSearchData( item, i){
        const {definedCounerForSearchInput} = this.props.shopActions;
        const {searchValue, currentSearchPage} = this.state;

        let modelName = item.title.split(" ").join('-').toLowerCase().replace(/\//g, '--'),
            deviceName = item.deviceName.toLowerCase().replace(/ /g, '-')
        return(
            <div onClick={()=>definedCounerForSearchInput({searchValue,currentSearchPage})} className="col-md-3 item-accessory-shuffle" key={i}>
                <Animated animationIn="fadeIn zoomIn" animationOut="zoomOut">
                    <Link to={`/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`}>
                        <div className="item-accessory">
                            <div>
                                <div className="image">
                                    <img src={ item.images && item.images[0].filename || `/images/design/Product.svg`} alt=""/>
                                </div>
                                <p className="modelName">
                                    {item.title}
                                </p>
                            </div>
                            <div className="bottom-row">
                                <div className="price">
                                    <p className="price-head">Preis</p>
                                    <p className="price-value">{item.price} {window.currencyValue}</p>
                                </div>
                                <div className="text-right">
                                    <button className="btn addToBasket"/>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Animated>
            </div>

        )
    }
    handleClickLoadMoreSearchResults = () => {
        let { currentSearchPage, searchValue } = this.state,
            page = ++currentSearchPage
        this.setState({ currentSearchPage: page})
        this._getSearchResults(searchValue, page, true)
    }
    mapCategoriesData(){
        let groupSize = !window.isMobile ? 4 : 2
        let rows = this.props.devices.reduce((r, element, index) => {
            index % groupSize === 0 && r.push([])
            r[r.length - 1].push(
                <Link to={`/kaufen/${element.name.toLowerCase().replace( / /g, '-')}`}
                      className="item-category" key={index}>
                    <div className="image">
                        <img src={`/images/design/${element.id}activeDevice.svg`} alt=""/>
                    </div>
                    <p className="name">{element.name}</p>
                </Link>
            )
            return r;
        }, []).map(function(rowContent ,i) {
            return <div className='category-row' key={i}>{rowContent}</div>
        })
        return rows
    }

    render() {
        let { categoryName, searchValue, searchData, totalSearchItems, showSearchResult, showInfoNoData,
              currentSearchPage, perPage } = this.state,
            showLoadMore = currentSearchPage < Math.ceil( totalSearchItems/perPage)

        return (
            <div className="kaufen-page">
                <div className="kaufen-page-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="categories-list" style={{margin: 0}}>
                                    <div className="item-category main">
                                        <p className="category">Produkt auswählen</p>
                                        <p className="title">{categoryName}</p>
                                    </div>
                                </div>
                            </div>
                            {this.props.params.deviceCategory1 === "zubehör" &&
                                <div className="col-md-6">
                                    <div className="searchBar">
                                        <input type="text"
                                               value={ searchValue || this.props.helperCounter }
                                               onChange={this.handleChangeSearchField}
                                               placeholder='Produkt finden'/>
                                        {searchData.length > 0 &&
                                        <span className="result-count">{totalSearchItems} Resulate</span>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        {(showSearchResult && searchData.length > 0) &&
                            <div className="accessories">
                                <div className="row accessory-row">
                                    {searchData.map(this.mapSearchData)}
                                </div>
                            </div>
                        }
                        {!showSearchResult &&
                            <div className="row">
                                <div className="categories-list">
                                    <div className="col-md-3"/>
                                    <div className="col-md-12">
                                        <SubcategoriesComponent index={1}
                                                                params={this.props.params}
                                                                submodels={this.props.devices || []}/>
                                    </div>
                                </div>
                            </div>
                        }
                        {showInfoNoData &&
                            <div className="text-center">
                                <h1>Information</h1>
                                <p>Aktuell sind von diesem Typ keine Produkte an Lager.</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        devices: state.shop.devices,
        helperCounter: state.shop.helperCounter.searchValue,
        currentPage: state.shop.helperCounter.currentSearchPage,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        shopActions: bindActionCreators(shopActions, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CategoriesPage)