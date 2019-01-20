// Navigation Menu 

////////////////////
// Module Imports //
////////////////////

import PubSub from "pubsub-js";

import Events from "Modules/Events";

//////////////////////
// Module Constants //
//////////////////////

const selMainNav = "[data-main-nav=component]";
const selMainNavToggle = "[data-main-nav=toggle]";
const selMainNavToggleGlobal = "[data-main-nav=component] [data-main-nav=toggle]";
const selMainNavMenu = "[data-main-nav=menu]";
const selMainNavCloseGlobal = "[data-main-nav=component] [data-main-nav=close]";
const selMainNavSecondaryMenuContainer = ".cp_MainNav__secondaryMenu";
const selMainNavSecondaryItem = "li.secondary";
const menuShowHideTransitionTime = 350;


////////////////////////////////
// Module Classes & Functions //
////////////////////////////////


class MainNavToggle {
  constructor(element) {
    this.menuToggle = element;

    this.bindCustomMessageEvents();
    this.subscribeToEvents();
  }

  toggleMenu() {
    document.body.classList.toggle("nav_Visible");
  }

  openMenu() {}

  closeMenu() {}

  subscribeToEvents() {} 

  /**
   * Add event handler for main navigation toggle
   * @function
   */
  bindCustomMessageEvents() {
    this.menuToggle.addEventListener("toggleMainNav", this.toggleMenu.bind(this));
    this.menuToggle.addEventListener("openMainNav", this.openMenu.bind(this));
    this.menuToggle.addEventListener("closeMainNav", this.closeMenu.bind(this));
  }
}


function initialiseMainMenu() {
  const navToggle = document.querySelectorAll(selMainNavToggle);

  Array.prototype.forEach.call(navToggle, element => {
    const newMainNavToggle = new MainNavToggle(element);
  });
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", selMainNavToggle, "toggleMainNav");
}


/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();
  initialiseMainMenu();
}

export default { initModule: initModule };