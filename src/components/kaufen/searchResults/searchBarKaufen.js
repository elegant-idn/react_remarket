import React, {Component} from 'react'
import _debounce from 'lodash/debounce'
import {browserHistory, withRouter} from 'react-router'

import  {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as shopActions from '../../../actions/shop'
import Autosuggest from 'react-autosuggest';

export class SearchBarKaufen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            filteredByShortcode: false
        };

        this.debouncedLoadSuggestions = _debounce(this.loadSuggestions, 100)
    }
    componentWillUnmount(){
        this.debouncedLoadSuggestions.cancel()
    }
    renderSuggestion = (suggestion) => {
        //suggestion.title for produsts
        let { value } = this.state,
            {pathname} = this.props.location,
            suggestionName = suggestion.name || suggestion.model || suggestion.title,
            suggestionCount = suggestion.count || 1,
            cssClass = '';

        if(suggestionName.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            let name = suggestionName.toLowerCase().trim(),
                index = name.indexOf(value.trim().toLowerCase()),
                text = suggestionName.slice(0, index);

            if (value && value.split('')[value.length - 1].charCodeAt() === 32) {
                cssClass = 'addPadding'
            }

            text += '<span class="searchText">' + suggestionName.slice(index , index + value.length) + '</span>'
            text += suggestionName.slice(index + value.length)

            return (
                <React.Fragment>
                    {pathname === '/'?
                        <React.Fragment>
                            {suggestion.deviceImages && <img className="verkaufen-search-img" src={suggestion.deviceImages.mainImg.src} alt={suggestion.modelName}/>}
                            <span className={cssClass} dangerouslySetInnerHTML={{__html: text }}/>
                        </React.Fragment>
                        :

                        <React.Fragment>
                            {this.props.params.deviceCategory1 === "zubehör" ?
                                <span className={cssClass} dangerouslySetInnerHTML={{__html: text}}/> :
                                <span className={cssClass} dangerouslySetInnerHTML={{__html: text + ` (Resultate: ${suggestionCount})`}}/>
                            }
                        </React.Fragment>
                    }
                </React.Fragment>
            )
        }
    };
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    };
    pressEnterOnInput = (e) => {
        if(e.key === "Enter"){
            this.setState({ pressSearch: true })
            browserHistory.push(`/kaufen/search/${this.state.value}`)
        }
    }



    getSearchResults = (value, page) => {
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/searchShopAccessories?search=${value}&page=${page}`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none';
                this.setState({
                    suggestions:result.data.accessories
                })
        })
    };

    loadSuggestions(value) {
        let objForRequest = {
            search: value
        };
        //for products
        if (this.props.params && this.props.params.deviceCategory1 === "zubehör") {
            this.getSearchResults(value, 'all')
        }

        //for devices
        else {
            axios.post(`/api/models`, objForRequest)
                .then( result => {
                    if(result.data.meta.filteredByShortcode){
                        this.setState({ suggestions: result.data.data, filteredByShortcode: true })
                    }
                    else this.setState({ suggestions: result.data.meta.namesList.values, filteredByShortcode: false })
                })
        }
    }
    onSuggestionsFetchRequested = ({value}) => {
        this.debouncedLoadSuggestions(value)

    }
    onSuggestionSelected = (event, { suggestion }) => {
        let { filteredByShortcode } = this.state
        if(filteredByShortcode){
            let modelName = suggestion.model.split(" ").join('-').toLowerCase(),
                color = suggestion.color.toLowerCase() || 'color',
                capacity = suggestion.capacity.toLowerCase() || 'capacity',
                deviceName = suggestion.deviceName.replace(/ /g, '-').toLowerCase()

            browserHistory.push(`/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${suggestion.shortcode}`)
        }
        if (this.props.params.deviceCategory1 === "zubehör") {
            let modelName = suggestion.title.split(" ").join('-').toLowerCase();
            modelName = modelName.split('/');
            browserHistory.push(`/kaufen/detail/zubehoer/${suggestion.categoryName}/${modelName[modelName.length - 1]}/${suggestion.shortcode}`);
        }
        else browserHistory.push(`/kaufen/search/${suggestion.name}`)
    }
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }
    pressSearchBtn = () => {
        if(this.state.value){
            browserHistory.push(`/kaufen/search/${this.state.value}`)
        }
    }

    render() {
        const { value, suggestions } = this.state;
        let {pathname} = this.props.location;
        let {showBtn} = this.props;
        const inputProps = {
            placeholder: this.props.placeholder || '',
            value,
            onChange: this.onChange,
            onKeyUp: this.pressEnterOnInput,
        }
        if (window.isMobile)
            return (
                <section className="row search-input-block phone-search-section d-none" style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div className="searchBarBeta">
                        {pathname === '/' ? null:null}
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                        />
                    </div>
                    {showBtn && <div className="lable verkaufen-search" onClick={()=>this.pressSearchBtn()} />}
                </section>
            )
        else
            return (
                <div>
                    <div className="searchBar">
                        {pathname === '/' ? null:null}
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                        />
                    </div>
                    {showBtn && <div className="lable verkaufen-search" onClick={()=>this.pressSearchBtn()}>PRODUKT SUCHEN</div>}                
                </div>            
            )
    }
}

SearchBarKaufen.propTypes = {};
SearchBarKaufen.defaultProps = {};

function mapStateToProps (state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        shopActions: bindActionCreators(shopActions, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBarKaufen))

const getSuggestionValue = suggestion => suggestion.name ||  suggestion.model
