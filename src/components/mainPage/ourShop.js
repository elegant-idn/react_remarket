import React, { Component } from 'react'
import { SimpleImg } from 'react-simple-img'

import LightboxImage from '../common/lightboxImg'
import Slider from 'react-slick'

class OurShop extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpenLightBox: false,
      arrayOfImages: [],
      currentImageSrc: null,
      showContent: true
    }

    this.openLightBox = this.openLightBox.bind(this)
    this.closeLightBox = this.closeLightBox.bind(this)
    this._setArrayOfImages = this._setArrayOfImages.bind(this)
    this._returnContent = this._returnContent.bind(this)
    this.updateContent = this.updateContent.bind(this)
  }
  componentDidMount() {
    this._setArrayOfImages()
  }
  // componentDidUpdate(){
  //     this._setArrayOfImages()
  //  }
  _setArrayOfImages() {
    let arrayOfImages = [...document.querySelectorAll('.our-shop .tab-pane.active .item-block:not(.slick-cloned) img')].map(item => {
      return { src: item.dataset.srcBig }
    })
    this.setState({ arrayOfImages })
  }
  openLightBox(e) {
    let currentImageSrc = e.currentTarget.getElementsByTagName('img')[0].dataset.srcBig;

    this.setState({ isOpenLightBox: true, currentImageSrc })
  }
  closeLightBox() {
    this.setState({ isOpenLightBox: false })
  }
  _returnContent(id) {
    let content = [
      <div className="col-md-4 col-sm-6 item-block" key={1}>
        <div className="image" onClick={this.openLightBox}>
          <SimpleImg src={`images/design/shop/for_preview/iReparatur_1_id_${id}.jpg`}
            data-src-big={`images/design/shop/iReparatur_1_id_${id}.jpg`}
            srcSet=""
            // wrapperClassName="clearSimpleImgWrapper"
            alt="" />
        </div>
      </div>,
      <div className="col-md-4 col-sm-6 item-block" key={2}>
        <div className="image" onClick={this.openLightBox}>
          <SimpleImg src={`images/design/shop/for_preview/iReparatur_2_id_${id}.jpg`}
            data-src-big={`images/design/shop/iReparatur_2_id_${id}.jpg`}
            srcSet=""
            // wrapperClassName="clearSimpleImgWrapper"
            alt="" />
        </div>
      </div>,
      <div className="col-md-4 col-sm-6 item-block" key={3}>
        <div className="image" onClick={this.openLightBox}>
          <SimpleImg src={`images/design/shop/for_preview/iReparatur_3_id_${id}.jpg`}
            data-src-big={`images/design/shop/iReparatur_3_id_${id}.jpg`}
            srcSet=""
            // wrapperClassName="clearSimpleImgWrapper"
            alt="" />

        </div>
      </div>,
      <div className="col-md-4 col-sm-6 item-block" key={4}>
        <div className="image" onClick={this.openLightBox}>
          <SimpleImg src={`images/design/shop/for_preview/iReparatur_4_id_${id}.jpg`}
            data-src-big={`images/design/shop/iReparatur_4_id_${id}.jpg`}
            srcSet=""
            // wrapperClassName="clearSimpleImgWrapper"
            alt="" />
        </div>
      </div>,
      <div className="col-md-4 col-sm-6 item-block" key={5}>
        <div className="image" onClick={this.openLightBox}>
          <SimpleImg src={`images/design/shop/for_preview/iReparatur_5_id_${id}.jpg`}
            data-src-big={`images/design/shop/iReparatur_5_id_${id}.jpg`}
            srcSet=""
            // wrapperClassName="clearSimpleImgWrapper"
            alt="" />
        </div>
      </div>
    ]
    let settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    if (!window.isMobile) {
      return (
        <div>
          {content.map(item => item)}
        </div>
      )
    }
    else {
      return (
        <Slider {...settings}>
          {content.map(item => item)}
        </Slider>

      )
    }

  }
  updateContent() {
    this.setState({ showContent: false });
    this.setState({ showContent: true });
    this._setArrayOfImages()


  }
  render() {
    let { isOpenLightBox, arrayOfImages, currentImageSrc, showContent } = this.state;
    const { data } = JSON.parse(window.localStorage.getItem("locationData"));
    return (
      <div className="container-fluid our-shop">
        <div className="head">
          <div className="buttons">
            <ul className="" role="tablist">
              {data && data.map((location, key) =>
                <li role="presentation" className={key == 0 ? 'active' : ''} key={key}>
                  <a href={`#location-${location.id}`} className="" role="tab" data-toggle="tab" onClick={this.updateContent}>
                    <img alt='' src={`/images/design/contact/our-shop-green-${location.id}.svg`} />
                    <img alt='' src={`/images/design/contact/our-shop-${location.id}.svg`} />
                    {location.descriptionBranch}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="tab-content">
            {data && data.map((location, key) =>
              <div role="tabpanel" className={`tab-pane ${key == 0 ? 'active' : ''}`} id={`location-${location.id}`} key={key}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-4 col-sm-6 item-block">
                      <div className="head">
                        <p>Showroom</p>
                        <h1>Sehen sie, wo wir arbeiten</h1>
                      </div>
                    </div>
                    {showContent &&
                      this._returnContent(location.id)}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
        {isOpenLightBox && <LightboxImage src={currentImageSrc}
          close={this.closeLightBox}
          array={arrayOfImages} />
        }
      </div>
    )
  }
}

export default OurShop