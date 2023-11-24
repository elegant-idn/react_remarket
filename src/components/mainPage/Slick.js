import React, { Component } from "react";
import Slider from "react-slick";
import "../../sass/Slick-theme.css";
import "../../sass/Slick.css";

export class Slick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    });
  }

  render() {
    return (
      <div>
        <Slider
          arrows={true}
          asNavFor={this.state.nav2}
          ref={(slider) => (this.slider1 = slider)}
          className={"big-slick"}
          infinite
        >
          <div className="big-slick-item first-item">
            <a className="lightBoxVideoLink" href={"/images/design/store.png"}>
              <div className="magnifier"></div>
            </a>
          </div>
          <div className="big-slick-item second-item">
            <a className="lightBoxVideoLink" href={"/images/design/slick3.png"}>
              <div className="magnifier"></div>
            </a>
          </div>
          <div className="big-slick-item third-item">
            <a className="lightBoxVideoLink" href={"/images/design/slick2.png"}>
              <div className="magnifier"></div>
            </a>
          </div>
          <div className="big-slick-item fourth-item">
            <a className="lightBoxVideoLink" href={"/images/design/slick1.png"}>
              <div className="magnifier"></div>
            </a>
          </div>
          <div className="big-slick-item second-item">
            <a className="lightBoxVideoLink" href={"/images/design/slick3.png"}>
              <div className="magnifier"></div>
            </a>
          </div>
        </Slider>
        <Slider
          asNavFor={this.state.nav1}
          ref={(slider) => (this.slider2 = slider)}
          slidesToShow={4}
          swipeToSlide={true}
          focusOnSelect={true}
          infinite
          className={"small-slick"}
        >
          <div>
            <div className="item">
              <img src="/images/design/store.png" />
            </div>
          </div>
          <div>
            <div className="item">
              <img src="/images/design/slick3.png" />
            </div>
          </div>
          <div>
            <div className="item">
              <img src="/images/design/slick2.png" />
            </div>
          </div>
          <div>
            <div className="item">
              <img src="/images/design/slick1.png" />
            </div>
          </div>
          <div>
            <div className="item">
              <img src="/images/design/slick3.png" />
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}

export default Slick;
