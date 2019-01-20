/** Animation module - functions to aid animating page elements */
"use strict";

//////////////////////
// Module Functions //
//////////////////////

/**
 * collapseElement - Collapses an element by setting its height to 0.
 *
 * @param {DOMElement} element - A single DOM element
 */
export function collapseElement(element) {
  // get the height of the element's inner content, regardless of its actual size
  const sectionHeight = element.scrollHeight;
  element.style.height = sectionHeight + "px";

  // temporarily disable all css transitions
  const elementTransition = element.style.transition;
  element.style.transition = '';
  
  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(() => {
    element.style.height = sectionHeight + 'px';
    element.style.transition = elementTransition;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(() => {
      element.style.height = 0 + 'px';
    });
  });
}

/**
 * expandElement - Expands an element with a height of 0 to its natural height by calculating this value.
 *
 * @param {DOMElement} element - A single DOM element
 */
export function expandElement(element) {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;

  // have the element transition to the height of its inner content
  element.style.height = sectionHeight + 'px';

  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener('transitionend', function expansionEnds() {
    // remove this event listener so it only gets triggered once
    element.removeEventListener("transitionend", expansionEnds);
    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = null;
  });
}

export default {
  collapseElement: collapseElement,
  expandElement: expandElement
}