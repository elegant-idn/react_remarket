import React, { Component } from 'react'
import Slider from 'react-slick'
import CountTo from 'react-count-to'

class Numbers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      countNumbers: false
    }

    this._mapNumbers = this._mapNumbers.bind(this)
    this.animateOnScroll = this.animateOnScroll.bind(this)
    this.animateOnScroll.passive = false;
  }

  componentDidMount() {
    this.animateOnScroll()
  }
  animateOnScroll() {
    let _this = this,
      hT = $('.numbers').offset().top,
      hH = $('.numbers').outerHeight(),
      wH = $(window).height(),
      wS = $(this).scrollTop();
    if (wS - hH - 40 > (hT + hH - wH)) {
      _this.setState({ countNumbers: true })
    }
    $(window).scroll(function () {
      wS = $(this).scrollTop();
      if (wS - hH - 40 > (hT + hH - wH)) {
        _this.setState({ countNumbers: true })
      }
    })
  }
  _mapNumbers() {
    if (!window.isMobile) { }
    else {
      let settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
      return (
        <Slider {...settings}>
          <div className="col-sm-4">
            <p className="big">+11</p>
            <p className="small">Jahre</p>
            <p className="small">Erfahrung</p>
          </div>
          <div className="col-sm-4">
            <p className="big">30 <span className="value">min.</span></p>
            <p className="small">durschnittliche</p>
            <p className="small">Preisschätzung<br /><br />Smartphone: 30-60 Minuten<br />
              Tablet: 30-60 Minuten<br />
              Computer: 2-48 Stunden</p>
          </div>
          <div className="col-sm-4">
            <p className="big">24 <span className="value">Std.</span></p>
            <p className="small">Dauer der Express</p>
            <p className="small">Auszahlung</p>
          </div>
        </Slider>
      )
    }
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row numbers text-center hidden-xs">
          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">5/5</span>
            <div className="back-stars">
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <div className="front-stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
            </div>
            <p className="small">BEWERTUNG</p>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">
              <span className='sybmol'>+</span> {!this.state.countNumbers && 0}
              {this.state.countNumbers && <CountTo to={11} speed={2000} />}</span>
            <p className="small">Jahre Erfahrung</p>
          </div>


          <div className="clearfix visible-xs-block visible-sm-block"></div>

          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">
              {!this.state.countNumbers && 0}
              {this.state.countNumbers && <CountTo to={30} speed={2000} />}
              {/* <span className="value">Min.</span> */}
              <sub>min.</sub>
            </span>
            <p className="small">schnelle Preisschätzung</p>
            <p className="small">
              <span className="smartphone">30-60 min</span>
              <span className="television">2-48 std</span>
            </p>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">
              {!this.state.countNumbers && 0}
              {this.state.countNumbers && <CountTo to={24} speed={2000} />}
              {/* <span className="value">Std.</span> */}
              <sub>Std.</sub>
            </span>
            <p className="small">Dauer der Express</p>
            <p className="small pt-0">Auszahlung</p>
          </div>
        </div>
        <div className="row numbers text-center visible-xs">
          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">5/5</span>
            <div className="back-stars">
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <i className="fa fa-star active"></i>
              <div className="front-stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
            </div>
            <p className="small">BEWERTUNG</p>
          </div>

          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">
              {!this.state.countNumbers && 0}
              {this.state.countNumbers && <CountTo to={30} speed={2000} />}
              <sub>min.</sub>
            </span>
            <p className="small">
              <span className="smartphone">30-60 min</span>
              <span className="television">2-48 std</span>
            </p>
            <p className="small">schnelle Preisschätzung</p>
          </div>

          <div className="clearfix visible-xs-block visible-sm-block"></div>

          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">
              <span className='sybmol'>+</span> {!this.state.countNumbers && 0}
              {this.state.countNumbers && <CountTo to={11} speed={2000} />}</span>
            <p className="small">Jahre Erfahrung</p>
          </div>
          
          <div className="col-xs-6 col-sm-6 col-md-3 itemNumber">
            <span className="big">
              {!this.state.countNumbers && 0}
              {this.state.countNumbers && <CountTo to={24} speed={2000} />}
              {/* <span className="value">Std.</span> */}
              <sub>Std.</sub>
            </span>
            <p className="small">Dauer der Express</p>
            <p className="small pt-0">Auszahlung</p>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Numbers
