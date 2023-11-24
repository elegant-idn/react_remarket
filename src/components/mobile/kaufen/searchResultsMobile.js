import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory} from 'react-router'

import HeaderMobile from '../header/headerMobile'
import SearchResulsKaufen from '../../kaufen/searchResults/searchResultsKaufen'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as shopActions from '../../../actions/shop'

export class SearchResultsMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.handleBackFilter = this.handleBackFilter.bind(this)

    }

    handleBackFilter(){
        browserHistory.push('/kaufen')
    }
    render() {
        let titleForHead = `<p class="search">${this.props.searchResults.total} Suchresultate für <span>${this.props.searchResults.searchValue}</span></p>`
        return (
            <div>
                <HeaderMobile back={true}
                              backColorGreen={true}
                              handlerBack={this.handleBackFilter}
                              title={titleForHead}/>
                <SearchResulsKaufen params={this.props.params}/>
            </div>
        )
    }
}

SearchResultsMobile.propTypes = {}
SearchResultsMobile.defaultProps = {}

function mapStateToProps (state) {
    return {
        searchResults: state.shop.searchResults
    }
}
function mapDispatchToProps(dispatch) {
    return {
        shopActions: bindActionCreators(shopActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsMobile)
