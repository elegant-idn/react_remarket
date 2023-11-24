import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory} from 'react-router'

import HeaderMobile from '../header/headerMobile'
import AccessoryDetailPage from '../../detailModelPage/accessoryDetailPage/accessoryDetailPage'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as shopActions from '../../../actions/shop'

export class DetailAccessoryPageMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            titleForHead: ''
        }

        this._defineTitleHead = this._defineTitleHead.bind(this)
        this.handleBackFilter = this.handleBackFilter.bind(this)
        this._getCurrentDevices = this._getCurrentDevices.bind(this)

    }
    componentWillReceiveProps(nextProps){
        if( nextProps.devices !== this.props.devices && this.props.params.device ) {
            this._defineTitleHead(nextProps.devices)
        }

    }

    componentDidMount(){
        if( this.props.params.device && this.props.devices ) {
            this._defineTitleHead(this.props.devices)
        }
        if(this.props.devices.length <= 0) this.props.shopActions.loadDevices('/api/devices')
    }
    _getCurrentDevices(devices){
        let deviceName = this.props.params.device.replace(/-/g, ' '),
            currentDevices = null

        function findCurrentDevice(current, nextDevice){
            if(nextDevice.submodels){
                let equalDevice = nextDevice.submodels.filter( item => item.name.toLowerCase() == deviceName )
                if(equalDevice.length > 0) {
                    currentDevices = [...current, equalDevice[0].name ]
                    return true
                }
                else{
                    nextDevice.submodels.forEach( item => {
                        if(item.submodels) {
                            findCurrentDevice([...current, item.name], item)
                        }
                    })
                    return false
                }
            }
        }
        devices.forEach( item => findCurrentDevice([item.name], item))
        return currentDevices
    }
    _defineTitleHead(devices){
        let currentDevices = this._getCurrentDevices(devices)
        if(currentDevices) this.setState({ titleForHead: currentDevices[0] })
    }
    handleBackFilter(){
        let currentDevices = this._getCurrentDevices(this.props.devices)
        let strUrl = currentDevices.join('/').toLowerCase().replace(/ /g, '-') + '/filter'
        browserHistory.push(`/kaufen/${strUrl}`)
    }
    render() {
        let { titleForHead } = this.state
        return (
            <div>
                <HeaderMobile back={true}
                              handlerBack={this.handleBackFilter}
                              title={titleForHead}/>
                <AccessoryDetailPage params={this.props.params}/>
            </div>
        );
    }
}

DetailAccessoryPageMobile.propTypes = {}
DetailAccessoryPageMobile.defaultProps = {}

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

export default connect(mapStateToProps, mapDispatchToProps)(DetailAccessoryPageMobile)
