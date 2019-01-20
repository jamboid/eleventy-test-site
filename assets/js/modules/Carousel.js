// Base Carousel module
"use strict";


import PubSub from "pubsub-js";
import Events from "Modules/Events";

const selComponent = "[data-carousel=component]";


/**
 * Carousel - Description
 */
class Carousel {
  constructor(element) {
    this.compDOMElement = element;
  }

  bindCustomMessageEvents() {
    this.compDOMElement.addEventListener('toggleShowHide', this.toggleControl.bind(this));
  }
}


/**
 * Fader - Description
 * @extends Carousel
 */
export class Fader extends Carousel {
  constructor(element) {
    super(element);
  }
}

/**
 * Scroller - Description
 * @extends Carousel
 */
export class Scroller extends Carousel {
  constructor(element) {
    super(element);
  }
}
