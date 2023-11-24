import React, { Component } from 'react';
import Slider from "react-slick";
import Slick from './Slick'

class OurStores extends Component {
  componentDidMount() {
    this.encryptedEmail();
  }

  encryptedEmail() {
    [...document.querySelectorAll(".email-rot-13")].map(elem => elem.innerHTML = "<n uers=\"znvygb:vasb@erznexrg.pu\" >vasb@erznexrg.pu</n>".replace(/[a-zA-Z]/g, function (c) { return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26); }));
  }

  render() {
    const { data } = JSON.parse(window.localStorage.getItem("locationData"));
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows:false,
    };
    return (
      <section>
        <div className="modal fade bs-example-modal-lg"
          id="modalMap"
          tabIndex="-1"
          data-keyboard="false"
          role="dialog"
          aria-labelledby="myLargeModalLabeAgb">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <button type="button" className="closeModal"
              onClick={() => $('#modalMap').modal('hide')}
              data-dismiss="modal"
              aria-label="Close" />
            <div className="modal-content">
              <div className="mapContainer" />
            </div>
          </div>
        </div>

        <div className="row head">
          <p>Besuchen Sie uns vor Ort</p>
          <h1>Unsere Standorte</h1>
        </div>

        <div className="row buttons">
          <ul className="listing" role="tablist">
            <li role="presentation" className="active placeDescription tab-first-li"><a href="#location-1" className="" role="tab" data-toggle="tab" aria-expanded="false">Filiale Basel Barfüsserplatz</a></li>
            <li role="presentation" className="placeDescription tab-second-li"><a href="#location-5" className="" role="tab" data-toggle="tab" aria-expanded="false">Filiale Basel Sankt Jakob-Park</a></li>
            <li role="presentation" className="placeDescription tab-third-li"><a href="#location-6" className="" role="tab" data-toggle="tab" aria-expanded="false">Filiale Bern Shoppyland</a></li>
            <li role="presentation" className="placeDescription tab-fourth-li"><a href="#location-7" className="" role="tab" data-toggle="tab" aria-expanded="false">Filiale Solothurn Gäupark</a></li>
          </ul>
        </div>

        <div className="row tab-content">
          {data && data.map((item, i) =>
            <div role="tabpanel" className={`tab-pane ${i == 0 ? 'active' : ''}`} id={`location-${item.id}`} key={`location-${i}`}>
              <div className="row">
                <div className='col-md-4 information'>
                  <div className="hidden-sm">
                    <div className="item adress"><img className="store-info" src="/images/design/location.svg" alt="" />{`${item.address}, ${item.zip} ${item.city}`}</div>
                    <div className="item phone"><img className="store-info" src="/images/design/callphone.svg" alt="" /><a href={`tel:${item.phoneFull}`}>{item.phone}</a></div>
                    <div className='item'><img className="store-info" src="/images/design/mailto.svg" alt="" /><span className="email-rot-13" /></div>
                    <div className="item adress weeks">
                      <div>
                        <img className="store-info" src="/images/design/clock.svg" alt="" />
                      </div>
                      <div>
                        <span className='timing-info'><span>Mo:</span> {item.openingHours.mon ? `${item.openingHours.mon}` : 'geschlossen'}</span>
                        <span className='timing-info'><span>Di:</span> {item.openingHours.tue ? `${item.openingHours.tue}` : 'geschlossen'}</span>
                        <span className='timing-info'><span>Mi:</span> {item.openingHours.wed ? `${item.openingHours.wed}` : 'geschlossen'}</span>
                        <span className='timing-info'><span>Do:</span> {item.openingHours.thu ? `${item.openingHours.thu}` : 'geschlossen'}</span>
                        <span className='timing-info'><span>Fr:</span> {item.openingHours.fri ? `${item.openingHours.fri}` : 'geschlossen'}</span>
                        <span className='timing-info'><span>Sa:</span> {item.openingHours.sat ? `${item.openingHours.sat}` : 'geschlossen'}</span>
                        <span className='timing-info'><span>So:</span> {item.openingHours.sun ? `${item.openingHours.sun}` : 'geschlossen'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row visible-sm hidden-xs hidden-md">
                    <div className='col-sm-6 information'>
                      <div className="item adress"><img className="store-info" src="/images/design/location.svg" alt="" />{`${item.address}, ${item.zip} ${item.city}`}</div>
                      <div className="phone"><img className="store-info" src="/images/design/callphone.svg" alt="" /><a href={`tel:${item.phoneFull}`}>{item.phone}</a></div>
                      <div className='item'><img className="store-info" src="/images/design/mailto.svg" alt="" /><span className="email-rot-13" /></div>
                    </div>
                    <div className='col-sm-6 information'>
                      <div className="item adress weeks">
                        <div>
                          <img className="store-info" src="/images/design/clock.svg" alt="" />
                        </div>
                        <div>
                          <span className='timing-info'><span>Mo:</span> {item.openingHours.mon ? `${item.openingHours.mon}` : 'geschlossen'}</span>
                          <span className='timing-info'><span>Di:</span> {item.openingHours.tue ? `${item.openingHours.tue}` : 'geschlossen'}</span>
                          <span className='timing-info'><span>Mi:</span> {item.openingHours.wed ? `${item.openingHours.wed}` : 'geschlossen'}</span>
                          <span className='timing-info'><span>Do:</span> {item.openingHours.thu ? `${item.openingHours.thu}` : 'geschlossen'}</span>
                          <span className='timing-info'><span>Fr:</span> {item.openingHours.fri ? `${item.openingHours.fri}` : 'geschlossen'}</span>
                          <span className='timing-info'><span>Sa:</span> {item.openingHours.sat ? `${item.openingHours.sat}` : 'geschlossen'}</span>
                          <span className='timing-info'><span>So:</span> {item.openingHours.sun ? `${item.openingHours.sun}` : 'geschlossen'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-md-8 slick-carousel'>
                  <div className='visible-sm visible-xs'>
                    <Slider {...settings}>
                      <div className='item'><img src="/images/design/store.jpg" /></div>
                      <div className='item'><img src="/images/design/slick3.jpg" /></div>
                      <div className='item'><img src="/images/design/slick2.jpg" /></div>
                      <div className='item'><img src="/images/design/slick1.jpg" /></div>
                      <div className='item'><img src="/images/design/store.jpg" /></div>
                    </Slider>
                  </div>
                  <div className='hidden-sm hidden-xs'>
                    <Slick />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default OurStores
