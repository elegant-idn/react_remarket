import React, { Component } from "react";
import FullStory from "react-fullstory";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as placesActions from "../actions/places";
import { cookieApi } from "../api/apiCookie";
import { META } from "../constants/meta";
import CookieBanner from "./common/cookieBanner";
import LastActivitiesNotification from "./common/lastActivitiesNotification";
import Footer from "./Footer/footer";
import HeaderMainPage from "./header/headerMainPage";
import SpinnerBox from "./spinnerBox/spinnerBox";
import { browserHistory } from 'react-router'

let preventShaking = false;

export class Application extends Component {
  constructor(props) {
    super(props);
    const {reactRedirect} = document.body.dataset;
    if (reactRedirect) {
        browserHistory.push(reactRedirect);
        return;
    }

    this.state = {
      scrolling: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.hideTop = this.hideTop.bind(this);
    this.showTop = this.showTop.bind(this);
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll, true);
  };
  hideTop = () => {
    preventShaking = true;
    $("#top_1").removeClass("large");
    $("#top_2").removeClass("large");
    $(".headerMainPage").removeClass("large");
    $("#top_1").addClass("small");
    $("#top_2").addClass("small");
    $(".headerMainPage").addClass("small");
    setTimeout(() => {
      preventShaking = false;
    }, 400);
  };
  showTop = () => {
    preventShaking = true;
    $("#top_1").removeClass("small");
    $("#top_2").removeClass("small");
    $(".headerMainPage").removeClass("small");
    $("#top_1").addClass("large");
    $("#top_2").addClass("large");
    $(".headerMainPage").addClass("large");
    setTimeout(() => {
      preventShaking = false;
    }, 400);
  };
  handleScroll = () => {
    if (!window.isMobile && !window.isTablet) {
      const scrollY = window.scrollY;
      if (scrollY == 0) this.showTop();
      if (preventShaking) return;
      let { scrolling } = this.state;
      if (!scrolling) {
        this.setState({ scrolling: true });
        if (scrollY >= 100) this.hideTop();
      }
      setTimeout(() => {
        this.setState({ scrolling: false });
        if (window.scrollY >= 100) this.hideTop();
      }, 400);
    }
  };

  render() {
    let showLastActivitiesNotifications = false /*!window.location.href.includes('/verkaufen'),*/,
      urlPathName = this.props.location.pathname,
      domain = window.domainName.name.split(".")[
        window.domainName.name.split(".").length - 1
      ],
      showCookieBanner = !cookieApi.getCookie("cookieBannerHasBeenClosed"),
      title =
        window.domainName.name === "remarket.ch"
          ? META.title_ch
          : META.title_de,
      description =
        window.domainName.name === "remarket.ch"
          ? META.description_ch
          : META.description_de;

    return (
      <div
        className={urlPathName === "/wunschliste" ? "bg-light-grey" : ""}
        onScroll={this.handleScroll}
      >
        <FullStory org={"9FFC6"} debug={false} />
        <Helmet
          title={title}
          meta={[{ name: "description", content: description }]}
        />
        <HeaderMainPage params={this.props.params} />
        <div id="progress" />
        {this.props.children}
        <Footer />
        <SpinnerBox id="spinner-box-load" />
        {showLastActivitiesNotifications && <LastActivitiesNotification />}
        {domain === "de" && showCookieBanner && <CookieBanner />}
        {this.props.basketAddEffect}
        {this.props.wishlistAddEffect}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    basketAddEffect: state.basket.basketAddEffect,
    wishlistAddEffect: state.basket.wishlistAddEffect,
    searchResults: state.shop.searchResults,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    placesActions: bindActionCreators(placesActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Application);
