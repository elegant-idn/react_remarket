import "core-js/es/";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";
import Media from "react-media";
import { initSimpleImg } from "react-simple-img";
import configureStore from "./store/configureStore";
import axios from "axios";
import "./helpers/helpersFunction";
import "./bootstrap";
import "./i18n";
import i18n from "i18next";

import * as basketActions from "./actions/basket";
import { loginSuccess } from "./actions/user";

import { getDecktopRoutes, getMobileRoutes } from "./routes/routes";
import "./sass/app.scss";

const store = configureStore();
const locationData = JSON.parse(window.localStorage.getItem("locationData"));
const basketData = JSON.parse(window.localStorage.getItem("basketData"));
const basketDataVerkaufen = JSON.parse(
  window.localStorage.getItem("basketDataVerkaufen")
);
const wishlisteData = JSON.parse(window.localStorage.getItem("wishlisteData"));
const shippingMethod = JSON.parse(
  window.localStorage.getItem("shippingMethod")
);
const token = window.localStorage.getItem("token");
window.maxWidthMobile = 480;
window.expireTimeWriteRating = 86400;
window.expireTimecookieBanner = 86400;
window.localStorage.setItem("mobileShowMenu", 0);
window.localStorage.setItem("mobileSearchBar", 0);
window.localStorage.setItem("devicesData", "");
window.localStorage.setItem("devicesForPurchase", "");
window.localStorage.setItem("devicesForPurchaseWithParams", "");

window.domainName = { name: "remarket.ch" };

//Smart react lazy load image with IntersectionObserver API
const config = {
  threshold: [0.1],
};
initSimpleImg(config);

const makeRender = () => {
  ReactDOM.render(
    // <React.Fragment>
    <Suspense fallback={null}>
      <Media
        query="(min-width: 1000px)"
        render={() => (
          <Provider store={store}>
            <Router
              onUpdate={() =>
                window.location.pathname != "/faq" && window.scrollTo(0, 0)
              }
              history={browserHistory}
            >
              {getDecktopRoutes(store, false)}
            </Router>
          </Provider>
        )}
      />
      <Media
        query="(min-width: 481px) and (max-width: 999px)"
        render={() => (
          <Provider store={store}>
            <Router
              onUpdate={() =>
                window.location.pathname != "/faq" && window.scrollTo(0, 0)
              }
              history={browserHistory}
            >
              {getDecktopRoutes(store, true)}
            </Router>
          </Provider>
        )}
      />
      <Media
        query="(max-width: 480px)"
        render={() => (
          <Provider store={store}>
            <Router
              onUpdate={() =>
                window.location.pathname != "/faq" && window.scrollTo(0, 0)
              }
              history={browserHistory}
            >
              {getMobileRoutes(store)}
            </Router>
          </Provider>
        )}
      />
      {/*</React.Fragment>,*/}
    </Suspense>,
    document.getElementById("root")
  );
};

//add current location in storage
//get locations from db
axios
  .get("/api/places")
  .then((response) => {
    if (response.status === 200) {
      //if localStorage empty
      const resArray = [];
      for (const [key, value] of Object.entries(response.data.data)) {
        resArray.push(value);
      }
      response.data.data = resArray;
      if (response.data.webshopDiscountData) {
        window.localStorage.setItem(
          "webshopDiscountData",
          JSON.stringify(response.data.webshopDiscountData)
        );
      }
      if (!locationData) {
        window.localStorage.setItem(
          "locationData",
          JSON.stringify(response.data)
        );
      } else {
        //if localStorage and data from db different
        if (locationData.data.length !== response.data.data.length) {
          window.localStorage.setItem(
            "locationData",
            JSON.stringify(response.data)
          );
        } else {
          if (
            !locationData.data.every((itemData) =>
              response.data.data.some(
                (itemData2) => itemData2.id == itemData.id
              )
            )
          ) {
            window.localStorage.setItem(
              "locationData",
              JSON.stringify(response.data)
            );
          }
        }
      }
    }
  })
  .finally(() => {
    let lang = window.localStorage.getItem("lang");
    if (typeof lang == "undefined" || !lang || lang == "") lang = "de";

    i18n.changeLanguage(lang);
    if (token) {
      axios
        .get(`/api/checkToken`)
        .then((resp) => {
          if (resp.status === 200) {
            store.dispatch(loginSuccess());
            makeRender();
            axios
              .get(`/api/customerAgileData`)
              .then((data) => {
                if (data.status === 200) {
                  store.dispatch(loginSuccess(data.data));
                }
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {
          if (error.response.status === 403 || error.response.status === 401) {
            window.localStorage.removeItem("token");
            makeRender();
          }
        });
    } else {
      makeRender();
    }
  });

if (basketData) {
  store.dispatch(basketActions.changeBasketData(basketData));
}
if (wishlisteData) {
  store.dispatch(basketActions.changeWishlisteData(wishlisteData));
}
if (basketDataVerkaufen) {
  store.dispatch(basketActions.changeBasketVerkaufenData(basketDataVerkaufen));
}
if (shippingMethod) {
  store.dispatch(basketActions.changeShippingMethod(shippingMethod));
}
