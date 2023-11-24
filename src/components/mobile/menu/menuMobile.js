import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import * as placesActions from "../../../actions/places";
import * as shopActions from '../../../actions/shop';
import * as userActions from '../../../actions/user';
import MobileDetect from 'mobile-detect'

import '../../../i18n'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'

export class MenuMobile extends Component {
  constructor(props) {
    let lang = window.localStorage.getItem('lang')
    if (typeof(lang) == 'undefined' || !lang || lang == '')
        lang = 'de'
    super(props)
    this.state = {
      isToggle: false,
      lang: lang,
    }
    this.mapSubmodels = this.mapSubmodels.bind(this)
    this.logOut = this.logOut.bind(this)
    this.initFb = this.initFb.bind(this)
    this.initGoogle = this.initGoogle.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
  }
  componentDidMount() {
    if (window.isFBConnection) {
      this.initFb()
    }
    if (window.isGoogleConnection) {
      this.initGoogle()
    }
    this.props.shopActions.loadDevices('/api/devices')
  }

  hideMenu() {
    $('.menuMobile').css({ top: 0, transform: 'translateY(-100%)' })
    $('.hamburger').toggleClass('open')
  }
  toggleDropdown() {
    const isToggle = this.state.isToggle
    this.setState({isToggle: !isToggle})
  }
  showLangMenu() {
    if (this.props.showLangMenu) {
      this.props.showLangMenu()
    }
  }
  mapSubmodels(device, i) {
    let deviceCategories = [device.name.replace(/ /g, '-').toLowerCase()]

    if (device.submodels) mapSubmodels(device.submodels)
    let strUrl = deviceCategories.join('/') + '/filter'

    function mapSubmodels(submodels) {
      deviceCategories.push(submodels[0].name.replace(/ /g, '-').toLowerCase())
      if (submodels[0].submodels) mapSubmodels(submodels[0].submodels)
    }
  }
  initFb() {
    window.fbAsyncInit = function () {
      FB.init({
        appId: window.oauthIds.facebookId,
        xfbml: true,
        version: 'v2.9'
      });
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
  initGoogle() {
    window.gapiAuth2 = null
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: window.oauthIds.googleId
        })
          .then((data) => {
            window.gapiAuth2 = data
          })
      });
    }
  }
  logOut() {
    if (FB.getAccessToken() != null) {
      FB.logout(function (response) {
        FB.Auth.setAuthResponse(null, 'unknown');
      });
    }
    if (window.gapiAuth2)
      window.gapiAuth2.disconnect()
    window.localStorage.removeItem("token")
    this.props.userActions.logOut()
  }

  // handleChangePlace = (selectedOption) => {
  //   this.setState({ selectedOption });
  //   const { data } = JSON.parse(window.localStorage.getItem("locationData"))
  //   data.forEach((item) => {
  //     if (item.id === selectedOption.id) {
  //       item.active = true
  //     }
  //     else {
  //       item.active = false
  //     }
  //   })
  //   const { setLocation } = this.props.placesActions
  //   setLocation(selectedOption);
  //   window.localStorage.setItem("locationData", JSON.stringify({ data }))
  //   this.hideMenu();
  // }

  render() {
    let { selectedOption, lang, isToggle } = this.state,
      domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1];
    const data = JSON.parse(window.localStorage.getItem("locationData"))
    let md = new MobileDetect(window.navigator.userAgent)
    const active = {};
    if (data) {
      active.place = data.data.find(item => item.active === true)
      if (active.place == null) {
        active.place = data.data[0];
      }
    }
    return (
      <div className="menuMobile">
        <nav className={md.mobile() === 'iPhone' && md.userAgent() === 'Safari' && isToggle ? 'is-toggle' : null}>
          <ul>
            {this.props.user.isLogin &&
              <li style={{fontWeigh: '500', fontSize: '14px', color: '#161616', display: 'flex', paddingBottom: '30px'}}>
                <img src='/images/mobile_menu/user.svg'></img>
                <Link to="/kundenkonto"  activeClassName="active" onClick={this.hideMenu} style={{paddingBottom: '0px'}}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span className='username'>Kundenkonto: {this.props.user.data && this.props.user.data.systemAddress.first_name + ' ' + this.props.user.data.systemAddress.last_name}</span>
                    <span className='email' style={{fontSize: '12px', color: '#707070'}}>{this.props.user.data && this.props.user.data.systemAddress.email}</span>
                  </div>
                </Link>
              </li>
            }
            {!this.props.user.isLogin &&
              <li>
                <img src='/images/mobile_menu/user.svg'></img>
                <a href="#" onClick={() => {
                  this.hideMenu();
                  $('.login-box-wrapper').css({ display: 'block' });
                  $('#op').trigger('click');
                  return false;
                }}>
                  Login/Registrieren
                </a>
              </li>

            }
            <li>
              <img src='/images/mobile_menu/wunschliste.svg'></img>
              <Link to="/wunschliste"  activeClassName="active" onClick={this.hideMenu}>Wunschliste</Link>
            </li>
            {/* {this.props.user.isLogin && <div className="login" onClick={this.logOut}>
              <span>Logout</span>
            </div>
            } */}
            <li>
              <img src='/images/mobile_menu/Verkaufen.svg'></img>
              <Link to="/verkaufen" activeClassName="active" onClick={this.hideMenu}>{this.props.t('headerTop.sell')}</Link>
            </li>
            <li>
              <img src='/images/mobile_menu/Reparieren.svg'></img>
              <a href="https://www.ireparatur.ch/" rel="noopener" target="_blank" onClick={this.hideMenu}>{this.props.t('headerTop.repair')}</a>
            </li>
            <li>
              <img src='/images/mobile_menu/Kaufen.svg'></img>
              <Link to="/kaufen" activeClassName="active" onClick={this.hideMenu}>{this.props.t('headerTop.buy')}</Link>
              <ul className="submenu">
                {this.props.devices.map(this.mapSubmodels)}
              </ul>
            </li>
            <li>
              <img src='/images/mobile_menu/Kontakt.svg'></img>
              <Link to="/kontakt" activeClassName="active" onClick={this.hideMenu}>{this.props.t('headerTop.contact')}</Link>
            </li>
            <li onClick={() => this.toggleDropdown()}>
              <img src='/images/location.png'></img>
              <a style={{textDecoration: 'none'}}>Unsere Standorte</a>
              {this.state.isToggle &&<img style={{float: 'right', marginRight: '18px'}} src='/images/caret-up.png'></img>}
              {!this.state.isToggle &&<img style={{float: 'right', marginRight: '18px'}} src='/images/caret-down.png'></img>}
              {data && this.state.isToggle &&
                data.data.map(item =>
                  <div key={`img-item-${item.id}`} className={`img-item item-${item.id}`} style={{display: 'flex', marginBottom: '10px'}}>
                    {console.log('item', item)}
                    <img alt='alt' width={10} height={13} src={`/images/${item.id}.png`} style={{marginTop:'5px'}} />
                    <div style={{width: '300px'}}>
                      <span style={{fontWeight: '700', color: '#0F0F0F', fontSize: '16px', display: 'block'}}>{item.descriptionBranch}</span>
                      <span style={{fontSize: '13px', color:'#949494', marginBottom: '12px', display: 'block'}}>{item.address},&nbsp;{item.zip}&nbsp;{item.city}</span>
                      <p style={{fontSize: '13px', display: 'flex', padding: 0}}><div className='col-sm-3' style={{paddingLeft: 0, width: '20px'}}><span style={{color: '#8B8B8B'}}>Mo:</span></div><div className='col-md-9'><span style={{color: '#0F0F0F'}}>{item.openingHours.mon}</span></div></p>
                      <p style={{fontSize: '13px', display: 'flex', padding: 0}}><div className='col-sm-3' style={{paddingLeft: 0, width: '20px'}}><span style={{color: '#8B8B8B'}}>Di:</span></div><div className='col-md-9'><span style={{color: '#0F0F0F'}}>{item.openingHours.tue}</span></div></p>
                      <p style={{fontSize: '13px', display: 'flex', padding: 0}}><div className='col-sm-3' style={{paddingLeft: 0, width: '20px'}}><span style={{color: '#8B8B8B'}}>Mi:</span></div><div className='col-md-9'><span style={{color: '#0F0F0F'}}>{item.openingHours.wed}</span></div></p>
                      <p style={{fontSize: '13px', display: 'flex', padding: 0}}><div className='col-sm-3' style={{paddingLeft: 0, width: '20px'}}><span style={{color: '#8B8B8B'}}>Do:</span></div><div className='col-md-9'><span style={{color: '#0F0F0F'}}>{item.openingHours.thu}</span></div></p>
                      <p style={{fontSize: '13px', display: 'flex', padding: 0}}><div className='col-sm-3' style={{paddingLeft: 0, width: '20px'}}><span style={{color: '#8B8B8B'}}>Fr:</span></div><div className='col-md-9'><span style={{color: '#0F0F0F'}}>{item.openingHours.fri}</span></div></p>
                      <p style={{fontSize: '13px', display: 'flex', padding: 0}}><div className='col-sm-3' style={{paddingLeft: 0, width: '20px'}}><span style={{color: '#8B8B8B'}}>Sa:</span></div><div className='col-md-9'><span style={{color: '#0F0F0F'}}>{item.openingHours.sat}</span></div></p>
                    </div>
                </div>)
              }
            </li>
            <li onClick={() => this.showLangMenu()}>
              <img src={`/images/design/lang/${lang}.svg`}></img>
              <a style={{textDecoration: 'none'}}>{lang.toUpperCase()}</a>
              <img style={{float: 'right', marginRight: '18px'}} src='/images/caret-down.png'></img>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

MenuMobile.propTypes = {}
MenuMobile.defaultProps = {}

function mapStateToProps(state) {
  return {
    user: state.user,
    devices: state.shop.devices,
    places: state.places.currentLocation
  }
}
function mapDispatchToProps(dispatch) {
  return {
    shopActions: bindActionCreators(shopActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    placesActions: bindActionCreators(placesActions, dispatch)
  }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(MenuMobile))