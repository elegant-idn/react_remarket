import React, { Component } from "react";
import OurStores from "./ourStores";
import HowItWorks from "./howItWorks";
import WhyWeAreDifferent from "./whyWeAre";
import CustomerAboutUs from "./customerAboutUs";
import Banner from "./banner";
// import OurShop from "./ourShop"
import Numbers from "./numbers";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendations: [],
    };
    this._recommendation = this._recommendation.bind(this);
  }
  componentDidMount() {
    let domain =
        window.domainName.name.split(".")[
          window.domainName.name.split(".").length - 1
        ],
      footerText = domain === "ch" ? FOOTER_SEO_CH : FOOTER_SEO_DE;
    this._recommendation();
    $(".footerBottom p.seo").html(footerText);
    // $('.lightBoxVideoLink').simpleLightbox()
  }
  componentWillUnmount() {
    $(".footerBottom p.seo").empty();
  }
  _recommendation() {
    document.getElementById("spinner-box-load").style.display = "block";
    axios
      .get(`/api/getRecommendation`)
      .then(({ data }) => {
        document.getElementById("spinner-box-load").style.display = "none";
        this.setState({ recommendations: data.data });
      })
      .catch((error) => {
        document.getElementById("spinner-box-load").style.display = "none";
      });
  }
  render() {
    const domain =
      window.domainName.name.split(".")[
        window.domainName.name.split(".").length - 1
      ];
    const { recommendations } = this.state;

    const options = {
      margin: 25,
      responsiveClass: true,
      nav: true,
      dots: true,
      responsive: {
        0: {
          items: 1,
        },
        400: {
          items: 1,
        },
        600: {
          items: 2,
        },
        700: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    };
    return (
      <div className="mainPage">
        {/*sustainability section*/}
        <section className="sustainability container-fluid">
          <div className="sustainability-preheader">Das wird dir gefallen</div>
          <div className="sustainability-header">
            Eine grünere Zukunft mit remarket.ch
          </div>
          <div className="sustainability-underline"></div>
          <div className="sustainability-cards">
            <div className="sustainability-card">
              <img className="sustainability-img" src="/images/container.svg" />
              <div className="sustainability-card-title">
                Weniger Elektroschrott
              </div>
            </div>
            <div className="sustainability-card">
              <img className="sustainability-img" src="/images/ecology.svg" />
              <div className="sustainability-card-title">
                Ressourcen schonen
              </div>
            </div>
            <div className="sustainability-card">
              <img className="sustainability-img" src="/images/guarantee.svg" />
              <div className="sustainability-card-title">
                Mindestens 1 Jahr Garantie
              </div>
            </div>
            <div className="sustainability-card">
              <img
                className="sustainability-img"
                src="/images/free-delivery.svg"
              />
              <div className="sustainability-card-title">
                Kostenloser Versand
              </div>
            </div>
          </div>
        </section>

        {/*product section for desktop*/}
        <section className="produts container-fluid show-desktop">
          <a
            className="products iphone-showcase hover-section col-md-3 common"
            style={{ height: "514px", width: "30%" }}
            href="/kaufen/smartphone/apple-iphone/filter"
          >
            <p className="title">iPhone kaufen</p>
            <p className="link">Jetzt einkaufen &gt;</p>
            <div className="iphoneImage">
              <img
                className="d3-move-up"
                src="/images/design/iphone12.png"
                alt="iPhone kaufen"
              />
              <div className="image-panel-mask-div"></div>
            </div>
          </a>

          <div className="products col-md-5" style={{ background: "none" }}>
            <div
              className="row second-section bg-grey hover-section"
              style={{ width: "100%", marginLeft: 0, marginBottom: "20px" }}
            >
              <a
                className="col-md-12 common"
                href="/kaufen/macbook/filter"
                style={{ height: "100%" }}
              >
                <p className="title">MacBook kaufen</p>
                <p className="link">Jetzt einkaufen &gt;</p>
                <p className="macbook">
                  <img
                    className="d3-move-up"
                    src="/images/design/macbook.png"
                    alt="Macbook kaufen"
                  />
                </p>
              </a>
            </div>
            <div
              className="row second-section second-row"
              style={{ display: "flex", width: "100%", marginLeft: 0 }}
            >
              <a
                className="col-md-6 bg-grey  hover-section common"
                style={{ marginLeft: 0 }}
                href="/kaufen/smartphone/samsung-galaxy/filter"
              >
                <p className="title">Galaxy kaufen</p>
                <p className="link">Jetzt einkaufen &gt;</p>
                <div className="phones">
                  <img
                    className="d3-move-up"
                    src="/images/design/galaxy.png"
                    alt="Samsung Galaxy online kaufen"
                  />
                  <div className="image-panel-mask-div"></div>
                </div>
              </a>
              <a
                className="col-md-6 bg-grey hover-section common"
                href="/kaufen/zubeh%C3%B6r/audio/filter"
              >
                <p className="title">Zubehör</p>
                <p className="link">Jetzt einkaufen &gt;</p>
                <div className="accessory">
                  <img
                    className="d3-move-up"
                    src="/images/design/accessories1.png"
                    alt="Zubehör online kaufen"
                  />
                  <div className="image-panel-mask-div"></div>
                </div>
              </a>
            </div>
          </div>

          <div
            className="products col-md-3"
            style={{ background: "none", paddingLeft: 0 }}
          >
            <div className="row second-section">
              <a
                className="col-md-12  hover-section bg-grey common"
                style={{ marginBottom: "20px", height: "247px" }}
                href="/kaufen/tablet/filter"
              >
                <p className="title">Tablets kaufen</p>
                <p className="link">Jetzt einkaufen &gt;</p>
                <div className="tablets">
                  <img
                    className="d3-move-up"
                    src="/images/design/tablet.png"
                    alt="Tablets kaufen"
                  />
                  <div className="image-panel-mask-div"></div>
                </div>
              </a>
            </div>

            <div className="row second-section">
              <a
                className="col-md-12  hover-section bg-grey common"
                style={{ height: "247px" }}
                href="/kaufen/imac/filter"
              >
                <p className="title">Mac kaufen</p>
                <p className="link">Jetzt einkaufen &gt;</p>
                <div className="mac-mini">
                  <img
                    className="d3-move-up"
                    src="/images/design/mac-mini.png"
                    alt="Mac-Computer kaufen"
                  />
                  <div className="image-panel-mask-div"></div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/*Product section for ipad */}
        <section className="d-none container-fluid show-ipad">
          <div className="row">
            <div className="col-sm-6 hover-section">
              <div className="products iphone-showcase col-md-3">
                <p className="title">iPhone kaufen</p>
                <p className="link">Jetzt einkaufen &gt;</p>
                <p className="iphoneImage">
                  <img src="/images/design/iphone12.png" alt="iPhone kaufen" />
                </p>
              </div>
            </div>
            <div className="col-sm-6 pl-0">
              <div className="row products tablet">
                <div className="col-sm-12 hover-section">
                  <p className="title">Tablets kaufen</p>
                  <p className="link">Jetzt einkaufen &gt;</p>
                  <p className="tablets">
                    <img
                      src="/images/design/tablet.png"
                      alt="Tablet / iPad kaufen"
                    />
                  </p>
                </div>
              </div>

              <div className="row products accessory">
                <div className="col-sm-12 hover-section">
                  <p className="title">Zubehör kaufen</p>
                  <p className="link">Jetzt einkaufen &gt;</p>
                  <p className="accessorie">
                    <img
                      src="/images/design/accessories1.png"
                      alt="Zubehör online kaufen"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Product section for mobile */}
        <section className="d-none container-fluid show-iMobile">
          <OwlCarousel items={1} className="owl-theme">
            <div className="item">
              <div className="row">
                <div className="col-xs-12 show-item">
                  <div className="products iphone-showcase col-md-3">
                    <p className="title">iPhone kaufen</p>
                    <p className="link">Jetzt einkaufen &gt;</p>
                    <p className="iphoneImage">
                      <img
                        src="/images/design/iphone12.png"
                        alt="iPhone kaufen"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="row">
                <div className="col-xs-12 show-item">
                  <div className="products iphone-showcase col-md-3">
                    <p className="title">MacBook kaufen</p>
                    <p className="link">Jetzt einkaufen</p>
                    <p className="macbook">
                      <img
                        src="/images/design/macbook.png"
                        alt="Macbook kaufen"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="row">
                <div className="col-xs-12 show-item">
                  <div className="products iphone-showcase col-md-3">
                    <p className="title">Galaxy kaufen</p>
                    <p className="link">Jetzt einkaufen</p>
                    <p className="phones">
                      <img
                        src="/images/design/galaxy.png"
                        alt="Galaxy online kaufen"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="row">
                <div className="col-xs-12 show-item">
                  <div className="products iphone-showcase col-md-3">
                    <p className="title">Zubehör kaufen</p>
                    <p className="link">Jetzt einkaufen</p>
                    <p className="accessory">
                      <img
                        src="/images/design/accessories1.png"
                        alt="Zubehör online kaufen"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="row">
                <div className="col-xs-12 show-item">
                  <div className="products iphone-showcase col-md-3">
                    <p className="title">Tablets kaufen</p>
                    <p className="link">Jetzt einkaufen</p>
                    <p className="tablets">
                      <img
                        src="/images/design/tablet.png"
                        alt="Tablet / iPad kaufen"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="row">
                <div className="col-xs-12 show-item">
                  <div className="products iphone-showcase col-md-3">
                    <p className="title">iMac kaufen</p>
                    <p className="link">Jetzt einkaufen</p>
                    <p className="mac-mini">
                      <img
                        src="/images/design/mac-mini.png"
                        alt="Mac Computer kaufen"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </section>

        {/* title section  */}
        <div className="container titleContainer show-desktop show-ipad">
          <div className="row">
            <div className="col-lg-offset-0 col-sm-offset-1"></div>
            <div className="col-lg-8 col-sm-5">
              <p className="title">
                Smartphone, Tablet und Mac-Computer verkaufen
              </p>
              <p className="description">
                Verkaufen Sie Ihr gebrauchtes Gerät! Preis kalkulieren,
                kostenlos einsenden oder vorbeibringen, Express-Auszahlung
                erhalten!
              </p>
              <button
                type="button"
                className="btn btn-default section-button"
                style={{ fontSize: "14px" }}
              >
                jetzt verkaufen
              </button>
            </div>
            <div className="col-lg-4 col-sm-6">
              <img
                className="titlerightimg"
                src="/images/design/mob-tab.svg"
                alt="mob-tab"
              />
            </div>
          </div>
        </div>

        <div className="container title-mobile show-iMobile d-none">
          <div className="row">
            <div className="col-xs-12">
              <p className="title">
                Smartphone, Tablet und Mac-Computer verkaufen
              </p>
              <img
                className="titlerightimg"
                src="/images/design/mob-tab.png"
                width="170"
                alt="mob-tab"
              />
            </div>
          </div>

          <div className="row title-mobile__bg">
            <div className="col-xs-12">
              <p className="description">
                Verkaufen Sie Ihr gebrauchtes Gerät! Preis kalkulieren,
                kostenlos einsenden oder vorbeibringen, Express-Auszahlung
                erhalten!
              </p>
              <button
                type="button"
                className="btn btn-default section-button"
                style={{ fontSize: "14px" }}
              >
                Jetzt verkaufen
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Carousel */}
        {recommendations.length > 0 && (
          <div className="container-fluid UnsereAuswahlfürdichsection">
            <p className="firstpara">Das wird dir gefallen</p>
            <p className="secondpara">Unsere Auswahl für dich </p>
            <div className="container-fluid card-carousel-section">
              <OwlCarousel className="owl-theme" {...options}>
                {recommendations.map((item, i) => (
                  <div className="item cardSec" key={`cardSec-${i}`}>
                    <div className="row m-0">
                      <div className="col-md-8 col-sm-8 col-xs-8 cardPara">
                        <p className="cardParafi">{item.model}</p>
                        <p className="cardParas">{item.placeDescription}</p>
                        {item.discountPrice && (
                          <p className="cardParat">
                            {item.discountPrice} CHF{" "}
                            <span>{item.price} CHF</span>{" "}
                          </p>
                        )}
                        {item.discountPrice === false && (
                          <p className="cardParat">{item.price} CHF</p>
                        )}
                        <p className="cardParaf">
                          ab{" "}
                          {item.discountPrice
                            ? (item.discountPrice / 12).toFixed(2)
                            : (item.price / 12).toFixed(2)}{" "}
                          CHF/Monat
                        </p>
                      </div>
                      {item.discountPrice && (
                        <div className="col-md-4 col-sm-4 col-xs-4 cardhanger"></div>
                      )}
                    </div>
                    <img
                      className="cardBottomImage first-card-styling"
                      src={item.deviceImages.mainImg.src}
                      alt="mob-tab"
                    />
                  </div>
                ))}
              </OwlCarousel>
            </div>
          </div>
        )}

        {/*Show Numbers */}
        <Numbers />

        {/*Why we are different*/}
        <WhyWeAreDifferent />

        {/*How it works */}
        <div className="container-fluid howItWorks">
          <HowItWorks />
        </div>

        {/*customer about us */}
        <div className="container-fluid customersAboutUs">
          <CustomerAboutUs />
        </div>

        {/*our stores */}
        {domain === "ch" ||
          (domain === "loc" && (
            <div className="container-fluid ourStores">
              <OurStores />
            </div>
          ))}

        <div className="container-fluid banner-area">
          <Banner />
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {};
MainPage.defaultProps = {};

export default MainPage;

const TITLE_CH =
  "ᐅ Smartphone, Tablet und Mac-Computer per Knopfdruck kaufen und verkaufen auf remarket.ch";
const TITLE_DE =
  "Gebrauchte Smartphone, Tablets und Mac-Computer online kaufen und verkaufen";
const DESCRIPTION_CH =
  "Verkaufen und kaufen Sie Ihr neues und gebrauchtes iPhone, Samsung Galaxy, iPad, Macbook und iMac zu fairen Preisen. Express Auszahlung auch in der Filiale Basel möglich.";
const DESCRIPTION_DE =
  "Verkaufen und kaufen Sie neue und gebrauchte Tablets, Smartphones oder Macbooks schnell und unkompliziert auf remarket.de";
const FOOTER_SEO_CH = `<div>
        <h1>iPhone, Samsung Galaxy, iPad, MacBook gebraucht kaufen und verkaufen per Knopfdruck.</h1>
        <p>Viele elektronische Geräte wie <strong>Handys, Smartphones, Tablets oder Computer</strong> werden bereits nach kurzer Zeit der Nutzung durch neue Geräte ersetzt. Nicht selten landen die alten Geräte beim lokalen Entsorgungsbetrieb oder einfach in der Schublade oder im Schrank, sofern es sich um kleine Geräte wie beispielsweise <strong>Smartphones</strong> handelt. Dabei ist auch gebrauchte Elektronik noch sehr gefragt. Geräte wie das <strong>iPhone, iPad, ein Samsung Galaxy sowie tragbare Computer und Desktopcomputer</strong> können durchaus noch einiges an Geld bringen, wenn sie über Shops wie unserem angeboten und verkauft werden. Viele Menschen können sich neue Geräte namhafter Hersteller nicht leisten und greifen deshalb auf <strong>gebrauchte Geräte</strong> zurück. Anstatt nun eventuell defekte Geräte von Privatleuten ohne Garantie oder Sicherheit zu kaufen, sollten Sie gebrauchte und geprüfte <strong>Computer, Smartphones oder Tablets gebraucht und geprüft kaufen</strong>, die in zahlreichen Ausführungen auf unserer Homepage erhältlich sind. Die Geräte werden zu deutlich günstigeren Preisen als den ehemaligen Neupreisen angeboten, so dass sich noch jede Menge Geld sparen lässt.</p>
        <h2>Verkaufen Sie Ihre Elektronik, wenn Sie neue Geräte gekauft haben</h2>
        <p>Anstatt Ihr nicht mehr benötigtes Smartphone, Tablet oder ein Notebook im Schrank einstauben zu lassen, bieten Sie es doch einfach über unseren <strong>Onlineshop</strong> zum Verkauf an. Es funktioniert ganz einfach. Sie wählen einfach den entsprechenden Gerätetyp wie beispielsweise Ihr <strong>iPhone, MacBook oder den Apple Mac mini</strong> aus und machen weitere Angaben zu den Ausstattungsmerkmalen und den Zustand des Gerätes. Innerhalb weniger Minuten und mit nur <strong>wenigen Klicks</strong> ist der aktuelle Preis für das von Ihnen angebotene Gerät ermittelt. Sie wissen also sofort, was Sie bekommen. Einfacher geht es nicht. Der Versand ist auch unkompliziert, da Sie die Kosten dafür ersetzt bekommen. Wurde das Gerät durch uns überprüft, erhalten Sie Ihr <strong>Geld innerhalb kürzester Zeit</strong> ohne weitere Abzüge.</p>
        <h2>Möchten Sie ein gebrauchtes Smartphone oder Notebook kaufen?</h2>
        <p>Wenn Sie auf der Suche nach einem preisgünstigen <strong>iPhone, iPad, Samsung Galaxy</strong> oder einem anderen Mac-Computer sind, sollten Sie sich in unserem Onlineangebot umschauen. Sie bekommen zahlreiche Geräte namhafter Hersteller <strong>günstig gebraucht und geprüft</strong>. Falls doch etwas nicht in Ordnung sein sollte, nutzen Sie einfach die einjährige <strong>Garantie</strong>, die wir auf die Geräte aus unserem Angebot geben. Die Geräte werden <strong>versandkostenfrei</strong> an Sie geliefert.</p>
    </div>`;
const FOOTER_SEO_DE = `<div>
        <h1>So einfach kaufen und verkaufen Sie gebrauchte Elektronik</h1>
        <p>Der Handel mit gebrauchter Elektronik ist ein durchaus einträgliches Geschäft. <strong>Gebrauchte Elektronik</strong> ist sowohl bei den Verkäufern als auch bei den Käufern beliebt. Sicher besitzen Sie noch einige elektronische Geräte wie beispielsweise ein nicht mehr benötigtes Tablet, ein Smartphone oder vielleicht sogar ein Macbook. Warum sollten diese Geräte in einer Schublade ihr Dasein fristen, wenn Sie diese ebenso zu Geld machen könnten? Statt sich nun mit privaten Käufern herum zu ärgern, <strong>verkaufen Sie Ihr iPhone, iPad, MacBook</strong> oder Ihre anderen Geräte einfach über unsere Homepage. Wir sind auf den <strong>An- und Verkauf gebrauchter Elektronik</strong> spezialisiert. Wir bieten Ihnen einen einfachen und unkomplizierten Ablauf des Ankaufs an. Ebenso sind wir Ihr Ansprechpartner, möchten Sie bares Geld sparen und auf gebrauchte Elektronik statt entsprechender Neuwaren zurückgreifen. Ihre Vorteile durch den Kauf gebrauchter Elektronik in unserem Onlineshop sind vielfältig. Sie erhalten ausschließlich <strong>geprüfte Ware</strong> statt eventuell defekte Geräte, wie diese häufig von privaten Verkäufern unter Vorspiegelung falscher Tatsachen angeboten werden. Außerdem können Sie sich jederzeit an uns wenden, sollte etwas mit Ihrer Lieferung nicht stimmen.</p>
        <h2>Verkaufen Sie gebrauchte und nicht mehr benötigte Elektronik</h2>
        <p>Der Verkauf Ihrer gebrauchten Geräte über unsere Webseite ist sehr einfach für Sie. Sie wählen einfach das Gerät aus. Der spätere Versand erfolgt selbstverständlich <strong>kostenfrei</strong> für Sie. Nachdem Sie das entsprechende Gerät, beispielsweise ein <strong>iPhone</strong> oder Smartphone, ausgewählt haben, wählen Sie die Artikelmerkmale aus, die auf Ihr angebotenes Gerät am besten zutreffen. Die Berechnung des Verkaufspreises erfolgt mit nur wenigen Klicks, so dass Sie sofort wissen, was Ihr Gerät noch wert ist. Über den Versand müssen Sie sich keine Sorgen machen, da dieser für Sie <strong>gratis</strong> erfolgt. Auf Ihr Geld müssen Sie keineswegs lange warten. Die Zahlung des ermittelten Kaufbetrages erfolgt <strong>per Express</strong> und ohne weitere Abzüge an Sie.</p>
        <h2>Der Kauf gebrauchter und geprüfter Elektronik in unserem Onlineshop</h2>
        <p>Sind Sie auf der Suche nach einem preisgünstigen und <strong>gebrauchten Smartphone, MacBook, iMac, iPad</strong>, einem anderen Tablet oder tragbaren Computer, so sind Sie hier ebenfalls gut aufgehoben. Sie erhalten <strong>gebrauchte und geprüfte Elektronik</strong>, auf die wir eine <strong>einjährige Garantie</strong> geben. Sie gehen überhaupt kein Risiko ein, wenn Sie gebrauchte Elektronik über unseren Onlineshop kaufen. Der Versand erfolgt kostenlos, ebenso der Rückversand, sollte wider Erwarten etwas nicht mit dem neu erworbenen Gerät stimmen.</p>
    </div>`;
