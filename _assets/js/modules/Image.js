// Image Components module
"use strict";

////////////////////
// Module Imports //
////////////////////

import PubSub from "pubsub-js";
import imagesLoaded from "imagesloaded";

import Events from "Modules/Events";
import { isElementInView as inView } from "Modules/Utils";

//////////////////////
// Module Constants //
//////////////////////

// Selectors
const selSmartImage = "[data-image-load]";
const selClickToLoadSmartImage = "[data-image-load=click] img.placeholder";
const selPlaceholderImage = "img";

// Classes
const imageLoadingClass = "ob_Media--loading";
const imageLoadedClass = "ob_Media--loaded";
const imageDisplayedClass = "ob_Media--displayed";
const imageFlexClass = "ob_Media--flex";
const imageHiddenClass = "ob_Media--isHidden";

// Image Observer
const observerOptions  = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

let imageObserver;

////////////////////////////////
// Module Classes & Functions //
////////////////////////////////

/**
 * SmartImage - Class representing a Smart Image component that loads optimised images based on screen size
 */
class SmartImage {
  constructor(element) {
    // Set properties
    this.smartImageElem = element;
    this.placeholderImage = this.smartImageElem.querySelector(selPlaceholderImage);
    this.loadingMethod = this.smartImageElem.dataset.imageLoad;
    this.config = JSON.parse(this.smartImageElem.dataset.imageConfig);
    this.imageType = this.config.type || false;
    this.imageReloader = this.config.reload || false;
    this.imageTargetSel = this.smartImageElem.dataset.imageTarget || null;
    this.imageLoaded = false;
    this.imageToAdd = document.createElement("img");
    this.srcSet = JSON.parse(this.smartImageElem.dataset.srcSet) || {};

    // Add Image Element to observer
    if(this.loadingMethod === 'view') {
      if (typeof (window.IntersectionObserver) !== 'undefined') {
        imageObserver.observe(this.smartImageElem);
      }
    }

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();

    if (this.loadingMethod === "pageload") {
      this.getImageFile();
    } else if (this.loadingMethod === "view") {
      this.loadImageIfInView();
    }
  }

  /**
   * calculateImageBreakpointToUse - Description
   *
   * @returns {string} Description
   */
  calculateImageBreakpointToUse() {
    const pageWidth = window.innerWidth;
    let imageSrcKey = "max";

    for (let key in this.srcSet) {
      if (this.srcSet.hasOwnProperty(key)) {
        // If the current key is not 'max' check that the page width is less than it,
        // and it is less than the current value for imageSrcKey
        if (key !== "max") {
          // If imageSrcKey is not set to 'max' check if the key
          // is greater or equal than the page width and also if it
          // is less than the current value of imageSrcKey
          if (imageSrcKey !== "max") {
            if (parseInt(key) >= pageWidth && parseInt(key) < imageSrcKey) {
              imageSrcKey = key;
            }
          } else {
            // If imageSrcKey is still set to 'max' just check if the key
            // is greater or equal than the page width
            if (parseInt(key) > pageWidth) {
              imageSrcKey = key;
            }
          }
        }
      }
    }

    return imageSrcKey;
  }

  /**
   * updateImageAttributes - Description
   *
   * @param {Element} image <img> html element
   *
   */
  updateImageAttributes(image) {
    const imageAlt = this.smartImageElem.dataset.alt || "image";
    const imageWidth = this.smartImageElem.dataset.width;
    const imageClass = this.smartImageElem.dataset.class;

    if (imageAlt.length > 0) {
      image.alt = imageAlt;
    }

    if (imageWidth) {
      image.width = imageWidth;
    }

    if (imageClass) {
      image.classList.add(imageClass);
    }
  }

  /**
   * displayImageInContainer - Description
   *
   */
  displayImageInContainer() {
    // Add 'loading' class to SmartImage container
    this.smartImageElem.classList.add(imageLoadingClass);

    if (this.placeholderImage) {
      this.placeholderImage.src = this.imageToAdd.src;
      this.placeholderImage.classList.remove("placeholder");
      this.placeholderImage.removeAttribute("width");
      this.placeholderImage.removeAttribute("height");

      this.updateImageAttributes(this.placeholderImage);
    } else {
      this.updateImageAttributes(this.imageToAdd);

      if (this.imageTargetSel !== null) {
        //this.smartImageElem.parent().find(imageTargetSel).eq(0).append(this.imageToAdd);
      } else {
        this.smartImageElem.insertBefore(this.imageToAdd, null);
      }
      this.placeholderImage = this.imageToAdd;
    }

    this.smartImageElem.classList.add(imageLoadedClass);
    // Need to allow browser a moment to process the addition of the image before displaying it
    window.setTimeout(() => {
      this.smartImageElem.classList.add(imageDisplayedClass);
      PubSub.publish("content/update");
    }, 50);

    this.imageLoaded = true;
    imageObserver.unobserve(this.smartImageElem);
  }

  /**
   * displayImageAsBackground - Description
   *
   * @param {string} path Description
   *
   */
  displayImageAsBackground(path) {
    const smartImage = "url(" + path + ")";
    const imageBackgroundPos = this.smartImageElem.dataset.position;
    const imageBackgroundColor = this.smartImageElem.dataset.backgroundColor;

    this.smartImageElem.classList.add(imageLoadedClass);
    this.smartImageElem.style.backgroundImage = smartImage;
    this.smartImageElem.classList.add(imageBackgroundPos);
    this.smartImageElem.style.backgroundColor = imageBackgroundColor;

    window.setTimeout(() => {
      this.smartImageElem.classList.add(imageDisplayedClass);
      PubSub.publish(Events.messages.contentChange);
    }, 50);

    this.imageLoaded = true;
    imageObserver.unobserve(this.smartImageElem);
  }

  /**
   * getImageFile - Description
   *
   */
  getImageFile() {
    const thisImageUrl = this.srcSet[this.calculateImageBreakpointToUse()];

    //Site.utils.cl("image url: " + thisImageUrl);

    if (thisImageUrl !== "none") {
      this.smartImageElem.classList.remove("is_Hidden");
      this.imageToAdd.src = thisImageUrl;

      const imageLoader = imagesLoaded(this.imageToAdd);

      if (this.imageType === "inline") {
        imageLoader.on("done", () => {
          this.smartImageElem.classList.remove(imageLoadingClass);
          this.displayImageInContainer(this.imageToAdd);
        });
      } else if (this.imageType === "background") {
        // The imagesLoaded function is called for image we want to load.
        // There is no initial callback because everything we want to do can wait
        // until the image is fully downloaded.
        imageLoader.on("done", () => {
          this.smartImageElem.classList.add(imageFlexClass);
          this.displayImageAsBackground(thisImageUrl);
        });
      }
    } else {
      this.smartImageElem.classList.add(imageHiddenClass);
    }

    PubSub.publish(Events.messages.imageLoaded);
    PubSub.publish(Events.messages.layoutChange);
  }

  /**
   * Load and display a smart image - use this when being in view doesn't matter
   */
  loadImage() {
    if (this.imageType === "inline") {
      if (this.imageLoaded === false || this.imageReloader === true) {
        this.getImageFile(this.smartImageElem);
      }
    } else if (this.imageType === "background") {
      this.smartImageElem.classList.add(imageFlexClass);
      if (this.imageLoaded === false || this.imageReloader === true) {
        this.getImageFile(this.smartImageElem);
      }
    }
  }

  /**
   * loadImageIfInView - Check if
   */
  loadImageIfInView() {
    let component = this.smartImageElem;

    if (this.imageType === "background") {
      component = component.parentNode;
    }

    if ( inView(component) && (this.imageLoaded === false || this.imageReloader === true)) {
      this.getImageFile(this.smartImageElem);
    }
  }

  /**
   * loadSmartImage - Description
   *
   * @param {event} e Description
   */
  loadSmartImage(e) {
    e.preventDefault();

    if (this.imageLoaded === false) {
      this.loadImageIfInView(this.smartImageElem);
    }
  }

  /**
   * reloadImage - Description
   *
   * @param {event} e Description
   */
  reloadImage(e) {
    e.preventDefault();

    if (this.imageLoaded === true && this.imageReloader === true) {
      this.getImageFile();
    }
  }

  /**
   * loadSmartImageOnClick - Description
   *
   * @param {event} e Description
   */
  loadSmartImageOnClick(e) { 
    e.preventDefault();

    if (this.imageLoaded === false) {
      this.loadImage(this.smartImageElem);
    }
  }

  /**
   * bindCustomMessageEvents - Binds custom event listeners to the Smart Image DOM Element
   *
   */
  bindCustomMessageEvents() {
    this.smartImageElem.addEventListener(
      "siLoad",
      this.loadSmartImage.bind(this)
    );

    this.smartImageElem.addEventListener(
      "imageInView",
      this.loadSmartImage.bind(this)
    );
    
    this.smartImageElem.addEventListener(
      "siReload",
      this.reloadImage.bind(this)
    );

    this.smartImageElem.addEventListener(
      "siClickLoad",
      this.loadSmartImageOnClick.bind(this)
    );
  }

  /**
   * subscribeToEvents - Subscribes the component to global messages and sets the component's responses via internal custom events
   *
   */
  subscribeToEvents() {
    if (this.loadingMethod === "view") {     
      // Fallback to scroll event detection if browser doesn't support IntersectionObserver
      if (typeof(window.IntersectionObserver) === 'undefined') {
        // PubSub.subscribe(Events.messages.scroll, () => {
        //   this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
        // }); 
      }
      
      PubSub.subscribe(Events.messages.load, () => {
        this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
      });

      PubSub.subscribe(Events.messages.layoutChange, () => {
        this.smartImageElem.dispatchEvent(Events.createCustomEvent("siLoad"));
      });
    }

    PubSub.subscribe(Events.messages.resize, () => {
      this.smartImageElem.dispatchEvent(Events.createCustomEvent("siReload"));
    });

    PubSub.subscribe(Events.messages.breakChange, () => {
      this.smartImageElem.dispatchEvent(Events.createCustomEvent("siReload"));
    });
  }
}


class SmartImageFactory {
  constructor () {
    this.subscribeToEvents();
  }

  createNewSmartImageObjects (data) {
    const smartImages = data.querySelectorAll(selSmartImage);
    Array.prototype.forEach.call(smartImages, element => {
      const newSmartImage = new SmartImage(element);
    });
  }

  displaySmartImages () {
    
  }

  subscribeToEvents () {
    // On a content change, the newly-added elements are passed as parameters to a function
    // that finds any smartImages and initialises controlling objects for each
    PubSub.subscribe(Events.messages.contentChange, (topic, data) => {
      this.createNewSmartImageObjects(data);
    });

    PubSub.subscribe(Events.messages.contentDisplayed, (topic, data) => {
      this.displaySmartImages(data);
    });
  } 
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", selClickToLoadSmartImage, "siClickLoad");
}


function initialiseSmartImages() {
  const smartImages = document.querySelectorAll(selSmartImage);

  smartImages.forEach(element => {
    const newSmartImage = new SmartImage(element);
  });

  const newSmartImageFactory = new SmartImageFactory();
}

function handleIntersection (entries, observer) {
  entries.forEach(function(entry) {
    if (entry.intersectionRatio > 0) {
      entry.target.dispatchEvent(Events.createCustomEvent("imageInView"));
    }
  });
}

function initialiseImageObserver() { 
  if (typeof (window.IntersectionObserver) !== 'undefined') {
    imageObserver = new IntersectionObserver(handleIntersection, observerOptions);
  }  
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Initialise an observer object to detect when smart image elements are in view
  initialiseImageObserver();

  // Find and initialise Show/Hide components using the ShowHide class
  initialiseSmartImages(); 

}

export default { initModule: initModule };
