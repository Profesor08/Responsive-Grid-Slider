// import {TimelineMax} from "gsap";
import Hammer from "hammerjs";
// import PubSub from "pubsub-js";


export default function ResponsiveGridSlider(el, args) {

  let defaults = {
    speed: .1
  };
  let config = Object.assign({}, defaults, args || {});

  if (typeof el === "string") {
    el = document.querySelector(el);
  }

  if (el === null) {
    throw new Error("Slider container not found!");
  }

  let slides = Array.from(el.querySelectorAll(".slide-cell"));
  let row = el.querySelector(".slider-row");

  let offset = 0;
  let isAnimating = false;
  let needResize = true;
  let flagCanSlide = canSlide();
  let direction = null;
  let startMoving = false;
  let panOffset = 70;

  let events = {
    next: [],
    prev: [],
    animationEnd: [],
    animationNextEnd: [],
    animationPrevEnd: [],
  };

  let mc = new Hammer(el);

  mc.on("panstart", function (e) {
    startMoving = true;
  });

  mc.on("panend", function (e) {
    if (isAnimating === false || (isAnimating === true && startMoving === true)) {
      isAnimating = false;

      if (Math.abs(moveDelta) < panOffset) {
        reset();
      }
      else if (moveDelta > 0) {
        prev();
      }
      else if (moveDelta < 0) {
        next();
      }
    }

    startMoving = false;
  });

  let moveDelta = 0;

  mc.on("panleft panright", function (e) {
    if ((Math.abs(e.deltaX) > Math.abs(e.deltaY)) && (isAnimating === false && flagCanSlide === true) && startMoving === true) {
      e.preventDefault();
      isAnimating = true;

      let prevOffset = getPrevOffset(offset);
      let pos = -slides[prevOffset].offsetWidth;
      let deltaRow = row.offsetWidth + slides[offset].offsetWidth + slides[prevOffset].offsetWidth;
      moveDelta = e.deltaX / 2;

      // if (moveDelta > 0) {
      //   moveDelta = constrain(moveDelta, 0, slides[prevOffset].offsetWidth / 2);
      // }
      // else {
      //   moveDelta = constrain(moveDelta, -slides[offset].offsetWidth / 2, 0);
      // }

      for (let i = prevOffset; i < slides.length && deltaRow > 0; i++) {
        setPosition(slides[i], pos + moveDelta, 0);
        pos += slides[i].offsetWidth;
        deltaRow -= slides[i].offsetWidth;

        if (i === slides.length - 1 && deltaRow > 0) {
          i = -1;
        }
      }
    }
  });

  organizeSlides();
  initControls();
  resize();

  function organizeSlides() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].x = 0;
      slides[i].currentX = 0;
    }
  }


  function initControls() {
    let navPrev = el.querySelector(".nav-prev");
    let navNext = el.querySelector(".nav-next");

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

  function incOffset() {
    offset = getNextOffset(offset);
  }

  function decOffset() {
    offset = getPrevOffset(offset);
  }

  function getPrevOffset(offset) {
    if (offset > 0) {
      offset--;
    }
    else {
      offset = slides.length - 1;
    }

    return offset;
  }

  function getNextOffset(offset) {
    if (offset < slides.length - 1) {
      offset++;
    }
    else {
      offset = 0;
    }

    return offset;
  }

  function setPosition(slide, x, amount) {
    slide.currentX = -slide.offsetLeft + x + amount;
    slide.x = -slide.offsetLeft + x;
  }

  function reset() {
    isAnimating = true;

    let prevOffset = getPrevOffset(offset);
    let pos = -slides[prevOffset].offsetWidth;
    let deltaRow = row.offsetWidth + slides[offset].offsetWidth + slides[prevOffset].offsetWidth;

    for (let i = prevOffset; i < slides.length && deltaRow > 0; i++) {
      setPosition(slides[i], pos , moveDelta);
      pos += slides[i].offsetWidth;
      deltaRow -= slides[i].offsetWidth;

      if (i === slides.length - 1 && deltaRow > 0) {
        i = -1;
      }
    }
  }

  function next() {
    if (isAnimating === false && flagCanSlide === true) {
      isAnimating = true;
      fireEvent("next");

      let pos = -slides[offset].offsetWidth;
      let deltaRow = row.offsetWidth + slides[offset].offsetWidth;
      let moveAmount = slides[offset].offsetWidth + moveDelta;

      for (let i = 0; i < slides.length; i++) {
        setPosition(slides[i], -9999, 0);
      }

      for (let i = offset; i < slides.length && deltaRow > 0; i++) {
        setPosition(slides[i], pos, moveAmount);
        pos += slides[i].offsetWidth;
        deltaRow -= slides[i].offsetWidth;

        if (i === slides.length - 1 && deltaRow > 0) {
          i = -1;
        }
      }

      moveDelta = 0;

      incOffset();
    }
  }

  function prev() {
    if (isAnimating === false && flagCanSlide === true) {
      isAnimating = true;
      fireEvent("prev");

      let prevOffset = getPrevOffset(offset);
      let pos = 0;
      let deltaRow = row.offsetWidth + slides[prevOffset].offsetWidth;
      let moveAmount = -slides[prevOffset].offsetWidth + moveDelta;

      for (let i = 0; i < slides.length; i++) {
        setPosition(slides[i], -9999, 0);
      }

      for (let i = prevOffset; i < slides.length && deltaRow > 0; i++) {
        setPosition(slides[i], pos, moveAmount);
        pos += slides[i].offsetWidth;
        deltaRow -= slides[i].offsetWidth;

        if (i === slides.length - 1 && deltaRow > 0) {
          i = -1;
        }
      }

      moveDelta = 0;

      decOffset();
    }
  }

  function resize() {
    let pos = 0;
    let deltaRow = row.offsetWidth + slides[offset].offsetWidth;

    needResize = true;

    for (let i = 0; i < slides.length; i++) {
      setPosition(slides[i], -9999, 0);
    }

    for (let i = offset; i < slides.length && deltaRow > 0; i++) {
      setPosition(slides[i], pos, 0);
      pos += slides[i].offsetWidth;
      deltaRow -= slides[i].offsetWidth;

      if (i === slides.length - 1 && deltaRow > 0) {
        i = -1;
      }
    }
  }

  function canSlide() {
    let deltaWidth = row.offsetWidth;

    for (let i = 0; i < slides.length; i++) {
      deltaWidth -= slides[i].offsetWidth;
    }

    return deltaWidth < 0;
  }

  window.addEventListener("resize", resize);

  on("next", function () {
    direction = "next";
  });

  on("prev", function () {
    direction = "prev";
  });

  on("animationNextEnd", function () {

  });

  on("animationPrevEnd", function () {

  });

  function to(id) {

  }

  function normalize(value, from, to) {
    return (value - from) / (to - from);
  }

  function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
  }

  function fireEvent(event) {
    if (events.hasOwnProperty(event)) {
      events[event].forEach(function (callback) {
        callback();
      });
    }
  }

  function on(event, callback) {
    if (events.hasOwnProperty(event)) {
      events[event].push(callback);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    panOffset = window.innerWidth <= 768 ? 45 : 70;

    flagCanSlide = canSlide();

    let animationElementsCount = slides.length;

    if ((isAnimating === true || needResize === true) && flagCanSlide === true) {
      for (let i = 0; i < slides.length; i++) {
        let slide = slides[i];

        slide.currentX += (slide.x - slide.currentX) * config.speed;

        if (Math.abs(slide.x - slide.currentX) < .5) {
          slide.currentX = slide.x;

          if (needResize !== true) {
            animationElementsCount--;
          }
        }

        slide.style.transform = `matrix(1, 0, 0, 1, ${slide.currentX}, 0)`;
      }

      if (needResize === true) {
        needResize = false;
      }
    }

    if (flagCanSlide === false) {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
      }
    }

    if (animationElementsCount === 0) {
      isAnimating = false;
      fireEvent("animationEnd");

      if (direction === "next") {
        fireEvent("animationNextEnd");
      }
      else if (direction === "prev") {
        fireEvent("animationPrevEnd");
      }
    }
  }

  requestAnimationFrame(animate);

  return {
    next: next,
    prev: prev,
    to: to,
    on: on
  };
}