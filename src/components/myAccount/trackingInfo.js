import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { browserHistory } from 'react-router'

import  {connect} from 'react-redux'

export class TrackingInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            trackingData: [],
            errorMsg: ''
        }

    }
    componentWillReceiveProps( nextProps ){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            browserHistory.push('/')
        }
    }
    componentDidMount(){
        this._loadTrackingInfo()

    }
    _loadTrackingInfo = () => {
        let { type, shortcode } = this.props.params
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/basketTracking?type=${type}&shortcode=${shortcode}`)
            .then( data => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ trackingData: data.data})
            })
            .catch( error => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if(error.response.status === 404){
                    this.setState({errorMsg: 'Keine Information'})
                }
            })
    }
    mapTrackingData = (item, i) => {
        return(
            <div className="itemTracking" key={i}>
            <h1>Versandinformationen zum Auftrag {item.shortcode}</h1>
                {item.status && <p className="status">{item.status}</p>}
                <p className="title">Tracking {item.tracking}</p>
                <h3 className="eventsTitle"><span>Aktueller Standort Ihres Pakets gemäss Post</span></h3>
                <div className="wrapEvents">
                    {item.events.length === 0 && <p className="noInfo">Keine Information</p>}
                    {item.events.map((item,i) => {
                        return <p key={i} className="itemEvent">
                                    {item.date}: {item.description}{item.location.trim() && ' - '}{item.location}
                               </p>
                        }
                    )}

                </div>
            </div>
        )
    }

    render() {
        let {errorMsg, trackingData } = this.state
        return (
            <div className="container trackingInfo">
                <div className="row">
                    <div className="col-md-12">
                        {errorMsg && <p className="text-center">{errorMsg}</p>}
                        {trackingData.map(this.mapTrackingData)}
                    </div>
                </div>
            </div>
        )
    }
}

TrackingInfo.propTypes = {}
TrackingInfo.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(TrackingInfo)
