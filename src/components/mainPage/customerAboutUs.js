import React, { Component } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import WriteRatingModal from "../ratingPage/writeRatingModal";
import WriteRatingModalMobile from "../mobile/ratingPage/writeRatingModalMobile";
import { cookieApi } from "../../api/apiCookie";

import { connect } from "react-redux";

export class CustomerAboutUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      hideNavArrowsPrev: true,
      hideNavArrowsNext: true,
      infoRatings: {
        total: 0,
        average: 0,
        statistics: [
          { stars: 5, count: 0 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 0 },
          { stars: 1, count: 0 },
        ],
      },
      showModalWriteRating: false,
      writeRatingToday: false,
    };

    this.mapItemReview = this.mapItemReview.bind(this);
    this.prevReview = this.prevReview.bind(this);
    this.nextReview = this.nextReview.bind(this);
    this.beforeChange = this.beforeChange.bind(this);
    this.showReview = this.showReview.bind(this);
    this._loadRatingData = this._loadRatingData.bind(this);
    this.closeShowModalWriteRating = this.closeShowModalWriteRating.bind(this);
    this.writeRating = this.writeRating.bind(this);
  }
  componentDidMount() {
    this._loadRatingData();
  }
  _loadRatingData() {
    if (!this.props.notShowLoader)
      document.getElementById("spinner-box-load").style.display = "block";
    axios.get(`/api/getRatings?page=1&&sort=newest`).then((result) => {
      if (!this.props.notShowLoader)
        document.getElementById("spinner-box-load").style.display = "none";
      this.setState({
        infoRatings: result.data.info,
        hideNavArrowsNext: result.data.items.length < 3,
        data: result.data.items,
      });
    });
  }
  closeShowModalWriteRating() {
    this.setState({ showModalWriteRating: false });
  }
  writeRating() {
    if (!cookieApi.getCookie("writeRating")) {
      this.setState({ showModalWriteRating: true });
    } else {
      this.setState({ writeRatingToday: true });
      setTimeout(() => this.setState({ writeRatingToday: false }), 3000);
    }
  }
  mapItemReview(item, index) {
    function mapStars(count) {
      let starsArray = [];
      for (let i = 1; i <= 5; ++i) {
        let className = count >= i ? "fa fa-star active" : "fa fa-star";
        starsArray.push(
          <i
            className={className}
            key={`ItemReviewStar-${i}`}
            aria-hidden="true"
          />
        );
      }
      return starsArray;
    }
    return (
      <div className="col-xs-12 itemCustomer" key={`ItemReview-${index}`}>
        <React.Fragment>
          <div className="avatar">
            {item.googleRating && <img src={item.photo} alt="" />}
            {!item.googleRating && item.anonym === 1 && (
              <span>{item.name}</span>
            )}
            {!item.googleRating && item.anonym === 0 && (
              <span>
                {item.firstname.slice(0, 1).toUpperCase() +
                  item.lastname.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="name">
            {(item.googleRating || item.anonym === 1) && (
              <span>{item.name}</span>
            )}
            {!item.googleRating && item.anonym === 0 && (
              <span>{item.firstname + " " + item.lastname}</span>
            )}
            <div className="stars">{mapStars(item.stars)}</div>
          </div>
          <div className="text">
            {item.message.length > 150 && (
              <p>
                {item.message.substr(0, 150)}
                <span>...</span>
                <i
                  onClick={this.showReview}
                  className="fa fa-angle-down"
                  aria-hidden="true"
                />
                <span style={{ display: "none" }}>
                  {item.message.substr(150, item.message.length)}
                  <i
                    onClick={this.showReview}
                    className="fa fa-angle-up"
                    aria-hidden="true"
                  />
                </span>
              </p>
            )}
            {item.message.length <= 150 && <p>{item.message}</p>}
          </div>
        </React.Fragment>
      </div>
    );
  }
  showReview(e) {
    if ($(e.target).hasClass("fa-angle-down")) {
      $(e.target).hide().prev().hide();
      $(e.target).closest(".itemCustomer").css({ height: "auto" });
      $(e.target).next().show("fast");
    } else {
      $(e.target).parent().hide("fast").prev().show().prev().show();
      $(e.target).closest(".itemCustomer").css({ height: "400px" });
    }
  }
  prevReview() {
    !this.state.hideNavArrowsPrev && this.refs.slider.slickPrev();
  }
  nextReview() {
    !this.state.hideNavArrowsNext && this.refs.slider.slickNext();
  }
  beforeChange(oldIndex, newIndex) {
    let hideNavArrowsNext = newIndex + 3 == this.state.data.length,
      hideNavArrowsPrev = newIndex === 0;
    this.setState({ hideNavArrowsNext, hideNavArrowsPrev });
  }
  loopRender() {
    var indents = [];
    for (var i = 0; i < this.state.infoRatings.average; i++) {
      indents.push(
        <i className="fa fa-star" aria-hidden="true" key={`front-stars-${i}`} />
      );
    }
    return indents;
  }
  render() {
    let { data, infoRatings, showModalWriteRating, writeRatingToday } =
        this.state,
      _this = this,
      slidesToShow = window.isMobile ? 1 : 3,
      settings = {
        dots: false,
        arrows: false,
        infinite: window.isMobile,
        draggable: false,
        adaptiveHeight: data.length > 0 && window.isMobile,
        speed: 700,
        slidesToShow: 3,
        slidesToScroll: 1,
        beforeChange: _this.beforeChange,
        useTransform: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      },
      classNameArrowsPrev = this.state.hideNavArrowsPrev
        ? "navArrows disabled"
        : "navArrows",
      classNameArrowsNext = this.state.hideNavArrowsNext
        ? "navArrows disabled"
        : "navArrows";

    return (
      <section>
        <div className="row">
          <div className="head">
            <p>Kundenmeinungen</p>
            <h1>Unsere Kunden über uns</h1>
          </div>
        </div>

        <p className="link-to-ratings">
          <Link to="/bewertungen">Alle Bewertungen anzeigen</Link>
        </p>

        <div className="row rating-section">
          <div className="col-xs-12 col-sm-6 col-md-3 pr-0 mobile-border">
            <div className="ratings-info">
              {writeRatingToday && (
                <span className="error">
                  Sie können nur eine Bewertung pro Tag abgeben
                </span>
              )}
              <div className="wrap-info">
                <div className="average">{infoRatings.average}/5</div>
                <div className="back-stars">
                  <i
                    className="fa fa-star active"
                    aria-hidden="true"
                    key={`back-starts-1`}
                  />
                  <i
                    className="fa fa-star active"
                    aria-hidden="true"
                    key={`back-starts-2`}
                  />
                  <i
                    className="fa fa-star active"
                    aria-hidden="true"
                    key={`back-starts-3`}
                  />
                  <i
                    className="fa fa-star active"
                    aria-hidden="true"
                    key={`back-starts-4`}
                  />
                  <i
                    className="fa fa-star active"
                    aria-hidden="true"
                    key={`back-starts-5`}
                  />
                  <div className="front-stars">{this.loopRender()}</div>
                </div>
                <p className="title">Durchschnitt</p>
                <div className="write" onClick={this.writeRating}>
                  <span>Bewertung abgeben</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-9 pl-0">
            <div className="row wrapCustomers">
              <div className="col-xs-12 col-md-12">
                {data.length > 0 && (
                  <Slider ref="slider" {...settings}>
                    {data.map(this.mapItemReview)}
                  </Slider>
                )}
              </div>
            </div>
            <div className="row text-right">
              <div className="col-md-12">
                <span className={classNameArrowsPrev} onClick={this.prevReview}>
                  <i className="fa fa-chevron-left" aria-hidden="true" />
                </span>
                <span className={classNameArrowsNext} onClick={this.nextReview}>
                  <i className="fa fa-chevron-right" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>
        {!window.isMobile && (
          <WriteRatingModal
            showModalWriteRating={showModalWriteRating}
            closeShowModalWriteRating={this.closeShowModalWriteRating}
            user={this.props.user}
          />
        )}
        {window.isMobile && (
          <WriteRatingModalMobile
            user={this.props.user}
            showModalWriteRating={showModalWriteRating}
            closeShowModalWriteRating={this.closeShowModalWriteRating}
          />
        )}
      </section>
    );
  }
}
CustomerAboutUs.propTypes = {};
CustomerAboutUs.defaultProps = {};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
export default connect(mapStateToProps)(CustomerAboutUs);
