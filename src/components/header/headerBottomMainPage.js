import React, { Component } from "react";
import { connect } from "react-redux";
import { browserHistory, Link } from "react-router";
import { bindActionCreators } from "redux";
import * as placesActions from "../../actions/places";
import SearchBarKaufen from "../kaufen/searchResults/searchBarKaufen";
import SearchBar from "../verkaufenBeta/answersField/searchBar";

class HeaderBottomMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangePlace = (selectedOption) => {
    this.setState({ selectedOption });
    const { data } = JSON.parse(window.localStorage.getItem("locationData"));
    data.forEach((item) => {
      if (item.id === selectedOption.id) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    const { setLocation } = this.props.placesActions;
    setLocation(selectedOption);
    window.localStorage.setItem("locationData", JSON.stringify({ data }));
  };
  optionRenderer(item) {
    return (
      <div className={`img-item item-${item.id}`}>
        <img alt="" src={`/images/${item.id}.svg`} />
        <div>
          <strong>{item.city}</strong>
          <br />
          {item.descriptionBranch}
        </div>
      </div>
    );
  }
  valueSelected(item) {
    return (
      <div className="valueSelected" style={{ fontWeight: "400" }}>
        <img
          src={`/images/${item.id}.svg`}
          alt=""
          style={{ marginRight: "5px" }}
        />
        <div>
          <span>{item.city}</span>
          <p style={{ margin: "0px", padding: "0px" }}>
            {item.descriptionBranch}
          </p>
          <span></span>
        </div>
      </div>
    );
  }

  setResultsFromSearchBar = (data) => {
    let selectedAnswers = {};
    selectedAnswers.Device = [data.brand[0]];

    if (data.brand[0].submodels[0].submodels) {
      selectedAnswers.Brand = [data.brand[0].submodels[0]];
      selectedAnswers.Submodel = [data.brand[0].submodels[0].submodels[0]];
      selectedAnswers.Model = [data.device];
    } else {
      selectedAnswers.Brand = [data.brand[0].submodels[0]];
      selectedAnswers.Model = [data.device];
    }

    browserHistory.push(`/verkaufen/${getUrlStrSearch(selectedAnswers)}`);
  };

  render() {
    const data = JSON.parse(window.localStorage.getItem("locationData"));
    const active = {};
    if (data) {
      active.place = data.data.find((item) => item.active === true);
      if (active.place == null) {
        active.place = data.data[0];
      }
    }

    return (
      <React.Fragment>
        <div className="container-fluid header-bottom-inner m-0">
          <div className="row">
            <div className="col-md-6 header-verkaufen">
              <div className="left-section">
                <section className="row title">
                  <h2 className="col-md-9 col-sm-10 title-heading">
                    <span>Verkaufen Sie uns Ihre</span> Smartphones, Tablets &
                    Mac-Computer
                  </h2>
                  <p className="col-md-3 col-sm-2  title-image">
                    <img
                      src="/images/design/handout.svg"
                      alt="Online einfach Smartphone, Tablet, Computer verkaufen"
                    />
                  </p>
                </section>
                <p className="row m-0 description">
                  Bei uns können Sie Ihr Smartphone (z.B. Apple iPhone und
                  Samsung Galaxy), Mac-Computer und Tablet zu fairen Preisen
                  verkaufen. Benutzen Sie unseren Preiskalkulator für eine
                  sofortige Verkaufsofferte!
                </p>
                <section className="star">
                  <div className="star-div">
                    <div className="google-marker">
                      <img src="/images/design/google.svg" alt="" />
                      <span>4.9</span>
                    </div>
                    <div className="star-marker">
                      <img
                        src="/images/design/mark-star.svg"
                        alt=""
                        key={`mark-stars-1`}
                      />
                      <img
                        src="/images/design/mark-star.svg"
                        alt=""
                        key={`mark-stars-2`}
                      />
                      <img
                        src="/images/design/mark-star.svg"
                        alt=""
                        key={`mark-stars-3`}
                      />
                      <img
                        src="/images/design/mark-star.svg"
                        alt=""
                        key={`mark-stars-4`}
                      />
                      <img
                        src="/images/design/mark-star-half.svg"
                        alt=""
                        key={`mark-stars-5`}
                      />
                    </div>
                  </div>
                  <div className="satisfied-custormers">
                    Über 100'000 zufriedene
                    <br />
                    Kunden vertrauen remarket.ch
                  </div>
                </section>
                <section
                  className="row search-input-block"
                  style={{ marginTop: "3%" }}
                >
                  <label>
                    <SearchBar
                      setResults={this.setResultsFromSearchBar}
                      showButton={true}
                      option={{ name: "header-search" }}
                      placeHolder="Welches Gerät haben Sie?"
                    />
                  </label>
                </section>

                <section className="row list m-0">
                  <Link
                    to="/verkaufen/smartphone-23"
                    className="list-item smartphone-bg"
                  >
                    <span>SMARTPHONE</span>
                  </Link>
                  <Link
                    to="/verkaufen/tablet-24/"
                    className="list-item tablet-bg"
                  >
                    <span>TABLET</span>
                  </Link>
                  <Link
                    to="/verkaufen/computer-26/"
                    className="list-item computer-bg"
                  >
                    <span>COMPUTER</span>
                  </Link>
                </section>
                {window.isMobile && (
                  <SearchBar
                    setResults={this.setResultsFromSearchBar}
                    showButton={true}
                    option={{ name: "header-search" }}
                    placeHolder="Welches Gerät haben Sie?"
                  />
                )}
              </div>
            </div>

            <div className="col-md-6 header-kaufen">
              <div className="right-section">
                <section className="row title" style={{ marginTop: 0 }}>
                  <h2
                    className="col-md-9 col-sm-8 title-heading"
                    style={{ paddingTop: "15px" }}
                  >
                    <span>Kaufen Sie bei uns neue und gebrauchte</span> iPhones,
                    iPads, Macbooks etc.
                  </h2>
                  <p
                    className="col-md-3 col-sm-4 title-image"
                    style={{ paddingTop: "15px" }}
                  >
                    <img src="/images/design/tophand.svg" alt="Kaufen" />
                  </p>
                </section>

                <p className="row m-0 color-black">
                  Sie finden bei uns eine grosse Auswahl an gebrauchten und
                  neuen iPhones, Samsung Galaxy, Huawei, Macbooks, iPads und
                  weitere Geräte zu fairen Preisen inkl. mindestens 1 Jahr
                  Garantie.
                </p>

                {/* {!window.isMobile &&
                }                 */}
                <Link to="/kaufen" title="Gerät kaufen">
                  <div id="discount-on-header">
                    <div className="content">
                      <p className="price">- 30.-</p>
                      <p className="title">RABATT auf ALLE</p>
                      <p className="descr">Geräte ab 299.-</p>
                    </div>
                    <div className="circle" />
                    <div className="circle-2" />
                  </div>
                </Link>

                <section className="row search-input-block">
                  <label>
                    <SearchBarKaufen
                      placeholder="Welches Gerät möchten Sie?"
                      showBtn={true}
                    />
                  </label>
                </section>
                {window.isMobile && (
                  <section className="row list m-0">
                    <div className="sub-list">
                      <Link
                        to="/kaufen/smartphone/filter"
                        className="list-item top-right-section-anchor rightsec-smartphone"
                      >
                        <span>SMARTPHONE</span>
                      </Link>
                      <Link
                        to="/kaufen/tablet/filter"
                        className="list-item top-right-section-anchor rightsec-tablet"
                      >
                        <span>TABLET</span>
                      </Link>
                    </div>
                    <div className="sub-list">
                      <Link
                        to="/kaufen/macbook/filter"
                        className="list-item top-right-section-anchor rightsec-computer"
                      >
                        <span>COMPUTER</span>
                      </Link>
                      <Link
                        to="kaufen/zubeh%c3%b6r"
                        className="list-item top-right-section-anchor rightsec-zubehor"
                      >
                        <span>ZUBEHÖR</span>
                      </Link>
                    </div>
                  </section>
                )}
                {!window.isMobile && (
                  <section className="row list m-0">
                    <Link
                      to="/kaufen/smartphone/filter"
                      className="list-item top-right-section-anchor rightsec-smartphone"
                    >
                      <span>SMARTPHONE</span>
                    </Link>
                    <Link
                      to="/kaufen/tablet/filter"
                      className="list-item top-right-section-anchor rightsec-tablet"
                    >
                      <span>TABLET</span>
                    </Link>
                    <Link
                      to="/kaufen/macbook/filter"
                      className="list-item top-right-section-anchor rightsec-computer"
                    >
                      <span>COMPUTER</span>
                    </Link>
                    <Link
                      to="kaufen/zubeh%c3%b6r"
                      className="list-item top-right-section-anchor rightsec-zubehor"
                    >
                      <span>ZUBEHÖR</span>
                    </Link>
                  </section>
                )}
                {window.isMobile && (
                  <SearchBarKaufen
                    placeholder="Welches Gerät möchten Sie?"
                    showBtn={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    msgInfo: state.user.msgInfo,
    devices: state.shop.devices,
    basket: state.basket,
    shop: state.shop,
    places: state.places.currentLocation,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    placesActions: bindActionCreators(placesActions, dispatch),
  };
}

function getUrlStrSearch(answers) {
  let str = "";
  //clone object userAnswers
  let userAnswers = { ...answers };
  for (let key in userAnswers) {
    if (key !== "image") {
      userAnswers[key] = [...userAnswers[key]];
      userAnswers[key].forEach(
        (item, i) => (userAnswers[key][i] = { ...item })
      );
    }
  }
  for (let key in userAnswers) {
    let nameParam = "";
    switch (key) {
      case "Model":
        nameParam = userAnswers[key][0].name;
        break;
      case "Device":
        nameParam = userAnswers[key][0].name;
        break;
      case "Brand":
        nameParam = userAnswers[key][0].name;
        break;
      case "Submodel":
        nameParam = "sub-" + userAnswers[key][0].name;
        break;
      default:
        nameParam = key;
    }
    if (key !== "image") {
      if (userAnswers[key].length > 0) {
        userAnswers[key].forEach((item, i) => {
          if (i === 0) {
            if (userAnswers[key].length === 1) {
              str += `${nameParam.replace(/ /g, "-").toLowerCase()}-${
                item.id
              }/`;
            } else
              str += `${nameParam.replace(/ /g, "-").toLowerCase()}-${item.id}`;
          } else if (i === userAnswers[key].length - 1) {
            str += `,${item.id}/`;
          } else str += `,${item.id}`;
        });
      }
    }
  }
  return str;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderBottomMainPage);
