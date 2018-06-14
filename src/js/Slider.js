import {TweenLite} from "gsap";
import Hammer from "hammerjs";


export default function ResponsiveGridSlider(el, args) {

  // default configuration
  let defaults = {
    speed: 0.5, // Animation speed in seconds [0 - Infinite].

    posOffset: 0, // used to move a little slides, when is used bootstrap 4 grid

    nextBtn: ".nav-next", // next button selector
    prevBtn: ".nav-prev", // prev button selector

    autoplay: { // autoplay configuration
      enabled: false, // is enabled
      interval: 3000, // interval between slides
      direction: "left", // direction [left, right]
    },

    pauseOnMouseEnter: true,

    ease: Power2.easeOut // any gsap easing
  };

  let config = Object.assign({}, defaults, args || {});

  if (typeof el === "string") {
    el = document.querySelector(el);
  }

  if (el === null) {
    throw new Error("Slider container not found!");
  }

  /**
   * @type []
   */
  let slides = Array.from(el.querySelectorAll(".slide-cell"));

  /**
   * Initialization of required params user for slide animation
   */
  for (let i = 0; i < slides.length; i++) {
    slides[i].currentX = 0;
    slides[i].targetX = 0;
  }

  /**
   * Slider row container
   * @type HTMLElement
   */
  let row = el.querySelector(".slider-row");

  /**
   * Useful flags for slider needs
   * @type {{panStart: boolean, canSlide: *, animationBlock: number, direction: string}}
   */
  let flags = {
    panStart: false,
    canSlide: canSlide(),
    animationBlock: 0,
    direction: ""
  };

  /**
   * Position of first visible slide 0...
   * @type {number}
   */
  let offset = 0;

  let leftHidden = [];
  let rightHidden = [];

  let autoPlayTimeout = null;

  /**
   * Initialize slider autoplay
   */
  function initAutoplay() {
    if (config.autoplay.enabled === true) {
      play();
    }
  }

  /**
   * Start autoplay
   * @param args - new config for slider, if required
   */
  function play(args) {

    config = Object.assign({}, config, args || {});

    clearTimeout(autoPlayTimeout);
    config.autoplay.enabled = true;

    autoPlayTimeout = setTimeout(function () {
      if (config.autoplay.direction === "left") {
        next();
      }
      else if (config.autoplay.direction === "right") {
        prev();
      }

      play();

    }, config.autoplay.interval);

    fireEvent("play");
  }

  /**
   * Pause autoplay
   */
  function pause() {
    clearTimeout(autoPlayTimeout);
    fireEvent("pause");
  }

  /**
   * Stop autoplay
   */
  function stop() {
    clearTimeout(autoPlayTimeout);
    config.autoplay.enabled = false;
    fireEvent("stop");
  }

  // Pause autoplay on mouseenter
  el.addEventListener("mouseenter", function () {
    if (config.pauseOnMouseEnter === true && config.autoplay.enabled === true) {
      pause();
    }
  });

  // Resume autoplay on mouseleave
  el.addEventListener("mouseleave", function () {
    if (config.pauseOnMouseEnter === true && config.autoplay.enabled === true) {
      play();
    }
  });

  /**
   * Slider events
   * @type {{next: Array, prev: Array, resize: Array, resized: Array, refresh: Array, refreshed: Array, drag: Array, dragged: Array, translate: Array, translated: Array, change: Array, changed: Array, to: Array, play: Array, stop: Array, pause: Array}}
   */
  let events = {
    next: [],
    prev: [],
    resize: [],
    resized: [],
    refresh: [],
    refreshed: [],
    drag: [],
    dragged: [],
    translate: [],
    translated: [],
    change: [],
    changed: [],
    to: [],
    play: [],
    stop: [],
    pause: [],
  };

  on("resize refresh drag translate", function () {
    fireEvent("change");
  });

  on("next prev resized refreshed dragged translated to", function () {
    fireEvent("changed");
  });

  initControls();
  organizeSlides(true);

  initAutoplay();

  /**
   * Reorganization of slides after window resized
   */
  window.addEventListener("resize", function () {
    fireEvent("resize");
    organizeSlides(true);
    fireEvent("resized");
  });

  /**
   * touch actions
   * @type {Hammer}
   */
  let mc = new Hammer(el);

  mc.on("panstart", function (e) {
    flags.panStart = true;
  });

  mc.on("panend", function (e) {
    flags.panStart = false;
  });

  mc.on("panleft panright", function (e) {

  });

  /**
   * Event binding
   * @param event
   * @param callback
   */
  function on(event, callback) {
    event.split(/\s+/).forEach(event => {
      if (events.hasOwnProperty(event)) {
        events[event].push(callback);
      }
    })
  }

  /**
   * Event caller
   * @param event
   */
  function fireEvent(event) {
    if (events.hasOwnProperty(event)) {
      events[event].forEach(function (callback) {
        if (callback instanceof Function) {
          callback();
        }
      });
    }
  }

  /**
   * Slide to next
   */
  function next() {
    if (flags.canSlide && !flags.animationBlock) {
      flags.direction = "next";
      incOffset();
      organizeSlides();
      fireEvent("next");
    }
  }

  /**
   * Slide to previous
   */
  function prev() {
    if (flags.canSlide && !flags.animationBlock) {
      flags.direction = "prev";
      decOffset();
      organizeSlides();
      fireEvent("prev");
    }
  }

  /**
   * Slide to specific slide
   * @param id
   */
  function to(id) {
    if (id >= 0 && id <= slides.length) {
      if (flags.canSlide && !flags.animationBlock) {
        offset = id;
        organizeSlides();
        fireEvent("to");
      }
    }
  }

  /**
   * Initialization of controls
   */
  function initControls() {
    let navPrev = el.querySelector(config.prevBtn);
    let navNext = el.querySelector(config.nextBtn);

    if (navPrev !== null) {
      navPrev.addEventListener("click", function () {
        prev();
      });
    }

    if (navNext !== null) {
      navNext.addEventListener("click", function () {
        next();
      });
    }
  }

  /**
   * Offset increment
   */
  function incOffset() {
    offset = getNextOffset(offset);
  }

  /**
   * Offset decrement
   */
  function decOffset() {
    offset = getPrevOffset(offset);
  }

  /**
   * Get previous slide offset
   * @param offset
   * @return {*}
   */
  function getPrevOffset(offset) {
    if (offset > 0) {
      offset--;
    }
    else {
      offset = slides.length - 1;
    }

    return offset;
  }

  /**
   * Get next slide offset
   * @param offset
   * @return {*}
   */
  function getNextOffset(offset) {
    if (offset < slides.length - 1) {
      offset++;
    }
    else {
      offset = 0;
    }

    return offset;
  }

  /**
   * Organisation of slides
   * @param instant - true if need to move without animation, default false
   */
  function organizeSlides(instant = false) {
    if (flags.canSlide === false) {
      reset();
      return;
    }

    fireEvent("translate");

    // Moving visible slides
    let lastSlideOffset = 0;
    let deltaWidth = row.offsetWidth;
    let x = 0;
    let hiddenSlides = [];

    // handle first slide disappearing when is just only one slide is hidden
    if (flags.direction === "prev" && leftHidden.length === 0 && rightHidden.length > 0) {
      move(rightHidden[0], -rightHidden[0].offsetWidth, true);
    }

    for (let i = offset, j = 0; j < slides.length; i++, j++) {
      if (deltaWidth > 0) {
        move(slides[i], x, instant);
        deltaWidth -= slides[i].offsetWidth;
        x += slides[i].offsetWidth;
        lastSlideOffset = i;
      }
      else {
        hiddenSlides.push(slides[i]);
      }

      if (i === slides.length - 1) {
        i = -1;
      }
    }

    leftHidden = [];
    rightHidden = [];

    for (let i = 0; i < hiddenSlides.length; i++) {
      if (i < hiddenSlides.length / 2) {
        rightHidden.push(hiddenSlides[i]);
      }
      else {
        leftHidden.push(hiddenSlides[i]);
      }
    }

    if (rightHidden.length > 0) {
      if (flags.direction === "next") {
        if (leftHidden.length === 0) {
          move(rightHidden[0], -rightHidden[0].offsetWidth, instant, function () {
            move(rightHidden[0], row.offsetWidth + Math.abs(deltaWidth), true);
          });
        }
        else {
          move(rightHidden[0], row.offsetWidth + Math.abs(deltaWidth), true);
        }
      }
      else {
        move(rightHidden[0], row.offsetWidth + Math.abs(deltaWidth), instant);
      }
    }

    if (leftHidden.length > 0) {
      if (flags.direction === "prev") {
        move(leftHidden[leftHidden.length - 1], -leftHidden[leftHidden.length - 1].offsetWidth, true);
      }
      else {
        move(leftHidden[leftHidden.length - 1], -leftHidden[leftHidden.length - 1].offsetWidth, instant);
      }
    }

    if (rightHidden.length > 0) {
      for (let i = 1, x = row.offsetWidth + Math.abs(deltaWidth) + rightHidden[0].offsetWidth; i < rightHidden.length; i++) {
        let slide = rightHidden[i];
        move(slide, x, true);
        x += slide.offsetWidth;
      }
    }

    for (let i = 0, x = 0; i < leftHidden.length - 1; i++) {
      let slide = leftHidden[i];
      x -= slide.offsetWidth;
      move(slide, x, true);
    }
  }

  /**
   * Moving slide
   * @param slide
   * @param x
   * @param instant
   * @param callback
   */
  function move(slide, x, instant = false, callback) {

    if (instant === true) {
      TweenLite.set(slide, {
        x: -slide.offsetLeft + x + config.posOffset,
        currentX: -slide.offsetLeft + x + config.posOffset
      });

      if (callback instanceof Function) {
        callback();
      }
    }
    else {
      flags.animationBlock++;

      TweenLite.fromTo(slide, config.speed, {
        x: slide.currentX,
        currentX: slide.currentX
      }, {
        x: -slide.offsetLeft + x + config.posOffset,
        currentX: -slide.offsetLeft + x + config.posOffset,
        ease: config.ease,
        onComplete: function () {
          flags.animationBlock--;

          if (flags.animationBlock === 0) {
            fireEvent("translated");
          }

          if (callback instanceof Function) {
            callback();
          }
        }
      });
    }
  }

  /**
   * Resets slides position to their default
   */
  function reset() {
    for (let i = 0; i < slides.length; i++) {
      TweenLite.set(slides[i], {
        x: 0,
        currentX: 0
      });
    }
  }

  /**
   * Checks if slider can slide
   * @return {boolean}
   */
  function canSlide() {
    let deltaWidth = row.offsetWidth;

    for (let i = 0; i < slides.length; i++) {
      deltaWidth -= slides[i].offsetWidth;
    }

    return deltaWidth < 0;
  }

  /**
   * Reorganize slides
   */
  function refresh() {
    fireEvent("refresh");
    organizeSlides();
    fireEvent("refreshed");
  }

  /**
   * Slider ticker, user to calculate "canSlide" in real time
   */
  function animate() {
    requestAnimationFrame(animate);

    flags.canSlide = canSlide();
  }

  requestAnimationFrame(animate);

  /**
   * Export functions to public to control slider
   */
  return {
    next: next,
    prev: prev,
    to: to,
    on: on,
    refresh: refresh,
    play: play,
    pause: pause,
    stop: stop
  };
}