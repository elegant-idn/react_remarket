import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link, withRouter } from 'react-router';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import * as placesActions from '../../actions/places';
import * as shopActions from "../../actions/shop";
import * as userActions from '../../actions/user';
import { headerController, LoginModalController, discountCode } from '../../helpers/helpersFunction';
import HeaderBottomFaqPage from '../aboutUs/faq/headerBottomFaqPage';
import HeaderBottomJobsPage from '../aboutUs/jobs/headerBottomJobsPage';
import CouponFromAds from '../mainPage/couponFromAds';
import HeaderBottomMainPage from './headerBottomMainPage';
import LoginForm from './loginForm/loginForm';
import LoginFormForgotPassword from './loginForm/loginFormForgotPassword';
import MenuMobile from '../mobile/menu/menuMobile';
import SearchBarKaufenV2 from '../kaufen/searchResults/searchBarKaufenV2';
import SearchBarKaufenV3 from '../kaufen/searchResults/searchBarKaufenV3';
import HeaderMobile from '../mobile/header/headerMobile';

import '../../i18n'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'

export class HeaderTop extends Component {
  constructor(props) {
    let lang = window.localStorage.getItem('lang')
    if (typeof(lang) == 'undefined' || !lang || lang == '')
        lang = 'de'
    super(props);
    this.state = {
      errorRegistration: {
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        code: '',
      },
      errorLogin: {
        infoMsg: '',
        login: '',
        password: '',
        resendActivationLink: '',
        successResend: '',
      },
      showInputCode: false,
      spinner: null,
      selectedOption: null,
      showCouponFromAds: false,
      lang: {
        title: lang.toUpperCase(),
        value: lang,
        image: '/images/design/lang/'+lang+'.svg'
      },
      langOptions:[
        {
          title: 'DE',
          value: 'de',
          image: '/images/design/lang/de.svg'
        },
        {
          title: 'FR',
          value: 'fr',
          image: '/images/design/lang/fr.svg'
        },
        {
          title: 'IT',
          value: 'it',
          image: '/images/design/lang/it.svg'
        },
        {
          title: 'EN',
          value: 'en',
          image: '/images/design/lang/en.svg'
        },
      ]
    };

    this.loginFacebook = this.loginFacebook.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
    this.initFb = this.initFb.bind(this);
    this.initGoogle = this.initGoogle.bind(this);

    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.handleChangeRegistration = this.handleChangeRegistration.bind(this);
    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.resendActivationEmail = this.resendActivationEmail.bind(this);
    this.closeLoginForm = this.closeLoginForm.bind(this);
    this.logOut = this.logOut.bind(this);
    this.mapSubcategories = this.mapSubcategories.bind(this);
    this.mapAccessories = this.mapAccessories.bind(this)
    this.toggleCouponFromAds = this.toggleCouponFromAds.bind(this)
    this.handleChangeLang = this.handleChangeLang.bind(this)
    this.langOptionRenderer = this.langOptionRenderer.bind(this)
    this.langValueSelected = this.langValueSelected.bind(this)
  }

  showMenu(e) {
    let headerHeight = $('.header-mobile.scrolling-header').innerHeight()
    if ($(e.currentTarget).hasClass('open')) {

      $('.menuMobile').css({ top: 0, transform: 'translateY(-100%)' });
      $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display', 'block');
      $('#mobile > .mainPage > .mainPage').css('display', 'block');
      $('#mobile footer').css('display', 'block');
    }
    else {
      $('.menuMobile').css({
        top: headerHeight + 'px',
        maxHeight: `calc( 100vh - ${headerHeight}px`,
        transform: 'translateY(0)'
      });

      setTimeout(function () {
        $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display', 'none');
        $('#mobile > .mainPage > .mainPage').css('display', 'none');
        $('#mobile footer').css('display', 'none')
      }
        , 1000)
    }
    $(e.currentTarget).toggleClass('open')
  }

  componentDidMount() {
    const { user } = this.props;
    if (window.isFBConnection) {
      this.initFb();
    }
    if (window.isGoogleConnection) {
      this.initGoogle();
    }

    this.checkAdsSource();

    LoginModalController.initialize();
    headerController.initialize();
    if (user.redirectTo) {
      document.getElementById('op').checked = true;
    }
    // headerScrollFixed();
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    if (nextProps.user.redirectTo !== user.redirectTo && !user.redirectTo) {
      document.getElementById('op').checked = true;
    }

    if (nextProps.user.isLogin !== user.isLogin && nextProps.user.isLogin === false) {
      this.setState({
        formData: {
          firstName: '', lastName: '', email: '', phone: '', colorValue: '',
        },
      });
    }
  }

  globalClick = e => {
    if (e.target.tagName.toLowerCase() === 'a') {
      this.props.shopActions.definedCounerForSearchInput(' ')
    }
  }

  handleChangePlace = (selectedOption) => {
    this.setState({ selectedOption });
    const { data } = JSON.parse(window.localStorage.getItem('locationData'));
    data.forEach((item) => {
      item.active = item.id === selectedOption.id;
    });
    const { placesActions: { setLocation } } = this.props;
    setLocation(selectedOption);
    window.localStorage.setItem('locationData', JSON.stringify({ data }));
  }

  /* global FB gapi gapiAuth2 */

  checkAdsSource() {
    let search_params = new URL(document.URL).searchParams;

    if (search_params.has('coupon') && !window.localStorage.hasOwnProperty("coupon")) {
      let coupon = search_params.get('coupon')

      axios.get(`/api/checkAdsCoupon?coupon=${coupon}`)
        .then((data) => {
          if (data.data.status == "ok") {
            this.toggleCouponFromAds();
            document.getElementById('coupon_text').innerHTML = coupon;
            window.localStorage.setItem('coupon', coupon);
          }
        })
        .catch(error => { })
    }
  }
  toggleCouponFromAds() {
    this.setState({ showCouponFromAds: !this.state.showCouponFromAds })
  }

  loginFacebook(e) {
    e.preventDefault();
    const { errorLogin, errorRegistration } = this.state;
    document.getElementById('op').checked = false;
    this.setState({
      errorLogin: { ...errorLogin, socialNoEmail: '' },
      errorRegistration: { ...errorRegistration, socialNoEmail: '' },
    });
    FB.login((response) => {
      const token = response.authResponse.accessToken;
      const body = {
        token,
        provider: 'facebook',
      };
      document.getElementById('spinner-box-load').style.display = 'block';
      axios.post('/api/socialAuth', body)
        .then((result) => {
          window.localStorage.setItem('token', result.data.token);
          window.axios.defaults.headers.common['Authorization-Token'] = result.data.token;
          this.loadPersonalData(result.data.token);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            document.getElementById('spinner-box-load').style.display = 'none';
            document.getElementById('op').checked = true;
            this.setState({
              errorLogin: { ...errorLogin, socialNoEmail: error.response.data },
              errorRegistration: { ...errorRegistration, socialNoEmail: error.response.data },
            });
          }
        });
    }, { scope: 'email' });
  }

  initFb() {
    window.fbAsyncInit = function () {
      FB.init({
        appId: window.oauthIds.facebookId,
        xfbml: true,
        version: 'v2.9',
      });
    };
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  initGoogle() {
    window.gapiAuth2 = null
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: window.oauthIds.googleId,
        })
          .then((data) => {
            window.gapiAuth2 = data;
          });
      });
    }
  }

  loginGoogle(e) {
    e.preventDefault();
    const { errorLogin, errorRegistration } = this.state;
    this.setState({
      errorLogin: { ...errorLogin, socialNoEmail: '' },
      errorRegistration: { ...errorRegistration, socialNoEmail: '' },
    });
    document.getElementById('op').checked = false;
    window.gapiAuth2.signIn()
      .then((data) => {
        const token = data.Zi.access_token;
        const body = {
          token,
          provider: 'google',
        };
        document.getElementById('spinner-box-load').style.display = 'block';
        axios.post('/api/socialAuth', body)
          .then((result) => {
            window.localStorage.setItem('token', result.data.token);
            window.axios.defaults.headers.common['Authorization-Token'] = result.data.token;
            this.loadPersonalData(result.data.token);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              document.getElementById('spinner-box-load').style.display = 'none';
              document.getElementById('op').checked = true;
              this.setState({
                errorLogin: { ...errorLogin, socialNoEmail: error.response.data },
                errorRegistration: { ...errorRegistration, socialNoEmail: error.response.data },
              });
            }
          });
      });
  }

  closeLoginForm() {
    const { userActions: { setRedirectTo, cancelRedirectToMyAccount } } = this.props;
    [...document.querySelectorAll('.simform input:not([type=submit])')].forEach((item) => { item.value = ''; });
    this.setState({
      errorRegistration: {
        email: '', phone: '', password: '', password_confirmation: '', socialNoEmail: '',
      },
      errorLogin: {
        infoMsg: '', login: '', password: '', socialNoEmail: '', resendActivationLink: '', successResend: '',
      },
      showInputCode: false,
      spinner: null,
    });
    setRedirectTo(false);
    cancelRedirectToMyAccount(false);
    $('.login-box-wrapper').css({ display: 'none' });
  }

  handleChangeRegistration(e) {
    const { name, value } = e.target,
      { errorRegistration } = this.state;
    if (name === 'password' || name === 'password_confirmation') {
      const regular = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
      const isValid = regular.test(value.trim());
      const isSame = name !== "password_confirmation" || $("#customer-pw").val() === $("#customer-pw-repeat").val();
      if (isValid && isSame) {
        $(e.target).parents('.input').find('.statusBarPassword').css({ background: '#00cb94' });
      } else {
        $(e.target).parents('.input').find('.statusBarPassword').css({ background: '#ff0000' });
      }
    }
    errorRegistration[name] = null;
    this.setState({ errorRegistration });
  }

  handleChangeLogin(e) {
    const { name } = e.target,
      { errorLogin } = this.state;
    errorLogin.infoMsg = '';
    errorLogin[name] = null;
    if (name === 'login') {
      errorLogin.successResend = null;
      errorLogin.resendActivationLink = null;
    }
    this.setState({ errorLogin });
  }

  registerUser(e) {
    e.preventDefault();
    const { showInputCode, errorRegistration } = this.state;
    if (!showInputCode) {
      const url = '/api/register';
      const data = new FormData(document.forms.registrationForm);
      document.getElementById('spinner-box-load').style.display = 'block';
      axios.post(url, data)
        .then((result) => {
          document.getElementById('spinner-box-load').style.display = 'none';
          if (result.data.status === 'false') {
            if (result.data.errorType === 'phone') {
              const phone = result.data.message;
              this.setState({
                errorRegistration: {
                  ...errorRegistration, email: '', phone, password: '', password_confirmation: '', code: '',
                },
                spinner: null,
              });
            }
            if (result.data.errorType === 'email') {
              const email = result.data.message;
              this.setState({
                errorRegistration: {
                  ...errorRegistration, email, phone: '', password: '', password_confirmation: '', code: '',
                },
                spinner: null,
              });
            }
          } else if (result.data.smsWasSent) {
            this.setState({ showInputCode: true, spinner: null });
          } else {
            document.getElementById('op').checked = false;
            this.closeLoginForm();
            browserHistory.push('/confirm-email');
          }
        })
        .catch((error) => {
          document.getElementById('spinner-box-load').style.display = 'none';
          const { response: { data: { errors } } } = error;
          let email,
            phone,
            password,
            passwordConfirmation;
          if (errors) {
            errors.email ? (phone = errors.email[0]) : '';
            errors.phone ? phone = errors.phone[0] : '';
            errors.password ? password = passwordConfirmation = errors.password[0] : '';
          }
          this.setState({
            errorRegistration: {
              ...errorRegistration, email, phone, password, passwordConfirmation,
            },
            spinner: null,
          });
        });
    } else {
      const url = '/api/confirm/phone';
      const data = new FormData(document.forms.registrationForm);
      document.getElementById('spinner-box-load').style.display = 'block';
      axios.post(url, data)
        .then((response) => {
          window.localStorage.setItem('token', response.data.token);
          window.axios.defaults.headers.common['Authorization-Token'] = response.data.token;
          this.loadPersonalData(response.data.token);
        })
        .catch((error) => {
          document.getElementById('spinner-box-load').style.display = 'none';
          if (error.response.status === 404) {
            const err = error.response.data;
            let code;
            if (err) {
              code = err;
            }
            this.setState({ errorRegistration: { ...errorRegistration, code }, spinner: null });
          } else {
            const err = error.response.data.message;
            let code;
            if (err) {
              code = err;
            }
            this.setState({ errorRegistration: { ...errorRegistration, code }, spinner: null });
          }
        });
    }
  }

  loginUser(e) {
    e.preventDefault();
    const { errorLogin } = this.state;
    const url = '/api/login';
    const data = new FormData(document.forms.loginForm);
    document.getElementById('spinner-box-load').style.display = 'block';
    axios.post(url, data)
      .then((result) => {
        if (result.data.status === 'false') {
          document.getElementById('spinner-box-load').style.display = 'none';
          errorLogin[result.data.field] = result.data.message;
          if (result.data.resendActivationLink) {
            errorLogin.resendActivationLink = result.data.resendActivationLink;
          }
          this.setState({ errorLogin });
        } else {
          window.localStorage.setItem('token', result.data.token);
          window.axios.defaults.headers.common['Authorization-Token'] = result.data.token;
          this.loadPersonalData(result.data.token);
        }
      })
      .catch((error) => {
        document.getElementById('spinner-box-load').style.display = 'none';
        const err = error.response.data.errors;
        let login,
          password;
        if (err) {
          err.login ? login = err.login[0] : '';
          err.password ? password = err.password[0] : '';
        }
        this.setState({ errorLogin: { ...errorLogin, login, password }, spinner: null });
      });
  }

  logOut() {
    if (window.gapiAuth2)
      window.gapiAuth2.disconnect();
    window.localStorage.removeItem('token');
    delete window.axios.defaults.headers.common['Authorization-Token'];
    const { userActions: { logOut } } = this.props;
    logOut();
  }

  mapSubcategories(device) {
    if (device.name === 'Zubehör') return '';
    const { params } = this.props,
      currentDeviceName = params.deviceCategory1 && params.deviceCategory1.replace(/-/g, ' '),
      deviceCategories = [device.name.replace(/ /g, '-').toLowerCase()],
      computerIds = [8, 15, 23, 24];
    let className = '';
    function mapSubmodels(submodels) {
      deviceCategories.push(submodels[0].name.replace(/ /g, '-').toLowerCase());
      if (submodels[0].submodels) mapSubmodels(submodels[0].submodels);
    }
    if (device.submodels && computerIds.every(item => item !== device.id)) {
      mapSubmodels(device.submodels);
    }
    const strUrl = `${deviceCategories.join('/')}/filter`;

    device.name.toLowerCase() === currentDeviceName
      ? className = 'current item-sub-menu'
      : className = 'item-sub-menu';

    return (
      <Link
        to={`/kaufen/${strUrl}`}
        className={className}
        key={device.id}
      >
        <span className="image"><img src={`/images/design/${device.id}device.svg`} alt="" /></span>
        <span className="image"><img src={`/images/design/${device.id}activeDevice.svg`} alt="" /></span>
        <span className="name">{device.name}</span>
      </Link>
    );
  }

  mapAccessories(item, i) {
    let { params } = this.props,
      index = 2,
      className = '',
      strPrevUrl = '';
    /*get prev url*/
    for (let key in params) {
      let paramKeyIndex = key.slice(14)
      if (key.includes('deviceCategory') && params[key] && +paramKeyIndex < index) strPrevUrl += params[key] + '/'
    }
    /*add current name*/
    strPrevUrl += item.name.toLowerCase().replace(/ /g, '-') + '/'
    /*add submodels url*/
    function mapSubmodels(submodels) {
      strPrevUrl += submodels[0].name.replace(/ /g, '-').toLowerCase() + '/'
      if (submodels[0].submodels) mapSubmodels(submodels[0].submodels)
    }
    if (item.submodels) mapSubmodels(item.submodels)

    if (params['deviceCategory' + index]
      && params['deviceCategory' + index].replace(/-/g, ' ') === item.name.toLowerCase()) className = 'current item-sub-menu'
    else
      className = 'item-sub-menu'
    return <Link to={`/kaufen/zubehör/${strPrevUrl}filter`}
      className={className}
      key={item.id}>
      {item.images && <span className="image"><img src={item.images[0]} className="deviceIcon" alt="" /></span>}
      {item.images && <span className="image"><img src={item.images[0]} className="deviceIcon" alt="" /></span>}
      <span className="name">{item.name}</span>
    </Link>
  }


  loadPersonalData(token) {
    if (token) {
      axios.get('/api/customerAgileData')
        .then((data) => {
          document.getElementById('spinner-box-load').style.display = 'none';
          document.getElementById('op').checked = false;
          if (data.status === 200) {
            const {
              userActions: { loginSuccess },
              user: { redirectUrl, cancelRedirectToMyAccount },
            } = this.props;
            this.closeLoginForm();
            loginSuccess(data.data);
            if (redirectUrl) {
              browserHistory.push(redirectUrl);
            } else if (!cancelRedirectToMyAccount) browserHistory.push('/kundenkonto');
          }
        })
        .catch((error) => {
        });
    }
  }

  resendActivationEmail() {
    const email = $('#customer-email-login').val(),
      { errorLogin } = this.state;
    document.getElementById('spinner-box-load').style.display = 'block';
    axios.get(`/api/resendActivationLink?login=${email}`)
      .then((result) => {
        document.getElementById('spinner-box-load').style.display = 'none';
        this.setState({
          errorLogin: {
            ...errorLogin,
            successResend: result.data,
            login: '',
            resendActivationLink: '',
          },
        });
      })
      .catch((error) => {
        document.getElementById('spinner-box-load').style.display = 'none';
        this.setState({
          errorLogin: {
            ...errorLogin,
            resendActivationLink: '',
            login: error.response.data.errors.login[0],
          },
        });
      });
  }

  optionRenderer = item => (
    <div className={`img-item item-${item.id}`}>
      <img alt="" src={`/images/${item.id}.png`} marginBottom={10} />
      <div>
        <strong className='hover-green'>
          {item.descriptionBranch}
        </strong>
        <br />
        {item.address}
        ,
        {item.zip}
        {' '}
        {item.city}
      </div>
    </div>
  )

  valueSelected = item => (
    <div className="valueSelected">
      <span><img src={`/images/location.svg`} width={14} height={18} alt="Standort" style={{ marginRight: '5px' }} /></span>
      <span><img src={`/images/store-${item.id}-black.svg`} width={18} height={18} alt="" /></span>
      <div>
        <span style={{borderBottom: '1px dashed #9D9D9D', fontWeight: '400'}}>
          {item.descriptionBranch}
        </span>
        <span />
      </div>
    </div>
  )

  handleChangeLang = (selectedOption) => {
    // let urlPathName = window.location.pathname
    this.setState({ lang: selectedOption });
    window.localStorage.setItem('lang', selectedOption.value);
    i18n.changeLanguage(selectedOption.value);
    // browserHistory.push(urlPathName);
  }

  langOptionRenderer = (item) => {
    return (
      <div className={`img-item item-${item.value}`}>
        <span><img src={item.image}/></span>
        <div style={{marginLeft: '0px'}}>
          <span style={{fontWeight: '400'}}>
            {item.title}
          </span>
        </div>
      </div>
    )
  } 

  langValueSelected = (item) => {
    return (
      <div className="valueSelected">
        <span><img src={item.image}/></span>
        <div style={{marginLeft: '8px'}}>
          <span style={{fontWeight: '400'}}>
            {item.title}
          </span>
        </div>
        <div id="lang-menu-arrow" />
      </div>
    )
  }

  render() {
    const { spinner, errorRegistration, errorLogin, showInputCode, selectedOption, lang, langOptions } = this.state,
      { pageNotFound, user, basket, msgInfo, shop: { devices }, location: { pathname } } = this.props,
      zubenhor = devices.find(item => (item.name === "Zubehör")),
      domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
      urlPathName = window.location.pathname,
      data = JSON.parse(window.localStorage.getItem('locationData')),
      webshopDiscountData = JSON.parse(window.localStorage.getItem('webshopDiscountData')),
      active = {};
    if (data) {
      active.place = data.data.find(item => item.active === true);
      if (active.place == null) {
        active.place = data.data[0];
      }
    }



    let headerClassName;
    let logoSrc = domain === 'ch' ? '/images/design/logo_all_pages.svg' : '/images/design/logo_de.svg';
    let logoSrcAllPages = domain === 'ch' ? '/images/design/logo_all_pages.svg' : '/images/design/logo_all_pages_de.svg';
    let backBtnUrl = this.props.backColorGreen ? "/images/design/mobile/back-btn-green.svg" : "/images/design/mobile/back-btn.svg"

    if (urlPathName === '/') {
      headerClassName = 'headerMainPage';

    } else if (urlPathName === '/jobs') {
      headerClassName = 'headerMainPage jobs';

    } else if (urlPathName === '/ueber-uns/qualitaet') {
      headerClassName = 'headerMainPage jobs qualitaet_header';
    } else if (urlPathName === '/versichern') {
      logoSrc = '/images/logo/remarket-care.jpg';
      logoSrcAllPages = '/images/logo/remarket-care.jpg';
      headerClassName = 'headerMainPage'
    } else {
      headerClassName = 'headerMainPage ';
    }

    headerClassName = webshopDiscountData.desktop_topbar_active == 1 ? headerClassName + ' desktop-topbar-activate' : headerClassName;

    const customStyles = {
    };
    return (      
      <div>
      <nav id="top_1" className={webshopDiscountData.desktop_topbar_active == 1 ? "top-header navbar navbar-default navbar-fixed-top visible-md-block visible-lg-block desktop-topbar-activate" : "top-header navbar navbar-default navbar-fixed-top visible-md-block visible-lg-block"}>
          {webshopDiscountData.desktop_topbar_active == 1 && 
            <div style={{ position: "relative" }} className="notification-top-bar">
              <p dangerouslySetInnerHTML={{__html: discountCode(webshopDiscountData.desktop_topbar_text, 'discount-code') }}></p>
            </div>
          }          
          <div className="container-fluid header-desktop-style d-flex" style={{display: 'flex', justifyContent: 'end'}}>
            <div className='col-xs-none col-md-5'></div>
            <div className='col-xs-none col-md-7'>
              <div className="top-header scrolling-header">
                <div className="row">
                  <div className='headerMainPage-container' style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                    <div className="select-input-place d-xs-none d-sm-none d-md-none d-lg-block">
                      {data &&
                        <label>
                          <Select
                            value={selectedOption || active.place}
                            onChange={this.handleChangePlace}
                            options={data.data}
                            classNamePrefix="Select-input-place"
                            optionRenderer={this.optionRenderer}
                            valueRenderer={this.valueSelected}
                            styles={customStyles}
                            isSearchable={false}
                          />
                        </label>
                      }
                    </div>
                    <div className="place-open d-sm-none d-md-none d-lg-block" style={{background: 'transparent', color: 'black'}}>
                      <span>
                      <img src="/images/time-clock.svg" width={16} height={16} alt="Öffnungszeiten" />
                        </span>
                      <span className="place-open-menu" style={{color: 'black', background: 'transparent', cursor: 'pointer', borderBottom: '1px dashed #9D9D9D'}}>
                        {this.props.t('headerTop.openinghours')}
                      </span>
                      {active.place
                        ? (
                          <ul>
                            <span className="place-open-title">
                              {active.place.address}
                              <br />
                              {active.place.zip}
                              {' '}
                              {active.place.city}
                            </span>
                            <li className='green-hover'>
                              <span>Mo :</span>
                              <span>{active.place.openingHours.mon}</span>
                            </li>
                            <li className='green-hover'>
                              <span>Di :</span>
                              <span>{active.place.openingHours.tue}</span>
                            </li>
                            <li className='green-hover'>
                              <span>Mi :</span>
                              <span>{active.place.openingHours.wed}</span>
                            </li>
                            <li className='green-hover'>
                              <span>Do :</span>
                              <span>{active.place.openingHours.thu}</span>
                            </li>
                            <li className='green-hover'>
                              <span>Fr :</span>
                              <span>{active.place.openingHours.fri}</span>
                            </li>
                            <li className='green-hover'>
                              <span>Sa :</span>
                              <span>{active.place.openingHours.sat ? active.place.openingHours.sat : 'geschlossen'}</span>
                            </li>
                            <li className='green-hover'>
                              <span>So :</span>
                              <span>{active.place.openingHours.sun ? active.place.openingHours.sun : 'geschlossen'}</span>
                            </li>
                          </ul>
                        )
                        : ''}
                      </div>
                      <a href={active.place ? `tel:${active.place.phoneFull}` : ''} className="place-mobile d-sm-none d-md-none d-lg-block text-decoration-none"
                        style={{background: 'transparent', color: 'black'}}>
                        <img src="/images/phone.svg" width={21} height={16} alt="Telefon" />
                        <span>{active.place ? active.place.phone : ''}</span>
                      </a>
                      <div className="select-input-lang d-xs-none d-sm-none d-md-none d-lg-block">
                        <label>
                          <Select
                            value={lang}
                            onChange={this.handleChangeLang}
                            options={langOptions}
                            classNamePrefix="Select-input-lang"
                            optionRenderer={this.langOptionRenderer}
                            valueRenderer={this.langValueSelected}
                            styles={customStyles}
                            isSearchable={false}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </nav>
      <div className={headerClassName} onClick={this.props.forClearingSearchInput}>
        <nav id="top_2" className={webshopDiscountData.desktop_topbar_active == 1 ? "main-header navbar navbar-default desktop-topbar-activate" : "main-header navbar navbar-default"}>
          <div className="container-fluid">
            <div className="show-desktop navbar-header col-md-2 allign-section">
              <button type="button" className="collapsed navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-6" aria-expanded="false"></button>
              <div className="header-logo navbar-brand" style={{height: '79px'}}>
                <Link to="/"><span className={domain === 'ch' ? "header-image" : "header-image-de"}></span></Link>
              </div>
            </div>
            <div className='show-desktop col-md-5 menu-section' style={{height: '80px', display: 'flex', alignItems: 'center'}}>
              <div className="collapse navbar-collapse header-collapse-style" id="bs-example-navbar-collapse-6">
                <ul className="nav navbar-nav header-ul">
                  <li className="header-li">
                    <Link to="/verkaufen" activeClassName="active">
                      {this.props.t('headerTop.sell')}
                    </Link>
                  </li>
                  <li className="header-li">
                    <Link to="/kaufen" activeClassName="active" className="kaufen-icon-tag">{this.props.t('headerTop.buy')} <i className="fa fa-chevron-down" aria-hidden="true"></i></Link>
                    {!window.isMobile &&
                      <div className="wrap-sub-category main-page">
                        <div className="sub-category">
                          <div className="title">
                            <span>Geräte</span>
                            <div className="line" />
                          </div>
                          <div className="devices">
                            {devices.map(this.mapSubcategories)}
                          </div>
                          <div className="title">
                            <span>Zubehör</span>
                            <div className="line" />
                          </div>
                          <div className="devices">
                            {zubenhor ? zubenhor.submodels.map(this.mapAccessories) : ''}
                          </div>
                        </div>
                      </div>
                    }
                  </li>
                  <li className="header-li">
                    <a href="https://www.ireparatur.ch/" className="active" target="_blank" style={{cursor: 'pointer'}}>{this.props.t('headerTop.repair')}</a>
                  </li>
                  <li className="header-li">
                    <Link to="/kontakt" activeClassName="active">{this.props.t('headerTop.contact')}</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='show-desktop col-md-3 search-section'>
              <SearchBarKaufenV3 placeholder="Suchbegriff eingeben..." />
            </div>
            <div className='col-md-2 user-section'>
              {urlPathName === '/versichern' ? null :
                <div className="row fr allign-section">
                  {!user.isLogin
                    ? (
                      <span className="show-desktop lower" />
                    )
                    : (
                      <span className="show-desktop userButtons lower">
                        <span className="image">
                          {
                            user.data
                            && user.data.systemAddress.first_name
                            && user.data.systemAddress.first_name.slice(0, 1).toUpperCase()
                          }
                        </span>
                        <span className="userHello">
                          {domain === 'de' ? 'Hallo' : 'Grüezi'}
                          {user.data && user.data.systemAddress.first_name ? ', ' : ''}
                          <span className="user-name">
                            {user.data && user.data.systemAddress.first_name}
                            !
                          </span>
                          <div className="userLinks">
                            <Link to="/kundenkonto">Mein Konto</Link>
                            <span onClick={this.logOut}>Ausloggen</span>
                          </div>
                        </span>
                      </span>
                    )
                  }

                  <input type="checkbox" id="op" className="op" />
                  <LoginForm
                    registerUser={this.registerUser}
                    showInputCode={showInputCode}
                    loginUser={this.loginUser}
                    errorRegistration={errorRegistration}
                    errorLogin={errorLogin}
                    resendActivationEmail={this.resendActivationEmail}
                    handleChangeRegistration={this.handleChangeRegistration}
                    handleChangeLogin={this.handleChangeLogin}
                    closeLoginForm={this.closeLoginForm}
                    loginFacebook={this.loginFacebook}
                    loginGoogle={this.loginGoogle}
                  />
                  <input type="checkbox" id="forgotPassword" />
                  <LoginFormForgotPassword />
                  {!user.isLogin &&
                    <label onClick={() => $('.login-box-wrapper').css({ display: 'block' })} className={pageNotFound ? 'show-desktop login-page404 basket' : 'show-desktop login basket'} htmlFor="op">
                      <span><img src="/images/design/person-top.svg" alt="" /></span>
                    </label>
                  }

                  <span className={pageNotFound ? 'show-desktop basketButtons-page404' : 'show-desktop basketButtons'}>
                    <Link to="/warenkorb">
                      <span className="basket cart-icon">
                        <span>
                          <img src="/images/design/cart-new.svg" alt="" />
                        </span>
                        {basket.countVerkaufen + basket.count > 0 && <span className="count cart-total-kaufen">{basket.countVerkaufen + basket.count}</span>}
                      </span>
                    </Link>
                    {/* {pageNotFound ||
                      <div className="basketLinks">
                        <Link to="/warenkorb" className={basket.count > 0 ? 'full' : ''}>Warenkorb {basket.count > 0 && <span>({basket.count})</span>}</Link>
                        <Link to="/verkaufen/warenkorb" className={basket.countVerkaufen > 0 ? 'full' : ''}>
                          Verkaufskorb {basket.countVerkaufen > 0 && <span>{' '}({basket.countVerkaufen})</span>}
                        </Link>
                      </div>
                    } */}
                  </span>

                  <span className={pageNotFound ? 'show-desktop wishButton-page404' : 'show-desktop wishButtons'}>
                    <Link to="/wunschliste">
                      <span>
                        <img src="/images/design/wishIcon.svg" alt="" />
                        {basket.wishlistCount > 0 && <span className="count wish-total-kaufen">{basket.wishlistCount}</span>}
                      </span>
                    </Link>
                  </span>
                </div>
              }
            </div>
          </div>
        </nav>
        <HeaderMobile menu={true} title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
        {false && 
          <div className="row d-none header-mobile scrolling-header show-ipad">
            <div className="wrap-header">
              <div className="col-xs-2">
                <div className="hamburger" onClick={this.showMenu}>
                  <svg viewBox="0 0 64 48">
                      <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
                      <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
                      <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
                  </svg>
                </div>
              </div>

              <div className="col-xs-8 text-center">
                <p className="title"><img alt="Logo" src="/images/design/logo_all_pages.svg" /></p>
              </div>

              <div className="col-xs-2 text-right">
                <span className="basketButtons">
                  <span className="basket"><img src="/images/design/cart-new.svg" /></span>
                  {basket.countVerkaufen + basket.count > 0 && <span className="count cart-total-kaufen">{basket.countVerkaufen + basket.count}</span>}
                  <div className="basketLinks">
                    <a href="/warenkorb">Warenkorb</a>
                    <a href="/verkaufen/warenkorb">Verkaufskorb</a>
                  </div>
                </span>
              </div>
            </div>
            <MenuMobile showLangMenu={null} />
          </div>
        }
        {(urlPathName === '/' && !window.isMobile) && <HeaderBottomMainPage />}
        {urlPathName === '/jobs' && <HeaderBottomJobsPage />}
        {urlPathName === '/faq' && <HeaderBottomFaqPage />}
        {spinner}
        {msgInfo}
        {this.state.showCouponFromAds && <CouponFromAds toggleLightbox={this.toggleCouponFromAds} />}
      </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    msgInfo: state.user.msgInfo,
    basket: state.basket,
    shop: state.shop,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    shopActions: bindActionCreators(shopActions, dispatch),
    placesActions: bindActionCreators(placesActions, dispatch),
  };
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(HeaderTop)));
