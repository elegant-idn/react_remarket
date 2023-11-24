import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory} from 'react-router'
import { cookieApi } from '../../../api/apiCookie'

import HeaderMobile from '../header/headerMobile'
import RatingPage from '../../ratingPage/ratingPage'

class RatingPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            headerTitle: "Bewertungen",
            showModalWriteRating: false,
            writeRatingToday: false
        }

        this.handleBackFilter = this.handleBackFilter.bind(this)
        this.writeRating = this.writeRating.bind(this)
        this.closeShowModalWriteRating = this.closeShowModalWriteRating.bind(this)
    }

    writeRating(){
        if(!cookieApi.getCookie('writeRating')){
            this.setState({ showModalWriteRating: true})
        }
        else {
            this.setState({ writeRatingToday: true })
            setTimeout( () => this.setState({writeRatingToday: false}), 3000)
        }

    }
    closeShowModalWriteRating(){
        this.setState({ showModalWriteRating: false})
    }

    handleBackFilter(){
        browserHistory.push('/')
    }

    render() {
        let { showModalWriteRating, writeRatingToday } = this.state
        return (
            <div>
                <HeaderMobile title={this.state.headerTitle}
                              back={true}
                              handlerBack={this.handleBackFilter}
                              handlerWrite={this.writeRating}
                              btnWriteReview={true}/>
                { writeRatingToday && <span className="errorWriteRating">Sie können nur eine Bewertung pro Tag abgeben</span>}
                <RatingPage showModalWriteRating={showModalWriteRating}
                            closeShowModalWriteRating={this.closeShowModalWriteRating}/>
            </div>
        )
    }
}

RatingPageMobile.propTypes = {}
RatingPageMobile.defaultProps = {}

export default RatingPageMobile