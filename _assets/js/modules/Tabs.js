// Tab Components module
"use strict";

////////////////////
// Module Imports //
////////////////////

// import PubSub from "pubsub-js";
import Events from "Modules/Events";
import { indexOfNode } from "Modules/Utils";
 
//////////////////////
// Module Constants //
////////////////////// 

const selTabComponent = "[data-tabs=component]";
const selTabPanel = "[data-tabs=panel]";
const selTabControl = "[data-tabs=control]";
// const selTabControlCurrent = ".current[data-tabs=control]";
const selTabControlGlobal = "[data-tabs=component] [data-tabs=control]";
// const selTabAdvance = "[data-tabs=advance]";

// TODO: Add functionality to dynamically create tab controls
// const tabControlsContainerTemplate = `
//   <div class="cp_TabControls" data-tabs="controls">
//     <a class="tabAdvance--prev tabAdvance" href="#" data-tab-advance="p">Prev</a>
//     <a class="tabAdvance--next tabAdvance" href="#" data-tab-advance="n">Next</a>
//     <div class="tabs"></div>
//   </div>`; 
// const tabControlTemplate = `<a href="#" class="tabLink" data-tabs="control"></a>`;

////////////////////////////////
// Module Classes & Functions // 
////////////////////////////////

class TabbedContent {
  constructor(element) {
    this.component = element;
    this.config = JSON.parse(this.component.dataset.tabsConfig);
    this.tabControls = this.component.querySelectorAll(selTabControl);
    this.tabPanels = this.component.querySelectorAll(selTabPanel);
    this.currentIndex = 0;
    this.currentTab;

    this.bindCustomMessageEvents(); 
    this.setupTabs();
  }

  setupTabs() {
    if (this.config.build) {
      // TODO: Add functionality to build tab controls dynamically
    }

    this.tabPanels.item(this.currentIndex).classList.add('is_Current');
    this.tabControls.item(this.currentIndex).classList.add("is_Current");
  }

  updateCurrentTab(event) {
    const targetIndex = indexOfNode(event.target);

    this.tabPanels.item(this.currentIndex).classList.remove("is_Current");
    this.tabControls.item(this.currentIndex).classList.remove("is_Current");

    this.tabPanels.item(targetIndex).classList.add("is_Current");
    this.tabControls.item(targetIndex).classList.add("is_Current");

    this.currentIndex = targetIndex;
  }

  bindCustomMessageEvents() {
    this.component.addEventListener("selectTab", this.updateCurrentTab.bind(this));
  }
}

/**
 * delegateEvents - Create delegated event listeners for the components within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", selTabControlGlobal, "selectTab");
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents(); 

  // Find and initialise Show/Hide components using the ShowHide class
  const tabComponents = document.querySelectorAll(selTabComponent);

  tabComponents.forEach((element) => {
    const newTabbedContent = new TabbedContent(element);
  });
}

export default {
  initModule: initModule
};