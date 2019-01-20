// Utilities Module
"use strict";

/**
 * Returns the nearest parent element matching the selector, with the option to return the starting element if it matches.
 * source: https://blog.wearecolony.com/a-year-without-jquery/
 * @param   {Element}       el
 * @param   {string}        selector
 * @param   {boolean}       [includeSelf]
 * @return  {Element|null}
 */
export function closestParent(el, selector, includeSelf) {
  let parent = el.parentNode;

  if (includeSelf && el.matches(selector)) {
    return el;
  }

  while (parent && parent !== document.body) {
    if (parent.matches && parent.matches(selector)) {
      return parent;
    } else if (parent.parentNode) {
      parent = parent.parentNode;
    } else {
      return null;
    }
  }

  return null;
}

export function indexOfNode(node) {
  const child = node;
  const parent = child.parentNode;
  // The equivalent of parent.children.indexOf(child)
  const index = Array.prototype.indexOf.call(parent.children, child);  

  return index;
}

/**
 *
 *
 * @export
 * @param {*} htmlString
 * @returns
 */
export function createNodeFromHTML(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

export function wrapElement(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

/**
 * isElementInView - Description
 *
 * @param {object} element Description
 *
 * @returns {boolean} Description
 */
export function isElementInView(element) {
  const windowHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  const elementOffset = element.getBoundingClientRect();
  const elementTop = elementOffset.top;
  const elementHeight = element.offsetHeight;

  if ( elementTop < (scrollTop + windowHeight)  && (elementTop + elementHeight) > scrollTop ) {
    return true;
  } else if ( (elementTop + elementHeight) > scrollTop && (elementTop + elementHeight) < (scrollTop + windowHeight) ) {
    return true;
  } else {
    return false;
  }
}

/**
 * outerWidth - function that returns the width of an element including horizontal margins
 *
 * @param {object} el - Single DOM element
 *
 * @returns {int} calculated outer width of el
 */
export function outerWidth(el) {
  let width = parseInt(el.offsetWidth);
  const style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}

/**
 * outerWidth function that returns the height of an element including vertical margins
 * @param {Element} el
 */

export function outerHeight(el) {
  let height = parseInt(el.offsetHeight);
  const style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

/**
 * Read a page's GET URL query string variables and return them as an associative array.
 * @return  {Array}
 */
export function getURLQueryString() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

/**
 * decodeCharacters - Convert any encoded characters in a string to their unencoded versions - e.g. &amp to &
 *
 * @param {string} text
 *
 * @returns {string}
 */
export function decodeCharacters(text) {
  var elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.value;
}

/**
 * resetStyles - Remove the style attribute from an element
 *
 * @param {type} element Description
 *
 * @returns {type} Description
 */
export function resetStyles(element) {
  element.setAttribute('style', '');
}

/**
 * getOffset - Return an object with the top and left offsets of an element
 *
 * @param {element} el Single DOM element
 *
 * @returns {object} Simple object with left and top properties
 */
export function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

/**
 * ready - Call a function when the page DOM is loaded and complete
 *
 * @param {function} fn Description
 */
export function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export default {
  closestParent: closestParent,
  isElementInView: isElementInView,
  outerWidth: outerWidth,
  outerHeight: outerHeight,
  getURLQueryString: getURLQueryString,
  decodeCharacters: decodeCharacters,
  resetStyles: resetStyles,
  getOffset: getOffset,
  createNodeFromHTML: createNodeFromHTML,
  indexOfNode: indexOfNode,
  wrapElement: wrapElement,
  ready: ready
};
