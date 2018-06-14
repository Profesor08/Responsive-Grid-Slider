import "../css/main.scss";

import Slider from "./Slider";


new Slider("#slider-bootstrap-4", {
  speed: 0.5, // Animation speed in seconds [0 - Infinite].

  posOffset: -15, // used to move a little slides, when is used bootstrap 4 grid

  nextBtn: ".nav-next", // next button selector
  prevBtn: ".nav-prev", // prev button selector

  autoplay: { // autoplay configuration
    enabled: true, // is enabled
    interval: 1000, // interval between slides
    direction: "left", // direction [left, right]
  },

  ease: Power2.easeOut, // any gsap easing
});

new Slider("#slider-bootstrap-3", {
  speed: 1.5, // Animation speed in seconds [0 - Infinite].
  posOffset: -15, // used to move a little slides, when is used bootstrap 4 grid

  ease: Elastic.easeOut.config(1, 0.3),
});

new Slider("#foundation-6-example", {
  speed: 1.5,
  ease: Bounce.easeOut,
}).play({
  speed: .5,
  pauseOnMouseEnter: false,
});