import React, {Component} from 'react'
import {withRouter} from 'react-router';
import _debounce from 'lodash/debounce'

import Autosuggest from 'react-autosuggest';

class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            suggestions: []
        };
        this.debouncedLoadSuggestions = _debounce(this.loadSuggestions, 1000)
    }

    renderSuggestion = (suggestion) => {
        let {pathname} = this.props.location,
            {value} = this.state;
        let cssClass = '';
        if(suggestion.modelName.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            let name = suggestion.modelName.toLowerCase().trim(),
                index = name.indexOf(value.trim().toLowerCase()),
                text = suggestion.modelName.slice(0, index);

            if (value && value.split('')[value.length - 1].charCodeAt() === 32) {
                cssClass = 'addPadding'
            }

            text += '<span class="searchText">' + suggestion.modelName.slice(index , index + value.length) + '</span>';
            text += suggestion.modelName.slice(index + value.length)

            return (
                <React.Fragment>
                    {pathname === '/' ? <img className="verkaufen-search-img" src={suggestion.image} alt={suggestion.modelName}/> : null}
                    <span className={cssClass} dangerouslySetInnerHTML={{__html: text}}/>
                </React.Fragment>
            )
        }
    };

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    };
    loadSuggestions(value) {
        axios.get(`/api/searchSellModels?needle=${value}`)
            .then( result => {
                this.setState({
                    suggestions: result.data.results
                })
            })
    }
    onSuggestionsFetchRequested = ({value}) => {
        this.debouncedLoadSuggestions(value)
    };
    onSuggestionSelected = (event, { suggestion }) => {
        axios.get(`/api/searchSellModelsInfo?modelId=${suggestion.modelId}`)
            .then( result => {
                this.props.setResults(result.data)
            })
            .catch( error => {
                if(error.response.status === 404){
                    let selector = window.isMobile ? '.invalidModel' : '.invalidModel .wrap'
                    $('.invalidModel').css({display: 'block'})
                    setTimeout(() => $(selector).css({opacity: '1'}), 500)
                    setTimeout(() => {
                        $(selector).css({opacity: '0'})
                        setTimeout(() => $('.invalidModel').css({display: 'none'}), 2500)
                    }, 5000)
                }
            })
    };
    onSuggestionsClearRequested = () => {};

    render() {
        const { value, suggestions } = this.state;
        let {pathname} = this.props.location;

        let suggestion = {};
        if (this.state.suggestions.length>0){
            suggestion = this.state.suggestions[0];
        }

        const inputProps = {
            placeholder: this.props.placeHolder || 'Modell suchen',
            value,
            onChange: this.onChange
        };
        const { name } = this.props.option, { showButton } = this.props,
            style = { right: window.isMobile?'':'45%'}
        if (window.isMobile)
            return (
                <section className="row search-input-block phone-search-section d-none" style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div className="searchBarBeta" style={(name && name === "Model") ? style : {}}>
                        {pathname === '/' ? null:null}
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            highlightFirstSuggestion={true}
                            inputProps={inputProps}
                        />
                        <div className="invalidModel">
                            <div className="wrap">
                                {pathname === '/' ? <p>Dieses Modell konnte nicht gefunden werden</p> : <p>Leider kaufen wir dieses Modell nicht mehr an</p>}
                            </div>
                        </div>
                    </div>
                    {showButton && <div className="lable verkaufen-search" onClick={(e)=>this.onSuggestionSelected(e,{suggestion})} />}
                </section>
            )
        else
            return (
                <div>
                    <div className="searchBarBeta" style={(name && name === "Model") ? style : {}}>
                        {pathname === '/' ? null:null}
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            highlightFirstSuggestion={true}
                            inputProps={inputProps}
                        />
                        <div className="invalidModel">
                            <div className="wrap">
                                {pathname === '/' ? <p>Dieses Modell konnte nicht gefunden werden</p> : <p>Leider kaufen wir dieses Modell nicht mehr an</p>}
                            </div>
                        </div>
                    </div>
                    {showButton && <div className="lable verkaufen-search" onClick={(e)=>this.onSuggestionSelected(e,{suggestion})}>PREIS BERECHNEN</div>}
                </div>
            )
    }
}

SearchBar.propTypes = {};
SearchBar.defaultProps = {};

export default withRouter(SearchBar)

const getSuggestionValue = suggestion => suggestion.modelName;
