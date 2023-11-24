import React, {Component} from 'react'
import PropTypes from 'prop-types'

import HeaderMobile from '../header/headerMobile'
import NewCounterOffer from '../../verkaufen/newCounterOffer/newCounterOffer'


class NewCounterOfferMobileBeta extends Component {
    constructor(props) {
        super(props)

        this.state = {
            headerTitle: "Gegenofferte"
        }

        this.handleBackBtn = this.handleBackBtn.bind(this)

    }
    componentWillUnmount(){
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        $('body .fixedVerkaufenNewOffer').remove()
    }

    componentDidMount(){
        if($('#intercom-container').length > 0){
            $('#intercom-container .intercom-launcher-frame').removeAttr('style')
            $('#intercom-container').before('<div class="fixedVerkaufenNewOffer"></div>')
        }
        if($('#tidio-chat').length > 0){
            $('#tidio-chat').before('<div class="fixedVerkaufenNewOffer"></div>')
        }
        else $('body').append('<div class="fixedVerkaufenNewOffer"></div>')
    }

    handleBackBtn(){

    }

    render() {
        return (
            <div className="mobileNewCounterOfferWrap">
                <HeaderMobile title={this.state.headerTitle}
                              back={this.state.headerTitle !== 'Gegenofferte'}
                              handlerBack={this.handleBackBtn}
                              menu={this.state.headerTitle === 'Gegenofferte'}/>
                <NewCounterOffer params={this.props.params}/>
            </div>
        )
    }
}

NewCounterOfferMobileBeta.propTypes = {}
NewCounterOfferMobileBeta.defaultProps = {}

export default NewCounterOfferMobileBeta