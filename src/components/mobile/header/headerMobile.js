import React, { Component } from 'react'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import MenuMobile from '../menu/menuMobile'
import MenuMobileLang from '../menu/menuMobileLang'
import CouponFromAds from '../../mainPage/couponFromAds';
import { headerController, discountCode } from "../../../helpers/helpersFunction";
import SearchBarKaufenV2 from '../../kaufen/searchResults/searchBarKaufenV2';

export class HeaderMobile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showCouponFromAds: false,
      showSearch: window.localStorage.getItem("mobileSearchBar") === 1 ? true : false,
      showMobileMenu: window.localStorage.getItem("mobileShowMenu") === 1 ? true : false,
      showLang: false,
    }

    this.showMenu = this.showMenu.bind(this)
    this.showSearchBar = this.showSearchBar.bind(this)
    this.hideSearchBar = this.hideSearchBar.bind(this)
    this.showLangMenu = this.showLangMenu.bind(this)
    this.hideLangMenu = this.hideLangMenu.bind(this)
    this.toggleCouponFromAds = this.toggleCouponFromAds.bind(this)
  }

  componentDidMount() {
    this.checkAdsSource()
    headerController.initialize()
  }

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
  };

  toggleCouponFromAds() {
    this.setState({ showCouponFromAds: !this.state.showCouponFromAds })
  };

  showMenu(e) {
    let headerHeight = $('.header-mobile.scrolling-header').innerHeight()
    if ($('.header-mobile.scrolling-header').hasClass('scroll')) {
      headerHeight += 40;
    }
    let { showMobileMenu } = this.state

    if (showMobileMenu === true) {
      $('.menuMobile').css({ top: 0, transform: 'translateY(-100%)' });
      $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display', 'block');
      $('#mobile > .mainPage > .mainPage').css('display', 'block');
      // $('#mobile footer').css('display', 'block');
      window.localStorage.setItem("mobileShowMenu", 0)
      this.setState({ showMobileMenu: false })
      $(e.currentTarget).removeClass('open');
    } else {
      $('.menuMobile').css({
        top: headerHeight + 'px',
        maxHeight: `calc( 100vh - ${headerHeight}px`,
        transform: 'translateY(0)'
      });
      setTimeout(function () {
        $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display', 'none');
        $('#mobile > .mainPage > .mainPage').css('display', 'none');
        // $('#mobile footer').css('display', 'none')
      }, 1000)
      window.localStorage.setItem("mobileShowMenu", 1)
      this.setState({ showMobileMenu: true })
      $(e.currentTarget).addClass('open');
    }
  }

  showSearchBar() {
    this.setState({ showSearch: true })
    window.localStorage.setItem("mobileSearchBar", 1)
    this.setState({ showMobileMenu: false })
    window.localStorage.setItem("mobileShowMenu", 0)
  }

  hideSearchBar() {
    this.setState({ showSearch: false })
    window.localStorage.setItem("mobileSearchBar", 0)
  }

  showLangMenu() {
    $('.menuMobile').css({ top: 0, transform: 'translateY(-100%)' });
    $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display', 'block');
    $('#mobile > .mainPage > .mainPage').css('display', 'block');
    window.localStorage.setItem("mobileShowMenu", 0)
    this.setState({ showMobileMenu: false })
    this.setState({ showLang: true })
  }

  hideLangMenu() {
    $('.hamburgerLang').toggleClass('open');
    $('.menuMobile').css({ top: 0, transform: 'translateY(-100%)' });
    $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display', 'block');
    $('#mobile > .mainPage > .mainPage').css('display', 'block');
    setTimeout(function(){
      this.setState({showLang:false});
    }.bind(this),700);    
  }

  render() {
    let { showSearch, showCouponFromAds, showLang } = this.state
    let backBtnUrl = this.props.backColorGreen ? "/images/design/mobile/back-btn-green.svg" : "/images/design/mobile/back-btn.svg"
    const webshopDiscountData = JSON.parse(window.localStorage.getItem('webshopDiscountData'))
    return (
        <React.Fragment>
          {showSearch && !showLang && (
            <div className="row header-mobile scrolling-header">
              <div className='wrap-header'>
                <div className="mobile-search-section">
                  <SearchBarKaufenV2 placeholder="Suchbegriff eingeben..." hideSearchBar={this.hideSearchBar} />
                </div>
              </div>
            </div>
          )}
          {!showSearch && !showLang && (
            <div className="row header-mobile scrolling-header">
              {webshopDiscountData.mobile_topbar_active == 1 && 
                <div style={{ position: "relative" }} className="notification-top-bar">
                  <p dangerouslySetInnerHTML={{__html: discountCode(webshopDiscountData.mobile_topbar_text, 'discount-code') }}></p>
                </div>
              }              
              <div className="wrap-header">
                <div className={window.isTablet ? "col-xs-2 mobile-header" : "col-xs-3 mobile-header"}>
                  {this.props.back && <img src={backBtnUrl}
                    onClick={this.props.handlerBack}
                    alt="" />}
                  {this.props.menu &&
                    <div className="hamburger" onClick={this.showMenu}>
                      {window.isTablet ? (
                        <svg viewBox="0 0 64 48">
                          <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
                          <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
                          <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 64 48">
                          <path d="M16,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
                          <path d="M16,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
                          <path d="M42,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
                        </svg>
                      )} 
                    </div>
                  }
                </div>
                <div className={window.isTablet ? "col-xs-8 text-center" : "col-xs-6 text-center"}>
                    <Link to="/">
                      <p className="title" dangerouslySetInnerHTML={{ __html: this.props.title }} />
                    </Link>
                </div>
                <div className={window.isTablet ? "col-xs-2 text-right" : "col-xs-3 text-right"} style={{paddingLeft: '0px'}}>
                  {!this.props.btnWriteReview &&
                    <span className="basketButtons">
                      <span className="search" onClick={this.showSearchBar}>
                        <img src="/images/design/searchBtn.svg" alt="" />
                      </span>
                      <div className="basketArea">
                        <Link to="/warenkorb">
                          <span className="basket">
                            <img src="/images/design/cart-new.svg" alt="" />
                            {this.props.basket.countVerkaufen + this.props.basket.count > 0 &&
                              <span className="count cart-total-kaufen">
                                {this.props.basket.countVerkaufen + this.props.basket.count}
                              </span>
                            }
                          </span>
                        </Link>
                      </div>
                      <span className={'wishButtons'}>
                        <Link to="/wunschliste">
                          <span className="basket">
                            <img src="/images/design/wishIcon.svg" alt="" />
                            {this.props.basket.wishlistCount > 0 && <span className="count wish-total-kaufen">{this.props.basket.wishlistCount}</span>}
                          </span>
                        </Link>
                      </span>
                    </span>
                  }
                  {this.props.btnWriteReview && <img src="/images/design/edit-green.png" onClick={this.props.handlerWrite} />}
                </div>
              </div>
              <MenuMobile showLangMenu={this.showLangMenu} />
            </div>
          )}
          {showLang && !showSearch && (
            <div className="row header-mobile scrolling-header">
              <div className="wrap-header">
                <div className="col-xs-3 mobile-header">
                    <div className="hamburgerLang open" onClick={this.hideLangMenu}>
                      {window.isTablet ? (
                        <svg viewBox="0 0 64 48">
                          <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
                          <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
                          <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 64 48">
                          <path d="M16,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
                          <path d="M16,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
                          <path d="M42,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
                        </svg>
                      )}                      
                    </div>
                </div>
                <div className="col-xs-6 text-center">
                  <p className="title">
                    {'Sprache auswählen'}
                  </p>
                </div>                
              </div>
              <MenuMobileLang hideLangMenu={this.hideLangMenu} />
            </div>
          )}
          {!showSearch && !showLang && showCouponFromAds && <CouponFromAds toggleLightbox={this.toggleCouponFromAds} />}
        </React.Fragment>
    );
  }
}

HeaderMobile.propTypes = {}
HeaderMobile.defaultProps = {}

function mapStateToProps(state) {
  return {
    basket: state.basket
  }
}

export default connect(mapStateToProps)(HeaderMobile)
