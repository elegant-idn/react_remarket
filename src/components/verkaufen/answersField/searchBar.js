import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'

import Autosuggest from 'react-autosuggest';

class SearchBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            suggestions: []
        }

        this.debouncedLoadSuggestions = _debounce(this.loadSuggestions, 1000)
    }

    componentWillMount() {

    }
    renderSuggestion = suggestion => {
        let { value } = this.state
        if(suggestion.modelName.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            let name = suggestion.modelName.toLowerCase(),
                index = name.indexOf(value.trim().toLowerCase()),
                text = suggestion.modelName.slice(0, index)

            text += '<span class="searchText">' + suggestion.modelName.slice(index , index + value.length) + '</span>'
            text += suggestion.modelName.slice(index + value.length)

            return (
                <span dangerouslySetInnerHTML={{__html: text}}/>
            )
        }
        else return (
                <span>{suggestion.modelName}</span>
            )
    }
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    }

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

    }
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
    }
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Modell suchen',
            value,
            onChange: this.onChange
        }
        return (
            <div className="searchBar">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionSelected={this.onSuggestionSelected}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
                <div className="invalidModel">
                    <div className="wrap">
                        <p>Leider kaufen wir dieses Modell nicht an</p>
                    </div>
                </div>
            </div>
        )
    }
}

SearchBar.propTypes = {}
SearchBar.defaultProps = {}

export default SearchBar

const getSuggestionValue = suggestion => suggestion.modelName
