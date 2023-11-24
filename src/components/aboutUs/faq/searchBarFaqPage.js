import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
export { cookieApi } from '../../../api/apiCookie'

import Autosuggest from 'react-autosuggest';

export default class SearchBarFaqPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            suggestions: [],
        }

        this.debouncedLoadSuggestions = _debounce(this.loadSuggestions, 1000)
    }
    componentWillUnmount(){
        this.debouncedLoadSuggestions.cancel()
    }
    renderSuggestion = suggestion => {
        let { value } = this.state,
            suggestionName = suggestion.title

        if(suggestionName.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            let name = suggestionName.toLowerCase(),
                index = name.indexOf(value.trim().toLowerCase()),
                text = suggestionName.slice(0, index)

            text += '<span class="searchText">' + suggestionName.slice(index , index + value.length) + '</span>'
            text += suggestionName.slice(index + value.length)

            return (
                <span dangerouslySetInnerHTML={{__html: text }}/>
            )
        }
        else return (
            <span>{suggestionName}</span>
        )
    }
    onChange = (event, { newValue }) => {
        if(newValue) this.setState({ value: newValue })
        else {
            this.debouncedLoadSuggestions.cancel()
            this.setState({ value: newValue })
            this.props.setSearchParams(null)
        }
    }

    loadSuggestions(value) {
        axios.get(`/api/searchFAQItem?search=${value}`)
            .then( result => {
                this.setState({ suggestions: result.data })
            })
    }

    onSuggestionsFetchRequested = ({value}) => {
        this.debouncedLoadSuggestions(value)

    }
    onSuggestionSelected = (event, { suggestion }) => {
        this.props.setSearchParams(suggestion)
    }
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Suchbegriff eingeben...',
            value,
            onChange: this.onChange,
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
            </div>
        )
    }
}

SearchBarFaqPage.propTypes = {}
SearchBarFaqPage.defaultProps = {}


const getSuggestionValue = suggestion => suggestion.title
