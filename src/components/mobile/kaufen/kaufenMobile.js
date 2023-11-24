import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Kaufen from '../../kaufen/kaufen'
import HeaderMobile from '../header/headerMobile'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as shopActions from '../../../actions/shop'
import Footer from '../../Footer/footer'

export class KaufenMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            titleForHead: this.props.params.deviceCategory1 || 'Kategorien',
        }

        //this.showFiltersMobile = this.showFiltersMobile.bind(this)
        this.handleBackFilter = this.handleBackFilter.bind(this)
        this._defineTitleHead = this._defineTitleHead.bind(this)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.params !== this.props.params){
            this._defineTitleHead(nextProps.params.deviceCategory1 || 'Kategorien')
        }
    }

    componentDidMount(){
        if( this.props.params.deviceCategory1 && this.props.deviceCategory1 ) {
            this._defineTitleHead()
        }
    }
    _defineTitleHead(titleForHead){
        this.setState({ titleForHead })
    }
    /*showFiltersMobile(){
        $('.modelInnerPage-inner .contentPart').css({ display: 'none' })
        $('.modelInnerPage #devicesListSmall').css({ display: 'none' })
        $('.modelInnerPage-inner .asideFilter').css({ display: 'block' })
        this.setState({ titleForHead: 'Filter'})

        let height = $('.mobileFixedBtn').outerHeight() + 30
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:' + height + 'px !important')
        height -= 30;
        $('#tidio-chat #tidio-chat-iframe').css({bottom: height, right: '10px'});
}*/
    handleBackFilter(){
        $('.modelInnerPage-inner .contentPart').css({ display: 'block' })
        $('.modelInnerPage #devicesListSmall').css({ display: 'block' })
        $('.modelInnerPage-inner .asideFilter').css({ display: 'none' })
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        this._defineTitleHead(this.props.params.deviceCategory1 || 'Categories')
    }

    render() {
        let { titleForHead } = this.state
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                //showFiltersMobile: this.showFiltersMobile,
                defineTitleHeadMobile: this._defineTitleHead,
                handleBackFilter: this.handleBackFilter
            })
        )
        return (
            <div className="buyPage">
                <HeaderMobile menu={titleForHead !== "Filters"}
                              back={titleForHead === 'Filters'}
                              handlerBack={this.handleBackFilter}
                              title={titleForHead}/>
                {childrenWithProps}
                <Footer />
            </div>
        );
    }
}

KaufenMobile.propTypes = {}
KaufenMobile.defaultProps = {}

function mapStateToProps (state) {
    return {
        devices: state.shop.devices,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        shopActions: bindActionCreators(shopActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KaufenMobile)
