import axios from 'axios'
import React, {Component} from 'react'
import _debounce from 'lodash/debounce'
import {browserHistory, withRouter} from 'react-router'

import  {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as shopActions from '../../../actions/shop'
import { getLang } from '../../../helpers/helpersFunction'

import Autosuggest from 'react-autosuggest';

const moreCount = 5

export class SearchBarKaufenV3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            filteredByShortcode: false,
        };

        this._parseUrl = this._parseUrl.bind(this)
        this._clickViewmore = this._clickViewmore.bind(this)
        this._getObjForRequest = this._getObjForRequest.bind(this)
        this._getProductSuggestions = this._getProductSuggestions.bind(this)
        this._setProductSuggestions = this._setProductSuggestions.bind(this)
        this._getDeviceSuggestions = this._getDeviceSuggestions.bind(this)
        this._setDeviceSuggestions = this._setDeviceSuggestions.bind(this)
        this._setBothSuggestions = this._setBothSuggestions.bind(this)
        this.debouncedLoadSuggestions = _debounce(this.loadSuggestions, 1000)
        this.onClickSearchIcon = this.onClickSearchIcon.bind(this)
    }
    componentDidMount() {
        var placeholder = this.props.placeholder || ''
        var placeholderArr = placeholder.split(/ +/);
        if(placeholderArr.length) {
            var spans = $('<div id="placeHolderDiv" />');
            $.each(placeholderArr, function(index, value) {
                spans.append($('<span />').html(value + '&nbsp;'));
            });
            $("#searchInput").parent().append(spans);
        }

    }
    componentDidUpdate(){

    }

    componentWillUnmount(){
        this.debouncedLoadSuggestions.cancel()
    }
    getSuggestionValue = (suggestion) => {
        return suggestion.name
    }
    getSectionSuggestions = (section) => {
        return section.item
    }
    _clickViewmore (e, sectionId) {
        let { suggestions } = this.state
        let newSuggestions = suggestions.map((suggestion) => {
            if (suggestion.section.id === sectionId) {
                let hideItems = suggestion.item.find(item => item.hide === true)
                let newItem = []
                if (typeof hideItems !== 'undefined') {
                    newItem = suggestion.item.map((item) => {
                        return {
                            ...item,
                            hide: false
                        }

                    })
                } else {
                    newItem = suggestion.item.map((item, index) => {
                        if (index + 1 > moreCount) {
                            return {
                                ...item,
                                hide: true
                            }
                        } else {
                            return item
                        }
                    })
                }
                return {
                    ...suggestion,
                    item: newItem
                }
            } else {
                return suggestion
            }
        })

        this.setState({
            suggestions: newSuggestions
        })
    }

    renderSectionTitle = (suggestion) => {
        return (
            <React.Fragment>
                <div className="searchResultSection">
                    <div className="searchResultSectionTitle">
                        {suggestion.section.name}
                    </div>
                    {suggestion.section.count > moreCount && (
                        <div className="searchResultSectionnMore" onClick={(e) => this._clickViewmore(e, suggestion.section.id)}>
                            Mehr anzeigen
                        </div>
                    )}
                </div>
            </React.Fragment>
        )
    }
    renderSuggestion = (suggestion) => {
        let { value } = this.state, suggestionName = suggestion.name
        let lang = getLang()
        if (lang == 'en') {
            suggestionName = suggestion.name_en
        } else if (lang == 'fr') {
            suggestionName = suggestion.name_fr
        } else if (lang == 'it') {
            suggestionName = suggestion.name_it
        }
        if (suggestion.searchType == 'device') {
            let capacity = suggestion.capacity
            let color = suggestion.color
            if (lang == 'en') {
                capacity = suggestion.capacity_en
                color = suggestion.color_en
            } else if (lang == 'fr') {
                capacity = suggestion.capacity_fr
                color = suggestion.color_fr
            } else if (lang == 'it') {
                capacity = suggestion.capacity_it
                color = suggestion.color_it
            }
            suggestionName = capacity && capacity.length != '' ? suggestionName+", "+capacity : suggestionName
            suggestionName = color && color.length != '' ? suggestionName+", "+color : suggestionName
        }

        let searshStrings = value.split(" ")
        const result = searshStrings.some(searshString => suggestionName.toLowerCase().includes(searshString.toLocaleLowerCase()))
        let text = '', name = suggestionName.toLowerCase().trim()
        if (result) {
            let searchResults = []
            let searchStartIndex = 0;
            searshStrings.forEach( (searshString) => {
                let index = name.indexOf(searshString.trim().toLowerCase(), searchStartIndex)
                let len = searshString.trim().length
                searchResults = [
                    ...searchResults,
                    {
                        start: index,
                        len: len
                    }
                ]
                searchStartIndex = index + len
            })

            let getIndex = 0
            let formatText = ''
            let lastText = ''
            for (let i = 0; i < searchResults.length; i++) {
                text = suggestionName.slice(getIndex, searchResults[i].start)
                let orgText = suggestionName.slice(searchResults[i].start, searchResults[i].start + searchResults[i].len)
                formatText += text + '<span class="searchText">' + orgText + '</span>'
                getIndex = searchResults[i].start + searchResults[i].len
                lastText = suggestionName.slice(getIndex, suggestionName.length)
            }
            formatText += lastText

            let cssClass = 'searchResultItem'
            if (suggestion.hide) {
                cssClass = 'searchResultItem hide'
            }
            return (
                <React.Fragment>
                    <div className={cssClass}>
                        <div className="searchResultItemTitle">
                            <div className="verkaufen-search-img">
                                <img className="verkaufen-search-img" src={suggestion.image} />
                            </div>
                            <div className="searchResultItemName" dangerouslySetInnerHTML={{__html: formatText }}/>
                        </div>
                        <div className="searchResultItemPrice">
                            {suggestion.price} CHF
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    };

    pressEnterOnInput = (e) => {
        if(e.key === "Enter"){
            this.setState({ pressSearch: true })
            browserHistory.push(`/kaufen/search/${this.state.value}`)
        }
    }
    _parseUrl(nextPropsParams) {
        let urlParams = nextPropsParams,
            selectedFilterOptions = {
                page: 1,
                price: {
                    min: 0,
                    max: 1,
                    maxSearch: 0,
                    minSearch: 0
                },
                lagerort: {values: []},
                modell: {values: []},
                zustand: {values: []},
                sort: nextPropsParams.deviceCategory1 === 'zubehör' ? 'popular' : 'popular'

            },
            storageLocationData = JSON.parse(window.localStorage.getItem("locationData")),
            currentLocationData = {};
        this.props.places ?
            currentLocationData = this.props.places :
            storageLocationData ?
                storageLocationData.data.forEach((item) => {
                    if (item.active === true) {
                        currentLocationData = item
                    }
                })
                :
                currentLocationData = null
        for (let key in urlParams) {
            if (key.includes('param') && urlParams[key]) {
                let name = urlParams[key].slice(0, urlParams[key].indexOf('=')),
                    paramsArr = []

                if (name === "preis") {
                    paramsArr = urlParams[key].slice(urlParams[key].indexOf('=') + 1).split('-')
                    selectedFilterOptions.price.minSearch = paramsArr[0]
                    selectedFilterOptions.price.maxSearch = paramsArr[1]
                } else if (name === "sort" || name === "page") {
                    paramsArr = urlParams[key].slice(urlParams[key].indexOf('=') + 1)
                    selectedFilterOptions[name] = paramsArr
                } else {
                    paramsArr = urlParams[key].slice(urlParams[key].indexOf('=') + 1).split(',')
                    paramsArr.forEach((item, i) => paramsArr[i] = item.replace(/-/g, ' ').replace(/\|/g, '/'))
                    selectedFilterOptions[name] = paramsArr
                }
            }
        }
        return selectedFilterOptions
    }
    _getObjForRequest(selectedFilterOptions, devices, searchType, value, deviceName) {
        let objForRequest = {...selectedFilterOptions}

        for (let key in objForRequest) {
            if (key !== 'price' && key !== 'sort' && key !== 'page') objForRequest[key] = [...selectedFilterOptions[key]]
        }

        let lang = getLang()

        objForRequest['criterias'] = {}
        objForRequest['specifications'] = {}
        objForRequest['page'] = 1
        objForRequest['deviceName'] = deviceName
        objForRequest['searchQuery'] = value
        objForRequest['webShopCategoryIds'] = []
        objForRequest['modelCategoryIds'] = []
        objForRequest['lang'] = lang
        if (searchType === 'product') {
            let productCategories = devices.filter((item) => item.name.toLowerCase() === 'zubehör')
            if (productCategories.length > 0 && deviceName !== '') {
                objForRequest['webShopCategoryIds'] = productCategories[0].submodels.filter((item) => item.name.toLowerCase() === deviceName).map((item1) => {
                    return item1.id
                })
            }
        } else if (searchType === 'device') {
            // use search by deviceName
        } else if (searchType === 'both') {
            let productCategories = devices.filter((item) => item.name.toLowerCase() === 'zubehör')
            if (productCategories.length > 0) {
                objForRequest['webShopCategoryIds'] = productCategories[0].submodels.map((item1) => {
                    return item1.id
                })
            }
            let deviceModels = devices.filter((item) => item.name.toLowerCase() !== 'zubehör')
            if (deviceModels.length > 0) {
                objForRequest['modelCategoryIds'] = deviceModels.map((item1) => {
                    return item1.id
                })
            }
        }

        let arrKeys = ['lagerort', 'modell', 'deviceName', 'webShopCategoryIds', 'modelCategoryIds', 'price', 'zustand', 'garantie', 'sort', 'page', 'criterias', 'specifications', 'searchQuery', 'lang']
        for (let key in objForRequest) {
            if (arrKeys.every(item => item !== key)) {
                let name = key.slice(key.lastIndexOf('-') + 1),
                    currentFilterName = key.slice(0, key.lastIndexOf('-')),
                    filterType = currentFilterName === 'kategorie' ? 'criterias' : 'specifications'

                objForRequest[filterType][name] = [...objForRequest[key]]
                delete objForRequest[key]
            }
        }

        return objForRequest
    }
    _getProductSuggestions(data) {
        let productCategories = this.props.devices.filter((item) => item.name.toLowerCase() === 'zubehör')
        if (productCategories.length > 0) {
            let productItems = data.map((item, i) => {
                return {
                    id: item.id,
                    name: item.descriptionSearch,
                    name_en: item.descriptionSearch_en,
                    name_fr: item.descriptionSearch_fr,
                    name_it: item.descriptionSearch_it,
                    price: item.price,
                    image: item.deviceImages ? item.deviceImages.mainImg.src : '/images/design/' + productCategories[0].id + 'device.svg',
                    categoryName: item.categoryName,
                    shortcode: item.shortcode,
                    searchType: 'product',
                    categoryId: productCategories[0].id,
                    index: i,
                    hide: i + 1 > moreCount ? true : false,
                }
            })

            let productSection = {
                id: productCategories[0].id,
                name: productCategories[0].name,
                count: productItems.length
            }
            return [
                {
                    section: productSection,
                    item: productItems,
                }
            ]
        } else {
            return []
        }
    }
    _setProductSuggestions(data) {
        this.setState({
            suggestions: this._getProductSuggestions(data)
        })
    }

    _getDeviceSuggestions(data) {
        let deviceCategories = this.props.devices.filter((item) => item.name.toLowerCase() !== 'zubehör')
        if (deviceCategories.length > 0) {
            let deviceSuggestions = []
            deviceCategories.map((deviceCategory) => {
                let deviceDatas = data.filter((item) => item.mainDeviceId === deviceCategory.id)
                if (deviceDatas.length > 0) {
                    let deviceSection = {
                        id: deviceCategory.id,
                        name: deviceCategory.name,
                        count: deviceDatas.length
                    }

                    let deviceItems = deviceDatas.map((item, i) => {
                        return {
                            id: item.id,
                            name: item.model,
                            name_en: item.model_en,
                            name_fr: item.model_fr,
                            name_it: item.model_it,
                            price: item.price,
                            color: item.color? item.color : 'color',
                            color_en: item.color_en? item.color_en : 'color',
                            color_fr: item.color_fr? item.color_fr : 'color',
                            color_it: item.color_it? item.color_it : 'color',
                            capacity: item.capacity? item.capacity : 'capacity',
                            capacity_en: item.capacity_en? item.capacity_en : 'capacity',
                            capacity_fr: item.capacity_fr? item.capacity_fr : 'capacity',
                            capacity_it: item.capacity_it? item.capacity_it : 'capacity',
                            deviceName: item.deviceName.replace(/ /g, '-').toLowerCase(),
                            image: item.deviceImages ? item.deviceImages.mainImg.src : '/images/design/' + deviceCategory.id + 'device.svg',
                            categoryName: item.deviceName,
                            shortcode: item.shortcode,
                            searchType: 'device',
                            categoryId: item.DeviceId,
                            index: i,
                            hide: i + 1 > moreCount ? true : false,
                        }
                    })

                    deviceSuggestions = [...deviceSuggestions, {
                        section: deviceSection,
                        item: deviceItems,
                    }]

                }
            })
            return deviceSuggestions
        } else {
            return []
        }
    }

    _setDeviceSuggestions(data) {
        this.setState({
            suggestions: this._getDeviceSuggestions(data)
        })
    }

    _setBothSuggestions(productData, deviceData) {
        let deviceDatas = this._getDeviceSuggestions(deviceData)
        let productDatas = this._getProductSuggestions(productData)
        let suggestions = []
        suggestions = [...suggestions, ...deviceDatas, ...productDatas]
        this.setState({
            suggestions: suggestions
        })
    }


    loadSuggestions(value) {
        if (value.length < 5) {
            $(".top-search-bar").toggleClass('searchBar-loading', false);
            return
        }

        $(".top-search-bar").toggleClass('searchBar-loading', (value.length >= 5));

        let {params} = this.props,
            selectedFilterOptions = this._parseUrl(this.props.params),
            deviceName = ''

        let searchType = 'both'

        let objForRequest = this._getObjForRequest(selectedFilterOptions, this.props.devices, searchType, value, deviceName)

        this.onSuggestionsClearRequested()
        if (searchType === 'product') {
            axios.post(`/api/searchShopCategoryProducts`, objForRequest)
                .then( ( {data} ) => {
                    this._setProductSuggestions(data.data)
                    $(".top-search-bar").toggleClass('searchBar-loading', false);
                })
                .catch( error => {})
        } else if (searchType === 'device') {
            axios.post(`/api/searchModels`, objForRequest)
                .then( ( {data} ) => {
                    this._setDeviceSuggestions(data.data)
                    $(".top-search-bar").toggleClass('searchBar-loading', false);
                })
                .catch( error => {})
        } else if (searchType === 'both') {
            const promise1 = axios.post(`/api/searchShopCategoryProducts`, objForRequest)
            const promise2 = axios.post(`/api/searchModels`, objForRequest)
            Promise.all([promise1, promise2]).then((values) => {
                let productData = [], deviceData = []
                values.forEach( (item) => {
                    if(item.config.url === '/api/searchShopCategoryProducts') {
                        productData = item.data.data
                    } else if (item.config.url === '/api/searchModels') {
                        deviceData = item.data.data
                    }
                })

                this._setBothSuggestions(productData, deviceData)
                $(".top-search-bar").toggleClass('searchBar-loading', false);
            });
        }
    }

    onSuggestionsFetchRequested = ({value}) => {
        this.debouncedLoadSuggestions(value)

    }

    onSuggestionSelected = (event, { suggestion }) => {
        this.onSuggestionsClearRequested()
        this.setState({
            value: ''
        })
        if (suggestion.searchType === "product") {
            let modelName = suggestion.name.split(" ").join('-').toLowerCase();
            modelName = modelName.split('/');
            browserHistory.push(`/kaufen/detail/zubehoer/${suggestion.categoryName}/${modelName[modelName.length - 1]}/${suggestion.shortcode}`);
        } else if (suggestion.searchType === "device") {
            let modelName = suggestion.name.replace(/ /g, '-').toLowerCase(),
                color = suggestion.color.toLowerCase(), capacity = suggestion.capacity.toLowerCase(), deviceName = suggestion.deviceName;
            let url = `/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${suggestion.shortcode}`
            browserHistory.push(url);
        }
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }

    onClickSearchIcon = () => {
        $(".top-search-bar").addClass("searchBar-open")
        setTimeout(function() {
            $("#searchInput").focus();
        }, 1000);
    }

    onChange = (event, { newValue }) => {
        if (newValue === '')
            $(".top-search-bar").removeClass("searchBar-loading")
        this.setState({
            value: newValue
        })
    };

    onBlur = (event) => {
        $(".top-search-bar").removeClass("searchBar-open searchBar-loading")
        this.setState({
            value: ''
        })
        setTimeout(function() {
            $("#searchInput").val('');
        }, 400);
    };

    render() {
        const { value, suggestions } = this.state;
        let {pathname} = this.props.location;
        const inputProps = {
            placeholder: this.props.placeholder || '',
            value,
            onChange: this.onChange,
            onBlur: this.onBlur,
            id: 'searchInput',
            autoFocus: true,
        }
        return (
            <div className="top-search-bar" onClick={this.onClickSearchIcon}>
                {pathname === '/' ? null:null}
                <div className="searchBar-icon">
                    <span>
                        <svg viewBox="0 0 40 40">
                            <path d="M3,3 L37,37"></path>
                        </svg>
                    </span>
                </div>
                <div className="searchBar-field">
                    <Autosuggest
                        multiSection={true}
                        suggestions={suggestions}
                        onSuggestionSelected={this.onSuggestionSelected}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        renderSectionTitle={this.renderSectionTitle}
                        getSectionSuggestions={this.getSectionSuggestions}
                        inputProps={inputProps}
                    />
                </div>
                {(window.isMobile || window.isTablet) && (
                    <div className="closeDiv" onClick={this.props.hideSearchBar}>
                        <img src={"/images/design/closeBtn.svg"} />
                    </div>
                )}
            </div>
        )
    }
}

SearchBarKaufenV3.propTypes = {};
SearchBarKaufenV3.defaultProps = {};

function mapStateToProps (state) {
    return {
        devices: state.shop.devices
    }
}
function mapDispatchToProps(dispatch) {
    return {
        shopActions: bindActionCreators(shopActions, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBarKaufenV3))
