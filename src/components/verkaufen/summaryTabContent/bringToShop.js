import React, { Component } from 'react'
import PropTypes from 'prop-types'

class BringToShop extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this._initMap = this._initMap.bind(this)
    }
    componentDidMount(){
        if(window.isGoogleConnection) {
            this._initMap(this.props.place)
        }
        this.encryptedEmail()
    }

    componentWillReceiveProps(nextProps) {
        if(window.isGoogleConnection) {
            this._initMap(nextProps.place)
        }
    }

    encryptedEmail(){
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
        if(domain === 'de'){
            document.getElementById("email-rot-13").innerHTML="<n uers=\"znvygb:vasb@erznexrg.qr\" >vasb@erznexrg.qr</n>".replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
        }
        else{
            document.getElementById("email-rot-13").innerHTML="<n uers=\"znvygb:vasb@erznexrg.pu\" >vasb@erznexrg.pu</n>".replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
        }
    }
    _initMap(place) {
        function CustomMarker(latlng, map, args) {
            this.latlng = latlng
            this.args = args
            this.setMap(map)
        }
        CustomMarker.prototype = new google.maps.OverlayView()
        CustomMarker.prototype.draw = function() {
            let div = this.div
            if (!div) {
                div = this.div = document.createElement('div')
                div.className = 'mapMarker'
                var panes = this.getPanes()
                panes.overlayImage.appendChild(div)
            }

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng)
            if (point) {
                div.style.left = point.x - 20 + 'px'
                div.style.top = point.y + 'px'
            }
        }

        let coordinate = { lat : place.latitude , long : place.longitude}

        let myLatlng = new google.maps.LatLng(coordinate.lat, coordinate.long);

        let map = new google.maps.Map(document.querySelector('.mapContainer'), {
            zoom: 17,
            center: myLatlng
        })
        let overlay = new CustomMarker(myLatlng, map, {})
    }
    chooseLocation = () => {
        $('#myModalResult').modal('hide')
        $('#modalChooseLocation').modal('show')
    }
    render() {
        const {place} = this.props;

        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            linkUrlBtnMap = domain === 'ch' ? 'https://goo.gl/maps/eiCWN7JDXav' : 'https://goo.gl/maps/kgHZhkiYVko'
        return (
            <div className="bring-to-shop" id="bringToShop">
                <div className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="title">Adresse</p>
                            <p className="address">{ domain === 'ch' ? 'remarket.ch' : 'remarket.de'} - {place.descriptionBranch}</p>
                            <p className="address">{place.address}</p>
                            <p className="address">{place.zip} {place.city}</p>
                            <a className="btn" target="_blank" href={linkUrlBtnMap}>
                                Karte anzeigen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </a>
                        </div>
                        <div className="col-md-6">
                            <p className="title">Öffnungszeiten</p>
                            <p className="time"><span>Mo:</span>{place.openingHours.mon}</p>
                            <p className="time"><span>Di:</span>{place.openingHours.tue}</p>
                            <p className="time"><span>Mi:</span>{place.openingHours.wed}</p>
                            <p className="time"><span>Do:</span>{place.openingHours.thu}</p>
                            <p className="time"><span>Fr:</span>{place.openingHours.fri}</p>
                            <p className="time"><span>Sa:</span>{place.openingHours.sat}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="title">E-Mail</p>
                            <p className="email">
                                <img src="/images/design/icon-mail.svg" alt=""/>
                                <span id="email-rot-13"/>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="title">Telefon</p>
                            <p className="email">
                                <img src="/images/design/icon-phone.svg" alt=""/>
                                <a href={place.phone}>{place.phone}</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mapContainer"/>
            </div>
        )
    }
}
BringToShop.propTypes = {}
BringToShop.defaultProps = {}
export default BringToShop
