"use strict";

//import "../scss/screen.scss";
import { ready, wrapElement } from "Modules/Utils";
import { initModule as initShowhide } from "Modules/Showhide";
import { initModule as initEvents } from "Modules/Events";
import { initModule as initModal } from "Modules/Modal";
import { initModule as initImage } from "Modules/Image";
import { initModule as initVideo } from "Modules/Video";
import { initModule as initNav } from "Modules/Navigation";
import { initModule as initTabs } from "Modules/Tabs";

/**
 * initialiseComponentModules - call module init functions
 *
 * @returns {type} Description
 */ 
function initialiseComponentModules() {
  initEvents();
  initNav(); 
  initShowhide(); 
  initImage();
  initModal();
  initVideo();
  initTabs();

  setTimeout(() => {
    Prism.highlightAll();
  }, 0);

  // Wrap tables in container to allow overflow scroll
  // This is a small enough bit of functionality to put on it's own here.
  // But should be moved if more layout functionality warrants the creation
  // of a Layout module

  const tables = document.querySelectorAll('.tx_Prose table');

  tables.forEach(element => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('ob_Table');
    wrapElement(element,wrapper);
  });
}

ready(initialiseComponentModules);
