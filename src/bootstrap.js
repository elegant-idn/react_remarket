/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

try {
  window.$ = window.jQuery = require("jquery");
  var bootstrap = require("bootstrap-sass/assets/javascripts/bootstrap.min.js");
} catch (e) {}

window.axios = require("axios");

/**
 * If we are working on localhost,
 * axios.defaults.baseURL = 'https//remarket2.loc';
 * else
 * axios.defaults.baseURL = 'https://www.remarket.ch';
 */
// axios.defaults.baseURL = 'https://www.remarket.ch';

// window.axios.defaults.headers.common["X-CSRF-TOKEN"] = window.Laravel.csrfToken;
axios.defaults.baseURL = "https://v2.remarket.ch";
if (window.localStorage.getItem("token")) {
  window.axios.defaults.headers.common["Authorization-Token"] =
    window.localStorage.getItem("token");
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

/**String.includes for iOS 8.x*/
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    "use strict";
    if (typeof start !== "number") {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
