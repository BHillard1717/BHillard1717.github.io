'use strict'

import { diffWords } from "https://cdn.skypack.dev/diff@5.1.0";
import gsap from "https://cdn.skypack.dev/gsap@3.10.4";
import { EventEmitter } from "https://cdn.skypack.dev/eventemitter3@4.0.7";

class Mutation {
  constructor(el, config) {
    this.event = new EventEmitter();
    this.el = el;
    this.opts = config;
    this.ANIMATION_COMPLETED = "ANIMATION_COMPLETED";
    this.originalBgColor = window.getComputedStyle(this.el).getPropertyValue("background-color");
    this.originalColor = window.getComputedStyle(this.el).getPropertyValue("color");
    this.addId = 0;
    this.addList = [];
    this.currentAdd = {};
    this.removeList = [];
    this.el.dataset.copy = this.el.textContent;
  }

  animate(copy, time) {
    gsap.killTweensOf(this.el);
    const diff = diffWords(this.el.dataset.copy, copy);
    this.el.innerHTML = "";

    diff.forEach((part) => {
      let behavior = "rewrite-normal";
      if (part.added) {
        behavior = "rewrite-added";
      } else if (part.removed) {
        behavior = "rewrite-removed";
      }

      const span = document.createElement("span");
      this.el.appendChild(span);
      span.dataset.copy = part.value;
      span.innerHTML = part.value;
      span.classList.add(behavior);

      if (part.added) {
        span.textContent = "";
        this.addList.push(span);
      }

      if (part.removed) {
        this.removeList.push(span);
      }
    });

    // delay on removal
    setTimeout(() => {
      this.transition(time);
    }, 400);
    this.el.dataset.copy = copy;
  }

  addChar(e) {
    const elem = e;
    if (elem.dataset.copy) {
      const t = elem.dataset.copy.charAt(0);
      const n = elem.textContent + t;

      elem.textContent = n;

      const a = elem.dataset.copy.substr(1);
      elem.dataset.copy = a;
      if (elem.dataset.copy) {
        this.addId = setTimeout(() => this.addChar(elem), this.opts.speed);
      }
    }
  }

  transition(time) {
    for (const span of this.removeList) {
      span.remove();
    }

    this.removeList = [];
    for (const span of this.addList) {
      this.addChar(span);
    }

    setTimeout(() => this.addCompleted(), 400);
    setTimeout(() => this.animationCompleted(), time);
  }

  addCompleted() {
    const elems = document.getElementsByClassName("rewrite-added");
    gsap.to(elems, 0.8, {
      backgroundColor: this.originalBgColor,
      color: this.originalColor,
      delay: 0.3
    });
  }

  animationCompleted() {
    this.addList = [];
    this.event.emit(this.ANIMATION_COMPLETED);
  }

  reset() {
    gsap.killTweensOf(this.el);
    clearTimeout(this.addId);
  }

  destroy() {
    gsap.killTweensOf(this.el);
    this.addId = 0;
  }
}

class Rewrite {
  constructor(element, data, config) {
    this.el = element;
    this.data = data;
    this.current = 0;

    this.mutation = new Mutation(this.el, config);
    this.mutation.event.on(this.mutation.ANIMATION_COMPLETED, () =>
      this.play()
    );
  }

  play() {
    this.mutation.animate(
      this.data[this.current].copy,
      this.data[this.current].time
    );
    this.current++;
    if (this.current >= this.data.length) this.current = 0;
  }

  reset() {
    this.mutation.reset();
    this.current = 0;
  }

  destroy() {
    this.current = 0;
    this.mutation.event.removeAllListeners();
  }
}

const data = [
  {
    time: 5000,
    copy:
      "AI, Fullstack, and Everything In Between"
  },
  {
    time: 5000,
    copy:
      "Data, Development, and Everything In Between"
  },
  {
    time: 5000,
    copy:
      "Apps, Architecture, and Everything In Between"
  },
  {
    time: 5000,
    copy:
      "Code, Design, and Everything In Between"
  }
];

const p1 = document.getElementById("shuffleMain");
const reversed = [...data].reverse();
const config1 = {
  speed: 75,
  interval: 2.0,
  delay: 2.0
};
const re1 = new Rewrite(p1, data, config1);
re1.play();

(function ($) {
  $(function () {

    

  });
})(jQuery);